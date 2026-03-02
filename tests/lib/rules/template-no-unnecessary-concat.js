const rule = require('../../../lib/rules/template-no-unnecessary-concat');
const RuleTester = require('eslint').RuleTester;

const ruleTester = new RuleTester({
  parser: require.resolve('ember-eslint-parser'),
  parserOptions: { ecmaVersion: 2022, sourceType: 'module' },
});
ruleTester.run('template-no-unnecessary-concat', rule, {
  valid: [
    '<template><div class="foo {{bar}}"></div></template>',
    '<template><div class={{clazz}}></div></template>',
    '<template><div class="first {{second}}"></div></template>',
    '<template>"{{foo}}"</template>',
  ],
  invalid: [
    {
      code: '<template><div class="{{foo}}"></div></template>',
      output: '<template><div class={{foo}}></div></template>',
      errors: [{ messageId: 'unnecessary' }],
    },

    {
      code: '<template><div class="{{clazz}}"></div></template>',
      output: '<template><div class={{clazz}}></div></template>',
      errors: [{ messageId: 'unnecessary' }],
    },
    {
      code: '<template><img src="{{url}}" alt="{{t "alternate-text"}}"></template>',
      output: '<template><img src={{url}} alt={{t "alternate-text"}}></template>',
      errors: [{ messageId: 'unnecessary' }, { messageId: 'unnecessary' }],
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

hbsRuleTester.run('template-no-unnecessary-concat', rule, {
  valid: [
    '<div class={{clazz}}></div>',
    '<div class="first {{second}}"></div>',
    '"{{foo}}"',
  ],
  invalid: [
    {
      code: '<div class="{{clazz}}"></div>',
      output: '<div class={{clazz}}></div>',
      errors: [
        { message: 'Unnecessary string concatenation. Use {{clazz}} instead of "{{clazz}}".' },
      ],
    },
    {
      code: '<img src="{{url}}" alt="{{t "alternate-text"}}">',
      output: '<img src={{url}} alt={{t "alternate-text"}}>',
      errors: [
        { message: 'Unnecessary string concatenation. Use {{url}} instead of "{{url}}".' },
        { message: 'Unnecessary string concatenation. Use {{t "alternate-text"}} instead of "{{t "alternate-text"}}".' },
      ],
    },
  ],
});
