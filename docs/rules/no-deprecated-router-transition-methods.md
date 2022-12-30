# ember/no-deprecated-router-transition-methods

🔧 This rule is automatically fixable by the [`--fix` CLI option](https://eslint.org/docs/latest/user-guide/command-line-interface#--fix).

<!-- end auto-generated rule header -->

Ember 3.26 introduced a deprecation for using `transitionTo` and `replaceWith` in Routes or `transitionToRoute` and `replaceRoute` in Controllers. These methods should be replaced with an injected router service and calls to `this.router.transitionTo` and `this.router.replaceWith` instead.

## Rule Details

This rule checks for uses of `transitionTo` and `replaceWith` in Routes or `transitionToRoute` and `replaceRoute` in Controllers.

## Examples

Examples of **incorrect** code for this rule:

```js
// app/routes/settings.js
import Route from '@ember/routing/route';
import { inject as service } from '@ember/service';

export default class SettingsRoute extends Route {
  @service session;

  beforeModel() {
    if (!this.session.isAuthenticated) {
      this.transitionTo('login');
    }
  }
}
```

```js
// app/controllers/new-post.js
import Controller from '@ember/controller';
import { action } from '@ember/object';

export default class NewPostController extends Controller {
  @action
  async save({ title, text }) {
    const post = this.store.createRecord('post', { title, text });
    await post.save();
    return this.transitionToRoute('post', post.id);
  }
}
```

Examples of **correct** code for this rule:

```js
// app/routes/settings.js
import Route from '@ember/routing/route';
import { inject as service } from '@ember/service';

export default class SettingsRoute extends Route {
  @service('router') router;
  @service('session') session;

  beforeModel() {
    if (!this.session.isAuthenticated) {
      this.router.transitionTo('login');
    }
  }
}
```

```js
// app/controllers/new-post.js
import Controller from '@ember/controller';
import { action } from '@ember/object';
import { inject as service } from '@ember/service';

export default class NewPostController extends Controller {
  @service('router') router;

  @action
  async save({ title, text }) {
    const post = this.store.createRecord('post', { title, text });
    await post.save();
    return this.router.transitionTo('post', post.id);
  }
}
```

## Migration

The autofixer for this rule will update method calls to use the router service, and will inject the router service as needed.

## References

- [Deprecation](https://deprecations.emberjs.com/v3.x/#toc_routing-transition-methods)
- [Router Service](https://api.emberjs.com/ember/release/classes/RouterService)
