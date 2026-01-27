const rule = require('../../../lib/rules/template-no-unnecessary-curly-strings');
const RuleTester = require('eslint').RuleTester;

const ruleTester = new RuleTester({
  parser: require.resolve('ember-eslint-parser'),
  parserOptions: { ecmaVersion: 2022, sourceType: 'module' },
});
ruleTester.run('template-no-unnecessary-curly-strings', rule, {
  valid: [
    '<template><div class="foo"></div></template>',
    '<template><FooBar class="btn" /></template>',
    '<template>{{foo}}</template>',
    '<template>{{(foo)}}</template>',
    '<template>{{this.calculate 1 2 op="add"}}</template>',
    '<template>{{get address part}}</template>',
    '<template>foo</template>',
    '<template>"foo"</template>',
    '<template><FooBar value=12345 /></template>',
    '<template><FooBar value=null /></template>',
    '<template><FooBar value=true /></template>',
    '<template><FooBar value=undefined /></template>',
    '<template><FooBar value={{12345}} /></template>',
    '<template><FooBar value={{null}} /></template>',
    '<template><FooBar value={{true}} /></template>',
    '<template><FooBar value={{undefined}} /></template>',
  ],
  invalid: [
    {
      code: '<template><div class={{"foo"}}></div></template>',
      output: '<template><div class="foo"></div></template>',
      errors: [{ messageId: 'unnecessary' }],
    },

    {
      code: '<template><FooBar class={{"btn"}} @fooArg={{\'barbaz\'}} /></template>',
      output: '<template><FooBar class="btn" @fooArg="barbaz" /></template>',
      errors: [{ messageId: 'unnecessary' }, { messageId: 'unnecessary' }],
    },
    {
      code: '<template><FooBar class="btn">{{"Foo"}}</FooBar></template>',
      output: '<template><FooBar class="btn">Foo</FooBar></template>',
      errors: [{ messageId: 'unnecessary' }],
    },
  ],
});
