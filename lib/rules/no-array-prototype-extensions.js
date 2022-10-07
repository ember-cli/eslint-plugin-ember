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
 * @returns {Object|[]}
 */
function applyFix(callExpressionNode, fixer, context, options = {}) {
  const calleeProp = callExpressionNode.callee.property;
  const propertyName = calleeProp.name;
  const calleeObj = callExpressionNode.callee.object;
  const callArgs = callExpressionNode.arguments;
  const sourceCode = context.getSourceCode();

  switch (propertyName) {
    case 'any': {
      return fixer.replaceText(calleeProp, 'some');
    }
    case 'compact': {
      const fixes = [];

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
    case 'findBy': {
      const fixes = [];

      if (callArgs.length > 0 && callArgs.length < 3) {
        const hasSecondArg = callArgs.length > 1;
        const firstArg = callArgs[0];
        const secondArg = callArgs[1];

        // default to `get` if the `get` hasn't already been imported.
        const importedGetName = options.importedGetName ?? 'get';

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

        fixes.push(
          fixer.replaceText(calleeProp, propertyName === 'findBy' ? 'find' : 'filter'),
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
    case 'objectAt': {
      if (callArgs.length === 1) {
        return [
          fixer.insertTextBefore(
            callExpressionNode,
            `${sourceCode.getText(calleeObj)}[${sourceCode.getText(callArgs[0])}]`
          ),
          fixer.remove(callExpressionNode),
        ];
      }

      return [];
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
    case 'without': {
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

      if (callArgs.length === 1) {
        const argText = sourceCode.getText(callArgs[0]);
        const calleeObjText = sourceCode.getText(calleeObj);

        return [
          // As per https://api.emberjs.com/ember/release/classes/EmberArray/methods/mapBy?anchor=without
          // when the passed value doesn't not exist in the array, it returns the original array
          // Hence we first check for the existence of the passed value in the array before calling filter on array
          // Used indexOf instead of includes since v3.x of ember is committed to supporting IE11
          // as per the ember browser support policy (https://emberjs.com/browser-support/)
          fixer.replaceText(calleeProp, `indexOf(${argText}) > -1 ? ${calleeObjText}.filter`),
          fixer.insertTextAfter(closeParenToken, ` : ${calleeObjText}`),
          // Replacing the content starting from open parenthesis to close parenthesis
          fixer.replaceTextRange(
            [openParenToken.range[0], closeParenToken.range[1]],
            `(item => item !== ${argText})`
          ),
        ];
      }

      return [];
    }
    default: {
      return [];
    }
  }
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

    // Track some information about the current class we're inside.
    const classStack = new Stack();

    return {
      ImportDeclaration(node) {
        if (node.source.value === '@ember/object') {
          importedGetName = importedGetName || getImportIdentifier(node, '@ember/object', 'get');
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

        if (EXTENSION_METHODS.has(node.callee.property.name)) {
          context.report({
            node,
            messageId: 'main',
            fix(fixer) {
              return applyFix(node, fixer, context, {
                importedGetName,
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
