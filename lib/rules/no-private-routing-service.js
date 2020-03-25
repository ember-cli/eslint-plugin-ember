'use strict';

const emberUtils = require('../utils/ember');
const types = require('../utils/types');

//------------------------------------------------------------------------------
// Rule Definition
//------------------------------------------------------------------------------

const ERROR_MESSAGE =
  "Don't inject the private '-routing' service. Instead use the public 'router' service.";

module.exports = {
  meta: {
    type: 'suggestion',
    docs: {
      description: 'disallow injecting the private routing service',
      category: 'Routes',
      recommended: false,
      url:
        'https://github.com/ember-cli/eslint-plugin-ember/tree/master/docs/rules/no-private-routing-service.md',
    },
    fixable: null,
    schema: [],
  },

  ERROR_MESSAGE,

  create(context) {
    const ROUTING_SERVICE_NAME = '-routing';

    return {
      Property(node) {
        if (
          emberUtils.isInjectedServiceProp(node) &&
          node.value.arguments.length > 0 &&
          node.value.arguments[0].value === ROUTING_SERVICE_NAME
        ) {
          context.report({ node, message: ERROR_MESSAGE });
        }
      },
      ClassProperty(node) {
        if (!node.decorators || !types.isClassPropertyWithDecorator(node, 'service')) {
          return;
        }

        const hasRoutingServiceDecorator = node.decorators.some(decorator => {
          const expression = decorator.expression;
          return (
            expression &&
            expression.arguments &&
            expression.arguments.length > 0 &&
            expression.arguments[0].value === ROUTING_SERVICE_NAME
          );
        });

        if (hasRoutingServiceDecorator) {
          context.report({ node, message: ERROR_MESSAGE });
        }
      },
    };
  },
};
