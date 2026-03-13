const { RuleTester } = require('eslint');
const rule = require('../../../lib/rules/template-no-capital-arguments');

const ruleTester = new RuleTester({
  parser: require.resolve('ember-eslint-parser'),
  parserOptions: { ecmaVersion: 2022, sourceType: 'module' },
});

ruleTester.run('template-no-capital-arguments', rule, {
  valid: [
    {
      filename: 'my-component.gjs',
      code: `
        import Component from '@glimmer/component';
        export default class MyComponent extends Component {
          <template>
            <div>{{@arg}}</div>
          </template>
        }
      `,
    },
    {
      filename: 'my-component.gjs',
      code: `
        import Component from '@glimmer/component';
        export default class MyComponent extends Component {
          <template>
            <div>{{@myArgument}}</div>
          </template>
        }
      `,
    },
    // @name in attribute position (lowercase) is valid
    {
      filename: 'my-component.gjs',
      code: `
        import Component from '@glimmer/component';
        export default class MyComponent extends Component {
          <template>
            <Foo @name="bar" />
          </template>
        }
      `,
    },
    // Nested lowercase path is valid
    {
      filename: 'my-component.gjs',
      code: `
        import Component from '@glimmer/component';
        export default class MyComponent extends Component {
          <template>
            <div>{{@arg.nested}}</div>
          </template>
        }
      `,
    },
  ],

  invalid: [
    // Capital path expression
    {
      filename: 'my-component.gjs',
      code: `
        import Component from '@glimmer/component';
        export default class MyComponent extends Component {
          <template>
            <div>{{@Arg}}</div>
          </template>
        }
      `,
      output: null,
      errors: [{ messageId: 'noCapitalArguments' }],
    },
    {
      filename: 'my-component.gjs',
      code: `
        import Component from '@glimmer/component';
        export default class MyComponent extends Component {
          <template>
            <div>{{@MyArgument}}</div>
          </template>
        }
      `,
      output: null,
      errors: [{ messageId: 'noCapitalArguments' }],
    },
    // Capital attr node
    {
      filename: 'my-component.gjs',
      code: `
        import Component from '@glimmer/component';
        export default class MyComponent extends Component {
          <template>
            <Foo @Name="bar" />
          </template>
        }
      `,
      output: null,
      errors: [{ messageId: 'noCapitalArguments' }],
    },
    // Nested capital path
    {
      filename: 'my-component.gjs',
      code: `
        import Component from '@glimmer/component';
        export default class MyComponent extends Component {
          <template>
            <div>{{@Arg.nested}}</div>
          </template>
        }
      `,
      output: null,
      errors: [{ messageId: 'noCapitalArguments' }],
    },
    // Underscore prefix
    {
      filename: 'my-component.gjs',
      code: `
        import Component from '@glimmer/component';
        export default class MyComponent extends Component {
          <template>
            <div>{{@_Name}}</div>
          </template>
        }
      `,
      output: null,
      errors: [{ messageId: 'noCapitalArguments' }],
    },
    {
      filename: 'my-component.gjs',
      code: `
        import Component from '@glimmer/component';
        export default class MyComponent extends Component {
          <template>
            <Foo @_ame="bar" />
          </template>
        }
      `,
      output: null,
      errors: [{ messageId: 'noCapitalArguments' }],
    },
    // Reserved arguments in path expression
    {
      filename: 'my-component.gjs',
      code: `
        import Component from '@glimmer/component';
        export default class MyComponent extends Component {
          <template>
            <div>{{@arguments}}</div>
          </template>
        }
      `,
      output: null,
      errors: [{ messageId: 'reservedArgument' }],
    },
    {
      filename: 'my-component.gjs',
      code: `
        import Component from '@glimmer/component';
        export default class MyComponent extends Component {
          <template>
            <div>{{@args}}</div>
          </template>
        }
      `,
      output: null,
      errors: [{ messageId: 'reservedArgument' }],
    },
    // Reserved arguments in attr position
    {
      filename: 'my-component.gjs',
      code: `
        import Component from '@glimmer/component';
        export default class MyComponent extends Component {
          <template>
            <Foo @arguments={{42}} />
          </template>
        }
      `,
      output: null,
      errors: [{ messageId: 'reservedArgument' }],
    },
    {
      filename: 'my-component.gjs',
      code: `
        import Component from '@glimmer/component';
        export default class MyComponent extends Component {
          <template>
            <Foo @block={{42}} />
          </template>
        }
      `,
      output: null,
      errors: [{ messageId: 'reservedArgument' }],
    },
  ],
});
