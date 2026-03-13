const rule = require('../../../lib/rules/template-no-builtin-form-components');
const RuleTester = require('eslint').RuleTester;

const ruleTester = new RuleTester({
  parser: require.resolve('ember-eslint-parser'),
  parserOptions: { ecmaVersion: 2022, sourceType: 'module' },
});

ruleTester.run('template-no-builtin-form-components', rule, {
  valid: [
    // Native HTML elements are always fine
    { filename: 'test.gjs', code: '<template><input type="text" /></template>' },
    { filename: 'test.gjs', code: '<template><input type="checkbox" /></template>' },
    { filename: 'test.gjs', code: '<template><input type="radio" /></template>' },
    { filename: 'test.gjs', code: '<template><textarea></textarea></template>' },
    { filename: 'test.gjs', code: '<template><div></div></template>' },

    // In GJS without an import from @ember/component, <Input>/<Textarea> are not the builtins
    { filename: 'test.gjs', code: '<template><Input /></template>' },
    { filename: 'test.gjs', code: '<template><Textarea></Textarea></template>' },

    // Importing from a different source is fine
    {
      filename: 'test.gjs',
      code: "import { Input } from './my-components'; <template><Input /></template>",
    },
    {
      filename: 'test.gjs',
      code: "import { Textarea } from './my-components'; <template><Textarea></Textarea></template>",
    },
  ],
  invalid: [
    {
      filename: 'test.gjs',
      code: "import { Input } from '@ember/component'; <template><Input /></template>",
      output: null,
      errors: [{ messageId: 'noInput' }],
    },
    {
      filename: 'test.gjs',
      code: 'import { Input } from \'@ember/component\'; <template><Input type="text" /></template>',
      output: null,
      errors: [{ messageId: 'noInput' }],
    },
    {
      // Aliased import must still be flagged
      filename: 'test.gjs',
      code: "import { Input as EmberInput } from '@ember/component'; <template><EmberInput /></template>",
      output: null,
      errors: [{ messageId: 'noInput' }],
    },
    {
      filename: 'test.gjs',
      code: "import { Textarea } from '@ember/component'; <template><Textarea></Textarea></template>",
      output: null,
      errors: [{ messageId: 'noTextarea' }],
    },
    {
      filename: 'test.gjs',
      code: "import { Textarea } from '@ember/component'; <template><Textarea @value={{this.body}}></Textarea></template>",
      output: null,
      errors: [{ messageId: 'noTextarea' }],
    },
    {
      // Aliased Textarea import must still be flagged
      filename: 'test.gjs',
      code: "import { Textarea as EmberTextarea } from '@ember/component'; <template><EmberTextarea></EmberTextarea></template>",
      output: null,
      errors: [{ messageId: 'noTextarea' }],
    },
    // Yielded as a value
    {
      filename: 'test.gjs',
      code: "import { Input } from '@ember/component'; <template>{{yield Input}}</template>",
      output: null,
      errors: [{ messageId: 'noInput' }],
    },
    {
      filename: 'test.gjs',
      code: "import { Input as EmberInput } from '@ember/component'; <template>{{yield EmberInput}}</template>",
      output: null,
      errors: [{ messageId: 'noInput' }],
    },
    {
      filename: 'test.gjs',
      code: "import { Textarea } from '@ember/component'; <template>{{yield Textarea}}</template>",
      output: null,
      errors: [{ messageId: 'noTextarea' }],
    },
    // Used in helpers / passed as argument
    {
      filename: 'test.gjs',
      code: "import { Input } from '@ember/component'; <template><MyForm @field={{Input}} /></template>",
      output: null,
      errors: [{ messageId: 'noInput' }],
    },
    {
      filename: 'test.gjs',
      code: "import { Input } from '@ember/component'; <template>{{component Input}}</template>",
      output: null,
      errors: [{ messageId: 'noInput' }],
    },
  ],
});

const hbsRuleTester = new RuleTester({
  parser: require.resolve('ember-eslint-parser/hbs'),
  parserOptions: {
    ecmaVersion: 2022,
    sourceType: 'module',
  },
});

hbsRuleTester.run('template-no-builtin-form-components (hbs)', rule, {
  valid: [
    '<input type="text" />',
    '<input type="checkbox" />',
    '<input type="radio" />',
    '<textarea></textarea>',
  ],
  invalid: [
    {
      code: '<Input />',
      output: null,
      errors: [{ messageId: 'noInput' }],
    },
    {
      code: '<Input type="text" />',
      output: null,
      errors: [{ messageId: 'noInput' }],
    },
    {
      code: '<Textarea></Textarea>',
      output: null,
      errors: [{ messageId: 'noTextarea' }],
    },
    {
      code: '<Textarea @value={{this.body}}></Textarea>',
      output: null,
      errors: [{ messageId: 'noTextarea' }],
    },
    // Yielded as a value
    {
      code: '{{yield Input}}',
      output: null,
      errors: [{ messageId: 'noInput' }],
    },
    {
      code: '{{yield Textarea}}',
      output: null,
      errors: [{ messageId: 'noTextarea' }],
    },
    // Used in helpers / passed as argument
    {
      code: '<MyForm @field={{Input}} />',
      output: null,
      errors: [{ messageId: 'noInput' }],
    },
    {
      code: '{{component Input}}',
      output: null,
      errors: [{ messageId: 'noInput' }],
    },
  ],
});
