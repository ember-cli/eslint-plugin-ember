//------------------------------------------------------------------------------
// Requirements
//------------------------------------------------------------------------------

const rule = require('../../../lib/rules/template-indent');
const RuleTester = require('eslint').RuleTester;

//------------------------------------------------------------------------------
// Tests
//------------------------------------------------------------------------------

const ruleTester = new RuleTester({
  parser: require.resolve('../../../lib/parsers/gjs-gts-parser.js'),
  parserOptions: { ecmaVersion: 2020, sourceType: 'module' },
});

const ruleTesterWithBaseIntent = new RuleTester({
  parser: require.resolve('../../../lib/parsers/gjs-gts-parser.js'),
  parserOptions: { ecmaVersion: 2020, sourceType: 'module' },
  rules: {
    indent: 'warn',
  },
});

ruleTester.run('template-indent', rule, {
  valid: [
    `<template>
    <div>
        <div></div>
    </div>
    <div>
    </div>
    <pre>
          <here />
        doesnt matter
              where we
    write
    </pre>
    <div
        a='s'
        b='s'
        c='s'
    />
    <div a='s'
        b='s'
        c='s'
    />
</template>
    `,
    `
class MyClass {
   sad=2;
    <template>
        <div></div>
        {{test}}
    </template>
}
    `,
    `
const tpl = <template>
    <div></div>
    {{test}}
</template>
    `,
  ],

  invalid: [
    {
      code: `<template>
<div>
    <div></div>
</div>
<div>
    {{#if x}}
  {{test}}
        {{/if}}
</div>
<pre>
      <here />
    doesnt matter
          where we
write
</pre>
<div
    a='s'
b='s'
  c='s'
/>
<div a='s'
    b='s'
      c='s'
/>
    <like-pre>
        <!-- eslint-disable -->
          <here />
        doesnt matter
              where we
        write
        <!-- eslint-enable -->
    </like-pre>
<MyComp
 as | abc |>
 </MyComp>
</template>
      `,
      output: `<template>
    <div>
        <div></div>
    </div>
    <div>
        {{#if x}}
            {{test}}
        {{/if}}
    </div>
    <pre>
      <here />
    doesnt matter
          where we
write
    </pre>
    <div
        a='s'
        b='s'
        c='s'
    />
    <div a='s'
        b='s'
        c='s'
    />
    <like-pre>
        <!-- eslint-disable -->
          <here />
        doesnt matter
              where we
        write
        <!-- eslint-enable -->
    </like-pre>
    <MyComp
        as | abc |>
    </MyComp>
</template>
      `,
      errors: [
        {
          message: 'Expected indentation of 4 spaces but found 0.',
          line: 2,
          column: 1,
          endLine: 2,
          endColumn: 1,
        },
        {
          message: 'Expected indentation of 8 spaces but found 4.',
          line: 3,
          column: 1,
          endLine: 3,
          endColumn: 5,
        },
        {
          message: 'Expected indentation of 4 spaces but found 0.',
          line: 4,
          column: 1,
          endLine: 4,
          endColumn: 1,
        },
        {
          message: 'Expected indentation of 4 spaces but found 0.',
          line: 5,
          column: 1,
          endLine: 5,
          endColumn: 1,
        },
        {
          message: 'Expected indentation of 8 spaces but found 4.',
          line: 6,
          column: 1,
          endLine: 6,
          endColumn: 5,
        },
        {
          message: 'Expected indentation of 12 spaces but found 2.',
          line: 7,
          column: 1,
          endLine: 7,
          endColumn: 3,
        },
        {
          message: 'Expected indentation of 4 spaces but found 0.',
          line: 9,
          column: 1,
          endLine: 9,
          endColumn: 1,
        },
        {
          message: 'Expected indentation of 4 spaces but found 0.',
          line: 10,
          column: 1,
          endLine: 10,
          endColumn: 1,
        },
        {
          message: 'Expected indentation of 4 spaces but found 0.',
          line: 15,
          column: 1,
          endLine: 15,
          endColumn: 1,
        },
        {
          message: 'Expected indentation of 4 spaces but found 0.',
          line: 16,
          column: 1,
          endLine: 16,
          endColumn: 1,
        },
        {
          message: 'Expected indentation of 8 spaces but found 4.',
          line: 17,
          column: 1,
          endLine: 17,
          endColumn: 5,
        },
        {
          message: 'Expected indentation of 8 spaces but found 0.',
          line: 18,
          column: 1,
          endLine: 18,
          endColumn: 1,
        },
        {
          message: 'Expected indentation of 8 spaces but found 2.',
          line: 19,
          column: 1,
          endLine: 19,
          endColumn: 3,
        },
        {
          message: 'Expected indentation of 4 spaces but found 0.',
          line: 20,
          column: 1,
          endLine: 20,
          endColumn: 1,
        },
        {
          message: 'Expected indentation of 4 spaces but found 0.',
          line: 21,
          column: 1,
          endLine: 21,
          endColumn: 1,
        },
        {
          message: 'Expected indentation of 8 spaces but found 4.',
          line: 22,
          column: 1,
          endLine: 22,
          endColumn: 5,
        },
        {
          message: 'Expected indentation of 8 spaces but found 6.',
          line: 23,
          column: 1,
          endLine: 23,
          endColumn: 7,
        },
        {
          message: 'Expected indentation of 4 spaces but found 0.',
          line: 24,
          column: 1,
          endLine: 24,
          endColumn: 1,
        },
        {
          message: 'Expected indentation of 4 spaces but found 0.',
          line: 33,
          column: 1,
          endLine: 33,
          endColumn: 1,
        },
        {
          message: 'Expected indentation of 8 spaces but found 1.',
          line: 34,
          column: 1,
          endLine: 34,
          endColumn: 2,
        },
        {
          message: 'Expected indentation of 4 spaces but found 1.',
          line: 35,
          column: 1,
          endLine: 35,
          endColumn: 2,
        },
      ],
    },
  ],
});

// make sure this works together with the base indent rule
ruleTesterWithBaseIntent.run('template-indent-with-base.indent', rule, {
  valid: [
    `
class MyClass {
    sad=2;
    <template>
        <div></div>
        {{test}}
    </template>
}
    `,
  ],
  invalid: [
    {
      code: `
class MyClass {
      sad=2;
    <template>
        <div></div>
          {{test}}
    </template>
}
    `,
      output: `
class MyClass {
    sad=2;
    <template>
        <div></div>
        {{test}}
    </template>
}
    `,
      errors: [
        {
          type: 'Identifier',
          message: 'Expected indentation of 4 spaces but found 6.',
          line: 3,
          column: 1,
          endLine: 3,
          endColumn: 7,
        },
        {
          type: 'Punctuator',
          message: 'Expected indentation of 8 spaces but found 10.',
          line: 6,
          column: 1,
          endLine: 6,
          endColumn: 11,
        },
      ],
    },
  ],
});
