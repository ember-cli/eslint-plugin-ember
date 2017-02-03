'use strict';

// ------------------------------------------------------------------------------
// Requirements
// ------------------------------------------------------------------------------

var rule = require('../../../lib/rules/order-in-components');
var RuleTester = require('eslint').RuleTester;

// ------------------------------------------------------------------------------
// Tests
// ------------------------------------------------------------------------------

var eslintTester = new RuleTester();
eslintTester.run('order-in-components', rule, {
  valid: [
    {
      code: `export default Component.extend();`,
      parserOptions: {ecmaVersion: 6, sourceType: "module"},
    },
    {
      code: `export default Component.extend({
        role: "sloth",

        vehicle: alias("car"),

        levelOfHappiness: computed("attitude", "health", () => {
        }),

        actions: {}
      });`,
      parserOptions: {ecmaVersion: 6, sourceType: "module"},
    },
    {
      code: `export default Component.extend({
        role: "sloth",

        levelOfHappiness: computed("attitude", "health", () => {
        }),

        actions: {}
      });`,
      parserOptions: {ecmaVersion: 6, sourceType: "module"},
    },
    {
      code: `export default Component.extend({
        levelOfHappiness: computed("attitude", "health", () => {
        }),

        actions: {}
      });`,
      parserOptions: {ecmaVersion: 6, sourceType: "module"},
    },
    {
      code: `export default Component.extend(TestMixin, {
        levelOfHappiness: computed("attitude", "health", () => {
        }),

        actions: {}
      });`,
      parserOptions: {ecmaVersion: 6, sourceType: "module"},
    },
    {
      code: `export default Component.extend(TestMixin, TestMixin2, {
        levelOfHappiness: computed("attitude", "health", () => {
        }),

        actions: {}
      });`,
      parserOptions: {ecmaVersion: 6, sourceType: "module"},
    },
    {
      code: `export default Component.extend({
        abc: Ember.inject.service(),
        def: inject.service(),
        ghi: service(),

        role: "sloth",

        levelOfHappiness: computed("attitude", "health", () => {
        })
      });`,
      parserOptions: {ecmaVersion: 6, sourceType: "module"},
    },
    {
      code: `export default Component.extend({
        role: "sloth",
        abc: [],
        def: {},

        ghi: alias("def")
      });`,
      parserOptions: {ecmaVersion: 6, sourceType: "module"},
    },
    {
      code: `export default Component.extend({
        levelOfHappiness: computed("attitude", "health", () => {
        }),

        abc: Ember.observer("aaaa", () => {
        }),

        def: observer("aaaa", () => {
        }),

        actions: {}
      });`,
      parserOptions: {ecmaVersion: 6, sourceType: "module"},
    },
    {
      code: `export default Component.extend({
        abc: observer("aaaa", () => {
        }),

        init() {
        },

        actions: {},

        customFunction() {
        }
      });`,
      parserOptions: {ecmaVersion: 6, sourceType: "module"},
    },
    {
      code: `export default Component.extend({
        igh: service(),

        abc: [],
        def: true,

        singleComp: alias("abc"),

        multiComp: computed(() => {
        }),

        obs: observer("aaa", () => {
        }),

        init() {
        },

        actions: {},

        customFunc() {
        }});`,
      parserOptions: {ecmaVersion: 6, sourceType: "module"},
    },
    {
      code: `export default Component.extend({
        init() {
        },
        didReceiveAttrs() {
        },
        willRender() {
        },
        didInsertElement() {
        },
        didRender() {
        },
        didUpdateAttrs() {
        },
        willUpdate() {
        },
        didUpdate() {
        },
        willDestroyElement() {
        },
        willClearRender() {
        },
        didDestroyElement() {
        },

        actions: {}
      });`,
      parserOptions: {ecmaVersion: 6, sourceType: "module"},
    },
    {
      code: `export default Component.extend({
        test: service(),

        didReceiveAttrs() {
        },

        tSomeAction: task(function* (url) {
        })
      });`,
      parserOptions: {ecmaVersion: 6, sourceType: "module"},
    },
    {
      code: `export default Component.extend({
        test: service(),

        test2: computed.equal("asd", "qwe"),

        didReceiveAttrs() {
        },

        tSomeAction: task(function* (url) {
        }).restartable()
      });`,
      parserOptions: {ecmaVersion: 6, sourceType: "module"},
    },
    {
      code: `export default Component.extend({
        test: service(),

        didReceiveAttrs() {
        },

        tSomeAction: task(function* (url) {
        }),

        _anotherPrivateFnc() {
        }
      });`,
      parserOptions: {ecmaVersion: 6, sourceType: "module"},
    },
    {
      code: `export default Component.extend({
        classNameBindings: ["filterDateSelectClass"],
        content: [],
        currentMonthEndDate: null,
        currentMonthStartDate: null,
        optionValuePath: "value",
        optionLabelPath: "label",
        typeOfDate: null,
        action: K
      });`,
      parserOptions: {ecmaVersion: 6, sourceType: "module"},
    },
    {
      code: `export default Component.extend({
        role: "sloth",

        levelOfHappiness: computed.or("asd", "qwe"),

        actions: {} 
      });`,
      parserOptions: {ecmaVersion: 6, sourceType: "module"},
    },
    {
      code: `export default Component.extend({ 
        role: "sloth",

        levelOfHappiness: computed(function() {}),

        actions: {} 
      });`,
      parserOptions: {ecmaVersion: 6, sourceType: "module"},
    },
    {
      code: `export default Component.extend({
        role: "sloth",

        levelOfHappiness: computed(function() {
        }),

        actions: {} 
      });`,
      parserOptions: {ecmaVersion: 6, sourceType: "module"},
    },
  ],
  invalid: [
    {
      code: `export default Component.extend({
        actions: {},

        role: "sloth",

        vehicle: alias("car"),

        levelOfHappiness: computed("attitude", "health", () => {
        })
      });`,
      parserOptions: {ecmaVersion: 6, sourceType: "module"},
      errors: [{
        message: 'Check order of properties',
        line: 2,
      }],
    },
    {
      code: `export default Component.extend({
        vehicle: alias("car"),

        role: "sloth",

        levelOfHappiness: computed("attitude", "health", () => {
        }),

        actions: {}
      });`,
      parserOptions: {ecmaVersion: 6, sourceType: "module"},
      errors: [{
        message: 'Check order of properties',
        line: 2,
      }],
    },
    {
      code: `export default Component.extend({
        levelOfHappiness: computed("attitude", "health", () => {
        }),

        vehicle: alias("car"),

        role: "sloth",

        actions: {}
      });`,
      parserOptions: {ecmaVersion: 6, sourceType: "module"},
      errors: [{
        message: 'Check order of properties',
        line: 2,
      }],
    },
    {
      code: `export default Component.extend(TestMixin, {
        levelOfHappiness: computed("attitude", "health", () => {
        }),

        vehicle: alias("car"),

        role: "sloth",

        actions: {}
      });`,
      parserOptions: {ecmaVersion: 6, sourceType: "module"},
      errors: [{
        message: 'Check order of properties',
        line: 2,
      }],
    },
    {
      code: `export default Component.extend(TestMixin, TestMixin2, {
        levelOfHappiness: computed("attitude", "health", () => {
        }),

        vehicle: alias("car"),

        role: "sloth",

        actions: {}
      });`,
      parserOptions: {ecmaVersion: 6, sourceType: "module"},
      errors: [{
        message: 'Check order of properties',
        line: 2,
      }],
    },
    {
      code: `export default Component.extend({
        abc: true,
        i18n: service()
      });`,
      parserOptions: {ecmaVersion: 6, sourceType: "module"},
      errors: [{
        message: 'Check order of properties',
        line: 2,
      }],
    },
    {
      code: `export default Component.extend({
        vehicle: alias("car"),
        i18n: service()
      });`,
      parserOptions: {ecmaVersion: 6, sourceType: "module"},
      errors: [{
        message: 'Check order of properties',
        line: 2,
      }],
    },
    {
      code: `export default Component.extend({
        levelOfHappiness: observer("attitude", "health", () => {
        }),
        vehicle: alias("car")
      });`,
      parserOptions: {ecmaVersion: 6, sourceType: "module"},
      errors: [{
        message: 'Check order of properties',
        line: 2,
      }],
    },
    {
      code: `export default Component.extend({
        levelOfHappiness: observer("attitude", "health", () => {
        }),
        aaa: computed("attitude", "health", () => {
        })
      });`,
      parserOptions: {ecmaVersion: 6, sourceType: "module"},
      errors: [{
        message: 'Check order of properties',
        line: 2,
      }],
    },
    {
      code: `export default Component.extend({
        init() {
        },
        levelOfHappiness: observer("attitude", "health", () => {
        })
      });`,
      parserOptions: {ecmaVersion: 6, sourceType: "module"},
      errors: [{
        message: 'Check order of properties',
        line: 2,
      }],
    },
    {
      code: `export default Component.extend({
        actions: {},
        init() {
        }
      });`,
      parserOptions: {ecmaVersion: 6, sourceType: "module"},
      errors: [{
        message: 'Check order of properties',
        line: 2,
      }],
    },
    {
      code: `export default Component.extend({
        customFunc() {
        },
        actions: {}
      });`,
      parserOptions: {ecmaVersion: 6, sourceType: "module"},
      errors: [{
        message: 'Check order of properties',
        line: 2,
      }],
    },
    {
      code: `export default Component.extend({
        tAction: test(function() {
        }),
        actions: {}
      });`,
      parserOptions: {ecmaVersion: 6, sourceType: "module"},
      errors: [{
        message: 'Check order of properties',
        line: 2,
      }],
    },
  ]
});
