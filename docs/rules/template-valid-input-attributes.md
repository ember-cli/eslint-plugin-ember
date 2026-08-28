# ember/template-valid-input-attributes

<!-- end auto-generated rule header -->

This rule flags `<input>` attributes that are incompatible with the
declared `type`. For example, `pattern` only applies to the text-like
input types; on `type="number"` it is silently ignored by the browser.

The attribute/type compatibility table matches the HTML living standard.
Dynamic type values (e.g. `type={{this.inputType}}`) are skipped. Inputs
with a missing, valueless, empty, or unknown `type` are treated as being
in the Text state and are validated accordingly.

## Examples

This rule **forbids** the following:

```hbs
<input type='number' pattern='\d+' />
<input type='text' accept='image/*' />
<input type='radio' maxlength='10' />
<input type='checkbox' placeholder='label' />
```

This rule **allows** the following:

```hbs
<input type='text' pattern='\d+' />
<input type='file' accept='image/*' />
<input type='number' min='0' max='100' step='1' />
<input type='image' alt='submit' src='/submit.png' />
```

## References

- [HTML spec: input element content attributes](https://html.spec.whatwg.org/multipage/input.html#the-input-element)
- Adapted from [`html-validate`'s `input-attributes`](https://html-validate.org/rules/input-attributes.html) (MIT).
