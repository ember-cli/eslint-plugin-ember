const rule = require('../../../lib/rules/template-simple-modifiers');
const RuleTester = require('eslint').RuleTester;

const ruleTester = new RuleTester({
  parser: require.resolve('ember-eslint-parser'),
  parserOptions: { ecmaVersion: 2022, sourceType: 'module' },
});

ruleTester.run('template-simple-modifiers', rule, {
  valid: [
    '<template><div {{(modifier "track-interaction" @controlName)}}></div></template>',
    '<template><div {{(modifier this.trackInteraction @controlName)}}></div></template>',
    '<template><div {{my-modifier}}></div></template>',

    '<template><div {{(modifier @trackInteraction @controlName)}}></div></template>',
    '<template><div {{(if @isActionVisible (modifier "track-interaction" eventName=myEventName eventBody=myEventbody))}}></div></template>',
    '<template><div {{(my-modifier (unless this.hasBeenClicked "track-interaction") "click" customizeData=this.customizeClickData)}}></div></template>',
    '<template><MyComponent @people={{array "Tom Dale" "Yehuda Katz" this.myOtherPerson}} /></template>',
    '<template><div {{(if this.foo (modifier "foo-bar"))}}></div></template>',
  ],
  invalid: [
    {
      code: '<template><div {{(modifier)}}></div></template>',
      output: null,
      errors: [
        {
          message:
            'The modifier helper should have a string or a variable name containing the modifier name as a first argument.',
        },
      ],
    },

    {
      code: '<template><div {{(modifier (unless this.hasBeenClicked "track-interaction") "click" customizeData=this.customizeClickData)}}></div></template>',
      output: null,
      errors: [
        {
          message:
            'The modifier helper should have a string or a variable name containing the modifier name as a first argument.',
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

hbsRuleTester.run('template-simple-modifiers', rule, {
  valid: [
    '<div {{(modifier "track-interaction" @controlName)}}></div>',
    '<div {{(modifier this.trackInteraction @controlName)}}></div>',
    '<div {{(modifier @trackInteraction @controlName)}}></div>',
    '<div {{(if @isActionVisible (modifier "track-interaction" eventName=myEventName eventBody=myEventbody))}}></div>',
    '<div {{(my-modifier (unless this.hasBeenClicked "track-interaction") "click" customizeData=this.customizeClickData)}}></div>',
    '<div {{my-modifier}}></div>',
    '<MyComponent @people={{array "Tom Dale" "Yehuda Katz" this.myOtherPerson}} />',
    '<div {{(if this.foo (modifier "foo-bar"))}}></div>',
  ],
  invalid: [
    {
      code: '<div {{(modifier (unless this.hasBeenClicked "track-interaction") "click" customizeData=this.customizeClickData)}}></div>',
      output: null,
      errors: [
        { message: 'The modifier helper should have a string or a variable name containing the modifier name as a first argument.' },
      ],
    },
    {
      code: '<div {{(modifier)}}></div>',
      output: null,
      errors: [
        { message: 'The modifier helper should have a string or a variable name containing the modifier name as a first argument.' },
      ],
    },
  ],
});
