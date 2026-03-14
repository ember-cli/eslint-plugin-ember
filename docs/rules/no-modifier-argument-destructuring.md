# ember/no-modifier-argument-destructuring

<!-- end auto-generated rule header -->

Disallow destructuring of `modifier` arguments to avoid consuming tracked data too early.

## Rule Details

When using `ember-modifier`, destructuring the positional or named arguments of the modifier callback eagerly consumes tracked data. This can lead to backtracking re-render assertions when the tracked data is not actually needed until later (e.g., inside an event listener).

Instead, access the arguments by index (for positional) or property (for named) inside the callback body where the data is actually needed.

## Examples

Examples of **incorrect** code for this rule:

```js
import { modifier } from 'ember-modifier';

// Destructuring positional args
modifier((element, [text]) => {
  element.addEventListener('hover', () => console.log(text));
});
```

```js
import { modifier } from 'ember-modifier';

// Destructuring named args
modifier((element, positional, { title }) => {
  element.addEventListener('hover', () => console.log(title));
});
```

Examples of **correct** code for this rule:

```js
import { modifier } from 'ember-modifier';

// Access positional args by index
modifier((element, positional) => {
  element.addEventListener('hover', () => console.log(positional[0]));
});
```

```js
import { modifier } from 'ember-modifier';

// Access named args by property
modifier((element, positional, named) => {
  element.addEventListener('hover', () => console.log(named.title));
});
```

## References

- [ember-modifier](https://github.com/ember-modifier/ember-modifier)
- [Ember Autotracking](https://guides.emberjs.com/release/in-depth-topics/autotracking-in-depth/)
