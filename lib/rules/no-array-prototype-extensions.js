'use strict';

const { getName, getNodeOrNodeFromVariable } = require('../utils/utils');
const { isClassPropertyOrPropertyDefinition } = require('../utils/types');
const { getImportIdentifier } = require('../utils/import');
const { insertImportDeclaration } = require('../utils/fixer');
const Stack = require('../utils/stack');

const ERROR_MESSAGE = "Don't use Ember's array prototype extensions";
const TOKEN_TYPES = {
  PUNCTUATOR: 'Punctuator',
};

const EXTENSION_METHODS = new Set([
  /**
   * https://api.emberjs.com/ember/release/classes/EmberArray
   * EmberArray methods excluding native functions like reduce, filter etc.
   * */
  'any',
  'compact',
  'filterBy',
  'findBy',
  'getEach',
  'invoke',
  'isAny',
  'isEvery',
  'mapBy',
  'objectAt',
  'objectsAt',
  'reject',
  'rejectBy',
  'setEach',
  'sortBy',
  'toArray',
  'uniq',
  'uniqBy',
  'without',
  /**
   * https://api.emberjs.com/ember/release/classes/MutableArray
   * MutableArray methods excluding `replace`. `replace` is handled differently as it's also part of String.prototype.
   * */
  'addObject',
  'addObjects',
  'clear',
  'insertAt',
  'popObject',
  'pushObject',
  'pushObjects',
  'removeAt',
  'removeObject',
  'removeObjects',
  'reverseObjects',
  'setObject',
  'shiftObject',
  'unshiftObject',
  'unshiftObjects',
]);

const REPLACE_METHOD = 'replace';

/**
 * https://api.emberjs.com/ember/release/classes/EmberArray
 * EmberArray properties excluding native props: [], length.
 * */
const EXTENSION_PROPERTIES = new Set(['lastObject', 'firstObject']);

/**
 * Ignore these function calls.
 */
const KNOWN_NON_ARRAY_FUNCTION_CALLS = new Set([
  // Promise.reject()
  'window.Promise.reject()',
  'Promise.reject()',

  // RSVP.reject
  'RSVP.reject()',
  'RSVP.Promise.reject()',
  'Ember.RSVP.reject()',
  'Ember.RSVP.Promise.reject()',

  // Promise.any()
  'window.Promise.any()',
  'Promise.any()',

  // *storage.clear()
  'window.localStorage.clear()',
  'window.sessionStorage.clear()',
  'localStorage.clear()',
  'sessionStorage.clear()',
]);

/**
 * Ignore objects of these names.
 */
const KNOWN_NON_ARRAY_OBJECTS = new Set([
  // lodash
  '_',
  'lodash',

  // jquery
  '$()',
  'jQuery()',
  'jquery()',
]);

/**
 * Ignore variables initialized to instances of these classes.
 */
const KNOWN_NON_ARRAY_CLASSES = new Set([
  // These Set/Map data structure classes have an overlapping clear() method.
  'Set',
  'Map',
  'WeakSet',
  'WeakMap',
  // https://github.com/tracked-tools/tracked-built-ins
  'TrackedSet',
  'TrackedMap',
  'TrackedWeakSet',
  'TrackedWeakMap',
]);

/**
 * Ignore certain function calls made on variables containing certain words as they are likely to be instances of non-array classes.
 * Words stored in lowercase.
 */
const FN_NAMES_TO_KNOWN_NON_ARRAY_WORDS = new Map([
  // These Promise-related objects have an overlapping reject() method.
  ['reject', new Set(['deferred', 'promise'])],
  // These Set/Map data structure classes have an overlapping clear() method.
  ['clear', new Set(['set', 'map'])],
]);

/**
 * Return the (lowercase) list of words in a variable name of various casings (camelCase, PascalCase, snake_case, UPPER_CASE).
 * @param {string} name - variable name
 * @returns {string[]} list of (lowercase) words in the variable name
 */
