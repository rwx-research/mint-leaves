import { glob } from "glob";
import fs from "fs/promises";
import path from "path";
import yaml from "yaml";

const BUILD_DIR = process.env.BUILD_DIR;
const GIT_DIFF_FILE = process.env.GIT_DIFF_FILE;
const MINT_DYNAMIC_TASKS = process.env.MINT_DYNAMIC_TASKS;

if (!BUILD_DIR || !GIT_DIFF_FILE || !MINT_DYNAMIC_TASKS) {
  console.error("Must set BUILD_DIR and GIT_DIFF_FILE and MINT_DYNAMIC_TASKS");
  process.exit(1);
}

let leaves = [];
const leafDirs = new Set();
const leavesToBuild = new Set();

async function exists(pathname) {
  try {
    await fs.stat(pathname);
    return true;
  } catch {
    return false;
  }
}

for (const file of (await glob("*/*/mint-leaf.yml")).sort()) {
  const name = path.dirname(file);
  const key = name.replace("/", "-");
  let buildDependencies = [];
  if (await exists(path.join(name, "build/dependencies.yml"))) {
    buildDependencies = yaml.parse(await fs.readFile(path.join(name, "build/dependencies.yml"), { encoding: "utf8" }));
  }

  leaves.push({
    name,
    key,
    dir: name,
    artifactFile: `${BUILD_DIR}/${key}.yml`,
    buildDependencies,
  });
  leafDirs.add(name);
}

let buildAll = false;

for (const line of (await fs.readFile(GIT_DIFF_FILE, "utf8")).split("\n")) {
  if (line === "") {
    continue;
  }

  const foundNonLeafFile = () => {
    console.log(`Found non-leaf file in diff: ${line}`);
    buildAll = true;
  };

  if (line.split("/").length >= 2) {
    const leafName = line.split("/").slice(0, 2).join("/");
    if (leafDirs.has(leafName)) {
      leavesToBuild.add(leafName);
    } else {
      foundNonLeafFile();
      break;
    }
  } else {
    foundNonLeafFile();
    break;
  }
}

if (buildAll) {
  console.log("Building all leaves");
} else {
  console.log("Only building leaves with changes:");
  leavesToBuild.forEach((leaf) => console.log(leaf));

  leaves = leaves.filter((leaf) => leavesToBuild.has(leaf.name));
}

const generateLeafRun = (leaf) => {
  return {
    tasks: [
      {
        key: "packages",
        run: `
          sudo apt-get update
          sudo apt-get install gettext-base jq zip
          sudo apt-get clean
        `,
      },
      {
        key: "code",
        call: "mint/git-clone 1.2.5",
        with: {
          "preserve-git-dir": true,
          repository: "https://github.com/rwx-research/mint-leaves.git",
          ref: "${{ init.sha }}",
        },
      },
      {
        key: "timestamp",
        use: "code",
        run: `
          latest_timestamp=$(git ls-files -z ${leaf.dir} | xargs -0 -n1 -I{} -- git log -1 --date=format:"%Y%m%d%H%M" --format="%ad" {} | sort | tail -n 1)
          echo -n "$latest_timestamp" | tee $MINT_VALUES/timestamp
        `,
      },
      ...leaf.buildDependencies,
      {
        key: "build",
        use: ["packages", "code", ...leaf.buildDependencies.map((dep) => dep.key)],
        filter: [leaf.dir],
        run: `
          cd ${leaf.dir}
          if [[ -f build/run.sh ]]; then
            echo "Running leaf build script"
            ./build/run.sh
          else
            echo "Leaf has no build script"
          fi
        `,
      },
      {
        key: "zip",
        use: "build",
        filter: [leaf.dir],
        run: `
          timestamp="\${{ tasks.timestamp.values.timestamp }}"
          echo "Setting timestamp on files to $timestamp"
          find ${leaf.dir} -exec touch -t "$timestamp" {} \\;
          cd ${leaf.dir} && zip -X -r ../../${leaf.key}.zip .
        `,
      },
      {
        key: "upload",
        use: "zip",
        filter: [`${leaf.key}.zip`, `${leaf.dir}/mint-ci-cd.template.yml`, "publish-tasks.template.yml"],
        env: {
          RWX_ACCESS_TOKEN: {
            "cache-key": "excluded",
            value: "${{ vaults.mint_leaves_development.secrets.RWX_ACCESS_TOKEN }}",
          },
        },
        run: `
          curl \
            --request POST \
            --fail-with-body \
            --header "Authorization: Bearer $RWX_ACCESS_TOKEN" \
            --header 'Accept: application/json' \
            -F 'file=@${leaf.key}.zip' \
            https://cloud.rwx.com/mint/api/leaves | tee leaves-result.json

          export LEAF_DIGEST=$(cat leaves-result.json | jq -r '.digest')
          echo -n "$LEAF_DIGEST" > $MINT_VALUES/leaf-digest

          envsubst '$LEAF_DIGEST' < ${leaf.dir}/mint-ci-cd.template.yml | tee $MINT_DYNAMIC_TASKS/${leaf.key}.yml

          export LEAF_TEST_TASKS=$(grep '^- key: ' $MINT_DYNAMIC_TASKS/${leaf.key}.yml | awk '{print $3}' | paste -s -d ',' -)

          envsubst '$LEAF_TEST_TASKS' < publish-tasks.template.yml | tee -a $MINT_DYNAMIC_TASKS/${leaf.key}.yml
        `,
      },
    ],
  };
};

const artifacts = [];
const leafRuns = [];

for (const leaf of leaves) {
  const content = yaml.stringify(generateLeafRun(leaf));
  await fs.writeFile(leaf.artifactFile, content, "utf8");

  leafRuns.push({
    key: leaf.key,
    call: `\${{ tasks.generate-leaf-runs.artifacts.${leaf.key} }}`,
    init: {
      "publish-leaves": "${{ init.publish-leaves }}",
      sha: "${{ init.sha }}",
    },
  });

  artifacts.push({
    key: leaf.key,
    path: leaf.artifactFile,
  });
}

await fs.writeFile(`${BUILD_DIR}/leaf-runs.yaml`, yaml.stringify(leafRuns));

// this is needed since artifacts cannot otherwise be declared dynamically
const generateTask = {
  key: "generate-leaf-runs",
  use: "build-leaf-runs",
  run: `
    ${artifacts.map((a) => `touch ${a.path}`).join("\n")}
    cp ${BUILD_DIR}/leaf-runs.yaml $MINT_DYNAMIC_TASKS
  `,
  outputs: { artifacts },
};

await fs.writeFile(`${MINT_DYNAMIC_TASKS}/generate-task.yaml`, yaml.stringify([generateTask]));
