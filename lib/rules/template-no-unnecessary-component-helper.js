/**
 * @fileoverview Disallow unnecessary usage of (component) helper
 * @type {import('eslint').Rule.RuleModule}
 */

module.exports = {
  meta: {
    type: 'suggestion',
    docs: {
      description: 'Disallow unnecessary usage of (component) helper',
      category: 'Best Practices',
      url: 'https://github.com/ember-cli/eslint-plugin-ember/tree/master/docs/rules/template-no-unnecessary-component-helper.md',
    },
    strictGjs: true,
    strictGts: true,
    schema: [],
    messages: {
      noUnnecessaryComponent: 'Unnecessary use of (component) helper. Use angle bracket invocation instead.',
    },
  },

  create(context) {
    return {
      GlimmerMustacheStatement(node) {
        if (
          node.path &&
          node.path.type === 'PathExpression' &&
          node.path.original === 'component' &&
          node.params &&
          node.params.length > 0 &&
          node.params[0].type === 'StringLiteral'
        ) {
          context.report({
            node,
            messageId: 'noUnnecessaryComponent',
          });
        }
      },
    };
  },
};
