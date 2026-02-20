const IGNORE_IDS = new Set(['{{unique-id}}', '{{(unique-id)}}']);

function isControlFlowHelper(node) {
  if (node.type === 'GlimmerBlockStatement' && node.path?.type === 'GlimmerPathExpression') {
    return ['if', 'unless', 'each', 'each-in', 'let', 'with'].includes(node.path.original);
  }
  return false;
}

function isIfUnless(node) {
  if (node.type === 'GlimmerBlockStatement' && node.path?.type === 'GlimmerPathExpression') {
    return ['if', 'unless'].includes(node.path.original);
  }
  return false;
}

/** @type {import('eslint').Rule.RuleModule} */
module.exports = {
  meta: {
    type: 'problem',
    docs: {
      description: 'disallow duplicate id attributes',
      category: 'Best Practices',
      strictGjs: true,
      strictGts: true,
      url: 'https://github.com/ember-cli/eslint-plugin-ember/tree/master/docs/rules/template-no-duplicate-id.md',
    },
    schema: [],
    messages: { duplicate: 'ID attribute values must be unique' },
  },
  create(context) {
    const sourceCode = context.getSourceCode();
    // Stack-based conditional scoping to handle if/else branches
    let seenIdStack = [];
    let conditionalStack = [];

    function enterTemplate() {
      seenIdStack = [new Set()];
      conditionalStack = [];
    }

    function isDuplicateId(id) {
      for (const seenIds of seenIdStack) {
        if (seenIds.has(id)) {
          return true;
        }
      }
      return false;
    }

    function addId(id) {
      seenIdStack.at(-1).add(id);
      if (conditionalStack.length > 0) {
        conditionalStack.at(-1).add(id);
      }
    }

    function enterConditional() {
      conditionalStack.push(new Set());
    }

    function exitConditional() {
      const idsInConditional = conditionalStack.pop();
      if (conditionalStack.length > 0) {
        for (const id of idsInConditional) {
          conditionalStack.at(-1).add(id);
        }
      } else {
        seenIdStack.push(idsInConditional);
      }
    }

    function enterConditionalBranch() {
      seenIdStack.push(new Set());
    }

    function exitConditionalBranch() {
      seenIdStack.pop();
    }

    function resolveIdValue(valueNode, node) {
      if (!valueNode) {
        return null;
      }

      switch (valueNode.type) {
        case 'GlimmerTextNode': {
          return valueNode.chars || null;
        }
        case 'GlimmerStringLiteral': {
          return valueNode.value || null;
        }
        case 'GlimmerMustacheStatement': {
          // Try to resolve {{...}} - if it's a string literal path, use value
          if (valueNode.path?.type === 'GlimmerStringLiteral') {
            return valueNode.path.value;
          }
          // For path expressions, use the source text as a best-effort unique key
          return sourceCode.getText(valueNode);
        }
        case 'GlimmerConcatStatement': {
          // Concatenate resolved parts
          if (valueNode.parts) {
            return valueNode.parts
              .map((part) => {
                if (part.type === 'GlimmerTextNode') {
                  return part.chars;
                }
                return sourceCode.getText(part);
              })
              .join('');
          }
          return sourceCode.getText(valueNode);
        }
        default: {
          return sourceCode.getText(valueNode);
        }
      }
    }

    function logIfDuplicate(reportNode, id) {
      if (!id) {
        return;
      }
      if (IGNORE_IDS.has(id)) {
        return;
      }
      if (isDuplicateId(id)) {
        context.report({ node: reportNode, messageId: 'duplicate' });
      } else {
        addId(id);
      }
    }

    return {
      GlimmerTemplate() {
        enterTemplate();
      },
      'GlimmerTemplate:exit'() {
        seenIdStack = [new Set()];
        conditionalStack = [];
      },

      GlimmerElementNode(node) {
        // Check id, @id, @elementId attributes
        const idAttrNames = new Set(['id', '@id', '@elementId']);
        for (const attr of node.attributes || []) {
          if (idAttrNames.has(attr.name)) {
            const id = resolveIdValue(attr.value, node);
            logIfDuplicate(attr, id);
          }
        }
      },

      // Handle hash pairs in mustache/block statements (e.g., {{input elementId="foo"}})
      GlimmerMustacheStatement(node) {
        if (node.hash && node.hash.pairs) {
          for (const pair of node.hash.pairs) {
            if (['elementId', 'id'].includes(pair.key)) {
              if (pair.value?.type === 'GlimmerStringLiteral') {
                logIfDuplicate(pair, pair.value.value);
              }
            }
          }
        }
      },

      GlimmerBlockStatement(node) {
        if (isControlFlowHelper(node)) {
          enterConditional();
        } else if (node.hash && node.hash.pairs) {
          for (const pair of node.hash.pairs) {
            if (['elementId', 'id'].includes(pair.key)) {
              if (pair.value?.type === 'GlimmerStringLiteral') {
                logIfDuplicate(pair, pair.value.value);
              }
            }
          }
        }
      },

      'GlimmerBlockStatement:exit'(node) {
        if (isControlFlowHelper(node)) {
          exitConditional();
        }
      },

      GlimmerBlock(node) {
        const parent = node.parent;
        if (parent && isIfUnless(parent)) {
          enterConditionalBranch();
        }
      },

      'GlimmerBlock:exit'(node) {
        const parent = node.parent;
        if (parent && isIfUnless(parent)) {
          exitConditionalBranch();
        }
      },
    };
  },
};
