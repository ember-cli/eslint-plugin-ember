'use strict';

const types = require('../utils/types');
const emberUtils = require('../utils/ember');
const utils = require('../utils/utils');
const assert = require('assert');
const { getImportIdentifier } = require('../utils/import');

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

function reportGet({ node, context, path, useAt, useOptionalChaining, objectText, sourceCode }) {
  const isInLeftSideOfAssignmentExpression = utils.isInLeftSideOfAssignmentExpression(node);
  context.report({
    node,
    message: ERROR_MESSAGE_GET,
    fix(fixer) {
      return fixGet({
        node,
        fixer,
        path,
        useOptionalChaining,
        useAt,
        isInLeftSideOfAssignmentExpression,
        objectText,
        sourceCode,
      });
    },
  });
}

function fixGet({
  node,
  fixer,
  path,
  useOptionalChaining,
  useAt,
  isInLeftSideOfAssignmentExpression,
  objectText,
  sourceCode,
}) {
  // Add parenthesis around the object text in case of something like this: get(foo || {}, 'bar')
  const objectTextSafe = isValidJSPath(objectText) ? objectText : `(${objectText})`;

  const getResultIsChained = node.parent.type === 'MemberExpression' && node.parent.object === node;

  // If the result of get is chained, we can safely autofix nests paths without using optional chaining.
  // In the left side of an assignment, we can safely autofix nested paths without using optional chaining.
  const shouldIgnoreOptionalChaining = getResultIsChained || isInLeftSideOfAssignmentExpression;

  if (types.isConditionalExpression(path)) {
    const newConsequentExpression = convertLiteralTypePath({
      path: path.consequent.value,
      useAt,
      useOptionalChaining,
      shouldIgnoreOptionalChaining,
      objectText,
    });
    const newAlternateExpression = convertLiteralTypePath({
      path: path.alternate.value,
      useAt,
      useOptionalChaining,
      shouldIgnoreOptionalChaining,
      objectText,
    });

    // this means the overall expression can't be fixed
    if (newConsequentExpression === null || newAlternateExpression === null) {
      return null;
    }

    let replacementText = `${sourceCode.getText(
      path.test
    )} ? ${objectTextSafe}${newConsequentExpression} : ${objectTextSafe}${newAlternateExpression}`;

    if (shouldIgnoreOptionalChaining) {
      replacementText = `(${replacementText})`;
    }

    return fixer.replaceText(node, replacementText);
  }

  const replacementPath = convertLiteralTypePath({
    path,
    useAt,
    useOptionalChaining,
    shouldIgnoreOptionalChaining,
    objectText,
  });

  // null means it can't be fixed
  if (replacementPath === null) {
    return null;
  }

  return fixer.replaceText(node, `${objectTextSafe}${replacementPath}`);
}

function reportGetProperties({ context, node, objectText, properties }) {
  let _properties = properties;
  if (properties[0].type === 'ArrayExpression') {
    // When properties are in an array(e.g. getProperties(this.obj, [bar, foo]) ), actual properties are under Array.elements.
    _properties = properties[0].elements;
  }
  const propertyNames = _properties.map((arg) => arg.value);

  context.report({
    node,
    message: ERROR_MESSAGE_GET_PROPERTIES,
    fix(fixer) {
      return fixGetProperties({
        fixer,
        node,
        objectText,
        propertyNames,
      });
    },
  });
}

function fixGetProperties({ fixer, node, objectText, propertyNames }) {
  if (!propertyNames.every((name) => isValidJSVariableName(name))) {
    // Do not autofix if any property is invalid.
    return null;
  }

  if (node.parent.type === 'VariableDeclarator' && node.parent.id.type === 'ObjectPattern') {
    // When destructuring assignment is in the left side of "=".
    // Example: const { foo, bar } = getProperties(this.obj, "foo", "bar");
    // Expectation:
    // const { foo, bar } = this.obj;

    return fixer.replaceText(node, `${objectText}`);
  }

  const newProperties = propertyNames.map((name) => `${name}: ${objectText}.${name}`).join(', ');
  return fixer.replaceText(node, `{ ${newProperties} }`);
}

