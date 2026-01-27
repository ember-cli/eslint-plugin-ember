# ember/template-no-route-action

> **HBS Only**: This rule applies to classic `.hbs` template files only (loose mode). It is not relevant for `gjs`/`gts` files (strict mode), where these patterns cannot occur.

<!-- end auto-generated rule header -->

Disallows the use of the `{{route-action}}` helper.

[ember-route-action-helper](https://github.com/DockYard/ember-route-action-helper) was a popular addon used to add actions to a route without creating a separate controller. Given the changes in Ember since ember-route-action-helper was a widely used pattern, controllers are now encouraged and we want to discourage the use of route-action.

Most route actions should either be sent to the controller first or encapsulated within a downstream component instead. We should never be escaping the DDAU hierarchy to lob actions up to the route.

## Examples

Examples of **incorrect** code for this rule:

```hbs
<CustomComponent @onUpdate={{route-action 'updateFoo'}} />
```

```hbs
<CustomComponent @onUpdate={{route-action 'updateFoo' 'bar'}} />
```

```hbs
{{custom-component onUpdate=(route-action 'updateFoo')}}
```

```hbs
{{custom-component onUpdate=(route-action 'updateFoo' 'bar')}}
```

```hbs
{{route-action 'save'}}
```

```hbs
<button {{on 'click' (route-action 'save')}}>Save</button>
```

Examples of **correct** code for this rule:

```hbs
<CustomComponent @onUpdate={{this.updateFoo}} />
```

```hbs
<CustomComponent @onUpdate={{fn this.updateFoo 'bar'}} />
```

```hbs
{{custom-component onUpdate=this.updateFoo}}
```

```hbs
{{custom-component onUpdate=(fn this.updateFoo 'bar')}}
```

```hbs
<button {{on 'click' (fn this.save)}}>Save</button>
```

```hbs
<button {{on 'click' this.handleClick}}>Click</button>
```

## Migration

The example below shows how to migrate from route-action to controller actions.

### Before

```js
// app/routes/posts.js
export default class extends Route {
  model(params) {
    return this.store.query('post', { page: params.page });
  }

  @action
  goToPage(pageNum) {
    this.transitionTo({ queryParams: { page: pageNum } });
  }
}
```

```js
// app/controllers/posts.js
export default class extends Controller {
  queryParams = ['page'];
  page = 1;
}
```

```hbs
{{#each @model as |post|}}
  <Post @title={{post.title}} @content={{post.content}} />
{{/each}}

<button {{action (route-action 'goToPage' 1)}}>1</button>
<button {{action (route-action 'goToPage' 2)}}>2</button>
<button {{action (route-action 'goToPage' 3)}}>3</button>
```

### After

```js
// app/routes/posts.js
export default class extends Route {
  model(params) {
    return this.store.query('post', { page: params.page });
  }
}
```

```js
// app/controllers/posts.js
export default class extends Controller {
  queryParams = ['page'];
  page = 1;

  @action
  goToPage(pageNum) {
    this.transitionToRoute({ queryParams: { page: pageNum } });
  }
}
```

```hbs
{{#each @model as |post|}}
  <Post @title={{post.title}} @content={{post.content}} />
{{/each}}

<button {{on 'click' (fn this.goToPage 1)}}>1</button>
<button {{on 'click' (fn this.goToPage 2)}}>2</button>
<button {{on 'click' (fn this.goToPage 3)}}>3</button>
```

## References

- [ember-route-action-helper](https://github.com/DockYard/ember-route-action-helper)
- [Ember guides/Controllers](https://guides.emberjs.com/release/routing/controllers/)
- [Ember Best Practices: What are controllers good for?](https://dockyard.com/blog/2017/06/16/ember-best-practices-what-are-controllers-good-for)
- [Ember.js Guides - Actions](https://guides.emberjs.com/release/components/component-state-and-actions/)
