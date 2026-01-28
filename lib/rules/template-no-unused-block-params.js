/** @type {import('eslint').Rule.RuleModule} */
module.exports = {
  meta: {
    type: 'suggestion',
    docs: {
      description: 'disallow unused block parameters in templates',
      category: 'Best Practices',
      url: 'https://github.com/ember-cli/eslint-plugin-ember/tree/master/docs/rules/template-no-unused-block-params.md',
    },
    schema: [],
    messages: {
      unusedBlockParam: 'Block param "{{param}}" is unused',
    },
    strictGjs: true,
    strictGts: true,
  },

  create(context) {
    return {
      GlimmerBlockStatement(node) {
        const blockParams = node.program?.blockParams || [];
        if (blockParams.length === 0) {
          return;
        }

        const usedParams = new Set();

        function checkNode(n) {
          if (!n) {
            return;
          }

          if (n.type === 'PathExpression') {
            const firstPart = n.original.split('.')[0];
            if (blockParams.includes(firstPart)) {
              usedParams.add(firstPart);
            }
          }

          // Recursively check children
          if (n.program) {
            checkNode(n.program);
          }
          if (n.inverse) {
            checkNode(n.inverse);
          }
          if (n.params) {
            for (const param of n.params) {
              checkNode(param);
            }
          }
          if (n.hash && n.hash.pairs) {
            for (const pair of n.hash.pairs) {
              checkNode(pair.value);
            }
          }
          if (n.body) {
            for (const bodyNode of n.body) {
              checkNode(bodyNode);
            }
          }
          if (n.path) {
            checkNode(n.path);
          }
          if (n.attributes) {
            for (const attr of n.attributes) {
              checkNode(attr.value);
            }
          }
          if (n.children) {
            for (const child of n.children) {
              checkNode(child);
            }
          }
        }

        checkNode(node.program);

        // Report unused params
        for (const param of blockParams) {
          if (!usedParams.has(param)) {
            context.report({
              node,
              messageId: 'unusedBlockParam',
              data: { param },
            });
          }
        }
      },
    };
  },
};
