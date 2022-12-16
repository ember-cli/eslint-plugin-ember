# ember/no-tracked-properties-from-args

<!-- end auto-generated rule header -->

Disallow creation of @tracked properties from args.

## Rule Details

This rule disallows the creation of using @tracked properties directly from `this.args`. The @tracked value will not be updated when the args change, which is almost never what you want.

## Examples

Examples of **incorrect** code for this rule:

```js
@tracked invalid = this.args.someValue;
```

## References

- [Glimmer Components - args](https://guides.emberjs.com/release/upgrading/current-edition/glimmer-components/#toc_getting-used-to-glimmer-components) guide
- [tracked](https://guides.emberjs.com/release/in-depth-topics/autotracking-in-depth/) guide
