const rule = require('../../../lib/rules/template-template-length');
const RuleTester = require('eslint').RuleTester;

const ruleTester = new RuleTester({
  parser: require.resolve('ember-eslint-parser'),
  parserOptions: { ecmaVersion: 2022, sourceType: 'module' },
});

ruleTester.run('template-template-length', rule, {
  valid: [
    {
      code: `<template>
  one
  two
</template>`,
      options: [{ max: 5 }],
    },
    {
      code: `<template>
  one
  two
  three
</template>`,
      options: [{ min: 3 }],
    },
    {
      code: `<template>
  one
</template>`,
      options: [false],
    },
  ],
  invalid: [
    {
      code: `<template>
  one
  two
</template>`,
      output: null,
      options: [{ min: 10 }],
      errors: [{ message: 'Template length of 4 is smaller than 10' }],
    },
    {
      code: `<template>
  one
  two
  three
</template>`,
      output: null,
      options: [{ max: 3 }],
      errors: [{ message: 'Template length of 5 exceeds 3' }],
    },
  ],
});
