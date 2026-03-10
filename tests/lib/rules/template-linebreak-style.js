//------------------------------------------------------------------------------
// Requirements
//------------------------------------------------------------------------------

const rule = require('../../../lib/rules/template-linebreak-style');
const RuleTester = require('eslint').RuleTester;

//------------------------------------------------------------------------------
// Tests
//------------------------------------------------------------------------------

const ruleTester = new RuleTester({
  parser: require.resolve('ember-eslint-parser'),
  parserOptions: { ecmaVersion: 2022, sourceType: 'module' },
});

ruleTester.run('template-linebreak-style', rule, {
  valid: [
    // default 'unix' — LF only
    '<template>\n<div>test</div>\n</template>',
  ],

  invalid: [
    {
      code: '<template>\r\n<div>test</div>\r\n</template>',
      output: '<template>\n<div>test</div>\n</template>',
      options: ['unix'],
      errors: [{ messageId: 'wrongLinebreak' }, { messageId: 'wrongLinebreak' }],
    },
  ],
});

const hbsRuleTester = new RuleTester({
  parser: require.resolve('ember-eslint-parser/hbs'),
  parserOptions: {
    ecmaVersion: 2022,
    sourceType: 'module',
  },
});

hbsRuleTester.run('template-linebreak-style', rule, {
  valid: [
    // default 'unix' — all LF
    'testing this',
    'testing \n this',
    { code: 'testing\nthis', options: ['unix'] },
    // windows — all CRLF
    { code: 'testing\r\nthis', options: ['windows'] },
    // no linebreaks at all
    'single line no linebreaks',
  ],

  invalid: [
    // default 'unix' — mixed linebreaks, first is LF so CRLF is wrong
    {
      code: 'something\ngoes\r\n',
      output: 'something\ngoes\n',
      options: ['unix'],
      errors: [{ messageId: 'wrongLinebreak' }],
    },
    // unix — CRLF standalone
    {
      code: '\r\n',
      output: '\n',
      options: ['unix'],
      errors: [{ messageId: 'wrongLinebreak' }],
    },
    // unix — CRLF in block mustache
    {
      code: '{{#if test}}\r\n{{/if}}',
      output: '{{#if test}}\n{{/if}}',
      options: ['unix'],
      errors: [{ messageId: 'wrongLinebreak' }],
    },
    // unix — CRLF between mustaches
    {
      code: '{{blah}}\r\n{{blah}}',
      output: '{{blah}}\n{{blah}}',
      options: ['unix'],
      errors: [{ messageId: 'wrongLinebreak' }],
    },
    // unix — CRLF trailing
    {
      code: '{{blah}}\r\n',
      output: '{{blah}}\n',
      options: ['unix'],
      errors: [{ messageId: 'wrongLinebreak' }],
    },
    // unix — CRLF in attribute value
    {
      code: '{{blah arg="\r\n"}}',
      output: '{{blah arg="\n"}}',
      options: ['unix'],
      errors: [{ messageId: 'wrongLinebreak' }],
    },
    // unix — CRLF in element attribute
    {
      code: '<blah arg="\r\n" />',
      output: '<blah arg="\n" />',
      options: ['unix'],
      errors: [{ messageId: 'wrongLinebreak' }],
    },
    // windows — LF is wrong
    {
      code: '\n',
      output: '\r\n',
      options: ['windows'],
      errors: [{ messageId: 'wrongLinebreak' }],
    },
  ],
});
