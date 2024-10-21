const { copyFixture } = require('../../helpers/fixtures');

describe('acceptance | flat-config | gjs', () => {
  it('lints gjs without error', async () => {
    const project = await copyFixture('plain-gjs');

    const lint = await project.lint();
    expect(lint.exitCode).toBe(0);

    const lintFix = await project.lint();
    expect(lintFix.exitCode).toBe(0);
  });
});
