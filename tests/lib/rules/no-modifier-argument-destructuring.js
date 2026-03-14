const rule = require('../../../lib/rules/no-modifier-argument-destructuring');
const RuleTester = require('eslint').RuleTester;

const { ERROR_MESSAGE } = rule;

const ruleTester = new RuleTester({
  parserOptions: {
    ecmaVersion: 2022,
    sourceType: 'module',
  },
});

ruleTester.run('no-modifier-argument-destructuring', rule, {
  valid: [
    // Not importing from ember-modifier
    `
      function modifier(fn) { return fn; }
      modifier((element, [text]) => {});
    `,

    // No destructuring of positional args
    `
      import { modifier } from 'ember-modifier';
      modifier((element, positional) => {
        element.addEventListener('hover', () => console.log(positional[0]));
      });
    `,

    // No destructuring of named args
    `
      import { modifier } from 'ember-modifier';
      modifier((element, positional, named) => {
        element.addEventListener('hover', () => console.log(named.text));
      });
    `,

    // Only element parameter
    `
      import { modifier } from 'ember-modifier';
      modifier((element) => {
        element.addEventListener('click', () => {});
      });
    `,

    // No arguments at all
    `
      import { modifier } from 'ember-modifier';
      modifier(() => {});
    `,

    // Using a non-modifier function from ember-modifier
    `
      import { something } from 'ember-modifier';
      something((element, [text]) => {});
    `,

    // Modifier called with non-function argument
    `
      import { modifier } from 'ember-modifier';
      modifier(myCallback);
    `,

    // Destructuring element (first param) is fine as it's not tracked
    `
      import { modifier } from 'ember-modifier';
      modifier(({ tagName }) => {});
    `,

    // Function expression (not arrow) without destructuring
    `
      import { modifier } from 'ember-modifier';
      modifier(function(element, positional) {
        console.log(positional[0]);
      });
    `,
  ],

  invalid: [
    // Destructuring positional args (arrow function)
    {
      code: `
        import { modifier } from 'ember-modifier';
        modifier((element, [text]) => {
          element.addEventListener('hover', () => console.log(text));
        });
      `,
      output: null,
      errors: [{ message: ERROR_MESSAGE, type: 'ArrayPattern' }],
    },

    // Destructuring positional args (function expression)
    {
      code: `
        import { modifier } from 'ember-modifier';
        modifier(function(element, [text]) {
          element.addEventListener('hover', () => console.log(text));
        });
      `,
      output: null,
      errors: [{ message: ERROR_MESSAGE, type: 'ArrayPattern' }],
    },

    // Destructuring named args
    {
      code: `
        import { modifier } from 'ember-modifier';
        modifier((element, positional, { text }) => {
          element.addEventListener('hover', () => console.log(text));
        });
      `,
      output: null,
      errors: [{ message: ERROR_MESSAGE, type: 'ObjectPattern' }],
    },

    // Both positional and named args destructured
    {
      code: `
        import { modifier } from 'ember-modifier';
        modifier((element, [text], { title }) => {
          element.addEventListener('hover', () => console.log(text, title));
        });
      `,
      output: null,
      errors: [
        { message: ERROR_MESSAGE, type: 'ArrayPattern' },
        { message: ERROR_MESSAGE, type: 'ObjectPattern' },
      ],
    },

    // Renamed import
    {
      code: `
        import { modifier as createModifier } from 'ember-modifier';
        createModifier((element, [text]) => {
          element.addEventListener('hover', () => console.log(text));
        });
      `,
      output: null,
      errors: [{ message: ERROR_MESSAGE, type: 'ArrayPattern' }],
    },

    // Multiple positional args destructured
    {
      code: `
        import { modifier } from 'ember-modifier';
        modifier((element, [text, count]) => {
          element.addEventListener('hover', () => console.log(text, count));
        });
      `,
      output: null,
      errors: [{ message: ERROR_MESSAGE, type: 'ArrayPattern' }],
    },
  ],
});
