const { aria } = require('aria-query');

function isBoolean(value) {
  return value === 'true' || value === 'false';
}

function isNumeric(value) {
  if (typeof value !== 'string' || value === '') {
    return false;
  }
  return !Number.isNaN(Number(value));
}

function isValidAriaValue(attrName, value) {
  const attrDef = aria.get(attrName);
  if (!attrDef) {
    return true;
  }

  if (value === 'undefined') {
    return Boolean(attrDef.allowundefined);
  }

  switch (attrDef.type) {
    case 'boolean': {
      return isBoolean(value);
    }
    case 'tristate': {
      return isBoolean(value) || value === 'mixed';
    }
    case 'string': {
      return typeof value === 'string';
    }
    case 'id': {
      return typeof value === 'string' && !isBoolean(value);
    }
    case 'idlist': {
      return (
        typeof value === 'string' &&
        value.split(' ').every((token) => token.length > 0 && !isBoolean(token))
      );
    }
    case 'integer': {
      return /^-?\d+$/.test(value);
    }
    case 'number': {
      return isNumeric(value) && !isBoolean(value);
    }
    case 'token': {
      // aria-query stores boolean values as actual booleans, convert for comparison
      const permittedValues = attrDef.values.map((v) =>
        typeof v === 'boolean' ? v.toString() : v
      );
      return permittedValues.includes(value);
    }
    case 'tokenlist': {
      return value.split(' ').every((token) => attrDef.values.includes(token.toLowerCase()));
    }
    default: {
      return true;
    }
  }
}

function getExpectedTypeDescription(attrName) {
  const attrDef = aria.get(attrName);
  if (!attrDef) {
    return 'a valid value';
  }
  switch (attrDef.type) {
    case 'tristate': {
      return 'a boolean or the string "mixed".';
    }
    case 'token': {
      const vals = attrDef.values.map((v) => (typeof v === 'boolean' ? v.toString() : v));
      return `a single token from the following: ${vals.join(', ')}.`;
    }
    case 'tokenlist': {
      return `a list of one or more tokens from the following: ${attrDef.values.join(', ')}.`;
    }
    case 'idlist': {
      return 'a list of strings that represent DOM element IDs (idlist)';
    }
    case 'id': {
      return 'a string that represents a DOM element ID';
    }
    case 'integer': {
      return 'an integer.';
    }
    default: {
      return `a ${attrDef.type}.`;
    }
  }
}

/** @type {import('eslint').Rule.RuleModule} */
module.exports = {
  meta: {
    type: 'problem',
    docs: {
      description: 'disallow invalid aria-* attributes',
      category: 'Accessibility',
      url: 'https://github.com/ember-cli/eslint-plugin-ember/tree/master/docs/rules/template-no-invalid-aria-attributes.md',
      templateMode: 'both',
    },
    schema: [],
    messages: {
      noInvalidAriaAttribute: 'Invalid ARIA attribute: {{attribute}}',
      invalidAriaAttributeValue: 'The value for {{attribute}} must be {{expectedType}}',
    },
    originallyFrom: {
      name: 'ember-template-lint',
      rule: 'lib/rules/no-invalid-aria-attributes.js',
      docs: 'docs/rule/no-invalid-aria-attributes.md',
      tests: 'test/unit/rules/no-invalid-aria-attributes-test.js',
    },
  },

  create(context) {
    return {
      GlimmerAttrNode(node) {
        if (!node.name.startsWith('aria-')) {
          return;
        }

        // Check for unknown ARIA attribute
        if (!aria.has(node.name)) {
          context.report({
            node,
            messageId: 'noInvalidAriaAttribute',
            data: { attribute: node.name },
          });
          return;
        }

        // Skip value validation for dynamic values (MustacheStatement, ConcatStatement)
        if (
          !node.value ||
          node.value.type === 'GlimmerMustacheStatement' ||
          node.value.type === 'GlimmerConcatStatement'
        ) {
          return;
        }

        // Validate value for text node values
        if (node.value.type === 'GlimmerTextNode') {
          const value = node.value.chars;
          if (!isValidAriaValue(node.name, value)) {
            context.report({
              node,
              messageId: 'invalidAriaAttributeValue',
              data: {
                attribute: node.name,
                expectedType: getExpectedTypeDescription(node.name),
              },
            });
          }
        }
      },
    };
  },
};
