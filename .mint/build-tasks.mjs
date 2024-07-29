import { glob } from 'glob';
import fs from 'fs';
import path from 'path';
import yaml from 'js-yaml';

const BUILD_DIR = process.env.BUILD_DIR;
const MINT_DYNAMIC_TASKS = process.env.MINT_DYNAMIC_TASKS;

if (!BUILD_DIR || !MINT_DYNAMIC_TASKS) {
  console.error('Must set BUILD_DIR and MINT_DYNAMIC_TASKS');
  process.exit(1);
}

const leaves = [];

(await glob('*/*/mint-leaf.yml')).sort().forEach((file) => {
  const name = path.dirname(file);
  const key = name.replace('/', '-');
  leaves.push({name, key, dir: name, artifactFile: `${BUILD_DIR}/${key}.yml`});
});

const generateLeafRun = ((leaf) => {
  return {
    tasks: [
      {
        key: 'packages',
        run: `
          sudo apt-get update
          sudo apt-get install gettext-base jq zip
          sudo apt-get clean
        `,
      },
      {
        key: 'code',
        call: 'mint/git-clone 1.2.5',
        with: {
          'preserve-git-dir': true,
          repository: 'https://github.com/rwx-research/mint-leaves.git',
          ref: '${{ init.sha }}',
        }
      },
      {
        key: 'timestamp',
        use: 'code',
        run: `
          latest_timestamp=$(git ls-files -z ${leaf.dir} | xargs -0 -n1 -I{} -- git log -1 --date=format:"%Y%m%d%H%M" --format="%ad" {} | sort | tail -n 1)
          echo -n "$latest_timestamp" | tee $MINT_VALUES/timestamp
        `
      },
      {
        key: 'build',
        use: ['packages', 'code'],
        filter: [`${leaf.dir}/**/*`],
        run: `
          timestamp="\${{ tasks.timestamp.values.timestamp }}"
          echo "Setting timestamp on files to $timestamp"
          find ${leaf.dir} -exec touch -t "$timestamp" {} \\;
          cd ${leaf.dir} && zip -X -r ../../${leaf.key}.zip .
        `
      },
      {
        key: 'upload',
        use: 'build',
        filter: [`${leaf.key}.zip`, `${leaf.dir}/mint-ci-cd.template.yml`, 'publish-tasks.template.yml'],
        env: {
          RWX_ACCESS_TOKEN: {
            'cache-key': 'excluded',
            value: '${{ vaults.mint_leaves_development.secrets.RWX_ACCESS_TOKEN }}',
          }
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

          export LEAF_TEST_TASKS=$(grep ' key: ' $MINT_DYNAMIC_TASKS/${leaf.key}.yml | awk '{print $3}' | paste -s -d ',' -)

          envsubst '$LEAF_TEST_TASKS' < publish-tasks.template.yml | tee -a $MINT_DYNAMIC_TASKS/${leaf.key}.yml
        `
      },
    ]
  };
});

const artifacts = [];
const leafRuns = [];

leaves.forEach((leaf) => {
  const content = yaml.dump(generateLeafRun(leaf));
  fs.writeFileSync(leaf.artifactFile, content, 'utf8');

  leafRuns.push({
    key: leaf.key,
    call: `\${{ tasks.generate-leaf-runs.artifacts.${leaf.key} }}`,
    init: {
      'publish-leaves': '${{ init.publish-leaves }}',
      sha: '${{ init.sha }}',
    }
  });

  artifacts.push({
    key: leaf.key,
    path: leaf.artifactFile,
  });
});

fs.writeFileSync(`${BUILD_DIR}/leaf-runs.yaml`, yaml.dump(leafRuns));

// this is needed since artifacts cannot otherwise be declared dynamically
const generateTask = {
  key: 'generate-leaf-runs',
  use: 'build-leaf-runs',
  run: `
    ${artifacts.map((a) => `touch ${a.path}`).join('\n')}
    cp ${BUILD_DIR}/leaf-runs.yaml $MINT_DYNAMIC_TASKS
  `,
  outputs: { artifacts }
};

fs.writeFileSync(`${MINT_DYNAMIC_TASKS}/generate-task.yaml`, yaml.dump([generateTask]));
