const rule = require('../../../lib/rules/template-no-mut-helper');
const RuleTester = require('eslint').RuleTester;

const ruleTester = new RuleTester({
  parser: require.resolve('ember-eslint-parser'),
  parserOptions: { ecmaVersion: 2022, sourceType: 'module' },
});

ruleTester.run('template-no-mut-helper', rule, {
  valid: [
    '<template><MyComponent @toggled={{this.showAggregatedLine}} /></template>',
    '<template><MyComponent @value={{this.value}} /></template>',
    '<template><input value={{this.text}} /></template>',
    '<template><div></div></template>',
    '<template><MyComponent @toggle={{set this "isDropdownOpen"}} /></template>',
  ],
  invalid: [
    // SubExpression form: (mut x)
    {
      code: '<template>{{my-component onChange=(mut this.value)}}</template>',
      output: null,
      errors: [{ messageId: 'unexpected', type: 'GlimmerSubExpression' }],
    },
    {
      code: '<template>{{input value=(mut this.text)}}</template>',
      output: null,
      errors: [{ messageId: 'unexpected', type: 'GlimmerSubExpression' }],
    },
    {
      code: '<template><MyComponent @onVisibilityChange={{fn (mut this.isDropdownOpen)}} /></template>',
      output: null,
      errors: [{ messageId: 'unexpected', type: 'GlimmerSubExpression' }],
    },
    // MustacheStatement form: {{mut x}}
    {
      code: '<template><MyComponent @toggled={{mut this.showAggregatedLine}} /></template>',
      output: null,
      errors: [{ messageId: 'unexpected', type: 'GlimmerMustacheStatement' }],
    },
    // setterAlternative config
    {
      code: '<template><MyComponent @toggled={{mut this.showAggregatedLine}} /></template>',
      output: null,
      options: [{ setterAlternative: '`{{set}}`' }],
      errors: [{ messageId: 'unexpectedWithAlternative', type: 'GlimmerMustacheStatement' }],
    },
  ],
});

const hbsRuleTester = new RuleTester({
  parser: require.resolve('ember-eslint-parser/hbs'),
  parserOptions: { ecmaVersion: 2022, sourceType: 'module' },
});

hbsRuleTester.run('template-no-mut-helper', rule, {
  valid: [
    '<MyComponent @toggled={{this.showAggregatedLine}}/>',
    '<MyComponent @toggle={{set this "isDropdownOpen"}}/>',
    '<MyComponent @onFocusOut={{action "onFocusOutKeySkillsInput" value="target.value"}}/>',
    '{{my-component value=this.secondaryProfileHeadline}}',
  ],
  invalid: [
    // MustacheStatement: {{mut x}}
    {
      code: '<MyComponent @toggled={{mut this.showAggregatedLine}}/>',
      output: null,
      errors: [{ messageId: 'unexpected', type: 'GlimmerMustacheStatement' }],
    },
    // SubExpression: (mut x)
    {
      code: '{{my-component value=(mut this.secondaryProfileHeadline)}}',
      output: null,
      errors: [{ messageId: 'unexpected', type: 'GlimmerSubExpression' }],
    },
    {
      code: '<MyComponent {{action (mut this.isDropdownOpen) false}}/>',
      output: null,
      errors: [{ messageId: 'unexpected', type: 'GlimmerSubExpression' }],
    },
    {
      code: '<MyComponent @onVisibilityChange={{fn (mut this.isDropdownOpen)}}/>',
      output: null,
      errors: [{ messageId: 'unexpected', type: 'GlimmerSubExpression' }],
    },
    {
      code: '{{my-component onVisibilityChange=(action (mut this.isDropdownOpen))}}',
      output: null,
      errors: [{ messageId: 'unexpected', type: 'GlimmerSubExpression' }],
    },
    // setterAlternative config
    {
      code: '<MyComponent onchange={{action (mut this.description) value="target.value"}}/>',
      output: null,
      options: [{ setterAlternative: '`{{set}}`' }],
      errors: [{ messageId: 'unexpectedWithAlternative', type: 'GlimmerSubExpression' }],
    },
  ],
});
