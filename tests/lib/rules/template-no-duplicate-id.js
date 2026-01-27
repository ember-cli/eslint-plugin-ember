const rule = require('../../../lib/rules/template-no-duplicate-id');
const RuleTester = require('eslint').RuleTester;

const ruleTester = new RuleTester({
  parser: require.resolve('ember-eslint-parser'),
  parserOptions: { ecmaVersion: 2022, sourceType: 'module' },
});
ruleTester.run('template-no-duplicate-id', rule, {
  valid: [
    '<template><div id="a"></div><div id="b"></div></template>',
    '<template><div id="id-00"></div><div id="id-01"></div></template>',
    '<template><div id={{unique-id}}></div><div id={{unique-id}}></div></template>',
    '<template><div id="{{unique-id}}"></div><div id="{{unique-id}}"></div></template>',
    "<template><div id='{{unique-id}}'></div><div id='{{unique-id}}'></div></template>",
    '<template><div id="{{(unique-id)}}"></div><div id="{{(unique-id)}}"></div></template>',
    '<template><div id={{(unique-id)}}></div><div id={{(unique-id)}}></div></template>',
    '<template><div id={{"id-00"}}></div></template>',
    '<template><div id={{this.divId00}}></div></template>',
    '<template><div id={{this.divId00}}></div><div id={{this.divId01}}></div></template>',
    '<template><div id="concat-{{this.divId}}"></div></template>',
    '<template><div id="concat-{{this.divId00}}"></div><div id="concat-{{this.divId01}}"></div></template>',
    '<template><div id={{id-00}}></div><div id="id-00"></div></template>',
    '<template><div id="id-00"></div><div id={{id-00}}></div></template>',
    '<template><div id="concat-{{id-00}}"></div><div id="concat-id-00"></div></template>',
    '<template><div id="concat-id-00"></div><div id="concat-{{id-00}}"></div></template>',
    '<template><div id="id-00"></div>{{#foo elementId="id-01"}}{{/foo}}</template>',
    '<template>{{#foo elementId="id-01"}}{{/foo}}<div id="id-00"></div></template>',
    '<template>{{#if}}<div id="id-00"></div>{{else}}<span id="id-00"></span>{{/if}}</template>',
    '<template><div id={{1234}}></div></template>',
    '<template><div id={{1234}}></div><div id={{"1234"}}></div></template>',
    '<template><div id={{"id-00"}}></div><div id={{"id-01"}}></div></template>',
    '<template><div id={{this.foo}}></div><div id={{this.bar}}></div></template>',
    '<template>{{foo id="id-00"}}{{foo id="id-01"}}</template>',
    '<template><div id="partA{{partB}}{{"partC"}}"></div><div id="{{"partA"}}{{"partB"}}partC"></div></template>',
    `<template>
      {{#if this.foo}}
        <div id="id-00"></div>
      {{else}}
        <div id="id-00"></div>
      {{/if}}
    </template>`,
    `<template>
      {{#if this.foo}}
        <div id="id-00"></div>
      {{else if this.bar}}
        <div id="id-00"></div>
      {{else}}
        <div id="id-00"></div>
      {{/if}}
    </template>`,
    `<template>
      {{#unless this.foo}}
        <div id="id-00"></div>
      {{else}}
        <div id="id-00"></div>
      {{/unless}}
    </template>`,
    `<template>
      {{#unless this.foo}}
        <div id="id-00"></div>
      {{else unless this.bar}}
        <div id="id-00"></div>
      {{else if this.baz}}
        <div id="id-00"></div>
      {{else}}
        <div id="id-00"></div>
      {{/unless}}
    </template>`,
    `<template>
      {{#let blah.id as |footerId|}}
        {{#if this.foo}}
          <div id={{footerId}}></div>
        {{else}}
          <span id={{footerId}}></span>
        {{/if}}
      {{/let}}
    </template>`,
    `<template>
      {{#let 'foobar' as |footerId|}}
        {{#if this.foo}}
          <div id={{footerId}}></div>
        {{else}}
          <span id={{footerId}}></span>
        {{/if}}
      {{/let}}
    </template>`,
    `<template>
      {{#if this.foo}}
        <div id={{this.divId00}}></div>
      {{else}}
        <div id={{this.divId00}}></div>
      {{/if}}
    </template>`,
    `<template>
      {{#if this.foo}}
        {{#if this.other}}
          <div id="nested"></div>
        {{else}}
          <div id="nested"></div>
        {{/if}}
        <div id="root"></div>
      {{else}}
        <div id="nested"></div>
      {{/if}}
    </template>`,
    `<template>
      <MyComponent as |inputProperties|>
        <Input id={{inputProperties.id}} />
        <div id={{inputProperties.abc}} />
      </MyComponent>

      <MyComponent as |inputProperties|>
        <Input id={{inputProperties.id}} />
      </MyComponent>
    </template>`,
  ],
  invalid: [
    {
      code: '<template><div id="foo"></div><div id="foo"></div></template>',
      output: null,
      errors: [{ messageId: 'duplicate' }],
    },

    {
      code: '<template><div id="id-00"></div><div id="id-00"></div></template>',
      output: null,
      errors: [{ messageId: 'duplicate' }],
    },
    {
      code: '<template><div><div id="id-01"></div></div><div><div id="id-01"></div></div></template>',
      output: null,
      errors: [{ messageId: 'duplicate' }],
    },
    {
      code: '<template><div id="id-00"></div><div id={{"id-00"}}></div></template>',
      output: null,
      errors: [{ messageId: 'duplicate' }],
    },
    {
      code: '<template><div id={{"id-00"}}></div><div id="id-00"></div></template>',
      output: null,
      errors: [{ messageId: 'duplicate' }],
    },
    {
      code: '<template><div id="id-00"></div><div id="id-{{"00"}}"></div></template>',
      output: null,
      errors: [{ messageId: 'duplicate' }],
    },
    {
      code: '<template><div id="id-00"></div><div id="{{"id"}}-00"></div></template>',
      output: null,
      errors: [{ messageId: 'duplicate' }],
    },
    {
      code: '<template><div id="id-00"></div>{{#foo elementId="id-00"}}{{/foo}}</template>',
      output: null,
      errors: [{ messageId: 'duplicate' }],
    },
    {
      code: '<template>{{#foo elementId="id-00"}}{{/foo}}<div id="id-00"></div></template>',
      output: null,
      errors: [{ messageId: 'duplicate' }],
    },
    {
      code: '<template><div id={{"id-00"}}></div>{{#foo elementId="id-00"}}{{/foo}}</template>',
      output: null,
      errors: [{ messageId: 'duplicate' }],
    },
    {
      code: '<template>{{#foo elementId="id-00"}}{{/foo}}<div id={{"id-00"}}></div></template>',
      output: null,
      errors: [{ messageId: 'duplicate' }],
    },
    {
      code: '<template><div id="id-{{"00"}}"></div>{{#foo elementId="id-00"}}{{/foo}}</template>',
      output: null,
      errors: [{ messageId: 'duplicate' }],
    },
    {
      code: '<template>{{#foo elementId="id-00"}}{{/foo}}<div id="id-{{"00"}}"></div></template>',
      output: null,
      errors: [{ messageId: 'duplicate' }],
    },
    {
      code: '<template>{{#foo elementId="id-00"}}{{/foo}}{{#bar elementId="id-00"}}{{/bar}}</template>',
      output: null,
      errors: [{ messageId: 'duplicate' }],
    },
    {
      code: '<template>{{foo id="id-00"}}{{foo id="id-00"}}</template>',
      output: null,
      errors: [{ messageId: 'duplicate' }],
    },
    {
      code: '<template><div id={{1234}}></div><div id={{1234}}></div></template>',
      output: null,
      errors: [{ messageId: 'duplicate' }],
    },
    {
      code: '<template><div id={{this.divId00}}></div><div id={{this.divId00}}></div></template>',
      output: null,
      errors: [{ messageId: 'duplicate' }],
    },
    {
      code: '<template><div id="partA{{partB}}{{"partC"}}"></div><div id="{{"partA"}}{{partB}}partC"></div></template>',
      output: null,
      errors: [{ messageId: 'duplicate' }],
    },
    {
      code: '<template>{{#foo elementId="id-00"}}{{/foo}}{{bar elementId="id-00"}}</template>',
      output: null,
      errors: [{ messageId: 'duplicate' }],
    },
    {
      code: '<template>{{#foo id="id-00"}}{{/foo}}{{bar id="id-00"}}</template>',
      output: null,
      errors: [{ messageId: 'duplicate' }],
    },
    {
      code: '<template>{{#foo id="id-00"}}{{/foo}}<Bar id="id-00" /></template>',
      output: null,
      errors: [{ messageId: 'duplicate' }],
    },
    {
      code: '<template>{{#foo id="id-00"}}{{/foo}}<Bar @id="id-00" /></template>',
      output: null,
      errors: [{ messageId: 'duplicate' }],
    },
    {
      code: '<template>{{#foo id="id-00"}}{{/foo}}<Bar @elementId="id-00" /></template>',
      output: null,
      errors: [{ messageId: 'duplicate' }],
    },
    {
      code: `<template>
      {{#if this.foo}}
        <div id={{this.divId00}}></div>
        <div id={{this.divId00}}></div>
      {{else}}
        <div id="other-thing"></div>
      {{/if}}
    </template>`,
      output: null,
      errors: [{ messageId: 'duplicate' }],
    },
    {
      code: `<template>
        <div id="id-00"></div>
        {{#if this.foo}}
          <div id="id-00"></div>
        {{/if}}
      </template>`,
      output: null,
      errors: [{ messageId: 'duplicate' }],
    },
    {
      code: `<template>
      <div id={{this.divId00}}></div>
      {{#if this.foo}}
        <div id={{this.divId00}}></div>
      {{else}}
        <div id={{this.divId00}}></div>
      {{/if}}
    </template>`,
      output: null,
      errors: [{ messageId: 'duplicate' }],
    },
    {
      code: `<template>
        {{#if this.foo}}
          <div id="otherid"></div>
        {{else}}
          <div id="anidhere"></div>
        {{/if}}
        <div id="anidhere"></div>
      </template>`,
      output: null,
      errors: [{ messageId: 'duplicate' }],
    },
    {
      code: `<template>
        {{#if this.foo}}
          {{#if this.other}}
            <div id="nested"></div>
          {{/if}}
        {{else}}
          <div id="nested"></div>
        {{/if}}
        <div id="nested"></div>
      </template>`,
      output: null,
      errors: [{ messageId: 'duplicate' }],
    },
    {
      code: `<template>
        {{#if this.foo}}
          {{#if this.other}}
            <div id={{(hello-world)}}></div>
          {{/if}}
        {{else}}
          <div id={{(hello-world)}}></div>
        {{/if}}
        <div id={{(hello-world)}}></div>
      </template>`,
      output: null,
      errors: [{ messageId: 'duplicate' }],
    },
    {
      code: `<template>
        <MyComponent as |inputProperties|>
          <Input id={{inputProperties.id}} />
          <Input id={{inputProperties.id}} />
        </MyComponent>
      </template>`,
      output: null,
      errors: [{ messageId: 'duplicate' }],
    },
  ],
});

