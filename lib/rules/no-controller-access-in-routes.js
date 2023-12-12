'use strict';

const ember = require('../utils/ember');
const types = require('../utils/types');
const { getImportIdentifier } = require('../utils/import');

const ERROR_MESSAGE =
  'Do not access controller in route outside of setupController/resetController';

//------------------------------------------------------------------------------
// Routing - No controller access in routes
//------------------------------------------------------------------------------

/** @type {import('eslint').Rule.RuleModule} */
module.exports = {
  meta: {
    type: 'problem',
    docs: {
      description:
        'disallow routes from accessing the controller outside of setupController/resetController',
      category: 'Routes',
      recommended: true,
      url: 'https://github.com/ember-cli/eslint-plugin-ember/tree/master/docs/rules/no-controller-access-in-routes.md',
    },
    fixable: null,
    schema: [
      {
        type: 'object',
        properties: {
          allowControllerFor: {
            type: 'boolean',
            default: false,
            description:
              'Whether the rule should allow or disallow routes from accessing the controller outside of `setupController`/`resetController` via `controllerFor`.',
          },
        },
        additionalProperties: false,
      },
    ],
  },

  ERROR_MESSAGE,

  create(context) {
    const allowControllerFor = context.options[0] && context.options[0].allowControllerFor;
    let importedGetName;
    let importedGetPropertiesName;
    let currentRouteNode = null;

    return {
      ImportDeclaration(node) {
        if (node.source.value === '@ember/object') {
          importedGetName = importedGetName || getImportIdentifier(node, '@ember/object', 'get');
          importedGetPropertiesName =
            importedGetPropertiesName ||
            getImportIdentifier(node, '@ember/object', 'getProperties');
        }
      },

      ClassDeclaration(node) {
        if (ember.isEmberRoute(context, node)) {
          currentRouteNode = node;
        }
      },

      'ClassDeclaration:exit'(node) {
        if (currentRouteNode === node) {
          currentRouteNode = null;
        }
      },

      MemberExpression(node) {
        if (!currentRouteNode) {
          return;
        }

        if (
          types.isThisExpression(node.object) &&
          types.isIdentifier(node.property) &&
          node.property.name === 'controller'
        ) {
          // Example: this.controller;
          context.report({ node, message: ERROR_MESSAGE });
        }
      },

      // eslint-disable-next-line complexity
      CallExpression(node) {
        if (ember.isEmberRoute(context, node)) {
          currentRouteNode = node;
        }

        if (!currentRouteNode) {
          return;
        }

        if (
          types.isMemberExpression(node.callee) &&
          types.isThisExpression(node.callee.object) &&
          types.isIdentifier(node.callee.property) &&
          !allowControllerFor &&
          node.callee.property.name === 'controllerFor'
        ) {
          // Example this.controllerFor(...);
          context.report({ node, message: ERROR_MESSAGE });
        }

        if (
          types.isMemberExpression(node.callee) &&
          types.isThisExpression(node.callee.object) &&
          types.isIdentifier(node.callee.property) &&
          node.callee.property.name === 'get' &&
          node.arguments.length === 1 &&
          types.isStringLiteral(node.arguments[0]) &&
          node.arguments[0].value === 'controller'
        ) {
          // Example: this.get('controller');
          context.report({ node, message: ERROR_MESSAGE });
        }

        if (
          types.isIdentifier(node.callee) &&
          node.callee.name === importedGetName &&
          node.arguments.length === 2 &&
          types.isThisExpression(node.arguments[0]) &&
          types.isStringLiteral(node.arguments[1]) &&
          node.arguments[1].value === 'controller'
        ) {
          // Example: get(this, 'controller');
          context.report({ node, message: ERROR_MESSAGE });
        }

        if (
          types.isMemberExpression(node.callee) &&
          types.isThisExpression(node.callee.object) &&
          types.isIdentifier(node.callee.property) &&
          node.callee.property.name === 'getProperties' &&
          getPropertiesArgumentsIncludeController(node.arguments)
        ) {
          // Example: this.getProperties('controller');
          context.report({ node, message: ERROR_MESSAGE });
        }

        if (
          types.isIdentifier(node.callee) &&
          node.callee.name === importedGetPropertiesName &&
          types.isThisExpression(node.arguments[0]) &&
          getPropertiesArgumentsIncludeController(node.arguments.slice(1))
        ) {
          // Example: getProperties(this, 'controller');
          context.report({ node, message: ERROR_MESSAGE });
        }
      },

      'CallExpression:exit'(node) {
        if (currentRouteNode === node) {
          currentRouteNode = null;
        }
      },

      VariableDeclarator(node) {
        if (!currentRouteNode) {
          return;
        }

        if (
          !node.init ||
          node.init.type !== 'ThisExpression' ||
          !node.id ||
          node.id.type !== 'ObjectPattern'
        ) {
          return;
        }

        const controllerProperty = node.id.properties.find(
          (prop) => prop.key.type === 'Identifier' && prop.key.name === 'controller'
        );
        if (controllerProperty) {
          // Example: const { controller } = this;
          context.report({ node: controllerProperty, message: ERROR_MESSAGE });
        }
      },
    };
  },
};

function getPropertiesArgumentsIncludeController(args) {
  if (args.length === 1 && types.isArrayExpression(args[0])) {
    return getPropertiesArgumentsIncludeController(args[0].elements);
  }
  return args.find(
    (argument) => types.isStringLiteral(argument) && argument.value === 'controller'
  );
}
