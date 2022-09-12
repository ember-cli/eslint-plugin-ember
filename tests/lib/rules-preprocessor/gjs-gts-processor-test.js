'use strict';

/**
 * Because this test needs the preprocessor, we can't use the normal
 * RuleTester api doesn't support preprocessors.
 *
 * @typedef {import('eslint/lib/cli-engine/cli-engine').CLIEngineOptions} CLIEngineOptions
 */

const { ESLint } = require('eslint');
const plugin = require('../../../lib');

/**
 * Helper function which creates ESLint instance with enabled/disabled autofix feature.
 *
 * @param {CLIEngineOptions} [options={}] Whether to enable autofix feature.
 * @returns {ESLint} ESLint instance to execute in tests.
 */
function initESLint(options) {
  // tests must be run with ESLint 7+
  return new ESLint({
    ignore: false,
    useEslintrc: false,
    plugins: { ember: plugin },
    overrideConfig: {
      root: true,
      env: {
        browser: true,
      },
      parser: '@babel/eslint-parser',
      parserOptions: {
        ecmaVersion: 2020,
        sourceType: 'module',
      },
      plugins: ['ember'],
      extends: ['plugin:ember/recommended'],
      rules: {
        'no-undef': 'error',
      },
    },
    ...options,
  });
}

const valid = [
  {
    filename: 'my-component.js',
    code: `
      import Component from '@glimmer/component';

      export default class MyComponent extends Component {
        constructor() {
          super(...arguments);
        }
      }
    `,
  },
  {
    filename: 'my-component.gjs',
    code: `
      import { on } from '@ember/modifier';

      const noop = () => {};

      <template>
        <div {{on 'click' noop}} />
      </template>
    `,
  },
  {
    filename: 'my-component.gjs',
    code: `
      import { on } from '@ember/modifier';

      const noop = () => {};

      export default <template>
        <div {{on 'click' noop}} />
      </template>
    `,
  },
  {
    filename: 'my-component.gjs',
    code: `
      const Foo = <template>hi</template>

      <template>
        <Foo />
      </template>
    `,
  },
];

const invalid = [
  {
    filename: 'my-component.gjs',
    code: `
      const noop = () => {};

      <template>
        {{on 'click' noop}}
      </template>
    `,
    errors: [
      {
        message: "'on' is not defined.",
        line: 5,
        column: 11,
      },
    ],
  },
  {
    filename: 'my-component.gjs',
    code: `
      <template>
        {{noop}}
      </template>
    `,
    errors: [
      {
        message: "'noop' is not defined.",
        line: 3,
        column: 11,
      },
    ],
  },
  {
    filename: 'my-component.gjs',
    code: `
      <template>
        <Foo />
      </template>
    `,
    errors: [
      {
        message: "'Foo' is not defined.",
        line: 3,
        column: 10,
      },
    ],
  },
];

describe('template-vars', () => {
  describe('valid', () => {
    for (const scenario of valid) {
      const { code, filename } = scenario;

      // eslint-disable-next-line jest/valid-title
      it(code, async () => {
        const eslint = initESLint();
        const results = await eslint.lintText(code, { filePath: filename });
        const resultErrors = results.flatMap((result) => result.messages);

        // This gives more meaningful information than
        // checking if results is empty / length === 0
        let message = '';

        // When node 12 is dropped, change this to optional chaining
        if (results && results[0]) {
          if (results[0].messages && results[0].messages[0]) {
            if (results[0].messages[0].message) {
              message = results[0].messages[0].message || '';
            }
          }
        }

        expect(message).toBe('');
        expect(resultErrors).toHaveLength(0);
      });
    }
  });

  describe('invalid', () => {
    for (const scenario of invalid) {
      const { code, filename, errors } = scenario;

      // eslint-disable-next-line jest/valid-title
      it(code, async () => {
        const eslint = initESLint();
        const results = await eslint.lintText(code, { filePath: filename });

        const resultErrors = results.flatMap((result) => result.messages);
        expect(resultErrors).toHaveLength(errors.length);

        for (const [index, error] of resultErrors.entries()) {
          const expected = errors[index];

          for (const key of Object.keys(expected)) {
            // Prefix with what key we are looking at so
            // that debugging is less painful
            const expectedString = `${key}: ${expected[key]}`;
            const actualString = `${key}: ${error[key]}`;

            expect(actualString).toStrictEqual(expectedString);
          }
        }
      });
    }
  });
});
