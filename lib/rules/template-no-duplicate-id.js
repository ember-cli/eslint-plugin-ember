const IGNORE_IDS = new Set(['{{unique-id}}', '{{(unique-id)}}']);

function isControlFlowHelper(node) {
  if (node.type === 'GlimmerBlockStatement' && node.path?.type === 'GlimmerPathExpression') {
    return ['if', 'unless', 'each', 'each-in', 'let', 'with'].includes(node.path.original);
  }
  return false;
}

// Walk up the parent chain to find an ancestor element/block whose blockParams
// include headName. Used to make block-param-derived IDs unique per invocation.
function findBlockParamAncestor(node, headName) {
  if (!headName) {
    return null;
  }
  let p = node.parent;
  while (p) {
    if (p.type === 'GlimmerElementNode' && p.blockParams?.includes(headName)) {
      return p;
    }
    if (p.type === 'GlimmerBlockStatement' && p.program?.blockParams?.includes(headName)) {
      return p;
    }
    p = p.parent;
  }
  return null;
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

    // For a GlimmerMustacheStatement whose path is a PathExpression, return a
    // location-aware key so that the same expression in different component
    // invocations (e.g. {{inputProperties.id}} in two <MyComponent> blocks) gets
    // a distinct key, while two occurrences inside the SAME block get the same key.
    function getMustachePathKey(valueNode) {
      const sourceText = sourceCode.getText(valueNode);
      if (valueNode.path?.type === 'GlimmerPathExpression') {
        const headName = valueNode.path.original.split('.')[0];
        const ancestor = findBlockParamAncestor(valueNode, headName);
        if (ancestor) {
          const loc = ancestor.loc?.start;
          const tag = ancestor.tag ?? ancestor.path?.original ?? '';
          return `${sourceText}${tag}${loc ? `${loc.line}:${loc.column}` : ''}`;
        }
      }
      return sourceText;
    }

    function resolveIdValue(valueNode) {
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
          if (valueNode.path?.type === 'GlimmerStringLiteral') {
            return valueNode.path.value;
          }
          return getMustachePathKey(valueNode);
        }
        case 'GlimmerConcatStatement': {
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
                if (part.type === 'GlimmerMustacheStatement') {
                  return getMustachePathKey(part);
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
        // Note: no blockParams scoping here. Elements with block params (e.g.
        // <MyComponent as |foo|>) must not isolate their static IDs — a static
        // "shared-id" inside and outside such an element ARE duplicates.
        const idAttrNames = new Set(['id', '@id', '@elementId']);
        for (const attr of node.attributes || []) {
          if (idAttrNames.has(attr.name)) {
            const id = resolveIdValue(attr.value);
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
        if (parent && isControlFlowHelper(parent)) {
          enterConditionalBranch();
        }
      },

      'GlimmerBlock:exit'(node) {
        const parent = node.parent;
        if (parent && isControlFlowHelper(parent)) {
          exitConditionalBranch();
        }
      },
    };
  },
};
