# ember/template-no-mut-helper

<!-- end auto-generated rule header -->

Disallow usage of the `(mut)` helper.

The `(mut)` helper was used in classic Ember to create two-way bindings. In modern Ember (Octane and beyond), this pattern is discouraged in favor of explicit one-way data flow with actions or setters.

## Rule Details

This rule disallows using the `(mut)` helper in templates.

## Reasons to not use [the `mut` helper](https://api.emberjs.com/ember/release/classes/Ember.Templates.helpers/methods/each?anchor=mut)

1. General problems in the programming model:
   * The mut helper is non-intuitive to use, see, teach, and learn since it can either be a getter or a setter based on the context in which it’s used.

   Example:

   ```hbs
   {{#let (mut this.foo) as |foo|}}
     <!-- When used like this, it's a getter -->
     {{foo}}

     <!-- When used like this, it's a setter -->
     <button {{action foo 123}}>Update Foo</button>
   {{/let}}
   ```

   * The need for the [no-extra-mut-helper-argument](template-no-extra-mut-helper-argument.md) rule is further evidence that `mut` has a non-intuitive signature and frequently gets misused.
   * The mut helper is usually only used as a pure setter, in which case there are other template helpers that are pure setters that could be used instead of mut (e.g. [ember-set-helper](https://github.com/pzuraq/ember-set-helper)).
2. Incompatibility with Glimmer Component intentions:

   * The mut helper can re-introduce 2 way data binding into Glimmer Components on named arguments where a child can change a parent’s data, which goes against the Data Down Actions Up principle, goes against Glimmer Components’ intention to have immutable arguments, and is [discouraged by the Ember Core team](https://www.pzuraq.com/blog/on-mut-and-2-way-binding/).

Example:

```hbs
<input
  type="checkbox"
  checked={{@checked}}
  {{on "change" (fn (mut @checked) (not @checked))}}
/>
```

## What this rule does

This rule forbids any use of the `mut` helper, both as a getter and a setter, in any context. It also
surfaces possible alternatives in the lint violation message to help guide engineers to resolving
the lint violations.

## Examples

### Incorrect ❌

```gjs
<template>
  <Input @value={{this.name}} @onChange={{mut this.name}} />
</template>
```

```gjs
<template>
  {{input value=(mut this.name)}}
</template>
```

```gjs
<template>
  <CustomComponent @onChange={{mut this.value}} />
</template>
```

### Correct ✅

```gjs
<template>
  <Input @value={{this.name}} @onChange={{this.updateName}} />
</template>
```

```gjs
<template>
  <Input @value={{this.name}} @onChange={{fn (mut this "name")}} />
</template>
```

```gjs
<template>
  <CustomComponent @onChange={{this.handleChange}} />
</template>
```

## Migration

1. When used as a pure setter only, `mut` could be replaced by a JS action ("Option 1" below) or [ember-set-helper](https://github.com/pzuraq/ember-set-helper) ("Option 2" below):

Before:

```hbs
<MyComponent
  @closeDropdown={{action (mut this.setIsDropdownOpen) false}}
/>
```

After (Option 1 HBS):

```hbs
<MyComponent
  @closeDropdown={{action this.setIsDropdownOpen false}}
/>
```

After (Option 1 JS):

```js
@action
setIsDropdownOpen(isDropdownOpen) {
  set(this, 'isDropdownOpen', isDropdownOpen);
}
```

After (Option 2):

```hbs
<MyComponent
  @closeDropdown={{set this "isDropdownOpen" false}}
/>
```

\
2. When used as a pure getter only, `mut` could be removed:

Before:

```hbs
<MyComponent
  @isDropdownOpen={{mut this.isDropdownOpen}}
/>
```

After:

```hbs
<MyComponent
  @isDropdownOpen={{this.isDropdownOpen}}
/>
```

\
3. When `mut` is used as a getter and setter, `mut` could be replaced with a different namespace for the property and a dedicated action function to set the property: (Note: another other option could be to pull in the pick helper from [ember-composable-helpers](https://github.com/DockYard/ember-composable-helpers) and use it like [this](https://github.com/pzuraq/ember-set-helper#picking-values-with-ember-composable-helpers).) (Note: Another option could be to use [ember-box](https://github.com/pzuraq/ember-box)).

Before:

```hbs
{{#let (mut this.foo) as |foo|}}
  {{foo}}
  <input onchange={{action foo value=”target.value”}} />
{{/let}}
```

After HBS:

```hbs
{{this.foo}}
<input {{on “change” this.updateFoo}} />
```

After JS:

```js
@tracked
foo;

@action
updateFoo(evt) {
  this.foo = evt.target.value;
  // or set(this, ‘foo’, evt.target.value); for legacy Ember code
}
```

\
4. When `mut` is being passed into a built-in classic component that uses 2 way data binding, `mut` could be removed:

Before:

```hbs
<Input
  @value={{mut this.profile.description}}
/>
```

After:

```hbs
<Input
  @value={{this.profile.description}}
/>
```

## Options

| Name                | Type     | Default | Description                                                                   |
| ------------------- | -------- | ------- | ----------------------------------------------------------------------------- |
| `setterAlternative` | `string` |         | If provided, the error message suggests using this helper instead of `(mut)`. |

## Related Rules

- [no-mut-helper](./no-mut-helper.md)

## References

- [Ember Octane Guide - Two-way bindings](https://guides.emberjs.com/release/upgrading/current-edition/)
- [eslint-plugin-ember template-no-mut-helper](https://github.com/ember-cli/eslint-plugin-ember/blob/master/docs/rules/template-no-mut-helper.md)
