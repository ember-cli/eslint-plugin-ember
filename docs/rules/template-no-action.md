# ember/template-no-action

> **HBS Only**: This rule applies to classic `.hbs` template files only (loose mode). It is not relevant for `gjs`/`gts` files (strict mode), where these patterns cannot occur.

<!-- end auto-generated rule header -->

Disallows the use of `{{action}}` helper.

"Action" is an overloaded term in Ember. Actions are methods on the `actions` hash, element modifiers that set up event handlers, partial-applied functions, and something we both pass downward and send back up. They have served many different purposes over the years, which makes them difficult to learn, teach, and repurpose.

```hbs
<button {{action 'increment' 5}}>Click</button>
<button {{action this.increment 5}}>Click</button>
<button onclick={{action 'increment' 5}}>Click</button>
<button onclick={{action this.increment 5}}>Click</button>
<button {{action (action 'increment' 5)}}>Click</button>
<button {{action (action this.increment 5)}}>Click</button>
```

The `{{action}}` helper is deprecated in favor of the `{{on}}` modifier and `{{fn}}` helper, which provide better performance and clearer intent.

## Examples

Examples of **incorrect** code for this rule:

```hbs
<button onclick={{action 'foo'}}></button>
```

```hbs
<button {{action 'submit'}}>Submit</button>
```

```hbs
<FooBar @baz={{action 'submit'}} />
```

```hbs
{{yield (action 'foo')}}
```

```hbs
{{yield (action this.foo)}}
```

```hbs
<button {{on 'click' (action 'save')}}>Save</button>
```

```hbs
{{action 'doSomething'}}
```

Examples of **correct** code for this rule:

```hbs
<button {{on 'submit' @action}}>Click Me</button>
```

```hbs
<button {{on 'submit' this.action}}>Click Me</button>
```

```hbs
<button {{on 'click' this.save}}>Save</button>
```

```hbs
<button {{on 'click' (fn this.save 'arg')}}>Save with arg</button>
```

```hbs
{{this.action}}
```

## Migration

```hbs
<select onchange={{action this.updateSelection this.options}}>
  {{#each this.options as |opt|}}
    <option>{{opt.value}}</option>
  {{/each}}
</select>
```

to

```hbs
<select {{on 'change' (fn this.updateSelection this.options)}}>
  {{#each this.options as |opt|}}
    <option>{{opt.value}}</option>
  {{/each}}
</select>
```

```hbs
<MyComponent @onValidationChange={{action 'onDateValidation'}} />
```

to

```hbs
<MyComponent @onValidationChange={{this.onDateValidation}} />
```

## Related Rules

- [no-action-modifiers](template-no-action-modifiers.md)
- [no-element-event-actions](template-no-element-event-actions.md)
- [no-mut-helper](template-no-mut-helper.md)

## References

- [Ember Octane Update: What's up with `@action`?](https://www.pzuraq.com/blog/ember-octane-update-action/)
- [RFC-471 `on` modifier](https://github.com/emberjs/rfcs/blob/master/text/0471-on-modifier.md)
- [RFC-470 `fn` helper](https://github.com/emberjs/rfcs/blob/master/text/0470-fn-helper.md)
- [Ember.js Deprecations - action helper](https://deprecations.emberjs.com/v3.x/#toc_action-helper)
- [Ember Modifier Documentation](https://guides.emberjs.com/release/components/template-lifecycle-dom-and-modifiers/)
