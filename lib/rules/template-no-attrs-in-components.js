const COMPONENT_TEMPLATE_REGEX = new RegExp(
  'templates/components|components/.*/template|ui/components|-components/'
);

/** @type {import('eslint').Rule.RuleModule} */
module.exports = {
  meta: {
    type: 'suggestion',
    docs: {
      description: 'disallow attrs in component templates',
      category: 'Deprecations',
      url: 'https://github.com/ember-cli/eslint-plugin-ember/tree/master/docs/rules/template-no-attrs-in-components.md',
      templateMode: 'loose',
    },
    schema: [],
    messages: {
      noAttrs: 'Component templates should not contain `attrs`.',
    },
    originallyFrom: {
      name: 'ember-template-lint',
      rule: 'lib/rules/no-attrs-in-components.js',
      docs: 'docs/rule/no-attrs-in-components.md',
      tests: 'test/unit/rules/no-attrs-in-components-test.js',
    },
  },
  create(context) {
    if (!COMPONENT_TEMPLATE_REGEX.test(context.filename)) {
      return {};
    }
    return {
      GlimmerPathExpression(node) {
        const original = node.original;
        if (typeof original !== 'string') {
          return;
        }
        // Flag bare `attrs` or `attrs.<something>` (pre-Octane args-leakage).
        // Do NOT flag `this.attrs.*` — that is a different (non-existent) API.
        if (original === 'attrs' || original.startsWith('attrs.')) {
          context.report({ node, messageId: 'noAttrs' });
        }
      },
    };
  },
};
