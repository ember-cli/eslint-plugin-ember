# ember/template-block-indentation

<!-- end auto-generated rule header -->

Migrated from [ember-template-lint/block-indentation](https://github.com/ember-template-lint/ember-template-lint/blob/master/docs/rule/block-indentation.md).

## Rule Details

Forces valid indentation for blocks and their children.

1. Forces block begin and block end statements to be at the same indentation level, when not on one line.
2. Forces children of all blocks to start at a single indentation level deeper.

## Configuration

<!-- begin auto-generated rule options list -->

| Name             | Type    |
| :--------------- | :------ |
| `ignoreComments` | Boolean |
| `indentation`    | Integer |

<!-- end auto-generated rule options list -->

## Examples

Examples of **incorrect** code for this rule:

```hbs
{{#each foo as |bar|}}{{/each}}
```

```hbs
<div>
  <p>{{t 'greeting'}}</p>
</div>
```

```hbs
<div>
  <p>{{t 'Stuff here!'}}</p>
</div>
```

Examples of **correct** code for this rule:

```hbs
{{#each foo as |bar|}}
  {{bar.name}}
{{/each}}
```

```hbs
<div>
  <p>{{t 'greeting'}}</p>
</div>
```

## Options

- Integer (e.g., `2`, `4`): Number of spaces for indentation.
- `"tab"`: Use tab-style indentation (1 character).
- Object:
  - `indentation` (integer, default `2`): Number of spaces to indent.
  - `ignoreComments` (boolean, default `false`): Skip indentation checking for comments.

When no option is specified, the rule reads `indent_size` from .editorconfig (if present).
If no .editorconfig is found, the default is `2` spaces.
