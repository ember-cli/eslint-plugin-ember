const path = require('path');
const assert = require('assert');
const tmp = require('tmp-promise');
const fs = require('fs');

const fixturesDir = path.join(__dirname, '../acceptance/fixtures');
const allFixtures = fs.readdirSync(fixturesDir);

async function resolveFixture(fixtureName) {
  assert(fixtureName, 'Must pass a fixture name');
  const fixturePath = path.join(fixturesDir, fixtureName);

  assert(
    fixturesDir.includes(fixtureName),
    `Fixture, ${fixtureName}, not found. Available fixtures: ${allFixtures.join(', ')}`
  );

  return fixturePath;
}

module.exports = {
  async copyFixture(fixtureName) {
    const fixturePath = await resolveFixture(fixtureName);

    return new Project(tmpDir);
  },
};

class Project {
  constructor(dir) {
    this.dir = dir;
  }

  lint = async () => {
    const { $ } = await import('execa');
    const { exitCode } = await $({ cwd: this.dir })`pnpm eslint .`;

    return { exitCode };
  };

  lintFix = async () => {
    const { $ } = await import('execa');
    const { exitCode } = await $({ cwd: this.dir })`pnpm eslint --fix .`;

    return { exitCode };
  };
}
