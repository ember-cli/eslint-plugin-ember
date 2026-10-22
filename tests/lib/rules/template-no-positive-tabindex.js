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
    {
      code: '<template><button tabindex="{{-1}}5"></button></template>',
      output: null,
      errors: [{ messageId: 'mustBeNegativeNumeric' }],
    },
    {
      code: '<template><button tabindex="{{0}}{{1}}"></button></template>',
      output: null,
      errors: [{ messageId: 'mustBeNegativeNumeric' }],
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
    {
      code: '<button tabindex="{{-1}}5"></button>',
      output: null,
      errors: [{ messageId: 'mustBeNegativeNumeric' }],
    },
  ],
});

// Type-aware checking of dynamic values. The filename must physically exist
// so the tsconfig includes it in the TypeScript program.

const path = require('node:path');

const PREPROCESSOR_DIR = path.join(__dirname, '../rules-preprocessor');
const FIXTURE = path.join(PREPROCESSOR_DIR, 'template-no-positive-tabindex/usage.gts');

const ruleTesterTyped = new RuleTester({
  parser: require.resolve('ember-eslint-parser'),
  parserOptions: {
    project: path.join(PREPROCESSOR_DIR, 'tsconfig.eslint.json'),
    tsconfigRootDir: PREPROCESSOR_DIR,
    ecmaVersion: 2022,
    sourceType: 'module',
    extraFileExtensions: ['.gts'],
  },
});

ruleTesterTyped.run('template-no-positive-tabindex (with TS project)', rule, {
  valid: [
    {
      filename: FIXTURE,
      code: `export default class Foo {
  tabIndex: 0 | -1 = 0;
  <template><div tabindex={{this.tabIndex}}></div></template>
}`,
    },
    {
      filename: FIXTURE,
      code: `export default class Foo {
  get tabIndex(): -1 | '0' | undefined { return undefined; }
  <template><div tabindex="{{this.tabIndex}}"></div></template>
}`,
    },
    {
      filename: FIXTURE,
      code: `export default class Foo {
  state = { tabIndex: -1 as const };
  <template><div tabindex={{this.state.tabIndex}}></div></template>
}`,
    },
    {
      filename: FIXTURE,
      code: `import ComponentBase from './component-stub';
export default class Foo extends ComponentBase<{ Args: { tabIndex: 0 | -1 } }> {
  <template><div tabindex={{@tabIndex}}></div></template>
}`,
    },
    {
      filename: FIXTURE,
      code: `import { safeTabindex } from './tabindex';
<template><div tabindex={{safeTabindex}}></div></template>`,
    },
    {
      filename: FIXTURE,
      code: `export const Foo = class {
  tabIndex: 0 | -1 = 0;
  <template><div tabindex={{this.tabIndex}}></div></template>
};`,
    },
    {
      filename: FIXTURE,
      code: `const tabIndex = -1;
<template><div tabindex={{tabIndex}}></div></template>`,
    },
    {
      filename: FIXTURE,
      code: `export default class Foo {
  tabIndex = -1 as const;
  <template><div tabindex={{if this.show this.tabIndex 0}}></div></template>
}`,
    },
  ],
  invalid: [
    {
      filename: FIXTURE,
      code: `export default class Foo {
  tabIndex = 0;
  <template><div tabindex={{this.tabIndex}}></div></template>
}`,
      output: null,
      errors: [{ messageId: 'mustBeNegativeNumeric' }],
    },
    {
      filename: FIXTURE,
      code: `export default class Foo {
  tabIndex: 0 | 1 = 0;
  <template><div tabindex={{this.tabIndex}}></div></template>
}`,
      output: null,
      errors: [{ messageId: 'positive' }],
    },
    {
      filename: FIXTURE,
      code: `export default class Foo {
  tabIndex: 0 | -1 | boolean = 0;
  <template><div tabindex={{this.tabIndex}}></div></template>
}`,
      output: null,
      errors: [{ messageId: 'mustBeNegativeNumeric' }],
    },
    {
      filename: FIXTURE,
      code: `import ComponentBase from './component-stub';
export default class Foo extends ComponentBase<{ Args: { tabIndex: number } }> {
  <template><div tabindex={{@tabIndex}}></div></template>
}`,
      output: null,
      errors: [{ messageId: 'mustBeNegativeNumeric' }],
    },
    {
      filename: FIXTURE,
      code: `import { positiveTabindex } from './tabindex';
<template><div tabindex={{positiveTabindex}}></div></template>`,
      output: null,
      errors: [{ messageId: 'positive' }],
    },
    {
      filename: FIXTURE,
      code: '<template>{{#each this.items as |item|}}<div tabindex={{item}}></div>{{/each}}</template>',
      output: null,
      errors: [{ messageId: 'mustBeNegativeNumeric' }],
    },
    {
      filename: FIXTURE,
      code: `export default class Foo {
  <template><div tabindex={{this.missing}}></div></template>
}`,
      output: null,
      errors: [{ messageId: 'mustBeNegativeNumeric' }],
    },
    {
      filename: FIXTURE,
      code: `export default class Foo {
  tabIndex = 2 as const;
  <template><div tabindex={{if this.show this.tabIndex 0}}></div></template>
}`,
      output: null,
      errors: [{ messageId: 'positive' }],
    },
    {
      filename: FIXTURE,
      code: `export default class Foo {
  tabIndex = -1 as const;
  <template><div tabindex={{this.tabIndex foo=1}}></div></template>
}`,
      output: null,
      errors: [{ messageId: 'mustBeNegativeNumeric' }],
    },
    {
      filename: FIXTURE,
      code: `export default class Foo {
  tabIndex = -1 as const;
  <template><div tabindex="{{this.tabIndex}}5"></div></template>
}`,
      output: null,
      errors: [{ messageId: 'mustBeNegativeNumeric' }],
    },
    {
      // `this` in a nested template-only component is not the enclosing class
      filename: FIXTURE,
      code: `export default class Foo {
  tabIndex = -1 as const;
  get Inner() { return <template><div tabindex={{this.tabIndex}}></div></template>; }
}`,
      output: null,
      errors: [{ messageId: 'mustBeNegativeNumeric' }],
    },
    {
      // `@args` in a nested template-only component are not the enclosing class's args
      filename: FIXTURE,
      code: `import ComponentBase from './component-stub';
export default class Foo extends ComponentBase<{ Args: { tabIndex: 0 | -1 } }> {
  static Inner = <template><div tabindex={{@tabIndex}}></div></template>;
}`,
      output: null,
      errors: [{ messageId: 'mustBeNegativeNumeric' }],
    },
  ],
});
