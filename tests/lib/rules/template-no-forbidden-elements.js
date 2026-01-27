const rule = require('../../../lib/rules/template-no-forbidden-elements');
const RuleTester = require('eslint').RuleTester;
const ruleTester = new RuleTester({
  parser: require.resolve('ember-eslint-parser'),
  parserOptions: { ecmaVersion: 2022, sourceType: 'module' },
});
ruleTester.run('template-no-forbidden-elements', rule, {
  valid: [
    { code: '<template><div></div></template>', options: [['script']] },
  ],
  invalid: [
    { code: '<template><script></script></template>', options: [['script']], errors: [{ messageId: 'forbidden' }] },
  ],
});
