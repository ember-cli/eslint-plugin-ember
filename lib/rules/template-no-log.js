/** @type {import('eslint').Rule.RuleModule} */
module.exports = {
  meta: {
    type: 'problem',
    docs: {
      description: 'disallow {{log}} in templates',
      category: 'Best Practices',
      url: 'https://github.com/ember-cli/eslint-plugin-ember/tree/master/docs/rules/template-no-log.md',
    },
    fixable: null,
    schema: [],
    messages: {
      unexpected: 'Unexpected log statement in template.',
    },
  },

  create(context) {
    const localVariables = [];

    function isLocalVariable(name) {
      return localVariables.includes(name);
    }

    function checkForLog(node) {
      if (node.path && node.path.type === 'GlimmerPathExpression' && node.path.original === 'log') {
        if (!isLocalVariable('log')) {
          context.report({
            node,
            messageId: 'unexpected',
          });
        }
      }
    }

    return {
      GlimmerBlockStatement(node) {
        checkForLog(node);
        const params = node.program?.blockParams || [];
        for (const param of params) {
          localVariables.push(param);
        }
      },

      'GlimmerBlockStatement:exit'(node) {
        const params = node.program?.blockParams || [];
        for (const param of params) {
          const index = localVariables.lastIndexOf(param);
          if (index !== -1) {
            localVariables.splice(index, 1);
          }
        }
      },

      GlimmerElementNode(node) {
        const params = node.blockParams || [];
        for (const param of params) {
          localVariables.push(param);
        }
      },

      'GlimmerElementNode:exit'(node) {
        const params = node.blockParams || [];
        for (const param of params) {
          const index = localVariables.lastIndexOf(param);
          if (index !== -1) {
            localVariables.splice(index, 1);
          }
        }
      },

      GlimmerMustacheStatement(node) {
        checkForLog(node);
      },
    };
  },
};