function variableNameToWords(name) {
  if (name.includes('_')) {
    // snake_case, UPPER_CASE.
    return name.toLowerCase().trim().split('_');
  }

  if (name === name.toUpperCase()) {
    // Single word.
    return [name.toLowerCase()];
  }

  // camelCase, PascalCase.
  return name
    .replace(/([A-Z])/g, ' $1')
    .toLowerCase()
    .trim()
    .split(' ');
}

/**
 * Returns the fixing object if it can be fixable otherwise returns an empty array.
 *
 * @param {Object} callExpressionNode The call expression AST node.
 * @param {Object} fixer The ESLint fixer object which will be used to apply fixes.
 * @param {Object} context The ESlint context object which contains some helper utils
 * @param {Object} [options] An object that contains additional information
 * @param {String} [options.importedGetName] The name of the imported get specifier from @ember/object package
 * @param {String} [options.importedSetName] The name of the imported set specifier from @ember/object package
 * @param {String} [options.importedCompareName] The name of the imported compare specifier from @ember/utils package
 * @returns {Object|[]}
 */
// eslint-disable-next-line complexity
function applyFix(callExpressionNode, fixer, context, options = {}) {
  const calleeProp = callExpressionNode.callee.property;
  const propertyName = calleeProp.name;
  const calleeObj = callExpressionNode.callee.object;
  const callArgs = callExpressionNode.arguments;
  const sourceCode = context.getSourceCode();

  // Get the open parenthesis immediately after the callee name
  const openParenToken = sourceCode.getTokenAfter(calleeProp, {
    filter(token) {
      return token.type === TOKEN_TYPES.PUNCTUATOR && token.value === '(';
    },
  });
  // Get the close parenthesis from the end of the callExpressionNode
  const closeParenToken = sourceCode.getLastToken(callExpressionNode, {
    filter(token) {
      return token.type === TOKEN_TYPES.PUNCTUATOR && token.value === ')';
    },
  });

  switch (propertyName) {
    case 'any': {
      return fixer.replaceText(calleeProp, 'some');
    }
    case 'compact': {
      const fixes = [];

      if (openParenToken && closeParenToken && callArgs.length === 0) {
        fixes.push(
          fixer.replaceText(calleeProp, 'filter'),
          // Replacing the content starting from open parenthesis to close parenthesis
          fixer.replaceTextRange(
            [openParenToken.range[0], closeParenToken.range[1]],
            '(item => item !== undefined && item !== null)'
          )
        );
      }
      return fixes;
    }
    case 'filterBy':
    case 'findBy':
    case 'isAny':
    case 'isEvery': {
      const fixes = [];

      if (callArgs.length > 0 && callArgs.length < 3) {
        const hasSecondArg = callArgs.length > 1;
        const firstArg = callArgs[0];
        const secondArg = callArgs[1];

        let replacementMethod;

        switch (propertyName) {
          case 'findBy': {
            replacementMethod = 'find';
            break;
          }
          case 'isAny': {
            replacementMethod = 'some';
            break;
          }
          case 'isEvery': {
            replacementMethod = 'every';
            break;
          }
          default: {
            replacementMethod = 'filter';
          }
        }

        // default to `get` if the `get` hasn't already been imported.
        const importedGetName = options.importedGetName ?? 'get';

        fixes.push(
          fixer.replaceText(calleeProp, replacementMethod),
          // Replacing the content starting from open parenthesis to close parenthesis
          // If the findBy contains two arguments, the property (first argument) value will be compared against the second argument
          // If the filterBy contains only one argument, the property's truthy value is used to filter
          fixer.replaceTextRange(
            [openParenToken.range[0], closeParenToken.range[1]],
            `(item => ${importedGetName}(item, ${sourceCode.getText(firstArg)})${
              hasSecondArg ? ` === ${sourceCode.getText(secondArg)}` : ''
            })`
          )
        );

        // Add `get` import statement only if it is not imported already
        if (!options.importedGetName) {
          fixes.push(insertImportDeclaration(sourceCode, fixer, '@ember/object', importedGetName));
        }
      }

      return fixes;
    }
    case 'invoke': {
      const fixes = [];

      if (callArgs.length > 0) {
        const argText = sourceCode.getText(callArgs[0]);
        const restOfArgs = callArgs
          .slice(1)
          .map((arg) => sourceCode.getText(arg))
          .join(', ');

        // default to `get` if the `get` hasn't already been imported.
        const importedGetName = options.importedGetName ?? 'get';

        fixes.push(
          fixer.replaceText(calleeProp, 'map'),
          // Replacing the content starting from open parenthesis to close parenthesis
          fixer.replaceTextRange(
            [openParenToken.range[0], closeParenToken.range[1]],
            `(item => ${importedGetName}(item, ${argText})?.(${restOfArgs}))`
          )
        );

        // Add `get` import statement only if it is not imported already
        if (!options.importedGetName) {
          fixes.push(insertImportDeclaration(sourceCode, fixer, '@ember/object', importedGetName));
        }
      }
      return fixes;
    }
    case 'mapBy':
    case 'getEach': {
      if (callArgs.length === 1) {
        const argText = sourceCode.getText(callArgs[0]);
        const fixes = [];

        // default to `get` if the `get` hasn't already been imported.
        const importedGetName = options.importedGetName ?? 'get';

        fixes.push(
          fixer.replaceText(calleeProp, 'map'),
          // Replacing the content starting from open parenthesis to close parenthesis
          fixer.replaceTextRange(
            [openParenToken.range[0], closeParenToken.range[1]],
            `(item => ${importedGetName}(item, ${argText}))`
          )
        );

        // Add `get` import statement only if it is not imported already
        if (!options.importedGetName) {
          fixes.push(insertImportDeclaration(sourceCode, fixer, '@ember/object', importedGetName));
        }

        return fixes;
      }
      return [];
    }
    case 'objectAt': {
      if (callArgs.length === 1) {
        return [
          fixer.insertTextBefore(
            callExpressionNode,
            `${sourceCode.getText(calleeObj)}${
              callExpressionNode.callee.optional ? '?.' : ''
            }[${sourceCode.getText(callArgs[0])}]`
          ),
          fixer.remove(callExpressionNode),
        ];
      }

      return [];
    }
    case 'objectsAt': {
      if (callArgs.length > 0) {
        return [
          fixer.insertTextBefore(
            callExpressionNode,
            `[${callArgs
              .map((arg) => sourceCode.getText(arg))
              .join(', ')}].map((ind) => ${sourceCode.getText(calleeObj)}[ind])`
          ),
          fixer.remove(callExpressionNode),
        ];
      }

      return [];
    }
    case 'reject': {
      if (callArgs.length > 0 && callArgs.length < 3) {
        return [
          fixer.replaceText(calleeProp, 'filter'),
          // TODO: Switch to `Reflect.apply` once Ember v3 LTS support ends: https://emberjs.com/releases/lts/
          fixer.replaceText(
            callArgs[0],
            `function(...args) { return !(${sourceCode.getText(callArgs[0])}).apply(this, args); }`
          ),
        ];
      }
      return [];
    }
    case 'rejectBy': {
      const fixes = [];

      if (callArgs.length > 0 && callArgs.length < 3) {
        const hasSecondArg = callArgs.length > 1;
        const firstArg = callArgs[0];
        const secondArg = callArgs[1];

        // default to `get` if the `get` hasn't already been imported.
        const importedGetName = options.importedGetName ?? 'get';

        fixes.push(
          fixer.replaceText(calleeProp, 'filter'),
          // Replacing the content starting from open parenthesis to close parenthesis
          // If the findBy contains two arguments, the property (first argument) value will be compared against the second argument
          // If the filterBy contains only one argument, the property's truthy value is used to filter
          fixer.replaceTextRange(
            [openParenToken.range[0], closeParenToken.range[1]],
            hasSecondArg
              ? `(item => ${importedGetName}(item, ${sourceCode.getText(
                  firstArg
                )}) !== ${sourceCode.getText(secondArg)})`
              : `(item => !${importedGetName}(item, ${sourceCode.getText(firstArg)}))`
          )
        );

        // Add `get` import statement only if it is not imported already
        if (!options.importedGetName) {
          fixes.push(insertImportDeclaration(sourceCode, fixer, '@ember/object', importedGetName));
        }
      }
      return fixes;
    }
    case 'setEach': {
      const fixes = [];

      if (callArgs.length === 2) {
        // default to `set` if the `set` hasn't already been imported.
        const importedSetName = options.importedSetName ?? 'set';

        fixes.push(
          fixer.replaceText(calleeProp, 'forEach'),
          // Replacing the content starting from open parenthesis to close parenthesis
          fixer.replaceTextRange(
            [openParenToken.range[0], closeParenToken.range[1]],
            `(item => ${importedSetName}(item, ${callArgs
              .map((arg) => sourceCode.getText(arg))
              .join(', ')}))`
          )
        );

        // Add `set` import statement only if it is not imported already
        if (!options.importedSetName) {
          fixes.push(insertImportDeclaration(sourceCode, fixer, '@ember/object', importedSetName));
        }

        return fixes;
      }

      return [];
    }
    case 'sortBy': {
      const fixes = [];

      if (callArgs.length > 0) {
        // default to `compare` if the `compare` hasn't already been imported.
        const importedCompareName = options.importedCompareName ?? 'compare';
        // default to `compare` if the `compare` hasn't already been imported.
        const importedGetName = options.importedGetName ?? 'get';

        const argsText = callArgs.map((arg) => sourceCode.getText(arg)).join(', ');

        let sortFn;
        const comparisonFnInString = (key) =>
          `${importedCompareName}(${importedGetName}(a, ${key}), ${importedGetName}(b, ${key}))`;
        if (callArgs.length === 1 && callArgs[0].type !== 'SpreadElement') {
          sortFn =
            callArgs[0].type === 'Identifier' || callArgs[0].type === 'Literal'
              ? `(a, b) => ${comparisonFnInString(argsText)}`
              : `(a, b) => {
              const key = ${argsText};
              return ${comparisonFnInString('key')};
            }`;
        } else {
          // Loop through keys if there are more than one argument
          sortFn = `(a, b) => {
            for (const key of [${argsText}]) {
              const compareValue = ${comparisonFnInString('key')};
              if (compareValue) {
                return compareValue;
              }
            }
            return 0;
          }`;
        }

        fixes.push(
          // Duplicate array
          fixer.replaceText(calleeObj, `[...${sourceCode.getText(calleeObj)}]`),
          fixer.replaceText(calleeProp, 'sort'),
          // Replacing the content starting from open parenthesis to close parenthesis
          fixer.replaceTextRange([openParenToken.range[0], closeParenToken.range[1]], `(${sortFn})`)
        );

        // Add `get` import statement only if it is not imported already
        if (!options.importedGetName) {
          fixes.push(insertImportDeclaration(sourceCode, fixer, '@ember/object', importedGetName));
        }

        // Add `compare` import statement only if it is not imported already
        if (!options.importedCompareName) {
          fixes.push(
            insertImportDeclaration(sourceCode, fixer, '@ember/utils', importedCompareName)
          );
        }
      }

      return fixes;
    }
    case 'toArray': {
      if (callArgs.length === 0) {
        return [
          fixer.insertTextBefore(callExpressionNode, `[...${sourceCode.getText(calleeObj)}]`),
          fixer.remove(callExpressionNode),
        ];
      }

      return [];
    }
    case 'uniq': {
      if (callArgs.length === 0) {
        return [
          fixer.insertTextBefore(
            callExpressionNode,
            `[...new Set(${sourceCode.getText(calleeObj)})]`
          ),
          fixer.remove(callExpressionNode),
        ];
      }

      return [];
    }
    case 'uniqBy': {
      const fixes = [];

      if (callArgs.length === 1) {
        const argInString = sourceCode.getText(callArgs[0]);
        // default to `get` if the `get` hasn't already been imported.
        const importedGetName = options.importedGetName ?? 'get';

        let isFunctionArg;
        let isLiteralArg;

        switch (callArgs[0].type) {
          case 'ArrowFunctionExpression':
          case 'FunctionExpression': {
            isFunctionArg = true;
            break;
          }
          case 'Literal': {
            isLiteralArg = true;
            break;
          }
          default: {
            break;
          }
        }

        const uniqByFn = `([uniqArr, itemsSet, getterFn], item) => {
          const val = getterFn(item);
          if (!itemsSet.has(val)) {
            itemsSet.add(val);
            uniqArr.push(item);
          }
          return [uniqArr, itemsSet, getterFn];
        }`;

        let getterFnInText;
        if (isLiteralArg) {
          getterFnInText = `(item) => ${importedGetName}(item, ${argInString})`;
        } else if (isFunctionArg) {
          getterFnInText = argInString;
        } else {
          getterFnInText = `typeof ${argInString} === 'function' ? ${argInString} : (item) => ${importedGetName}(item, ${argInString})`;
        }

        const reducerInitialValueArr = ['[]', 'new Set()', getterFnInText];

        fixes.push(
          fixer.replaceText(calleeProp, 'reduce'),
          // Replacing the content starting from open parenthesis to close parenthesis
          fixer.replaceTextRange(
            [openParenToken.range[0], closeParenToken.range[1]],
            `(${uniqByFn}, [${reducerInitialValueArr.join(', ')}])[0]`
          )
        );

        // Add `get` import statement only if it is not imported already
        if (!options.importedGetName) {
          fixes.push(insertImportDeclaration(sourceCode, fixer, '@ember/object', importedGetName));
        }

        return fixes;
      }

      return [];
    }
    case 'without': {
      if (callArgs.length === 1) {
        const argText = sourceCode.getText(callArgs[0]);
        const calleeObjText = sourceCode.getText(calleeObj);

        return [
          // As per https://api.emberjs.com/ember/release/classes/EmberArray/methods/mapBy?anchor=without
          // when the passed value doesn't not exist in the array, it returns the original array
          // Hence we first check for the existence of the passed value in the array before calling filter on array
          // Used indexOf instead of includes since v3.x of ember is committed to supporting IE11
          // as per the ember browser support policy (https://emberjs.com/browser-support/)
          // TODO: Switch to includes once Ember v3 LTS support ends: https://emberjs.com/releases/lts/
          fixer.replaceText(calleeProp, `indexOf(${argText}) > -1 ? ${calleeObjText}.filter`),
          fixer.insertTextAfter(closeParenToken, ` : ${calleeObjText})`),
          // Replacing the content starting from open parenthesis to close parenthesis
          fixer.replaceTextRange(
            [openParenToken.range[0], closeParenToken.range[1]],
            `(item => item !== ${argText})`
          ),
          fixer.insertTextBefore(callExpressionNode, '('),
        ];
      }

      return [];
    }
    default: {
      return [];
    }
  }
}

