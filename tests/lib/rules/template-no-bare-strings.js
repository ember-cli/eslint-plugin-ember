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
      errors: [{ messageId: 'bareString' }, { messageId: 'bareString' }],
    },
    {
      code: '<template><div>{{if true "Yes" "No"}}</div></template>',
      output: null,
      errors: [{ messageId: 'bareString' }, { messageId: 'bareString' }],
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
      errors: [{ messageId: 'bareString' }, { messageId: 'bareString' }],
    },
    {
      code: '<template>{{page-title "foo"}}</template>',
      output: null,
      errors: [{ messageId: 'bareString' }],
    },
    {
      code: '<template>{{page-title "foo" " - " "bar"}}</template>',
      output: null,
      errors: [{ messageId: 'bareString' }, { messageId: 'bareString' }],
    },
    {
      filename: 'template.gjs',
      code: '<template><input placeholder="This is a placeholder" /></template>',
      output: null,
      errors: [{ messageId: 'bareString' }],
    },
    {
      filename: 'template.gts',
      code: '<template><img alt="This is alt text" /></template>',
      output: null,
      errors: [{ messageId: 'bareString' }],
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

hbsRuleTester.run('template-no-bare-strings', rule, {
  valid: [
    '<div class={{if true "disabled"}}></div>',
    '<div class={{unless false "disabled"}}></div>',
    '<div class={{concat "disabled"}}></div>',
    '<div class={{unless true "asd"}}></div>',
    '<div class={{unless @a @b}}></div>',
    '{{unless @a @b}}',
    '{{t "howdy"}}',
    '<CustomInput @type={{"range"}} />',
    '{{t "foo"}}',
    '{{t "foo"}}, {{t "bar"}} ({{length}})',
    '(),.&+-=*/#%!?:[]{}',
    '&lpar;&rpar;&comma;&period;&amp;&nbsp;',
    '&mdash;&ndash;',
    '{{! template-lint-disable no-bare-strings }}',
    '{{! template-lint-disable }}',
    '<script> fdff sf sf f </script>',
    '<style> fdff sf sf f </style>',
    '<pre> fdff sf sf f </pre>',
    '<script> fdff sf sf <div> aaa </div> f </script>',
    '<style> fdff sf sf <div> aaa </div> f </style>',
    '<pre> fdff sf sf <div> aaa </div> f </pre>',
    '<textarea> this is an input</textarea>',
    '<div placeholder="wat?"></div>',
    `<foo-bar>
</foo-bar>`,
    '<div data-test-foo-bar></div>',
    '{{page-title}}',
    '{{page-title (t "foo")}}',
    '{{page-title @model.foo}}',
    '{{page-title this.model.foo}}',
    '{{page-title this.model.foo " - " this.model.bar}}',
    '&nbsp;',
    `
 {{translate "greeting"}}`,
    `
 {{translate "greeting"}},`,
    '& &times;',
    '<img data-alt={{bar}}>',
    '<div data-foo={{foo}}></div>',
    '<template><input placeholder={{t "placeholder"}} /></template>',
    '<template><img alt={{t "alt text"}} /></template>',
  ],
  invalid: [
    {
      code: '{{unless true "asd"}}',
      output: null,
      errors: [
        { message: 'Non-translated string used' },
      ],
    },
    {
      code: '{{unless @b "b"}}',
      output: null,
      errors: [
        { message: 'Non-translated string used' },
      ],
    },
    {
      code: '<div>{{concat "foo" "bar"}}</div>',
      output: null,
      errors: [
        { message: 'Non-translated string used' },
      ],
    },
    {
      code: '<div>{{unless true "Yes" "No"}}</div>',
      output: null,
      errors: [
        { message: 'Non-translated string used' },
        { message: 'Non-translated string used' },
      ],
    },
    {
      code: '<div>{{if true "Yes" "No"}}</div>',
      output: null,
      errors: [
        { message: 'Non-translated string used' },
        { message: 'Non-translated string used' },
      ],
    },
    {
      code: '<p>{{"Hello!"}}</p>',
      output: null,
      errors: [
        { message: 'Non-translated string used' },
      ],
    },
    {
      code: `
 howdy`,
      output: null,
      errors: [
        { message: 'Non-translated string used' },
      ],
    },
    {
      code: `<div>
  1234
</div>`,
      output: null,
      errors: [
        { message: 'Non-translated string used' },
      ],
    },
    {
      code: '<a title="hahaha trolol"></a>',
      output: null,
      errors: [
        { message: 'Non-translated string used in `title` attribute' },
      ],
    },
    {
      code: '<input placeholder="trolol">',
      output: null,
      errors: [
        { message: 'Non-translated string used in `placeholder` attribute' },
      ],
    },
    {
      code: '<input placeholder="{{foo}}hahaha trolol">',
      output: null,
      errors: [
        { message: 'Non-translated string used in `placeholder` attribute' },
      ],
    },
    {
      code: '<Input placeholder="{{foo}}hahaha trolol" />',
      output: null,
      errors: [
        { message: 'Non-translated string used in `placeholder` attribute' },
      ],
    },
    {
      code: '<Textarea placeholder="{{foo}}hahaha trolol" />',
      output: null,
      errors: [
        { message: 'Non-translated string used in `placeholder` attribute' },
      ],
    },
    {
      code: '<Input @placeholder="{{foo}}hahaha trolol" />',
      output: null,
      errors: [
        { message: 'Non-translated string used in `@placeholder` argument' },
      ],
    },
    {
      code: '<Textarea @placeholder="{{foo}}hahaha trolol" />',
      output: null,
      errors: [
        { message: 'Non-translated string used in `@placeholder` argument' },
      ],
    },
    {
      code: '<div role="contentinfo" aria-label="Contact, Policies and Legal"></div>',
      output: null,
      errors: [
        { message: 'Non-translated string used in `aria-label` attribute' },
      ],
    },
    {
      code: '<div contenteditable role="searchbox" aria-placeholder="Search for things"></div>',
      output: null,
      errors: [
        { message: 'Non-translated string used in `aria-placeholder` attribute' },
      ],
    },
    {
      code: '<div role="region" aria-roledescription="slide"></div>',
      output: null,
      errors: [
        { message: 'Non-translated string used in `aria-roledescription` attribute' },
      ],
    },
    {
      code: '<div role="slider" aria-valuetext="Off" tabindex="0" aria-valuemin="0" aria-valuenow="0" aria-valuemax="3"></div>',
      output: null,
      errors: [
        { message: 'Non-translated string used in `aria-valuetext` attribute' },
      ],
    },
    {
      code: `<div>Bady
  <input placeholder="trolol">
</div>`,
      output: null,
      errors: [
        { message: 'Non-translated string used' },
        { message: 'Non-translated string used in `placeholder` attribute' },
      ],
    },
    {
      code: '{{page-title "foo"}}',
      output: null,
      errors: [
        { message: 'Non-translated string used' },
      ],
    },
    {
      code: '{{page-title "foo" " - " "bar"}}',
      output: null,
      errors: [
        { message: 'Non-translated string used' },
        { message: 'Non-translated string used' },
      ],
    },
    {
      code: '{{t "foo"}} / error / &lpar;"{{name}}"&rpar;',
      output: null,
      errors: [
        { message: 'Non-translated string used' },
        { message: 'Non-translated string used' },
      ],
    },
    {
      code: '<input placeholder="hahaha">',
      output: null,
      errors: [
        { message: 'Non-translated string used in `placeholder` attribute' },
      ],
    },
    {
      code: '<template><input placeholder="This is a placeholder" /></template>',
      output: null,
      errors: [
        { message: 'Non-translated string used in `placeholder` attribute' },
      ],
    },
    {
      code: '<template><img alt="This is alt text" /></template>',
      output: null,
      errors: [
        { message: 'Non-translated string used in `alt` attribute' },
      ],
    },
  ],
});
