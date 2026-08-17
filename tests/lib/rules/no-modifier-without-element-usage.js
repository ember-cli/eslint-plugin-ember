const rule = require('../../../lib/rules/no-modifier-without-element-usage');
const RuleTester = require('eslint').RuleTester;

const { ERROR_MESSAGE } = rule;

const ruleTester = new RuleTester({
  parserOptions: {
    ecmaVersion: 2022,
    sourceType: 'module',
  },
});

ruleTester.run('no-modifier-without-element-usage', rule, {
  valid: [
    // Not importing from ember-modifier
    `
      function modifier(fn) { return fn; }
      modifier(() => {});
    `,

    // Function modifier using the element
    `
      import { modifier } from 'ember-modifier';
      modifier((element) => {
        element.focus();
      });
    `,

    // Element used inside a nested function
    `
      import { modifier } from 'ember-modifier';
      modifier((element, positional) => {
        registerCleanup(() => element.remove());
      });
    `,

    // Element passed along to another function
    `
      import { modifier } from 'ember-modifier';
      modifier((element, positional) => {
        setup(element, positional[0]);
      });
    `,

    // Destructuring the element reads it
    `
      import { modifier } from 'ember-modifier';
      modifier(({ dataset }) => {
        console.log(dataset.id);
      });
    `,

    // Renamed function modifier import
    `
      import { modifier as createModifier } from 'ember-modifier';
      createModifier((element) => element.focus());
    `,

    // Function expression using the element
    `
      import { modifier } from 'ember-modifier';
      modifier(function (element) {
        element.focus();
      });
    `,

    // Callback declared elsewhere cannot be checked
    `
      import { modifier } from 'ember-modifier';
      modifier(myCallback);
    `,

    // A different export of ember-modifier
    `
      import { something } from 'ember-modifier';
      something(() => {});
    `,

    // Class modifier using the element in modify()
    `
      import Modifier from 'ember-modifier';
      export default class Autofocus extends Modifier {
        modify(element) {
          element.focus();
        }
      }
    `,

    // Class modifier using the element via a rest param
    `
      import Modifier from 'ember-modifier';
      export default class Autofocus extends Modifier {
        modify(...args) {
          args[0].focus();
        }
      }
    `,

    // Class modifier using the element in a class property arrow function
    `
      import Modifier from 'ember-modifier';
      export default class Autofocus extends Modifier {
        modify = (element) => {
          element.focus();
        };
      }
    `,

    // Legacy class modifier using this.element
    `
      import Modifier from 'ember-modifier';
      export default class Autofocus extends Modifier {
        didInstall() {
          this.element.focus();
        }
      }
    `,

    // ClassBasedModifier named import
    `
      import { ClassBasedModifier } from 'ember-modifier';
      export default class Autofocus extends ClassBasedModifier {
        modify(element) {
          element.focus();
        }
      }
    `,

    // Not an ember-modifier class
    `
      import Component from '@glimmer/component';
      export default class Foo extends Component {
        modify() {}
      }
    `,

    // `modify` assigned from elsewhere cannot be checked
    `
      import Modifier from 'ember-modifier';
      export default class Autofocus extends Modifier {
        modify = someHelper;
      }
    `,

    // Element usage inside a nested class does not hide the outer usage
    `
      import Modifier from 'ember-modifier';
      export default class Autofocus extends Modifier {
        modify(element) {
          class Inner {
            run() {
              return this.element;
            }
          }
          element.append(new Inner().run());
        }
      }
    `,
  ],

  invalid: [
    // Function modifier with no parameters
    {
      code: `
        import { modifier } from 'ember-modifier';
        modifier(() => {
          doSomething();
        });
      `,
      output: null,
      errors: [{ message: ERROR_MESSAGE, type: 'Identifier' }],
    },

    // Function modifier that ignores the element
    {
      code: `
        import { modifier } from 'ember-modifier';
        modifier((element, positional) => {
          doSomething(positional[0]);
        });
      `,
      output: null,
      errors: [{ message: ERROR_MESSAGE, type: 'Identifier' }],
    },

    // Function expression that ignores the element
    {
      code: `
        import { modifier } from 'ember-modifier';
        modifier(function (element) {
          doSomething();
        });
      `,
      output: null,
      errors: [{ message: ERROR_MESSAGE, type: 'Identifier' }],
    },

    // Renamed import
    {
      code: `
        import { modifier as createModifier } from 'ember-modifier';
        createModifier((element) => doSomething());
      `,
      output: null,
      errors: [{ message: ERROR_MESSAGE, type: 'Identifier' }],
    },

    // Shadowed element name inside the callback is not a reference to the param
    {
      code: `
        import { modifier } from 'ember-modifier';
        modifier((element) => {
          const inner = (element) => element.focus();
          inner(document.body);
        });
      `,
      output: null,
      errors: [{ message: ERROR_MESSAGE, type: 'Identifier' }],
    },

    // Class modifier whose modify() ignores the element
    {
      code: `
        import Modifier from 'ember-modifier';
        export default class Logger extends Modifier {
          modify(element, positional) {
            console.log(positional[0]);
          }
        }
      `,
      output: null,
      errors: [{ message: ERROR_MESSAGE, type: 'Identifier' }],
    },

    // Class modifier whose modify() takes no parameters
    {
      code: `
        import Modifier from 'ember-modifier';
        export default class Logger extends Modifier {
          modify() {
            console.log('rendered');
          }
        }
      `,
      output: null,
      errors: [{ message: ERROR_MESSAGE, type: 'Identifier' }],
    },

    // Class property arrow function that ignores the element
    {
      code: `
        import Modifier from 'ember-modifier';
        export default class Logger extends Modifier {
          modify = (element) => {
            console.log('rendered');
          };
        }
      `,
      output: null,
      errors: [{ message: ERROR_MESSAGE, type: 'Identifier' }],
    },

    // Class modifier with no modify() and no this.element
    {
      code: `
        import Modifier from 'ember-modifier';
        export default class Logger extends Modifier {
          didInstall() {
            console.log('installed');
          }
        }
      `,
      output: null,
      errors: [{ message: ERROR_MESSAGE, type: 'Identifier' }],
    },

    // ClassBasedModifier named import
    {
      code: `
        import { ClassBasedModifier } from 'ember-modifier';
        export default class Logger extends ClassBasedModifier {
          modify() {}
        }
      `,
      output: null,
      errors: [{ message: ERROR_MESSAGE, type: 'Identifier' }],
    },

    // Class expression
    {
      code: `
        import Modifier from 'ember-modifier';
        export default class extends Modifier {
          modify() {}
        }
      `,
      output: null,
      errors: [{ message: ERROR_MESSAGE, type: 'Identifier' }],
    },

    // Both a function modifier and a class modifier in one file
    {
      code: `
        import Modifier, { modifier } from 'ember-modifier';
        modifier(() => doSomething());
        export default class Logger extends Modifier {
          modify() {}
        }
      `,
      output: null,
      errors: [
        { message: ERROR_MESSAGE, type: 'Identifier' },
        { message: ERROR_MESSAGE, type: 'Identifier' },
      ],
    },
  ],
});
