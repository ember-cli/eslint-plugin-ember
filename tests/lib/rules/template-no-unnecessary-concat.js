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
