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
    // https://github.com/ember-template-lint/ember-template-lint/issues/3388
    // id alone does not establish a labeling relationship — a <label for> is
    // needed and cannot be verified statically. Only aria-label/labelledby
    // should count.
    '<template><input id="hello" aria-label="hello" /></template>',
    '<template><input id="hello" aria-labelledby="someIdValue" /></template>',
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
    // In GJS/GTS with no @ember/component import, <Input>/<Textarea> are
    // user-authored components — do not treat them as the built-in.
    { filename: 'layout.gjs', code: '<template><Input /></template>' },
    { filename: 'layout.gts', code: '<template><Textarea /></template>' },
    // In GJS/GTS, {{input}} / {{textarea}} are user-imported bindings, not
    // the classic Ember helpers — skip the mustache-form check.
    { filename: 'layout.gjs', code: '<template>{{input}}</template>' },
    { filename: 'layout.gts', code: '<template>{{textarea}}</template>' },
    // Built-in <Input> imported from @ember/component, wrapped in a label.
    {
      filename: 'layout.gjs',
      code: "import { Input } from '@ember/component';\n<template><label>Name <Input /></label></template>",
    },
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
    // checkLabelFor: label before input
    {
      code: '<template><label for="email">Email</label><input id="email" /></template>',
      options: [{ checkLabelFor: true }],
    },
    // checkLabelFor: label after input (forward reference resolved at Program:exit)
    {
      code: '<template><input id="email" /><label for="email">Email</label></template>',
      options: [{ checkLabelFor: true }],
    },
    // checkLabelFor: input also has aria-label — not id-only, so not checked
    {
      code: '<template><input id="email" aria-label="Email" /></template>',
      options: [{ checkLabelFor: true }],
    },
    // checkLabelFor: dynamic id — can't match statically, falls back to skip
    {
      code: '<template><input id={{this.fieldId}} /></template>',
      options: [{ checkLabelFor: true }],
    },
    // checkLabelFor: the common Ember `(unique-id)` pattern uses dynamic
    // bindings on both sides — both for= and id= are dynamic, so neither is
    // collected, and the input falls back to the skip-if-id-present branch.
    // We deliberately don't resolve the {{#let}} binding symbolically.
    {
      code: '<template>{{#let (unique-id) as |myId|}}<label for={{myId}}>Name</label><input id={{myId}} />{{/let}}</template>',
      options: [{ checkLabelFor: true }],
    },
    // checkLabelFor: combined with labelTags — a CustomLabel wrapper still
    // satisfies the label requirement (same as without checkLabelFor).
    {
      code: '<template><CustomLabel><input id="email" /></CustomLabel></template>',
      options: [{ labelTags: ['CustomLabel'], checkLabelFor: true }],
    },
    // checkLabelFor: mustache string-literal for= collected correctly
    {
      code: '<template><label for={{"email"}}>Email</label><input id="email" /></template>',
      options: [{ checkLabelFor: true }],
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
      code: '<template><label>Input label<input aria-label="Custom label"></label></template>',
      output: null,
      errors: [{ message: MULTIPLE_LABELS }],
    },
    {
      // id is irrelevant for labelling here — wrapping <label> + aria-label is
      // still multiple labels.
      code: '<template><label>Input label<input id="foo" aria-label="Custom label"></label></template>',
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
    // Built-in <Input> imported from @ember/component in GJS → flagged.
    {
      filename: 'layout.gjs',
      code: "import { Input } from '@ember/component';\n<template><Input /></template>",
      output: null,
      errors: [{ message: NO_LABEL }],
    },
    // Renamed import of <Textarea> from @ember/component in GTS → flagged.
    {
      filename: 'layout.gts',
      code: "import { Textarea as TA } from '@ember/component';\n<template><TA /></template>",
      output: null,
      errors: [{ message: NO_LABEL }],
    },
    // checkLabelFor: id with no matching <label for> in the same template
    {
      code: '<template><input id="email" /></template>',
      output: null,
      options: [{ checkLabelFor: true }],
      errors: [{ message: NO_LABEL }],
    },
    // checkLabelFor: id with a mismatched for= (typo)
    {
      code: '<template><label for="emal">Email</label><input id="email" /></template>',
      output: null,
      options: [{ checkLabelFor: true }],
      errors: [{ message: NO_LABEL }],
    },
    // checkLabelFor: two inputs, only one has a matching label
    {
      code: '<template><label for="name">Name</label><input id="name" /><input id="email" /></template>',
      output: null,
      options: [{ checkLabelFor: true }],
      errors: [{ message: NO_LABEL }],
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
    // https://github.com/ember-template-lint/ember-template-lint/issues/3388
    '<input id="hello" aria-label="hello" />',
    '<input id="hello" aria-labelledby="someIdValue" />',
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
    // checkLabelFor: label before/after input within the same .hbs file
    {
      code: '<label for="email">Email</label><input id="email" />',
      options: [{ checkLabelFor: true }],
    },
    {
      code: '<input id="email" /><label for="email">Email</label>',
      options: [{ checkLabelFor: true }],
    },
    // checkLabelFor: id with aria-label is not deferred
    {
      code: '<input id="email" aria-label="Email" />',
      options: [{ checkLabelFor: true }],
    },
    // checkLabelFor: dynamic id falls back to skip
    {
      code: '<input id={{this.fieldId}} />',
      options: [{ checkLabelFor: true }],
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
      code: '<label>Input label<input aria-label="Custom label"></label>',
      output: null,
      errors: [{ message: MULTIPLE_LABELS }],
    },
    {
      code: '<label>Input label<input id="foo" aria-label="Custom label"></label>',
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
    // checkLabelFor: id with no matching <label for> in the same .hbs file
    {
      code: '<input id="email" />',
      output: null,
      options: [{ checkLabelFor: true }],
      errors: [{ message: NO_LABEL }],
    },
    // checkLabelFor: typo in for= attribute
    {
      code: '<label for="emal">Email</label><input id="email" />',
      output: null,
      options: [{ checkLabelFor: true }],
      errors: [{ message: NO_LABEL }],
    },
  ],
});
