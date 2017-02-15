

// ------------------------------------------------------------------------------
// Requirements
// ------------------------------------------------------------------------------

const rule = require('../../../lib/rules/avoid-leaking-state-in-components');
const RuleTester = require('eslint').RuleTester;

// ------------------------------------------------------------------------------
// Tests
// ------------------------------------------------------------------------------

const eslintTester = new RuleTester();
eslintTester.run('avoid-leaking-state-in-components', rule, {
  valid: [
    {
      code: 'export default Component.extend();',
      parserOptions: { ecmaVersion: 6, sourceType: 'module' },
    },
    {
      code: 'export default Component.extend({ someProp: "example", init() { this.set("anotherProp", []) } });',
      parserOptions: { ecmaVersion: 6, sourceType: 'module' },
    },
    {
      code: 'export default Component.extend({ someProp: "example", init() { this.set("anotherProp", {}) } });',
      parserOptions: { ecmaVersion: 6, sourceType: 'module' },
    },
    {
      code: 'export default Component.extend({ someProp: "example", init() { this.set("anotherProp", new Ember.A()) } });',
      parserOptions: { ecmaVersion: 6, sourceType: 'module' },
    },
    {
      code: 'export default Component.extend({ someProp: "example", init() { this.set("anotherProp", new A()) } });',
      parserOptions: { ecmaVersion: 6, sourceType: 'module' },
    },
    {
      code: 'export default Component.extend({ someProp: "example", init() { this.set("anotherProp", new Ember.Object()) } });',
      parserOptions: { ecmaVersion: 6, sourceType: 'module' },
    },
    {
      code: 'export default Component.extend({ someProp: "example", init() { this.set("anotherProp", new Object()) } });',
      parserOptions: { ecmaVersion: 6, sourceType: 'module' },
    },
    {
      code: 'export default Component.extend({ classNames: [], classNameBindings: [], actions: {}, concatenatedProperties: [], mergedProperties: [], positionalParams: [] });',
      parserOptions: { ecmaVersion: 6, sourceType: 'module' },
    },
  ],
  invalid: [
    {
      code: 'export default Component.extend({someProp: []});',
      parserOptions: { ecmaVersion: 6, sourceType: 'module' },
      errors: [{
        message: 'Avoid using arrays as default properties',
      }],
    },
    {
      code: 'export default Component.extend({someProp: new Ember.A()});',
      parserOptions: { ecmaVersion: 6, sourceType: 'module' },
      errors: [{
        message: 'Avoid using arrays as default properties',
      }],
    },
    {
      code: 'export default Component.extend({someProp: new A()});',
      parserOptions: { ecmaVersion: 6, sourceType: 'module' },
      errors: [{
        message: 'Avoid using arrays as default properties',
      }],
    },
    {
      code: 'export default Component.extend({someProp: {}});',
      parserOptions: { ecmaVersion: 6, sourceType: 'module' },
      errors: [{
        message: 'Avoid using objects as default properties',
      }],
    },
    {
      code: 'export default Component.extend({someProp: new Ember.Object()});',
      parserOptions: { ecmaVersion: 6, sourceType: 'module' },
      errors: [{
        message: 'Avoid using objects as default properties',
      }],
    },
    {
      code: 'export default Component.extend({someProp: new Object()});',
      parserOptions: { ecmaVersion: 6, sourceType: 'module' },
      errors: [{
        message: 'Avoid using objects as default properties',
      }],
    },
  ],
});
