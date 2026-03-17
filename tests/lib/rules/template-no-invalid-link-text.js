const rule = require('../../../lib/rules/template-no-invalid-link-text');
const RuleTester = require('eslint').RuleTester;

const ruleTester = new RuleTester({
  parser: require.resolve('ember-eslint-parser'),
  parserOptions: { ecmaVersion: 2022, sourceType: 'module' },
});

ruleTester.run('template-no-invalid-link-text', rule, {
  valid: [
    { filename: 'test.gjs', code: '<template><a href="/about">About Us</a></template>' },
    {
      filename: 'test.gjs',
      code: '<template><a href="https://myurl.com">Click here to read more about this amazing adventure</a></template>',
    },
    {
      filename: 'test.gjs',
      code: '<template><a href="https://myurl.com" aria-labelledby="some-id"></a></template>',
    },
    {
      filename: 'test.gjs',
      code: '<template><a href="https://myurl.com" aria-label="click here to read about our company"></a></template>',
    },
    {
      filename: 'test.gjs',
      code: '<template><a href="https://myurl.com" aria-hidden="true"></a></template>',
    },
    { filename: 'test.gjs', code: '<template><a href="https://myurl.com" hidden></a></template>' },
    {
      filename: 'test.gjs',
      code: '<template><a href="#" aria-label={{this.anAriaLabel}}>A link with a variable as aria-label</a></template>',
    },
    // In GJS, LinkTo without an import from @ember/routing is not Ember's router link
    { filename: 'test.gjs', code: '<template><LinkTo>click here</LinkTo></template>' },
    { filename: 'test.gjs', code: '<template><LinkTo></LinkTo></template>' },
    // Imported LinkTo with valid text
    {
      filename: 'test.gjs',
      code: "import { LinkTo } from '@ember/routing'; <template><LinkTo>About Us</LinkTo></template>",
    },
    // allowEmptyLinks: true — empty <a> is valid
    {
      filename: 'test.gjs',
      code: '<template><a href="https://myurl.com"></a></template>',
      options: [{ allowEmptyLinks: true }],
    },
    // Dynamic content — can't validate
    {
      filename: 'test.gjs',
      code: "import { LinkTo } from '@ember/routing'; <template><LinkTo>{{foo}} more</LinkTo></template>",
    },
    {
      filename: 'test.gjs',
      code: "import { LinkTo } from '@ember/routing'; <template><LinkTo aria-label={{t 'some-translation'}}>A link with translation</LinkTo></template>",
    },
  ],

  invalid: [
    {
      filename: 'test.gjs',
      code: '<template><a href="/page">Click here</a></template>',
      output: null,
      errors: [{ messageId: 'invalidText' }],
    },
    {
      filename: 'test.gjs',
      code: '<template><a href="/page">More info</a></template>',
      output: null,
      errors: [{ messageId: 'invalidText' }],
    },
    {
      filename: 'test.gjs',
      code: '<template><a href="/page">Read more</a></template>',
      output: null,
      errors: [{ messageId: 'invalidText' }],
    },
    {
      // standalone "more" is disallowed
      filename: 'test.gjs',
      code: '<template><a href="/page">more</a></template>',
      output: null,
      errors: [{ messageId: 'invalidText' }],
    },
    {
      filename: 'test.gjs',
      code: '<template><a href="https://myurl.com"></a></template>',
      output: null,
      errors: [{ messageId: 'invalidText' }],
    },
    {
      filename: 'test.gjs',
      code: '<template><a href="https://myurl.com"> </a></template>',
      output: null,
      errors: [{ messageId: 'invalidText' }],
    },
    {
      filename: 'test.gjs',
      code: '<template><a aria-labelledby="" href="https://myurl.com">Click here</a></template>',
      output: null,
      errors: [{ messageId: 'invalidText' }],
    },
    {
      filename: 'test.gjs',
      code: '<template><a aria-label="Click here" href="https://myurl.com">Click here</a></template>',
      output: null,
      errors: [{ messageId: 'invalidText' }],
    },
    {
      // Imported LinkTo with disallowed text
      filename: 'test.gjs',
      code: "import { LinkTo } from '@ember/routing'; <template><LinkTo>click here</LinkTo></template>",
      output: null,
      errors: [{ messageId: 'invalidText' }],
    },
    {
      // Aliased LinkTo import must still be flagged
      filename: 'test.gjs',
      code: "import { LinkTo as RouterLink } from '@ember/routing'; <template><RouterLink>click here</RouterLink></template>",
      output: null,
      errors: [{ messageId: 'invalidText' }],
    },
    {
      // Imported LinkTo — empty
      filename: 'test.gjs',
      code: "import { LinkTo } from '@ember/routing'; <template><LinkTo></LinkTo></template>",
      output: null,
      errors: [{ messageId: 'invalidText' }],
    },
    {
      // Nested element content
      filename: 'test.gjs',
      code: '<template><a href="/page"><span>click here</span></a></template>',
      output: null,
      errors: [{ messageId: 'invalidText' }],
    },
    {
      // aria-label with disallowed text overrides content check
      filename: 'test.gjs',
      code: 'import { LinkTo } from \'@ember/routing\'; <template><LinkTo aria-label="click here">About Us</LinkTo></template>',
      output: null,
      errors: [{ messageId: 'invalidText' }],
    },
    {
      filename: 'test.gjs',
      code: '<template><MyLink>click here</MyLink></template>',
      output: null,
      options: [{ linkComponents: ['MyLink'] }],
      errors: [{ messageId: 'invalidText' }],
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

hbsRuleTester.run('template-no-invalid-link-text (hbs)', rule, {
  valid: [
    '<a href="https://myurl.com">Click here to read more about this amazing adventure</a>',
    '{{#link-to}} click here to read more about our company{{/link-to}}',
    '<LinkTo>Read more about ways semantic HTML can make your code more accessible.</LinkTo>',
    '<LinkTo>{{foo}} more</LinkTo>',
    '<a href="https://myurl.com" aria-labelledby="some-id"></a>',
    '<a href="https://myurl.com" aria-label="click here to read about our company"></a>',
    '<a href="https://myurl.com" aria-hidden="true"></a>',
    '<a href="https://myurl.com" hidden></a>',
    '<LinkTo aria-label={{t "some-translation"}}>A link with translation</LinkTo>',
    '<a href="#" aria-label={{this.anAriaLabel}}>A link with a variable as aria-label</a>',
    // allowEmptyLinks: true — empty links are valid
    { code: '<a href="https://myurl.com"></a>', options: [{ allowEmptyLinks: true }] },
  ],
  invalid: [
    {
      code: '<a href="https://myurl.com">click here</a>',
      output: null,
      errors: [{ messageId: 'invalidText' }],
    },
    {
      // standalone "more" is disallowed
      code: '<a href="/page">more</a>',
      output: null,
      errors: [{ messageId: 'invalidText' }],
    },
    {
      code: '<LinkTo>click here</LinkTo>',
      output: null,
      errors: [{ messageId: 'invalidText' }],
    },
    {
      code: '{{#link-to}}click here{{/link-to}}',
      output: null,
      errors: [{ messageId: 'invalidText' }],
    },
    {
      code: '<a href="https://myurl.com"></a>',
      output: null,
      errors: [{ messageId: 'invalidText' }],
    },
    {
      code: '<a href="https://myurl.com"> </a>',
      output: null,
      errors: [{ messageId: 'invalidText' }],
    },
    {
      code: `<a href="https://myurl.com"> &nbsp;
</a>`,
      output: null,
      errors: [{ messageId: 'invalidText' }],
    },
    {
      code: '<a aria-labelledby="" href="https://myurl.com">Click here</a>',
      output: null,
      errors: [{ messageId: 'invalidText' }],
    },
    {
      code: '<a aria-labelledby=" " href="https://myurl.com">Click here</a>',
      output: null,
      errors: [{ messageId: 'invalidText' }],
    },
    {
      code: '<a aria-label="Click here" href="https://myurl.com">Click here</a>',
      output: null,
      errors: [{ messageId: 'invalidText' }],
    },
    {
      // aria-label with disallowed value on LinkTo (text content is valid but aria-label is not)
      code: '<LinkTo aria-label="click here">About Us</LinkTo>',
      output: null,
      errors: [{ messageId: 'invalidText' }],
    },
    {
      code: '<LinkTo></LinkTo>',
      output: null,
      errors: [{ messageId: 'invalidText' }],
    },
    {
      code: `<LinkTo> &nbsp;
</LinkTo>`,
      output: null,
      errors: [{ messageId: 'invalidText' }],
    },
    {
      code: '{{#link-to}}{{/link-to}}',
      output: null,
      errors: [{ messageId: 'invalidText' }],
    },
    {
      code: `{{#link-to}} &nbsp;
{{/link-to}}`,
      output: null,
      errors: [{ messageId: 'invalidText' }],
    },
    {
      // nested element content — text is in a child element
      code: '<a href="/page"><span>click here</span></a>',
      output: null,
      errors: [{ messageId: 'invalidText' }],
    },
    {
      code: '<MyLink>click here</MyLink>',
      output: null,
      options: [{ linkComponents: ['MyLink'] }],
      errors: [{ messageId: 'invalidText' }],
    },
  ],
});
