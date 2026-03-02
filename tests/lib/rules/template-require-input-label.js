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

    // Dynamic aria-label
    '<template><input aria-label={{labelText}} /></template>',

    // Component-form inputs (capital I/T)
    '<template><Input id="foo" /></template>',
    '<template><Textarea id="foo" /></template>',

    // Curly component syntax
    '<template>{{input id="foo"}}</template>',
    '<template>{{textarea id="foo"}}</template>',

    // Hidden skip in other forms
    '<template><Input type="hidden" /></template>',
    '<template>{{input type="hidden"}}</template>',

    // Textarea with aria-labelledby and aria-label
    '<template><textarea aria-labelledby="someIdValue"></textarea></template>',
    '<template><textarea aria-label={{labelText}}></textarea></template>',

    // Select with aria-labelledby and aria-label
    '<template><select aria-labelledby="someIdValue"></select></template>',
    '<template><select aria-label={{labelText}}></select></template>',
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
      errors: [{ messageId: 'multipleLabels' }],
    },
    {
      code: '<template><input id="label-input" aria-label="second label"></template>',
      output: null,
      errors: [{ messageId: 'multipleLabels' }],
    },
    {
      code: '<template><label>Input label<input aria-label="Custom label"></label></template>',
      output: null,
      errors: [{ messageId: 'multipleLabels' }],
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
      errors: [{ messageId: 'multipleLabels' }],
    },
    {
      code: '<template><textarea id="label-input" aria-label="second label" /></template>',
      output: null,
      errors: [{ messageId: 'multipleLabels' }],
    },
    {
      code: '<template><label>Textarea label<textarea aria-label="Custom label" /></label></template>',
      output: null,
      errors: [{ messageId: 'multipleLabels' }],
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
      errors: [{ messageId: 'multipleLabels' }],
    },
    {
      code: '<template><select id="label-input" aria-label="second label" /></template>',
      output: null,
      errors: [{ messageId: 'multipleLabels' }],
    },
    {
      code: '<template><label>Select label<select aria-label="Custom label" /></label></template>',
      output: null,
      errors: [{ messageId: 'multipleLabels' }],
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

hbsRuleTester.run('template-require-input-label', rule, {
  valid: [
    '<input id="probablyHasLabel" />',
    '<input aria-label={{labelText}} />',
    '<input aria-labelledby="someIdValue" />',
    '<div></div>',
    '<Input id="foo" />',
    '{{input id="foo"}}',
    '<input id="label-input" ...attributes>',
    '<textarea id="probablyHasLabel" />',
    '<textarea aria-label={{labelText}} />',
    '<textarea aria-labelledby="someIdValue" />',
    '<Textarea id="foo" />',
    '{{textarea id="foo"}}',
    '<textarea id="label-input" ...attributes />',
    '<select id="probablyHasLabel" ></select>',
    '<select aria-label={{labelText}} ></select>',
    '<select aria-labelledby="someIdValue" ></select>',
    '<select id="label-input" ...attributes ></select>',
    '<input type="hidden"/>',
    '<Input type="hidden" />',
    '{{input type="hidden"}}',
  ],
  invalid: [
    {
      code: '<my-label><input /></my-label>',
      output: null,
      errors: [
        { message: 'Input elements should have an associated label.' },
      ],
    },
    {
      code: '<div><input /></div>',
      output: null,
      errors: [
        { message: 'Input elements should have an associated label.' },
      ],
    },
    {
      code: '<input />',
      output: null,
      errors: [
        { message: 'Input elements should have an associated label.' },
      ],
    },
    {
      code: '<input title="some title value" />',
      output: null,
      errors: [
        { message: 'Input elements should have an associated label.' },
      ],
    },
    {
      code: '<label><input></label>',
      output: null,
      errors: [
        { message: 'Input elements should have an associated label.' },
      ],
    },
    {
      code: '<div>{{input}}</div>',
      output: null,
      errors: [
        { message: 'Input elements should have an associated label.' },
      ],
    },
    {
      code: '<Input/>',
      output: null,
      errors: [
        { message: 'Input elements should have an associated label.' },
      ],
    },
    {
      code: '<input aria-label="first label" aria-labelledby="second label">',
      output: null,
      errors: [
        { message: 'Input element has multiple labelling mechanisms.' },
      ],
    },
    {
      code: '<input id="label-input" aria-label="second label">',
      output: null,
      errors: [
        { message: 'Input element has multiple labelling mechanisms.' },
      ],
    },
    {
      code: '<label>Input label<input aria-label="Custom label"></label>',
      output: null,
      errors: [
        { message: 'Input element has multiple labelling mechanisms.' },
      ],
    },
    {
      code: '{{input type="button"}}',
      output: null,
      errors: [
        { message: 'Input elements should have an associated label.' },
      ],
    },
    {
      code: '{{input type=myType}}',
      output: null,
      errors: [
        { message: 'Input elements should have an associated label.' },
      ],
    },
    {
      code: '<input type="button"/>',
      output: null,
      errors: [
        { message: 'Input elements should have an associated label.' },
      ],
    },
    {
      code: '<input type={{myType}}/>',
      output: null,
      errors: [
        { message: 'Input elements should have an associated label.' },
      ],
    },
    {
      code: '<Input type="button"/>',
      output: null,
      errors: [
        { message: 'Input elements should have an associated label.' },
      ],
    },
    {
      code: '<Input type={{myType}}/>',
      output: null,
      errors: [
        { message: 'Input elements should have an associated label.' },
      ],
    },
    {
      code: '<div><textarea /></div>',
      output: null,
      errors: [
        { message: 'Input elements should have an associated label.' },
      ],
    },
    {
      code: '<textarea />',
      output: null,
      errors: [
        { message: 'Input elements should have an associated label.' },
      ],
    },
    {
      code: '<textarea title="some title value" />',
      output: null,
      errors: [
        { message: 'Input elements should have an associated label.' },
      ],
    },
    {
      code: '<label><textarea /></label>',
      output: null,
      errors: [
        { message: 'Input elements should have an associated label.' },
      ],
    },
    {
      code: '<div>{{textarea}}</div>',
      output: null,
      errors: [
        { message: 'Input elements should have an associated label.' },
      ],
    },
    {
      code: '<Textarea />',
      output: null,
      errors: [
        { message: 'Input elements should have an associated label.' },
      ],
    },
    {
      code: '<textarea aria-label="first label" aria-labelledby="second label" />',
      output: null,
      errors: [
        { message: 'Input element has multiple labelling mechanisms.' },
      ],
    },
    {
      code: '<textarea id="label-input" aria-label="second label" />',
      output: null,
      errors: [
        { message: 'Input element has multiple labelling mechanisms.' },
      ],
    },
    {
      code: '<label>Textarea label<textarea aria-label="Custom label" /></label>',
      output: null,
      errors: [
        { message: 'Input element has multiple labelling mechanisms.' },
      ],
    },
    {
      code: '<div><select></select></div>',
      output: null,
      errors: [
        { message: 'Input elements should have an associated label.' },
      ],
    },
    {
      code: '<select></select>',
      output: null,
      errors: [
        { message: 'Input elements should have an associated label.' },
      ],
    },
    {
      code: '<select title="some title value" />',
      output: null,
      errors: [
        { message: 'Input elements should have an associated label.' },
      ],
    },
    {
      code: '<label><select></select></label>',
      output: null,
      errors: [
        { message: 'Input elements should have an associated label.' },
      ],
    },
    {
      code: '<select aria-label="first label" aria-labelledby="second label" />',
      output: null,
      errors: [
        { message: 'Input element has multiple labelling mechanisms.' },
      ],
    },
    {
      code: '<select id="label-input" aria-label="second label" />',
      output: null,
      errors: [
        { message: 'Input element has multiple labelling mechanisms.' },
      ],
    },
    {
      code: '<label>Select label<select aria-label="Custom label" /></label>',
      output: null,
      errors: [
        { message: 'Input element has multiple labelling mechanisms.' },
      ],
    },
  ],
});
