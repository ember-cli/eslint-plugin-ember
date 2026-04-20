# ember/template-no-triple-curlies

💼 This rule is enabled in the 📋 `template-lint-migration` [config](https://github.com/ember-cli/eslint-plugin-ember#-configurations).

<!-- end auto-generated rule header -->

Usage of triple curly braces to allow raw HTML to be injected into the DOM is a large vector for exploits of your application (especially when the raw HTML is user-controllable). Instead of using `{{{foo}}}`, you should use appropriate helpers or computed properties that return a `SafeString` (via `Ember.String.htmlSafe` generally) and ensure that user-supplied data is properly escaped.

## Examples

This rule **forbids** the following:

```gjs
<template>
  {{{foo}}}
</template>
```

This rule **allows** the following:

```gjs
<template>
  {{foo}}
</template>
```

## References

- See the [documentation](https://api.emberjs.com/ember/release/functions/@ember%2Ftemplate/htmlSafe) for Ember's `htmlSafe` function
