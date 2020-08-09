'use strict';

const types = require('../utils/types');
const emberUtils = require('../utils/ember');
const utils = require('../utils/utils');
const assert = require('assert');
const { gatherImports, getImportFromMap } = require('../utils/import');

const ERROR_MESSAGE_GET = "Use ES5 getters (`this.property`) instead of Ember's `get` function";

const ERROR_MESSAGE_GET_PROPERTIES =
  "Use `{ prop1: this.prop1, prop2: this.prop2, ... }` instead of Ember's `getProperties` function";

const VALID_JS_VARIABLE_NAME_REGEXP = new RegExp('^[a-zA-Z_$][0-9a-zA-Z_$]*$');
const VALID_JS_ARRAY_INDEX_REGEXP = new RegExp(/^\d+$/);
function isValidJSVariableName(str) {
  return VALID_JS_VARIABLE_NAME_REGEXP.test(str);
}
function isValidJSArrayIndex(str) {
  return VALID_JS_ARRAY_INDEX_REGEXP.test(str);
}
function isValidJSPath(str) {
  return str.split('.').every((part) => isValidJSVariableName(part) || isValidJSArrayIndex(part));
}

function reportGet({ node, context, path, useOptionalChaining }) {
  const isInLeftSideOfAssignmentExpression = utils.isInLeftSideOfAssignmentExpression(node);
  context.report({
    node,
    message: ERROR_MESSAGE_GET,
    fix(fixer) {
      return fixGet({ node, fixer, path, useOptionalChaining, isInLeftSideOfAssignmentExpression });
    },
  });
}

function fixGet({ node, fixer, path, useOptionalChaining, isInLeftSideOfAssignmentExpression }) {
  if (path.includes('.') && !useOptionalChaining && !isInLeftSideOfAssignmentExpression) {
    // Not safe to autofix nested properties because some properties in the path might be null or undefined.
    return null;
  }

  if (!isValidJSPath(path)) {
    // Do not autofix since the path would not be a valid JS path.
    return null;
  }

  // In the left side of an assignment, we can safely autofix nested paths without using optional chaining.
  let replacementPath = isInLeftSideOfAssignmentExpression ? path : path.replace(/\./g, '?.');

  // Replace any array element access (foo.1 => foo[1] or foo?.[1]).
  replacementPath = replacementPath.replace(
    /\.(\d+)/g,
    isInLeftSideOfAssignmentExpression ? '[$1]' : '.[$1]'
  );

  return fixer.replaceText(node, `this.${replacementPath}`);
}

module.exports = {
  ERROR_MESSAGE_GET,
  ERROR_MESSAGE_GET_PROPERTIES,
  meta: {
    type: 'suggestion',
    docs: {
      description: "require using ES5 getters instead of Ember's `get` / `getProperties` functions",
      category: 'Ember Object',
      recommended: true,
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
            default: false,
          },
          useOptionalChaining: {
            type: 'boolean',
            default: false,
          },
        },
        additionalProperties: false,
      },
    ],
  },
  create(context) {
    // Options:
    const ignoreGetProperties = context.options[0] && context.options[0].ignoreGetProperties;
    const ignoreNestedPaths = context.options[0] && context.options[0].ignoreNestedPaths;
    const useOptionalChaining = context.options[0] && context.options[0].useOptionalChaining;

    if (ignoreNestedPaths && useOptionalChaining) {
      assert(
        false,
        'Do not enable both the `ignoreNestedPaths` and `useOptionalChaining` options on this rule at the same time.'
      );
    }

    let currentProxyObject = null;
    let currentClassWithUnknownPropertyMethod = null;

    const imports = new Map();

    const filename = context.getFilename();

    // Skip mirage directory
    if (emberUtils.isMirageConfig(filename)) {
      return {};
    }

    return {
      ImportDeclaration: gatherImports(imports),

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
          reportGet({
            node,
            context,
            path: node.arguments[0].value,
            isImportedGet: false,
            useOptionalChaining,
          });
        }

        if (
          types.isIdentifier(node.callee) &&
          node.callee.name === getImportFromMap(imports, '@ember/object', 'get') &&
          node.arguments.length === 2 &&
          types.isThisExpression(node.arguments[0]) &&
          types.isStringLiteral(node.arguments[1]) &&
          (!node.arguments[1].value.includes('.') || !ignoreNestedPaths)
        ) {
          // Example: get(this, 'foo');
          reportGet({
            node,
            context,
            path: node.arguments[1].value,
            isImportedGet: true,
            useOptionalChaining,
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
          node.callee.name === getImportFromMap(imports, '@ember/object', 'getProperties') &&
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
    (argument) =>
      types.isStringLiteral(argument) && (!argument.value.includes('.') || !ignoreNestedPaths)
  );
}
