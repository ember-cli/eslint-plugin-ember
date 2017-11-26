/**
 * @fileoverview Ensure there are no unused dependent properties in computed properties
 * @author Alex LaFroscia
 */
"use strict";

const ARRAY_EACH_KEY_REGEX = new RegExp('@each');
const KEY_EXPANSION_REGEX = new RegExp('(.*\.){(.*)}');

/**
 * Return an array of dependent keys based on the call expression
 *
 * - Drops parts of array keys after `@each` (just too hard to track right now)
 * - Expands out any keys that are nested inside `{}`
 *
 * @param {CallExpression} callExpression
 * @return {object[]} array of objects representing dependent keys
 */
function parseDependentKeys(callExpression) {
  return callExpression.arguments
    .filter((arg) => arg.type === 'Literal')
    .map((literalNode) => {
      let key = literalNode.value;

      // Strip `@each` out of key
      if (ARRAY_EACH_KEY_REGEX.test(key)) {
        const parts = key.split('.');
        const eachIndex = parts.indexOf('@each');

        key = parts.slice(0, eachIndex).join('.');
      }

      return { key, literalNode }
    })
    .reduce((collection, dependentKey) => {
      const match = dependentKey.key.match(KEY_EXPANSION_REGEX);

      // Expand out nested keys
      if (match && match.length) {
        const prefix = match[1];
        const expandedDependentKeys = match[2].split(',').map((suffix) => ({
          key: prefix + suffix,
          literalNode: dependentKey.literalNode
        }));

        return [ ...expandedDependentKeys, ...collection ];
      } else {
        return [ dependentKey, ...collection ];
      }
    }, []);
}

//------------------------------------------------------------------------------
// Rule Definition
//------------------------------------------------------------------------------

module.exports = {
  meta: {
    docs: {
      description: "Ensure there are no unused dependent properties in computed properties",
      category: "Fill me in",
      recommended: false
    },
    fixable: null,  // or "code" or "whitespace"
    schema: [
      // fill in your schema
    ]
  },

  create(context) {
    //----------------------------------------------------------------------
    // Helpers
    //----------------------------------------------------------------------

    const sourceCode = context.getSourceCode();

    /**
     * Check if a function calls `get` on the given key
     *
     * @param {FunctionExpression} fxn the function to check
     * @param {string} dependentKey the key to look for
     * @return {boolean} whether or not it's used
     */
    function functionAccessesKey(fxn, dependentKey) {
      // TODO: Can we other types of functions too?
      if (fxn.type !== 'FunctionExpression') {
        return false;
      }

      const functionText = sourceCode.getText(fxn);
      const pattern = new RegExp(`get(.*${dependentKey}.*)`);

      return pattern.test(functionText);
    }

    function processProperty(rule) {
      const { value } = rule;

      // If the value is not a function being called, we can ignore it
      if (value.type !== "CallExpression") {
        return;
      }

      const { callee } = value;

      if (callee.name !== 'computed' && callee.name !== 'observer') {
        return;
      }

      const dependentKeys = parseDependentKeys(value);
      const callbackFunction = value.arguments[value.arguments.length - 1];

      for (const dependentKey of dependentKeys) {
        const { key, literalNode } = dependentKey;

        if (!functionAccessesKey(callbackFunction, key)) {
          context.report({
            node: literalNode,
            loc: literalNode.loc,
            message: 'Unused dependent key `{{ key }}`',
            data: { key }
          });
        }
      }
    }

    //----------------------------------------------------------------------
    // Public
    //----------------------------------------------------------------------

    return {
      'Property': processProperty
    };
  }
};
