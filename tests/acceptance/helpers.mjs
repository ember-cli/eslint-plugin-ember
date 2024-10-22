import { createRequire } from 'node:module';
import { join, dirname } from 'node:path';
// https://github.com/embroider-build/scenario-tester/issues/40
// import { Scenarios } from 'scenario-tester';
// https://github.com/stefanpenner/node-fixturify-project/issues/101
// import { Project } from 'fixturify-project';
const require = createRequire(import.meta.url);
const { Project } = require('fixturify-project');
const { Scenarios } = require('scenario-tester');

const lib = join(import.meta.dirname, '../../package.json');
export const libDir = dirname(require.resolve(lib));
export const fixturesDir = join(import.meta.dirname, './fixtures');

export function withScenario(name) {
  const manifestPath = join(fixturesDir, name, 'package.json');
  const fixturePath = dirname(require.resolve(manifestPath));
  const project = Project.fromDir(fixturePath, { linkDevDeps: true });

  return Scenarios.fromProject(() => project).expand({
    basic: async (project) => {
      project.linkDevDependency('eslint-plugin-ember', {
        baseDir: libDir,
      });
    },
  });
}
