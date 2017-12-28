'use strict';

const ember = require('../utils/ember');
const utils = require('../utils/utils');

const DEFAULT_IGNORED_PROPERTIES = [
  'classNames',
  'classNameBindings',
  'actions',
  'concatenatedProperties',
  'mergedProperties',
  'positionalParams',
  'attributeBindings',
  'queryParams',
  'attrs',
];

const isAllowed = function (property) {
  const value = property.value;
  return ember.isFunctionExpression(value) ||
    utils.isLiteral(value) ||
    utils.isIdentifier(value) ||
    utils.isCallExpression(value) ||
    utils.isBinaryExpression(value) ||
    utils.isTemplateLiteral(value) ||
    utils.isTaggedTemplateExpression(value) ||
    utils.isMemberExpression(value) ||
    utils.isUnaryExpression(value);
};

/**
 * Checks for additonal properties to ignore.
 * @param {Object} options Object containing additonal properties.
 * @returns {Array} An array of properties to ignore.
 */
function mergeIgnoredProperties(options) {
  const ignoredProperties = DEFAULT_IGNORED_PROPERTIES;

  if (options) {
    const props = options.additionalIgnoredProperties;
    props.forEach((prop) => {
      ignoredProperties.push(prop);
    });
  }

  return ignoredProperties;
}

//------------------------------------------------------------------------------
// Ember object rule - Avoid leaking state
// (Don't use arrays or objects as default props)
//------------------------------------------------------------------------------

module.exports = {
  meta: {
    docs: {
      description: 'Avoids state leakage',
      category: 'Ember Object',
      recommended: true
    },
    fixable: null, // or "code" or "whitespace"
    schema: [
      {
        type: 'object',
        properties: {
          additionalIgnoredProperties: {
            type: 'array',
            items: { type: 'string' },
            uniqueItems: true
          }
        }
      }
    ]
  },

  create(context) {
    const options = context.options[0] || null;
    const ignoredProperties = mergeIgnoredProperties(options);

    const report = function (node) {
      const message = 'Only string, number, symbol, boolean, null, undefined, and function are allowed as default properties';
      context.report(node, message);
    };

    return {
      CallExpression(node) {
        if (!(ember.isEmberObject(node) || ember.isReopenObject(node))) return;

        const properties = ember.getModuleProperties(node);

        properties
          .filter(property => ignoredProperties.indexOf(property.key.name) === -1)
          .forEach((property) => {
            if (!isAllowed(property)) {
              report(property);
            }
          });
      },
    };
  },
};
