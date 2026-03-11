# ember/template-require-valid-form-groups

<!-- end auto-generated rule header -->

Require grouped form controls to have appropriate semantics.

When multiple form controls are related, they should be grouped with either:

- `<fieldset>` and `<legend>` (preferred), or
- `role="group"` together with `aria-labelledby`.

## Examples

Examples of **incorrect** code for this rule:

```gjs
<template>
  <div>
    <label for="radio-001">Chicago Zoey</label>
    <input id="radio-001" type="radio" name="prefMascot-Zoey" />
    <label for="radio-002">Chicago Tom</label>
    <input id="radio-002" type="radio" name="prefMascot-Tom" />
  </div>
</template>
```

Examples of **correct** code for this rule:

```gjs
<template>
  <fieldset>
    <legend>Preferred Mascot Version</legend>
    <label for="radio-001">Chicago Zoey</label>
    <input id="radio-001" type="radio" name="prefMascot-Zoey" />
    <label for="radio-002">Chicago Tom</label>
    <input id="radio-002" type="radio" name="prefMascot-Tom" />
  </fieldset>
</template>
```

```gjs
<template>
  <div role="group" aria-labelledby="preferred-mascot-heading">
    <div id="preferred-mascot-heading">Preferred Mascot Version</div>
    <label for="radio-001">Chicago Zoey</label>
    <input id="radio-001" type="radio" name="prefMascot-Zoey" />
    <label for="radio-002">Chicago Tom</label>
    <input id="radio-002" type="radio" name="prefMascot-Tom" />
  </div>
</template>
```

## References

- [Grouping Controls](https://www.w3.org/WAI/tutorials/forms/grouping/)
- [The fieldset element](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/fieldset)
