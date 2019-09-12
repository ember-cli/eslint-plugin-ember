('use strict');

const types = require('../utils/types');

const ERROR_MESSAGE =
  'Avoid using string interpolation to construct translation keys. Consider using a `switch` statement instead.';

const DEFAULT_SERVICE_NAME = 'intl';
const DEFAULT_METHOD_NAME = 't';

module.exports = {
  ERROR_MESSAGE,
  meta: {
    docs: {
      description: 'Disallow string interpolation in translation keys',
      category: 'Best Practices',
    },
    schema: [
      {
        type: 'object',
        properties: {
          serviceName: {
            type: 'string',
          },
        },
        additionalProperties: false,
      },
    ],
  },
  create(context) {
    return {
      CallExpression(node) {
        const customServiceName =
          context.options && context.options.length >= 1 && context.options[0].serviceName
            ? context.options[0].serviceName
            : null;
        const serviceName = customServiceName || DEFAULT_SERVICE_NAME;

        if (
          (isIntlT(node, serviceName) || isThisIntlT(node, serviceName)) &&
          (node.arguments.length === 1 || node.arguments.length === 2) &&
          types.isTemplateLiteral(node.arguments[0])
        ) {
          context.report({
            node,
            message: ERROR_MESSAGE,
          });
        }
      },
    };
  },
};

function isIntlT(node, serviceName) {
  // Example: intl.t(...);
  return (
    types.isCallExpression(node) &&
    types.isMemberExpression(node.callee) &&
    types.isIdentifier(node.callee.object) &&
    node.callee.object.name === serviceName &&
    types.isIdentifier(node.callee.property) &&
    node.callee.property.name === DEFAULT_METHOD_NAME
  );
}

function isThisIntlT(node, serviceName) {
  // Example: this.intl.t(...);
  return (
    types.isCallExpression(node) &&
    types.isMemberExpression(node.callee) &&
    types.isMemberExpression(node.callee.object) &&
    types.isThisExpression(node.callee.object.object) &&
    types.isIdentifier(node.callee.object.property) &&
    node.callee.object.property.name === serviceName &&
    types.isIdentifier(node.callee.property) &&
    node.callee.property.name === DEFAULT_METHOD_NAME
  );
}
