'use strict';

const emberUtils = require('../utils/ember');
const types = require('../utils/types');

//------------------------------------------------------------------------------
// Rule Definition
//------------------------------------------------------------------------------

const PRIVATE_ROUTING_SERVICE_ERROR_MESSAGE =
  "Don't inject the private '-routing' service. Instead use the public 'router' service.";

const ROUTER_MICROLIB_ERROR_MESSAGE = "Don't access the `_routerMicrolib` as it is private API";

module.exports = {
  meta: {
    type: 'suggestion',
    docs: {
      description: 'disallow injecting the private routing service',
      category: 'Routes',
      recommended: true,
      url:
        'https://github.com/ember-cli/eslint-plugin-ember/tree/master/docs/rules/no-private-routing-service.md',
    },
    fixable: null,
    schema: [],
  },

  PRIVATE_ROUTING_SERVICE_ERROR_MESSAGE,
  ROUTER_MICROLIB_ERROR_MESSAGE,

  create(context) {
    const ROUTING_SERVICE_NAME = '-routing';
    const ROUTER_MICROLIB_NAME = '_routerMicrolib';

    return {
      Property(node) {
        if (
          emberUtils.isInjectedServiceProp(node) &&
          node.value.arguments.length > 0 &&
          node.value.arguments[0].value === ROUTING_SERVICE_NAME
        ) {
          context.report({ node, message: PRIVATE_ROUTING_SERVICE_ERROR_MESSAGE });
        }
      },

      ClassProperty(node) {
        if (!node.decorators || !types.isClassPropertyWithDecorator(node, 'service')) {
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
      },

      Literal(node) {
        if (typeof node.value === 'string' && node.value.includes(ROUTER_MICROLIB_NAME)) {
          context.report({ node, message: ROUTER_MICROLIB_ERROR_MESSAGE });
        }
      },

      Identifier(node) {
        if (node.name === ROUTER_MICROLIB_NAME) {
          context.report({ node, message: ROUTER_MICROLIB_ERROR_MESSAGE });
        }
      },
    };
  },
};
