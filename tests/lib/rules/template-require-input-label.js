const eslint = require('eslint');
const rule = require('../../../lib/rules/template-require-input-label');

const { RuleTester } = eslint;

const ruleTester = new RuleTester({
  parser: require.resolve('ember-eslint-parser'),
  parserOptions: { ecmaVersion: 2022, sourceType: 'module' },
});

ruleTester.run('template-require-input-label', rule, {
  valid: [
    // Input with id (can be associated with label)
    '<template><input id="name" type="text" /></template>',

    // Input with aria-label
    '<template><input aria-label="Name" type="text" /></template>',

    // Input with aria-labelledby
    '<template><input aria-labelledby="label-id" type="text" /></template>',

    // Hidden input doesn't need label
    '<template><input type="hidden" /></template>',

    // Textarea with id
    '<template><textarea id="comment"></textarea></template>',

    // Select with id
    '<template><select id="country"><option>US</option></select></template>',
  ],
  invalid: [
    {
      code: '<template><input type="text" /></template>',
      output: null,
      errors: [{ messageId: 'requireLabel' }],
    },
    {
      code: '<template><textarea></textarea></template>',
      output: null,
      errors: [{ messageId: 'requireLabel' }],
    },
    {
      code: '<template><select><option>Value</option></select></template>',
      output: null,
      errors: [{ messageId: 'requireLabel' }],
    },
  
    // Test cases ported from ember-template-lint
    {
      code: '<template><div><input /></div></template>',
      output: null,
      errors: [{ messageId: 'requireLabel' }],
    },
    {
      code: '<template><input /></template>',
      output: null,
      errors: [{ messageId: 'requireLabel' }],
    },
    {
      code: '<template><input title="some title value" /></template>',
      output: null,
      errors: [{ messageId: 'requireLabel' }],
    },
    {
      code: '<template><label><input></label></template>',
      output: null,
      errors: [{ messageId: 'requireLabel' }],
    },
    {
      code: '<template><div>{{input}}</div></template>',
      output: null,
      errors: [{ messageId: 'requireLabel' }],
    },
    {
      code: '<template><Input/></template>',
      output: null,
      errors: [{ messageId: 'requireLabel' }],
    },
    {
      code: '<template><input aria-label="first label" aria-labelledby="second label"></template>',
      output: null,
      errors: [{ messageId: 'requireLabel' }],
    },
    {
      code: '<template><input id="label-input" aria-label="second label"></template>',
      output: null,
      errors: [{ messageId: 'requireLabel' }],
    },
    {
      code: '<template><label>Input label<input aria-label="Custom label"></label></template>',
      output: null,
      errors: [{ messageId: 'requireLabel' }],
    },
    {
      code: '<template>{{input type="button"}}</template>',
      output: null,
      errors: [{ messageId: 'requireLabel' }],
    },
    {
      code: '<template>{{input type=myType}}</template>',
      output: null,
      errors: [{ messageId: 'requireLabel' }],
    },
    {
      code: '<template><input type="button"/></template>',
      output: null,
      errors: [{ messageId: 'requireLabel' }],
    },
    {
      code: '<template><input type={{myType}}/></template>',
      output: null,
      errors: [{ messageId: 'requireLabel' }],
    },
    {
      code: '<template><Input type="button"/></template>',
      output: null,
      errors: [{ messageId: 'requireLabel' }],
    },
    {
      code: '<template><Input type={{myType}}/></template>',
      output: null,
      errors: [{ messageId: 'requireLabel' }],
    },
    {
      code: '<template><div><textarea /></div></template>',
      output: null,
      errors: [{ messageId: 'requireLabel' }],
    },
    {
      code: '<template><textarea /></template>',
      output: null,
      errors: [{ messageId: 'requireLabel' }],
    },
    {
      code: '<template><textarea title="some title value" /></template>',
      output: null,
      errors: [{ messageId: 'requireLabel' }],
    },
    {
      code: '<template><label><textarea /></label></template>',
      output: null,
      errors: [{ messageId: 'requireLabel' }],
    },
    {
      code: '<template><div>{{textarea}}</div></template>',
      output: null,
      errors: [{ messageId: 'requireLabel' }],
    },
    {
      code: '<template><Textarea /></template>',
      output: null,
      errors: [{ messageId: 'requireLabel' }],
    },
    {
      code: '<template><textarea aria-label="first label" aria-labelledby="second label" /></template>',
      output: null,
      errors: [{ messageId: 'requireLabel' }],
    },
    {
      code: '<template><textarea id="label-input" aria-label="second label" /></template>',
      output: null,
      errors: [{ messageId: 'requireLabel' }],
    },
    {
      code: '<template><label>Textarea label<textarea aria-label="Custom label" /></label></template>',
      output: null,
      errors: [{ messageId: 'requireLabel' }],
    },
    {
      code: '<template><div><select></select></div></template>',
      output: null,
      errors: [{ messageId: 'requireLabel' }],
    },
    {
      code: '<template><select></select></template>',
      output: null,
      errors: [{ messageId: 'requireLabel' }],
    },
    {
      code: '<template><select title="some title value" /></template>',
      output: null,
      errors: [{ messageId: 'requireLabel' }],
    },
    {
      code: '<template><label><select></select></label></template>',
      output: null,
      errors: [{ messageId: 'requireLabel' }],
    },
    {
      code: '<template><select aria-label="first label" aria-labelledby="second label" /></template>',
      output: null,
      errors: [{ messageId: 'requireLabel' }],
    },
    {
      code: '<template><select id="label-input" aria-label="second label" /></template>',
      output: null,
      errors: [{ messageId: 'requireLabel' }],
    },
    {
      code: '<template><label>Select label<select aria-label="Custom label" /></label></template>',
      output: null,
      errors: [{ messageId: 'requireLabel' }],
    },
  ],
});
