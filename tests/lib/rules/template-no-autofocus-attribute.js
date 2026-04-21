//------------------------------------------------------------------------------
// Requirements
//------------------------------------------------------------------------------

const rule = require('../../../lib/rules/template-no-autofocus-attribute');
const RuleTester = require('eslint').RuleTester;

//------------------------------------------------------------------------------
// Tests
//------------------------------------------------------------------------------

const ruleTester = new RuleTester({
  parser: require.resolve('ember-eslint-parser'),
  parserOptions: { ecmaVersion: 2022, sourceType: 'module' },
});

ruleTester.run('template-no-autofocus-attribute', rule, {
  valid: [
    `<template>
      <input type="text" />
    </template>`,
    `<template>
      <button>Click me</button>
    </template>`,
    // Value-aware: explicit falsy values opt out (jsx-a11y parity).
    `<template>
      <input autofocus="false" />
    </template>`,
    `<template>
      <input autofocus={{false}} />
    </template>`,
    `<template>
      <input autofocus={{"false"}} />
    </template>`,
    `<template>
      {{input autofocus=false}}
    </template>`,
    `<template>
      {{input autofocus="false"}}
    </template>`,
    // Dialog exception (MDN): autofocus on <dialog> is recommended.
    `<template>
      <dialog autofocus></dialog>
    </template>`,
    // Dialog descendants are also exempt (angular-eslint parity).
    `<template>
      <dialog>
        <button autofocus>Close</button>
      </dialog>
    </template>`,
    `<template>
      <dialog>
        <div>
          <input autofocus />
        </div>
      </dialog>
    </template>`,
  ],

  invalid: [
    {
      code: `<template>
        <input type="text" autofocus />
      </template>`,
      output: `<template>
        <input type="text"/>
      </template>`,
      errors: [
        {
          message:
            'Avoid using autofocus attribute. Autofocusing elements can cause usability issues for sighted and non-sighted users.',
          type: 'GlimmerAttrNode',
        },
      ],
    },
    {
      code: `<template>
        <textarea autofocus></textarea>
      </template>`,
      output: `<template>
        <textarea></textarea>
      </template>`,
      errors: [
        {
          type: 'GlimmerAttrNode',
        },
      ],
    },
    {
      code: `<template>
        {{input type="text" autofocus=true}}
      </template>`,
      output: null,
      errors: [
        {
          messageId: 'noAutofocus',
          type: 'GlimmerHashPair',
        },
      ],
    },
    {
      code: `<template>
        {{component "input" type="text" autofocus=true}}
      </template>`,
      output: null,
      errors: [
        {
          messageId: 'noAutofocus',
          type: 'GlimmerHashPair',
        },
      ],
    },
    {
      code: `<template>
        <div autofocus>
        </div>
      </template>`,
      output: `<template>
        <div>
        </div>
      </template>`,
      errors: [
        {
          messageId: 'noAutofocus',
          type: 'GlimmerAttrNode',
        },
      ],
    },
    {
      code: `<template>
        <h1 autofocus>
        </h1>
      </template>`,
      output: `<template>
        <h1>
        </h1>
      </template>`,
      errors: [
        {
          messageId: 'noAutofocus',
          type: 'GlimmerAttrNode',
        },
      ],
    },
    {
      code: `<template>
        <input autofocus="autofocus" />
      </template>`,
      output: `<template>
        <input />
      </template>`,
      errors: [
        {
          messageId: 'noAutofocus',
          type: 'GlimmerAttrNode',
        },
      ],
    },
    // Value-aware: truthy literals and any dynamic value still flag.
    {
      code: `<template>
        <input autofocus="true" />
      </template>`,
      output: `<template>
        <input />
      </template>`,
      errors: [
        {
          messageId: 'noAutofocus',
          type: 'GlimmerAttrNode',
        },
      ],
    },
    {
      code: `<template>
        <input autofocus={{true}} />
      </template>`,
      output: `<template>
        <input />
      </template>`,
      errors: [
        {
          messageId: 'noAutofocus',
          type: 'GlimmerAttrNode',
        },
      ],
    },
    {
      code: `<template>
        <input autofocus={{"true"}} />
      </template>`,
      output: `<template>
        <input />
      </template>`,
      errors: [
        {
          messageId: 'noAutofocus',
          type: 'GlimmerAttrNode',
        },
      ],
    },
    {
      code: `<template>
        <input autofocus={{this.shouldFocus}} />
      </template>`,
      output: `<template>
        <input />
      </template>`,
      errors: [
        {
          messageId: 'noAutofocus',
          type: 'GlimmerAttrNode',
        },
      ],
    },
    // Dialog exception only applies within <dialog>; siblings elsewhere still flag.
    {
      code: `<template>
        <section>
          <button autofocus>Focus</button>
        </section>
      </template>`,
      output: `<template>
        <section>
          <button>Focus</button>
        </section>
      </template>`,
      errors: [
        {
          messageId: 'noAutofocus',
          type: 'GlimmerAttrNode',
        },
      ],
    },
  ],
});
