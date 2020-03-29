# no-attrs-in-components

Do not use `this.attrs`.

In the run-up to Ember 2.0, several blog articles were written about using `this.attrs` but this feature has never been documented as a public API. Typically people use `attrs` to denote properties and methods as having been "passed" in to a component and bare names as properties local to the component. This is useful and some iteration of Ember will have this built into the programming model, but for now we should not use `attrs`.

In JavaScript we typically prefix "private" things with `_`. If you want to create this notion in a component, we can leverage this long standing convention. Things that are local are technically private as a component's scope is isolated so marking them with `_` makes sense semantically. Passed items can use the bare name, as they are effectively public/protected methods and properties.

## Examples

Examples of **incorrect** code for this rule:

```js
const name = this.attrs.name;
```

Examples of **correct** code for this rule:

```js
// Prefix private properties with _
const name = this._name;
```

## Further Reading

* <https://locks.svbtle.com/to-attrs-or-not-to-attrs>
