const rule = require('../../../lib/rules/template-no-empty-headings');
const RuleTester = require('eslint').RuleTester;

const ruleTester = new RuleTester({
  parser: require.resolve('ember-eslint-parser'),
  parserOptions: { ecmaVersion: 2022, sourceType: 'module' },
});

ruleTester.run('template-no-empty-headings', rule, {
  valid: [
    '<template><h1>Title</h1></template>',
    '<template><h2>{{this.title}}</h2></template>',
    '<template><h3><span>Text</span></h3></template>',
    '<template><h4 hidden></h4></template>',
    '<template><h1>Accessible Heading</h1></template>',
    '<template><h1>Accessible&nbsp;Heading</h1></template>',
    '<template><h1 aria-hidden="true">Valid Heading</h1></template>',
    '<template><h1 aria-hidden="true"><span>Valid Heading</span></h1></template>',
    '<template><h1 aria-hidden="false">Accessible Heading</h1></template>',
    '<template><h1 hidden>Valid Heading</h1></template>',
    '<template><h1 hidden><span>Valid Heading</span></h1></template>',
    '<template><h1><span aria-hidden="true">Hidden text</span><span>Visible text</span></h1></template>',
    '<template><h1><span aria-hidden="true">Hidden text</span>Visible text</h1></template>',
    '<template><div role="heading" aria-level="1">Accessible Text</div></template>',
    '<template><div role="heading" aria-level="1"><span>Accessible Text</span></div></template>',
    '<template><div role="heading" aria-level="1"><span aria-hidden="true">Hidden text</span><span>Visible text</span></div></template>',
    '<template><div role="heading" aria-level="1"><span aria-hidden="true">Hidden text</span>Visible text</div></template>',
    '<template><div></div></template>',
    '<template><p></p></template>',
    '<template><span></span></template>',
    '<template><header></header></template>',
    '<template><h2><CustomComponent /></h2></template>',
    '<template><h2>{{@title}}</h2></template>',
    '<template><h2>{{#component}}{{/component}}</h2></template>',
    '<template><h2><span>{{@title}}</span></h2></template>',
    '<template><h2><div><CustomComponent /></div></h2></template>',
    '<template><h2><div></div><CustomComponent /></h2></template>',
    '<template><h2><div><span>{{@title}}</span></div></h2></template>',
    '<template><h2><span>Some text{{@title}}</span></h2></template>',
    '<template><h2><span><div></div>{{@title}}</span></h2></template>',
  ],
  invalid: [
    {
      code: '<template><h1></h1></template>',
      output: null,
      errors: [{ messageId: 'emptyHeading' }],
    },
    {
      code: '<template><h2>   </h2></template>',
      output: null,
      errors: [{ messageId: 'emptyHeading' }],
    },
    {
      code: `<template><h1> 
 &nbsp;</h1></template>`,
      output: null,
      errors: [{ messageId: 'emptyHeading' }],
    },
    {
      code: '<template><h1><span></span></h1></template>',
      output: null,
      errors: [{ messageId: 'emptyHeading' }],
    },
    {
      code: `<template><h1><span> 
 &nbsp;</span></h1></template>`,
      output: null,
      errors: [{ messageId: 'emptyHeading' }],
    },
    {
      code: '<template><h1><div><span></span></div></h1></template>',
      output: null,
      errors: [{ messageId: 'emptyHeading' }],
    },
    {
      code: '<template><h1><span></span><span></span></h1></template>',
      output: null,
      errors: [{ messageId: 'emptyHeading' }],
    },
    {
      code: '<template><h1> &nbsp; <div aria-hidden="true">Some hidden text</div></h1></template>',
      output: null,
      errors: [{ messageId: 'emptyHeading' }],
    },
    {
      code: '<template><h1><span aria-hidden="true">Inaccessible text</span></h1></template>',
      output: null,
      errors: [{ messageId: 'emptyHeading' }],
    },
    {
      code: '<template><h1><span hidden>Inaccessible text</span></h1></template>',
      output: null,
      errors: [{ messageId: 'emptyHeading' }],
    },
    {
      code: '<template><h1><span hidden>{{@title}}</span></h1></template>',
      output: null,
      errors: [{ messageId: 'emptyHeading' }],
    },
    {
      code: '<template><h1><span hidden>{{#component}}Inaccessible text{{/component}}</span></h1></template>',
      output: null,
      errors: [{ messageId: 'emptyHeading' }],
    },
    {
      code: '<template><h1><span hidden><CustomComponent>Inaccessible text</CustomComponent></span></h1></template>',
      output: null,
      errors: [{ messageId: 'emptyHeading' }],
    },
    {
      code: '<template><h1><span aria-hidden="true">Hidden text</span><span aria-hidden="true">Hidden text</span></h1></template>',
      output: null,
      errors: [{ messageId: 'emptyHeading' }],
    },
    {
      code: '<template><div role="heading" aria-level="1"></div></template>',
      output: null,
      errors: [{ messageId: 'emptyHeading' }],
    },
    {
      code: '<template><div role="heading" aria-level="1"><span aria-hidden="true">Inaccessible text</span></div></template>',
      output: null,
      errors: [{ messageId: 'emptyHeading' }],
    },
    {
      code: '<template><div role="heading" aria-level="1"><span hidden>Inaccessible text</span></div></template>',
      output: null,
      errors: [{ messageId: 'emptyHeading' }],
    },
  ],
});

