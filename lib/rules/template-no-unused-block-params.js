/** @type {import('eslint').Rule.RuleModule} */
module.exports = {
  meta: {
    type: 'suggestion',
    docs: {
      description: 'disallow unused block parameters in templates',
      category: 'Best Practices',
      url: 'https://github.com/ember-cli/eslint-plugin-ember/tree/master/docs/rules/template-no-unused-block-params.md',
      strictGjs: true,
      strictGts: true,
    },
    schema: [],
    messages: {
      unusedBlockParam: 'Block param "{{param}}" is unused',
    },
    originallyFrom: {
      name: 'ember-template-lint',
      rule: 'lib/rules/no-unused-block-params.js',
      docs: 'docs/rule/no-unused-block-params.md',
      tests: 'test/unit/rules/no-unused-block-params-test.js',
    },
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

          // Check for Glimmer path expressions
          if (n.type === 'GlimmerPathExpression') {
            const firstPart = n.original.split('.')[0];
            if (blockParams.includes(firstPart)) {
              usedParams.add(firstPart);
            }
          }

          // Check for element nodes whose tag matches a block param
          if (n.type === 'GlimmerElementNode') {
            const firstPart = n.tag.split('.')[0];
            if (blockParams.includes(firstPart)) {
              usedParams.add(firstPart);
            }
          }

          // Check for partial usage (marks all params as used)
          if (
            (n.type === 'GlimmerMustacheStatement' || n.type === 'GlimmerBlockStatement') &&
            n.path?.original === 'partial'
          ) {
            for (const p of blockParams) {
              usedParams.add(p);
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

        // Find the last index of a used param
        let lastUsedIndex = -1;
        for (let i = blockParams.length - 1; i >= 0; i--) {
          if (usedParams.has(blockParams[i])) {
            lastUsedIndex = i;
            break;
          }
        }

        // Only report trailing unused params (after the last used one)
        const unusedTrailing = blockParams.slice(lastUsedIndex + 1);

        if (unusedTrailing.length > 0) {
          context.report({
            node,
            messageId: 'unusedBlockParam',
            data: { param: unusedTrailing.join(', ') },
          });
        }
      },
    };
  },
};
