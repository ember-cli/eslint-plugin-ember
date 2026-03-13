/** @type {import('eslint').Rule.RuleModule} */
module.exports = {
  meta: {
    type: 'suggestion',
    docs: {
      description: 'disallow usage of @ember/render-modifiers',
      category: 'Best Practices',
      url: 'https://github.com/ember-cli/eslint-plugin-ember/tree/master/docs/rules/template-no-at-ember-render-modifiers.md',
      templateMode: 'both',
    },
    fixable: null,
    schema: [],
    messages: {
      noRenderModifier:
        'Do not use the `{{modifier}}` modifier. This modifier was intended to ease migration to Octane and not for long-term side-effects. Instead, either refactor to use data derivation patterns for a performance boost, or refactor to use a custom modifier. See https://github.com/ember-modifier/ember-modifier',
    },
    originallyFrom: {
      name: 'ember-template-lint',
      rule: 'lib/rules/no-at-ember-render-modifiers.js',
      docs: 'docs/rule/no-at-ember-render-modifiers.md',
      tests: 'test/unit/rules/no-at-ember-render-modifiers-test.js',
    },
  },

  create(context) {
    return {
      GlimmerElementNode(node) {
        if (!node.modifiers) {
          return;
        }

        for (const modifier of node.modifiers) {
          if (
            modifier.path &&
            modifier.path.type === 'GlimmerPathExpression' &&
            (modifier.path.original === 'did-insert' ||
              modifier.path.original === 'did-update' ||
              modifier.path.original === 'will-destroy')
          ) {
            context.report({
              node: modifier,
              messageId: 'noRenderModifier',
              data: { modifier: modifier.path.original },
            });
          }
        }
      },
    };
  },
};
