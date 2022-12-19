# ember/no-runloop

<!-- end auto-generated rule header -->

Ember's runloop functions are not lifecycle-aware and don't ensure that an object's async is cleaned up. It is recommended to use [`ember-lifeline`](https://ember-lifeline.github.io/ember-lifeline/), [`ember-concurrency`](http://ember-concurrency.com/docs/introduction/), or [`@ember/destroyable`](https://rfcs.emberjs.com/id/0580-destroyables/) instead.

## Rule Details

This rule disallows usage of `@ember/runloop` functions.

## Examples

Example of **incorrect** code for this rule:

```js
import Component from '@glimmer/component';
import { run } from '@ember/runloop';

export default class MyComponent extends Component {
  constructor() {
    super(...arguments);

    run.later(() => {
      this.set('date', new Date());
    }, 500);
  }
}
```

Example of **correct** code for this rule using `ember-lifeline`:

```js
import Component from '@glimmer/component';
import { runTask, runDisposables } from 'ember-lifeline';

export default class MyComponent extends Component {
  constructor(...args) {
    super(...args);

    runTask(
      this,
      () => {
        this.set('date', new Date());
      },
      500
    );
  }

  willDestroy(...args) {
    super.willDestroy(...args);

    runDisposables(this);
  }
}
```

## Configuration

If you have `@ember/runloop` functions that you wish to allow, you can configure this rule to allow specific methods. The configuration takes an object with the `allowList` property, which is an array of strings where the strings must be names of runloop functions.

```js
module.exports = {
  rules: {
    'ember/no-runloop': [
      'error',
      {
        allowList: ['debounce', 'begin', 'end'],
      },
    ],
  },
};
```

## References

- [require-lifeline](https://github.com/ember-best-practices/eslint-plugin-ember-best-practices/blob/master/guides/rules/require-ember-lifeline.md) - a rule that was originally implemented in eslint-plugin-ember-best-practices
