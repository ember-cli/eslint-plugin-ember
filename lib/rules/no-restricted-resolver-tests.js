'use strict';

const utils = require('../utils/utils');
const types = require('../utils/types');

//------------------------------------------------------------------------------------------------
// General Rule - Don't use constructs or configuration that use the restricted resolver in tests.
//------------------------------------------------------------------------------------------------

function getNoUnitTrueMessage(fn) {
  return `Do not use ${fn} with \`unit: true\``;
}

function getNoNeedsMessage(fn) {
  return `Do not use ${fn} with \`needs: [...]\``;
}

function getSingleStringArgumentMessage(fn) {
  return `Do not use ${fn} with a single string argument (implies unit: true)`;
}

function getNoPOJOWithoutIntegrationTrueMessage(fn) {
  return `Do not use ${fn} whose last parameter is an object unless used in conjunction with \`integration: true\``;
}

function hasOnlyStringArgument(node) {
  const ancestorMethodCall = getAncestorCallExpression(node);
  const args = ancestorMethodCall.arguments;

  return args.length === 1 && types.isLiteral(args[0]);
}

function hasUnitTrue(node) {
  return node.properties.some(
    (property) =>
      types.isProperty(property) && property.key.name === 'unit' && property.value.value === true
  );
}

function hasNeeds(node) {
  return node.properties.some(
    (property) =>
      types.isProperty(property) &&
      property.key.name === 'needs' &&
      property.value.type === 'ArrayExpression'
  );
}

function hasIntegrationTrue(node) {
  return node.properties.some(
    (property) =>
      types.isProperty(property) &&
      property.key.name === 'integration' &&
      property.value.value === true
  );
}

function getAncestorCallExpression(node) {
  return utils.getAncestor(node, (ancestor) => ancestor.type === 'CallExpression');
}

function getLastArgument(node) {
  const ancestorMethodCall = utils.getAncestor(
    node,
    (ancestor) => ancestor.type === 'CallExpression'
  );
  const args = ancestorMethodCall.arguments;
  const lastArgument = args.at(-1);

  return lastArgument;
}

/** @type {import('eslint').Rule.RuleModule} */
module.exports = {
  meta: {
    type: 'problem',
    docs: {
      description: 'disallow the use of patterns that use the restricted resolver in tests',
      category: 'Testing',
      recommended: true,
      url: 'https://github.com/ember-cli/eslint-plugin-ember/tree/master/docs/rules/no-restricted-resolver-tests.md',
    },
    fixable: null,
    schema: [],
  },

  ERROR_MESSAGES: {
    getNoUnitTrueMessage,
    getNoNeedsMessage,
    getSingleStringArgumentMessage,
    getNoPOJOWithoutIntegrationTrueMessage,
  },

  create(context) {
    let importedNames = [];

    function addToImportedNames(node) {
      importedNames = [
        ...importedNames,
        ...node.parent.specifiers.map((specifier) => specifier.imported.name),
      ];
    }

    const visitors = {
      'ImportDeclaration > Literal[value="ember-qunit"]': addToImportedNames,
      'ImportDeclaration > Literal[value="ember-mocha"]': addToImportedNames,
    };

    for (const fn of [
      'moduleFor',
      'moduleForComponent',
      'moduleForModel',
      'setupTest',
      'setupComponentTest',
      'setupModelTest',
    ]) {
      visitors[`CallExpression > Identifier[name="${fn}"]`] = function (node) {
        if (!importedNames.includes(fn)) {
          return;
        }

        if (hasOnlyStringArgument(node)) {
          context.report({ node, message: getSingleStringArgumentMessage(fn) });
          return;
        }

        const lastArgument = getLastArgument(node);
        const lastArgumentIsObject = types.isObjectExpression(lastArgument);

        if (lastArgumentIsObject && hasUnitTrue(lastArgument)) {
          context.report({ node: lastArgument, message: getNoUnitTrueMessage(fn) });
          return;
        }

        if (lastArgumentIsObject && hasNeeds(lastArgument)) {
          context.report({ node: lastArgument, message: getNoNeedsMessage(fn) });
          return;
        }

        if (lastArgumentIsObject && !hasIntegrationTrue(lastArgument)) {
          context.report({
            node: lastArgument,
            message: getNoPOJOWithoutIntegrationTrueMessage(fn),
          });
        }
      };
    }

    return visitors;
  },
};
