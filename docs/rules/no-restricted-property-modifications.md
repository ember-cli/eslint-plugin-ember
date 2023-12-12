# ember/no-restricted-property-modifications

🔧 This rule is automatically fixable by the [`--fix` CLI option](https://eslint.org/docs/latest/user-guide/command-line-interface#--fix).

<!-- end auto-generated rule header -->

There are some properties, especially globally-injected ones, that you may want to treat as read-only, and ensure that no one modifies them.

## Rule Details

This rule prevents modifying the specified properties.

It also disallows using computed property macros like `alias` and `reads` that enable the specified properties to be indirectly modified.

## Examples

All examples assume a configuration of `properties: ['currentUser']`.

Examples of **incorrect** code for this rule:

```js
import Component from '@ember/component';
import { alias, reads } from '@ember/object/computed';

export default class MyComponent extends Component {
  @alias('currentUser') aliasForCurrentUser1; // Not allowed
  @reads('currentUser') aliasForCurrentUser2; // Not allowed

  @alias('currentUser.somePermission1') somePermission1; // Not allowed
  @reads('currentUser.somePermission2') somePermission2; // Not allowed

  myFunction() {
    this.set('currentUser', {}); // Not allowed
    this.set('currentUser.somePermission', true); // Not allowed

    this.currentUser = {}; // Not allowed
    this.currentUser.somePermission = true; // Not allowed
  }
}
```

Examples of **correct** code for this rule:

```js
import Component from '@ember/component';
import { readOnly } from '@ember/object/computed';

export default class MyComponent extends Component {
  @readOnly('currentUser.somePermission') somePermission; // Allowed

  myFunction() {
    console.log(this.currentUser.somePermission); // Allowed
  }
}
```

## Configuration

<!-- begin auto-generated rule options list -->

| Name         | Description                                                                                                                    | Type     | Required |
| :----------- | :----------------------------------------------------------------------------------------------------------------------------- | :------- | :------- |
| `properties` | Array of names of properties that should not be modified (modifying child/nested/sub-properties of these is also not allowed). | String[] | Yes      |

<!-- end auto-generated rule options list -->

Not yet implemented: There is currently no way to configure whether sub-properties are restricted from modification. To make this configurable, the `properties` array option could be updated to also accept objects of the form `{ name: 'myPropertyName', includeSubProperties: false }` where `includeSubProperties` defaults to `true`.
