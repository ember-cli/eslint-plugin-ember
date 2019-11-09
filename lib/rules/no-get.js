'use strict';

const types = require('../utils/types');
const emberUtils = require('../utils/ember');

function makeErrorMessageForGet(property, isImportedGet) {
  return isImportedGet
    ? `Use \`this.${property}\` instead of \`get(this, '${property}')\``
    : `Use \`this.${property}\` instead of \`this.get('${property}')\``;
}

const ERROR_MESSAGE_GET_PROPERTIES =
  "Use `{ prop1: this.prop1, prop2: this.prop2, ... }` instead of Ember's `getProperties` function";

module.exports = {
  makeErrorMessageForGet,
  ERROR_MESSAGE_GET_PROPERTIES,
  meta: {
    docs: {
      description: "Require ES5 getters instead of Ember's `get` / `getProperties` functions",
      category: 'Best Practices',
      recommended: false,
      octane: true,
    },
    schema: [
      {
        type: 'object',
        properties: {
          ignoreGetProperties: {
            type: 'boolean',
            default: false,
          },
          ignoreNestedPaths: {
            type: 'boolean',
            default: true,
          },
        },
        additionalProperties: false,
      },
    ],
  },
  create(context) {
    // Options:
    const ignoreGetProperties = context.options[0] && context.options[0].ignoreGetProperties;
    const ignoreNestedPaths = !context.options[0] || context.options[0].ignoreNestedPaths;

    let currentProxyObject = null;

    return {
      'CallExpression:exit'(node) {
        if (currentProxyObject === node) {
          currentProxyObject = null;
        }
      },

      'ClassDeclaration:exit'(node) {
        if (currentProxyObject === node) {
          currentProxyObject = null;
        }
      },

      ClassDeclaration(node) {
        if (emberUtils.isEmberProxy(context, node)) {
          currentProxyObject = node; // Keep track of being inside a proxy object.
        }
      },

      // eslint-disable-next-line complexity
      CallExpression(node) {
        if (emberUtils.isEmberProxy(context, node)) {
          currentProxyObject = node; // Keep track of being inside a proxy object.
        }
        if (currentProxyObject) {
          return; // Proxy objects still require using `get()` so ignore any code inside them.
        }

        // **************************
        // get
        // **************************

        if (
          types.isMemberExpression(node.callee) &&
          types.isThisExpression(node.callee.object) &&
          types.isIdentifier(node.callee.property) &&
          node.callee.property.name === 'get' &&
          node.arguments.length === 1 &&
          types.isStringLiteral(node.arguments[0]) &&
          (!node.arguments[0].value.includes('.') || !ignoreNestedPaths)
        ) {
          // Example: this.get('foo');
          context.report(node, makeErrorMessageForGet(node.arguments[0].value), false);
        }

        if (
          types.isIdentifier(node.callee) &&
          node.callee.name === 'get' &&
          node.arguments.length === 2 &&
          types.isThisExpression(node.arguments[0]) &&
          types.isStringLiteral(node.arguments[1]) &&
          (!node.arguments[1].value.includes('.') || !ignoreNestedPaths)
        ) {
          // Example: get(this, 'foo');
          context.report(node, makeErrorMessageForGet(node.arguments[1].value, true));
        }

        // **************************
        // getProperties
        // **************************

        if (ignoreGetProperties) {
          return;
        }

        if (
          types.isMemberExpression(node.callee) &&
          types.isThisExpression(node.callee.object) &&
          types.isIdentifier(node.callee.property) &&
          node.callee.property.name === 'getProperties' &&
          validateGetPropertiesArguments(node.arguments, ignoreNestedPaths)
        ) {
          // Example: this.getProperties('foo', 'bar');
          context.report(node, ERROR_MESSAGE_GET_PROPERTIES);
        }

        if (
          types.isIdentifier(node.callee) &&
          node.callee.name === 'getProperties' &&
          types.isThisExpression(node.arguments[0]) &&
          validateGetPropertiesArguments(node.arguments.slice(1), ignoreNestedPaths)
        ) {
          // Example: getProperties(this, 'foo', 'bar');
          context.report(node, ERROR_MESSAGE_GET_PROPERTIES);
        }
      },
    };
  },
};

function validateGetPropertiesArguments(args, ignoreNestedPaths) {
  if (args.length === 1 && types.isArrayExpression(args[0])) {
    return validateGetPropertiesArguments(args[0].elements, ignoreNestedPaths);
  }
  // We can only handle string arguments without nested property paths.
  return args.every(
    argument =>
      types.isStringLiteral(argument) && (!argument.value.includes('.') || !ignoreNestedPaths)
  );
}
