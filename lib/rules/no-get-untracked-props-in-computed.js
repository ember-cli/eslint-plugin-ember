'use strict';

const {
  isIdentifier,
  isStringLiteral,
  isProperty,
  isMemberExpression,
  isThisExpression
} = require('../utils/utils');

const {
  parseDependentKeys,
  isComputedDefinition
} = require('../utils/ember');

//------------------------------------------------------------------------------
// Rule Definition
//------------------------------------------------------------------------------

const rule = {
  meta: {
    docs: {
      description: 'Disallow referencing properties in computeds that aren\'t tracked in it\'s dependant keys',
      category: 'Possible Errors',
      recommended: true,
      url: 'https://github.com/ember-cli/eslint-plugin-ember/tree/master/docs/rules/no-get-untracked-props-in-computed.md'
    },
    fixable: null,
  },

  create(context) {
    let computedContext;
    let computedScopeLevel = 0;
    const inComputedScope = () => computedContext && computedScopeLevel === 1;
    const pushScope = () => computedContext && computedScopeLevel++;
    const popScope = () => computedContext && computedScopeLevel--;

    return {
      CallExpression(node) {
        const ancestors = context.getAncestors();
        const parent = ancestors[ancestors.length - 1];

        if (isComputedDefinition(node) && isProperty(parent)) {
          if (computedContext) {
            return;
          }

          computedScopeLevel = 0;
          computedContext = {
            dependantKeys: parseDependentKeys(node)
          };
        }

        if (computedContext && inComputedScope() && isPropertyGetterOnThis(node.callee)) {
          const getterKeyNode = node.arguments[0];

          // We only look at string literals, no dynamic keys
          if (!isStringLiteral(getterKeyNode)) {
            return;
          }

          const getterKey = getterKeyNode.value;

          if (!isPropertyTracked(computedContext.dependantKeys, getterKey)) {
            context.report({
              node,
              message: `Dependency '${getterKey}' is not tracked in computed's dependant keys`
            });
          }
        }
      },

      'CallExpression:exit': (node) => {
        if (isComputedDefinition(node) && computedScopeLevel === 0) {
          computedContext = null;
        }
      },

      FunctionExpression: pushScope,
      'FunctionExpression:exit': popScope,

      FunctionDeclaration: pushScope,
      'FunctionDeclaration:exit': popScope,
    };
  }
};

function isPropertyGetterOnThis(callee) {
  return (
    isMemberExpression(callee) &&
    isThisExpression(callee.object) &&
    isIdentifier(callee.property) &&
    callee.property.name === 'get'
  );
}

function isPropertyTracked(dependantKeys, property) {
  const explodedDependantKeys = explodeDependantKeys(dependantKeys);

  if (explodedDependantKeys.indexOf(property) > -1) {
    return true;
  }

  const chain = explodeProperty(property);

  if (chain.some(subset => explodedDependantKeys.indexOf(subset) > -1)) {
    return true;
  }

  return false;
}

function explodeProperty(property) {
  return property.split('.').map((node, i, chain) => chain.slice(0, i + 1).join('.'));
}

function explodeDependantKeys(dependantKeys) {
  return dependantKeys.reduce((exploded, key) => {
    // Explode 'propA.propB.[].foo.bar' into 'propA.propA' (take the root key)
    let nextKeys = key;
    const split = nextKeys.split(/\.(?:\[\]|@each)/);

    if (split.length > 1) {
      nextKeys = split[0];
    }

    return exploded.concat(nextKeys);
  }, []);
}

module.exports = Object.assign(rule, {
  explodeProperty,
  isPropertyTracked
});
