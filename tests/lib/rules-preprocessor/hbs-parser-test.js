'use strict';

const { ESLint } = require('eslint');
const plugin = require('../../../lib');

const hbsParser = require.resolve('ember-eslint-parser/hbs');

function initHbsESLint() {
  return new ESLint({
    ignore: false,
    useEslintrc: false,
    plugins: { ember: plugin },
    overrideConfig: {
      root: true,
      parserOptions: {
        ecmaVersion: 2022,
        sourceType: 'module',
      },
      plugins: ['ember'],
      overrides: [
        {
          files: ['**/*.hbs'],
          parser: hbsParser,
          processor: 'ember/template-lint-disable',
          rules: {
            'ember/template-no-bare-strings': 'error',
          },
        },
      ],
    },
  });
}

describe('supports template-lint-disable directive in hbs files', () => {
  it('disables all rules on the next line with mustache comment', async () => {
    const eslint = initHbsESLint();
    const code = `<div>
  {{! template-lint-disable }}
  Hello world
</div>`;
    const results = await eslint.lintText(code, { filePath: 'my-template.hbs' });
    const resultErrors = results.flatMap((result) => result.messages);
    expect(resultErrors).toHaveLength(0);
  });

  it('disables all rules on the next line with mustache block comment', async () => {
    const eslint = initHbsESLint();
    const code = `<div>
  {{!-- template-lint-disable --}}
  Hello world
</div>`;
    const results = await eslint.lintText(code, { filePath: 'my-template.hbs' });
    const resultErrors = results.flatMap((result) => result.messages);
    expect(resultErrors).toHaveLength(0);
  });

  it('only disables the next line, not subsequent lines', async () => {
    const eslint = initHbsESLint();
    const code = `{{! template-lint-disable }}
<div>Hello world</div>
<div>Bare string here too</div>`;
    const results = await eslint.lintText(code, { filePath: 'my-template.hbs' });
    const resultErrors = results.flatMap((result) => result.messages);
    // Line 2 "Hello world" suppressed, but line 3 "Bare string here too" should still error
    expect(resultErrors).toHaveLength(1);
    expect(resultErrors[0].line).toBe(3);
  });

  it('disables a specific rule by name', async () => {
    const eslint = initHbsESLint();
    const code = `<div>
  {{! template-lint-disable ember/template-no-bare-strings }}
  Hello world
</div>`;
    const results = await eslint.lintText(code, { filePath: 'my-template.hbs' });
    const resultErrors = results.flatMap((result) => result.messages);
    expect(resultErrors).toHaveLength(0);
  });

  it('supports template-lint rule name format (maps to ember/ prefix)', async () => {
    const eslint = initHbsESLint();
    const code = `<div>
  {{! template-lint-disable no-bare-strings }}
  Hello world
</div>`;
    const results = await eslint.lintText(code, { filePath: 'my-template.hbs' });
    const resultErrors = results.flatMap((result) => result.messages);
    expect(resultErrors).toHaveLength(0);
  });

  it('does not suppress unrelated rules when a specific rule is named', async () => {
    const eslint = initHbsESLint();
    const code = `<div>
  {{! template-lint-disable ember/template-no-html-comments }}
  Hello world
</div>`;
    const results = await eslint.lintText(code, { filePath: 'my-template.hbs' });
    const resultErrors = results.flatMap((result) => result.messages);
    // no-bare-strings should still fire since we only disabled no-html-comments
    expect(resultErrors).toHaveLength(1);
    expect(resultErrors[0].ruleId).toBe('ember/template-no-bare-strings');
  });

  it('works with multiple disable comments in the same file', async () => {
    const eslint = initHbsESLint();
    const code = `<div>
  {{! template-lint-disable }}
  Hello world
  {{! template-lint-disable }}
  Another bare string
</div>`;
    const results = await eslint.lintText(code, { filePath: 'my-template.hbs' });
    const resultErrors = results.flatMap((result) => result.messages);
    expect(resultErrors).toHaveLength(0);
  });

  it('bare strings without disable comment still trigger errors', async () => {
    const eslint = initHbsESLint();
    const code = `<div>
  Hello world
</div>`;
    const results = await eslint.lintText(code, { filePath: 'my-template.hbs' });
    const resultErrors = results.flatMap((result) => result.messages);
    expect(resultErrors).toHaveLength(1);
    expect(resultErrors[0].ruleId).toBe('ember/template-no-bare-strings');
    // Verify error message is not corrupted with gjs/gts setup instructions
    expect(resultErrors[0].message).not.toContain('To lint Gjs/Gts files');
  });

  it('suppresses errors on the comment line itself (like eslint-disable-line)', async () => {
    const eslint = initHbsESLint();
    const code = `Hello {{! template-lint-disable }}`;
    const results = await eslint.lintText(code, { filePath: 'my-template.hbs' });
    const resultErrors = results.flatMap((result) => result.messages);
    // "Hello" is on the same line as the disable comment — suppressed
    expect(resultErrors).toHaveLength(0);
  });

  it('supports @-scoped plugin rule names', async () => {
    const eslint = initHbsESLint();
    const code = `<div>
  {{! template-lint-disable @ember/template-no-bare-strings }}
  Hello world
</div>`;
    const results = await eslint.lintText(code, { filePath: 'my-template.hbs' });
    const resultErrors = results.flatMap((result) => result.messages);
    // @ember/template-no-bare-strings won't match ember/template-no-bare-strings,
    // so the error should still fire (tests that @ is parsed, not swallowed)
    expect(resultErrors).toHaveLength(1);
    expect(resultErrors[0].ruleId).toBe('ember/template-no-bare-strings');
  });
});
