import { describe, it } from 'vitest';
import { withScenario } from '../helpers.mjs';

describe('Acceptance | flat-config', () => {
  withScenario('plain-gjs').forEachScenario((scenario) => {
    describe(scenario.name, () => {
      it('lints gjs without error', async () => {
        console.log({ scenario });
        let project = await scenario.prepare();

        await project.execute('pnpm install');

        const lint = await project.execute(`pnpm eslint .`);
        expect(lint.exitCode).toBe(0);

        const lintFix = await project.execute(`pnpm eslint . --fix`);
        expect(lintFix.exitCode).toBe(0);
      });
    });
  });
});
