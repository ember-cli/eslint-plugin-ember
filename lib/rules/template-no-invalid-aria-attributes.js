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

/**
 * Determine whether a tag name refers to an HTML custom element.
 *
 * Per the WHATWG HTML spec a valid custom element name must start with a
 * lowercase ASCII letter and contain at least one hyphen.
 * https://html.spec.whatwg.org/#valid-custom-element-name
 *
 * We do not attempt to enforce the full PCENChar grammar here — the lowercase
 * + hyphen heuristic matches the behavior of angular-eslint's `valid-aria`
 * rule and is sufficient to avoid false positives on custom elements whose
 * a11y contracts ESLint cannot introspect.
 */
function isCustomElement(tag) {
  return typeof tag === 'string' && tag.includes('-') && /^[a-z]/.test(tag);
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
    case 'string':
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
    function checkAttr(attr) {
      if (attr.type !== 'GlimmerAttrNode' || !attr.name?.startsWith('aria-')) {
        return;
      }

      // Check for unknown ARIA attribute
      if (!aria.has(attr.name)) {
        context.report({
          node: attr,
          messageId: 'noInvalidAriaAttribute',
          data: { attribute: attr.name },
        });
        return;
      }

      // Skip value validation for dynamic values (MustacheStatement, ConcatStatement)
      if (
        !attr.value ||
        attr.value.type === 'GlimmerMustacheStatement' ||
        attr.value.type === 'GlimmerConcatStatement'
      ) {
        return;
      }

      // Validate value for text node values
      if (attr.value.type === 'GlimmerTextNode') {
        const value = attr.value.chars;
        if (!isValidAriaValue(attr.name, value)) {
          context.report({
            node: attr,
            messageId: 'invalidAriaAttributeValue',
            data: {
              attribute: attr.name,
              expectedType: getExpectedTypeDescription(attr.name),
            },
          });
        }
      }
    }

    return {
      GlimmerElementNode(node) {
        // Skip HTML custom elements (tags with a hyphen that start lowercase).
        // Custom elements define their own a11y contracts that ESLint cannot
        // introspect; their aria-* attributes may be valid against a shadow-
        // DOM-mapped role. Matches angular-eslint's `valid-aria` behavior.
        if (isCustomElement(node.tag)) {
          return;
        }

        for (const attr of node.attributes || []) {
          checkAttr(attr);
        }
      },
    };
  },
};
