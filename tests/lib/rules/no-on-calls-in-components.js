// ------------------------------------------------------------------------------
// Requirements
// ------------------------------------------------------------------------------

const rule = require('../../../lib/rules/no-on-calls-in-components');
const RuleTester = require('eslint').RuleTester;

// ------------------------------------------------------------------------------
// Tests
// ------------------------------------------------------------------------------

const eslintTester = new RuleTester({
  parserOptions: { ecmaVersion: 6, sourceType: 'module' },
});

const message = "Don't use .on() for component lifecycle events.";

eslintTester.run('no-on-calls-in-components', rule, {
  valid: [
    `
      import Component from '@ember/component';
      export default Component.extend();
    `,
    `
      import Component from '@ember/component';
      export default Component.extend({
        actions: {}
      });
    `,
    `
      import Component from '@ember/component';
      export default Component.extend({
        abc: service()
      });
    `,
    `
      import Component from '@ember/component';
      export default Component.extend({
        abc: inject.service()
      });
    `,
    `
      import Component from '@ember/component';
      export default Component.extend({
        abc: false
      });
    `,
    `
      import Component from '@ember/component';
      export default Component.extend({
        classNames: ["abc", "def"]
      });
    `,
    `
      import Component from '@ember/component';
      export default Component.extend({
        abc: computed(function () {})
      });
    `,
    `
      import Component from '@ember/component';
      export default Component.extend({
        abc: observer("abc", function () {})
      });
    `,
    `
      import Component from '@ember/component';
      export default Component.extend({
        abc: observer("abc", function () {
          test.on("xyz", def)
        })
      });
    `,
    `
      import Component from '@ember/component';
      export default Component.extend({
        abc: function () {
          test.on("xyz", def)
        }
      });
    `,
    `
      import Component from '@ember/component';
      export default Component.extend({
        abc() {
          $("body").on("click", def)
        }
      });
    `,
    `
      import Component from '@ember/component';
      export default Component.extend({
        didInsertElement() {
          $("body").on("click", def).on("click", function () {})
        }
      });
    `,
    `
      import Component from '@ember/component';
      export default Component.extend({
        actions: {
          abc() {
            test.on("xyz", def)
          }
        }
      });
    `,
    `
      import Component from '@ember/component';
      export default Component.extend({
        actions: {
          abc() {
            $("body").on("click", def).on("click", function () {})
          }
        }
      });
    `,
    `
      import Component from '@ember/component';
      export default Component.extend({
        abc: on("nonLifecycleEvent", function() {})
      });
    `,
    {
      code: `
        import Component from '@ember/component';

        let foo = { bar: 'baz' };

        export default Component.extend({
          ...foo,
        });
      `,
      parserOptions: { ecmaVersion: 9, sourceType: 'module' },
    },
  ],
  invalid: [
    {
      code: `
        import Component from '@ember/component';
        export default Component.extend({
          test: on("didInsertElement", function () {})
        });
      `,
      output: null,
      errors: [{ message, line: 4 }],
    },
    {
      code: `
        import Component from '@ember/component';
        export default Component.extend({
          test: on("init", observer("someProperty", function () {
            return true;
          })),
          someComputedProperty: computed.bool(true)
        });
      `,
      output: null,
      errors: [{ message, line: 4 }],
    },
    {
      code: `
        import Component from '@ember/component';
        export default Component.extend({
          test: Ember.on("didInsertElement", function () {}),
          someComputedProperty: Ember.computed.readOnly('Hello World!'),
          anotherTest: Ember.on("willDestroyElement", function () {})
        });
      `,
      output: null,
      errors: [
        { message, line: 4 },
        { message, line: 6 },
      ],
    },
    {
      filename: 'example-app/components/some-component/component.js',
      code: `
        import CustomComponent from '@ember/component';
        export default CustomComponent.extend({
          test: on("didInsertElement", function () {})
        });
      `,
      output: null,
      errors: [
        {
          message: "Don't use .on() for component lifecycle events.",
        },
      ],
    },
    {
      filename: 'example-app/components/some-component.js',
      code: `
        import CustomComponent from '@ember/component';
        export default CustomComponent.extend({
          test: on("didInsertElement", function () {})
        });
      `,
      output: null,
      errors: [
        {
          message: "Don't use .on() for component lifecycle events.",
        },
      ],
    },
    {
      filename: 'example-app/twised-path/some-file.js',
      code: `
        import Component from '@ember/component';
        export default Component.extend({
          test: on("didInsertElement", function () {})
        });
      `,
      output: null,
      errors: [
        {
          message: "Don't use .on() for component lifecycle events.",
        },
      ],
    },
  ],
});
