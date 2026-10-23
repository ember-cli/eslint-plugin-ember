const rule = require('../../../lib/rules/template-tag-spacing');
const RuleTester = require('eslint').RuleTester;

const ruleTester = new RuleTester({
  parser: require.resolve('ember-eslint-parser'),
  parserOptions: {
    ecmaVersion: 2022,
    sourceType: 'module',
  },
});

ruleTester.run('template-tag-spacing', rule, {
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
    {
      filename: 'app/components/template-only.gjs',
      code: `import { tracked } from '@glimmer/tracking';

<template>
  <div>Hello</div>
</template>`,
    },
    {
      filename: 'app/components/template-only.gjs',
      code: `<template>
  <div>Hello</div>
</template>

const state = { ready: true };`,
    },
    {
      filename: 'app/components/template-only.gts',
      code: `type State = {
  count: number;
};

<template>
  <div>Hello</div>
</template>

const state: State = {
  count: 0,
};`,
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
    },
  ],
  invalid: [
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
  greeting = 'hello';

  <template>
    <div>{{this.greeting}}</div>
  </template>
}`,
      errors: [{ messageId: 'missingBlankLine' }],
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
      output: `import Component from '@glimmer/component';

export default class ExampleComponent extends Component {
  <template>
    <div>{{this.greeting}}</div>
  </template>

  greeting = 'hello';
}`,
      errors: [{ messageId: 'missingBlankLine' }],
    },
    {
      filename: 'app/components/template-only.gjs',
      code: `import { tracked } from '@glimmer/tracking';
<template>
  <div>Hello</div>
</template>`,
      output: `import { tracked } from '@glimmer/tracking';

<template>
  <div>Hello</div>
</template>`,
      errors: [{ messageId: 'missingBlankLine' }],
    },
    {
      filename: 'app/components/template-only.gts',
      code: `<template>
  <div>Hello</div>
</template>
const count: number = 1;`,
      output: `<template>
  <div>Hello</div>
</template>

const count: number = 1;`,
      errors: [{ messageId: 'missingBlankLine' }],
    },
    {
      filename: 'app/components/template-only.gjs',
      code: `import Service from '@ember/service';
<template>
  <div>Hello</div>
</template>
const ready = true;`,
      output: `import Service from '@ember/service';

<template>
  <div>Hello</div>
</template>

const ready = true;`,
      errors: [{ messageId: 'missingBlankLine' }, { messageId: 'missingBlankLine' }],
    },
  ],
});
