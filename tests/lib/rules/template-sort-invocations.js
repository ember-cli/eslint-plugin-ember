const rule = require('../../../lib/rules/template-sort-invocations');
const RuleTester = require('eslint').RuleTester;

const ruleTester = new RuleTester({
  parser: require.resolve('ember-eslint-parser'),
  parserOptions: { ecmaVersion: 2022, sourceType: 'module' },
});

ruleTester.run('template-sort-invocations', rule, {
  valid: [
    // Basic component
    '<template><Button /></template>',

    // Single attribute
    '<template><Button @label="submit" /></template>',

    // Correctly sorted: @args first, then attributes, then modifiers
    '<template><Button @isDisabled={{true}} @label="Submit" class="button" {{on "click" this.handleClick}} /></template>',

    // Correctly sorted attributes
    '<template><div class="foo" id="bar" /></template>',

    // Correctly sorted modifiers
    '<template><button {{on "click" this.handleClick}} {{on "focus" this.handleFocus}} /></template>',

    // ...attributes at the end (after modifiers per rule)
    '<template><Button @label="Submit" class="button" {{on "click" this.handleClick}} ...attributes /></template>',

    // Hash pairs sorted
    '<template>{{component name="button" type="submit"}}</template>',

    // Block with sorted hash
    '<template>{{#each items as |item|}}{{item}}{{/each}}</template>',
    '<template>{{#let a="1" b="2" as |x y|}}{{x}}{{y}}{{/let}}</template>',
  ],

  invalid: [
    // Unsorted attributes (regular before @arg)
    {
      code: '<template><Button class="button" @label="Submit" /></template>',
      output: null,
      errors: [
        {
          messageId: 'attributeOrder',
          data: { attributeName: 'class', expectedAfter: '@label' },
        },
      ],
    },

    // Unsorted regular attributes
    {
      code: '<template><div id="bar" class="foo" /></template>',
      output: null,
      errors: [
        {
          messageId: 'attributeOrder',
          data: { attributeName: 'id', expectedAfter: 'class' },
        },
      ],
    },

    // Unsorted modifiers
    {
      code: '<template><button {{on "focus" this.handleFocus}} {{on "click" this.handleClick}} /></template>',
      output: null,
      errors: [
        {
          messageId: 'modifierOrder',
          data: { modifierName: 'on', expectedAfter: 'on' },
        },
      ],
    },

    // ...attributes before modifiers
    {
      code: '<template><Button @label="Submit" ...attributes {{on "click" this.handleClick}} /></template>',
      output: null,
      errors: [
        {
          messageId: 'splattributesOrder',
        },
      ],
    },

    // Unsorted hash pairs
    {
      code: '<template>{{component type="submit" name="button"}}</template>',
      output: null,
      errors: [
        {
          messageId: 'hashPairOrder',
          data: { hashPairName: 'type', expectedAfter: 'name' },
        },
      ],
    },

    // Unsorted hash in block
    {
      code: '<template>{{#let b="2" a="1" as |x y|}}{{x}}{{y}}{{/let}}</template>',
      output: null,
      errors: [
        {
          messageId: 'hashPairOrder',
          data: { hashPairName: 'b', expectedAfter: 'a' },
        },
      ],
    },
  ],
});
