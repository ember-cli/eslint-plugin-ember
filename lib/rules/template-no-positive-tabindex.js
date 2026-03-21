/**
 * Check a tabindex attribute value and return the violation type, if any.
 * Returns null if safe, 'positive' if the value is a positive integer,
 * or 'mustBeNegativeNumeric' if the value is non-numeric/dynamic/boolean.
 */
function getTabindexViolation(attrValue) {
  if (!attrValue) {
    return null;
  }

  // Handle simple text values like tabindex="0" or tabindex="-1"
  if (attrValue.type === 'GlimmerTextNode') {
    const value = Number.parseInt(attrValue.chars, 10);
    if (Number.isNaN(value)) {
      return 'mustBeNegativeNumeric';
    }
    return value > 0 ? 'positive' : null;
  }

  // Handle mustache statements like tabindex={{-1}} or tabindex={{someProperty}}
  if (attrValue.type === 'GlimmerMustacheStatement') {
    const path = attrValue.path;

    if (path.type === 'GlimmerNumberLiteral') {
      return Number.parseInt(path.original, 10) > 0 ? 'positive' : null;
    }
    if (path.type === 'GlimmerStringLiteral') {
      const value = Number.parseInt(path.original, 10);
      if (Number.isNaN(value)) {
        return 'mustBeNegativeNumeric';
      }
      return value > 0 ? 'positive' : null;
    }

    // Handle conditional expressions like {{if this.show -1 0}}
    if (
      path.type === 'GlimmerPathExpression' &&
      (path.original === 'if' || path.original === 'unless')
    ) {
      return getConditionalTabindexViolation(attrValue.params);
    }

    // Any other dynamic value (variable, boolean, etc.) is not verifiably safe
    return 'mustBeNegativeNumeric';
  }

  // Handle concat statements like tabindex="{{-1}}" or tabindex="{{false}}"
  if (attrValue.type === 'GlimmerConcatStatement') {
    const parts = attrValue.parts || [];
    if (parts.length > 0 && parts[0].type === 'GlimmerMustacheStatement') {
      return getTabindexViolation(parts[0]);
    }
    return 'mustBeNegativeNumeric';
  }

  return 'mustBeNegativeNumeric';
}

/**
 * Check that all branches of a conditional (if/unless) expression are safe.
 */
function getConditionalTabindexViolation(params) {
  if (!params) {
    return 'mustBeNegativeNumeric';
  }

  // Check the value branches (params[1] and optionally params[2])
  for (let i = 1; i < params.length && i < 3; i++) {
    const param = params[i];
    if (param.type === 'GlimmerNumberLiteral') {
      if (Number.parseInt(param.original, 10) > 0) {
        return 'positive';
      }
    } else if (param.type === 'GlimmerStringLiteral') {
      const val = Number.parseInt(param.original, 10);
      if (Number.isNaN(val)) {
        return 'mustBeNegativeNumeric';
      }
      if (val > 0) {
        return 'positive';
      }
    } else {
      // Dynamic value in branch — not verifiably safe
      return 'mustBeNegativeNumeric';
    }
  }

  return null;
}

/** @type {import('eslint').Rule.RuleModule} */
module.exports = {
  meta: {
    type: 'suggestion',
    docs: {
      description: 'disallow positive tabindex values',
      category: 'Accessibility',
      url: 'https://github.com/ember-cli/eslint-plugin-ember/tree/master/docs/rules/template-no-positive-tabindex.md',
      templateMode: 'both',
    },
    fixable: null,
    schema: [],
    messages: {
      positive: 'Avoid positive integer values for tabindex.',
      mustBeNegativeNumeric: 'Tabindex values must be negative numeric.',
    },
    originallyFrom: {
      name: 'ember-template-lint',
      rule: 'lib/rules/no-positive-tabindex.js',
      docs: 'docs/rule/no-positive-tabindex.md',
      tests: 'test/unit/rules/no-positive-tabindex-test.js',
    },
  },

  create(context) {
    return {
      GlimmerElementNode(node) {
        const tabindexAttr = node.attributes?.find((attr) => attr.name === 'tabindex');

        if (!tabindexAttr || !tabindexAttr.value) {
          return;
        }

        const violation = getTabindexViolation(tabindexAttr.value);
        if (violation) {
          context.report({
            node: tabindexAttr,
            messageId: violation,
          });
        }
      },
    };
  },
};
