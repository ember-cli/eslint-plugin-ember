const rule = require('../../../lib/rules/template-no-heading-inside-button');
const RuleTester = require('eslint').RuleTester;

const ruleTester = new RuleTester({
  parser: require.resolve('ember-eslint-parser'),
  parserOptions: { ecmaVersion: 2022, sourceType: 'module' },
});

ruleTester.run('template-no-heading-inside-button', rule, {
  valid: [
    '<template><button>Click me</button></template>',
    '<template><h1>Title</h1></template>',
    '<template><div><h2>Heading</h2></div></template>',
  
    // Test cases ported from ember-template-lint
    '<template><button>Show More</button></template>',
    '<template><button><span>thumbs-up emoji</span>Show More</button></template>',
    '<template><button><div>Show More</div></button></template>',
    '<template><div>Showing that it is not a button</div></template>',
    '<template><div><h1>Page Title in a div is fine</h1></div></template>',
    '<template><h1>Page Title</h1></template>',
  ],
  invalid: [
    {
      code: '<template><button><h1>Bad</h1></button></template>',
      output: null,
      errors: [{ messageId: 'noHeading' }],
    },
    {
      code: '<template><div role="button"><h2>Bad</h2></div></template>',
      output: null,
      errors: [{ messageId: 'noHeading' }],
    },
  
    // Test cases ported from ember-template-lint
    {
      code: '<template><button><h1>Page Title</h1></button></template>',
      output: null,
      errors: [{ messageId: 'noHeading' }],
    },
    {
      code: '<template><button><h2>Heading Title</h2></button></template>',
      output: null,
      errors: [{ messageId: 'noHeading' }],
    },
    {
      code: '<template><button><h3>Heading Title</h3></button></template>',
      output: null,
      errors: [{ messageId: 'noHeading' }],
    },
    {
      code: '<template><button><h4>Heading Title</h4></button></template>',
      output: null,
      errors: [{ messageId: 'noHeading' }],
    },
    {
      code: '<template><button><h5>Heading Title</h5></button></template>',
      output: null,
      errors: [{ messageId: 'noHeading' }],
    },
    {
      code: '<template><button><div><h1>Heading Title</h1></div></button></template>',
      output: null,
      errors: [{ messageId: 'noHeading' }],
    },
    {
      code: '<template><button><h6>Heading Title</h6></button></template>',
      output: null,
      errors: [{ messageId: 'noHeading' }],
    },
    {
      code: '<template><div role="button"><h6>Heading in a div with a role of button</h6></div></template>',
      output: null,
      errors: [{ messageId: 'noHeading' }],
    },
  ],
});
