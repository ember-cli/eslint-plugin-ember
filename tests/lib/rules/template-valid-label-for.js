const rule = require('../../../lib/rules/template-valid-label-for');
const RuleTester = require('eslint').RuleTester;

const errNotLabelable = (id) =>
  `\`<label for="${id}">\` must reference a labelable form control (\`<input>\`, \`<select>\`, \`<textarea>\`, \`<button>\`, \`<meter>\`, \`<output>\`, \`<progress>\`, or Ember \`<Input>\` / \`<Textarea>\`)`;
const errRedundant = (id) =>
  `\`for="${id}"\` is redundant: \`<label>\` already contains the referenced element`;

// Valid in both .hbs (classic) and .gjs (strict) — native HTML controls only.
const validHbs = [
  // Target labelable, not nested.
  '<label for="x">Name</label><input id="x" />',
  '<label for="c">Country</label><select id="c"><option>NO</option></select>',
  '<label for="t">Text</label><textarea id="t"></textarea>',
  '<label for="b">Button</label><button id="b">Click</button>',
  '<label for="o">Output</label><output id="o"></output>',
  '<label for="m">Meter</label><meter id="m"></meter>',
  '<label for="p">Progress</label><progress id="p"></progress>',
  // No for attribute — outside this rule's scope.
  '<label>Name<input /></label>',
  // Dynamic for — skip.
  '<label for={{this.id}}>Dynamic</label><div id="x"></div>',
  // Dynamic id on target — skip (can't verify).
  '<label for="a">a</label><input id={{this.id}} />',
  // Target not present — skip (partial template).
  '<label for="x">Missing</label>',
  // Target is hidden input — should flag per HTML spec (hidden isn't labelable),
  // but this case is already covered in invalid tests below.
  // Multi-labelable-children: `for` targets a non-first descendant. This is
  // an explicit override of the implicit-containment rule (HTML §4.10.4),
  // not redundant.
  '<label for="second"><input id="first" /><input id="second" /></label>',
  '<label for="pick"><input id="a" /><select id="pick"><option>x</option></select></label>',
];

// Valid in classic .hbs only — <Input>/<Textarea> resolve globally to the
// Ember built-in without an explicit import. In strict GJS/GTS an import
// from @ember/component is required; those cases live in multiTemplateValid.
const validHbsOnly = [
  '<label for="email">Email</label><Input id="email" />',
  '<label for="bio">Bio</label><Textarea id="bio" />',
  // `for` targets a non-first labelable descendant — explicit override of
  // the implicit-containment rule, not redundant, even with Ember built-ins.
  '<label for="second"><Input id="first" /><Input id="second" /></label>',
];

const invalidHbs = [
  // Target is not a labelable element.
  {
    code: '<label for="x">x</label><div id="x">text</div>',
    errors: [{ message: errNotLabelable('x') }],
  },
  {
    code: '<label for="s">s</label><span id="s">text</span>',
    errors: [{ message: errNotLabelable('s') }],
  },
  // input type="hidden" is not labelable.
  {
    code: '<label for="h">h</label><input type="hidden" id="h" />',
    errors: [{ message: errNotLabelable('h') }],
  },
  // Redundant for — target nested inside label.
  {
    code: '<label for="e">Email <input id="e" /></label>',
    errors: [{ message: errRedundant('e') }],
  },
  {
    code: '<label for="n">Name<br /><input id="n" /></label>',
    errors: [{ message: errRedundant('n') }],
  },
  // Redundant-for with a single labelable descendant — the `for` target IS
  // the implicit first labelable descendant.
  {
    code: '<label for="pw"><span>Password</span><input id="pw" type="password" /></label>',
    errors: [{ message: errRedundant('pw') }],
  },
];

const gjsValid = validHbs.map((code) => ({
  filename: 'test.gjs',
  code: `<template>${code}</template>`,
}));
const gjsInvalid = invalidHbs.map(({ code, errors }) => ({
  filename: 'test.gjs',
  code: `<template>${code}</template>`,
  errors,
}));

const gjsRuleTester = new RuleTester({
  parser: require.resolve('ember-eslint-parser'),
  parserOptions: { ecmaVersion: 2022, sourceType: 'module' },
});

// Multi-`<template>` cases — ids in one block don't resolve `for` in another.
const multiTemplateValid = [
  // Each template contains its own matching id — both valid in isolation.
  {
    filename: 'test.gjs',
    code: `const Widget = <template><input id="email" /></template>;
<template><label for="main">Main</label><input id="main" /></template>`,
  },
  // Sibling templates both have independent matching pairs.
  {
    filename: 'test.gjs',
    code: `<template><label for="a">A</label><input id="a" /></template>
<template><label for="b">B</label><input id="b" /></template>`,
  },

  // Ember built-in <Input> / <Textarea> imported from @ember/component —
  // labelable via the import-source check. Covers both unaliased and
  // aliased forms.
  {
    filename: 'test.gjs',
    code: `import { Input } from '@ember/component';
<template><label for="email">Email</label><Input id="email" /></template>`,
  },
  {
    filename: 'test.gjs',
    code: `import { Input as MyInput, Textarea as MyTextarea } from '@ember/component';
<template><label for="email">E</label><MyInput id="email" />
<label for="bio">B</label><MyTextarea id="bio" /></template>`,
  },
];

const multiTemplateInvalid = [
  // First template declares id="email", second has <label for="email">.
  // Without per-template scoping this would (wrongly) resolve across the
  // file. Per-template scoping treats it as "target missing in this
  // template" — and since missing-target silently passes (partial-template
  // allowance), this case doesn't flag. So we need a stronger case: the
  // `for` target exists IN THIS template but is non-labelable, while a
  // labelable id of the same name lives in a SIBLING template. Without
  // scoping the rule would find the labelable one and pass; with scoping,
  // it correctly flags the local non-labelable.
  {
    filename: 'test.gjs',
    code: `const Widget = <template><input id="x" /></template>;
<template><label for="x">x</label><div id="x">text</div></template>`,
    errors: [{ message: errNotLabelable('x') }],
  },

  // <Input> imported from a NON-@ember/component module — user override,
  // not the built-in labelable component. Rule correctly flags.
  {
    filename: 'test.gjs',
    code: `import Input from 'my-own-lib';
<template><label for="x">x</label><Input id="x" /></template>`,
    errors: [{ message: errNotLabelable('x') }],
  },

  // Ember <Input type="hidden"> renders a native <input type="hidden"> — not
  // labelable for the same reason native <input type="hidden"> isn't.
  {
    filename: 'test.gjs',
    code: `import { Input } from '@ember/component';
<template><label for="h">h</label><Input type="hidden" id="h" /></template>`,
    errors: [{ message: errNotLabelable('h') }],
  },
  // Aliased import — same rule applies to the local alias.
  {
    filename: 'test.gjs',
    code: `import { Input as MyInput } from '@ember/component';
<template><label for="h">h</label><MyInput type="hidden" id="h" /></template>`,
    errors: [{ message: errNotLabelable('h') }],
  },
];

gjsRuleTester.run('template-valid-label-for', rule, {
  valid: [...gjsValid, ...multiTemplateValid],
  invalid: [...gjsInvalid, ...multiTemplateInvalid],
});

const hbsRuleTester = new RuleTester({
  parser: require.resolve('ember-eslint-parser/hbs'),
  parserOptions: { ecmaVersion: 2022, sourceType: 'module' },
});

hbsRuleTester.run('template-valid-label-for', rule, {
  valid: [...validHbs, ...validHbsOnly],
  invalid: invalidHbs,
});
