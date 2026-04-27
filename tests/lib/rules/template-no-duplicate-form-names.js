const rule = require('../../../lib/rules/template-no-duplicate-form-names');
const RuleTester = require('eslint').RuleTester;

const err = (name) => `Duplicate form control \`name="${name}"\` within the same form`;

const validHbs = [
  // Single occurrence.
  '<form><input name="email" /></form>',
  '<form><input name="email" /><input name="password" /></form>',
  // Radio group with shared name.
  '<form><input type="radio" name="c" value="r" /><input type="radio" name="c" value="b" /></form>',
  // Submit buttons can share a name.
  '<form><button type="submit" name="a" value="save">S</button><button type="submit" name="a" value="p">P</button></form>',
  '<form><input type="submit" name="act" /><input type="submit" name="act" /></form>',
  // Mixed submit-like controls — per HTML §4.10.21.4 only one contributes to
  // the form-data entry list per submission, so any combination can share a
  // name. Submit-like set: `<button [type=submit]>`, `<input type=submit>`,
  // `<input type=image>`. Derived from aria-query's `button`-role mapping.
  '<form><input type="submit" name="a" /><input type="image" name="a" src="/x.png" /></form>',
  '<form><button name="a" value="save">Save</button><input type="image" name="a" src="/x.png" /></form>',
  '<form><input type="image" name="a" src="/a.png" /><input type="image" name="a" src="/b.png" /></form>',
  // Non-submitting types (button, reset) don't contribute to form data; their
  // `name` is skipped entirely, so any combination is fine.
  '<form><button type="reset" name="r">1</button><button type="reset" name="r">2</button></form>',
  '<form><input type="button" name="x" /><input type="button" name="x" /></form>',
  '<form><input type="button" name="x" /><input type="text" name="x" /></form>',
  '<form><button type="button" name="x">1</button><input type="text" name="x" /></form>',
  '<form><input type="reset" name="x" /><input type="text" name="x" /></form>',
  // Dynamic name — skip.
  '<form><input name={{this.fieldName}} /><input name="email" /></form>',
  // Dynamic type — the control's submission category is unknown at lint
  // time, so we can't prove a collision with a same-named static control.
  // Skip rather than guess; false negatives here are safer than flagging a
  // legitimate radio/button group that happens to share a name.
  '<form><input type={{this.kind}} name="a" /><input type="text" name="a" /></form>',
  '<form><button type={{this.kind}} name="a">x</button><input type="text" name="a" /></form>',
  // Same name but in different forms — fine.
  '<form><input name="a" /></form><form><input name="a" /></form>',
  // Disabled control is ignored — it does not contribute to form data.
  '<form><input name="a" /><input name="a" disabled /></form>',
  '<form><input name="a" /><input name="a" disabled="disabled" /></form>',
  // No name attribute — skip.
  '<form><input /><input /></form>',
  // Empty name — skip.
  '<form><input name="" /><input name="" /></form>',

  // Mutually-exclusive branches of {{#if}} / {{#unless}} / {{#each}}{{else}}
  // never both render — same-name fields across branches aren't duplicates.
  '<form>{{#if this.editing}}<input name="title" />{{else}}<input name="title" />{{/if}}</form>',
  '<form>{{#unless this.readOnly}}<input name="q" />{{else}}<input name="q" />{{/unless}}</form>',
  '<form>{{#each this.items}}<input name="items[]" />{{else}}<input name="items[]" />{{/each}}</form>',
  // Nested: inner mutual exclusion under outer common ancestor.
  '<form>{{#if this.a}}{{#if this.b}}<input name="x" />{{else}}<input name="x" />{{/if}}{{/if}}</form>',
];

const invalidHbs = [
  {
    code: '<form><input name="email" /><input name="email" /></form>',
    errors: [{ message: err('email') }],
  },
  {
    code: '<form><input name="x" /><textarea name="x"></textarea></form>',
    errors: [{ message: err('x') }],
  },
  {
    code: '<form><input name="x" /><select name="x"><option>a</option></select></form>',
    errors: [{ message: err('x') }],
  },
  // Mixed radio + text type — not compatible.
  {
    code: '<form><input type="radio" name="c" /><input type="text" name="c" /></form>',
    errors: [{ message: err('c') }],
  },
  // Radio + submit — different share categories (radio group vs submit-
  // like). Both contribute to form data in different ways; same name is
  // a real collision.
  {
    code: '<form><input type="radio" name="a" /><input type="submit" name="a" /></form>',
    errors: [{ message: err('a') }],
  },
  // Text + image (image is submit-like; text is not shareable) — collision.
  {
    code: '<form><input type="text" name="a" /><input type="image" name="a" src="/x.png" /></form>',
    errors: [{ message: err('a') }],
  },
  // `disabled={{false}}` renders no `disabled` attribute at runtime
  // (Glimmer VM normalizes boolean false to attribute removal) — the
  // control IS enabled and contributes to form data, so the duplicate
  // name collides with the enabled sibling.
  {
    code: '<form><input name="a" /><input name="a" disabled={{false}} /></form>',
    errors: [{ message: err('a') }],
  },
  // No enclosing form — template root acts as scope.
  {
    code: '<input name="x" /><input name="x" />',
    errors: [{ message: err('x') }],
  },
  // `hidden` does not exempt from form submission per HTML spec — a hidden
  // control carries a real value and can legitimately collide by name.
  {
    code: '<form><input name="x" hidden /><input name="x" /></form>',
    errors: [{ message: err('x') }],
  },
  // Conditional WITH an unconditional sibling — the unconditional renders
  // alongside EITHER branch, so it's flagged (only the unconditional gets
  // the report; the two branch-inputs are mutually exclusive with each
  // other and individually don't collide with any prior entry).
  {
    code: '<form>{{#if this.a}}<input name="x" />{{else}}<input name="x" />{{/if}}<input name="x" /></form>',
    errors: [{ message: err('x') }],
  },
  // Two separate `{{#if}}`s are NOT mutually exclusive — both can render
  // together when both conditions are true.
  {
    code: '<form>{{#if this.a}}<input name="x" />{{/if}}{{#if this.b}}<input name="x" />{{/if}}</form>',
    errors: [{ message: err('x') }],
  },
  // {{#let}} is pure scoping, not mutual exclusion — two inputs across let
  // bodies both render.
  {
    code: '<form>{{#let this.a as |x|}}<input name="n" />{{/let}}{{#let this.b as |y|}}<input name="n" />{{/let}}</form>',
    errors: [{ message: err('n') }],
  },
];

const gjsValid = validHbs.map((code) => `<template>${code}</template>`);
const gjsInvalid = invalidHbs.map(({ code, errors }) => ({
  code: `<template>${code}</template>`,
  errors,
}));

const gjsRuleTester = new RuleTester({
  parser: require.resolve('ember-eslint-parser'),
  parserOptions: { ecmaVersion: 2022, sourceType: 'module' },
});

gjsRuleTester.run('template-no-duplicate-form-names', rule, {
  valid: gjsValid,
  invalid: gjsInvalid,
});

const hbsRuleTester = new RuleTester({
  parser: require.resolve('ember-eslint-parser/hbs'),
  parserOptions: { ecmaVersion: 2022, sourceType: 'module' },
});

hbsRuleTester.run('template-no-duplicate-form-names', rule, {
  valid: validHbs,
  invalid: invalidHbs,
});
