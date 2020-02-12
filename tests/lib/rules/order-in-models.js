/* eslint eslint-plugin/consistent-output: "off" */

// ------------------------------------------------------------------------------
// Requirements
// ------------------------------------------------------------------------------

const rule = require('../../../lib/rules/order-in-models');
const RuleTester = require('eslint').RuleTester;

// ------------------------------------------------------------------------------
// Tests
// ------------------------------------------------------------------------------

const eslintTester = new RuleTester({
  parserOptions: { ecmaVersion: 6, sourceType: 'module' },
});

eslintTester.run('order-in-models', rule, {
  valid: [
    'export default Model.extend();',
    `export default Model.extend({
        shape: attr("string"),
        behaviors: hasMany("behaviour"),
        test: computed.alias("qwerty"),
        mood: computed("health", "hunger", function() {
        })
      });`,
    `export default Model.extend({
        behaviors: hasMany("behaviour"),
        mood: computed("health", "hunger", function() {
        })
      });`,
    `export default Model.extend({
        mood: computed("health", "hunger", function() {
        })
      });`,
    `export default DS.Model.extend({
        shape: DS.attr("string"),
        behaviors: hasMany("behaviour"),
        mood: computed("health", "hunger", function() {
        })
      });`,
    `export default DS.Model.extend({
        behaviors: hasMany("behaviour"),
        mood: computed("health", "hunger", function() {
        })
      });`,
    `export default DS.Model.extend({
        mood: computed("health", "hunger", function() {
        })
      });`,
    `export default DS.Model.extend(TestMixin, {
        mood: computed("health", "hunger", function() {
        })
      });`,
    `export default DS.Model.extend(TestMixin, TestMixin2, {
        mood: computed("health", "hunger", function() {
        })
      });`,
    `export default DS.Model.extend({
        a: attr("string"),
        b: belongsTo("c", { async: false }),
        convertA(paramA) {
        }
      });`,
    {
      code: `export default DS.Model.extend({
        convertA(paramA) {
        },
        a: attr("string"),
        b: belongsTo("c", { async: false }),
      });`,
      options: [
        {
          order: ['method'],
        },
      ],
    },
    {
      code: `export default DS.Model.extend({
        a: attr('string'),
        convertA(paramA) {
        },
        customProp: { a: 1 }
      });`,
      parserOptions: { ecmaVersion: 6, sourceType: 'module' },
      options: [
        {
          order: ['attribute', 'method', 'custom:customProp'],
        },
      ],
    },
  ],
  invalid: [
    {
      code: `export default Model.extend({
        behaviors: hasMany("behaviour"),
        shape: attr("string"),
        mood: computed("health", "hunger", function() {
        })
      });`,
      errors: [
        {
          message: 'The "shape" attribute should be above the "behaviors" relationship on line 2',
          line: 3,
        },
      ],
    },
    {
      code: `export default Model.extend({
        shape: attr("string"),
        mood: computed("health", "hunger", function() {
        }),
        behaviors: hasMany("behaviour")
      });`,
      errors: [
        {
          message:
            'The "behaviors" relationship should be above the "mood" multi-line function on line 3',
          line: 5,
        },
      ],
    },
    {
      code: `export default Model.extend({
        mood: computed("health", "hunger", function() {
        }),
        shape: attr("string")
      });`,
      errors: [
        {
          message: 'The "shape" attribute should be above the "mood" multi-line function on line 2',
          line: 4,
        },
      ],
    },
    {
      code: `export default DS.Model.extend({
        behaviors: hasMany("behaviour"),
        shape: DS.attr("string"),
        mood: Ember.computed("health", "hunger", function() {
        })
      });`,
      errors: [
        {
          message: 'The "shape" attribute should be above the "behaviors" relationship on line 2',
          line: 3,
        },
      ],
    },
    {
      code: `export default DS.Model.extend({
        shape: attr("string"),
        mood: computed("health", "hunger", function() {
        }),
        behaviors: hasMany("behaviour")
      });`,
      errors: [
        {
          message:
            'The "behaviors" relationship should be above the "mood" multi-line function on line 3',
          line: 5,
        },
      ],
    },
    {
      code: `export default DS.Model.extend({
        mood: computed("health", "hunger", function() {
        }),
        shape: attr("string")
      });`,
      errors: [
        {
          message: 'The "shape" attribute should be above the "mood" multi-line function on line 2',
          line: 4,
        },
      ],
    },
    {
      code: `export default DS.Model.extend({
        mood: computed("health", "hunger", function() {
        }),
        test: computed.alias("qwerty")
      });`,
      errors: [
        {
          message:
            'The "test" single-line function should be above the "mood" multi-line function on line 2',
          line: 4,
        },
      ],
    },
    {
      code: `export default DS.Model.extend(TestMixin, {
        mood: computed("health", "hunger", function() {
        }),
        test: computed.alias("qwerty")
      });`,
      errors: [
        {
          message:
            'The "test" single-line function should be above the "mood" multi-line function on line 2',
          line: 4,
        },
      ],
    },
    {
      code: `export default DS.Model.extend(TestMixin, TestMixin2, {
        mood: computed("health", "hunger", function() {
        }),
        test: computed.alias("qwerty")
      });`,
      errors: [
        {
          message:
            'The "test" single-line function should be above the "mood" multi-line function on line 2',
          line: 4,
        },
      ],
    },
    {
      code: `export default Model.extend({
        behaviors: hasMany("behaviour"),
        shape: attr("string"),
        mood: computed("health", "hunger", function() {
        })
      });`,
      output: `export default Model.extend({
        shape: attr("string"),
        behaviors: hasMany("behaviour"),
        mood: computed("health", "hunger", function() {
        })
      });`,
      errors: [
        {
          message: 'The "shape" attribute should be above the "behaviors" relationship on line 2',
          line: 3,
        },
      ],
    },
    {
      code: `export default DS.Model.extend({
        customProp: { a: 1 },
        aMethod() {
          console.log('not empty');
        }
      });`,
      parserOptions: { ecmaVersion: 6, sourceType: 'module' },
      options: [
        {
          order: ['method', 'custom:customProp'],
        },
      ],
      errors: [
        {
          message:
            'The "aMethod" method should be above the "customProp" custom property on line 2',
          line: 3,
        },
      ],
    },
  ],
});
