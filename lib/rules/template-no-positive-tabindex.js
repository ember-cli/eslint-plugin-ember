'use strict';

const { createGlimmerPathTypeResolver } = require('../utils/glimmer-path-type');

// ts.TypeFlags values, hardcoded to avoid adding a direct `typescript`
// dependency (see also template-no-deprecated).
const TS_UNDEFINED_FLAG = 32_768;
const TS_NULL_FLAG = 65_536;

function getNumericViolation(value) {
  if (Number.isNaN(value)) {
    return 'mustBeNegativeNumeric';
  }
  return value > 0 ? 'positive' : null;
}

/**
 * Every member of the type must be a numeric (string) literal <= 0, or
 * null/undefined, e.g. `0 | -1`. null/undefined omits the attribute, or
 * renders `tabindex=""` inside quotes, which browsers ignore (the same as a
 * missing `{{if}}` branch).
 */
function getTypeViolation(type) {
  let violation = null;
  for (const member of type.isUnion() ? type.types : [type]) {
    // eslint-disable-next-line no-bitwise
    if (member.flags & (TS_UNDEFINED_FLAG | TS_NULL_FLAG)) {
      continue;
    }
    const literal = member.isNumberLiteral() || member.isStringLiteral() ? member.value : '';
    const memberViolation = getNumericViolation(Number.parseInt(literal, 10));
    if (memberViolation === 'mustBeNegativeNumeric') {
      return memberViolation;
    }
    violation ||= memberViolation;
  }
  return violation;
}

/**
 * Check a single value expression: a literal, or a path whose TypeScript type
 * proves it safe. Anything else is not verifiably safe.
 */
function getExpressionViolation(node, getPathType) {
  switch (node.type) {
    case 'GlimmerNumberLiteral':
    case 'GlimmerStringLiteral': {
      return getNumericViolation(Number.parseInt(node.original, 10));
    }
    case 'GlimmerPathExpression': {
      const type = getPathType?.(node);
      return type ? getTypeViolation(type) : 'mustBeNegativeNumeric';
    }
    default: {
      return 'mustBeNegativeNumeric';
    }
  }
}

/**
 * Check a tabindex attribute value and return the violation type, if any.
 * Returns null if safe, 'positive' if the value is a positive integer,
 * or 'mustBeNegativeNumeric' if the value is non-numeric/dynamic/boolean.
 */
function getTabindexViolation(attrValue, getPathType) {
  switch (attrValue.type) {
    // tabindex="0"
    case 'GlimmerTextNode': {
      return getNumericViolation(Number.parseInt(attrValue.chars, 10));
    }
    // tabindex={{-1}}, tabindex={{this.tabIndex}}, tabindex={{if this.show -1 0}}
    case 'GlimmerMustacheStatement': {
      const { path, params, hash } = attrValue;
      if (
        path.type === 'GlimmerPathExpression' &&
        (path.original === 'if' || path.original === 'unless')
      ) {
        // Every value branch must be safe
        for (const branch of params.slice(1, 3)) {
          const violation = getExpressionViolation(branch, getPathType);
          if (violation) {
            return violation;
          }
        }
        return null;
      }
      // A path with arguments is a helper call, which is not verifiably safe
      return params.length > 0 || hash?.pairs.length > 0
        ? 'mustBeNegativeNumeric'
        : getExpressionViolation(path, getPathType);
    }
    // tabindex="{{-1}}". Multiple parts are concatenated (e.g. "{{-1}}5"
    // renders "-15"), so only a single mustache is verifiably safe.
    case 'GlimmerConcatStatement': {
      const parts = attrValue.parts ?? [];
      return parts.length === 1 && parts[0].type === 'GlimmerMustacheStatement'
        ? getTabindexViolation(parts[0], getPathType)
        : 'mustBeNegativeNumeric';
    }
    default: {
      return 'mustBeNegativeNumeric';
    }
  }
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
    const typeResolver = createGlimmerPathTypeResolver(context);

    return {
      ...typeResolver?.visitors,

      GlimmerElementNode(node) {
        const tabindexAttr = node.attributes?.find((attr) => attr.name === 'tabindex');

        if (!tabindexAttr || !tabindexAttr.value) {
          return;
        }

        const violation = getTabindexViolation(tabindexAttr.value, typeResolver?.getPathType);
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
