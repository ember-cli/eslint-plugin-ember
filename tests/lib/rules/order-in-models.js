// ------------------------------------------------------------------------------
// Requirements
// ------------------------------------------------------------------------------

const rule = require('../../../lib/rules/order-in-models');
const RuleTester = require('eslint').RuleTester;

// ------------------------------------------------------------------------------
// Tests
// ------------------------------------------------------------------------------

const eslintTester = new RuleTester();
eslintTester.run('order-in-models', rule, {
  valid: [
    {
      code: 'export default Model.extend();',
      parserOptions: { ecmaVersion: 6, sourceType: 'module' },
    },
    {
      code: `export default Model.extend({
        shape: attr("string"),
        behaviors: hasMany("behaviour"),
        test: computed.alias("qwerty"),
        mood: computed("health", "hunger", function() {
        })
      });`,
      parserOptions: { ecmaVersion: 6, sourceType: 'module' },
    },
    {
      code: `export default Model.extend({
        behaviors: hasMany("behaviour"),
        mood: computed("health", "hunger", function() {
        })
      });`,
      parserOptions: { ecmaVersion: 6, sourceType: 'module' },
    },
    {
      code: `export default Model.extend({
        mood: computed("health", "hunger", function() {
        })
      });`,
      parserOptions: { ecmaVersion: 6, sourceType: 'module' },
    },
    {
      code: `export default DS.Model.extend({
        shape: DS.attr("string"),
        behaviors: hasMany("behaviour"),
        mood: computed("health", "hunger", function() {
        })
      });`,
      parserOptions: { ecmaVersion: 6, sourceType: 'module' },
    },
    {
      code: `export default DS.Model.extend({
        behaviors: hasMany("behaviour"),
        mood: computed("health", "hunger", function() {
        })
      });`,
      parserOptions: { ecmaVersion: 6, sourceType: 'module' },
    },
    {
      code: `export default DS.Model.extend({
        mood: computed("health", "hunger", function() {
        })
      });`,
      parserOptions: { ecmaVersion: 6, sourceType: 'module' },
    },
    {
      code: `export default DS.Model.extend(TestMixin, {
        mood: computed("health", "hunger", function() {
        })
      });`,
      parserOptions: { ecmaVersion: 6, sourceType: 'module' },
    },
    {
      code: `export default DS.Model.extend(TestMixin, TestMixin2, {
        mood: computed("health", "hunger", function() {
        })
      });`,
      parserOptions: { ecmaVersion: 6, sourceType: 'module' },
    },
    {
      code: `export default DS.Model.extend({
        a: attr("string"),
        b: belongsTo("c", { async: false }),
        convertA(paramA) {
        }
      });`,
      parserOptions: { ecmaVersion: 6, sourceType: 'module' },
    },
    {
      code: `export default DS.Model.extend({
        convertA(paramA) {
        },
        a: attr("string"),
        b: belongsTo("c", { async: false }),
      });`,
      parserOptions: { ecmaVersion: 6, sourceType: 'module' },
      options: [{
        order: [
          'method',
        ],
      }],
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
      parserOptions: { ecmaVersion: 6, sourceType: 'module' },
      errors: [{
        message: 'The "shape" attribute should be above the "behaviors" relationship on line 2',
        line: 3,
      }],
    },
    {
      code: `export default Model.extend({
        shape: attr("string"),
        mood: computed("health", "hunger", function() {
        }),
        behaviors: hasMany("behaviour")
      });`,
      parserOptions: { ecmaVersion: 6, sourceType: 'module' },
      errors: [{
        message: 'The "behaviors" relationship should be above the "mood" multi-line function on line 3',
        line: 5,
      }],
    },
    {
      code: `export default Model.extend({
        mood: computed("health", "hunger", function() {
        }),
        shape: attr("string")
      });`,
      parserOptions: { ecmaVersion: 6, sourceType: 'module' },
      errors: [{
        message: 'The "shape" attribute should be above the "mood" multi-line function on line 2',
        line: 4,
      }],
    },
    {
      code: `export default DS.Model.extend({
        behaviors: hasMany("behaviour"),
        shape: DS.attr("string"),
        mood: Ember.computed("health", "hunger", function() {
        })
      });`,
      parserOptions: { ecmaVersion: 6, sourceType: 'module' },
      errors: [{
        message: 'The "shape" attribute should be above the "behaviors" relationship on line 2',
        line: 3,
      }],
    },
    {
      code: `export default DS.Model.extend({
        shape: attr("string"),
        mood: computed("health", "hunger", function() {
        }),
        behaviors: hasMany("behaviour")
      });`,
      parserOptions: { ecmaVersion: 6, sourceType: 'module' },
      errors: [{
        message: 'The "behaviors" relationship should be above the "mood" multi-line function on line 3',
        line: 5,
      }],
    },
    {
      code: `export default DS.Model.extend({
        mood: computed("health", "hunger", function() {
        }),
        shape: attr("string")
      });`,
      parserOptions: { ecmaVersion: 6, sourceType: 'module' },
      errors: [{
        message: 'The "shape" attribute should be above the "mood" multi-line function on line 2',
        line: 4,
      }],
    },
    {
      code: `export default DS.Model.extend({
        mood: computed("health", "hunger", function() {
        }),
        test: computed.alias("qwerty")
      });`,
      parserOptions: { ecmaVersion: 6, sourceType: 'module' },
      errors: [{
        message: 'The "test" single-line function should be above the "mood" multi-line function on line 2',
        line: 4,
      }],
    },
    {
      code: `export default DS.Model.extend(TestMixin, {
        mood: computed("health", "hunger", function() {
        }),
        test: computed.alias("qwerty")
      });`,
      parserOptions: { ecmaVersion: 6, sourceType: 'module' },
      errors: [{
        message: 'The "test" single-line function should be above the "mood" multi-line function on line 2',
        line: 4,
      }],
    },
    {
      code: `export default DS.Model.extend(TestMixin, TestMixin2, {
        mood: computed("health", "hunger", function() {
        }),
        test: computed.alias("qwerty")
      });`,
      parserOptions: { ecmaVersion: 6, sourceType: 'module' },
      errors: [{
        message: 'The "test" single-line function should be above the "mood" multi-line function on line 2',
        line: 4,
      }],
    }, {
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
      parserOptions: { ecmaVersion: 6, sourceType: 'module' },
      errors: [{
        message: 'The "shape" attribute should be above the "behaviors" relationship on line 2',
        line: 3,
      }],
    }
  ],
});