const hbsRuleTester = new RuleTester({
  parser: require.resolve('ember-eslint-parser/hbs'),
  parserOptions: { ecmaVersion: 2022, sourceType: 'module' },
});

hbsRuleTester.run('template-no-empty-headings (hbs)', rule, {
  valid: [
    '<h1>Accessible Heading</h1>',
    '<h1>Accessible&nbsp;Heading</h1>',
    '<h1 aria-hidden="true">Valid Heading</h1>',
    '<h1 aria-hidden="true"><span>Valid Heading</span></h1>',
    '<h1 aria-hidden="false">Accessible Heading</h1>',
    '<h1 hidden>Valid Heading</h1>',
    '<h1 hidden><span>Valid Heading</span></h1>',
    '<h1><span aria-hidden="true">Hidden text</span><span>Visible text</span></h1>',
    '<h1><span aria-hidden="true">Hidden text</span>Visible text</h1>',
    '<div role="heading" aria-level="1">Accessible Text</div>',
    '<div role="heading" aria-level="1"><span>Accessible Text</span></div>',
    '<div role="heading" aria-level="1"><span aria-hidden="true">Hidden text</span><span>Visible text</span></div>',
    '<div role="heading" aria-level="1"><span aria-hidden="true">Hidden text</span>Visible text</div>',
    '<div></div>',
    '<p></p>',
    '<span></span>',
    '<header></header>',
    '<h2><CustomComponent /></h2>',
    '<h2>{{@title}}</h2>',
    '<h2>{{#component}}{{/component}}</h2>',
    '<h2><span>{{@title}}</span></h2>',
    '<h2><div><CustomComponent /></div></h2>',
    '<h2><div></div><CustomComponent /></h2>',
    '<h2><div><span>{{@title}}</span></div></h2>',
    '<h2><span>Some text{{@title}}</span></h2>',
    '<h2><span><div></div>{{@title}}</span></h2>',
  ],
  invalid: [
    {
      code: '<h1></h1>',
      output: null,
      errors: [{ messageId: 'emptyHeading' }],
    },
    {
      code: '<h1> \n &nbsp;</h1>',
      output: null,
      errors: [{ messageId: 'emptyHeading' }],
    },
    {
      code: '<h1><span></span></h1>',
      output: null,
      errors: [{ messageId: 'emptyHeading' }],
    },
    {
      code: '<h1><span> \n &nbsp;</span></h1>',
      output: null,
      errors: [{ messageId: 'emptyHeading' }],
    },
    {
      code: '<h1><div><span></span></div></h1>',
      output: null,
      errors: [{ messageId: 'emptyHeading' }],
    },
    {
      code: '<h1><span></span><span></span></h1>',
      output: null,
      errors: [{ messageId: 'emptyHeading' }],
    },
    {
      code: '<h1> &nbsp; <div aria-hidden="true">Some hidden text</div></h1>',
      output: null,
      errors: [{ messageId: 'emptyHeading' }],
    },
    {
      code: '<h1><span aria-hidden="true">Inaccessible text</span></h1>',
      output: null,
      errors: [{ messageId: 'emptyHeading' }],
    },
    {
      code: '<h1><span hidden>Inaccessible text</span></h1>',
      output: null,
      errors: [{ messageId: 'emptyHeading' }],
    },
    {
      code: '<h1><span hidden>{{@title}}</span></h1>',
      output: null,
      errors: [{ messageId: 'emptyHeading' }],
    },
    {
      code: '<h1><span hidden>{{#component}}Inaccessible text{{/component}}</span></h1>',
      output: null,
      errors: [{ messageId: 'emptyHeading' }],
    },
    {
      code: '<h1><span hidden><CustomComponent>Inaccessible text</CustomComponent></span></h1>',
      output: null,
      errors: [{ messageId: 'emptyHeading' }],
    },
    {
      code: '<h1><span aria-hidden="true">Hidden text</span><span aria-hidden="true">Hidden text</span></h1>',
      output: null,
      errors: [{ messageId: 'emptyHeading' }],
    },
    {
      code: '<div role="heading" aria-level="1"></div>',
      output: null,
      errors: [{ messageId: 'emptyHeading' }],
    },
    {
      code: '<div role="heading" aria-level="1"><span aria-hidden="true">Inaccessible text</span></div>',
      output: null,
      errors: [{ messageId: 'emptyHeading' }],
    },
    {
      code: '<div role="heading" aria-level="1"><span hidden>Inaccessible text</span></div>',
      output: null,
      errors: [{ messageId: 'emptyHeading' }],
    },
  ],
});
