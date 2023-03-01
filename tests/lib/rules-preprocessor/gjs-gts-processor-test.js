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
        'ember/no-get': 'off',
        'ember/no-array-prototype-extensions': 'error',
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
  /**
   * TODO: SKIP this scenario. Tracked in https://github.com/ember-cli/eslint-plugin-ember/issues/1685
  {
    filename: 'my-component.gjs',
    code: `
      const Foo = <template>hi</template>

      <template>
        <Foo />
      </template>
    `,
  },
   */
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

        if (results && results[0]) {
          message = results[0]?.messages[0]?.message || '';
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

describe('line/col numbers should be correct', () => {
  it('line and col should be correct', async () => {
    const eslint = initESLint();
    const code = `
    import Component from '@glimmer/component';
    import { get } from '@ember/object';
    
    export default class MyComponent extends Component {
      constructor() {
        super(...arguments);
      }

      get truncatedList() {
        return get(
          this.truncatedList,
          this.isImgList ? 'firstObject.attributes.firstObject' : 'firstObject'
        );
      }

      <template>
        <div>this is necessary to break the tests</div>
      </template>
    }
    `;
    const results = await eslint.lintText(code, { filePath: 'my-component.gjs' });

    const resultErrors = results.flatMap((result) => result.messages);
    expect(resultErrors).toHaveLength(2);

    expect(resultErrors[0]).toStrictEqual({
      column: 28,
      endColumn: 64,
      endLine: 13,
      line: 13,
      message: "Don't use Ember's array prototype extensions",
      messageId: 'main',
      nodeType: 'Literal',
      ruleId: 'ember/no-array-prototype-extensions',
      severity: 2,
    });

    expect(resultErrors[1]).toStrictEqual({
      column: 67,
      endColumn: 80,
      endLine: 13,
      line: 13,
      message: "Don't use Ember's array prototype extensions",
      messageId: 'main',
      nodeType: 'Literal',
      ruleId: 'ember/no-array-prototype-extensions',
      severity: 2,
    });
  });
});
