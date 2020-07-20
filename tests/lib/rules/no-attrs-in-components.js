'use strict';

//------------------------------------------------------------------------------
// Requirements
//------------------------------------------------------------------------------

const rule = require('../../../lib/rules/no-attrs-in-components');
const RuleTester = require('eslint').RuleTester;

const { ERROR_MESSAGE } = rule;

//------------------------------------------------------------------------------
// Tests
//------------------------------------------------------------------------------

const ruleTester = new RuleTester({
  parserOptions: { ecmaVersion: 6, sourceType: 'module' },
});

ruleTester.run('no-attrs-in-components', rule, {
  valid: [
    "import Component from '@ember/component'; Component.extend({ init() { this.foo.bar; }  });",
    "import Component from '@ember/component'; class MyComponent extends Component { init() { this.foo.bar; } }",
    "import Component from '@glimmer/component'; class MyComponent extends Component { constructor() { this.foo.bar; } }",

    // After a component:
    "import Component from '@ember/component'; Component.extend({}); this.attrs.foo;",
    "import Component from '@ember/component'; class MyComponent extends Component {} this.attrs.foo;",

    // Not a component:
    'Random.extend({ init() { this.attrs.foo; }  });',
    "import Component from 'not-a-component'; class MyComponent extends Component { init() { this.attrs.foo; } }",
  ],

  invalid: [
    {
      code:
        "import Component from '@ember/component'; Component.extend({ init() { this.attrs.foo; } });",
      output: null,
      errors: [{ message: ERROR_MESSAGE, type: 'Identifier' }],
    },
    {
      code:
        "import Component from '@ember/component'; class MyComponent extends Component { init() { this.attrs.foo; } }",
      output: null,
      errors: [{ message: ERROR_MESSAGE, type: 'Identifier' }],
    },
    {
      code:
        "import Component from '@glimmer/component'; class MyComponent extends Component { constructor() { this.attrs.foo; } }",
      output: null,
      errors: [{ message: ERROR_MESSAGE, type: 'Identifier' }],
    },
  ],
});
