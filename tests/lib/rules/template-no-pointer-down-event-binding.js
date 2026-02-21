//------------------------------------------------------------------------------
// Requirements
//------------------------------------------------------------------------------

const rule = require('../../../lib/rules/template-no-pointer-down-event-binding');
const RuleTester = require('eslint').RuleTester;

//------------------------------------------------------------------------------
// Tests
//------------------------------------------------------------------------------

const ruleTester = new RuleTester({
  parser: require.resolve('ember-eslint-parser'),
  parserOptions: { ecmaVersion: 2022, sourceType: 'module' },
});

ruleTester.run('template-no-pointer-down-event-binding', rule, {
  valid: [
    `<template>
      <button {{on "click" this.handleClick}}>Click</button>
    </template>`,
    `<template>
      <button {{on "keydown" this.handleKeyDown}}>Press</button>
    </template>`,
    `<template>
      <div {{on "mousedown" this.handleMouseDown}}>Content</div>
    </template>`,
  
    // Test cases ported from ember-template-lint
    "<template><div {{on 'mouseup' this.doSomething}}></div></template>",
    "<template><div {{action this.doSomething on='mouseup'}}></div></template>",
    '<template><input type="text" onmouseup="myFunction()"></template>',
    `<template>re not catching component arguments
    </template>`,
    `<template>,
    </template>`,
    `<template>,
  ],

  bad: [
    {
      template: </template>`,
    `<template>,
      verifyResults(results) {
        expect(results).toMatchInlineSnapshot(\`
          [
            {
              "column": 10,
              "endColumn": 21,
              "endLine": 1,
              "filePath": "layout.hbs",
              "line": 1,
              "message": "Avoid binding to a pointer \`down\` event; bind to a pointer \`up\` event instead",
              "rule": "no-pointer-down-event-binding",
              "severity": 2,
              "source": ""mousedown"",
            },
          ]
        \`);
      },
    },
    {
      template: </template>`,
    `<template>,
      verifyResults(results) {
        expect(results).toMatchInlineSnapshot(\`
          [
            {
              "column": 34,
              "endColumn": 45,
              "endLine": 1,
              "filePath": "layout.hbs",
              "line": 1,
              "message": "Avoid binding to a pointer \`down\` event; bind to a pointer \`up\` event instead",
              "rule": "no-pointer-down-event-binding",
              "severity": 2,
              "source": ""mousedown"",
            },
          ]
        \`);
      },
    },
    {
      // Detecting the \`on\` param works, even if it</template>`,
    '<template>{{action}}</template>',
    '<template><div {{action this.doSomething preventDefault=true on="mousedown"}}></div></template>',
  ],

  invalid: [
    {
      code: `<template>
        <button {{on "pointerdown" this.handlePointerDown}}>Click</button>
      </template>`,
      output: null,
      errors: [
        {
          message:
            'Avoid pointer down events. Use click or keydown events instead for better accessibility.',
          type: 'GlimmerElementModifierStatement',
        },
      ],
    },
    {
      code: `<template>
        <div onpointerdown={{this.handlePointerDown}}>Content</div>
      </template>`,
      output: null,
      errors: [
        {
          message:
            'Avoid pointer down events. Use click or keydown events instead for better accessibility.',
          type: 'GlimmerAttrNode',
        },
      ],
    },
  ],
});
