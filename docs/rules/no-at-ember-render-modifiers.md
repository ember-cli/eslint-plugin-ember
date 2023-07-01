# ember/no-at-ember-render-modifiers

<!-- end auto-generated rule header -->

What's wrong with `{{did-insert}}`, `{{did-update}}`, and `{{will-destroy}}`?

These modifiers were meant for temporary migration purposes for quickly migrating `@ember/component` from before Octane to the `@glimmer/component` we have today. Since `@ember/compoennt` implicitly had a wrapping `div` around each component and `@glimmer/compoennt`s have "outer HTML" semantics, an automated migration could have ended up looking something like:

```hbs
<div
  {{did-insert this.doInsertBehavior}}
  {{did-update this.doUpdateBehavior @arg1 @arg2}}
  {{will-destroy this.doDestroyBehavior}}
>
  ...
</div>
```

It was intended that this would be a temporary step to help get folks off of `@ember/components` quickly in early 2020 when folks migrated to the Octane editon, but some folks continued using these modifiers.

Additionally, this style of mananging data flow has some flaws:

- an element is required
  - this can be mitigated by using helpers, but they have the same problems mentioned below
- the behavior that is used with these modifiers can cause extra renders and infinite rendering loops
  - this is the nature of "effect"-driven development / data-flow, every time an effect runs, rendering must re-occur.
- behavior that needs to be co-located is spread out, making maintenance and debugging harder
  - each part of the responsibility of a "behavior" or "feature" is spread out, making it harder to find and comprehend the full picture of that behavior or feature.

## Examples

This rule **forbids** the following:

```js
import didInsert from '@ember/render-modifiers/modifiers/did-insert';
```

```js
import didUpdate from '@ember/render-modifiers/modifiers/did-update';
```

```js
import willDestroy from '@ember/render-modifiers/modifiers/will-destroy';
```

## References

- [Editions](https://emberjs.com/editions/)
- [Octane Upgrade Guide](https://guides.emberjs.com/release/upgrading/current-edition/)
- [Component Documentation](https://guides.emberjs.com/release/components/)
- [Avoiding Lifecycle in Component](https://nullvoxpopuli.com/avoiding-lifecycle)
- [The `ember-template-lint` version of this rule](https://github.com/ember-template-lint/ember-template-lint/blob/master/docs/rule/no-at-ember-render-modifiers.md)
- [`ember-modifier`](https://github.com/ember-modifier/ember-modifier)
- [`@ember/render-modifiers`](https://github.com/emberjs/ember-render-modifiers) (deprecated)
