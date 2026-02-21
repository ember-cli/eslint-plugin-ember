const rule = require('../../../lib/rules/template-no-mut-helper');
const RuleTester = require('eslint').RuleTester;

const ruleTester = new RuleTester({
  parser: require.resolve('ember-eslint-parser'),
  parserOptions: { ecmaVersion: 2022, sourceType: 'module' },
});

ruleTester.run('template-no-mut-helper', rule, {
  valid: [
    '<template><Input @value={{this.name}} @onChange={{this.updateName}} /></template>',
    '<template>{{this.mut}}</template>',
    '<template>{{@mut}}</template>',
    '<template>{{set this "property" value}}</template>',
  
    // Test cases ported from ember-template-lint
    '<template><MyComponent @toggled={{this.showAggregatedLine}}/></template>',
    '<template><MyComponent @toggle={{set this "isDropdownOpen"}}/></template>',
    '<template><MyComponent @onFocusOut={{action "onFocusOutKeySkillsInput" value="target.value"}}/></template>',
    '<template><MyComponent {{on "click" (set this "isDropdownOpen" false)}}/></template>',
    '<template><MyComponent {{on "change" this.setContactUsSectionDescription}}/></template>',
    '<template><MyComponent {{on "change" (fn this.setContactUsSectionDescription true)}}/></template>',
    '<template><MyComponent {{on "change" (action "setContactUsSectionDescription")}}/></template>',
    '<template><MyComponent {{on "change" (action "setContactUsSectionDescription" true)}}/></template>',
    '<template><MyComponent {{action "setIsDropdownOpen" false}}/></template>',
    '<template><MyComponent @dismissModal={{set this "isRequestExpiredModalOpen" false}}/></template>',
    '<template><MyComponent onclick={{set this “expandVoluntarySelfIdHelpText” true}}/></template>',
    '<template><MyComponent @click={{set this "isCardCollapsed" (if this.isCardCollapsed false true)}}/></template>',
    '<template>{{my-component click=(set this "isOpen" false)}}</template>',
    '<template>{{my-component click=(set this "isLegalTextExpanded" (not this.isLegalTextExpanded))}}</template>',
    '<template>{{my-component onVisibilityChange=(set this “isDropdownOpen”)}}</template>',
    '<template>{{my-component click=(set this “expandVoluntarySelfIdHelpText” true)}}</template>',
    '<template>{{my-component value=this.secondaryProfileHeadline}}</template>',
    '<template><div {{mutate this.isDropdownOpen}} class="muted mut">Non-helper substrings with mut in them should not violate this rule.</div></template>',
  ],

  invalid: [
    {
      code: '<template><Input @value={{this.name}} @onChange={{(mut this.name)}} /></template>',
      output: null,
      errors: [
        {
          message: 'Do not use the (mut) helper. Use regular setters or actions instead.',
          type: 'GlimmerSubExpression',
        },
      ],
    },
    {
      code: '<template>{{input value=(mut this.name)}}</template>',
      output: null,
      errors: [
        {
          message: 'Do not use the (mut) helper. Use regular setters or actions instead.',
          type: 'GlimmerSubExpression',
        },
      ],
    },
    {
      code: '<template><CustomComponent @onChange={{(mut this.value)}} /></template>',
      output: null,
      errors: [
        {
          message: 'Do not use the (mut) helper. Use regular setters or actions instead.',
          type: 'GlimmerSubExpression',
        },
      ],
    },
  
    // Test cases ported from ember-template-lint
    {
      code: '<template><MyComponent @toggled={{mut this.showAggregatedLine}}/></template>',
      output: null,
      errors: [{ message: 'Do not use the (mut) helper. Use regular setters or actions instead.' }],
    },
    {
      code: '<template>{{my-component value=(mut this.secondaryProfileHeadline)}}</template>',
      output: null,
      errors: [{ message: 'Do not use the (mut) helper. Use regular setters or actions instead.' }],
    },
    {
      code: '<template><MyComponent {{action (mut this.isDropdownOpen) false}}/></template>',
      output: null,
      errors: [{ message: 'Do not use the (mut) helper. Use regular setters or actions instead.' }],
    },
    {
      code: '<template><MyComponent @dismissModal={{action (mut this.isRequestExpiredModalOpen) false}}/></template>',
      output: null,
      errors: [{ message: 'Do not use the (mut) helper. Use regular setters or actions instead.' }],
    },
    {
      code: '<template><MyComponent @click={{action (mut this.isCardCollapsed) (if this.isCardCollapsed false true)}}/></template>',
      output: null,
      errors: [{ message: 'Do not use the (mut) helper. Use regular setters or actions instead.' }],
    },
    {
      code: '<template><MyComponent onclick={{fn (mut this.expandVoluntarySelfIdHelpText) true}}/></template>',
      output: null,
      errors: [{ message: 'Do not use the (mut) helper. Use regular setters or actions instead.' }],
    },
    {
      code: '<template><MyComponent @onVisibilityChange={{fn (mut this.isDropdownOpen)}}/></template>',
      output: null,
      errors: [{ message: 'Do not use the (mut) helper. Use regular setters or actions instead.' }],
    },
    {
      code: '<template>{{my-component click=(action (mut this.isOpen) false)}}</template>',
      output: null,
      errors: [{ message: 'Do not use the (mut) helper. Use regular setters or actions instead.' }],
    },
    {
      code: '<template>{{my-component click=(action (mut this.isLegalTextExpanded) (not this.isLegalTextExpanded))}}</template>',
      output: null,
      errors: [{ message: 'Do not use the (mut) helper. Use regular setters or actions instead.' }],
    },
    {
      code: '<template>{{my-component onVisibilityChange=(action (mut this.isDropdownOpen))}}</template>',
      output: null,
      errors: [{ message: 'Do not use the (mut) helper. Use regular setters or actions instead.' }],
    },
    {
      code: '<template>{{my-component click=(fn (mut this.showManageEventsModal) true)}}</template>',
      output: null,
      errors: [{ message: 'Do not use the (mut) helper. Use regular setters or actions instead.' }],
    },
    {
      code: `<template><MyComponent
          @onVisibilityChange={{action
            (mut this.isDemographicsDropdownOpen)
          }}
        /></template>`,
      output: null,
      errors: [{ message: 'Do not use the (mut) helper. Use regular setters or actions instead.' }],
    },
    {
      code: `<template><MyComponent
          @dismissModal={{action
            (mut this.isNotificationsPostApprovalModalOpen)
            false
          }}
        /></template>`,
      output: null,
      errors: [{ message: 'Do not use the (mut) helper. Use regular setters or actions instead.' }],
    },
    {
      code: '<template><MyComponent onchange={{action (mut this.contactUsSection.description) value="target.value"}}/></template>',
      output: null,
      errors: [{ message: 'Do not use the (mut) helper. Use regular setters or actions instead.' }],
    },
  ],
});
