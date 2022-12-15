# ember/no-decorators-before-export

<!-- end auto-generated rule header -->

It makes code more readable if the model has the same name as a subject.

## Background

In the very first  TC39 proposal for decorators, a syntax option was considered to allow the following:

```ts
import classic from 'ember-classic-decorators';
import Component from '@ember/component';

@classic
export default class MyComponent extends Component {}
```

However, in the various specs that followed, including in the current proposal that is stage-3, this syntax was explicitly disallowed. The problem it causes is a little more apparent when considering it as a function and placing everything on one line:

```ts
@classic export default class MyComponent extends Component {}
```

The correct way to specify decorators is onto the class itself prior to exporting the class. This mechanism works with the version of decorators which Ember adopted, and is the positioning the stage-3 spec adopted as well.

```ts
import classic from 'ember-classic-decorators';
import Component from '@ember/component';

@classic
class MyComponent extends Component {}

export default MyComponent;
```

Unfortunately, in order to maximize compatibility with existing decorators, the second rendition of the spec - the rendition of the spec which Ember adopted (there have been four) - allowed this syntax to still be used if using the babel plugin AND also explicitly allowing it in the plugin config. Ember chose to be maximally capatible and enabled this option.

This can create problems:

1) being non-spec, non-babel parsers do not support it. This means codemods using jscodeshift, rollup using acorn, and any number of other tools or code compilers error when they encounter these files.

2) its easy for transpilation to go very wrong if custom babel transforms do not account for this case.

3) The babel transform for decorators never included support for applying them to unnamed default exports.

Considering that this syntax was non-spec even at the point that ember adopted decorators, and considering that the correct approach works as expected, we lint against the non-standard approach.

## Examples

**Good**

```ts
import classic from 'ember-classic-decorators';
import Component from '@ember/component';

@classic
class MyComponent extends Component {}

export default MyComponent;
```

```ts
import classic from 'ember-classic-decorators';
import EmberObject from '@ember/object';

@classic
class MyKlass extends EmberObject {}

export { MyKlass };
```

**Bad**

```ts
import classic from 'ember-classic-decorators';
import Component from '@ember/component';

@classic
export default class extends Component {}
```

```ts
import classic from 'ember-classic-decorators';
import Component from '@ember/component';

@classic
export default class MyComponent extends Component {}
```

```ts
import classic from 'ember-classic-decorators';
import EmberObject from '@ember/object';

@classic
export class MyKlass extends EmberObject {}
```
