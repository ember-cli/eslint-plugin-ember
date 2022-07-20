//------------------------------------------------------------------------------
// Requirements
//------------------------------------------------------------------------------

const rule = require('../../../lib/rules/no-unsafe-this-access-in-async-function');
const RuleTester = require('eslint').RuleTester;

//------------------------------------------------------------------------------
// Tests
//------------------------------------------------------------------------------

const ruleTester = new RuleTester({
  parserOptions: {
    ecmaVersion: 2020,
    sourceType: 'module',
  },
  parser: require.resolve('@babel/eslint-parser'),
});

function eachDefaultExport(builder, rest = {}) {
  const paths = [...rule.FRAMEWORK_EXTENDABLES, ...rule.KNOWN_DESTROYABLES].map(
    (x) => x.importPath
  );
  const results = [];

  for (const importPath of paths) {
    const specifier = 'X';
    const testCase = {
      ...rest,
      code: `import ${specifier} from '${importPath}'\n\n${builder(specifier)}`,
    };

    results.push(testCase);
  }

  return results;
}

ruleTester.run('no-unsafe-this-access-in-async-function', rule, {
  valid: [
    `class {
      async foo() {
        await Promise.resolve();
        this.foo;
      }
    }`,
    eachDefaultExport(
      (parentClass) => `
      class extends ${parentClass} {
        async foo() {
          await Promise.resolve();

          if (this.isDestroying || this.isDestroyed) return;

          this.hello();
        }
      }
    `
    ),
    eachDefaultExport(
      (parentClass) => `
      import { isDestroying, isDestroyed } from '@ember/destroyable';

      class extends ${parentClass} {
        async foo() {
          await Promise.resolve();

          if (isDestroying(this) || isDestroyed(this)) return;

          this.hello();
        }
      }
    `
    ),
    eachDefaultExport(
      (parentClass) => `
      import { isDestroying as A, isDestroyed as B } from '@ember/destroyable';

      class extends ${parentClass} {
        async foo() {
          await Promise.resolve();

          if (B(this) || A(this)) return;

          this.hello();
        }
      }
    `
    ),
  ],
  invalid: [
    {
      code: `
        import Component from '@glimmer/component';

        class extends Component {
          async foo() {
            await Promise.resolve();
            this.foo;
          }
        }
      `,
      output: `
        import Component from '@glimmer/component';

        class extends Component {
          async foo() {
            await Promise.resolve();
            if (this.isDestroyed || this.isDestroying) return;
            this.foo;
          }
        }
      `,
    },
  ],
});
