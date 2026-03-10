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
      url: 'https://github.com/ember-cli/eslint-plugin-ember/tree/master/docs/rules/template-no-duplicate-id.md',
      templateMode: 'both',
    },
    schema: [],
    messages: { duplicate: 'ID attribute values must be unique' },
    originallyFrom: {
      name: 'ember-template-lint',
      rule: 'lib/rules/no-duplicate-id.js',
      docs: 'docs/rule/no-duplicate-id.md',
      tests: 'test/unit/rules/no-duplicate-id-test.js',
    },
  },
  create(context) {
    const sourceCode = context.getSourceCode();
    // Stack-based conditional scoping to handle if/else branches
    let seenIdStack = [];
    let conditionalStack = [];
    let conditionalReportedDuplicates = [];

    function enterTemplate() {
      seenIdStack = [new Set()];
      conditionalStack = [];
      conditionalReportedDuplicates = [];
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
      conditionalReportedDuplicates.push(new Set());
    }

    function exitConditional() {
      const idsInConditional = conditionalStack.pop();
      conditionalReportedDuplicates.pop();
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
                if (
                  part.type === 'GlimmerMustacheStatement' &&
                  part.path?.type === 'GlimmerStringLiteral'
                ) {
                  return part.path.value;
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
        // If inside a conditional, only report each duplicate ID once across branches
        if (conditionalReportedDuplicates.length > 0) {
          const reported = conditionalReportedDuplicates.at(-1);
          if (reported.has(id)) {
            return;
          }
          reported.add(id);
        }
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
        conditionalReportedDuplicates = [];
      },

      GlimmerElementNode(node) {
        // If element has block params, enter a scope
        if (node.blockParams && node.blockParams.length > 0) {
          seenIdStack.push(new Set());
        }

        // Check id, @id, @elementId attributes
        const idAttrNames = new Set(['id', '@id', '@elementId']);
        for (const attr of node.attributes || []) {
          if (idAttrNames.has(attr.name)) {
            const id = resolveIdValue(attr.value, node);
            logIfDuplicate(attr, id);
          }
        }
      },

      'GlimmerElementNode:exit'(node) {
        if (node.blockParams && node.blockParams.length > 0) {
          seenIdStack.pop();
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
