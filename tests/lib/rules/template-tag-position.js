const rule = require('../../../lib/rules/template-tag-position');
const RuleTester = require('eslint').RuleTester;

const ruleTester = new RuleTester({
  parser: require.resolve('ember-eslint-parser'),
  parserOptions: {
    ecmaVersion: 2022,
    sourceType: 'module',
  },
});

ruleTester.run('template-tag-position', rule, {
  valid: [
    {
      filename: 'app/components/example.gjs',
      code: `import Component from '@glimmer/component';

export default class ExampleComponent extends Component {
  greeting = 'hello';

  <template>
    <div>{{this.greeting}}</div>
  </template>
}`,
    },
    {
      filename: 'app/components/example.gjs',
      code: `import Component from '@glimmer/component';

export default class ExampleComponent extends Component {
  <template>
    <div>{{this.greeting}}</div>
  </template>

  greeting = 'hello';
}`,
      options: ['before'],
    },
    {
      filename: 'app/components/example.gjs',
      code: `import Component from '@glimmer/component';

export default class ExampleComponent extends Component {
  <template>
    <div>Hello</div>
  </template>
}`,
    },
    {
      filename: 'app/components/example.gjs',
      code: `class ExampleComponent {
  value = 1;
}`,
    },
  ],
  invalid: [
    {
      filename: 'app/components/example.gjs',
      code: `import Component from '@glimmer/component';

export default class ExampleComponent extends Component {
  <template>
    <div>{{this.greeting}}</div>
  </template>
  greeting = 'hello';
}`,
      output: `import Component from '@glimmer/component';

export default class ExampleComponent extends Component {
  greeting = 'hello';

  <template>
    <div>{{this.greeting}}</div>
  </template>
}`,
      errors: [{ messageId: 'wrongPosition' }],
    },
    {
      filename: 'app/components/example.gjs',
      code: `import Component from '@glimmer/component';

export default class ExampleComponent extends Component {
  first = 'first';
  <template>
    <div>{{this.first}}</div>
  </template>
  second = 'second';
}`,
      output: `import Component from '@glimmer/component';

export default class ExampleComponent extends Component {
  first = 'first';

  second = 'second';

  <template>
    <div>{{this.first}}</div>
  </template>
}`,
      errors: [{ messageId: 'wrongPosition' }],
    },
    {
      filename: 'app/components/example.gjs',
      code: `import Component from '@glimmer/component';

export default class ExampleComponent extends Component {
  greeting = 'hello';
  <template>
    <div>{{this.greeting}}</div>
  </template>
}`,
      output: `import Component from '@glimmer/component';

export default class ExampleComponent extends Component {
  <template>
    <div>{{this.greeting}}</div>
  </template>

  greeting = 'hello';
}`,
      options: ['before'],
      errors: [{ messageId: 'wrongPosition' }],
    },
  ],
});


