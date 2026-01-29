/** @type {import('eslint').Rule.RuleModule} */
module.exports = {
  meta: {
    type: 'suggestion',
    docs: {
      description: 'disallow unnecessary curlies around single values',
      category: 'Best Practices',
      strictGjs: true,
      strictGts: true,
      url: 'https://github.com/ember-cli/eslint-plugin-ember/tree/master/docs/rules/template-no-unnecessary-curly-parens.md',
    },
    schema: [],
    messages: {
      noUnnecessaryCurlyParens:
        'Unnecessary curlies around "{{value}}". Use directly without curlies if it\'s a simple path.',
    },
  },

  create(context) {
    return {
      GlimmerMustacheStatement(node) {
        // Check if this is a simple path expression with no parameters or hash
        if (
          node.path.type === 'GlimmerPathExpression' &&
          (!node.params || node.params.length === 0) &&
          (!node.hash || !node.hash.pairs || node.hash.pairs.length === 0)
        ) {
          const path = node.path.original;
          // Allow helpers and special paths, but disallow simple property access
          // Simple property access like {{foo}} or {{this.foo}} might not need curlies in some contexts
          // However, this is more nuanced - we'll check for paths that are just identifiers
          if (path && !path.includes('(') && !path.includes('[')) {
            // This is a simple path, but we need to determine if curlies are necessary
            // In practice, this is context-dependent, so we'll be conservative
            // and only flag very simple cases
            if (
              /^[$A-Z_a-z][\w$]*$/.test(path) &&
              !['if', 'unless', 'each', 'with', 'let'].includes(path)
            ) {
              context.report({
                node,
                messageId: 'noUnnecessaryCurlyParens',
                data: { value: path },
              });
            }
          }
        }
      },
    };
  },
};
