//------------------------------------------------------------------------------
// Requirements
//------------------------------------------------------------------------------

const rule = require('../../../lib/rules/template-no-invalid-link-title');
const RuleTester = require('eslint').RuleTester;

const ruleTester = new RuleTester({
  parser: require.resolve('ember-eslint-parser'),
  parserOptions: { ecmaVersion: 2022, sourceType: 'module' },
});

ruleTester.run('template-no-invalid-link-title', rule, {
  valid: [
    '<template><a href="/page" title="More information about page">Page</a></template>',
    '<template><a href="/page">Page</a></template>',
    '<template><a href="/page" title={{dynamic}}>Page</a></template>',
  
    // Test cases ported from ember-template-lint
    '<template><a href="https://myurl.com">Click here to read more about this amazing adventure</a></template>',
    '<template>{{#link-to}} click here to read more about our company{{/link-to}}</template>',
    '<template><LinkTo>Read more about ways semantic HTML can make your code more accessible.</LinkTo></template>',
    '<template><LinkTo>{{foo}} more</LinkTo></template>',
    '<template><LinkTo @title="nice title">Something else</LinkTo></template>',
    `<template><LinkTo title="great titles!">Whatever, don't judge me</LinkTo></template>`,
    '<template><LinkTo title="Download the video">Download</LinkTo></template>',
    '<template><a href="https://myurl.com" title="New to Ember? Read the full tutorial for the best experience">Read the Tutorial</a></template>',
    '<template><a href="./whatever" title={{foo}}>Hello!</a></template>',
    '<template>{{#link-to "blah.route.here" title="awesome title"}}Some thing else here{{/link-to}}</template>',
    `<template>
      <LinkTo @query={{hash page=@pagination.prevPage}} local-class="prev" @rel="prev" @title="previous page" data-test-pagination-prev>
        {{svg-jar "left-pag"}}
      </LinkTo>
    </template>`,
  ],
  invalid: [
    {
      code: '<template><a href="/page" title="">Page</a></template>',
      output: null,
      errors: [{ messageId: 'noInvalidLinkTitle' }],
    },
    {
      code: '<template><a href="/page" title="Page">Page</a></template>',
      output: null,
      errors: [{ messageId: 'noInvalidLinkTitle' }],
    },
  
    // Test cases ported from ember-template-lint
    {
      code: '<template><a href="https://myurl.com" title="read the tutorial">Read the Tutorial</a></template>',
      output: null,
      errors: [{ messageId: 'noInvalidLinkTitle' }],
    },
    {
      code: '<template><LinkTo title="quickstart">Quickstart</LinkTo></template>',
      output: null,
      errors: [{ messageId: 'noInvalidLinkTitle' }],
    },
    {
      code: '<template><LinkTo @title="foo" title="blah">derp</LinkTo></template>',
      output: null,
      errors: [{ messageId: 'noInvalidLinkTitle' }],
    },
    {
      code: '<template>{{#link-to title="Do the things"}}Do the things{{/link-to}}</template>',
      output: null,
      errors: [{ messageId: 'noInvalidLinkTitle' }],
    },
    {
      code: '<template><LinkTo @route="some.route" @title="Do the things">Do the things</LinkTo></template>',
      output: null,
      errors: [{ messageId: 'noInvalidLinkTitle' }],
    },
    {
      code: '<template><a href="https://myurl.com" title="Tutorial">Read the Tutorial</a></template>',
      output: null,
      errors: [{ messageId: 'noInvalidLinkTitle' }],
    },
    {
      code: '<template><LinkTo title="Tutorial">Read the Tutorial</LinkTo></template>',
      output: null,
      errors: [{ messageId: 'noInvalidLinkTitle' }],
    },
    {
      code: '<template>{{#link-to title="Tutorial"}}Read the Tutorial{{/link-to}}</template>',
      output: null,
      errors: [{ messageId: 'noInvalidLinkTitle' }],
    },
  ],
});
