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
      output: null,
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
      output: null,
    },
    '<template><Foo @name="bar" /></template>',
    '<template>@foo</template>',
  ],

  invalid: [
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
      errors: [
        {
          messageId: 'noCapitalArguments',
        },
      ],
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
      errors: [
        {
          messageId: 'noCapitalArguments',
        },
      ],
    },
    {
      code: '<template><Foo @Name="bar" /></template>',
      output: null,
      errors: [{ messageId: 'noCapitalArguments' }],
    },
    {
      code: '<template><Foo @_ame="bar" /></template>',
      output: null,
      errors: [{ messageId: 'noCapitalArguments' }],
    },
    {
      code: '<template>{{@Name}}</template>',
      output: null,
      errors: [{ messageId: 'noCapitalArguments' }],
    },
    {
      code: '<template>{{@_Name}}</template>',
      output: null,
      errors: [{ messageId: 'noCapitalArguments' }],
    },
    {
      code: '<template>{{@Arguments}}</template>',
      output: null,
      errors: [{ messageId: 'noCapitalArguments' }],
    },
    {
      code: '<template>{{@Args}}</template>',
      output: null,
      errors: [{ messageId: 'noCapitalArguments' }],
    },
    {
      code: '<template>{{@Block}}</template>',
      output: null,
      errors: [{ messageId: 'noCapitalArguments' }],
    },
    {
      code: '<template>{{@Else}}</template>',
      output: null,
      errors: [{ messageId: 'noCapitalArguments' }],
    },
    {
      code: '<template><MyComponent @Arguments={{42}} /></template>',
      output: null,
      errors: [{ messageId: 'noCapitalArguments' }],
    },
    {
      code: '<template><MyComponent @Args={{42}} /></template>',
      output: null,
      errors: [{ messageId: 'noCapitalArguments' }],
    },
    {
      code: '<template><MyComponent @Block={{42}} /></template>',
      output: null,
      errors: [{ messageId: 'noCapitalArguments' }],
    },
    {
      code: '<template><MyComponent @Else={{42}} /></template>',
      output: null,
      errors: [{ messageId: 'noCapitalArguments' }],
    },
  ],
});

const hbsRuleTester = new RuleTester({
  parser: require.resolve('ember-eslint-parser/hbs'),
  parserOptions: { ecmaVersion: 2022, sourceType: 'module' },
});

hbsRuleTester.run('template-no-capital-arguments (hbs)', rule, {
  valid: ['<Foo @name="bar" />', '@foo'],
  invalid: [
    {
      code: '<Foo @Name="bar" />',
      output: null,
      errors: [{ messageId: 'noCapitalArguments' }],
    },
    {
      code: '<Foo @_ame="bar" />',
      output: null,
      errors: [{ messageId: 'noCapitalArguments' }],
    },
    {
      code: '{{@Name}}',
      output: null,
      errors: [{ messageId: 'noCapitalArguments' }],
    },
    {
      code: '{{@_Name}}',
      output: null,
      errors: [{ messageId: 'noCapitalArguments' }],
    },
    {
      code: '{{@arguments}}',
      output: null,
      errors: [{ messageId: 'reservedArgument' }],
    },
    {
      code: '{{@args}}',
      output: null,
      errors: [{ messageId: 'reservedArgument' }],
    },
    {
      code: '{{@block}}',
      output: null,
      errors: [{ messageId: 'reservedArgument' }],
    },
    {
      code: '{{@else}}',
      output: null,
      errors: [{ messageId: 'reservedArgument' }],
    },
    {
      code: '<MyComponent @arguments={{42}} />',
      output: null,
      errors: [{ messageId: 'reservedArgument' }],
    },
    {
      code: '<MyComponent @args={{42}} />',
      output: null,
      errors: [{ messageId: 'reservedArgument' }],
    },
    {
      code: '<MyComponent @block={{42}} />',
      output: null,
      errors: [{ messageId: 'reservedArgument' }],
    },
    {
      code: '<MyComponent @else={{42}} />',
      output: null,
      errors: [{ messageId: 'reservedArgument' }],
    },
  ],
});
