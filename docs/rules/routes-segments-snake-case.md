# ember/routes-segments-snake-case

💼 This rule is enabled in the ✅ `recommended` [config](https://github.com/ember-cli/eslint-plugin-ember#-configurations).

<!-- end auto-generated rule header -->

Dynamic segments in routes should use _snake case_, so Ember doesn't have to do extra serialization in order to resolve promises.

## Examples

Examples of **incorrect** code for this rule:

```js
this.route('tree', { path: ':treeId' });
```

Examples of **correct** code for this rule:

```js
this.route('tree', { path: ':tree_id' });
```

## References

- [Ember Routing Guide](https://guides.emberjs.com/release/routing/)

## Related Rules

- [no-capital-letters-in-routes](no-capital-letters-in-routes.md)
- [no-unnecessary-route-path-option](no-unnecessary-route-path-option.md)
- [route-path-style](route-path-style.md)
