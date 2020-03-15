# no-unnecessary-service-injection-argument

:wrench: The `--fix` option on the [command line](https://eslint.org/docs/user-guide/command-line-interface#fixing-problems) can automatically fix some of the problems reported by this rule.

Disallow unnecessary argument when injecting service.

It's not necessary to specify an injected service's name as an argument when the property name matches the service name.

## Examples

Examples of **incorrect** code for this rule:

```js
import Component from '@ember/component';
import { inject as service } from '@ember/service';

export default Component.extend({
  myServiceName: service('myServiceName')
});
```

Examples of **correct** code for this rule:

```js
export default Component.extend({
  myServiceName: service()
});
```

```js
export default Component.extend({
  myServiceName: service('my-service-name')
});
```

```js
export default Component.extend({
  otherSpecialName: service('my-service-name')
});
```

## References

* Ember [Services](https://guides.emberjs.com/release/applications/services/) guide
* Ember [inject](https://emberjs.com/api/ember/release/functions/@ember%2Fservice/inject) function spec

## Help Wanted

| Issue | Link |
| :-- | :-- |
| :x: Missing native JavaScript class support | [#560](https://github.com/ember-cli/eslint-plugin-ember/issues/560) |
