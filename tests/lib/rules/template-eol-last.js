//------------------------------------------------------------------------------
// Requirements
//------------------------------------------------------------------------------

const editorConfigUtil = require('../../../lib/utils/editorconfig');
const rule = require('../../../lib/rules/template-eol-last');
const RuleTester = require('eslint').RuleTester;

//------------------------------------------------------------------------------
// Tests
//
// All tests are wrapped in a describe so beforeAll/afterAll can install a spy
// on editorConfigUtil.resolveEditorConfig before any rule invocation. This
// prevents the project's own .editorconfig from influencing test outcomes when
// the 'editorconfig' option is used.
//------------------------------------------------------------------------------

describe('template-eol-last', () => {
  beforeAll(() => {
    vi.spyOn(editorConfigUtil, 'resolveEditorConfig').mockReturnValue({});
  });

  afterAll(() => {
    vi.restoreAllMocks();
  });

  const ruleTester = new RuleTester({
    parser: require.resolve('ember-eslint-parser'),
    parserOptions: { ecmaVersion: 2022, sourceType: 'module' },
  });

  ruleTester.run('template-eol-last', rule, {
    valid: [
      // In gjs/gts mode, eol-last is a no-op (file-level eol-last is handled by eslint core)
      `<template>
<div>test</div>
</template>`,
      '<template><div>test</div></template>',
    ],

    invalid: [],
  });

  const hbsRuleTester = new RuleTester({
    parser: require.resolve('ember-eslint-parser/hbs'),
    parserOptions: {
      ecmaVersion: 2022,
      sourceType: 'module',
    },
  });

  hbsRuleTester.run('template-eol-last', rule, {
    valid: [
      // default 'always' — ends with newline
      'test\n',
      '<img>\n',
      '<div>test</div>\n',
      '{{#my-component}}\n  test\n{{/my-component}}\n',
      // config 'never' — does not end with newline
      { code: 'test', options: ['never'] },
      { code: '<img>', options: ['never'] },
      { code: '<div>test</div>', options: ['never'] },
      { code: '{{#my-component}}\n  test\n{{/my-component}}', options: ['never'] },
    ],

    invalid: [
      // default 'always' — missing newline
      {
        code: 'test',
        output: 'test\n',
        options: ['always'],
        errors: [{ messageId: 'mustEnd' }],
      },
      {
        code: '<img>',
        output: '<img>\n',
        options: ['always'],
        errors: [{ messageId: 'mustEnd' }],
      },
      {
        code: '<div>test</div>',
        output: '<div>test</div>\n',
        options: ['always'],
        errors: [{ messageId: 'mustEnd' }],
      },
      // config 'never' — has trailing newline
      {
        code: 'test\n',
        output: 'test',
        options: ['never'],
        errors: [{ messageId: 'mustNotEnd' }],
      },
      {
        code: '<img>\n',
        output: '<img>',
        options: ['never'],
        errors: [{ messageId: 'mustNotEnd' }],
      },
      {
        code: '{{#my-component}}\n  test\n{{/my-component}}\n',
        output: '{{#my-component}}\n  test\n{{/my-component}}',
        options: ['never'],
        errors: [{ messageId: 'mustNotEnd' }],
      },
    ],
  });

  //------------------------------------------------------------------------------
  // EditorConfig integration tests
  //------------------------------------------------------------------------------

  describe('editorconfig option', () => {
    const hbsRuleTesterEditorConfig = new RuleTester({
      parser: require.resolve('ember-eslint-parser/hbs'),
      parserOptions: { ecmaVersion: 2022, sourceType: 'module' },
    });

    afterEach(() => {
      editorConfigUtil.resolveEditorConfig.mockReturnValue({});
    });

    describe('insert_final_newline: true behaves like always', () => {
      beforeEach(() => {
        editorConfigUtil.resolveEditorConfig.mockReturnValue({ insert_final_newline: true });
      });

      hbsRuleTesterEditorConfig.run('template-eol-last', rule, {
        valid: [{ code: 'test\n', options: ['editorconfig'] }],
        invalid: [
          {
            code: 'test',
            output: 'test\n',
            options: ['editorconfig'],
            errors: [{ messageId: 'mustEnd' }],
          },
        ],
      });
    });

    describe('insert_final_newline: false behaves like never', () => {
      beforeEach(() => {
        editorConfigUtil.resolveEditorConfig.mockReturnValue({ insert_final_newline: false });
      });

      hbsRuleTesterEditorConfig.run('template-eol-last', rule, {
        valid: [{ code: 'test', options: ['editorconfig'] }],
        invalid: [
          {
            code: 'test\n',
            output: 'test',
            options: ['editorconfig'],
            errors: [{ messageId: 'mustNotEnd' }],
          },
        ],
      });
    });
  });
});
