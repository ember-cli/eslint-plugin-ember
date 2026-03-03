function collectChildNodes(n) {
  const children = [];
  if (n.program) {
    children.push(n.program);
  }
  if (n.inverse) {
    children.push(n.inverse);
  }
  if (n.params) {
    children.push(...n.params);
  }
  if (n.hash?.pairs) {
    children.push(...n.hash.pairs.map((p) => p.value));
  }
  if (n.body) {
    children.push(...n.body);
  }
  if (n.path) {
    children.push(n.path);
  }
  if (n.attributes) {
    children.push(...n.attributes.map((a) => a.value));
  }
  if (n.children) {
    children.push(...n.children);
  }
  return children;
}

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
          for (const child of collectChildNodes(n)) {
            checkNode(child);
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
