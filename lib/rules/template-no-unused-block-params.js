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

function markParamIfUsed(name, blockParams, usedParams, shadowedParams) {
  const firstPart = name.split('.')[0];
  if (blockParams.includes(firstPart) && !shadowedParams.has(firstPart)) {
    usedParams.add(firstPart);
  }
}

function isPartialStatement(n) {
  return (
    (n.type === 'GlimmerMustacheStatement' || n.type === 'GlimmerBlockStatement') &&
    n.path?.original === 'partial'
  );
}

function buildShadowedSet(shadowedParams, innerBlockParams, outerBlockParams) {
  const newShadowed = new Set(shadowedParams);
  for (const p of innerBlockParams) {
    if (outerBlockParams.includes(p)) {
      newShadowed.add(p);
    }
  }
  return newShadowed;
}

/** @type {import('eslint').Rule.RuleModule} */
module.exports = {
  meta: {
    type: 'suggestion',
    docs: {
      description: 'disallow unused block parameters in templates',
      category: 'Best Practices',
      url: 'https://github.com/ember-cli/eslint-plugin-ember/tree/master/docs/rules/template-no-unused-block-params.md',
      templateMode: 'both',
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

        function checkNode(n, shadowedParams) {
          if (!n) {
            return;
          }

          if (n.type === 'GlimmerPathExpression') {
            markParamIfUsed(n.original, blockParams, usedParams, shadowedParams);
          }

          if (n.type === 'GlimmerElementNode') {
            markParamIfUsed(n.tag, blockParams, usedParams, shadowedParams);
          }

          if (isPartialStatement(n)) {
            for (const p of blockParams) {
              if (!shadowedParams.has(p)) {
                usedParams.add(p);
              }
            }
          }

          // When entering a nested block, add its blockParams to the shadowed set
          if (n.type === 'GlimmerBlockStatement' && n.program?.blockParams?.length > 0) {
            const newShadowed = buildShadowedSet(
              shadowedParams,
              n.program.blockParams,
              blockParams
            );
            checkBlockParts(n, blockParams, usedParams, shadowedParams, newShadowed, checkNode);
            return;
          }

          // Recursively check children
          for (const child of collectChildNodes(n)) {
            checkNode(child, shadowedParams);
          }
        }

        checkNode(node.program, new Set());

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

function checkBlockParts(n, blockParams, usedParams, shadowedParams, newShadowed, checkNodeFn) {
  // Check the path/params of the block statement itself with current scope
  if (n.path) {
    checkNodeFn(n.path, shadowedParams);
  }
  if (n.params) {
    for (const param of n.params) {
      checkNodeFn(param, shadowedParams);
    }
  }
  if (n.hash?.pairs) {
    for (const pair of n.hash.pairs) {
      checkNodeFn(pair.value, shadowedParams);
    }
  }

  // Check the program body with the updated shadowed set
  if (n.program) {
    checkNodeFn(n.program, newShadowed);
  }
  if (n.inverse) {
    checkNodeFn(n.inverse, newShadowed);
  }
}
