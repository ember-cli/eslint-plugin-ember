# ember/no-implicit-service-injection-argument

🔧 This rule is automatically fixable by the [`--fix` CLI option](https://eslint.org/docs/latest/user-guide/command-line-interface#--fix).

<!-- end auto-generated rule header -->

This rule disallows omitting the service name argument when injecting a service. Instead, the filename of the service should be used (i.e. `service-name` when the service lives at `app/services/service-name.js`).

Some developers may prefer to be more explicit about what service is being injected instead of relying on the implicit and potentially costly lookup/normalization of the service from the property name.

Note: this rule is not in the `recommended` configuration because it is somewhat of a stylistic preference and it's not always necessary to explicitly include the service injection argument.

## Examples

Examples of **incorrect** code for this rule:

```js
import Component from '@ember/component';
import { inject as service } from '@ember/service';

export default class Page extends Component {
  @service() serviceName;
}
```

Examples of **correct** code for this rule:

```js
import Component from '@ember/component';
import { inject as service } from '@ember/service';

export default class Page extends Component {
  @service('service-name') serviceName;
}
```

## Related Rules

- [no-unnecessary-service-injection-argument](https://github.com/ember-cli/eslint-plugin-ember/blob/master/docs/rules/no-unnecessary-service-injection-argument.md) is the opposite of this rule

## References

- Ember [Services](https://guides.emberjs.com/release/applications/services/) guide
- Ember [inject](https://api.emberjs.com/ember/release/functions/@ember%2Fservice/inject) function spec
