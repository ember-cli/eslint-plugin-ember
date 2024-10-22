'use strict';

/**
 * Because this test needs the preprocessor, we can't use the normal
 * RuleTester api doesn't support preprocessors.
 *
 * @typedef {import('eslint/lib/cli-engine/cli-engine').CLIEngineOptions} CLIEngineOptions
 */

const { ESLint } = require('eslint');
const plugin = require('../../../lib');
const { writeFileSync, readFileSync } = require('node:fs');
const { join } = require('node:path');

const gjsGtsParser = require.resolve('ember-eslint-parser');

/**
 * Helper function which creates ESLint instance with enabled/disabled autofix feature.
 *
 * @param {String} parser The parser to use.
 * @returns {ESLint} ESLint instance to execute in tests.
 */
function initESLint(parser = gjsGtsParser) {
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
      parserOptions: {
        ecmaVersion: 2022,
        sourceType: 'module',
      },
      parser,
      plugins: ['ember'],
      extends: ['plugin:ember/recommended'],
      overrides: [
        {
          files: ['**/*.gts'],
          parserOptions: {
            project: './tsconfig.eslint.json',
            tsconfigRootDir: __dirname,
            extraFileExtensions: ['.gts'],
          },
          extends: [
            'plugin:@typescript-eslint/recommended-requiring-type-checking',
            'plugin:ember/recommended',
          ],
          rules: {
            'no-trailing-spaces': 'error',
          },
        },
      ],
      rules: {
        quotes: ['error', 'single'],
        semi: ['error', 'always'],
        'object-curly-spacing': ['error', 'always'],
        'lines-between-class-members': 'error',
        'no-undef': 'error',
        'no-unused-vars': 'error',
        'ember/no-get': 'off',
        'ember/no-array-prototype-extensions': 'error',
        'ember/no-unused-services': 'error',
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
      <template>
        <div>Hello!</div>
      </template>
    }`,
    parser: gjsGtsParser,
  },
  {
    filename: 'my-component.gjs',
    code: `
      import Component from '@glimmer/component';
      import { inject as service } from '@ember/service';

      export default class MyComponent extends Component {
        @service foo;

        <template>
          {{this.foo}}
          <div></div>
          foobar
        </template>
      }
    `,
  },
  {
    filename: 'my-component.gjs',
    code: `
      const Foo = <template>hi</template>;

      <template>
        <Foo />
      </template>
    `,
  },
];

const invalid = [
  {
    parser: '@typescript-eslint/parser',
    filename: 'my-component.gjs',
    code: `import Component from '@glimmer/component';
    export default class MyComponent extends Component {
      <template>Hello!</template>
    }`,
    errors: [
      {
        message:
          'Parsing error: Unexpected token. A constructor, method, accessor, or property was expected.\n' +
          'To lint Gjs/Gts files please follow the setup guide at https://github.com/ember-cli/eslint-plugin-ember#gtsgjs\n' +
          'Note that this error can also happen if you have multiple versions of eslint-plugin-ember in your node_modules',
        line: 3,
        column: 6,
      },
    ],
  },
  {
    filename: 'my-component.gjs',
    code: `import Component from '@glimmer/component';
    export default classsss MyComponent extends Component {
      <template>Hello!</template>
    }`,
    errors: [
      {
        message: 'Parsing error: Parse Error at <anon>:2:29: 2:40',
      },
    ],
  },
  {
    filename: 'my-component.gjs',
    code: `
      import { on } from '@ember/modifier';

      const noop = () => {};

      <template>
        <div {{on 'click' noop}} />
      </template>

      <template>
        <div {{on 'click' noop}} />
      </template>
    `,
    errors: [
      {
        message: 'Missing semicolon.',
      },
    ],
  },
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
        message: "'on' is not defined.",
        line: 5,
        column: 11,
        endColumn: 13,
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
        endColumn: 15,
      },
    ],
  },
  {
    filename: 'my-component.gjs',
    code: `
      <template>
      {{#let 'x' as |noop usedEl notUsed|}}
        {{noop}}
        <usedEl />
        <undef.x />
        <non-std-html-tag />
      {{/let}}
      </template>
    `,
    errors: [
      {
        column: 34,
        endColumn: 41,
        endLine: 3,
        line: 3,
        message: "'notUsed' is defined but never used.",
        messageId: 'unusedVar',
        nodeType: 'BlockParam',
        ruleId: 'no-unused-vars',
        severity: 2,
      },
      {
        column: 10,
        endColumn: 15,
        endLine: 6,
        line: 6,
        message: "'undef' is not defined.",
        messageId: 'undef',
        nodeType: 'GlimmerElementNodePart',
        ruleId: 'no-undef',
        severity: 2,
      },
      {
        column: 10,
        endColumn: 26,
        endLine: 7,
        line: 7,
        message: "'non-std-html-tag' is not defined.",
        messageId: 'undef',
        nodeType: 'GlimmerElementNodePart',
        ruleId: 'no-undef',
        severity: 2,
      },
    ],
  },
  {
    filename: 'my-component.gjs',
    code: `
      <template>
        <Foo />
        <Bar>
          <div></div>
        </Bar>
      </template>
    `,
    errors: [
      {
        message: "'Foo' is not defined.",
        line: 3,
        endLine: 3,
        column: 10,
        endColumn: 13,
      },
      {
        message: "'Bar' is not defined.",
        line: 4,
        endLine: 4,
        column: 10,
        endColumn: 13,
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
        message: "'F_0_O' is not defined.",
        line: 3,
        column: 10,
        endColumn: 15,
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
    filename: 'my-component.gts',
    parser: gjsGtsParser,
    code: `
      import Component from '@glimmer/component';

      const foo: any = '';

      export default class MyComponent extends Component {
        foo = 'bar';

        <template>
          <div></div>${'  '}
          {{foo}}
        </template>
      }`,
    errors: [
      {
        message: 'Unexpected any. Specify a different type.',
        line: 4,
        endLine: 4,
        column: 18,
        endColumn: 21,
      },
      {
        message: 'Trailing spaces not allowed.',
        line: 10,
        endLine: 10,
        column: 22,
        endColumn: 24,
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
  {
    filename: 'my-component.gjs',
    code: `
      import Component from '@glimmer/component';
      import { inject as service } from '@ember/service';

      export default class MyComponent extends Component {
        @service foo;

        @service bar;

        <template>
          {{this.foo.bar}}
          {{this.bartender}}
          <div>this.bar</div>
          this.bar.foo
          something.bar
        </template>
      }
    `,
    errors: [
      {
        message:
          'The service `bar` is not referenced in this file and might be unused (note: it could still be used in a corresponding handlebars template file, mixin, or parent/child class).',
        line: 8,
        endLine: 8,
        endColumn: 22,
        column: 9,
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
        const results = await eslint.lintText(code, {
          filePath: `./tests/lib/rules-preprocessor/${filename}`,
        });
        const resultErrors = results.flatMap((result) => result.messages);

        // This gives more meaningful information than
        // checking if results is empty / length === 0
        expect(results[0]?.messages).toHaveLength(0);
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
        const results = await eslint.lintText(code, {
          filePath: `./tests/lib/rules-preprocessor/${filename}`,
        });

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

describe('supports eslint directives inside templates', () => {
  it('works with mustache comment', async () => {
    const eslint = initESLint();
    const code = `
    // test comment
    <template>
      <div>
        {{!eslint-disable-next-line}}
        {{test}}
      </div>
      <div>
        {{!--eslint-disable--}}
        {{test}}
        {{test}}
        {{test}}
        {{!--eslint-enable--}}
      </div>
    </template>
    `;
    const results = await eslint.lintText(code, { filePath: 'my-component.gjs' });

    const resultErrors = results.flatMap((result) => result.messages);
    expect(resultErrors).toHaveLength(0);
  });
  it('works with html comment', async () => {
    const eslint = initESLint();
    const code = `
    <template>
      <div>
        <!--eslint-disable-next-line-->
        {{test}}
      </div>
      <div>
        <!-- eslint-disable -->
        {{test}}
        {{test}}
        {{test}}
        <!-- eslint-enable -->
      </div>
    </template>
    `;
    const results = await eslint.lintText(code, { filePath: 'my-component.gjs' });

    const resultErrors = results.flatMap((result) => result.messages);
    expect(resultErrors).toHaveLength(0);
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

      const three = <template> "bar" </template>;
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

      const tmpl = <template><Bad /></template>;
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
      column: 31,
      endColumn: 34,
      endLine: 4,
      line: 4,
      message: "'Bad' is not defined.",
      messageId: 'undef',
      nodeType: 'GlimmerElementNodePart',
      ruleId: 'no-undef',
      severity: 2,
    });
  });

  it('correctly maps tokens after handlebars', async () => {
    const eslint = initESLint();
    const code = `
    import Component from '@glimmer/component';

    export const fakeTemplate = <template>
      <div>{{foo}}</div>
    </template>;

    export default class MyComponent extends Component {
      constructor() {
        super(...arguments);
      }

      foo = bar;

      <template>
        <div>
          some totally random, non-meaningful text {{bar}}
        </div>
      </template>
    }
    `;
    const results = await eslint.lintText(code, { filePath: 'my-component.gjs' });

    const resultErrors = results.flatMap((result) => result.messages);
    expect(resultErrors).toHaveLength(3);
    expect(resultErrors[0].message).toBe("'foo' is not defined.");
    expect(resultErrors[0].line).toBe(5);

    expect(resultErrors[1].message).toBe("'bar' is not defined.");
    expect(resultErrors[1].endLine).toBe(13);
    expect(resultErrors[1].line).toBe(13);

    expect(resultErrors[2].message).toBe("'bar' is not defined.");
    expect(resultErrors[2].line).toBe(17);
  });

  it('lints while being type aware', async () => {
    const eslint = new ESLint({
      ignore: false,
      useEslintrc: false,
      plugins: { ember: plugin },
      overrideConfig: {
        root: true,
        env: {
          browser: true,
        },
        plugins: ['ember'],
        extends: ['plugin:ember/recommended'],
        overrides: [
          {
            files: ['**/*.gts'],
            parser: 'ember-eslint-parser',
            parserOptions: {
              project: './tsconfig.eslint.json',
              tsconfigRootDir: __dirname,
              extraFileExtensions: ['.gts'],
            },
            extends: [
              'plugin:@typescript-eslint/recommended-requiring-type-checking',
              'plugin:ember/recommended',
            ],
            rules: {
              'no-trailing-spaces': 'error',
              '@typescript-eslint/prefer-string-starts-ends-with': 'error',
            },
          },
          {
            files: ['**/*.ts'],
            parser: '@typescript-eslint/parser',
            parserOptions: {
              project: './tsconfig.eslint.json',
              tsconfigRootDir: __dirname,
              extraFileExtensions: ['.gts'],
            },
            extends: [
              'plugin:@typescript-eslint/recommended-requiring-type-checking',
              'plugin:ember/recommended',
            ],
            rules: {
              'no-trailing-spaces': 'error',
            },
          },
        ],
        rules: {
          quotes: ['error', 'single'],
          semi: ['error', 'always'],
          'object-curly-spacing': ['error', 'always'],
          'lines-between-class-members': 'error',
          'no-undef': 'error',
          'no-unused-vars': 'error',
          'ember/no-get': 'off',
          'ember/no-array-prototype-extensions': 'error',
          'ember/no-unused-services': 'error',
        },
      },
    });

    let results = await eslint.lintFiles(['**/*.gts', '**/*.ts']);

    let resultErrors = results.flatMap((result) => result.messages);
    expect(resultErrors).toHaveLength(3);

    expect(resultErrors[0].message).toBe("Use 'String#startsWith' method instead.");
    expect(resultErrors[0].line).toBe(6);

    expect(resultErrors[1].line).toBe(7);
    expect(resultErrors[1].message).toBe("Use 'String#startsWith' method instead.");

    expect(resultErrors[2].line).toBe(8);
    expect(resultErrors[2].message).toBe("Use 'String#startsWith' method instead.");

    const filePath = join(__dirname, 'ember_ts', 'bar.gts');
    const content = readFileSync(filePath).toString();
    try {
      writeFileSync(filePath, content.replace("'42'", '42'));

      results = await eslint.lintFiles(['**/*.gts', '**/*.ts']);

      resultErrors = results.flatMap((result) => result.messages);
      expect(resultErrors).toHaveLength(2);

      expect(resultErrors[0].message).toBe("Use 'String#startsWith' method instead.");
      expect(resultErrors[0].line).toBe(6);

      expect(resultErrors[1].line).toBe(8);
      expect(resultErrors[1].message).toBe("Use 'String#startsWith' method instead.");
    } finally {
      writeFileSync(filePath, content);
    }

    results = await eslint.lintFiles(['**/*.gts', '**/*.ts']);

    resultErrors = results.flatMap((result) => result.messages);
    expect(resultErrors).toHaveLength(3);

    expect(resultErrors[0].message).toBe("Use 'String#startsWith' method instead.");
    expect(resultErrors[0].line).toBe(6);

    expect(resultErrors[1].message).toBe("Use 'String#startsWith' method instead.");
    expect(resultErrors[1].line).toBe(7);

    expect(resultErrors[2].line).toBe(8);
    expect(resultErrors[2].message).toBe("Use 'String#startsWith' method instead.");
  });
});
