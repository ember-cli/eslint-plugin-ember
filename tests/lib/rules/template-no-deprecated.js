'use strict';

const path = require('node:path');
const rule = require('../../../lib/rules/template-no-deprecated');
const RuleTester = require('eslint').RuleTester;

const FIXTURES_DIR = path.join(__dirname, '../rules-preprocessor/template-no-deprecated');

// Block 1: No TypeScript project -- rule is a no-op
// When parserServices.program is absent, the rule returns {} and never reports.

const ruleTester = new RuleTester({
  parser: require.resolve('ember-eslint-parser'),
  parserOptions: { ecmaVersion: 2022, sourceType: 'module' },
});

ruleTester.run('template-no-deprecated', rule, {
  valid: [
    // Non-deprecated component reference
    `
      import SomeComponent from './some-component';
      <template><SomeComponent /></template>
    `,
    // Plain HTML tag — never reported
    `
      <template><div></div></template>
    `,
    // this.something — not a scope reference
    `
      <template>{{this.foo}}</template>
    `,
    // Undefined reference — no def, skip
    `
      <template>{{undefinedThing}}</template>
    `,
  ],
  invalid: [],
});

// Block 2: TypeScript project -- full deprecation checking

const PREPROCESSOR_DIR = path.join(__dirname, '../rules-preprocessor');

const ruleTesterTyped = new RuleTester({
  parser: require.resolve('ember-eslint-parser'),
  parserOptions: {
    project: path.join(PREPROCESSOR_DIR, 'tsconfig.eslint.json'),
    tsconfigRootDir: PREPROCESSOR_DIR,
    ecmaVersion: 2022,
    sourceType: 'module',
    extraFileExtensions: ['.gts'],
  },
});

ruleTesterTyped.run('template-no-deprecated (with TS project)', rule, {
  valid: [
    // Non-deprecated component — no error
    {
      filename: path.join(FIXTURES_DIR, 'usage.gts'),
      code: `
        import CurrentComponent from './current-component';
        <template><CurrentComponent /></template>
      `,
    },
    // Plain HTML tag
    {
      filename: path.join(FIXTURES_DIR, 'usage.gts'),
      code: `
        <template><div></div></template>
      `,
    },
    // this.something — no scope reference
    {
      filename: path.join(FIXTURES_DIR, 'usage.gts'),
      code: `
        <template>{{this.foo}}</template>
      `,
    },
  ],
  invalid: [
    // Deprecated component in element position
    {
      filename: path.join(FIXTURES_DIR, 'usage.gts'),
      code: `
        import DeprecatedComponent from './deprecated-component';
        <template><DeprecatedComponent /></template>
      `,
      output: null,
      errors: [{ messageId: 'deprecatedWithReason', type: 'GlimmerElementNodePart' }],
    },
    // Deprecated helper in mustache position
    {
      filename: path.join(FIXTURES_DIR, 'usage.gts'),
      code: `
        import { deprecatedHelper } from './deprecated-helper';
        <template>{{deprecatedHelper}}</template>
      `,
      output: null,
      errors: [{ messageId: 'deprecated', type: 'VarHead' }],
    },
    // Deprecated component in block position
    {
      filename: path.join(FIXTURES_DIR, 'usage.gts'),
      code: `
        import DeprecatedComponent from './deprecated-component';
        <template>{{#DeprecatedComponent}}{{/DeprecatedComponent}}</template>
      `,
      output: null,
      errors: [{ messageId: 'deprecatedWithReason', type: 'VarHead' }],
    },
  ],
});
