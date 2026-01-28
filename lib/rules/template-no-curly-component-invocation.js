/**
 * @fileoverview Disallow curly component invocation
 * @type {import('eslint').Rule.RuleModule}
 */

module.exports = {
  meta: {
    type: 'suggestion',
    docs: {
      description: 'Disallow curly component invocation',
      category: 'Best Practices',
      url: 'https://github.com/ember-cli/eslint-plugin-ember/tree/master/docs/rules/template-no-curly-component-invocation.md',
    },
    strictGjs: true,
    strictGts: true,
    schema: [],
    messages: {
      noCurlyInvocation: 'Use angle bracket component invocation instead of curly: <{{name}} />',
    },
  },

  create(context) {
    return {
      GlimmerMustacheStatement(node) {
        if (node.path && node.path.type === 'PathExpression') {
          const pathName = node.path.original;
          
          // Check if this is a component invocation (starts with uppercase or has a dash)
          if (pathName && (pathName[0] === pathName[0].toUpperCase() || pathName.includes('-'))) {
            // Exclude common helpers that might match the pattern
            const helpers = ['Input', 'Textarea', 'LinkTo'];
            if (!helpers.includes(pathName)) {
              context.report({
                node,
                messageId: 'noCurlyInvocation',
                data: { name: pathName },
              });
            }
          }
        }
      },
    };
  },
};
