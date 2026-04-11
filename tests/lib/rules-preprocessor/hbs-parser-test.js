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

  it('suppresses errors on the comment line itself', async () => {
    const eslint = initHbsESLint();
    const code = 'Hello {{! template-lint-disable }}';
    const results = await eslint.lintText(code, { filePath: 'my-template.hbs' });
    const resultErrors = results.flatMap((result) => result.messages);
    // "Hello" is on the same line as the disable comment — suppressed
    expect(resultErrors).toHaveLength(0);
  });

  it('does not match template-lint-disable-next-line (different directive)', async () => {
    const eslint = initHbsESLint();
    const code = `<div>
  {{! template-lint-disable-next-line }}
  Hello world
</div>`;
    const results = await eslint.lintText(code, { filePath: 'my-template.hbs' });
    const resultErrors = results.flatMap((result) => result.messages);
    // template-lint-disable-next-line is NOT a recognized directive — error should fire
    expect(resultErrors).toHaveLength(1);
    expect(resultErrors[0].ruleId).toBe('ember/template-no-bare-strings');
  });

  it('matches template-no-bare-strings middle form (ember/ prefix mapping)', async () => {
    const eslint = initHbsESLint();
    const code = `<div>
  {{! template-lint-disable template-no-bare-strings }}
  Hello world
</div>`;
    const results = await eslint.lintText(code, { filePath: 'my-template.hbs' });
    const resultErrors = results.flatMap((result) => result.messages);
    expect(resultErrors).toHaveLength(0);
  });

  it('eslint-disable-next-line works in hbs templates', async () => {
    const eslint = initHbsESLint();
    const code = `<div>
  {{! eslint-disable-next-line ember/template-no-bare-strings }}
  <span>Hello world</span>
  <span>Still bare</span>
</div>`;
    const results = await eslint.lintText(code, { filePath: 'my-template.hbs' });
    const resultErrors = results.flatMap((result) => result.messages);
    // "Hello world" on the next line is suppressed, "Still bare" still errors
    expect(resultErrors).toHaveLength(1);
    expect(resultErrors[0].ruleId).toBe('ember/template-no-bare-strings');
    expect(resultErrors[0].line).toBe(4);
  });

  it('eslint-disable/eslint-enable ranges work in hbs templates', async () => {
    const eslint = initHbsESLint();
    const code = `{{! eslint-disable ember/template-no-bare-strings }}
Hello world
Another bare string
{{! eslint-enable ember/template-no-bare-strings }}
This should error`;
    const results = await eslint.lintText(code, { filePath: 'my-template.hbs' });
    const resultErrors = results.flatMap((result) => result.messages);
    // Lines 2-3 are inside the eslint-disable range — suppressed
    // "This should error" after eslint-enable triggers the rule
    expect(resultErrors).toHaveLength(1);
    expect(resultErrors[0].ruleId).toBe('ember/template-no-bare-strings');
  });

  it('parses @-scoped rule names without breaking the regex', async () => {
    const eslint = initHbsESLint();
    const code = `<div>
  {{! template-lint-disable @ember/template-no-bare-strings }}
  Hello world
</div>`;
    const results = await eslint.lintText(code, { filePath: 'my-template.hbs' });
    const resultErrors = results.flatMap((result) => result.messages);
    // @ember/template-no-bare-strings won't match ruleId ember/template-no-bare-strings
    // (different string), so the error still fires — this tests that @ is accepted
    // by the regex without breaking parsing
    expect(resultErrors).toHaveLength(1);
    expect(resultErrors[0].ruleId).toBe('ember/template-no-bare-strings');
  });
});
