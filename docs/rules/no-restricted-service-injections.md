# ember/no-restricted-service-injections

<!-- end auto-generated rule header -->

In some parts of your application, you may prefer to disallow certain services from being injected. This can be useful for:

- Deprecating services one folder at a time
- Creating isolation between different parts of your application

## Rule Details

This rule disallows injecting specified services under specified paths.

## Examples

With this example configuration:

```json
[
    "error",
    {
        "paths": ["folder1", "folder2", "folder3"],
        "services": ["deprecated-service"],
        "message": "Please stop using this service as it is in the process of being deprecated",
    },
    {
        "paths": ["isolated-folder"],
        "services": ["service-disallowed-for-use-in-isolated-folder"],
    },
    {
        "services": ["service-disallowed-anywhere"],
    },
]
```

This would be disallowed:

```js
// folder1/my-component.js

class MyComponent extends Component {
  @service deprecatedService;
}
```

## Configuration

Accepts an array of the objects with the following options:

<!-- begin auto-generated rule options list -->

| Name       | Description                                                                                                                                                                                                                                                                                                    | Type     | Required |
| :--------- | :------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | :------- | :------- |
| `message`  | Optional custom error message to display for violations.                                                                                                                                                                                                                                                       | String   |          |
| `paths`    | Optional list of regexp file paths that injecting the specified services should be disallowed under (omit this field to match any path) (for glob patterns, use [ESLint `overrides`](https://eslint.org/docs/latest/user-guide/configuring/configuration-files#configuration-based-on-glob-patterns) instead). | String[] |          |
| `services` | List of (kebab-case) service names that should be disallowed from being injected under the specified paths.                                                                                                                                                                                                    | String[] | Yes      |

<!-- end auto-generated rule options list -->

## Related Rules

- The [no-restricted-imports](https://eslint.org/docs/rules/no-restricted-imports) or [import/no-restricted-paths](https://github.com/benmosher/eslint-plugin-import/blob/master/docs/rules/no-restricted-paths.md) rules are the JavaScript import statement equivalent of this rule.
- ember-template-lint has a [no-restricted-invocations](https://github.com/ember-template-lint/ember-template-lint/blob/master/docs/rule/no-restricted-invocations.md) rule for disallowing component usages.
