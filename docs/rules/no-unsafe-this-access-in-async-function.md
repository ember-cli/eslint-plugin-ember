# no-unsafe-this-access-in-async-function

🔧 The `--fix` option on the [command line](https://eslint.org/docs/user-guide/command-line-interface#fixing-problems) can automatically fix some of the problems reported by this rule.

With async behaviors, accessing `this` after an `await` may be unsafe. For example, an unsafe `this`-access situation may occur if a component is torn down before an async function runs to completion. When the function resumes execution, if the component is already torn down, `this` may be undefined. This also comes up in testing where the whole application is torn down and a function may try to access other framework objects, which will be unavailable when the application is torn down.

## Rule Details

TODO: what the rule does goes here

## Examples

Examples of **incorrect** code for this rule:

```js
// TODO: Example 1
```

```js
// TODO: Example 2
```

Examples of **correct** code for this rule:

```js
// TODO: Example 1
```

```js
// TODO: Example 2
```

## Migration

TODO: suggest any fast/automated techniques for fixing violations in a large codebase

* TODO: suggestion on how to fix violations using find-and-replace / regexp
* TODO: suggestion on how to fix violations using a codemod

## Related Rules

* [TODO-related-rule-name1](related-rule-name1.md)
* [TODO-related-rule-name2](related-rule-name2.md)

## References

* TODO: link to relevant documentation goes here)
* TODO: link to relevant function spec goes here
* TODO: link to relevant guide goes here
