'use strict';

//------------------------------------------------------------------------------
// Requirements
//------------------------------------------------------------------------------

const emberSourceVersionUtil = require('../../../lib/utils/ember-source-version');
const { DEPRECATED_IMPORTS } = require('../../../lib/utils/deprecated-imports');
const rule = require('../../../lib/rules/no-deprecated-imports');
const RuleTester = require('eslint').RuleTester;

const parserOptions = { ecmaVersion: 2022, sourceType: 'module' };

function message(what, version, id) {
  const deprecation = DEPRECATED_IMPORTS.find(
    (d) => d.id === id && (what.includes(`\`${d.source}\``) || what === `\`${d.source}\``)
  );
  return `Importing ${what} is deprecated in Ember ${version} (id: ${id}). ${deprecation.replacement} See ${deprecation.url}`;
}

const MIXIN = message('the default export of `@ember/object/mixin`', '7.4.0', 'deprecate-mixins');
const ARRAY_A = message('`A` from `@ember/array`', '7.5.0', 'deprecate-ember-array-a');
const EMBER_ARRAY = message(
  'the default export of `@ember/array`',
  '7.5.0',
  'deprecate-ember-array-mixin'
);
const INJECT = message(
  '`inject` from `@ember/service`',
  '6.3.0',
  'importing-inject-from-ember-service'
);

//------------------------------------------------------------------------------
// Tests
//------------------------------------------------------------------------------

const ruleTester = new RuleTester({
  parserOptions,
  parser: require.resolve('@babel/eslint-parser'),
});

const tsRuleTester = new RuleTester({
  parserOptions,
  parser: require.resolve('@typescript-eslint/parser'),
});

