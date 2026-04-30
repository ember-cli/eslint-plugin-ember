# ember/template-valid-autocomplete

<!-- end auto-generated rule header -->

This rule validates the `autocomplete` attribute against the HTML living
standard. Browsers ignore unknown tokens and mismatched combinations
silently, so authoring mistakes become invisible at runtime — the user
just doesn't get the suggestions they expect.

The rule handles:

- `<form autocomplete>` must be `"on"` or `"off"`.
- `<input type="hidden">` cannot use the bare values `"on"` / `"off"`.
- `<input type="checkbox | radio | file | submit | image | reset | button">`
  cannot use `autocomplete` at all.
- Token grammar: tokens must be a valid combination from the section / hint /
  contact / field-name / webauthn set, in the right order.

Dynamic values (`autocomplete={{this.acValue}}`) are skipped. Static empty
(`autocomplete=""`) and whitespace-only values are flagged: on `<form>` as
an invalid non-on/off value, on controls as a missing field name.

**Not checked**: whether a field name's control group matches the input type
(e.g. `"current-password"` on `<input type="text">`). The HTML spec describes
these field-name-to-control-group mappings descriptively — it does not
prohibit mismatched pairings with a MUST/MUST NOT. UA and password-manager
behavior varies, so such a pairing is a grammar-valid author choice whose
UA-visibility is a UX question, not a spec violation. `html-validate` flags
it; we don't. `eslint-plugin-jsx-a11y` and `eslint-plugin-lit-a11y` also
don't (they delegate to axe-core's `autocomplete-valid`, which omits the
check) — that corroborates but does not drive the decision.

## Token order

An autocomplete attribute value can contain these tokens, in this order:

1. Optional section name (`section-*` prefix).
2. Optional `shipping` or `billing`.
3. Optional contact modifier: `home`, `work`, `mobile`, `fax`, `pager`
   (only for `tel-*` / `email` / `impp` field names).
4. Exactly one field name.
5. Optional `webauthn`.

## Examples

This rule **forbids** the following:

```hbs
<form autocomplete='yes'>
  <input autocomplete='first-name' type='text' />
  <input autocomplete='off street-address' type='text' />
  <input autocomplete='home email family-name' type='text' />
  <input autocomplete='section-a' type='text' />
</form>
```

This rule **allows** the following:

```hbs
<form autocomplete='off'>
  <input autocomplete='email' type='email' />
  <input autocomplete='section-ship shipping street-address' type='text' />
  <input autocomplete='work email' type='email' />
  <input autocomplete='new-password webauthn' type='password' />
</form>
```

## References

- [HTML spec: autofill](https://html.spec.whatwg.org/multipage/form-control-infrastructure.html#autofill)
- Adapted from [`html-validate`'s `valid-autocomplete`](https://html-validate.org/rules/valid-autocomplete.html) (MIT).
