const rule = require('../../../lib/rules/template-no-bare-strings');
const RuleTester = require('eslint').RuleTester;

const ruleTester = new RuleTester({
  parser: require.resolve('ember-eslint-parser'),
  parserOptions: { ecmaVersion: 2022, sourceType: 'module' },
});

ruleTester.run('template-no-bare-strings', rule, {
  valid: [
    '<template>{{t "hello.world"}}</template>',
    '<template><div>&amp;</div></template>',
    '<template><div>   </div></template>',
    {
      code: '<template><div>Welcome</div></template>',
      options: [{ allowlist: ['Welcome'] }],
    },
  
    // Test cases ported from ember-template-lint
    '<template><div class={{if true "disabled"}}></div></template>',
    '<template><div class={{unless false "disabled"}}></div></template>',
    '<template><div class={{concat "disabled"}}></div></template>',
    '<template><div class={{unless true "asd"}}></div></template>',
    '<template><div class={{unless @a @b}}></div></template>',
    '<template>{{unless @a @b}}</template>',
    '<template>{{t "howdy"}}</template>',
    '<template><CustomInput @type={{"range"}} /></template>',
    '<template>{{t "foo"}}</template>',
    '<template>{{t "foo"}}, {{t "bar"}} ({{length}})</template>',
    '<template>(),.&+-=*/#%!?:[]{}</template>',
    '<template>&lpar;&rpar;&comma;&period;&amp;&nbsp;</template>',
    '<template>&mdash;&ndash;</template>',
    '<template><script> fdff sf sf f </script></template>',
    '<template><style> fdff sf sf f </style></template>',
    '<template><pre> fdff sf sf f </pre></template>',
    '<template><script> fdff sf sf <div> aaa </div> f </script></template>',
    '<template><style> fdff sf sf <div> aaa </div> f </style></template>',
    '<template><pre> fdff sf sf <div> aaa </div> f </pre></template>',
    '<template><textarea> this is an input</textarea></template>',
    '<template><div placeholder="wat?"></div></template>',
    `<template><foo-bar>
</foo-bar></template>`,
    '<template><div data-test-foo-bar></div></template>',
    '<template>page-title</template>',
    '<template>{{page-title}}</template>',
    '<template>{{page-title (t "foo")}}</template>',
    '<template>{{page-title @model.foo}}</template>',
    '<template>{{page-title this.model.foo}}</template>',
    '<template>{{page-title this.model.foo " - " this.model.bar}}</template>',
  ],

  invalid: [
    {
      code: '<template><div>Hello World</div></template>',
      output: null,
      errors: [{ messageId: 'bareString' }],
    },
    {
      code: '<template><button>Click me</button></template>',
      output: null,
      errors: [{ messageId: 'bareString' }],
    },
    {
      code: '<template><p>Some text content here</p></template>',
      output: null,
      errors: [{ messageId: 'bareString' }],
    },
  
    // Test cases ported from ember-template-lint
    {
      code: '<template>{{unless true "asd"}}</template>',
      output: null,
      errors: [{ messageId: 'bareString' }],
    },
    {
      code: '<template>{{unless @b "b"}}</template>',
      output: null,
      errors: [{ messageId: 'bareString' }],
    },
    {
      code: '<template><div>{{concat "foo" "bar"}}</div></template>',
      output: null,
      errors: [{ messageId: 'bareString' }],
    },
    {
      code: '<template><div>{{unless true "Yes" "No"}}</div></template>',
      output: null,
      errors: [{ messageId: 'bareString' }],
    },
    {
      code: '<template><div>{{if true "Yes" "No"}}</div></template>',
      output: null,
      errors: [{ messageId: 'bareString' }],
    },
    {
      code: '<template><p>{{"Hello!"}}</p></template>',
      output: null,
      errors: [{ messageId: 'bareString' }],
    },
    {
      code: `<template>
 howdy</template>`,
      output: null,
      errors: [{ messageId: 'bareString' }],
    },
    {
      code: `<template><div>
  1234
</div></template>`,
      output: null,
      errors: [{ messageId: 'bareString' }],
    },
    {
      code: '<template><a title="hahaha trolol"></a></template>',
      output: null,
      errors: [{ messageId: 'bareString' }],
    },
    {
      code: '<template><input placeholder="trolol"></template>',
      output: null,
      errors: [{ messageId: 'bareString' }],
    },
    {
      code: '<template><input placeholder="{{foo}}hahaha trolol"></template>',
      output: null,
      errors: [{ messageId: 'bareString' }],
    },
    {
      code: '<template><Input placeholder="{{foo}}hahaha trolol" /></template>',
      output: null,
      errors: [{ messageId: 'bareString' }],
    },
    {
      code: '<template><Textarea placeholder="{{foo}}hahaha trolol" /></template>',
      output: null,
      errors: [{ messageId: 'bareString' }],
    },
    {
      code: '<template><Input @placeholder="{{foo}}hahaha trolol" /></template>',
      output: null,
      errors: [{ messageId: 'bareString' }],
    },
    {
      code: '<template><Textarea @placeholder="{{foo}}hahaha trolol" /></template>',
      output: null,
      errors: [{ messageId: 'bareString' }],
    },
    {
      code: '<template><div role="contentinfo" aria-label="Contact, Policies and Legal"></div></template>',
      output: null,
      errors: [{ messageId: 'bareString' }],
    },
    {
      code: '<template><div contenteditable role="searchbox" aria-placeholder="Search for things"></div></template>',
      output: null,
      errors: [{ messageId: 'bareString' }],
    },
    {
      code: '<template><div role="region" aria-roledescription="slide"></div></template>',
      output: null,
      errors: [{ messageId: 'bareString' }],
    },
    {
      code: '<template><div role="slider" aria-valuetext="Off" tabindex="0" aria-valuemin="0" aria-valuenow="0" aria-valuemax="3"></div></template>',
      output: null,
      errors: [{ messageId: 'bareString' }],
    },
    {
      code: `<template><div>Bady
  <input placeholder="trolol">
</div></template>`,
      output: null,
      errors: [{ messageId: 'bareString' }],
    },
    {
      code: '<template>{{page-title "foo"}}</template>',
      output: null,
      errors: [{ messageId: 'bareString' }],
    },
    {
      code: '<template>{{page-title "foo" " - " "bar"}}</template>',
      output: null,
      errors: [{ messageId: 'bareString' }],
    },
  ],
});