/**
 * Check for a call on `this.store` which we can assume is the Ember Data store service.
 * We don't check for an initialization as the service could be implicitly injected: https://github.com/ember-cli/eslint-plugin-ember/blob/master/docs/rules/no-implicit-injections.md
 */
function isThisStoreCall(node) {
  return (
    node.type === 'CallExpression' &&
    node.callee.type === 'MemberExpression' &&
    node.callee.object.type === 'MemberExpression' &&
    node.callee.object.object.type === 'ThisExpression' &&
    node.callee.object.property.type === 'Identifier' &&
    node.callee.object.property.name === 'store' &&
    node.callee.property.type === 'Identifier' // Any function call on the store service.
  );
}

//----------------------------------------------------------------------------------------------
// General rule - Don't use Ember's array prototype extensions like .any(), .pushObject() or .firstObject
//----------------------------------------------------------------------------------------------

/** @type {import('eslint').Rule.RuleModule} */
module.exports = {
  meta: {
    type: 'suggestion',
    docs: {
      description: "disallow usage of Ember's `Array` prototype extensions",
      category: 'Deprecations',
      recommended: false,
      url: 'https://github.com/ember-cli/eslint-plugin-ember/tree/master/docs/rules/no-array-prototype-extensions.md',
    },
    fixable: 'code',
    schema: [],
    messages: {
      main: ERROR_MESSAGE,
    },
  },

  create(context) {
    const sourceCode = context.getSourceCode();
    const { scopeManager } = sourceCode;
    let importedGetName;
    let importedSetName;
    let importedCompareName;
    let importedEmberArrayName;

    // Track some information about the current class we're inside.
    const classStack = new Stack();

    return {
      ImportDeclaration(node) {
        if (node.source.value === '@ember/object') {
          importedGetName = importedGetName || getImportIdentifier(node, '@ember/object', 'get');
          importedSetName = importedSetName || getImportIdentifier(node, '@ember/object', 'set');
        }
        if (node.source.value === '@ember/utils') {
          importedCompareName =
            importedCompareName || getImportIdentifier(node, '@ember/utils', 'compare');
        }
        if (node.source.value === '@ember/array') {
          importedEmberArrayName =
            importedEmberArrayName || getImportIdentifier(node, '@ember/array', 'A');
        }
      },
      /**
       * Cover cases when `EXTENSION_METHODS` is getting called.
       * Example: something.filterBy();
       * @param {Object} node
       */
      // eslint-disable-next-line complexity
      CallExpression(node) {
        // Skip case: filterBy();
        if (node.callee.type !== 'MemberExpression') {
          return;
        }

        // Skip case: this.filterBy(); super.filterBy();
        if (['ThisExpression', 'Super'].includes(node.callee.object.type)) {
          return;
        }

        if (node.callee.property.type !== 'Identifier') {
          return;
        }

        const name = getName(node, true);
        const nameParts = name.split('.');
        if (
          KNOWN_NON_ARRAY_FUNCTION_CALLS.has(name) ||
          KNOWN_NON_ARRAY_OBJECTS.has(nameParts[nameParts.length - 2])
        ) {
          // Ignore any known non-array objects/function calls to reduce false positives.
          return;
        }

        for (const functionName of FN_NAMES_TO_KNOWN_NON_ARRAY_WORDS.keys()) {
          const words = FN_NAMES_TO_KNOWN_NON_ARRAY_WORDS.get(functionName);
          if (
            nameParts[nameParts.length - 1] === `${functionName}()` &&
            variableNameToWords(nameParts[nameParts.length - 2]).some((word) => words.has(word))
          ) {
            // We found a function call on a variable whose name contains a word that indicates this variable is not an array.
            return;
          }
        }

        const nodeInitializedTo = getNodeOrNodeFromVariable(node.callee.object, scopeManager);
        if (
          nodeInitializedTo.type === 'NewExpression' &&
          nodeInitializedTo.callee.type === 'Identifier' &&
          KNOWN_NON_ARRAY_CLASSES.has(nodeInitializedTo.callee.name)
        ) {
          // Ignore when we can tell the variable was initialized to an instance of a non-array class.
          // Example: const foo = new Set();
          return;
        }

        if (
          (nodeInitializedTo.type === 'AwaitExpression' &&
            isThisStoreCall(nodeInitializedTo.argument)) ||
          isThisStoreCall(nodeInitializedTo)
        ) {
          // Found call on the Ember Data this.store class.
          return;
        }

        if (
          node.callee.type === 'MemberExpression' &&
          node.callee.object.type === 'MemberExpression' &&
          node.callee.object.object.type === 'ThisExpression' &&
          ['Identifier', 'PrivateIdentifier', 'PrivateName'].includes(
            node.callee.object.property.type
          ) &&
          classStack.peek() &&
          classStack.peek().classPropertiesToIgnore.has(
            node.callee.object.property.type === 'Identifier'
              ? node.callee.object.property.name
              : `#${node.callee.object.property.name}` // Add # for private properties to avoid confusing public/private properties.
          )
        ) {
          // Ignore when we can tell the class property was initialized to an instance of a non-array class.
          // Example:
          /*
          class MyClass {
            foo = new Set();
            myFunc() { this.foo.clear() }
          }
          */
          return;
        }

        // Direct usage of `@ember/array` is allowed.
        if (
          node.type === 'CallExpression' &&
          importedEmberArrayName &&
          nodeInitializedTo.type === 'CallExpression' &&
          nodeInitializedTo.callee.type === 'Identifier' &&
          importedEmberArrayName === nodeInitializedTo.callee.name
        ) {
          return;
        }

        if (EXTENSION_METHODS.has(node.callee.property.name)) {
          context.report({
            node,
            messageId: 'main',
            fix(fixer) {
              return applyFix(node, fixer, context, {
                importedCompareName,
                importedGetName,
                importedSetName,
              });
            },
          });
        }

        // Example: someArray.replace(1, 2, [1, 2, 3]);
        // We can differentiate String.prototype.replace and Array.prototype.replace by arguments length
        // String.prototype.replace can only have 2 arguments, Array.prototype.replace needs to have exact 3 arguments
        if (node.callee.property.name === REPLACE_METHOD && node.arguments.length === 3) {
          context.report({ node, messageId: 'main' });
        }
      },

      /**
       * Cover cases when `EXTENSION_PROPERTIES` is accessed like:
       * foo.firstObject;
       * bar.lastObject.bar;
       * @param {Object} node
       */
      MemberExpression(node) {
        // Skip case when EXTENSION_PROPERTIES is accessed through callee.
        // Example: something.firstObject()
        if (node.parent.type === 'CallExpression') {
          return;
        }

        if (node.property.type !== 'Identifier') {
          return;
        }
        if (EXTENSION_PROPERTIES.has(node.property.name)) {
          context.report({ node, messageId: 'main' });
        }
      },

      /**
       * Cover cases when `EXTENSION_PROPERTIES` is accessed through literals like:
       * get(something, 'foo.firstObject');
       * set(something, 'lastObject.bar', 'something');
       * @param {Object} node
       */
      Literal(node) {
        // Generate regexp for extension properties.
        // new RegExp(`${[...EXTENSION_PROPERTIES].map(prop => `(\.|^)${prop}(\.|$)`).join('|')}`) won't generate \. correctly
        const regexp = /(\.|^)firstObject(\.|$)|(\.|^)lastObject(\.|$)/;

        if (typeof node.value === 'string' && regexp.test(node.value)) {
          context.report({ node, messageId: 'main' });
        }
      },

      ClassDeclaration(node) {
        // Keep track of class properties to ignore because we know they were initialized to an instance of a non-array class.
        const classPropertiesToIgnore = new Set(
          node.body.body
            .filter(
              (n) =>
                // ClassProperty / ClassPrivateProperty / PrivateName are for ESLint v7.
                (isClassPropertyOrPropertyDefinition(n) || n.type === 'ClassPrivateProperty') &&
                ['Identifier', 'PrivateIdentifier', 'PrivateName'].includes(n.key.type) &&
                n.value &&
                n.value.type === 'NewExpression' &&
                n.value.callee.type === 'Identifier' &&
                KNOWN_NON_ARRAY_CLASSES.has(n.value.callee.name)
            )
            .map((n) => (n.key.type === 'Identifier' ? n.key.name : `#${n.key.name}`)) // Add # for private properties to avoid confusing public/private properties.
        );

        classStack.push({ node, classPropertiesToIgnore });
      },

      'ClassDeclaration:exit'() {
        // Leaving the current class.
        classStack.pop();
      },
    };
  },
};
