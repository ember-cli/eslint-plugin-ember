/** @type {import('eslint').Rule.RuleModule} */
module.exports = {
  meta: {
    type: 'problem',
    docs: {
      description: 'disallow ambiguous path in templates',
      category: 'Best Practices',
      strictGjs: true,
      strictGts: true,
      url: 'https://github.com/ember-cli/eslint-plugin-ember/tree/master/docs/rules/template-no-ambiguous-glimmer-paths.md',
    },
    schema: [],
    messages: {
      ambiguousPath:
        'Ambiguous path "{{path}}". Use explicit "this." or "@" prefix.',
    },
  },

  create(context) {
    const BUILTIN_HELPERS = [
      'if',
      'unless',
      'each',
      'let',
      'with',
      'log',
      'concat',
      'get',
      'array',
      'hash',
      'fn',
      'on',
      'action',
    ];

    function isAmbiguous(path) {
      if (!path || path.type !== 'GlimmerPathExpression') {
        return false;
      }

      const pathString = path.original;

      // Not ambiguous if starts with @ or this.
      if (pathString.startsWith('@') || pathString.startsWith('this.')) {
        return false;
      }

      // Not ambiguous if it's a builtin helper
      if (BUILTIN_HELPERS.includes(pathString)) {
        return false;
      }

      // Check if it's a simple identifier (no dots)
      if (!pathString.includes('.')) {
        return false; // Simple identifiers are component names or helpers
      }

      return true; // Ambiguous property access
    }

    return {
      GlimmerMustacheStatement(node) {
        if (isAmbiguous(node.path)) {
          context.report({
            node,
            messageId: 'ambiguousPath',
            data: {
              path: node.path.original,
            },
          });
        }
      },
    };
  },
};
