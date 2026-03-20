# ember/template-require-each-key

🔧 This rule is automatically fixable by the [`--fix` CLI option](https://eslint.org/docs/latest/user-guide/command-line-interface#--fix).

<!-- end auto-generated rule header -->

In order to improve rendering speed, Ember will try to reuse the DOM elements where possible. Specifically, if the same item is present in the array both before and after the change, its DOM output will be reused.

The key option is used to tell Ember how to determine if the items in the array being iterated over with `{{#each}}` has changed between renders. By default the item's object identity is used.

This is usually sufficient, so in most cases, the key option is simply not needed. However, in some rare cases, the objects' identities may change even though they represent the same underlying data.

For example:

```js
people.map((person) => {
  return { ...person, type: 'developer' };
});
```

In this case, each time the people array is map-ed over, it will produce an new array with completely different objects between renders. In these cases, you can help Ember determine how these objects related to each other with the key option:

```gjs
<template>
  <ul>
    {{#each @developers key='name' as |person|}}
      <li>Hello, {{person.name}}!</li>
    {{/each}}
  </ul>
</template>
```

By doing so, Ember will use the value of the property specified (`person.name` in the example) to find a "match" from the previous render. That is, if Ember has previously seen an object from the `@developers` array with a matching name, its DOM elements will be re-used.

This rule will require to always use `key` with `{{#each}}`.

## Examples

This rule **forbids** the following:

```gjs
<template>
  {{#each this.items as |item|}}
    <div>{{item.name}}</div>
  {{/each}}
</template>
```

```gjs
<template>
  {{#each this.items key='@invalid' as |item|}}
    <div>{{item.name}}</div>
  {{/each}}
</template>
```

```gjs
<template>
  {{#each this.items key='' as |item|}}
    <div>{{item.name}}</div>
  {{/each}}
</template>
```

This rule **allows** the following:

```gjs
<template>
  {{#each this.items key='id' as |item|}}
    <div>{{item.name}}</div>
  {{/each}}
</template>
```

```gjs
<template>
  {{#each this.items key='deeply.nested.id' as |item|}}
    <div>{{item.name}}</div>
  {{/each}}
</template>
```

```gjs
<template>
  {{#each this.items key='@index' as |item|}}
    <div>{{item.name}}</div>
  {{/each}}
</template>
```

```gjs
<template>
  {{#each this.items key='@identity' as |item|}}
    <div>{{item.name}}</div>
  {{/each}}
</template>
```

## References

- [Specifying Keys](https://api.emberjs.com/ember/release/classes/Ember.Templates.helpers/methods/each#specifying-keys)
- [The Immutable Pattern in Tracked Properties](https://guides.emberjs.com/release/in-depth-topics/autotracking-in-depth/)