describe('no-deprecated-imports', () => {
  let versionSpy;

  beforeAll(() => {
    versionSpy = vi.spyOn(emberSourceVersionUtil, 'getEmberSourceVersion');
  });

  afterAll(() => {
    vi.restoreAllMocks();
  });

  describe('with ember-source 7.4.0', () => {
    beforeAll(() => {
      versionSpy.mockReturnValue('7.4.0');
    });

    ruleTester.run('no-deprecated-imports', rule, {
      valid: [
        // Not deprecated
        "import Component from '@glimmer/component';",
        "import { tracked } from '@glimmer/tracking';",
        "import { service } from '@ember/service';",
        "import { computed } from '@ember/object/computed';",
        "import { mixin } from '@ember/object/mixin';",

        // Deprecated in 7.5, not reported yet
        "import { A } from '@ember/array';",
        "import { isEmpty } from '@ember/utils';",
        "import { alias } from '@ember/object/computed';",

        // Paths that only look similar
        "import Mixin from '@ember/object/mixin-thing';",
        "import Mixin from 'my-app/mixins/foo';",

        // Silenced per path
        {
          code: "import Mixin from '@ember/object/mixin';",
          options: [{ imports: { '@ember/object/mixin': { report: false } } }],
        },
        {
          code: "import Mixin from '@ember/object/mixin';",
          options: [{ reportAll: true, imports: { '@ember/object/mixin': { report: false } } }],
        },

        // Namespace imports only match whole-module deprecations
        "import * as computed from '@ember/object/computed';",

        // Local exports
        'const A = 1; export { A };',
      ],

      invalid: [
        {
          code: "import Mixin from '@ember/object/mixin';",
          output: null,
          errors: [{ message: MIXIN, type: 'ImportDefaultSpecifier' }],
        },
        {
          code: "import { default as Mixin } from '@ember/object/mixin';",
          output: null,
          errors: [{ message: MIXIN, type: 'ImportSpecifier' }],
        },
        {
          code: "import Evented, { on } from '@ember/object/evented';",
          output: null,
          errors: [
            {
              message: message(
                'the default export of `@ember/object/evented`',
                '7.4.0',
                'deprecate-evented'
              ),
              type: 'ImportDefaultSpecifier',
            },
            {
              message: message('`on` from `@ember/object/evented`', '7.4.0', 'deprecate-evented'),
              type: 'ImportSpecifier',
            },
          ],
        },
        {
          code: "import { addListener as listen, sendEvent } from '@ember/object/events';",
          output: null,
          errors: [
            {
              message: message(
                '`addListener` from `@ember/object/events`',
                '7.4.0',
                'deprecate-evented'
              ),
            },
            {
              message: message(
                '`sendEvent` from `@ember/object/events`',
                '7.4.0',
                'deprecate-evented'
              ),
            },
          ],
        },
        {
          code: "import ArrayProxy from '@ember/array/proxy';",
          output: null,
          errors: [
            {
              message: message(
                'the default export of `@ember/array/proxy`',
                '7.4.0',
                'deprecate-array-proxy'
              ),
            },
          ],
        },

        // Older deprecations
        {
          code: "import { inject } from '@ember/service';",
          output: null,
          errors: [{ message: INJECT }],
        },
        {
          code: "import { inject as service } from '@ember/service';",
          output: null,
          errors: [{ message: INJECT }],
        },
        {
          code: "import Ember from 'ember';",
          output: null,
          errors: [
            {
              message: message(
                'the default export of `ember`',
                '6.5.0',
                'deprecate-import-ember-from-ember'
              ),
            },
          ],
        },
        {
          code: "import * as Ember from 'ember';",
          output: null,
          errors: [
            {
              message: message('`ember`', '6.5.0', 'deprecate-import-ember-from-ember'),
              type: 'ImportNamespaceSpecifier',
            },
          ],
        },
        {
          code: "import 'ember';",
          output: null,
          errors: [
            {
              message: message('`ember`', '6.5.0', 'deprecate-import-ember-from-ember'),
              type: 'ImportDeclaration',
            },
          ],
        },

        // Re-exports
        {
          code: "export { default } from '@ember/object/mixin';",
          output: null,
          errors: [{ message: MIXIN, type: 'ExportSpecifier' }],
        },
        {
          code: "export { default as Mixin } from '@ember/object/mixin';",
          output: null,
          errors: [{ message: MIXIN, type: 'ExportSpecifier' }],
        },
        {
          code: "export * from 'ember';",
          output: null,
          errors: [
            {
              message: message('`ember`', '6.5.0', 'deprecate-import-ember-from-ember'),
              type: 'ExportAllDeclaration',
            },
          ],
        },

        // Opting in early to a single path
        {
          code: "import { A } from '@ember/array'; import { isEmpty } from '@ember/utils';",
          output: null,
          options: [{ imports: { '@ember/array': { report: true } } }],
          errors: [{ message: ARRAY_A }],
        },

        // Opting in to everything
        {
          code: "import EmberArray, { A, isArray } from '@ember/array';",
          output: null,
          options: [{ reportAll: true }],
          errors: [{ message: EMBER_ARRAY }, { message: ARRAY_A }],
        },
        {
          code: "import { isEmpty, isNone } from '@ember/utils';",
          output: null,
          options: [{ reportAll: true }],
          errors: [
            {
              message: message('`isEmpty` from `@ember/utils`', '7.5.0', 'deprecate-ember-utils'),
            },
            {
              message: message('`isNone` from `@ember/utils`', '7.5.0', 'deprecate-ember-utils'),
            },
          ],
        },
        {
          code: "import { alias, empty, mapBy, computed } from '@ember/object/computed';",
          output: null,
          options: [{ reportAll: true }],
          errors: [
            {
              message: message(
                '`alias` from `@ember/object/computed`',
                '7.5.0',
                'deprecate-computed-macros'
              ),
            },
            {
              message: message(
                '`empty` from `@ember/object/computed`',
                '7.5.0',
                'deprecate-ember-utils'
              ),
            },
            {
              message: message(
                '`mapBy` from `@ember/object/computed`',
                '7.5.0',
                'deprecate-array-computed-macros'
              ),
            },
          ],
        },
      ],
    });
  });

  describe('with ember-source 7.5.0-alpha.3', () => {
    beforeAll(() => {
      versionSpy.mockReturnValue('7.5.0-alpha.3');
    });

    ruleTester.run('no-deprecated-imports', rule, {
      valid: ["import { Input } from '@ember/component';", "import { get } from '@ember/object';"],
      invalid: [
        {
          code: "import { A } from '@ember/array';",
          output: null,
          errors: [{ message: ARRAY_A }],
        },
        {
          code: "import Component from '@ember/component';",
          output: null,
          errors: [
            {
              message: message(
                'the default export of `@ember/component`',
                '7.5.0',
                'ember-component'
              ),
            },
          ],
        },
      ],
    });
  });

  describe('with ember-source 6.4.0', () => {
    beforeAll(() => {
      versionSpy.mockReturnValue('6.4.0');
    });

    ruleTester.run('no-deprecated-imports', rule, {
      // `ember` is available in 5.10 but only enabled in 6.5
      valid: ["import Ember from 'ember';", "import Mixin from '@ember/object/mixin';"],
      invalid: [
        {
          code: "import { inject } from '@ember/service';",
          output: null,
          errors: [{ message: INJECT }],
        },
      ],
    });
  });

  describe('without ember-source', () => {
    beforeAll(() => {
      versionSpy.mockReturnValue(null);
    });

    ruleTester.run('no-deprecated-imports', rule, {
      valid: [
        "import Mixin from '@ember/object/mixin';",
        "import { inject } from '@ember/service';",
        {
          code: "import Mixin from '@ember/object/mixin';",
          output: null,
          options: [{ imports: { '@ember/array': { report: true } } }],
        },
      ],
      invalid: [
        {
          code: "import Mixin from '@ember/object/mixin';",
          output: null,
          options: [{ reportAll: true }],
          errors: [{ message: MIXIN }],
        },
        {
          code: "import { A } from '@ember/array';",
          output: null,
          options: [{ imports: { '@ember/array': { report: true } } }],
          errors: [{ message: ARRAY_A }],
        },
      ],
    });
  });

  describe('with TypeScript', () => {
    beforeAll(() => {
      versionSpy.mockReturnValue('7.5.0');
    });

    tsRuleTester.run('no-deprecated-imports', rule, {
      valid: ["import type Owner from '@ember/owner';"],
      invalid: [
        {
          code: "import type EmberArray from '@ember/array';",
          output: null,
          errors: [{ message: EMBER_ARRAY }],
        },
        {
          code: "import { type NativeArray } from '@ember/array';",
          output: null,
          errors: [
            {
              message: message(
                '`NativeArray` from `@ember/array`',
                '7.5.0',
                'deprecate-native-array-mixin'
              ),
            },
          ],
        },
      ],
    });
  });

  describe('options schema', () => {
    const { Linter } = require('eslint');
    const linter = new Linter({ configType: 'flat' });
    const lint = (options) =>
      linter.verify('', [
        {
          plugins: { ember: { rules: { 'no-deprecated-imports': rule } } },
          rules: { 'ember/no-deprecated-imports': ['error', options] },
        },
      ]);

    it('accepts known import paths', () => {
      expect(() =>
        lint({ reportAll: true, imports: { '@ember/array': { report: false } } })
      ).not.toThrow();
    });

    it('rejects unknown import paths', () => {
      expect(() => lint({ imports: { '@ember/nope': { report: true } } })).toThrow(
        /property name '@ember\/nope' is invalid/
      );
    });

    it('rejects unknown per-path keys', () => {
      expect(() => lint({ imports: { '@ember/array': { enabled: true } } })).toThrow(
        /should NOT have additional properties/
      );
    });
  });
});
