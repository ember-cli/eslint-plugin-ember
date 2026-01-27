/** @type {import('eslint').Rule.RuleModule} */
module.exports = {
  meta: {
    type: 'suggestion',
    docs: {
      description: 'disallow potential path strings in templates',
      category: 'Best Practices',
      recommended: false,
      url: 'https://github.com/ember-cli/eslint-plugin-ember/tree/master/docs/rules/template-no-potential-path-strings.md',
    },
    fixable: null,
    schema: [],
    messages: {
      noPotentialPathStrings:
        'Potential path string detected. Use dynamic values instead of path strings.',
    },
    strictGjs: true,
    strictGts: true,
  },

  create(context) {
    return {
      GlimmerTextNode(node) {
        if (!node.chars) {
          return;
        }

        // Check if text looks like it could be a path (e.g., "foo.bar" or "this.foo")
        const pathPattern = /\b(this\.\w+|\w+\.\w+)\b/;
        if (pathPattern.test(node.chars)) {
          context.report({
            node,
            messageId: 'noPotentialPathStrings',
          });
        }
      },
    };
  },
};
