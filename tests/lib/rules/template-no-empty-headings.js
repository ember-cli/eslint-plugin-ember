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

    // Non-PascalCase component forms count as accessible content
    '<template><h1><this.Heading /></h1></template>',
    '<template><h2><@heading /></h2></template>',
    '<template><h3><ns.Heading /></h3></template>',

    // Explicit "true" exempts the empty-heading check — author has
    // signalled the heading is intentionally hidden from assistive tech.
    '<template><h1 aria-hidden={{true}}></h1></template>',
    '<template><h1 aria-hidden="true">Visible to sighted only</h1></template>',
    '<template><h1 aria-hidden="TRUE"></h1></template>',
    '<template><h1 aria-hidden="True"></h1></template>',
    '<template><h1 aria-hidden={{"TRUE"}}></h1></template>',
    '<template><h1 aria-hidden={{"True"}}></h1></template>',
    // Quoted-mustache (GlimmerConcatStatement) forms — `aria-hidden="{{true}}"`
    // resolves the same as `aria-hidden={{true}}`. Pin these so future
    // refactors don't regress concat handling.
    '<template><h1 aria-hidden="{{true}}"></h1></template>',
    '<template><h1 aria-hidden="{{"true"}}"></h1></template>',
    // Whitespace normalization — incidental surrounding whitespace should
    // still resolve to "true".
    '<template><h1 aria-hidden={{" true "}}></h1></template>',
    '<template><h1 aria-hidden=" true "></h1></template>',
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

    // Explicit falsy aria-hidden does NOT exempt the empty-heading check —
    // this is the unambiguous opt-out, no ecosystem position disagrees.
    {
      code: '<template><h1 aria-hidden="false"></h1></template>',
      output: null,
      errors: [{ messageId: 'emptyHeading' }],
    },
    {
      code: '<template><h1 aria-hidden={{false}}></h1></template>',
      output: null,
      errors: [{ messageId: 'emptyHeading' }],
    },
    {
      code: '<template><h1 aria-hidden={{"false"}}></h1></template>',
      output: null,
      errors: [{ messageId: 'emptyHeading' }],
    },
    // Per WAI-ARIA 1.2 §6.6 aria-hidden value table: valueless /
    // empty-string `aria-hidden` resolves to the default `undefined`,
    // not `true`. Empty headings with these forms still flag.
    {
      code: '<template><h1 aria-hidden></h1></template>',
      output: null,
      errors: [{ messageId: 'emptyHeading' }],
    },
    {
      code: '<template><h1 aria-hidden=""></h1></template>',
      output: null,
      errors: [{ messageId: 'emptyHeading' }],
    },
    // Mustache / concat forms that resolve to an empty / whitespace-only
    // string — same spec-aligned treatment.
    {
      code: '<template><h1 aria-hidden={{""}}></h1></template>',
      output: null,
      errors: [{ messageId: 'emptyHeading' }],
    },
    {
      code: '<template><h1 aria-hidden="{{""}}"></h1></template>',
      output: null,
      errors: [{ messageId: 'emptyHeading' }],
    },
    {
      code: '<template><h1 aria-hidden={{" "}}></h1></template>',
      output: null,
      errors: [{ messageId: 'emptyHeading' }],
    },
  ],
});
