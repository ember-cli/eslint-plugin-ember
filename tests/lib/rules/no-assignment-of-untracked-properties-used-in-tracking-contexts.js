//------------------------------------------------------------------------------
// Requirements
//------------------------------------------------------------------------------

const rule = require('../../../lib/rules/no-assignment-of-untracked-properties-used-in-tracking-contexts');
const RuleTester = require('eslint').RuleTester;

const { ERROR_MESSAGE } = rule;

//------------------------------------------------------------------------------
// Tests
//------------------------------------------------------------------------------

const ruleTester = new RuleTester({
  parser: require.resolve('@babel/eslint-parser'),
  parserOptions: {
    ecmaVersion: 2022,
    sourceType: 'module',
    babelOptions: {
      configFile: require.resolve('../../../.babelrc'),
    },
  },
});

ruleTester.run('no-assignment-of-untracked-properties-used-in-tracking-contexts', rule, {
  valid: [
    // **********************
    // Native class
    // **********************

    {
      // Assignment of property which is not used as a dependent key.
      filename: '/components/foo.js',
      code: `
      import { computed } from '@ember/object';
      import Component from '@ember/component';
      class MyClass extends Component {
        @computed get prop1() {}
        @computed() get prop2() {}
        @computed('random') get prop3() {}
        myFunction() { this.x = 123; }
      }`,
    },
    {
      // Assignment of tracked property.
      filename: '/components/foo.js',
      code: `
      import { computed } from '@ember/object';
      import Component from '@ember/component';
      import { tracked } from '@glimmer/tracking';
      class MyClass extends Component {
        @tracked x
        @computed('x') get prop() {}
        myFunction() { this.x = 123; }
      }`,
    },
    {
      // Assignment of tracked property with string literal property name.
      filename: '/components/foo.js',
      code: `
      import { computed } from '@ember/object';
      import Component from '@ember/component';
      import { tracked } from '@glimmer/tracking';
      class MyClass extends Component {
        @tracked 'x'
        @computed('x') get prop() {}
        myFunction() { this.x = 123; }
      }`,
    },
    {
      // Assignment of tracked property (with aliased `tracked` import).
      filename: '/components/foo.js',
      code: `
      import { computed } from '@ember/object';
      import Component from '@ember/component';
      import { tracked as t } from '@glimmer/tracking';
      class MyClass extends Component {
        @t x
        @computed('x') get prop() {}
        myFunction() { this.x = 123; }
      }`,
    },
    {
      // Assignment of property in the Glimmer component args hash which is automatically tracked.
      filename: '/components/foo.js',
      code: `
      import { computed } from '@ember/object';
      import Component from '@glimmer/component';
      class MyClass extends Component {
        @computed('args.x') get prop() {}
        myFunction() { this.args.x = 123; }
      }`,
    },
    {
      // Assignment of dependent key property but outside the class.
      filename: '/components/foo.js',
      code: `
      import { computed } from '@ember/object';
      import Component from '@ember/component';
      class MyClass extends Component {
        @computed('x') get prop() {}
      }
      this.x = 123;`,
    },
    {
      // Assignment missing `this.`.
      filename: '/components/foo.js',
      code: `
      import { computed } from '@ember/object';
      import Component from '@ember/component';
      class MyClass extends Component {
        @computed('x') get prop() {}
        myFunction() { x = 123; }
      }`,
    },
    {
      // Test files should be ignored.
      filename: '/components/foo-test.js',
      code: `
      import { computed } from '@ember/object';
      import Component from '@ember/component';
      class MyClass extends Component {
        @computed('x') get prop() {}
        myFunction() { this.x = 123; }
      }`,
    },
    {
      // Not an Ember module file.
      filename: '/random/foo.js',
      code: `
      import { computed } from '@ember/object';
      import SomeThing from 'random';
      SomeThing.extend({
        prop: computed('x', function() {}),
        myFunction() { this.x = 123; }
      })`,
    },
    {
      // Assignment in separate class from computed property.
      filename: '/components/foo.js',
      code: `
      import { computed } from '@ember/object';
      import Component from '@ember/component';
      class Class1 extends Component {
        @computed('x') get myProp() {}
      }
      class Class2 extends Component {
        myFunction() { this.x = 123; }
      }`,
    },
    {
      // Without computed imports.
      filename: '/components/foo.js',
      code: `
      import Component from '@ember/component';
      class MyClass extends Component {
        @computed('x') get prop1() {}
        @readOnly('y') get prop2() {}
        myFunction() { this.x = 123; this.y = 456; }
      }`,
    },

    // **********************
    // Classic class
    // **********************
    {
      filename: '/components/foo.js',
      code: `
      import { computed } from '@ember/object';
      import Component from '@ember/component';
      Component.extend({
        prop: computed('x') // This is here to make sure it is not considered in the next class.
      });
      Component.extend({
        ...someProp.getProperties('propA', 'propB'),
        prop1: computed(),
        prop2: computed(function() {}),
        prop3: computed('random', function() {}),
        myFunction() { this.x = 123; }
      })`,
    },
    {
      // Imports present but no computed properties.
      filename: '/components/foo.js',
      code: `
      import { readOnly, equal, gt } from '@ember/object/computed';
      import { computed } from '@ember/object';
      import Component from '@ember/component';
      Component.extend({
        actions: {},
      });`,
    },
  ],
  invalid: [
    // **********************
    // Native class
    // **********************

    {
      // Assignment of dependent key property.
      filename: '/components/foo.js',
      code: `
      import { computed } from '@ember/object';
      import Component from '@ember/component';
      import { tracked } from '@glimmer/tracking';
      class Class1 extends Component {
        @tracked x; // This is included just to make sure it gets ignored in the next class.
      }
      class Class2 extends Component {
        @computed('x') get myProp() {}
        myFunction() { this.x = 123; }
      }`,
      output: `
      import { set } from '@ember/object';
import { computed } from '@ember/object';
      import Component from '@ember/component';
      import { tracked } from '@glimmer/tracking';
      class Class1 extends Component {
        @tracked x; // This is included just to make sure it gets ignored in the next class.
      }
      class Class2 extends Component {
        @computed('x') get myProp() {}
        myFunction() { set(this, 'x', 123); }
      }`,
      errors: [{ message: ERROR_MESSAGE, type: 'AssignmentExpression' }],
    },
    {
      // Assignment of dependent key property (with dependent key brace expansion / assignment property is substring of dependent key).
      filename: '/components/foo.js',
      code: `
      import { computed } from '@ember/object';
      import Component from '@ember/component';
      class MyClass extends Component {
        @computed('x.{a,b}.@each.z') get myProp() {}
        myFunction() { this.x = 123; }
      }`,
      output: `
      import { set } from '@ember/object';
import { computed } from '@ember/object';
      import Component from '@ember/component';
      class MyClass extends Component {
        @computed('x.{a,b}.@each.z') get myProp() {}
        myFunction() { set(this, 'x', 123); }
      }`,
      errors: [{ message: ERROR_MESSAGE, type: 'AssignmentExpression' }],
    },
    {
      // Assignment of dependent key property (with aliased `computed` import).
      filename: '/components/foo.js',
      code: `
      import { computed as c } from '@ember/object';
      import Component from '@ember/component';
      class MyClass extends Component {
        @c('x') get myProp() {}
        myFunction() { this.x = 123; }
      }`,
      output: `
      import { set } from '@ember/object';
import { computed as c } from '@ember/object';
      import Component from '@ember/component';
      class MyClass extends Component {
        @c('x') get myProp() {}
        myFunction() { set(this, 'x', 123); }
      }`,
      errors: [{ message: ERROR_MESSAGE, type: 'AssignmentExpression' }],
    },
    {
      // Assignment of dependent key property (should use aliased `set` import instead of adding a new import).
      filename: '/components/foo.js',
      code: `
      import { computed as c, set as s } from '@ember/object';
      import Component from '@ember/component';
      class MyClass extends Component {
        @c('x') get myProp() {}
        myFunction() { this.x = 123; }
      }`,
      output: `
      import { computed as c, set as s } from '@ember/object';
      import Component from '@ember/component';
      class MyClass extends Component {
        @c('x') get myProp() {}
        myFunction() { s(this, 'x', 123); }
      }`,
      errors: [{ message: ERROR_MESSAGE, type: 'AssignmentExpression' }],
    },
    {
      // Assignment of dependent key property (inside generic class that does not extend from an Ember module)
      filename: '/components/foo.js',
      code: `
      import { computed } from '@ember/object';
      class MyClass {
        @computed('x') get myProp() {}
        myFunction() { this.x = 123; }
      }`,
      output: `
      import { set } from '@ember/object';
import { computed } from '@ember/object';
      class MyClass {
        @computed('x') get myProp() {}
        myFunction() { set(this, 'x', 123); }
      }`,
      errors: [{ message: ERROR_MESSAGE, type: 'AssignmentExpression' }],
    },
    {
      // `args` should not be treated special outside of Glimmer components.
      filename: '/components/foo.js',
      code: `
      import { computed } from '@ember/object';
      import Component from '@ember/component';
      class MyClass extends Component {
        @computed('args.x') get prop() {}
        myFunction() { this.args.x = 123; }
      }`,
      output: `
      import { set } from '@ember/object';
import { computed } from '@ember/object';
      import Component from '@ember/component';
      class MyClass extends Component {
        @computed('args.x') get prop() {}
        myFunction() { set(this, 'args.x', 123); }
      }`,
      errors: [{ message: ERROR_MESSAGE, type: 'AssignmentExpression' }],
    },
    {
      // Manages state of inner class separate from outer class.
      filename: '/components/foo.js',
      code: `
      import { computed } from '@ember/object';
      import Component from '@ember/component';
      class Class1 extends Component {
        @computed('x') get myProp() {}
        function1() {
          class InternalStateTracker {
            @tracked x;
            innerFunction() {
              this.x = 123; // Allowed because tracked in this inner class.
            }
          }
        }
        function2() {
          this.x = 123;
        }
      }`,
      output: `
      import { set } from '@ember/object';
import { computed } from '@ember/object';
      import Component from '@ember/component';
      class Class1 extends Component {
        @computed('x') get myProp() {}
        function1() {
          class InternalStateTracker {
            @tracked x;
            innerFunction() {
              this.x = 123; // Allowed because tracked in this inner class.
            }
          }
        }
        function2() {
          set(this, 'x', 123);
        }
      }`,
      errors: [{ message: ERROR_MESSAGE, type: 'AssignmentExpression' }],
    },

    // **********************
    // Macros (native class)
    // **********************

    {
      // Simple macro (`readOnly`), renamed
      filename: '/components/foo.js',
      code: `
      import { computed } from '@ember/object';
      import { readOnly as ro } from '@ember/object/computed';
      import Component from '@ember/component';
      class MyClass extends Component {
        @ro('x') get myProp() {}
        myFunctionX() { this.x = 123; }
      }`,
      output: `
      import { set } from '@ember/object';
import { computed } from '@ember/object';
      import { readOnly as ro } from '@ember/object/computed';
      import Component from '@ember/component';
      class MyClass extends Component {
        @ro('x') get myProp() {}
        myFunctionX() { set(this, 'x', 123); }
      }`,
      errors: [{ message: ERROR_MESSAGE, type: 'AssignmentExpression' }],
    },
    {
      // Simple macro (`computed.readOnly`), with `computed` rename
      filename: '/components/foo.js',
      code: `
      import { computed as c } from '@ember/object';
      import Component from '@ember/component';
      class MyClass extends Component {
        @c.readOnly('x') get myProp() {}
        myFunctionX() { this.x = 123; }
      }`,
      output: `
      import { set } from '@ember/object';
import { computed as c } from '@ember/object';
      import Component from '@ember/component';
      class MyClass extends Component {
        @c.readOnly('x') get myProp() {}
        myFunctionX() { set(this, 'x', 123); }
      }`,
      errors: [{ message: ERROR_MESSAGE, type: 'AssignmentExpression' }],
    },
    {
      // Macro with non-tracked arguments (`mapBy`)
      filename: '/components/foo.js',
      code: `
      import { computed } from '@ember/object';
      import { mapBy } from '@ember/object/computed';
      import Component from '@ember/component';
      class MyClass extends Component {
        @mapBy('chores', 'done', true) get myProp() {}
        myFunction1() { this.chores = 123; }
        myFunction2() { this.done = 123; } // Allowed since this isn't a dependent key.
      }`,
      output: `
      import { set } from '@ember/object';
import { computed } from '@ember/object';
      import { mapBy } from '@ember/object/computed';
      import Component from '@ember/component';
      class MyClass extends Component {
        @mapBy('chores', 'done', true) get myProp() {}
        myFunction1() { set(this, 'chores', 123); }
        myFunction2() { this.done = 123; } // Allowed since this isn't a dependent key.
      }`,
      errors: [{ message: ERROR_MESSAGE, type: 'AssignmentExpression' }],
    },

    // **********************
    // Classic class
    // **********************

    {
      // Assignment of dependent key property
      filename: '/components/foo.js',
      code: `
      import { computed } from '@ember/object';
      import Component from '@ember/component';
      import { tracked } from '@glimmer/tracking';
      class MyClass extends Component {
        @tracked x // This is here to ensure that it is ignored in the subsequent class.
      }
      Component.extend({
        myProp: computed('x', function() {}),
        myFunction() { this.x = 123; }
      })`,
      output: `
      import { set } from '@ember/object';
import { computed } from '@ember/object';
      import Component from '@ember/component';
      import { tracked } from '@glimmer/tracking';
      class MyClass extends Component {
        @tracked x // This is here to ensure that it is ignored in the subsequent class.
      }
      Component.extend({
        myProp: computed('x', function() {}),
        myFunction() { set(this, 'x', 123); }
      })`,
      errors: [{ message: ERROR_MESSAGE, type: 'AssignmentExpression' }],
    },

    // **********************
    // Macros (classic class)
    // **********************

    {
      // Simple macro (`readOnly`), renamed
      filename: '/components/foo.js',
      code: `
      import { readOnly as ro } from '@ember/object/computed';
      import Component from '@ember/component';
      Component.extend({
        myProp: ro('x'),
        myFunction() { this.x = 123; }
      })`,
      output: `
      import { set } from '@ember/object';
import { readOnly as ro } from '@ember/object/computed';
      import Component from '@ember/component';
      Component.extend({
        myProp: ro('x'),
        myFunction() { set(this, 'x', 123); }
      })`,
      errors: [{ message: ERROR_MESSAGE, type: 'AssignmentExpression' }],
    },
    {
      // Simple macro (`computed.readOnly`), with `computed` rename
      filename: '/components/foo.js',
      code: `
      import { computed as c } from '@ember/object';
      import Component from '@ember/component';
      Component.extend({
        myProp: c.readOnly('x'),
        myFunction() { this.x = 123; }
      })`,
      output: `
      import { set } from '@ember/object';
import { computed as c } from '@ember/object';
      import Component from '@ember/component';
      Component.extend({
        myProp: c.readOnly('x'),
        myFunction() { set(this, 'x', 123); }
      })`,
      errors: [{ message: ERROR_MESSAGE, type: 'AssignmentExpression' }],
    },

    {
      // Macro with non-tracked arguments (`mapBy`)
      filename: '/components/foo.js',
      code: `
      import { mapBy } from '@ember/object/computed';
      import Component from '@ember/component';
      Component.extend({
        myProp: mapBy('chores', 'done', true),
        myFunction1() { this.chores = 123; },
        myFunction2() { this.done = 123; } // Allowed since this isn't a dependent key.
      })`,
      output: `
      import { set } from '@ember/object';
import { mapBy } from '@ember/object/computed';
      import Component from '@ember/component';
      Component.extend({
        myProp: mapBy('chores', 'done', true),
        myFunction1() { set(this, 'chores', 123); },
        myFunction2() { this.done = 123; } // Allowed since this isn't a dependent key.
      })`,
      errors: [{ message: ERROR_MESSAGE, type: 'AssignmentExpression' }],
    },
    {
      // Custom macro for direct strings
      filename: '/components/foo.js',
      code: `
      import { rejectBy } from 'custom-macros/custom';
      import Component from '@ember/component';
      Component.extend({
        myProp: rejectBy('chores', 'done', true),
        myFunction1() { this.chores = 123; },
        myFunction2() { this.done = 123; }, // Allowed since this isn't a dependent key.
      })`,
      output: `
      import { set } from '@ember/object';
import { rejectBy } from 'custom-macros/custom';
      import Component from '@ember/component';
      Component.extend({
        myProp: rejectBy('chores', 'done', true),
        myFunction1() { set(this, 'chores', 123); },
        myFunction2() { this.done = 123; }, // Allowed since this isn't a dependent key.
      })`,
      options: [
        {
          extraMacros: [
            {
              path: 'custom-macros/custom',
              name: 'rejectBy',
              argumentFormat: [
                {
                  strings: {
                    count: 1,
                  },
                },
              ],
            },
          ],
        },
      ],
      errors: [{ message: ERROR_MESSAGE, type: 'AssignmentExpression' }],
    },
    {
      // Custom macro for object values
      filename: '/components/foo.js',
      code: `
      import { customComputed } from 'custom-macros/ind';
      import Component from '@ember/component';
      Component.extend({
        myProp: customComputed.t('unused', { tKey: 'dependency.key' }),
        myFunction1() { this.dependency = 123; },
        myFunction2() { this.unused = 123; }, // Allowed since this isn't a dependent key.
        myFunction3() { this.tKey = 123; }, // Allowed since this is a key, not a value.
      })`,
      output: `
      import { set } from '@ember/object';
import { customComputed } from 'custom-macros/ind';
      import Component from '@ember/component';
      Component.extend({
        myProp: customComputed.t('unused', { tKey: 'dependency.key' }),
        myFunction1() { set(this, 'dependency', 123); },
        myFunction2() { this.unused = 123; }, // Allowed since this isn't a dependent key.
        myFunction3() { this.tKey = 123; }, // Allowed since this is a key, not a value.
      })`,
      options: [
        {
          extraMacros: [
            {
              path: 'custom-macros/custom',
              name: 't',
              indexPath: 'custom-macros/ind',
              indexName: 'customComputed',
              argumentFormat: [
                {
                  objects: {
                    index: 1,
                  },
                },
              ],
            },
          ],
        },
      ],
      errors: [{ message: ERROR_MESSAGE, type: 'AssignmentExpression' }],
    },
  ],
});
