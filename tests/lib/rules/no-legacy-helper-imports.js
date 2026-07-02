'use strict';

//------------------------------------------------------------------------------
// Requirements
//------------------------------------------------------------------------------

const emberSourceVersionUtil = require('../../../lib/utils/ember-source-version');
const rule = require('../../../lib/rules/no-legacy-helper-imports');
const RuleTester = require('eslint').RuleTester;

//------------------------------------------------------------------------------
// Tests
//------------------------------------------------------------------------------

describe('no-legacy-helper-imports', () => {
  beforeAll(() => {
    vi.spyOn(emberSourceVersionUtil, 'isEmberSourceVersionAtLeast').mockReturnValue(true);
  });

  afterAll(() => {
    vi.restoreAllMocks();
  });

  const ruleTester = new RuleTester({
    parser: require.resolve('ember-eslint-parser'),
    parserOptions: { ecmaVersion: 2022, sourceType: 'module' },
  });

  ruleTester.run('no-legacy-helper-imports', rule, {
    valid: [
      // Unrelated modules
      "import { eq } from 'my-app/helpers/eq';",
      "import element from 'my-app/helpers/element';",
      "import { on } from 'my-app/modifiers/on';",

      // Non-superseded exports of @ember/helper and @ember/modifier
      "import { helper } from '@ember/helper';\nexport default helper(() => {});",
      "import { concat, get, uniqueId } from '@ember/helper';",
      "import { setModifierManager, capabilities } from '@ember/modifier';",
      "import '@ember/helper';",

      // Truth helpers without a built-in keyword equivalent
      "import { xor } from 'ember-truth-helpers';\n<template>{{xor a b}}</template>",

      // Namespace imports have no per-keyword binding to replace
      "import * as truthHelpers from 'ember-truth-helpers';\n<template>{{truthHelpers.eq a b}}</template>",
    ],

    invalid: [
      // Import removal; usage keeps the same (keyword) name
      {
        code: "import { eq } from 'ember-truth-helpers';\n<template>{{eq a b}}</template>",
        output: '<template>{{eq a b}}</template>',
        errors: [{ messageId: 'legacyImport', type: 'ImportDeclaration' }],
      },

      // notEq is renamed to the neq keyword
      {
        code: "import { notEq } from 'ember-truth-helpers';\n<template>{{notEq a b}}</template>",
        output: '<template>{{neq a b}}</template>',
        errors: [{ messageId: 'legacyImport', type: 'ImportDeclaration' }],
      },

      // Aliased named import: usages are renamed to the keyword
      {
        code: "import { notEq as isDifferent } from 'ember-truth-helpers';\n<template>{{isDifferent a b}}</template>",
        output: '<template>{{neq a b}}</template>',
        errors: [{ messageId: 'legacyImport', type: 'ImportDeclaration' }],
      },
      {
        code: "import { and as allOf } from 'ember-truth-helpers';\n<template>{{if (allOf a b) 'both'}}</template>",
        output: "<template>{{if (and a b) 'both'}}</template>",
        errors: [{ messageId: 'legacyImport', type: 'ImportDeclaration' }],
      },

      // Multiple specifiers, some renamed
      {
        code: "import { eq, notEq } from 'ember-truth-helpers';\n<template>{{eq a b}} {{notEq a b}}</template>",
        output: '<template>{{eq a b}} {{neq a b}}</template>',
        errors: [{ messageId: 'legacyImport', type: 'ImportDeclaration' }],
      },

      // Default imports from subpath modules
      {
        code: "import notEq from 'ember-truth-helpers/helpers/not-eq';\n<template>{{notEq a b}}</template>",
        output: '<template>{{neq a b}}</template>',
        errors: [{ messageId: 'legacyImport', type: 'ImportDeclaration' }],
      },
      {
        code: "import foo from 'ember-element-helper/helpers/element';\n<template>{{#let (foo 'div') as |Tag|}}<Tag />{{/let}}</template>",
        output: "<template>{{#let (element 'div') as |Tag|}}<Tag />{{/let}}</template>",
        errors: [{ messageId: 'legacyImport', type: 'ImportDeclaration' }],
      },

      // Default import from the ember-element-helper main entry point
      {
        code: "import element_ from 'ember-element-helper';\n<template>{{#let (element_ tag) as |Tag|}}<Tag />{{/let}}</template>",
        output: '<template>{{#let (element tag) as |Tag|}}<Tag />{{/let}}</template>',
        errors: [{ messageId: 'legacyImport', type: 'ImportDeclaration' }],
      },

      // Modifier usage
      {
        code: 'import { on } from \'@ember/modifier\';\n<template><button type="button" {{on "click" go}}>go</button></template>',
        output: '<template><button type="button" {{on "click" go}}>go</button></template>',
        errors: [{ messageId: 'legacyImport', type: 'ImportDeclaration' }],
      },

      // Mixed import: superseded specifier is removed, the rest is kept
      {
        code: "import { fn, helper } from '@ember/helper';\nconst two = helper(() => 2);\n<template>{{fn go two}}</template>",
        output:
          "import { helper } from '@ember/helper';\nconst two = helper(() => 2);\n<template>{{fn go two}}</template>",
        errors: [{ messageId: 'legacyImport', type: 'ImportDeclaration' }],
      },

      // Unused import: safe to remove even without template usage
      {
        code: "import { eq } from 'ember-truth-helpers';\nexport const x = 1;",
        output: 'export const x = 1;',
        errors: [{ messageId: 'legacyImport', type: 'ImportDeclaration' }],
      },

      // Side-effect import of a legacy package
      {
        code: "import 'ember-truth-helpers';\nexport const x = 1;",
        output: 'export const x = 1;',
        errors: [{ messageId: 'legacyImport', type: 'ImportDeclaration' }],
      },

      // Usage in JavaScript code: keywords only exist in templates, so no autofix
      {
        code: "import { eq } from 'ember-truth-helpers';\nconst isSame = eq;",
        output: null,
        errors: [{ messageId: 'legacyImport', type: 'ImportDeclaration' }],
      },
      {
        code: "import { fn } from '@ember/helper';\nconst callback = fn(go, 1);\n<template>{{fn go 2}}</template>",
        output: null,
        errors: [{ messageId: 'legacyImport', type: 'ImportDeclaration' }],
      },

      // Renaming would collide with a module-scope binding named like the keyword
      {
        code: "import { notEq } from 'ember-truth-helpers';\nconst neq = 'shadow';\nexport { neq };\n<template>{{notEq a b}}</template>",
        output: null,
        errors: [{ messageId: 'legacyImport', type: 'ImportDeclaration' }],
      },

      // ...or with a binding in a scope enclosing the usage
      {
        code: "import { notEq } from 'ember-truth-helpers';\nexport function compare(neq) {\n  return <template>{{notEq a b}}</template>;\n}",
        output: null,
        errors: [{ messageId: 'legacyImport', type: 'ImportDeclaration' }],
      },
    ],
  });
});

describe('no-legacy-helper-imports with ember-source < 7.1', () => {
  beforeAll(() => {
    vi.spyOn(emberSourceVersionUtil, 'isEmberSourceVersionAtLeast').mockReturnValue(false);
  });

  afterAll(() => {
    vi.restoreAllMocks();
  });

  const ruleTester = new RuleTester({
    parser: require.resolve('ember-eslint-parser'),
    parserOptions: { ecmaVersion: 2022, sourceType: 'module' },
  });

  ruleTester.run('no-legacy-helper-imports', rule, {
    valid: [
      // The keywords are not available before Ember 7.1, so imports stay
      "import { eq } from 'ember-truth-helpers';\n<template>{{eq a b}}</template>",
      'import { on } from \'@ember/modifier\';\n<template><button type="button" {{on "click" go}}>go</button></template>',
    ],
    invalid: [],
  });
});
