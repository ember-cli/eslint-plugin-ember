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
  if (n.modifiers) {
    children.push(...n.modifiers);
  }
  // GlimmerPathExpression also has 'parts', so make sure we're not treating
  // concat'd path string parts as AST nodes.
  if (n.type === 'GlimmerConcatStatement' && n.parts) {
    children.push(...n.parts);
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

/**
 * Scan child nodes for usage of blockParams, then report the first unused
 * trailing param. Shared by both GlimmerBlockStatement and GlimmerElementNode.
 */
function checkUnusedBlockParams(context, node, blockParams, startNodes) {
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

    // Nested block with its own blockParams — shadow them
    if (n.type === 'GlimmerBlockStatement' && n.program?.blockParams?.length > 0) {
      const newShadowed = buildShadowedSet(shadowedParams, n.program.blockParams, blockParams);
      checkBlockParts(n, blockParams, usedParams, shadowedParams, newShadowed, checkNode);
      return;
    }

    // Nested element with block params (e.g. <Component as |x|>) — shadow them
    if (n.type === 'GlimmerElementNode' && n.blockParams?.length > 0) {
      const newShadowed = buildShadowedSet(shadowedParams, n.blockParams, blockParams);
      if (n.attributes) {
        for (const attr of n.attributes) {
          checkNode(attr.value, shadowedParams);
        }
      }
      if (n.children) {
        for (const child of n.children) {
          checkNode(child, newShadowed);
        }
      }
      return;
    }

    for (const child of collectChildNodes(n)) {
      checkNode(child, shadowedParams);
    }
  }

  for (const startNode of startNodes) {
    checkNode(startNode, new Set());
  }

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
  const firstUnusedTrailing = unusedTrailing[0];

  if (firstUnusedTrailing) {
    context.report({
      node,
      messageId: 'unusedBlockParam',
      data: { param: firstUnusedTrailing },
    });
  }
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
      unusedBlockParam: "'{{param}}' is defined but never used",
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
        if (blockParams.length > 0) {
          checkUnusedBlockParams(context, node, blockParams, [node.program]);
        }
      },

      GlimmerElementNode(node) {
        const blockParams = node.blockParams || [];
        if (blockParams.length > 0) {
          checkUnusedBlockParams(context, node, blockParams, node.children || []);
        }
      },
    };
  },
};
