'use strict';

module.exports = {
  meta: {
    type: 'problem',
    docs: {
      description: 'require key attribute in {{#each}} loops',
      category: 'Best Practices',
      url: 'https://github.com/ember-cli/eslint-plugin-ember/tree/master/docs/rules/template-require-each-key.md',
    },
    strictGjs: true,
    strictGts: true,
    schema: [],
    messages: {
      requireEachKey: 'each block should have a key attribute for better rendering performance.',
    },
  },

  create(context) {
    return {
      GlimmerBlockStatement(node) {
        if (node.path.type === 'GlimmerPathExpression' && node.path.original === 'each') {
          const hasKey = node.hash && node.hash.pairs.some((pair) => pair.key === 'key');
          if (!hasKey) {
            context.report({
              node,
              messageId: 'requireEachKey',
            });
          }
        }
      },
    };
  },
};
