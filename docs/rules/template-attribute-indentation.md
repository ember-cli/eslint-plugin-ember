# ember/template-attribute-indentation

<!-- end auto-generated rule header -->

Migrated from [ember-template-lint/attribute-indentation](https://github.com/ember-template-lint/ember-template-lint/blob/master/docs/rule/attribute-indentation.md).

## Rule Details

This rule requires the positional params, attributes, and block params of helpers/components to be indented by moving them to multiple lines when the open invocation has more than 80 characters (configurable).

## Configuration

<!-- begin auto-generated rule options list -->

| Name                      | Type    | Choices                      |
| :------------------------ | :------ | :--------------------------- |
| `as-indentation`          |         | `attribute`, `closing-brace` |
| `element-open-end`        |         | `new-line`, `last-attribute` |
| `indentation`             | Integer |                              |
| `mustache-open-end`       |         | `new-line`, `last-attribute` |
| `open-invocation-max-len` | Integer |                              |
| `process-elements`        | Boolean |                              |

<!-- end auto-generated rule options list -->

## Examples

Examples of **incorrect** code for this rule:

Non-block form (> 80 characters):

```hbs
{{employee-details firstName=firstName lastName=lastName age=age avatarUrl=avatarUrl}}
```

Block form (> 80 characters):

```hbs
{{#employee-details
  firstName=firstName lastName=lastName age=age avatarUrl=avatarUrl
  as |employee|
}}
  {{employee.fullName}}
{{/employee-details}}
```

HTML element (> 80 characters):

```hbs
<input disabled id='firstName' value={{firstName}} class='input-field first-name' type='text' />
```

Examples of **correct** code for this rule:

Non-block form (attributes on separate lines):

```hbs
{{employee-details firstName=firstName lastName=lastName age=age avatarUrl=avatarUrl}}
```

Block form (attributes on separate lines):

```hbs
{{#employee-details
  firstName=firstName lastName=lastName age=age avatarUrl=avatarUrl
  as |employee|
}}
  {{employee.fullName}}
{{/employee-details}}
```

HTML element (attributes on separate lines):

```hbs
<input disabled id='firstName' value={{firstName}} class='input-field first-name' type='text' />
```

Short invocations (< 80 characters) are allowed on a single line:

```hbs
{{employee-details firstName=firstName lastName=lastName}}
```

## Options

- `open-invocation-max-len` (integer, default `80`): Maximum length of the opening invocation before attributes must be on separate lines.
- `indentation` (integer, default `2`): Number of spaces for attribute indentation.
- `process-elements` (boolean, default `true`): Also validate indentation of HTML/SVG element attributes.
- `element-open-end` (`"new-line"` | `"last-attribute"`, default `"new-line"`): Position of the closing `>` bracket.
- `mustache-open-end` (`"new-line"` | `"last-attribute"`, default `"new-line"`): Position of the closing `}}` braces.
- `as-indentation` (`"attribute"` | `"closing-brace"`, default `"closing-brace"`): Position of `as |param|` block params relative to attributes or closing brace.
