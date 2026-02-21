/**
 * Check if a tabindex value is statically verifiable as safe (0 or negative).
 * Returns true only if we can confirm the value is not positive.
 * Dynamic, non-numeric, or boolean values are considered unsafe.
 */
function isTabindexSafe(attrValue) {
  if (!attrValue) {
    return true;
  }

  // Handle simple text values like tabindex="0" or tabindex="-1"
  if (attrValue.type === 'GlimmerTextNode') {
    const value = Number.parseInt(attrValue.chars, 10);
    return !Number.isNaN(value) && value <= 0;
  }

  // Handle mustache statements like tabindex={{-1}} or tabindex={{someProperty}}
  if (attrValue.type === 'GlimmerMustacheStatement') {
    const path = attrValue.path;

    if (path.type === 'GlimmerNumberLiteral') {
      return Number.parseInt(path.original, 10) <= 0;
    }
    if (path.type === 'GlimmerStringLiteral') {
      const value = Number.parseInt(path.original, 10);
      return !Number.isNaN(value) && value <= 0;
    }

    // Handle conditional expressions like {{if this.show -1 0}}
    if (
      path.type === 'GlimmerPathExpression' &&
      (path.original === 'if' || path.original === 'unless')
    ) {
      return isConditionalTabindexSafe(attrValue.params);
    }

    // Any other dynamic value (variable, boolean, etc.) is not verifiably safe
    return false;
  }

  // Handle concat statements like tabindex="{{-1}}" or tabindex="{{false}}"
  if (attrValue.type === 'GlimmerConcatStatement') {
    const parts = attrValue.parts || [];
    if (parts.length > 0 && parts[0].type === 'GlimmerMustacheStatement') {
      return isTabindexSafe(parts[0]);
    }
    return false;
  }

  return false;
}

/**
 * Check that all branches of a conditional (if/unless) expression are safe.
 */
function isConditionalTabindexSafe(params) {
  if (!params) {
    return false;
  }

  // Check the value branches (params[1] and optionally params[2])
  for (let i = 1; i < params.length && i < 3; i++) {
    const param = params[i];
    if (param.type === 'GlimmerNumberLiteral') {
      if (Number.parseInt(param.original, 10) > 0) {
        return false;
      }
    } else if (param.type === 'GlimmerStringLiteral') {
      const val = Number.parseInt(param.original, 10);
      if (Number.isNaN(val) || val > 0) {
        return false;
      }
    } else {
      // Dynamic value in branch — not verifiably safe
      return false;
    }
  }

  return true;
}

/** @type {import('eslint').Rule.RuleModule} */
module.exports = {
  meta: {
    type: 'suggestion',
    docs: {
      description: 'disallow positive tabindex values',
      category: 'Accessibility',
      strictGjs: true,
      strictGts: true,
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

        if (!isTabindexSafe(tabindexAttr.value)) {
          context.report({
            node: tabindexAttr,
            messageId: 'positive',
          });
        }
      },
    };
  },
};