const hbsRuleTester = new RuleTester({
  parser: require.resolve('ember-eslint-parser/hbs'),
  parserOptions: { ecmaVersion: 2022, sourceType: 'module' },
});

hbsRuleTester.run('template-no-duplicate-id (hbs)', rule, {
  valid: [
    '<div id="id-00"></div><div id="id-01"></div>',
    '<div id={{unique-id}}></div><div id={{unique-id}}></div>',
    '<div id="{{unique-id}}"></div><div id="{{unique-id}}"></div>',
    "<div id='{{unique-id}}'></div><div id='{{unique-id}}'></div>",
    '<div id="{{(unique-id)}}"></div><div id="{{(unique-id)}}"></div>',
    '<div id={{(unique-id)}}></div><div id={{(unique-id)}}></div>',
    '<div id={{"id-00"}}></div>',
    '<div id={{this.divId00}}></div>',
    '<div id={{this.divId00}}></div><div id={{this.divId01}}></div>',
    '<div id="concat-{{this.divId}}"></div>',
    '<div id="concat-{{this.divId00}}"></div><div id="concat-{{this.divId01}}"></div>',
    '<div id={{id-00}}></div><div id="id-00"></div>',
    '<div id="id-00"></div><div id={{id-00}}></div>',
    '<div id="concat-{{id-00}}"></div><div id="concat-id-00"></div>',
    '<div id="concat-id-00"></div><div id="concat-{{id-00}}"></div>',
    '<div id="id-00"></div>{{#foo elementId="id-01"}}{{/foo}}',
    '{{#foo elementId="id-01"}}{{/foo}}<div id="id-00"></div>',
    '{{#if}}<div id="id-00"></div>{{else}}<span id="id-00"></span>{{/if}}',
    '<div id={{1234}}></div>',
    '<div id={{1234}}></div><div id={{"1234"}}></div>',
    '<div id={{"id-00"}}></div><div id={{"id-01"}}></div>',
    '<div id={{this.foo}}></div><div id={{this.bar}}></div>',
    '{{foo id="id-00"}}{{foo id="id-01"}}',
    '<div id="partA{{partB}}{{"partC"}}"></div><div id="{{"partA"}}{{"partB"}}partC"></div>',
    `{{#if this.foo}}
        <div id="id-00"></div>
      {{else}}
        <div id="id-00"></div>
      {{/if}}`,
    `{{#if this.foo}}
        <div id="id-00"></div>
      {{else if this.bar}}
        <div id="id-00"></div>
      {{else}}
        <div id="id-00"></div>
      {{/if}}`,
    `{{#unless this.foo}}
        <div id="id-00"></div>
      {{else}}
        <div id="id-00"></div>
      {{/unless}}`,
    `{{#unless this.foo}}
        <div id="id-00"></div>
      {{else unless this.bar}}
        <div id="id-00"></div>
      {{else if this.baz}}
        <div id="id-00"></div>
      {{else}}
        <div id="id-00"></div>
      {{/unless}}`,
    `{{#let blah.id as |footerId|}}
        {{#if this.foo}}
          <div id={{footerId}}></div>
        {{else}}
          <span id={{footerId}}></span>
        {{/if}}
      {{/let}}`,
    `{{#let 'foobar' as |footerId|}}
        {{#if this.foo}}
          <div id={{footerId}}></div>
        {{else}}
          <span id={{footerId}}></span>
        {{/if}}
      {{/let}}`,
    `{{#if this.foo}}
        <div id={{this.divId00}}></div>
      {{else}}
        <div id={{this.divId00}}></div>
      {{/if}}`,
    `{{#if this.foo}}
        <div id="partA{{partB}}{{"partC"}}"></div>
      {{else}}
        <div id="partA{{partB}}{{"partC"}}"></div>
      {{/if}}`,
    `{{#if this.foo}}
        {{#if this.other}}
          <div id="nested"></div>
        {{else}}
          <div id="nested"></div>
        {{/if}}
        <div id="root"></div>
      {{else}}
        <div id="nested"></div>
      {{/if}}`,
    `<MyComponent as |inputProperties|>
        <Input id={{inputProperties.id}} />
        <div id={{inputProperties.abc}} />
      </MyComponent>

      <MyComponent as |inputProperties|>
        <Input id={{inputProperties.id}} />
      </MyComponent>`,
  ],
  invalid: [
    {
      code: '<div id="id-00"></div><div id="id-00"></div>',
      output: null,
      errors: [{ messageId: 'duplicate' }],
    },
    {
      code: '<div><div id="id-01"></div></div><div><div id="id-01"></div></div>',
      output: null,
      errors: [{ messageId: 'duplicate' }],
    },
    {
      code: '<div id="id-00"></div><div id={{"id-00"}}></div>',
      output: null,
      errors: [{ messageId: 'duplicate' }],
    },
    {
      code: '<div id={{"id-00"}}></div><div id="id-00"></div>',
      output: null,
      errors: [{ messageId: 'duplicate' }],
    },
    {
      code: '<div id="id-00"></div><div id="id-{{"00"}}"></div>',
      output: null,
      errors: [{ messageId: 'duplicate' }],
    },
    {
      code: '<div id="id-00"></div><div id="{{"id"}}-00"></div>',
      output: null,
      errors: [{ messageId: 'duplicate' }],
    },
    {
      code: '<div id="id-00"></div>{{#foo elementId="id-00"}}{{/foo}}',
      output: null,
      errors: [{ messageId: 'duplicate' }],
    },
    {
      code: '{{#foo elementId="id-00"}}{{/foo}}<div id="id-00"></div>',
      output: null,
      errors: [{ messageId: 'duplicate' }],
    },
    {
      code: '<div id={{"id-00"}}></div>{{#foo elementId="id-00"}}{{/foo}}',
      output: null,
      errors: [{ messageId: 'duplicate' }],
    },
    {
      code: '{{#foo elementId="id-00"}}{{/foo}}<div id={{"id-00"}}></div>',
      output: null,
      errors: [{ messageId: 'duplicate' }],
    },
    {
      code: '<div id="id-{{"00"}}"></div>{{#foo elementId="id-00"}}{{/foo}}',
      output: null,
      errors: [{ messageId: 'duplicate' }],
    },
    {
      code: '{{#foo elementId="id-00"}}{{/foo}}<div id="id-{{"00"}}"></div>',
      output: null,
      errors: [{ messageId: 'duplicate' }],
    },
    {
      code: '{{#foo elementId="id-00"}}{{/foo}}{{#bar elementId="id-00"}}{{/bar}}',
      output: null,
      errors: [{ messageId: 'duplicate' }],
    },
    {
      code: '{{foo id="id-00"}}{{foo id="id-00"}}',
      output: null,
      errors: [{ messageId: 'duplicate' }],
    },
    {
      code: '<div id={{1234}}></div><div id={{1234}}></div>',
      output: null,
      errors: [{ messageId: 'duplicate' }],
    },
    {
      code: '<div id={{this.divId00}}></div><div id={{this.divId00}}></div>',
      output: null,
      errors: [{ messageId: 'duplicate' }],
    },
    {
      code: '<div id="partA{{partB}}{{"partC"}}"></div><div id="{{"partA"}}{{partB}}partC"></div>',
      output: null,
      errors: [{ messageId: 'duplicate' }],
    },
    {
      code: '{{#foo elementId="id-00"}}{{/foo}}{{bar elementId="id-00"}}',
      output: null,
      errors: [{ messageId: 'duplicate' }],
    },
    {
      code: '{{#foo id="id-00"}}{{/foo}}{{bar id="id-00"}}',
      output: null,
      errors: [{ messageId: 'duplicate' }],
    },
    {
      code: '{{#foo id="id-00"}}{{/foo}}<Bar id="id-00" />',
      output: null,
      errors: [{ messageId: 'duplicate' }],
    },
    {
      code: '{{#foo id="id-00"}}{{/foo}}<Bar @id="id-00" />',
      output: null,
      errors: [{ messageId: 'duplicate' }],
    },
    {
      code: '{{#foo id="id-00"}}{{/foo}}<Bar @elementId="id-00" />',
      output: null,
      errors: [{ messageId: 'duplicate' }],
    },
    {
      code: `{{#if this.foo}}
        <div id={{this.divId00}}></div>
        <div id={{this.divId00}}></div>
      {{else}}
        <div id="other-thing"></div>
      {{/if}}`,
      output: null,
      errors: [{ messageId: 'duplicate' }],
    },
    {
      code: `<div id="id-00"></div>
        {{#if this.foo}}
          <div id="id-00"></div>
        {{/if}}`,
      output: null,
      errors: [{ messageId: 'duplicate' }],
    },
    {
      code: `<div id={{this.divId00}}></div>
      {{#if this.foo}}
        <div id={{this.divId00}}></div>
      {{else}}
        <div id={{this.divId00}}></div>
      {{/if}}`,
      output: null,
      errors: [{ messageId: 'duplicate' }],
    },
    {
      code: `{{#if this.foo}}
          <div id="otherid"></div>
        {{else}}
          <div id="anidhere"></div>
        {{/if}}
        <div id="anidhere"></div>`,
      output: null,
      errors: [{ messageId: 'duplicate' }],
    },
    {
      code: `{{#if this.foo}}
          {{#if this.other}}
            <div id="nested"></div>
          {{/if}}
        {{else}}
          <div id="nested"></div>
        {{/if}}
        <div id="nested"></div>`,
      output: null,
      errors: [{ messageId: 'duplicate' }],
    },
    {
      code: `{{#if this.foo}}
          {{#if this.other}}
            <div id={{(hello-world)}}></div>
          {{/if}}
        {{else}}
          <div id={{(hello-world)}}></div>
        {{/if}}
        <div id={{(hello-world)}}></div>`,
      output: null,
      errors: [{ messageId: 'duplicate' }],
    },
    {
      code: `<MyComponent as |inputProperties|>
          <Input id={{inputProperties.id}} />
          <Input id={{inputProperties.id}} />
        </MyComponent>`,
      output: null,
      errors: [{ messageId: 'duplicate' }],
    },
  ],
});
