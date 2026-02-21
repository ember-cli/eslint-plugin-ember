//------------------------------------------------------------------------------
// Requirements
//------------------------------------------------------------------------------

const rule = require('../../../lib/rules/template-no-trailing-spaces');
const RuleTester = require('eslint').RuleTester;

//------------------------------------------------------------------------------
// Tests
//------------------------------------------------------------------------------

const ruleTester = new RuleTester({
  parser: require.resolve('ember-eslint-parser'),
  parserOptions: { ecmaVersion: 2022, sourceType: 'module' },
});

ruleTester.run('template-no-trailing-spaces', rule, {
  valid: [
    `<template>
      <div>Hello World</div>
    </template>`,
    `<template>
      <div>
        Content
      </div>
    </template>`,
  
    // Test cases ported from ember-template-lint
    '<template>test</template>',
    '<template>   test</template>',
    `<template>test
</template>`,
    `<template>test
</template>`,
    `<template>{{#my-component}}
{{/my-component}}</template>`,
    `<template>  test
</template>`,
  ],

  invalid: [
    {
      code: `<template> 
      <div>Hello</div>
    </template>`,
      output: `<template>
      <div>Hello</div>
    </template>`,
      errors: [
        {
          message: 'Trailing whitespace detected.',
        },
      ],
    },
    {
      code: `<template>
      <div>Hello</div>  
    </template>`,
      output: `<template>
      <div>Hello</div>
    </template>`,
      errors: [
        {
          message: 'Trailing whitespace detected.',
        },
      ],
    },
  
    // Test cases ported from ember-template-lint
    {
      code: '<template>test </template>',
      output: null,
      errors: [{ message: 'Trailing whitespace detected.' }],
    },
    {
      code: `<template>test 
</template>`,
      output: null,
      errors: [{ message: 'Trailing whitespace detected.' }],
    },
    {
      code: `<template>test
</template>`,
      output: null,
      errors: [{ message: 'Trailing whitespace detected.' }],
    },
    {
      code: `<template>{{#my-component}}
{{/my-component}}</template>`,
      output: null,
      errors: [{ message: 'Trailing whitespace detected.' }],
    },
    {
      code: `<template>import { hbs } from 'ember-cli-htmlbars';

test('it renders', async (assert) => {
  await render(hbs\`  
    <div class="parent">
      <div class="child"></div>
    </div>
  \`);
});</template>`,
      output: null,
      errors: [{ message: 'Trailing whitespace detected.' }],
    },
    {
      code: `<template>import { hbs } from 'ember-cli-htmlbars';

test('it renders', async (assert) => {
  await render(hbs\`
    <div></div>
  
    <div></div>
  \`);
});</template>`,
      output: null,
      errors: [{ message: 'Trailing whitespace detected.' }],
    },
  ],
});
