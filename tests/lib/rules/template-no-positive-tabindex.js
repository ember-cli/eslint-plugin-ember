//------------------------------------------------------------------------------
// Requirements
//------------------------------------------------------------------------------

const rule = require('../../../lib/rules/template-no-positive-tabindex');
const RuleTester = require('eslint').RuleTester;

//------------------------------------------------------------------------------
// Tests
//------------------------------------------------------------------------------

const ruleTester = new RuleTester({
  parser: require.resolve('ember-eslint-parser'),
  parserOptions: { ecmaVersion: 2022, sourceType: 'module' },
});

ruleTester.run('template-no-positive-tabindex', rule, {
  valid: [
    '<template><button tabindex="0"></button></template>',
    '<template><button tabindex="-1"></button></template>',
    '<template><button tabindex={{-1}}>baz</button></template>',
    '<template><button tabindex={{"-1"}}>baz</button></template>',
    '<template><button tabindex="{{-1}}">baz</button></template>',
    '<template><button tabindex="{{"-1"}}">baz</button></template>',
    '<template><button tabindex="{{if this.show -1}}">baz</button></template>',
    '<template><button tabindex="{{if this.show "-1" "0"}}">baz</button></template>',
    '<template><button tabindex="{{if (not this.show) "-1" "0"}}">baz</button></template>',
    '<template><button tabindex={{if this.show -1}}>baz</button></template>',
    '<template><button tabindex={{if this.show "-1" "0"}}>baz</button></template>',
    '<template><button tabindex={{if (not this.show) "-1" "0"}}>baz</button></template>',
  ],

  invalid: [
    {
      code: '<template><button tabindex={{someProperty}}></button></template>',
      output: null,
      errors: [{ message: 'Tabindex values must be negative numeric.' }],
    },
    {
      code: '<template><button tabindex="1"></button></template>',
      output: null,
      errors: [{ message: 'Avoid positive integer values for tabindex.' }],
    },
    {
      code: '<template><button tabindex="text"></button></template>',
      output: null,
      errors: [{ message: 'Tabindex values must be negative numeric.' }],
    },
    {
      code: '<template><button tabindex={{true}}></button></template>',
      output: null,
      errors: [{ message: 'Tabindex values must be negative numeric.' }],
    },
    {
      code: '<template><button tabindex="{{false}}"></button></template>',
      output: null,
      errors: [{ message: 'Tabindex values must be negative numeric.' }],
    },
    {
      code: '<template><button tabindex="{{5}}"></button></template>',
      output: null,
      errors: [{ message: 'Avoid positive integer values for tabindex.' }],
    },
    {
      code: '<template><button tabindex="{{if a 1 -1}}"></button></template>',
      output: null,
      errors: [{ message: 'Avoid positive integer values for tabindex.' }],
    },
    {
      code: '<template><button tabindex="{{if a -1 1}}"></button></template>',
      output: null,
      errors: [{ message: 'Avoid positive integer values for tabindex.' }],
    },
    {
      code: '<template><button tabindex="{{if a 1}}"></button></template>',
      output: null,
      errors: [{ message: 'Avoid positive integer values for tabindex.' }],
    },
    {
      code: '<template><button tabindex="{{if (not a) 1}}"></button></template>',
      output: null,
      errors: [{ message: 'Avoid positive integer values for tabindex.' }],
    },
    {
      code: '<template><button tabindex="{{unless a 1}}"></button></template>',
      output: null,
      errors: [{ message: 'Avoid positive integer values for tabindex.' }],
    },
    {
      code: '<template><button tabindex="{{unless a -1 1}}"></button></template>',
      output: null,
      errors: [{ message: 'Avoid positive integer values for tabindex.' }],
    },
  ],
});

const hbsRuleTester = new RuleTester({
  parser: require.resolve('ember-eslint-parser/hbs'),
  parserOptions: { ecmaVersion: 2022, sourceType: 'module' },
});

hbsRuleTester.run('template-no-positive-tabindex', rule, {
  valid: [
    '<button tabindex="0"></button>',
    '<button tabindex="-1"></button>',
    '<button tabindex={{-1}}>baz</button>',
    '<button tabindex={{"-1"}}>baz</button>',
    '<button tabindex="{{-1}}">baz</button>',
    '<button tabindex="{{"-1"}}">baz</button>',
    '<button tabindex="{{if this.show -1}}">baz</button>',
    '<button tabindex="{{if this.show "-1" "0"}}">baz</button>',
    '<button tabindex="{{if (not this.show) "-1" "0"}}">baz</button>',
    '<button tabindex={{if this.show -1}}>baz</button>',
    '<button tabindex={{if this.show "-1" "0"}}>baz</button>',
    '<button tabindex={{if (not this.show) "-1" "0"}}>baz</button>',
  ],
  invalid: [
    {
      code: '<button tabindex={{someProperty}}></button>',
      output: null,
      errors: [{ message: 'Tabindex values must be negative numeric.' }],
    },
    {
      code: '<button tabindex="1"></button>',
      output: null,
      errors: [{ message: 'Avoid positive integer values for tabindex.' }],
    },
    {
      code: '<button tabindex="text"></button>',
      output: null,
      errors: [{ message: 'Tabindex values must be negative numeric.' }],
    },
    {
      code: '<button tabindex={{true}}></button>',
      output: null,
      errors: [{ message: 'Tabindex values must be negative numeric.' }],
    },
    {
      code: '<button tabindex="{{false}}"></button>',
      output: null,
      errors: [{ message: 'Tabindex values must be negative numeric.' }],
    },
    {
      code: '<button tabindex="{{5}}"></button>',
      output: null,
      errors: [{ message: 'Avoid positive integer values for tabindex.' }],
    },
    {
      code: '<button tabindex="{{if a 1 -1}}"></button>',
      output: null,
      errors: [{ message: 'Avoid positive integer values for tabindex.' }],
    },
    {
      code: '<button tabindex="{{if a -1 1}}"></button>',
      output: null,
      errors: [{ message: 'Avoid positive integer values for tabindex.' }],
    },
    {
      code: '<button tabindex="{{if a 1}}"></button>',
      output: null,
      errors: [{ message: 'Avoid positive integer values for tabindex.' }],
    },
    {
      code: '<button tabindex="{{if (not a) 1}}"></button>',
      output: null,
      errors: [{ message: 'Avoid positive integer values for tabindex.' }],
    },
    {
      code: '<button tabindex="{{unless a 1}}"></button>',
      output: null,
      errors: [{ message: 'Avoid positive integer values for tabindex.' }],
    },
    {
      code: '<button tabindex="{{unless a -1 1}}"></button>',
      output: null,
      errors: [{ message: 'Avoid positive integer values for tabindex.' }],
    },
  ],
});
