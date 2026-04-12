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
        {{badge
          data-test-profile-card-one-to-one-connection-distance
          degreeText=(t "i18n_distance_v2" distance=recipientDistance)
          degreeA11yText=(t "i18n_distance_a11y_v2" distance=recipientDistance)
        }}
      </template>`,
      output: `<template>
        {{badge
          data-test-profile-card-one-to-one-connection-distance=true
          degreeText=(t "i18n_distance_v2" distance=recipientDistance)
          degreeA11yText=(t "i18n_distance_a11y_v2" distance=recipientDistance)
        }}
      </template>`,
      errors: [
        {
          message:
            'Passing a `data-test-*` positional param to a curly invocation should be avoided.',
        },
      ],
    },
  ],
});

const hbsRuleTester = new RuleTester({
  parser: require.resolve('ember-eslint-parser/hbs'),
  parserOptions: {
    ecmaVersion: 2022,
    sourceType: 'module',
  },
});

hbsRuleTester.run('template-no-positional-data-test-selectors', rule, {
  valid: [
    `
      {{#if data-test-foo}}
      {{/if}}
    `,
    `
      <div data-test-blah></div>
    `,
    `
      <Foo data-test-derp />
    `,
    `
      {{something data-test-lol=true}}
    `,
    `
      {{#if dataSomething}}
        <div> hello </div>
      {{/if}}
    `,
    `
      <div
        data-test-msg-connections-typeahead-result={{true}}
      >
      </div>
    `,
    `
      <div
        data-test-msg-connections-typeahead-result="foo-bar"
      >
      </div>
    `,
    `
      {{badge
        data-test-profile-card-one-to-one-connection-distance=true
        degreeText=(t "i18n_distance_v2" distance=recipientDistance)
        degreeA11yText=(t "i18n_distance_a11y_v2" distance=recipientDistance)
      }}
    `,
    `
      {{badge
        data-test-profile-card-one-to-one-connection-distance="foo-bar"
        degreeText=(t "i18n_distance_v2" distance=recipientDistance)
        degreeA11yText=(t "i18n_distance_a11y_v2" distance=recipientDistance)
      }}
    `,
    `
      <div
        data-test-profile=true
      >
        hello
      </div>
    `,
  ],
  invalid: [
    {
      code: `
        {{badge
          data-test-profile-card-one-to-one-connection-distance
          degreeText=(t "i18n_distance_v2" distance=recipientDistance)
          degreeA11yText=(t "i18n_distance_a11y_v2" distance=recipientDistance)
        }}
      `,
      output: `
        {{badge
          data-test-profile-card-one-to-one-connection-distance=true
          degreeText=(t "i18n_distance_v2" distance=recipientDistance)
          degreeA11yText=(t "i18n_distance_a11y_v2" distance=recipientDistance)
        }}
      `,
      errors: [
        {
          message:
            'Passing a `data-test-*` positional param to a curly invocation should be avoided.',
        },
      ],
    },
  ],
});
