/**
 * @fileoverview Disallow unused block params
 * @type {import('eslint').Rule.RuleModule}
 */

module.exports = {
  meta: {
    type: 'suggestion',
    docs: {
      description: 'Disallow unused block params',
      category: 'Best Practices',
      url: 'https://github.com/ember-cli/eslint-plugin-ember/tree/master/docs/rules/template-no-unused-block-params.md',
    },
    strictGjs: true,
    strictGts: true,
    schema: [],
    messages: {
      unusedBlockParam: 'Block param "{{param}}" is unused',
    },
  },

  create(context) {
    return {
      GlimmerBlockStatement(node) {
        const blockParams = node.program?.blockParams || [];
        if (blockParams.length === 0) return;

        const usedParams = new Set();

        function checkNode(n) {
          if (!n) return;
          
          if (n.type === 'PathExpression') {
            const firstPart = n.original.split('.')[0];
            if (blockParams.includes(firstPart)) {
              usedParams.add(firstPart);
            }
          }

          // Recursively check children
          if (n.program) checkNode(n.program);
          if (n.inverse) checkNode(n.inverse);
          if (n.params) n.params.forEach(checkNode);
          if (n.hash && n.hash.pairs) n.hash.pairs.forEach((pair) => checkNode(pair.value));
          if (n.body) n.body.forEach(checkNode);
          if (n.path) checkNode(n.path);
          if (n.attributes) n.attributes.forEach((attr) => checkNode(attr.value));
          if (n.children) n.children.forEach(checkNode);
        }

        checkNode(node.program);

        // Report unused params
        blockParams.forEach((param) => {
          if (!usedParams.has(param)) {
            context.report({
              node,
              messageId: 'unusedBlockParam',
              data: { param },
            });
          }
        });
      },
    };
  },
};
