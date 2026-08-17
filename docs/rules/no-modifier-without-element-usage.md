# ember/no-modifier-without-element-usage

<!-- end auto-generated rule header -->

Disallow modifiers that never use their element.

A modifier exists to give an element behavior that only the DOM node can provide: event listeners, focus, measurement, or handing the node to a third-party library. A modifier that ignores its element has historically caused infinite render loops, and lead to confusion.

## Rule Details

This rule reports a modifier whose element is never referenced.

Both modifier function and class styles from `ember-modifier` are checked.

## Examples

Examples of **incorrect** code for this rule:

```js
import { modifier } from 'ember-modifier';

// The element is never used
modifier((element, positional) => {
  trackEvent(positional[0]);
});
```

```js
import { modifier } from 'ember-modifier';

// No element parameter at all
modifier(() => {
  trackEvent('rendered');
});
```

```js
import Modifier from 'ember-modifier';

// A class modifier that ignores its element
export default class Track extends Modifier {
  modify(element, [name]) {
    trackEvent(name);
  }
}
```

Examples of **correct** code for this rule:

```js
import { modifier } from 'ember-modifier';

modifier((element) => {
  element.focus();
});
```

```js
import { modifier } from 'ember-modifier';

// Passing the element along counts as usage
modifier((element, positional) => {
  const chart = new Chart(element, positional[0]);

  return () => chart.destroy();
});
```

```js
import Modifier from 'ember-modifier';

export default class Track extends Modifier {
  modify(element, [name]) {
    element.dataset.trackedAs = name;
  }
}
```

## Migration

A modifier that does not use its element usually wants one of these instead:

- derived state, so the value is computed where it is read rather than pushed on render
- a resource, for behavior with setup and teardown that is not tied to an element
- an event handler on the element that already triggers the behavior

## Related Rules

- [no-at-ember-render-modifiers](no-at-ember-render-modifiers.md)
- [template-no-at-ember-render-modifiers](template-no-at-ember-render-modifiers.md)
- [no-modifier-argument-destructuring](no-modifier-argument-destructuring.md)

## References

- [ember-modifier](https://github.com/ember-modifier/ember-modifier)
- [Ember Autotracking](https://guides.emberjs.com/release/in-depth-topics/autotracking-in-depth/)
