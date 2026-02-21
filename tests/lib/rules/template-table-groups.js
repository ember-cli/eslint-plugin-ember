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
  
    // Test cases ported from ember-template-lint
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
  
    // Test cases ported from ember-template-lint
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
      errors: [{ messageId: 'missing' }],
    },
    {
      code: '<template><table><tbody /><caption /></table></template>',
      output: null,
      errors: [{ messageId: 'missing' }],
    },
    {
      code: `<template>
        <table>
          <tbody />
          <colgroup />
        </table>
      </template>`,
      output: null,
      errors: [{ messageId: 'missing' }],
    },
  ],
});
