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

const VALID_JS_VARIABLE_NAME_REGEXP = RegExp('^[a-zA-Z_$][0-9a-zA-Z_$]*$');
function isValidJSVariableName(str) {
  return VALID_JS_VARIABLE_NAME_REGEXP.test(str);
}

module.exports = {
  makeErrorMessageForGet,
  ERROR_MESSAGE_GET_PROPERTIES,
  meta: {
    type: 'suggestion',
    docs: {
      description: "Require ES5 getters instead of Ember's `get` / `getProperties` functions",
      category: 'Best Practices',
      recommended: false,
      octane: true,
      url: 'https://github.com/ember-cli/eslint-plugin-ember/tree/master/docs/rules/no-get.md',
    },
    fixable: 'code',
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
    let currentClassWithUnknownPropertyMethod = null;

    return {
      'CallExpression:exit'(node) {
        if (currentProxyObject === node) {
          currentProxyObject = null;
        }
        if (currentClassWithUnknownPropertyMethod === node) {
          currentClassWithUnknownPropertyMethod = null;
        }
      },

      'ClassDeclaration:exit'(node) {
        if (currentProxyObject === node) {
          currentProxyObject = null;
        }
        if (currentClassWithUnknownPropertyMethod === node) {
          currentClassWithUnknownPropertyMethod = null;
        }
      },

      ClassDeclaration(node) {
        if (emberUtils.isEmberProxy(context, node)) {
          currentProxyObject = node; // Keep track of being inside a proxy object.
        }
        if (emberUtils.isEmberObjectImplementingUnknownProperty(node)) {
          currentClassWithUnknownPropertyMethod = node; // Keep track of being inside an object implementing `unknownProperty`.
        }
      },

      // eslint-disable-next-line complexity
      CallExpression(node) {
        // **************************
        // Check for situations which the rule should ignore.
        // **************************

        if (emberUtils.isEmberProxy(context, node)) {
          currentProxyObject = node; // Keep track of being inside a proxy object.
        }
        if (emberUtils.isEmberObjectImplementingUnknownProperty(node)) {
          currentClassWithUnknownPropertyMethod = node;
        }
        if (currentProxyObject || currentClassWithUnknownPropertyMethod) {
          // Proxy objects and objects implementing `unknownProperty()`
          // still require using `get()`, so ignore any code inside them.
          return;
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
          const path = node.arguments[0].value;
          context.report({
            node,
            message: makeErrorMessageForGet(path, false),
            fix(fixer) {
              if (path.includes('.')) {
                // Not safe to autofix nested properties because some properties in the path might be null.
                return null;
              }

              if (!isValidJSVariableName(path)) {
                // Do not autofix since the path would not be a valid JS variable name.
                return null;
              }

              return fixer.replaceText(node, `this.${path}`);
            },
          });
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
          const path = node.arguments[1].value;
          context.report({
            node,
            message: makeErrorMessageForGet(path, true),
            fix(fixer) {
              if (path.includes('.')) {
                // Not safe to autofix nested properties because some properties in the path might be null.
                return null;
              }

              if (!isValidJSVariableName(path)) {
                // Do not autofix since the path would not be a valid JS variable name.
                return null;
              }

              return fixer.replaceText(node, `this.${path}`);
            },
          });
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
