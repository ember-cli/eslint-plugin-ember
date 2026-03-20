const eslint = require('eslint');
const rule = require('../../../lib/rules/template-require-input-label');

const { RuleTester } = eslint;

const NO_LABEL = 'form elements require a valid associated label.';
const MULTIPLE_LABELS = 'form elements should not have multiple labels.';

const ruleTester = new RuleTester({
  parser: require.resolve('ember-eslint-parser'),
  parserOptions: { ecmaVersion: 2022, sourceType: 'module' },
});

ruleTester.run('template-require-input-label', rule, {
  valid: [
    '<template><label>LabelText<input /></label></template>',
    '<template><label><input />LabelText</label></template>',
    '<template><label>Label Text<div><input /></div></label></template>',
    '<template><input id="probablyHasLabel" /></template>',
    '<template><input aria-label={{labelText}} /></template>',
    '<template><input aria-labelledby="someIdValue" /></template>',
    '<template><div></div></template>',
    '<template><Input id="foo" /></template>',
    '<template>{{input id="foo"}}</template>',
    '<template><input ...attributes /></template>',
    '<template><label>LabelText<textarea /></label></template>',
    '<template><textarea id="probablyHasLabel" /></template>',
    '<template><textarea aria-label={{labelText}} /></template>',
    '<template><textarea aria-labelledby="someIdValue" /></template>',
    '<template><Textarea id="foo" /></template>',
    '<template>{{textarea id="foo"}}</template>',
    '<template><textarea ...attributes /></template>',
    '<template><label>LabelText<select></select></label></template>',
    '<template><select id="probablyHasLabel"></select></template>',
    '<template><select aria-label={{labelText}}></select></template>',
    '<template><select aria-labelledby="someIdValue"></select></template>',
    '<template><select ...attributes></select></template>',
    '<template><input type="hidden" /></template>',
    '<template><Input type="hidden" /></template>',
    '<template>{{input type="hidden"}}</template>',
    { filename: 'layout.gjs', code: '<template><Input /></template>' },
    { filename: 'layout.gts', code: '<template><Textarea /></template>' },
    {
      code: '<template><CustomLabel><input /></CustomLabel></template>',
      options: [{ labelTags: ['CustomLabel'] }],
    },
    {
      code: '<template><web-label><input /></web-label></template>',
      options: [{ labelTags: [/web-label/] }],
    },
    {
      code: '<template><input /></template>',
      options: [false],
    },
  ],
  invalid: [
    {
      code: '<template><my-label><input /></my-label></template>',
      output: null,
      options: [{ labelTags: [/web-label/] }],
      errors: [{ message: NO_LABEL }],
    },
    {
      code: '<template><div><input /></div></template>',
      output: null,
      errors: [{ message: NO_LABEL }],
    },
    {
      code: '<template><input title="some title value" /></template>',
      output: null,
      errors: [{ message: NO_LABEL }],
    },
    {
      code: '<template><label><input></label></template>',
      output: null,
      errors: [{ message: NO_LABEL }],
    },
    {
      code: '<template><div>{{input}}</div></template>',
      output: null,
      errors: [{ message: NO_LABEL }],
    },
    {
      code: '<template><input aria-label="first label" aria-labelledby="second label"></template>',
      output: null,
      errors: [{ message: MULTIPLE_LABELS }],
    },
    {
      code: '<template><input id="label-input" aria-label="second label"></template>',
      output: null,
      errors: [{ message: MULTIPLE_LABELS }],
    },
    {
      code: '<template><label>Input label<input aria-label="Custom label"></label></template>',
      output: null,
      errors: [{ message: MULTIPLE_LABELS }],
    },
    {
      code: '<template>{{input type="button"}}</template>',
      output: null,
      errors: [{ message: NO_LABEL }],
    },
    {
      code: '<template>{{input type=myType}}</template>',
      output: null,
      errors: [{ message: NO_LABEL }],
    },
    {
      code: '<template><textarea /></template>',
      output: null,
      errors: [{ message: NO_LABEL }],
    },
    {
      code: '<template><textarea aria-label="first label" aria-labelledby="second label" /></template>',
      output: null,
      errors: [{ message: MULTIPLE_LABELS }],
    },
    {
      code: '<template><select></select></template>',
      output: null,
      errors: [{ message: NO_LABEL }],
    },
    {
      code: '<template><select aria-label="first label" aria-labelledby="second label" /></template>',
      output: null,
      errors: [{ message: MULTIPLE_LABELS }],
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
    '<label>LabelText<input /></label>',
    '<label><input />LabelText</label>',
    '<label>LabelText<Input /></label>',
    '<label><Input />LabelText</label>',
    '<label>Label Text<div><input /></div></label>',
    '<label>text<Input id="foo" /></label>',
    '<label>Text here<Input /></label>',
    '<input id="probablyHasLabel" />',
    '<input aria-label={{labelText}} />',
    '<input aria-labelledby="someIdValue" />',
    '<div></div>',
    '<Input id="foo" />',
    '{{input id="foo"}}',
    '<input ...attributes/>',
    '<Input ...attributes />',
    '<input id="label-input" ...attributes>',
    '<label>LabelText<textarea /></label>',
    '<label><textarea />LabelText</label>',
    '<label>LabelText<Textarea /></label>',
    '<label><Textarea />LabelText</label>',
    '<label>Label Text<div><textarea /></div></label>',
    '<label>Text here<Textarea /></label>',
    '<label>Text here {{textarea}}</label>',
    '<textarea id="probablyHasLabel" />',
    '<textarea aria-label={{labelText}} />',
    '<textarea aria-labelledby="someIdValue" />',
    '<Textarea id="foo" />',
    '{{textarea id="foo"}}',
    '<textarea ...attributes/>',
    '<Textarea ...attributes />',
    '<textarea id="label-input" ...attributes />',
    '<label>LabelText<select></select></label>',
    '<label><select></select>LabelText</label>',
    '<label>Label Text<div><select></select></div></label>',
    '<select id="probablyHasLabel"></select>',
    '<select aria-label={{labelText}}></select>',
    '<select aria-labelledby="someIdValue"></select>',
    '<select ...attributes></select>',
    '<select id="label-input" ...attributes ></select>',
    '<input type="hidden"/>',
    '<Input type="hidden" />',
    '{{input type="hidden"}}',
    {
      code: '<CustomLabel><input /></CustomLabel>',
      options: [{ labelTags: ['CustomLabel'] }],
    },
    {
      code: '<web-label><input /></web-label>',
      options: [{ labelTags: [/web-label/] }],
    },
    {
      code: '<input />',
      options: [false],
    },
  ],
  invalid: [
    {
      code: '<my-label><input /></my-label>',
      output: null,
      options: [{ labelTags: [/web-label/] }],
      errors: [{ message: NO_LABEL }],
    },
    {
      code: '<div><input /></div>',
      output: null,
      errors: [{ message: NO_LABEL }],
    },
    {
      code: '<input />',
      output: null,
      errors: [{ message: NO_LABEL }],
    },
    {
      code: '<input title="some title value" />',
      output: null,
      errors: [{ message: NO_LABEL }],
    },
    {
      code: '<label><input></label>',
      output: null,
      errors: [{ message: NO_LABEL }],
    },
    {
      code: '<div>{{input}}</div>',
      output: null,
      errors: [{ message: NO_LABEL }],
    },
    {
      code: '<Input/>',
      output: null,
      errors: [{ message: NO_LABEL }],
    },
    {
      code: '<input aria-label="first label" aria-labelledby="second label">',
      output: null,
      errors: [{ message: MULTIPLE_LABELS }],
    },
    {
      code: '<input id="label-input" aria-label="second label">',
      output: null,
      errors: [{ message: MULTIPLE_LABELS }],
    },
    {
      code: '<label>Input label<input aria-label="Custom label"></label>',
      output: null,
      errors: [{ message: MULTIPLE_LABELS }],
    },
    {
      code: '{{input type="button"}}',
      output: null,
      errors: [{ message: NO_LABEL }],
    },
    {
      code: '{{input type=myType}}',
      output: null,
      errors: [{ message: NO_LABEL }],
    },
    {
      code: '<Input type="button"/>',
      output: null,
      errors: [{ message: NO_LABEL }],
    },
    {
      code: '<Input type={{myType}}/>',
      output: null,
      errors: [{ message: NO_LABEL }],
    },
    {
      code: '<textarea />',
      output: null,
      errors: [{ message: NO_LABEL }],
    },
    {
      code: '<Textarea />',
      output: null,
      errors: [{ message: NO_LABEL }],
    },
    {
      code: '<textarea aria-label="first label" aria-labelledby="second label" />',
      output: null,
      errors: [{ message: MULTIPLE_LABELS }],
    },
    {
      code: '<select></select>',
      output: null,
      errors: [{ message: NO_LABEL }],
    },
    {
      code: '<select aria-label="first label" aria-labelledby="second label" />',
      output: null,
      errors: [{ message: MULTIPLE_LABELS }],
    },
  ],
});
