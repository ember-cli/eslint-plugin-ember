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
    const localScopes = [];

    function pushLocals(params) {
      localScopes.push(new Set(params || []));
    }

    function popLocals() {
      localScopes.pop();
    }

    function isLocal(name) {
      for (const scope of localScopes) {
        if (scope.has(name)) {
          return true;
        }
      }
      return false;
    }

    function checkForLog(node) {
      if (
        node.path &&
        node.path.type === 'GlimmerPathExpression' &&
        node.path.original === 'log' &&
        !isLocal('log')
      ) {
        context.report({
          node,
          messageId: 'unexpected',
        });
      }
    }

    return {
      GlimmerBlockStatement(node) {
        if (node.program && node.program.blockParams) {
          pushLocals(node.program.blockParams);
        }
        checkForLog(node);
      },
      'GlimmerBlockStatement:exit'(node) {
        if (node.program && node.program.blockParams) {
          popLocals();
        }
      },

      GlimmerElementNode(node) {
        if (node.blockParams && node.blockParams.length > 0) {
          pushLocals(node.blockParams);
        }
      },
      'GlimmerElementNode:exit'(node) {
        if (node.blockParams && node.blockParams.length > 0) {
          popLocals();
        }
      },

      GlimmerMustacheStatement(node) {
        checkForLog(node);
      },
    };
  },
};
