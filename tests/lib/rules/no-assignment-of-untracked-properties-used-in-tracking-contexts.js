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
  parser: require.resolve('babel-eslint'),
  parserOptions: {
    ecmaVersion: 6,
    sourceType: 'module',
  },
});

ruleTester.run('no-assignment-of-untracked-properties-used-in-tracking-contexts', rule, {
  valid: [
    {
      // Assignment of property which is not used as a dependent key.
      code: `
      import { computed } from '@ember/object';
      import Component from '@ember/component';
      class MyClass extends Component {
        @computed get prop1() {}
        @computed() get prop2() {}
        @computed('random') get prop3() {}
        myFunction() { this.x = 123; }
      }`,
      filename: '/components/foo.js',
    },
    {
      // Assignment of tracked property.
      code: `
      import { computed } from '@ember/object';
      import Component from '@ember/component';
      import { tracked } from '@glimmer/tracking';
      class MyClass extends Component {
        @tracked x
        @computed('x') get prop() {}
        myFunction() { this.x = 123; }
      }`,
      filename: '/components/foo.js',
    },
    {
      // Assignment of tracked property (with aliased `tracked` import).
      code: `
      import { computed } from '@ember/object';
      import Component from '@ember/component';
      import { tracked as t } from '@glimmer/tracking';
      class MyClass extends Component {
        @t x
        @computed('x') get prop() {}
        myFunction() { this.x = 123; }
      }`,
      filename: '/components/foo.js',
    },
    {
      // Assignment of property in the Glimmer component args hash which is automatically tracked.
      code: `
      import { computed } from '@ember/object';
      import Component from '@glimmer/component';
      class MyClass extends Component {
        @computed('args.x') get prop() {}
        myFunction() { this.args.x = 123; }
      }`,
      filename: '/components/foo.js',
    },
    {
      // Assignment of dependent key property but outside the class.
      code: `
      import { computed } from '@ember/object';
      import Component from '@ember/component';
      class MyClass extends Component {
        @computed('x') get prop() {}
      }
      this.x = 123;`,
      filename: '/components/foo.js',
    },
    {
      // Assignment missing `this.`.
      code: `
      import { computed } from '@ember/object';
      import Component from '@ember/component';
      class MyClass extends Component {
        @computed('x') get prop() {}
        myFunction() { x = 123; }
      }`,
      filename: '/components/foo.js',
    },
    {
      // Test files should be ignored.
      code: `
      import { computed } from '@ember/object';
      import Component from '@ember/component';
      class MyClass extends Component {
        @computed('x') get prop() {}
        myFunction() { this.x = 123; }
      }`,
      filename: '/components/foo-test.js',
    },
    {
      // Not an Ember module file.
      code: `
      import { computed } from '@ember/object';
      import SomeThing from 'random';
      SomeThing.extends({
        prop: computed('x', function() {}),
        myFunction() { this.x = 123; }
      })`,
      filename: '/random/foo.js',
    },
    {
      // Assignment in separate class from computed property.
      code: `
      import { computed } from '@ember/object';
      import Component from '@ember/component';
      class Class1 extends Component {
        @computed('x') get myProp() {}
      }
      class Class2 extends Component {
        myFunction() { this.x = 123; }
      }`,
      filename: '/components/foo.js',
    },
    {
      // Classic class.
      code: `
      import { computed } from '@ember/object';
      import Component from '@ember/component';
      Component.extends({
        prop: computed('x') // This is here to make sure it is not considered in the next class.
      });
      Component.extends({
        ...someProp.getProperties('propA', 'propB'),
        prop1: computed(),
        prop2: computed(function() {}),
        prop3: computed('random', function() {}),
        myFunction() { this.x = 123; }
      })`,
      filename: '/components/foo.js',
    },
  ],
  invalid: [
    {
      // Assignment of dependent key property.
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
      filename: '/components/foo.js',
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
      code: `
      import { computed } from '@ember/object';
      import Component from '@ember/component';
      class MyClass extends Component {
        @computed('x.{a,b}.@each.z') get myProp() {}
        myFunction() { this.x = 123; }
      }`,
      filename: '/components/foo.js',
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
      code: `
      import { computed as c } from '@ember/object';
      import Component from '@ember/component';
      class MyClass extends Component {
        @c('x') get myProp() {}
        myFunction() { this.x = 123; }
      }`,
      filename: '/components/foo.js',
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
      code: `
      import { computed as c, set as s } from '@ember/object';
      import Component from '@ember/component';
      class MyClass extends Component {
        @c('x') get myProp() {}
        myFunction() { this.x = 123; }
      }`,
      filename: '/components/foo.js',
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
      code: `
      import { computed } from '@ember/object';
      class MyClass {
        @computed('x') get myProp() {}
        myFunction() { this.x = 123; }
      }`,
      filename: '/components/foo.js',
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
      filename: '/components/foo.js',
      errors: [{ message: ERROR_MESSAGE, type: 'AssignmentExpression' }],
    },
    {
      // Manages state of inner class separate from outer class.
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
      filename: '/components/foo.js',
      errors: [{ message: ERROR_MESSAGE, type: 'AssignmentExpression' }],
    },
    {
      // Assignment of dependent key property (classic class).
      code: `
      import { computed } from '@ember/object';
      import Component from '@ember/component';
      import { tracked } from '@glimmer/tracking';
      class MyClass extends Component {
        @tracked x // This is here to ensure that it is ignored in the subsequent class.
      }
      Component.extends({
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
      Component.extends({
        myProp: computed('x', function() {}),
        myFunction() { set(this, 'x', 123); }
      })`,
      filename: '/components/foo.js',
      errors: [{ message: ERROR_MESSAGE, type: 'AssignmentExpression' }],
    },
  ],
});
