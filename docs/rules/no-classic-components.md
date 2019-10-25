# No classic components (no-classic-components)

This rule aims to enforce Glimmer components instead of classic ones. We should migrate to Glimmer components because
they have few adventages:
- Simpler API
- No wrapper element
- Namespaced Arguments
- Less lifecycle hooks
- Stateless Template-Only Components
- Unidirectional Dataflow

With that simpler API we could improve the DX and also lower the entry level for Ember.

## Rule Details

If you want to migrate to Glimmer components this rule can help find the classic components that you need to migrate.

Examples of **incorrect** code for this rule:

```js

import Component from '@ember/component';

```

Examples of **correct** code for this rule:

```js

import Component from '@glimmer/component';

```

## References

* [Ember 3.13 Release Notes](https://blog.emberjs.com/2019/09/25/ember-3-13-released.html)
* [Ember Glimmer Components RFC](https://github.com/emberjs/rfcs/blob/master/text/0416-glimmer-components.md)
* [Ember Octane Release Plan](https://blog.emberjs.com/2019/08/15/octane-release-plan.html)
* [Glimmer Components Explained](https://www.pzuraq.com/coming-soon-in-ember-octane-part-5-glimmer-components/)