/** @type {import('eslint').Rule.RuleModule} */
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
            description: 'Whether the rule should ignore `getProperties`.',
          },
          ignoreNestedPaths: {
            type: 'boolean',
            default: false,
            description:
              "Whether the rule should ignore `this.get('some.nested.property')` (can't be enabled at the same time as `useOptionalChaining`).",
          },
          useOptionalChaining: {
            type: 'boolean',
            default: true,
            description:
              "Whether the rule should use the [optional chaining operator](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators/Optional_chaining) `?.` to autofix nested paths such as `this.get('some.nested.property')` to `this.some?.nested?.property` (when this option is off, these nested paths won't be autofixed at all).",
          },
          catchSafeObjects: {
            type: 'boolean',
            default: true,
            description:
              "Whether the rule should catch non-`this` imported usages like `get(foo, 'bar')`.",
          },
          catchUnsafeObjects: {
            type: 'boolean',
            default: false,
            description:
              "Whether the rule should catch non-`this` usages like `foo.get('bar')` even though we don't know for sure if `foo` is an Ember object.",
          },
          useAt: {
            type: 'boolean',
            default: true,
            description:
              'Whether the rule should use `at(-1)` [Array.prototype.at()](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/at) to replace `lastObject`.',
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
    const useAt = context.options[0] && context.options[0].useAt;
    const useOptionalChaining = context.options[0] && context.options[0].useOptionalChaining;
    const catchSafeObjects = context.options[0] ? context.options[0].catchSafeObjects : true;
    const catchUnsafeObjects = context.options[0] && context.options[0].catchUnsafeObjects;

    if (ignoreNestedPaths && useOptionalChaining) {
      assert(
        false,
        'Do not enable both the `ignoreNestedPaths` and `useOptionalChaining` options on this rule at the same time.'
      );
    }

    const proxyObjects = [];
    let currentClassWithUnknownPropertyMethod = null;

    let importedGetName;
    let importedGetPropertiesName;

    const filename = context.getFilename();

    const sourceCode = context.getSourceCode();
    const { scopeManager } = sourceCode;

    // Skip mirage directory
    if (emberUtils.isMirageConfig(filename)) {
      return {};
    }

    return {
      ImportDeclaration(node) {
        if (node.source.value === '@ember/object') {
          importedGetName = importedGetName || getImportIdentifier(node, '@ember/object', 'get');
          importedGetPropertiesName =
            importedGetPropertiesName ||
            getImportIdentifier(node, '@ember/object', 'getProperties');
        }
      },

      'CallExpression:exit'(node) {
        if (proxyObjects.at(-1) === node) {
          proxyObjects.pop();
        }
        if (currentClassWithUnknownPropertyMethod === node) {
          currentClassWithUnknownPropertyMethod = null;
        }
      },

      'ClassDeclaration:exit'(node) {
        if (proxyObjects.at(-1) === node) {
          proxyObjects.pop();
        }
        if (currentClassWithUnknownPropertyMethod === node) {
          currentClassWithUnknownPropertyMethod = null;
        }
      },

      ClassDeclaration(node) {
        if (emberUtils.isEmberProxy(context, node)) {
          proxyObjects.push(node); // Keep track of being inside a proxy object.
        }
        if (emberUtils.isEmberObjectImplementingUnknownProperty(node, scopeManager)) {
          currentClassWithUnknownPropertyMethod = node; // Keep track of being inside an object implementing `unknownProperty`.
        }
      },

      // eslint-disable-next-line complexity
      CallExpression(node) {
        // **************************
        // Check for situations which the rule should ignore.
        // **************************

        if (emberUtils.isEmberProxy(context, node)) {
          proxyObjects.push(node); // Keep track of being inside a proxy object.
        }
        if (emberUtils.isEmberObjectImplementingUnknownProperty(node, scopeManager)) {
          currentClassWithUnknownPropertyMethod = node;
        }
        if (proxyObjects.at(-1) || currentClassWithUnknownPropertyMethod) {
          // Proxy objects and objects implementing `unknownProperty()`
          // still require using `get()`, so ignore any code inside them.
          return;
        }

        // **************************
        // get
        // **************************

        if (
          types.isMemberExpression(node.callee) &&
          (types.isThisExpression(node.callee.object) || catchUnsafeObjects) &&
          types.isIdentifier(node.callee.property) &&
          node.callee.property.name === 'get' &&
          node.arguments.length === 1 &&
          types.isStringLiteral(node.arguments[0]) &&
          (!node.arguments[0].value.includes('.') || !ignoreNestedPaths)
        ) {
          // Example: this.get('foo');
          const sourceCode = context.getSourceCode();
          reportGet({
            node,
            context,
            path: node.arguments[0].value,
            isImportedGet: false,
            useOptionalChaining,
            useAt,
            objectText: sourceCode.getText(node.callee.object),
          });
        }

        if (
          types.isIdentifier(node.callee) &&
          node.callee.name === importedGetName &&
          node.arguments.length === 2 &&
          (types.isThisExpression(node.arguments[0]) || catchSafeObjects) &&
          types.isStringLiteral(node.arguments[1]) &&
          (!node.arguments[1].value.includes('.') || !ignoreNestedPaths)
        ) {
          // Example: get(this, 'foo');
          const sourceCode = context.getSourceCode();
          reportGet({
            node,
            context,
            path: node.arguments[1].value,
            isImportedGet: true,
            useOptionalChaining,
            useAt,
            objectText: sourceCode.getText(node.arguments[0]),
          });
        }

        if (
          types.isMemberExpression(node.callee) &&
          (types.isThisExpression(node.callee.object) || catchUnsafeObjects) &&
          types.isIdentifier(node.callee.property) &&
          node.callee.property.name === 'get' &&
          node.arguments.length === 1 &&
          node.arguments[0].type === 'Literal' &&
          typeof node.arguments[0].value === 'number'
        ) {
          // Example: this.get(5);
          const sourceCode = context.getSourceCode();
          reportGet({
            node,
            context,
            path: node.arguments[0].value,
            isImportedGet: false,
            objectText: sourceCode.getText(node.callee.object),
          });
        }

        if (
          types.isIdentifier(node.callee) &&
          node.callee.name === importedGetName &&
          node.arguments.length === 2 &&
          (types.isThisExpression(node.arguments[0]) || catchSafeObjects) &&
          node.arguments[1].type === 'Literal' &&
          typeof node.arguments[1].value === 'number'
        ) {
          // Example: get(this, 5);
          const sourceCode = context.getSourceCode();
          reportGet({
            node,
            context,
            path: node.arguments[1].value,
            isImportedGet: true,
            objectText: sourceCode.getText(node.arguments[0]),
          });
        }

        if (
          types.isMemberExpression(node.callee) &&
          (types.isThisExpression(node.callee.object) || catchUnsafeObjects) &&
          types.isIdentifier(node.callee.property) &&
          node.callee.property.name === 'get' &&
          node.arguments.length === 1 &&
          types.isConditionalExpression(node.arguments[0]) &&
          types.isLiteral(node.arguments[0].consequent) &&
          types.isLiteral(node.arguments[0].alternate)
        ) {
          // Example: this.get(foo ? 'bar' : 'baz');
          const sourceCode = context.getSourceCode();
          reportGet({
            node,
            context,
            path: node.arguments[0],
            isImportedGet: false,
            objectText: sourceCode.getText(node.callee.object),
            useOptionalChaining,
            sourceCode,
          });
        }

        if (
          types.isIdentifier(node.callee) &&
          node.callee.name === importedGetName &&
          node.arguments.length === 2 &&
          (types.isThisExpression(node.arguments[0]) || catchSafeObjects) &&
          types.isConditionalExpression(node.arguments[1]) &&
          types.isLiteral(node.arguments[1].consequent) &&
          types.isLiteral(node.arguments[1].alternate)
        ) {
          // Example: get(foo, bar ? 'baz' : 'biz');
          const sourceCode = context.getSourceCode();
          reportGet({
            node,
            context,
            path: node.arguments[1],
            isImportedGet: true,
            objectText: sourceCode.getText(node.arguments[0]),
            useOptionalChaining,
            sourceCode,
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
          (types.isThisExpression(node.callee.object) || catchUnsafeObjects) &&
          types.isIdentifier(node.callee.property) &&
          node.callee.property.name === 'getProperties' &&
          validateGetPropertiesArguments(node.arguments, ignoreNestedPaths)
        ) {
          // Example: this.getProperties('foo', 'bar');
          const objectText = context.getSourceCode().getText(node.callee.object);
          const properties = node.arguments;
          reportGetProperties({ context, node, objectText, properties });
        }

        if (
          types.isIdentifier(node.callee) &&
          node.callee.name === importedGetPropertiesName &&
          (types.isThisExpression(node.arguments[0]) || catchSafeObjects) &&
          validateGetPropertiesArguments(node.arguments.slice(1), ignoreNestedPaths)
        ) {
          // Example: getProperties(this, 'foo', 'bar');
          const objectText = context.getSourceCode().getText(node.arguments[0]);
          const properties = node.arguments.slice(1);
          reportGetProperties({
            context,
            node,
            objectText,
            properties,
          });
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

function convertLiteralTypePath({
  path,
  useAt,
  useOptionalChaining,
  shouldIgnoreOptionalChaining,
  objectText,
}) {
  if (typeof path === 'number') {
    return `[${path}]`;
  }

  if (path.includes('.') && !useOptionalChaining && !shouldIgnoreOptionalChaining) {
    // Not safe to autofix nested properties because some properties in the path might be null or undefined.
    return null;
  }

  if (!isValidJSPath(path)) {
    // Do not autofix since the path would not be a valid JS path.
    return null;
  }

  if (path.match(/lastObject/g)?.length > 1 && !useAt) {
    // Do not autofix when multiple `lastObject` are chained, and use `at(-1)` is not allowed.
    return null;
  }

  let replacementPath = shouldIgnoreOptionalChaining ? path : path.replaceAll('.', '?.');

  // Replace any array element access (foo.1 => foo[1] or foo?.[1]).
  replacementPath = replacementPath
    .replaceAll(/\.(\d+)/g, shouldIgnoreOptionalChaining ? '[$1]' : '.[$1]') // Usages in middle of path.
    .replace(/^(\d+)\??\./, shouldIgnoreOptionalChaining ? '[$1].' : '[$1]?.') // Usage at beginning of path.
    .replace(/^(\d+)$/, '[$1]'); // Usage as entire string.

  // Replace any array element access using `firstObject` and `lastObject` (foo.firstObject => foo[0] or foo?.[0]).
  replacementPath = replacementPath
    .replaceAll('.firstObject', shouldIgnoreOptionalChaining ? '[0]' : '.[0]') // When `firstObject` is used in the middle of the path. e.g. foo.firstObject
    .replace(/^firstObject\??\./, shouldIgnoreOptionalChaining ? '[0].' : '[0]?.') // When `firstObject` is used at the beginning of the path. e.g. firstObject.bar
    .replace(/^firstObject$/, '[0]'); // When `firstObject` is used as the entire path.

  // eslint-disable-next-line unicorn/prefer-ternary
  if (useAt) {
    replacementPath = replacementPath.replaceAll('lastObject', 'at(-1)');
  } else {
    replacementPath = replacementPath
      .replace(
        /\??\.lastObject/, // When `lastObject` is used in the middle of the path. e.g. foo.lastObject
        (_, offset) =>
          `${shouldIgnoreOptionalChaining ? '' : '?.'}[${objectText}.${replacementPath.slice(
            0,
            offset
          )}.length - 1]`
      )
      .replace(
        /^lastObject\??\./, // When `lastObject` is used at the beginning of the path. e.g. lastObject.bar
        `[${objectText}.length - 1]${shouldIgnoreOptionalChaining ? '.' : '?.'}`
      )
      .replace(/^lastObject$/, `[${objectText}.length - 1]`); // When `lastObject` is used as the entire path.
  }

  const objectPathSeparator = replacementPath.startsWith('[') ? '' : '.';

  return `${objectPathSeparator}${replacementPath}`;
}
