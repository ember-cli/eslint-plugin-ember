# no-unused-services

Disallow unused service injections.

By removing unused service injections, we can reduce the amount of code we have and improve code readability.

**Warning**: This rule can exhibit false positives when an injected service is only used in:

- The corresponding handlebars template file for a controller or component
- A mixin or parent class that the current class extends from
- A child class that extends from the current class

Given these significant limitations, the rule is not currently recommended for production usage, but some may find it useful to experiment with. The rule will not be added to the `recommended` configuration unless the limitations can be addressed.

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
