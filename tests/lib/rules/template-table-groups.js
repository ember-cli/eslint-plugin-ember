//------------------------------------------------------------------------------
// Requirements
//------------------------------------------------------------------------------

const rule = require('../../../lib/rules/template-table-groups');
const RuleTester = require('eslint').RuleTester;

//------------------------------------------------------------------------------
// Tests
//------------------------------------------------------------------------------

const ruleTester = new RuleTester({
  parser: require.resolve('ember-eslint-parser'),
  parserOptions: { ecmaVersion: 2022, sourceType: 'module' },
});

ruleTester.run('template-table-groups', rule, {
  valid: [
    `<template>
      <table>
        <thead>
          <tr><th>Header</th></tr>
        </thead>
        <tbody>
          <tr><td>Data</td></tr>
        </tbody>
      </table>
    </template>`,
    `<template>
      <table>
        <tbody>
          <tr><td>Data</td></tr>
        </tbody>
      </table>
    </template>`,
    `<template>
      <table>
        <caption>My Table</caption>
      </table>
    </template>`,
    `<template>
      <div>Not a table</div>
    </template>`,

    `<template>
    <table>
    {{#if showCaption}}
      <caption>Some Name</caption>
    {{/if}}
    <colgroup></colgroup>
    {{#if foo}}
      <thead>
        <tr></tr>
      </thead>
    {{else}}
      <tbody>
        <tr></tr>
      </tbody>
    {{/if}}
    </table>
    </template>`,
    `<template>
    <table>
    {{#if foo}}
      <tfoot>
        <tr></tr>
      </tfoot>
    {{/if}}
    </table>
    </template>`,
    `<template>
    <table>
    {{#unless foo}}
      <tfoot>
        <tr></tr>
      </tfoot>
    {{/unless}}
    </table>
    </template>`,
    `<template>
    <table>
    {{#each foo as |bar|}}
      <tfoot>
        <tr>bar</tr>
      </tfoot>
    {{/each}}
    </table>
    </template>`,
    `<template>
    <table>
    {{#each-in foo as |bar|}}
      <tfoot>
        <tr>bar</tr>
      </tfoot>
    {{/each-in}}
    </table>
    </template>`,
    `<template>
    <table>
    {{#let foo as |bar|}}
      <tfoot>
        <tr>bar</tr>
      </tfoot>
    {{/let}}
    </table>
    </template>`,
    `<template>
    <table>
    {{#with foo as |bar|}}
      <tfoot>
        <tr>bar</tr>
      </tfoot>
    {{/with}}
    </table>
    </template>`,
    `<template>
    <table>
    {{#each foo as |bar|}}
      {{#if bar}}
        {{#unless baz}}
          <tfoot>
            <tr>bar</tr>
          </tfoot>
        {{/unless}}
      {{/if}}
    {{/each}}
    </table>
    </template>`,
    '<template><table>{{some-component tagName="tbody"}}</table></template>',
    '<template><table>{{some-component tagName="thead"}}</table></template>',
    '<template><table>{{some-component tagName="tfoot"}}</table></template>',
    '<template><table>{{#some-component tagName="tbody"}}{{/some-component}}</table></template>',
    '<template><table>{{#some-component tagName="thead"}}{{/some-component}}</table></template>',
    '<template><table>{{#some-component tagName="tfoot"}}{{/some-component}}</table></template>',
    '<template><table>{{component "some-component" tagName="tbody"}}</table></template>',
    '<template><table>{{component "some-component" tagName="thead"}}</table></template>',
    '<template><table>{{component "some-component" tagName="tfoot"}}</table></template>',
    '<template><table><SomeComponent @tagName="tbody" /></table></template>',
    '<template><table><SomeComponent @tagName="thead" /></table></template>',
    '<template><table><SomeComponent @tagName="tfoot" /></table></template>',
    '<template><table><SomeComponent @tagName="tbody"></SomeComponent></table></template>',
    '<template><table><SomeComponent @tagName="thead"></SomeComponent></table></template>',
    '<template><table><SomeComponent @tagName="tfoot"></SomeComponent></table></template>',
    '<template> <table>{{yield}}</table> </template>',
    '<template><table><!-- this --></table></template>',
    '<template><table>{{! or this }}</table></template>',
    '<template><table> </table></template>',
    '<template><table> <caption>Foo</caption></table></template>',
    '<template><table><colgroup><col style="background-color: red"></colgroup></table></template>',
    '<template><table><thead><tr><td>Header</td></tr></thead></table></template>',
    '<template><table><tbody><tr><td>Body</td></tr></tbody></table></template>',
    '<template><table><tfoot><tr><td>Footer</td></tr></tfoot></table></template>',
    '<template><table>{{! this is a comment }}<thead><tr><td>Header</td></tr></thead><tbody><tr><td>Body</td></tr></tbody><tfoot><tr><td>Footer</td></tr></tfoot></table></template>',
    '<template><table><colgroup><col style="background-color: red"></colgroup><tbody><tr><td>Body</td></tr></tbody></table></template>',
    '<template><table><tbody></tbody></table></template>',
    '<template><table><colgroup></colgroup><colgroup></colgroup><tbody></tbody></table></template>',
    `<template>
    <table>
      {{#if someCondition}}
        <thead />
        <tbody />
      {{else}}
        <caption />
        <thead />
        <tbody />
      {{/if}}
    </table>
    </template>`,
    `<template>
    <table>
      {{#unless someCondition}}
        <thead />
        <tbody />
      {{else}}
        <caption />
        <thead />
        <tbody />
      {{/unless}}
    </table>
    </template>`,
  ],

  invalid: [
    {
      code: `<template>
        <table>
          <tr><td>Data</td></tr>
        </table>
      </template>`,
      output: null,
      errors: [{ messageId: 'missing' }],
    },
    {
      code: `<template>
        <table>
          <tr><th>Header</th></tr>
          <tr><td>Data</td></tr>
        </table>
      </template>`,
      output: null,
      errors: [{ messageId: 'missing' }],
    },

    {
      code: `<template>
      <table>
      {{#if showCaption}}
        <thead>Some Name</thead>
      {{/if}}
      {{#if foo}}
        <span>12</span>
      {{else}}
        <p>text</p>
      {{/if}}
      <colgroup></colgroup>
      </table>
      </template>`,
      output: null,
      errors: [{ messageId: 'missing' }],
    },
    {
      code: `<template>
      <table>
      {{#if showCaption}}
        <div>Some Name</div>
      {{/if}}
      {{#if foo}}
        <span>12</span>
      {{else}}
        <p>text</p>
      {{/if}}
      <colgroup></colgroup>
      </table>
      </template>`,
      output: null,
      errors: [{ messageId: 'missing' }],
    },
    {
      code: `<template>
      <table>
      {{#if foo}}
        {{else}}
        <div></div>
      {{/if}}
      </table>
      </template>`,
      output: null,
      errors: [{ messageId: 'missing' }],
    },
    {
      code: `<template>
      <table>
      {{#unless foo}}
        <div>
          <tr></tr>
        </div>
      {{/unless}}
      </table>
      </template>`,
      output: null,
      errors: [{ messageId: 'missing' }],
    },
    {
      code: `<template>
      <table>
      {{#if foo}}
        <div>
          <tr></tr>
        </div>
      {{/if}}
      </table>
      </template>`,
      output: null,
      errors: [{ messageId: 'missing' }],
    },
    {
      code: `<template>
      <table>
      {{#unless foo}}
        {{some-component}}
      {{/unless}}
      </table>
      </template>`,
      output: null,
      errors: [{ messageId: 'missing' }],
    },
    {
      code: `<template>
      <table>
      {{#something foo}}
        <tbody></tbody>
      {{/something}}
      </table>
      </template>`,
      output: null,
      errors: [{ messageId: 'missing' }],
    },
    {
      code: '<template><table><tr><td>Foo</td></tr></table></template>',
      output: null,
      errors: [{ messageId: 'missing' }],
    },
    {
      code: '<template><table>{{some-component}}</table></template>',
      output: null,
      errors: [{ messageId: 'missing' }],
    },
    {
      code: '<template><table>{{#each foo as |bar|}}{{bar}}{{/each}}</table></template>',
      output: null,
      errors: [{ messageId: 'missing' }],
    },
    {
      code: '<template><table></table></template>',
      output: null,
      errors: [{ messageId: 'missing' }],
    },
    {
      code: '<template><table> whitespace<thead></thead></table></template>',
      output: null,
      errors: [{ messageId: 'missing' }],
    },
    {
      code: '<template><table>{{some-component tagName="div"}}</table></template>',
      output: null,
      errors: [{ messageId: 'missing' }],
    },
    {
      code: '<template><table>{{some-component otherProp="tbody"}}</table></template>',
      output: null,
      errors: [{ messageId: 'missing' }],
    },
    {
      code: '<template><table><SomeComponent @tagName="div" /></table></template>',
      output: null,
      errors: [{ messageId: 'missing' }],
    },
    {
      code: '<template><table><SomeComponent @otherProp="tbody" /></table></template>',
      output: null,
      errors: [{ messageId: 'missing' }],
    },
    {
      code: '<template><table>some text</table></template>',
      output: null,
      errors: [{ messageId: 'missing' }],
    },
    {
      code: '<template><table><tfoot /><thead /></table></template>',
      output: null,
      errors: [{ messageId: 'ordering' }],
    },
    {
      code: '<template><table><tbody /><caption /></table></template>',
      output: null,
      errors: [{ messageId: 'ordering' }],
    },
    {
      code: `<template>
        <table>
          <tbody />
          <colgroup />
        </table>
      </template>`,
      output: null,
      errors: [{ messageId: 'ordering' }],
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

hbsRuleTester.run('template-table-groups', rule, {
  valid: [
    `
    <table>
    {{#if showCaption}}
      <caption>Some Name</caption>
    {{/if}}
    <colgroup></colgroup>
    {{#if foo}}
      <thead>
        <tr></tr>
      </thead>
    {{else}}
      <tbody>
        <tr></tr>
      </tbody>
    {{/if}}
    </table>
    `,
    `
    <table>
    {{#if foo}}
      <tfoot>
        <tr></tr>
      </tfoot>
    {{/if}}
    </table>
    `,
    `
    <table>
    {{#unless foo}}
      <tfoot>
        <tr></tr>
      </tfoot>
    {{/unless}}
    </table>
    `,
    `
    <table>
    {{#each foo as |bar|}}
      <tfoot>
        <tr>bar</tr>
      </tfoot>
    {{/each}}
    </table>
    `,
    `
    <table>
    {{#each-in foo as |bar|}}
      <tfoot>
        <tr>bar</tr>
      </tfoot>
    {{/each-in}}
    </table>
    `,
    `
    <table>
    {{#let foo as |bar|}}
      <tfoot>
        <tr>bar</tr>
      </tfoot>
    {{/let}}
    </table>
    `,
    `
    <table>
    {{#with foo as |bar|}}
      <tfoot>
        <tr>bar</tr>
      </tfoot>
    {{/with}}
    </table>
    `,
    `
    <table>
    {{#each foo as |bar|}}
      {{#if bar}}
        {{#unless baz}}
          <tfoot>
            <tr>bar</tr>
          </tfoot>
        {{/unless}}
      {{/if}}
    {{/each}}
    </table>
    `,
    '<table>{{some-component tagName="tbody"}}</table>',
    '<table>{{some-component tagName="thead"}}</table>',
    '<table>{{some-component tagName="tfoot"}}</table>',
    '<table>{{#some-component tagName="tbody"}}{{/some-component}}</table>',
    '<table>{{#some-component tagName="thead"}}{{/some-component}}</table>',
    '<table>{{#some-component tagName="tfoot"}}{{/some-component}}</table>',
    '<table>{{component "some-component" tagName="tbody"}}</table>',
    '<table>{{component "some-component" tagName="thead"}}</table>',
    '<table>{{component "some-component" tagName="tfoot"}}</table>',
    '<table><SomeComponent @tagName="tbody" /></table>',
    '<table><SomeComponent @tagName="thead" /></table>',
    '<table><SomeComponent @tagName="tfoot" /></table>',
    '<table><SomeComponent @tagName="tbody"></SomeComponent></table>',
    '<table><SomeComponent @tagName="thead"></SomeComponent></table>',
    '<table><SomeComponent @tagName="tfoot"></SomeComponent></table>',
    ' <table>{{yield}}</table> ',
    '<table><!-- this --></table>',
    '<table>{{! or this }}</table>',
    '<table> </table>',
    '<table> <caption>Foo</caption></table>',
    '<table><colgroup><col style="background-color: red"></colgroup></table>',
    '<table><thead><tr><td>Header</td></tr></thead></table>',
    '<table><tbody><tr><td>Body</td></tr></tbody></table>',
    '<table><tfoot><tr><td>Footer</td></tr></tfoot></table>',
    '{{! this is a comment }}',
    '<tr><td>Header</td></tr>',
    '<tr><td>Body</td></tr>',
    '<tr><td>Footer</td></tr>',
    '<col style="background-color: red">',
    '<table><colgroup></colgroup><colgroup></colgroup><tbody></tbody></table>',
    `
    <table>
      {{#if someCondition}}
        <thead />
        <tbody />
      {{else}}
        <caption />
        <thead />
        <tbody />
      {{/if}}
    </table>
    `,
    `
    <table>
      {{#unless someCondition}}
        <thead />
        <tbody />
      {{else}}
        <caption />
        <thead />
        <tbody />
      {{/unless}}
    </table>
    `,
    `
        <StickyTable>
          <thead></thead>
          <tbody></tbody>
        </StickyTable>
        <MyThing @tagName="table">
          <thead></thead>
          <tbody></tbody>
        </MyThing>
      `,
    '<table><tbody></tbody></table>',
    // allowed-*-components config tests (curly-brace invocation)
    {
      code: `
      <table>
        {{nested/my-caption}}
        {{nested/my-colgroup}}
        {{nested/my-thead}}
        {{nested/my-tbody}}
        {{nested/my-tfoot}}
      </table>
      `,
      options: [
        {
          'allowed-caption-components': ['nested/my-caption'],
          'allowed-colgroup-components': ['nested/my-colgroup'],
          'allowed-thead-components': ['nested/my-thead'],
          'allowed-tbody-components': ['nested/my-tbody'],
          'allowed-tfoot-components': ['nested/my-tfoot'],
        },
      ],
    },
    // allowed-*-components config tests (angle-bracket invocation)
    {
      code: `
      <table>
        <Nested::MyCaption />
        <Nested::MyColgroup />
        <Nested::MyThead />
        <Nested::MyTbody />
        <Nested::MyTfoot />
      </table>
      `,
      options: [
        {
          'allowed-caption-components': ['nested/my-caption'],
          'allowed-colgroup-components': ['nested/my-colgroup'],
          'allowed-thead-components': ['nested/my-thead'],
          'allowed-tbody-components': ['nested/my-tbody'],
          'allowed-tfoot-components': ['nested/my-tfoot'],
        },
      ],
    },
    {
      code: `
      <table>
        <Nested::HeadOrFoot />
        <Nested::Body />
        <Nested::HeadOrFoot/>
      </table>
      `,
      options: [
        {
          'allowed-thead-components': ['nested/head-or-foot'],
          'allowed-tbody-components': ['nested/body'],
          'allowed-tfoot-components': ['nested/head-or-foot'],
        },
      ],
    },
    {
      code: `
      <table>
        <Nested::MyCaption />
        <thead />
        <Nested::MyCaption @tagName="tbody" />
        <tfoot />
      </table>
      `,
      options: [
        {
          'allowed-caption-components': ['nested/my-caption'],
        },
      ],
    },
  ],
  invalid: [
    {
      code: `
      <table>
      {{#if showCaption}}
        <thead>Some Name</thead>
      {{/if}}
      {{#if foo}}
        <span>12</span>
      {{else}}
        <p>text</p>
      {{/if}}
      <colgroup></colgroup>
      </table>
      `,
      output: null,
      errors: [{ message: 'Tables must have a table group (thead, tbody or tfoot).' }],
    },
    {
      code: `
      <table>
      {{#if showCaption}}
        <div>Some Name</div>
      {{/if}}
      {{#if foo}}
        <span>12</span>
      {{else}}
        <p>text</p>
      {{/if}}
      <colgroup></colgroup>
      </table>
      `,
      output: null,
      errors: [{ message: 'Tables must have a table group (thead, tbody or tfoot).' }],
    },
    {
      code: `
      <table>
      {{#if foo}}
        {{else}}
        <div></div>
      {{/if}}
      </table>
      `,
      output: null,
      errors: [{ message: 'Tables must have a table group (thead, tbody or tfoot).' }],
    },
    {
      code: `
      <table>
      {{#unless foo}}
        <div>
          <tr></tr>
        </div>
      {{/unless}}
      </table>
      `,
      output: null,
      errors: [{ message: 'Tables must have a table group (thead, tbody or tfoot).' }],
    },
    {
      code: `
      <table>
      {{#if foo}}
        <div>
          <tr></tr>
        </div>
      {{/if}}
      </table>
      `,
      output: null,
      errors: [{ message: 'Tables must have a table group (thead, tbody or tfoot).' }],
    },
    {
      code: `
      <table>
      {{#unless foo}}
        {{some-component}}
      {{/unless}}
      </table>
      `,
      output: null,
      errors: [{ message: 'Tables must have a table group (thead, tbody or tfoot).' }],
    },
    {
      code: `
      <table>
      {{#something foo}}
        <tbody></tbody>
      {{/something}}
      </table>
      `,
      output: null,
      errors: [{ message: 'Tables must have a table group (thead, tbody or tfoot).' }],
    },
    {
      code: '<table><tr><td>Foo</td></tr></table>',
      output: null,
      errors: [{ message: 'Tables must have a table group (thead, tbody or tfoot).' }],
    },
    {
      code: '<table><tr></tr><tbody><tr><td>Foo</td></tr></tbody></table>',
      output: null,
      errors: [{ message: 'Tables must have a table group (thead, tbody or tfoot).' }],
    },
    {
      code: '<table>{{some-component}}</table>',
      output: null,
      errors: [{ message: 'Tables must have a table group (thead, tbody or tfoot).' }],
    },
    {
      code: '<table>{{#each foo as |bar|}}{{bar}}{{/each}}</table>',
      output: null,
      errors: [{ message: 'Tables must have a table group (thead, tbody or tfoot).' }],
    },
    {
      code: '<table> whitespace<thead></thead></table>',
      output: null,
      errors: [{ message: 'Tables must have a table group (thead, tbody or tfoot).' }],
    },
    {
      code: '<table>{{some-component tagName="div"}}</table>',
      output: null,
      errors: [{ message: 'Tables must have a table group (thead, tbody or tfoot).' }],
    },
    {
      code: '<table>{{some-component otherProp="tbody"}}</table>',
      output: null,
      errors: [{ message: 'Tables must have a table group (thead, tbody or tfoot).' }],
    },
    {
      code: '<table><SomeComponent @tagName="div" /></table>',
      output: null,
      errors: [{ message: 'Tables must have a table group (thead, tbody or tfoot).' }],
    },
    {
      code: '<table><SomeComponent @otherProp="tbody" /></table>',
      output: null,
      errors: [{ message: 'Tables must have a table group (thead, tbody or tfoot).' }],
    },
    {
      code: '<table>some text</table>',
      output: null,
      errors: [{ message: 'Tables must have a table group (thead, tbody or tfoot).' }],
    },
    {
      code: '<table><tfoot /><thead /></table>',
      output: null,
      errors: [
        {
          message:
            'Tables must have table groups in the correct order (caption, colgroup, thead, tbody then tfoot).',
        },
      ],
    },
    {
      code: '<table><tbody /><caption /></table>',
      output: null,
      errors: [
        {
          message:
            'Tables must have table groups in the correct order (caption, colgroup, thead, tbody then tfoot).',
        },
      ],
    },
    {
      code: `
        <table>
          <tbody />
          <colgroup />
        </table>
      `,
      output: null,
      errors: [
        {
          message:
            'Tables must have table groups in the correct order (caption, colgroup, thead, tbody then tfoot).',
        },
      ],
    },
    {
      code: `
      <table>
        <Nested::SomethingElse />
      </table>
      `,
      output: null,
      errors: [{ message: 'Tables must have a table group (thead, tbody or tfoot).' }],
    },
    {
      code: `
      <table>
        <Nested::MyTfoot />
        <Nested::MyThead />
      </table>
      `,
      output: null,
      errors: [{ message: 'Tables must have a table group (thead, tbody or tfoot).' }],
    },
    {
      code: `
      <table>
        <Nested::HeadOrFoot />
        <Nested::Body />
        <Nested::HeadOrFoot/>
        <Nested::Body />
      </table>
      `,
      output: null,
      errors: [{ message: 'Tables must have a table group (thead, tbody or tfoot).' }],
    },
    {
      code: `
      <table>
        <thead />
        <Nested::MyTbody @tagName="caption" />
        <tbody />
      </table>
      `,
      output: null,
      options: [
        {
          'allowed-tbody-components': ['nested/my-tbody'],
        },
      ],
      errors: [
        {
          message:
            'Tables must have table groups in the correct order (caption, colgroup, thead, tbody then tfoot).',
        },
      ],
    },
    // Config: allowed-*-components invalid tests
    {
      code: `
      <table>
        <Nested::SomethingElse />
      </table>
      `,
      output: null,
      options: [{ 'allowed-caption-components': ['nested/allowed'] }],
      errors: [{ message: 'Tables must have a table group (thead, tbody or tfoot).' }],
    },
    {
      code: `
      <table>
        <Nested::MyTfoot />
        <Nested::MyThead />
      </table>
      `,
      output: null,
      options: [
        {
          'allowed-thead-components': ['nested/my-thead'],
          'allowed-tfoot-components': ['nested/my-tfoot'],
        },
      ],
      errors: [
        {
          message:
            'Tables must have table groups in the correct order (caption, colgroup, thead, tbody then tfoot).',
        },
      ],
    },
    {
      code: `
      <table>
        <Nested::HeadOrFoot />
        <Nested::Body />
        <Nested::HeadOrFoot/>
        <Nested::Body />
      </table>
      `,
      output: null,
      options: [
        {
          'allowed-thead-components': ['nested/head-or-foot'],
          'allowed-tbody-components': ['nested/body'],
          'allowed-tfoot-components': ['nested/head-or-foot'],
        },
      ],
      errors: [
        {
          message:
            'Tables must have table groups in the correct order (caption, colgroup, thead, tbody then tfoot).',
        },
      ],
    },
  ],
});
