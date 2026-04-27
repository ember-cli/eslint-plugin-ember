# ember/template-valid-label-for

<!-- begin auto-generated rule header -->
<!-- end auto-generated rule header -->

This rule validates that `<label for="x">` references a labelable form
control (`<input>` — except `type="hidden"` — `<select>`, `<textarea>`,
`<button>`, `<meter>`, `<output>`, `<progress>`, plus Ember's built-in
`<Input>` / `<Textarea>`) defined in the same template.

It also flags `for` as redundant when the referenced element is the one
that HTML's implicit-containment rule would have bound anyway — i.e. the
**first labelable descendant** of the `<label>` (per HTML §4.10.4). When
a label contains multiple labelable descendants and `for` points at a
non-first one, the author is deliberately overriding the implicit choice;
this is not redundant and is NOT flagged.

Only the label side is checked. Use `template-require-input-label` for the
other direction (every input should have a label).

## Examples

This rule **forbids** the following:

```hbs
<label for='first-name'>First name</label>
<div id='first-name'>text</div>

<label for='email'>
  Email
  <input id='email' />
</label>
```

This rule **allows** the following:

```hbs
<label for='first-name'>First name</label>
<input id='first-name' />

<label for='country'>Country</label>
<select id='country'><option>NO</option></select>

{{! Nested association — for attribute omitted. }}
<label>
  Email
  <input />
</label>

{{! Dynamic for / id — skipped. }}
<label for={{this.fieldId}}>Dynamic</label>
```

## Limitations

- Dynamic `for` or `id` values (mustache) are skipped.
- Targets that live outside the template file (rendered by a yielded
  component or a partial) can't be validated and are silently ignored.
- Multiple occurrences of the same `id` are tracked as the first one seen;
  `template-no-duplicate-id` handles the duplicate case separately.
- Classic curly-helper invocations like `{{input id="x"}}` or
  `{{textarea id="x"}}` are not collected as label targets — only angle-bracket
  element forms contribute `id`s. A `<label for="x">` that points at a
  curly-helper-rendered control is **silently ignored** by the rule (the
  association is not visible to the static analyzer; the rule does not report
  it as missing, but it also can't validate it). Use the angle-bracket form
  (`<Input id="x" />`, `<Textarea id="x" />`, or a native `<input id="x" />`)
  when you need the rule to see the association.
- **Scope:** native HTML labelable controls plus Ember's built-in `<Input>`
  and `<Textarea>` components (which render to `<input>` / `<textarea>` and
  accept `id=` forwarding, so they are valid `<label for>` targets).
  Resolution depends on template mode:
  - **Classic Handlebars (`.hbs`):** `<Input>` / `<Textarea>` always resolve
    globally to the built-in — treated as labelable.
  - **Strict GJS/GTS (`.gjs` / `.gts`):** the rule inspects the file's
    `import` declarations. A PascalCase tag is treated as a built-in
    labelable component if and only if it's imported from
    `@ember/component` — whether bound under the original name
    (`import { Input }`) or a local alias (`import { Input as MyInput }`).
    Imports from other modules (custom libraries, local components) are
    NOT recognized as labelable.

  Other components — custom labelable wrappers, component compositions —
  are not detected. Rewrite to native controls, use Ember's built-in, or
  suppress on a case-by-case basis.

## References

- [HTML spec: Labelable elements](https://html.spec.whatwg.org/multipage/forms.html#category-label)
- Adapted from [`html-validate`'s `valid-for`](https://html-validate.org/rules/valid-for.html) (MIT).
