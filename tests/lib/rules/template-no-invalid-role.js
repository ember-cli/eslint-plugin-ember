//------------------------------------------------------------------------------
// Requirements
//------------------------------------------------------------------------------

const rule = require('../../../lib/rules/template-no-invalid-role');
const RuleTester = require('eslint').RuleTester;

//------------------------------------------------------------------------------
// Tests
//------------------------------------------------------------------------------

const ruleTester = new RuleTester({
  parser: require.resolve('ember-eslint-parser'),
  parserOptions: { ecmaVersion: 2022, sourceType: 'module' },
});

ruleTester.run('template-no-invalid-role', rule, {
  valid: [
    `<template>
      <div role="button">Click</div>
    </template>`,
    `<template>
      <div role="navigation">Nav</div>
    </template>`,
    `<template>
      <div role="main">Content</div>
    </template>`,
    `<template>
      <div role="presentation">Hidden</div>
    </template>`,
    `<template>
      <div role="none">Hidden</div>
    </template>`,
    `<template>
      <div>No role</div>
    </template>`,
    `<template>
      <div role={{this.dynamicRole}}>Dynamic</div>
    </template>`,

    '<template><div></div></template>',
    '<template><div role="none"></div></template>',
    '<template><div role="presentation"></div></template>',
    '<template><img alt="" role="none"></template>',
    '<template><img role="none"></template>',
    '<template><img alt="" role="presentation"></template>',
    '<template><img role="presentation"></template>',
    '<template><span role="none"></span></template>',
    '<template><span role="presentation"></span></template>',
    '<template><svg role="none"></svg></template>',
    '<template><svg role="presentation"></svg></template>',
    '<template><li role="none"></li></template>',
    '<template><li role="presentation"></li></template>',
    '<template><custom-component role="none"></custom-component></template>',
    '<template><AwesomeThing role="none"></AwesomeThing></template>',
    '<template><AwesomeThing role="presentation"></AwesomeThing></template>',
    '<template><table role="textbox"></table></template>',
    '<template><div role="{{if this.inModal "dialog" "contentinfo" }}"></div></template>',

    '<template><td role="cell">Data</td></template>',

    // Case-insensitive role matching
    '<template><div role="Button">Click</div></template>',
    '<template><div role="NAVIGATION">Nav</div></template>',
    '<template><div role="ALERT">Alert</div></template>',
    // catchNonexistentRoles: false — non-existent roles are not flagged
    {
      code: '<template><div role="command interface"></div></template>',
      options: [{ catchNonexistentRoles: false }],
    },

    // DPUB-ARIA (doc-*) and Graphics-ARIA (graphics-*) are valid per aria-query.
    '<template><div role="doc-abstract">Abstract</div></template>',
    '<template><section role="doc-chapter"></section></template>',
    '<template><svg role="graphics-document"></svg></template>',
    '<template><svg role="graphics-object"></svg></template>',

    // Whitespace-separated role fallback list — ARIA 1.2 §5.4. Each token
    // must individually be valid.
    '<template><div role="tabpanel row"></div></template>',
    '<template><svg role="graphics-document document"></svg></template>',
    '<template><section role="doc-appendix doc-bibliography"></section></template>',

    // ARIA 1.3 draft roles — not in aria-query 5.3.2 but spec-blessed, so
    // the rule accepts them via the inline allowlist.
    '<template><div role="associationlist"></div></template>',
    '<template><div role="associationlistitemkey"></div></template>',
    '<template><div role="associationlistitemvalue"></div></template>',
    '<template><div role="comment"></div></template>',
    '<template><div role="suggestion"></div></template>',
  ],

  invalid: [
    {
      code: `<template>
        <div role="invalid">Content</div>
      </template>`,
      output: null,
      errors: [
        {
          message: "Invalid ARIA role 'invalid'. Must be a valid ARIA role.",
          type: 'GlimmerAttrNode',
        },
      ],
    },
    {
      code: `<template>
        <div role="btn">Content</div>
      </template>`,
      output: null,
      errors: [
        {
          message: "Invalid ARIA role 'btn'. Must be a valid ARIA role.",
          type: 'GlimmerAttrNode',
        },
      ],
    },
    {
      code: `<template>
        <div role="fake-role">Content</div>
      </template>`,
      output: null,
      errors: [
        {
          message: "Invalid ARIA role 'fake-role'. Must be a valid ARIA role.",
          type: 'GlimmerAttrNode',
        },
      ],
    },

    {
      code: '<template><ul role="presentation"></ul></template>',
      output: null,
      errors: [
        { message: 'The role "presentation" should not be used on the semantic element <ul>.' },
      ],
    },
    {
      code: '<template><ol role="presentation"></ol></template>',
      output: null,
      errors: [
        { message: 'The role "presentation" should not be used on the semantic element <ol>.' },
      ],
    },
    {
      code: '<template><table role="presentation"></table></template>',
      output: null,
      errors: [
        { message: 'The role "presentation" should not be used on the semantic element <table>.' },
      ],
    },
    {
      code: '<template><table role="none"></table></template>',
      output: null,
      errors: [{ message: 'The role "none" should not be used on the semantic element <table>.' }],
    },
    {
      code: '<template><button role="presentation"></button></template>',
      output: null,
      errors: [
        { message: 'The role "presentation" should not be used on the semantic element <button>.' },
      ],
    },
    {
      code: '<template><button role="none"></button></template>',
      output: null,
      errors: [{ message: 'The role "none" should not be used on the semantic element <button>.' }],
    },
    {
      code: '<template><label role="presentation"></label></template>',
      output: null,
      errors: [
        { message: 'The role "presentation" should not be used on the semantic element <label>.' },
      ],
    },
    {
      code: '<template><label role="none"></label></template>',
      output: null,
      errors: [{ message: 'The role "none" should not be used on the semantic element <label>.' }],
    },
    {
      code: '<template><div role="command interface"></div></template>',
      output: null,
      errors: [{ message: "Invalid ARIA role 'command'. Must be a valid ARIA role." }],
    },
    {
      code: '<template><div role="COMMAND INTERFACE"></div></template>',
      output: null,
      errors: [{ message: "Invalid ARIA role 'command'. Must be a valid ARIA role." }],
    },
    {
      code: '<template><div role="command interface"></div></template>',
      output: null,
      options: [{ catchNonexistentRoles: true }],
      errors: [{ message: "Invalid ARIA role 'command'. Must be a valid ARIA role." }],
    },

    // Newly added SEMANTIC_ELEMENTS: presentation/none on iframe, video, audio
    {
      code: '<template><iframe role="presentation"></iframe></template>',
      output: null,
      errors: [
        { message: 'The role "presentation" should not be used on the semantic element <iframe>.' },
      ],
    },
    {
      code: '<template><video role="none"></video></template>',
      output: null,
      errors: [{ message: 'The role "none" should not be used on the semantic element <video>.' }],
    },
    {
      code: '<template><audio role="presentation"></audio></template>',
      output: null,
      errors: [
        { message: 'The role "presentation" should not be used on the semantic element <audio>.' },
      ],
    },
    {
      code: '<template><embed role="none"></template>',
      output: null,
      errors: [{ message: 'The role "none" should not be used on the semantic element <embed>.' }],
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

hbsRuleTester.run('template-no-invalid-role', rule, {
  valid: [
    '<div></div>',
    '<div role="none"></div>',
    '<div role="presentation"></div>',
    '<img alt="" role="none">',
    '<img role="none">',
    '<img alt="" role="presentation">',
    '<img role="presentation">',
    '<span role="none"></span>',
    '<span role="presentation"></span>',
    '<svg role="none"></svg>',
    '<svg role="presentation"></svg>',
    '<li role="none"></li>',
    '<li role="presentation"></li>',
    '<custom-component role="none"></custom-component>',
    '<AwesomeThing role="none"></AwesomeThing>',
    '<AwesomeThing role="presentation"></AwesomeThing>',
    '<table role="textbox"></table>',
    '<div role="{{if this.inModal "dialog" "contentinfo" }}"></div>',
    '<td role="cell">Data</td>',
    // Case-insensitive role matching
    '<div role="Button">Click</div>',
    '<div role="NAVIGATION">Nav</div>',
    '<div role="ALERT">Alert</div>',
    // catchNonexistentRoles: false — non-existent roles are not flagged
    {
      code: '<div role="command interface"></div>',
      options: [{ catchNonexistentRoles: false }],
    },

    // DPUB-ARIA (doc-*) and Graphics-ARIA (graphics-*) roles.
    '<div role="doc-abstract">Abstract</div>',
    '<section role="doc-chapter"></section>',
    '<svg role="graphics-document"></svg>',

    // Whitespace-separated role fallback list.
    '<div role="tabpanel row"></div>',
    '<svg role="graphics-document document"></svg>',
    '<section role="doc-appendix doc-bibliography"></section>',

    // ARIA 1.3 draft roles — not in aria-query 5.3.2 but spec-blessed, so
    // the rule accepts them via the inline allowlist.
    '<div role="associationlist"></div>',
    '<div role="associationlistitemkey"></div>',
    '<div role="associationlistitemvalue"></div>',
    '<div role="comment"></div>',
    '<div role="suggestion"></div>',
  ],
  invalid: [
    {
      code: '<ul role="presentation"></ul>',
      output: null,
      errors: [
        { message: 'The role "presentation" should not be used on the semantic element <ul>.' },
      ],
    },
    {
      code: '<ol role="presentation"></ol>',
      output: null,
      errors: [
        { message: 'The role "presentation" should not be used on the semantic element <ol>.' },
      ],
    },
    {
      code: '<table role="presentation"></table>',
      output: null,
      errors: [
        { message: 'The role "presentation" should not be used on the semantic element <table>.' },
      ],
    },
    {
      code: '<table role="none"></table>',
      output: null,
      errors: [{ message: 'The role "none" should not be used on the semantic element <table>.' }],
    },
    {
      code: '<button role="presentation"></button>',
      output: null,
      errors: [
        { message: 'The role "presentation" should not be used on the semantic element <button>.' },
      ],
    },
    {
      code: '<button role="none"></button>',
      output: null,
      errors: [{ message: 'The role "none" should not be used on the semantic element <button>.' }],
    },
    {
      code: '<label role="presentation"></label>',
      output: null,
      errors: [
        { message: 'The role "presentation" should not be used on the semantic element <label>.' },
      ],
    },
    {
      code: '<label role="none"></label>',
      output: null,
      errors: [{ message: 'The role "none" should not be used on the semantic element <label>.' }],
    },
    {
      code: '<div role="command interface"></div>',
      output: null,
      errors: [{ message: "Invalid ARIA role 'command'. Must be a valid ARIA role." }],
    },
    {
      code: '<div role="command interface"></div>',
      output: null,
      options: [{ catchNonexistentRoles: true }],
      errors: [{ message: "Invalid ARIA role 'command'. Must be a valid ARIA role." }],
    },
    {
      code: '<div role="COMMAND INTERFACE"></div>',
      output: null,
      errors: [{ message: "Invalid ARIA role 'command'. Must be a valid ARIA role." }],
    },
    // Newly added SEMANTIC_ELEMENTS: presentation/none on iframe, video, audio, embed
    {
      code: '<iframe role="presentation"></iframe>',
      output: null,
      errors: [
        { message: 'The role "presentation" should not be used on the semantic element <iframe>.' },
      ],
    },
    {
      code: '<video role="none"></video>',
      output: null,
      errors: [{ message: 'The role "none" should not be used on the semantic element <video>.' }],
    },
    {
      code: '<audio role="presentation"></audio>',
      output: null,
      errors: [
        { message: 'The role "presentation" should not be used on the semantic element <audio>.' },
      ],
    },
    {
      code: '<embed role="none">',
      output: null,
      errors: [{ message: 'The role "none" should not be used on the semantic element <embed>.' }],
    },
  ],
});
