// ------------------------------------------------------------------------------
// Requirements
// ------------------------------------------------------------------------------

const rule = require('../../../lib/rules/order-in-components');
const RuleTester = require('eslint').RuleTester;

// ------------------------------------------------------------------------------
// Tests
// ------------------------------------------------------------------------------

const eslintTester = new RuleTester();
eslintTester.run('order-in-components', rule, {
  valid: [
    {
      code: 'export default Component.extend();',
      parserOptions: { ecmaVersion: 6, sourceType: 'module' },
    },
    {
      code: `export default Component.extend({
        role: "sloth",

        vehicle: alias("car"),

        levelOfHappiness: computed("attitude", "health", () => {
        }),

        actions: {}
      });`,
      parserOptions: { ecmaVersion: 6, sourceType: 'module' },
    },
    {
      code: `export default Component.extend({
        role: "sloth",

        levelOfHappiness: computed("attitude", "health", () => {
        }),

        actions: {}
      });`,
      parserOptions: { ecmaVersion: 6, sourceType: 'module' },
    },
    {
      code: `export default Component.extend({
        levelOfHappiness: computed("attitude", "health", () => {
        }),

        actions: {}
      });`,
      parserOptions: { ecmaVersion: 6, sourceType: 'module' },
    },
    {
      code: `export default Component.extend(TestMixin, {
        levelOfHappiness: computed("attitude", "health", () => {
        }),

        actions: {}
      });`,
      parserOptions: { ecmaVersion: 6, sourceType: 'module' },
    },
    {
      code: `export default Component.extend(TestMixin, TestMixin2, {
        levelOfHappiness: computed("attitude", "health", () => {
        }),

        actions: {}
      });`,
      parserOptions: { ecmaVersion: 6, sourceType: 'module' },
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
      parserOptions: { ecmaVersion: 6, sourceType: 'module' },
    },
    {
      code: `export default Component.extend({
        role: "sloth",
        abc: [],
        def: {},

        ghi: alias("def")
      });`,
      parserOptions: { ecmaVersion: 6, sourceType: 'module' },
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
      parserOptions: { ecmaVersion: 6, sourceType: 'module' },
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
      parserOptions: { ecmaVersion: 6, sourceType: 'module' },
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
      parserOptions: { ecmaVersion: 6, sourceType: 'module' },
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
      parserOptions: { ecmaVersion: 6, sourceType: 'module' },
    },
    {
      code: `export default Component.extend({
        test: service(),

        didReceiveAttrs() {
        },

        tSomeAction: task(function* (url) {
        })
      });`,
      parserOptions: { ecmaVersion: 6, sourceType: 'module' },
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
      parserOptions: { ecmaVersion: 6, sourceType: 'module' },
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
      parserOptions: { ecmaVersion: 6, sourceType: 'module' },
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
      parserOptions: { ecmaVersion: 6, sourceType: 'module' },
    },
    {
      code: `export default Component.extend({
        role: "sloth",

        levelOfHappiness: computed.or("asd", "qwe"),

        actions: {}
      });`,
      parserOptions: { ecmaVersion: 6, sourceType: 'module' },
    },
    {
      code: `export default Component.extend({
        role: "sloth",

        levelOfHappiness: computed(function() {}),

        actions: {}
      });`,
      parserOptions: { ecmaVersion: 6, sourceType: 'module' },
    },
    {
      code: `export default Component.extend({
        role: "sloth",

        levelOfHappiness: computed(function() {
        }),

        actions: {}
      });`,
      parserOptions: { ecmaVersion: 6, sourceType: 'module' },
    },
    {
      code: `export default Component.extend({
        role: "sloth",

        computed1: computed(function() {
        }),
        computed2: alias('computed1'),

        actions: {},

        foobar: Ember.inject.service(),
      });`,
      parserOptions: { ecmaVersion: 6, sourceType: 'module' },
      options: [{
        order: [
          'property',
          'multi-line-function',
          'single-line-function',
          'actions',
        ],
      }],
    },
    {
      code: `export default Component.extend({
        role: "sloth",

        computed1: alias('computed2'),
        computed2: computed(function() {
        }),
        computed3: alias('computed1'),

        actions: {},

        foobar: Ember.inject.service(),
      });`,
      parserOptions: { ecmaVersion: 6, sourceType: 'module' },
      options: [{
        order: [
          'property',
          ['single-line-function', 'multi-line-function'],
          'actions',
        ],
      }],
    },
    {
      code: `export default Component.extend({
        role: "sloth",
        qwe: foo ? 'bar' : null,
        abc: [],
        def: {},

        ghi: alias("def")
      });`,
      parserOptions: { ecmaVersion: 6, sourceType: 'module' },
    },
    {
      code: `export default Component.extend({
        template: hbs\`Hello world {{name}}\`,
        name: "Jon Snow",
        actions: {}
      });`,
      parserOptions: { ecmaVersion: 6, sourceType: 'module' },
    },
    {
      code: `export default Component.extend({
        layout,
        tabindex: -1,

        someComputedValue: computed.reads('count'),
      });`,
      parserOptions: { ecmaVersion: 6, sourceType: 'module' },
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
      parserOptions: { ecmaVersion: 6, sourceType: 'module' },
      errors: [{
        message: 'The "role" property should be above the actions hash on line 2',
        line: 4,
      }, {
        message: 'The "vehicle" single-line function should be above the actions hash on line 2',
        line: 6,
      }, {
        message: 'The "levelOfHappiness" multi-line function should be above the actions hash on line 2',
        line: 8,
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
      parserOptions: { ecmaVersion: 6, sourceType: 'module' },
      errors: [{
        message: 'The "role" property should be above the "vehicle" single-line function on line 2',
        line: 4,
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
      parserOptions: { ecmaVersion: 6, sourceType: 'module' },
      errors: [{
        message: 'The "vehicle" single-line function should be above the "levelOfHappiness" multi-line function on line 2',
        line: 5,
      }, {
        message: 'The "role" property should be above the "levelOfHappiness" multi-line function on line 2',
        line: 7,
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
      parserOptions: { ecmaVersion: 6, sourceType: 'module' },
      errors: [{
        message: 'The "vehicle" single-line function should be above the "levelOfHappiness" multi-line function on line 2',
        line: 5,
      }, {
        message: 'The "role" property should be above the "levelOfHappiness" multi-line function on line 2',
        line: 7,
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
      parserOptions: { ecmaVersion: 6, sourceType: 'module' },
      errors: [{
        message: 'The "vehicle" single-line function should be above the "levelOfHappiness" multi-line function on line 2',
        line: 5,
      }, {
        message: 'The "role" property should be above the "levelOfHappiness" multi-line function on line 2',
        line: 7,
      }],
    },
    {
      code: `export default Component.extend({
        abc: true,
        i18n: service()
      });`,
      parserOptions: { ecmaVersion: 6, sourceType: 'module' },
      errors: [{
        message: 'The "i18n" service injection should be above the "abc" property on line 2',
        line: 3,
      }],
    },
    {
      code: `export default Component.extend({
        vehicle: alias("car"),
        i18n: service()
      });`,
      parserOptions: { ecmaVersion: 6, sourceType: 'module' },
      errors: [{
        message: 'The "i18n" service injection should be above the "vehicle" single-line function on line 2',
        line: 3,
      }],
    },
    {
      code: `export default Component.extend({
        levelOfHappiness: observer("attitude", "health", () => {
        }),
        vehicle: alias("car")
      });`,
      parserOptions: { ecmaVersion: 6, sourceType: 'module' },
      errors: [{
        message: 'The "vehicle" single-line function should be above the "levelOfHappiness" observer on line 2',
        line: 4,
      }],
    },
    {
      code: `export default Component.extend({
        levelOfHappiness: observer("attitude", "health", () => {
        }),
        aaa: computed("attitude", "health", () => {
        })
      });`,
      parserOptions: { ecmaVersion: 6, sourceType: 'module' },
      errors: [{
        message: 'The "aaa" multi-line function should be above the "levelOfHappiness" observer on line 2',
        line: 4,
      }],
    },
    {
      code: `export default Component.extend({
        init() {
        },
        levelOfHappiness: observer("attitude", "health", () => {
        })
      });`,
      parserOptions: { ecmaVersion: 6, sourceType: 'module' },
      errors: [{
        message: 'The "levelOfHappiness" observer should be above the "init" lifecycle hook on line 2',
        line: 4,
      }],
    },
    {
      code: `export default Component.extend({
        actions: {},
        init() {
        }
      });`,
      parserOptions: { ecmaVersion: 6, sourceType: 'module' },
      errors: [{
        message: 'The "init" lifecycle hook should be above the actions hash on line 2',
        line: 3,
      }],
    },
    {
      code: `export default Component.extend({
        customFunc() {
        },
        actions: {}
      });`,
      parserOptions: { ecmaVersion: 6, sourceType: 'module' },
      errors: [{
        message: 'The actions hash should be above the "customFunc" method on line 2',
        line: 4,
      }],
    },
    {
      code: `export default Component.extend({
        tAction: test(function() {
        }),
        actions: {}
      });`,
      parserOptions: { ecmaVersion: 6, sourceType: 'module' },
      errors: [{
        message: 'The actions hash should be above the "tAction" method on line 2',
        line: 4,
      }],
    },
    {
      code: `export default Component.extend(TestMixin, TestMixin2, {
        foo: alias("car"),

        levelOfHappiness: computed("attitude", "health", () => {
        }),

        vehicle: alias("car"),

        role: "sloth",

        actions: {}
      });`,
      parserOptions: { ecmaVersion: 6, sourceType: 'module' },
      errors: [{
        message: 'The "vehicle" single-line function should be above the "levelOfHappiness" multi-line function on line 4',
        line: 7,
      }, {
        message: 'The "role" property should be above the "foo" single-line function on line 2',
        line: 9,
      }],
    },
    {
      code: `let foo = 'foo';

      export default Component.extend(TestMixin, TestMixin2, {
        actions: {},
        [foo]: 'foo',
      });`,
      parserOptions: { ecmaVersion: 6, sourceType: 'module' },
      errors: [{
        message: 'The property should be above the actions hash on line 4',
        line: 5,
      }],
    },
    {
      filename: 'example-app/components/some-component/component.js',
      code: `export default CustomComponent.extend({
        actions: {},
        role: "sloth",
      });`,
      parserOptions: { ecmaVersion: 6, sourceType: 'module' },
      errors: [{
        message: 'The "role" property should be above the actions hash on line 2',
        line: 3,
      }],
    },
    {
      filename: 'example-app/components/some-component.js',
      code: `export default CustomComponent.extend({
        actions: {},
        role: "sloth",
      });`,
      parserOptions: { ecmaVersion: 6, sourceType: 'module' },
      errors: [{
        message: 'The "role" property should be above the actions hash on line 2',
        line: 3,
      }],
    },
    {
      filename: 'example-app/twisted-path/some-component.js',
      code: `export default Component.extend({
        actions: {},
        role: "sloth",
      });`,
      parserOptions: { ecmaVersion: 6, sourceType: 'module' },
      errors: [{
        message: 'The "role" property should be above the actions hash on line 2',
        line: 3,
      }],
    },
    {
      code: `export default Component.extend({
        name: "Jon Snow",
        actions: {},
        template: hbs\`Hello world {{name}}\`,
      });`,
      parserOptions: { ecmaVersion: 6, sourceType: 'module' },
      errors: [{
        message: 'The "template" property should be above the actions hash on line 3',
        line: 4,
      }],
    },
  ],
});
