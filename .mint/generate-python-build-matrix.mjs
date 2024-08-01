import fs from 'fs';
import yaml from 'js-yaml';

const MANIFEST_FILE = process.env.MANIFEST_FILE;
const MINT_DYNAMIC_TASKS = process.env.MINT_DYNAMIC_TASKS;

if (!MANIFEST_FILE || !MINT_DYNAMIC_TASKS) {
  console.error('Need MANIFEST_FILE and MINT_DYNAMIC_TASKS');
  process.exit(1);
}

const VERSIONS = [];

for (const line of fs.readFileSync(MANIFEST_FILE, 'utf8').split('\n')) {
  if (line === '') { continue; }

  const parts = line.split(',');

  VERSIONS.push({
    'task-key': parts[0].replaceAll('.', '-'),
    'python-version': parts[0],
    'pip-version': parts[1],
    'setuptools-version': parts[2],
  });
};

const buildMatrixTask = {
  key: 'build-matrix',
  call: '${{ run.mint-dir }}/python-binary-builder.yml',
  init: {
    'python-version': '${{ parallel.python-version }}',
    'pip-version': '${{ parallel.pip-version }}',
    'setuptools-version': '${{ parallel.setuptools-version }}',
  },
  parallel: {
    'tasks-limit': VERSIONS.length,
    key: 'python-${{ parallel.task-key }}',
    values: VERSIONS
  }
}

const knownPythonsTask = {
  key: 'known-pythons',
  run: `
    touch known-pythons.csv
    ${VERSIONS.map((version) => `echo "\${{ tasks.build-matrix.tasks.python-${version['task-key']}.tasks.upload-layer.values.known-python }}\" | tee -a known-pythons.csv`).join('\n')}
  `,
  outputs: {
    artifacts: [
      { key: 'known-pythons', path: 'known-pythons.csv' }
    ]
  }
}

fs.writeFileSync(`${MINT_DYNAMIC_TASKS}/build-matrix.yaml`, yaml.dump(buildMatrixTask));
fs.writeFileSync(`${MINT_DYNAMIC_TASKS}/known-pythons.yaml`, yaml.dump(knownPythonsTask));
