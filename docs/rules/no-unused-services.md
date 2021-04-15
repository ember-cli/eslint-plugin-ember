# no-unused-services

Disallow unused service injections.

By removing unused service injections, we can reduce the amount of code we have and improve code readability.

**Note**: This rule cannot detect service usage in the corresponding handlebars template file for a JavaScript class, which can thus cause the rule to exhibit false positives.

## Examples

Examples of **incorrect** code for this rule:

```js
import Component from '@glimmer/component';

export default class MyComponent extends Component {
  @service() myService;

  // myService is not referenced below at all
}
```

Examples of **correct** code for this rule:

```js
import Component from '@glimmer/component';

export default class MyComponent extends Component {
  @service() myService;

  get someProperty() {
    return this.myService.getSomething(); // using the injected service
  }
}
```

## References

- Ember [Services](https://guides.emberjs.com/release/applications/services/) guide
- Ember [inject](https://emberjs.com/api/ember/release/functions/@ember%2Fservice/inject) function spec
