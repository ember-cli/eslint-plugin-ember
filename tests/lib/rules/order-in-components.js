/* eslint eslint-plugin/consistent-output: "off" */

// ------------------------------------------------------------------------------
// Requirements
// ------------------------------------------------------------------------------

const rule = require('../../../lib/rules/order-in-components');
const RuleTester = require('eslint').RuleTester;

// ------------------------------------------------------------------------------
// Tests
// ------------------------------------------------------------------------------

const eslintTester = new RuleTester({
  parserOptions: { ecmaVersion: 6, sourceType: 'module' },
});

eslintTester.run('order-in-components', rule, {
  valid: [
    `
      import Component from '@ember/component';
      export default Component.extend();
    `,
    `
      import Component from '@ember/component';
      export default Component.extend({
        role: "sloth",

        vehicle: alias("car"),

        levelOfHappiness: computed("attitude", "health", () => {
        }),

        actions: {}
      });
    `,
    `
      import Component from '@ember/component';
      export default Component.extend({
        role: "sloth",

        levelOfHappiness: computed("attitude", "health", () => {
        }),

        actions: {}
      });
    `,
    `
      import Component from '@ember/component';
      export default Component.extend({
        levelOfHappiness: computed("attitude", "health", () => {
        }),

        actions: {}
      });
    `,
    `
      import Component from '@ember/component';
      export default Component.extend(TestMixin, {
        levelOfHappiness: computed("attitude", "health", () => {
        }),

        actions: {}
      });
    `,
    `
      import Component from '@ember/component';
      export default Component.extend(TestMixin, TestMixin2, {
        levelOfHappiness: computed("attitude", "health", () => {
        }),

        actions: {}
      });
    `,
    `
      import Component from '@ember/component';
      export default Component.extend({
        abc: Ember.inject.service(),
        def: inject.service(),
        ghi: service(),

        role: "sloth",

        levelOfHappiness: computed("attitude", "health", () => {
        })
      });
    `,
    `
      import Component from '@ember/component';
      import { inject } from '@ember/service';
      export default Component.extend({
        abc: inject(),
        def: inject.service(),
        ghi: service(),

        role: "sloth",

        levelOfHappiness: computed("attitude", "health", () => {
        })
      });
    `,
    `
      import Component from '@ember/component';
      export default Component.extend({
        role: "sloth",
        abc: [],
        def: {},

        ghi: alias("def")
      });
    `,
    `
      import Component from '@ember/component';
      export default Component.extend({
        levelOfHappiness: computed("attitude", "health", () => {
        }),

        abc: Ember.observer("aaaa", () => {
        }),

        def: observer("aaaa", () => {
        }),

        actions: {}
      });
    `,
    `
      import Component from '@ember/component';
      export default Component.extend({
        abc: observer("aaaa", () => {
        }),

        init() {
        },

        actions: {},

        customFunc() {
          return true;
        }
      });
    `,
    `
      import Component from '@ember/component';
      export default Component.extend({
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
          return true;
        }
      });
    `,
    `
      import Component from '@ember/component';
      export default Component.extend({
        init() {
        },
        didReceiveAttrs() {
        },
        willRender() {
        },
        willInsertElement() {
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
      });
    `,
    `
      import Component from '@ember/component';
      export default Component.extend({
        test: service(),

        didReceiveAttrs() {
        },

        tSomeAction: task(function* (url) {
        })
      });
    `,
    `
      import Component from '@ember/component';
      export default Component.extend({
        test: service(),

        test2: computed.equal("asd", "qwe"),

        didReceiveAttrs() {
        },

        tSomeAction: task(function* (url) {
        }).restartable()
      });
    `,
    `
      import Component from '@ember/component';
      export default Component.extend({
        test: service(),

        someEmptyMethod() {},

        didReceiveAttrs() {
        },

        tSomeAction: task(function* (url) {
        }),

        _anotherPrivateFnc() {
          return true;
        }
      });
    `,
    `
      import Component from '@ember/component';
      export default Component.extend({
        classNameBindings: ["filterDateSelectClass"],
        content: [],
        currentMonthEndDate: null,
        currentMonthStartDate: null,
        optionValuePath: "value",
        optionLabelPath: "label",
        typeOfDate: null,
        action: K
      });
    `,
    `
      import Component from '@ember/component';
      export default Component.extend({
        role: "sloth",

        levelOfHappiness: computed.or("asd", "qwe"),

        actions: {}
      });
    `,
    `
      import Component from '@ember/component';
      export default Component.extend({
        role: "sloth",

        levelOfHappiness: computed(function() {}),

        actions: {}
      });
    `,
    `
      import Component from '@ember/component';
      export default Component.extend({
        role: "sloth",

        levelOfHappiness: computed(function() {
        }),

        actions: {}
      });
    `,
    {
      code: `
        import Component from '@ember/component';
          export default Component.extend({
          role: "sloth",

          computed1: computed(function() {
          }),
          computed2: alias('computed1'),

          actions: {},

          foobar: Ember.inject.service(),
        });
      `,
      options: [
        {
          order: ['property', 'multi-line-function', 'single-line-function', 'actions'],
        },
      ],
    },
    {
      code: `
        import Component from '@ember/component';
        export default Component.extend({
          role: "sloth",

          computed1: alias('computed2'),
          computed2: computed(function() {
          }),
          computed3: alias('computed1'),

          actions: {},

          foobar: Ember.inject.service(),
        });
      `,
      options: [
        {
          order: ['property', ['single-line-function', 'multi-line-function'], 'actions'],
        },
      ],
    },
    `
      import Component from '@ember/component';
      export default Component.extend({
        role: "sloth",
        qwe: foo ? 'bar' : null,
        abc: [],
        def: {},

        ghi: alias("def")
      });
    `,
    `
      import Component from '@ember/component';
      export default Component.extend({
        template: hbs\`Hello world {{name}}\`,
        name: "Jon Snow",
        actions: {}
      });
    `,
    `
      import Component from '@ember/component';
      export default Component.extend({
        layout,
        tabindex: -1,

        someComputedValue: computed.reads('count'),
      });
    `,
    `
      import Component from '@ember/component';
      export default Component.extend({
        foo: computed(function() {
        }).volatile(),
        bar: computed(function() {
        })
      });
    `,
    `
      import Component from '@ember/component';
      export default Component.extend({
        onFoo() {},
        onFoo: () => {},
        foo: computed(function() {
        }).volatile(),
        bar() { const foo = 'bar'}
      });
    `,
    {
      code: `
        import Component from '@ember/component';
        export default Component.extend({
          onFoo() {},
          onFoo: () => {},
          foo: computed(function() {
          }).volatile(),
          bar() { const foo = 'bar'}
        });
      `,
      options: [
        {
          order: [
            'property',
            'empty-method',
            'single-line-function',
            'multi-line-function',
            'method',
          ],
        },
      ],
    },
  ],
  invalid: [
    {
      code: `
        import Component from '@ember/component';
        export default Component.extend({
          actions: {},

          role: "sloth",

          vehicle: alias("car"),

          levelOfHappiness: computed("attitude", "health", () => {
          })
        });
      `,
      errors: [
        {
          message: 'The "role" property should be above the actions hash on line 4',
          line: 6,
        },
        {
          message: 'The "vehicle" single-line function should be above the actions hash on line 4',
          line: 8,
        },
        {
          message:
            'The "levelOfHappiness" multi-line function should be above the actions hash on line 4',
          line: 10,
        },
      ],
    },
    {
      code: `
        import Component from '@ember/component';
        export default Component.extend({
          vehicle: alias("car"),

          role: "sloth",

          levelOfHappiness: computed("attitude", "health", () => {
          }),

          actions: {}
        });
      `,
      errors: [
        {
          message:
            'The "role" property should be above the "vehicle" single-line function on line 4',
          line: 6,
        },
      ],
    },
    {
      code: `
        import Component from '@ember/component';
        export default Component.extend({
          levelOfHappiness: computed("attitude", "health", () => {
          }),

          vehicle: alias("car"),

          role: "sloth",

          actions: {}
        });
      `,
      errors: [
        {
          message:
            'The "vehicle" single-line function should be above the "levelOfHappiness" multi-line function on line 4',
          line: 7,
        },
        {
          message:
            'The "role" property should be above the "levelOfHappiness" multi-line function on line 4',
          line: 9,
        },
      ],
    },
    {
      code: `
        import Component from '@ember/component';
        export default Component.extend(TestMixin, {
          levelOfHappiness: computed("attitude", "health", () => {
          }),

          vehicle: alias("car"),

          role: "sloth",

          actions: {}
        });
      `,
      errors: [
        {
          message:
            'The "vehicle" single-line function should be above the "levelOfHappiness" multi-line function on line 4',
          line: 7,
        },
        {
          message:
            'The "role" property should be above the "levelOfHappiness" multi-line function on line 4',
          line: 9,
        },
      ],
    },
    {
      code: `
        import Component from '@ember/component';
        export default Component.extend(TestMixin, TestMixin2, {
          levelOfHappiness: computed("attitude", "health", () => {
          }),

          vehicle: alias("car"),

          role: "sloth",

          actions: {}
        });
      `,
      errors: [
        {
          message:
            'The "vehicle" single-line function should be above the "levelOfHappiness" multi-line function on line 4',
          line: 7,
        },
        {
          message:
            'The "role" property should be above the "levelOfHappiness" multi-line function on line 4',
          line: 9,
        },
      ],
    },
    {
      code: `
        import Component from '@ember/component';
        export default Component.extend({
          abc: true,
          i18n: service()
        });
      `,
      errors: [
        {
          message: 'The "i18n" service injection should be above the "abc" property on line 4',
          line: 5,
        },
      ],
    },
    {
      code: `
        import Component from '@ember/component';
        export default Component.extend({
          vehicle: alias("car"),
          i18n: service()
        });
      `,
      errors: [
        {
          message:
            'The "i18n" service injection should be above the "vehicle" single-line function on line 4',
          line: 5,
        },
      ],
    },
    {
      code: `
        import Component from '@ember/component';
        import { inject } from '@ember/service';
        export default Component.extend({
          vehicle: alias("car"),
          i18n: inject()
        });
      `,
      errors: [
        {
          message:
            'The "i18n" service injection should be above the "vehicle" single-line function on line 5',
          line: 6,
        },
      ],
    },
    {
      code: `
        import Component from '@ember/component';
        export default Component.extend({
          levelOfHappiness: observer("attitude", "health", () => {
          }),
          vehicle: alias("car")
        });
      `,
      errors: [
        {
          message:
            'The "vehicle" single-line function should be above the "levelOfHappiness" observer on line 4',
          line: 6,
        },
      ],
    },
    {
      code: `
        import Component from '@ember/component';
        export default Component.extend({
          levelOfHappiness: observer("attitude", "health", () => {
          }),
          aaa: computed("attitude", "health", () => {
          })
        });
      `,
      errors: [
        {
          message:
            'The "aaa" multi-line function should be above the "levelOfHappiness" observer on line 4',
          line: 6,
        },
      ],
    },
    {
      code: `
        import Component from '@ember/component';
        export default Component.extend({
          init() {
          },
          levelOfHappiness: observer("attitude", "health", () => {
          })
        });
      `,
      errors: [
        {
          message:
            'The "levelOfHappiness" observer should be above the "init" lifecycle hook on line 4',
          line: 6,
        },
      ],
    },
    {
      code: `
        import Component from '@ember/component';
        export default Component.extend({
          actions: {},
          init() {
          }
        });
      `,
      errors: [
        {
          message: 'The "init" lifecycle hook should be above the actions hash on line 4',
          line: 5,
        },
      ],
    },
    {
      code: `
        import Component from '@ember/component';
        export default Component.extend({
          customFunc() {
            const foo = 'bar';
          },
          actions: {}
        });
      `,
      errors: [
        {
          message: 'The actions hash should be above the "customFunc" method on line 4',
          line: 7,
        },
      ],
    },
    {
      code: `
        import Component from '@ember/component';
        export default Component.extend({
          tAction: test(function() {
          }),
          actions: {}
        });
      `,
      errors: [
        {
          message: 'The actions hash should be above the "tAction" method on line 4',
          line: 6,
        },
      ],
    },
    {
      code: `
        import Component from '@ember/component';
        export default Component.extend(TestMixin, TestMixin2, {
          foo: alias("car"),

          levelOfHappiness: computed("attitude", "health", () => {
          }),

          vehicle: alias("car"),

          role: "sloth",

          actions: {}
        });
      `,
      errors: [
        {
          message:
            'The "vehicle" single-line function should be above the "levelOfHappiness" multi-line function on line 6',
          line: 9,
        },
        {
          message: 'The "role" property should be above the "foo" single-line function on line 4',
          line: 11,
        },
      ],
    },
    {
      code: `
        import Component from '@ember/component';
        let foo = 'foo';

        export default Component.extend(TestMixin, TestMixin2, {
          actions: {},
          [foo]: 'foo',
        });
      `,
      errors: [
        {
          message: 'The property should be above the actions hash on line 6',
          line: 7,
        },
      ],
    },
    {
      filename: 'example-app/components/some-component/component.js',
      code: `
        import CustomComponent from '@ember/component';
        export default CustomComponent.extend({
          actions: {},
          role: "sloth",
        });
      `,
      errors: [
        {
          message: 'The "role" property should be above the actions hash on line 4',
          line: 5,
        },
      ],
    },
    {
      filename: 'example-app/components/some-component.js',
      code: `
        import CustomComponent from '@ember/component';
        export default CustomComponent.extend({
          actions: {},
          role: "sloth",
        });
      `,
      errors: [
        {
          message: 'The "role" property should be above the actions hash on line 4',
          line: 5,
        },
      ],
    },
    {
      filename: 'example-app/twisted-path/some-component.js',
      code: `
        import Component from '@ember/component';
        export default Component.extend({
          actions: {},
          role: "sloth",
        });
      `,
      errors: [
        {
          message: 'The "role" property should be above the actions hash on line 4',
          line: 5,
        },
      ],
    },
    {
      code: `
        import Component from '@ember/component';
        export default Component.extend({
          name: "Jon Snow",
          actions: {},
          template: hbs\`Hello world {{name}}\`,
        });
      `,
      errors: [
        {
          message: 'The "template" property should be above the actions hash on line 5',
          line: 6,
        },
      ],
    },
    {
      code: `
        import Component from '@ember/component';
        export default Component.extend({
          layout,
          someComputedValue: computed.reads('count'),

          tabindex: -1,
        });
      `,
      errors: [
        {
          message:
            'The "tabindex" property should be above the "someComputedValue" single-line function on line 5',
          line: 7,
        },
      ],
    },
    {
      code: `
        import Component from '@ember/component';
        export default Component.extend({
          foo: computed(function() {
          }).volatile(),
          name: "Jon Snow",
        });
      `,
      errors: [
        {
          message: 'The "name" property should be above the "foo" multi-line function on line 4',
          line: 6,
        },
      ],
    },
    {
      code: `
        import Component from '@ember/component';
        export default Component.extend({
          actions: {},
          didReceiveAttrs() {},
          willDestroyElement() {},
          didInsertElement() {},
          init() {},
        });
      `,
      errors: [
        {
          message:
            'The "didReceiveAttrs" lifecycle hook should be above the actions hash on line 4',
          line: 5,
        },
        {
          message:
            'The "willDestroyElement" lifecycle hook should be above the actions hash on line 4',
          line: 6,
        },
        {
          message:
            'The "didInsertElement" lifecycle hook should be above the actions hash on line 4',
          line: 7,
        },
        {
          message: 'The "init" lifecycle hook should be above the actions hash on line 4',
          line: 8,
        },
      ],
    },
    {
      code: `
        import Component from '@ember/component';
        export default Component.extend({
          foo: computed(function() {
          }).volatile(),
          onFoo() {},
          bar() { const foo = 'bar'},
          onBar: () => {}
        });
      `,
      errors: [
        {
          message:
            'The "onFoo" empty method should be above the "foo" multi-line function on line 4',
          line: 6,
        },
        {
          message:
            'The "onBar" empty method should be above the "foo" multi-line function on line 4',
          line: 8,
        },
      ],
    },
    {
      code: `
        import Component from '@ember/component';
        export default Component.extend({
          levelOfHappiness: computed("attitude", "health", () => {
          }),

          vehicle: alias("car"),

          actions: {}
        });
      `,
      output: `
        import Component from '@ember/component';
        export default Component.extend({
          vehicle: alias("car"),

          levelOfHappiness: computed("attitude", "health", () => {
          }),

          actions: {}
        });
      `,
      errors: [
        {
          message:
            'The "vehicle" single-line function should be above the "levelOfHappiness" multi-line function on line 4',
          line: 7,
        },
      ],
    },
  ],
});
