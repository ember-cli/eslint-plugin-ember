'use strict';

//------------------------------------------------------------------------------
// Requirements
//------------------------------------------------------------------------------

const emberSourceVersionUtil = require('../../../lib/utils/ember-source-version');
const rule = require('../../../lib/rules/no-legacy-helper-imports');
const RuleTester = require('eslint').RuleTester;

const { ERROR_MESSAGE } = rule;

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
    parser: require.resolve('@babel/eslint-parser'),
    parserOptions: { ecmaVersion: 2022, sourceType: 'module' },
  });

  ruleTester.run('no-legacy-helper-imports', rule, {
    valid: [
      "import { neq } from 'my-app/helpers/neq';",
      "import { element } from 'my-app/helpers/element';",
      "import { fn } from 'my-app/helpers/fn';",
      "import { on } from 'my-app/modifiers/on';",
    ],

    invalid: [
      {
        code: "import { eq } from 'ember-truth-helpers';\nconst ok = eq(a, b);",
        output: 'const ok = eq(a, b);',
        errors: [{ message: ERROR_MESSAGE, type: 'ImportDeclaration' }],
      },
      {
        code: "import { notEq } from 'ember-truth-helpers';\nconst ok = notEq(a, b);",
        output: 'const ok = neq(a, b);',
        errors: [{ message: ERROR_MESSAGE, type: 'ImportDeclaration' }],
      },
      {
        code: "import { notEq as isDifferent } from 'ember-truth-helpers';\nconst ok = isDifferent(a, b);",
        output: 'const ok = neq(a, b);',
        errors: [{ message: ERROR_MESSAGE, type: 'ImportDeclaration' }],
      },
      {
        code: "import element_ from 'ember-element-helper';\nconst result = element_(this.id);",
        output: 'const result = element(this.id);',
        errors: [{ message: ERROR_MESSAGE, type: 'ImportDeclaration' }],
      },
      {
        code: "import foo from 'ember-element-helper/helpers/element';\nconst result = foo(this.id);",
        output: 'const result = element(this.id);',
        errors: [{ message: ERROR_MESSAGE, type: 'ImportDeclaration' }],
      },
      {
        code: "import { and as legacyAnd } from 'ember-truth-helpers';\nconst ok = legacyAnd(a, b);",
        output: 'const ok = and(a, b);',
        errors: [{ message: ERROR_MESSAGE, type: 'ImportDeclaration' }],
      },
      {
        code: "import { fn } from '@ember/helper';\nconst callback = fn(this.save);",
        output: 'const callback = fn(this.save);',
        errors: [{ message: ERROR_MESSAGE, type: 'ImportDeclaration' }],
      },
      {
        code: "import { on } from '@ember/modifier';\nconst modifier = on('click', this.click);",
        output: "const modifier = on('click', this.click);",
        errors: [{ message: ERROR_MESSAGE, type: 'ImportDeclaration' }],
      },
      {
        code: "import { notEq } from 'ember-truth-helpers';\nconst neq = true;\nconst ok = notEq(a, b);",
        output: null,
        errors: [{ message: ERROR_MESSAGE, type: 'ImportDeclaration' }],
      },
      {
        code: "import helper, { eq } from 'ember-truth-helpers';\nconst ok = eq(a, b);",
        output: null,
        errors: [{ message: ERROR_MESSAGE, type: 'ImportDeclaration' }],
      },
      {
        code: "import 'ember-truth-helpers';\nconst ok = true;",
        output: 'const ok = true;',
        errors: [{ message: ERROR_MESSAGE, type: 'ImportDeclaration' }],
      },
      {
        code: "import { foo } from 'ember-truth-helpers';\nconst ok = foo(a, b);",
        output: null,
        errors: [{ message: ERROR_MESSAGE, type: 'ImportDeclaration' }],
      },
    ],
  });
});
