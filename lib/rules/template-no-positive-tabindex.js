function parseTabindexValue(attrValue) {
  if (!attrValue) {
    return null;
  }

  // Handle simple text values
  if (attrValue.type === 'GlimmerTextNode') {
    const value = Number.parseInt(attrValue.chars, 10);
    return Number.isNaN(value) ? null : value;
  }

  // Handle mustache statements with literals
  if (attrValue.type === 'GlimmerMustacheStatement') {
    const path = attrValue.path;

    if (path.type === 'GlimmerNumberLiteral') {
      return Number.parseInt(path.original, 10);
    }
    if (path.type === 'GlimmerStringLiteral') {
      const value = Number.parseInt(path.original, 10);
      return Number.isNaN(value) ? null : value;
    }

    // Handle conditional expressions
    if (
      path.type === 'GlimmerPathExpression' &&
      (path.original === 'if' || path.original === 'unless')
    ) {
      return getMaxTabindexFromConditional(attrValue.params);
    }
  }

  // Handle concat statements
  if (attrValue.type === 'GlimmerConcatStatement') {
    const parts = attrValue.parts || [];
    if (parts.length > 0 && parts[0].type === 'GlimmerMustacheStatement') {
      return parseTabindexValue(parts[0]);
    }
  }

  return null;
}

function getMaxTabindexFromConditional(params) {
  if (!params) {
    return null;
  }

  let maxValue = Number.NEGATIVE_INFINITY;

  // Check the conditional values (params 1 and optionally 2)
  for (let i = 1; i < params.length && i < 3; i++) {
    const param = params[i];
    if (param.type === 'GlimmerNumberLiteral') {
      maxValue = Math.max(maxValue, Number.parseInt(param.original, 10));
    } else if (param.type === 'GlimmerStringLiteral') {
      const val = Number.parseInt(param.original, 10);
      if (!Number.isNaN(val)) {
        maxValue = Math.max(maxValue, val);
      }
    }
  }

  return maxValue === Number.NEGATIVE_INFINITY ? null : maxValue;
}

/** @type {import('eslint').Rule.RuleModule} */
module.exports = {
  meta: {
    type: 'suggestion',
    docs: {
      description: 'disallow positive tabindex values',
      category: 'Accessibility',
      recommendedGjs: true,
      recommendedGts: true,
      url: 'https://github.com/ember-cli/eslint-plugin-ember/tree/master/docs/rules/template-no-positive-tabindex.md',
    },
    fixable: null,
    schema: [],
    messages: {
      positive: 'Avoid positive integer values for tabindex.',
    },
  },

  create(context) {
    return {
      GlimmerElementNode(node) {
        const tabindexAttr = node.attributes?.find((attr) => attr.name === 'tabindex');

        if (!tabindexAttr || !tabindexAttr.value) {
          return;
        }

        const tabindexValue = parseTabindexValue(tabindexAttr.value);

        // Only report if we can determine the value and it's positive
        // Dynamic values (variables) cannot be validated at lint time
        if (tabindexValue !== null && tabindexValue > 0) {
          context.report({
            node: tabindexAttr,
            messageId: 'positive',
          });
        }
      },
    };
  },
};
