//------------------------------------------------------------------------------
// Requirements
//------------------------------------------------------------------------------

const rule = require('../../../lib/rules/template-no-positional-data-test-selectors');
const RuleTester = require('eslint').RuleTester;

//------------------------------------------------------------------------------
// Tests
//------------------------------------------------------------------------------

const ruleTester = new RuleTester({
  parser: require.resolve('ember-eslint-parser'),
  parserOptions: { ecmaVersion: 2022, sourceType: 'module' },
});

ruleTester.run('template-no-positional-data-test-selectors', rule, {
  valid: [
    `<template>
      <div data-test-user-card></div>
    </template>`,
    `<template>
      <div data-test-item="my-item"></div>
    </template>`,
    `<template>
      <button data-test-button></button>
    </template>`,
  
    // Test cases ported from ember-template-lint
    `<template>
      {{#if data-test-foo}}
      {{/if}}
    </template>`,
    `<template>
      <div data-test-blah></div>
    </template>`,
    `<template>
      <Foo data-test-derp />
    </template>`,
    `<template>
      {{something data-test-lol=true}}
    </template>`,
    `<template>
      {{#if dataSomething}}
        <div> hello </div>
      {{/if}}
    </template>`,
    `<template>
      <div
        data-test-msg-connections-typeahead-result={{true}}
      >
      </div>
    </template>`,
    `<template>
      <div
        data-test-msg-connections-typeahead-result="foo-bar"
      >
      </div>
    </template>`,
    `<template>
      {{badge
        data-test-profile-card-one-to-one-connection-distance=true
        degreeText=(t "i18n_distance_v2" distance=recipientDistance)
        degreeA11yText=(t "i18n_distance_a11y_v2" distance=recipientDistance)
      }}
    </template>`,
    `<template>
      {{badge
        data-test-profile-card-one-to-one-connection-distance="foo-bar"
        degreeText=(t "i18n_distance_v2" distance=recipientDistance)
        degreeA11yText=(t "i18n_distance_a11y_v2" distance=recipientDistance)
      }}
    </template>`,
    `<template>
      <div
        data-test-profile=true
      >
        hello
      </div>
    </template>`,
  ],

  invalid: [
    {
      code: `<template>
        <div data-test-item="0"></div>
      </template>`,
      output: null,
      errors: [
        {
          message: 'Use named data-test attributes instead of positional data-test-* attributes.',
          type: 'GlimmerAttrNode',
        },
      ],
    },
    {
      code: `<template>
        <div data-test-card="1"></div>
      </template>`,
      output: null,
      errors: [
        {
          message: 'Use named data-test attributes instead of positional data-test-* attributes.',
          type: 'GlimmerAttrNode',
        },
      ],
    },
    {
      code: `<template>
        <button data-test-button="123"></button>
      </template>`,
      output: null,
      errors: [
        {
          message: 'Use named data-test attributes instead of positional data-test-* attributes.',
          type: 'GlimmerAttrNode',
        },
      ],
    },
  
    // Test cases ported from ember-template-lint
    {
      code: `<template>
        {{badge
          data-test-profile-card-one-to-one-connection-distance
          degreeText=(t "i18n_distance_v2" distance=recipientDistance)
          degreeA11yText=(t "i18n_distance_a11y_v2" distance=recipientDistance)
        }}
      </template>`,
      output: null,
      errors: [{ message: 'Use named data-test attributes instead of positional data-test-* attributes.' }],
    },
  ],
});
