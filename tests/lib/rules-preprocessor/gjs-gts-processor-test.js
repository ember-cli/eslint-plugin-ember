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
 * @param {String} parser The parser to use.
 * @returns {ESLint} ESLint instance to execute in tests.
 */
function initESLint(parser = '@babel/eslint-parser') {
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
      parser,
      parserOptions: {
        ecmaVersion: 2020,
        sourceType: 'module',
      },
      plugins: ['ember'],
      extends: ['plugin:ember/recommended'],
      rules: {
        quotes: ['error', 'single'],
        semi: ['error', 'always'],
        'object-curly-spacing': ['error', 'always'],
        'lines-between-class-members': 'error',
        'no-undef': 'error',
        'no-unused-vars': 'error',
        'ember/no-get': 'off',
        'ember/no-array-prototype-extensions': 'error',
      },
    },
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
      import Component from '@glimmer/component';
      export default class MyComponent extends Component {
        foo() {
          return this.args.bar + this.args.baz;
        }

        <template>Hello World!</template>
      }
    `,
  },
  {
    filename: 'my-component.gts',
    code: `import Component from '@glimmer/component';

    interface ListSignature<T> {
      Args: {
        items: Array<T>;
      };
      Blocks: {
        default: [item: T]
      };
    }

    export default class List<T> extends Component<ListSignature<T>> {
      <template>Hello!</template>
    }`,
    parser: '@typescript-eslint/parser',
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
    code: `import Component from '@glimmer/component';
    export default class MyComponent extends Component {
      <template>Hello!</template>
    }`,
    errors: [
      {
        message: 'Do not create empty backing classes for Glimmer template tag only components.',
        line: 2,
        column: 20,
        endColumn: 6,
      },
    ],
  },

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
        message: "Error in template: 'on' is not defined.",
        line: 4,
        column: 7,
        endColumn: 17,
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
        message: "Error in template: 'noop' is not defined.",
        line: 2,
        column: 7,
        endColumn: 17,
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
        message: "Error in template: 'Foo' is not defined.",
        line: 2,
        column: 7,
        endColumn: 17,
      },
    ],
  },
  {
    filename: 'my-component.gjs',
    code: `
      <template>
        <F_0_O />
      </template>
    `,
    errors: [
      {
        message: "Error in template: 'F_0_O' is not defined.",
        line: 2,
        column: 7,
        endColumn: 17,
      },
    ],
  },
  {
    filename: 'my-component.gjs',
    code: `
      import Component from '@glimmer/component';

      export default class MyComponent extends Component {
        foo = 'bar';
        <template>"hi"</template>
      }
    `,
    errors: [
      {
        message: 'Expected blank line between class members.',
        line: 6,
        endLine: 6,
        column: 9,
        endColumn: 34,
      },
    ],
  },
  {
    filename: 'my-component.gjs',
    code: `
      import Component from '@glimmer/component';

      export default class MyComponent extends Component {
        foo = 'bar';
        <template>"hi"
        </template>
      }
    `,
    errors: [
      {
        message: 'Expected blank line between class members.',
        line: 6,
        endLine: 7,
        column: 9,
        endColumn: 20,
      },
    ],
  },
  {
    filename: 'my-component.gjs',
    code: `
      import Component from "@glimmer/component";
      export default class MyComponent extends Component {
        foo = 'bar';
        <template>"hi"
        </template>
      }
    `,
    errors: [
      {
        message: 'Strings must use singlequote.',
        line: 2,
        endLine: 2,
        endColumn: 49,
        column: 29,
        fix: {
          range: [29, 49],
        },
      },
      {
        message: 'Expected blank line between class members.',
        line: 5,
        endLine: 6,
        column: 9,
        endColumn: 20,
      },
    ],
  },
];

describe('template-vars', () => {
  describe('valid', () => {
    for (const scenario of valid) {
      const { code, filename, parser } = scenario;

      // eslint-disable-next-line jest/valid-title
      it(code, async () => {
        const eslint = initESLint(parser);
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
      const { code, filename, errors, parser } = scenario;

      // eslint-disable-next-line jest/valid-title
      it(code, async () => {
        const eslint = initESLint(parser);
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

describe('lint errors on the exact line as the <template> tag', () => {
  it('correctly outputs the lint error', async () => {
    const eslint = initESLint();
    const code = `
    import Component from '@glimmer/component';

    export default class MyComponent extends Component {
      constructor() {
        super(...arguments);
      }

      foo = 'bar';
      <template>
        <div>
          some totally random, non-meaningful text
        </div>
      </template>
    }
    `;
    const results = await eslint.lintText(code, { filePath: 'my-component.gjs' });

    const resultErrors = results.flatMap((result) => result.messages);
    expect(resultErrors).toHaveLength(1);
    expect(resultErrors[0].message).toBe('Expected blank line between class members.');
  });
});

describe('multiple tokens in same file', () => {
  it('correctly maps duplicate tokens to the correct lines', async () => {
    const eslint = initESLint();
    const code = `
      // comment one
      // comment two
      // comment three
      const two = 2;

      const three = <template> "bar" </template>
    `;
    const results = await eslint.lintText(code, { filePath: 'my-component.gjs' });

    const resultErrors = results.flatMap((result) => result.messages);
    expect(resultErrors).toHaveLength(2);

    expect(resultErrors[0]).toStrictEqual({
      column: 13,
      endColumn: 16,
      endLine: 5,
      line: 5,
      message: "'two' is assigned a value but never used.",
      messageId: 'unusedVar',
      nodeType: 'Identifier',
      ruleId: 'no-unused-vars',
      severity: 2,
    });

    expect(resultErrors[1]).toStrictEqual({
      column: 13,
      endColumn: 18,
      endLine: 7,
      line: 7,
      message: "'three' is assigned a value but never used.",
      messageId: 'unusedVar',
      nodeType: 'Identifier',
      ruleId: 'no-unused-vars',
      severity: 2,
    });
  });

  it('handles duplicate template tokens', async () => {
    const eslint = initESLint();
    const code = `
      // comment Bad

      const tmpl = <template><Bad /></template>
    `;
    const results = await eslint.lintText(code, { filePath: 'my-component.gjs' });

    const resultErrors = results.flatMap((result) => result.messages);
    expect(resultErrors).toHaveLength(2);

    expect(resultErrors[0]).toStrictEqual({
      column: 13,
      endColumn: 17,
      endLine: 4,
      line: 4,
      message: "'tmpl' is assigned a value but never used.",
      messageId: 'unusedVar',
      nodeType: 'Identifier',
      ruleId: 'no-unused-vars',
      severity: 2,
    });

    expect(resultErrors[1]).toStrictEqual({
      column: 20,
      endColumn: 30,
      endLine: 4,
      line: 4,
      message: "Error in template: 'Bad' is not defined.",
      messageId: 'undef',
      nodeType: 'Identifier',
      ruleId: 'no-undef',
      severity: 2,
    });
  });
  it('correctly maps duplicate <template> tokens to the correct lines', async () => {
    const eslint = initESLint();
    const code = `
    import Component from '@glimmer/component';

    export const fakeTemplate = <template>
      <div>"foo!"</div>
    </template>

    export default class MyComponent extends Component {
      constructor() {
        super(...arguments);
      }

      foo = 'bar';
      <template>
        <div>
          some totally random, non-meaningful text
        </div>
      </template>
    }
    `;
    const results = await eslint.lintText(code, { filePath: 'my-component.gjs' });

    const resultErrors = results.flatMap((result) => result.messages);
    expect(resultErrors).toHaveLength(1);
    expect(resultErrors[0].message).toBe('Expected blank line between class members.');
    expect(resultErrors[0].line).toBe(14);
  });
});
