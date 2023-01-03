'use strict';

const emberUtils = require('../utils/ember');
const decoratorUtils = require('../utils/decorators');
const types = require('../utils/types');
const { getImportIdentifier } = require('../utils/import');

//------------------------------------------------------------------------------
// Rule Definition
//------------------------------------------------------------------------------

const PRIVATE_ROUTING_SERVICE_ERROR_MESSAGE =
  "Don't inject the private '-routing' service. Instead use the public 'router' service.";

const ROUTER_MICROLIB_ERROR_MESSAGE =
  "Don't access the `_routerMicrolib` as it is a private API. Instead use the public 'router' service.";

const ROUTER_MAIN_ERROR_MESSAGE =
  "Don't access `router:main` as it is a private API. Instead use the public 'router' service.";

/** @type {import('eslint').Rule.RuleModule} */
module.exports = {
  meta: {
    type: 'suggestion',
    docs: {
      description: 'disallow injecting the private routing service',
      category: 'Routes',
      recommended: true,
      url: 'https://github.com/ember-cli/eslint-plugin-ember/tree/master/docs/rules/no-private-routing-service.md',
    },
    fixable: null,
    schema: [
      {
        type: 'object',
        properties: {
          catchRouterMicrolib: {
            type: 'boolean',
            default: true,
          },
          catchRouterMain: {
            type: 'boolean',
            default: true,
          },
        },
        additionalProperties: false,
      },
    ],
  },

  PRIVATE_ROUTING_SERVICE_ERROR_MESSAGE,
  ROUTER_MICROLIB_ERROR_MESSAGE,
  ROUTER_MAIN_ERROR_MESSAGE,

  create(context) {
    const ROUTING_SERVICE_NAME = '-routing';
    const ROUTER_MICROLIB_NAME = '_routerMicrolib';

    const catchRouterMicrolib = context.options[0] ? context.options[0].catchRouterMicrolib : true;
    const catchRouterMain = context.options[0] ? context.options[0].catchRouterMain : true;

    let importedInjectName;
    let importedEmberName;

    // Handle either ClassProperty (ESLint v7) or PropertyDefinition (ESLint v8).
    function visitClassPropertyOrPropertyDefinition(node, importedInjectName) {
      if (
        !node.decorators ||
        !decoratorUtils.isClassPropertyOrPropertyDefinitionWithDecorator(node, importedInjectName)
      ) {
        return;
      }

      const hasRoutingServiceDecorator = node.decorators.some((decorator) => {
        const expression = decorator.expression;
        return (
          expression &&
          expression.arguments &&
          expression.arguments.length > 0 &&
          expression.arguments[0].value === ROUTING_SERVICE_NAME
        );
      });

      if (hasRoutingServiceDecorator) {
        context.report({ node, message: PRIVATE_ROUTING_SERVICE_ERROR_MESSAGE });
      }
    }

    return {
      ImportDeclaration(node) {
        if (node.source.value === 'ember') {
          importedEmberName = importedEmberName || getImportIdentifier(node, 'ember');
        }
        if (node.source.value === '@ember/service') {
          importedInjectName =
            importedInjectName ||
            getImportIdentifier(node, '@ember/service', 'inject') ||
            getImportIdentifier(node, '@ember/service', 'service');
        }
      },
      Property(node) {
        if (
          emberUtils.isInjectedServiceProp(node, importedEmberName, importedInjectName) &&
          node.value.arguments.length > 0 &&
          node.value.arguments[0].value === ROUTING_SERVICE_NAME
        ) {
          context.report({ node, message: PRIVATE_ROUTING_SERVICE_ERROR_MESSAGE });
        }
      },

      ClassProperty(node) {
        visitClassPropertyOrPropertyDefinition(node, importedInjectName);
      },
      PropertyDefinition(node) {
        visitClassPropertyOrPropertyDefinition(node, importedInjectName);
      },

      Literal(node) {
        if (
          catchRouterMicrolib &&
          typeof node.value === 'string' &&
          node.value.includes(ROUTER_MICROLIB_NAME)
        ) {
          context.report({ node, message: ROUTER_MICROLIB_ERROR_MESSAGE });
        }
      },

      Identifier(node) {
        if (catchRouterMicrolib && node.name === ROUTER_MICROLIB_NAME) {
          context.report({ node, message: ROUTER_MICROLIB_ERROR_MESSAGE });
        }
      },

      CallExpression(node) {
        checkForRouterMain(node);
      },

      OptionalCallExpression(node) {
        checkForRouterMain(node);
      },
    };

    function checkForRouterMain(node) {
      // Looks for expressions like these:
      // x.lookup('router:main')
      // x.y.lookup('router:main')
      // x?.lookup('router:main')
      if (
        catchRouterMain &&
        (types.isMemberExpression(node.callee) || types.isOptionalMemberExpression(node.callee)) &&
        types.isIdentifier(node.callee.property) &&
        node.callee.property.name === 'lookup' &&
        node.arguments.length === 1 &&
        types.isLiteral(node.arguments[0]) &&
        typeof node.arguments[0].value === 'string' &&
        node.arguments[0].value === 'router:main'
      ) {
        context.report({ node, message: ROUTER_MAIN_ERROR_MESSAGE });
      }
    }
  },
};
