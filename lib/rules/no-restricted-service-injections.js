'use strict';

const kebabCase = require('lodash.kebabcase');
const assert = require('assert');
const emberUtils = require('../utils/ember');
const decoratorUtils = require('../utils/decorators');

const DEFAULT_ERROR_MESSAGE = 'Injecting this service is not allowed from this file.';

module.exports = {
  meta: {
    type: 'suggestion',
    docs: {
      description: 'disallow injecting certain services under certain paths',
      category: 'Miscellaneous',
      url:
        'https://github.com/ember-cli/eslint-plugin-ember/tree/master/docs/rules/no-restricted-service-injections.md',
    },
    schema: {
      type: 'array',
      minItems: 1,
      items: [
        {
          type: 'object',
          required: ['services'],
          properties: {
            paths: {
              type: 'array',
              minItems: 1,
              items: {
                type: 'string',
              },
            },
            services: {
              type: 'array',
              minItems: 1,
              items: {
                type: 'string',
              },
            },
            message: {
              type: 'string',
            },
          },
          additionalProperties: false,
        },
      ],
    },
  },

  DEFAULT_ERROR_MESSAGE,

  create(context) {
    // Validate options.
    context.options.forEach((option) =>
      option.services.forEach((service) =>
        assert(
          service.toLowerCase() === service,
          'Service name should be passed in kebab-case (all lower case)'
        )
      )
    );

    // Find matching denylist entries for this file path.
    const denylists = context.options.filter(
      (option) => !option.paths || option.paths.some((path) => context.getFilename().match(path))
    );

    if (denylists.length === 0) {
      return {};
    }

    function checkForViolationAndReport(node, serviceName) {
      const serviceNameKebabCase = serviceName.split('/').map(kebabCase).join('/'); // splitting is used to avoid converting folder/ to folder-

      denylists.forEach((denylist) => {
        // Denylist services are always passed in in kebab-case, so we can do a kebab-case comparison.
        if (denylist.services.includes(serviceNameKebabCase)) {
          context.report({
            node,
            message: denylist.message || DEFAULT_ERROR_MESSAGE,
          });
        }
      });
    }

    return {
      // Handles:
      // * myService: service()
      // * propertyName: service('myService')
      Property(node) {
        if (!emberUtils.isInjectedServiceProp(node)) {
          return;
        }

        const callExpression = node.value;

        // Get the service name either from the string argument or from the property name.
        if (callExpression.arguments && callExpression.arguments.length > 0) {
          if (
            callExpression.arguments[0].type === 'Literal' &&
            typeof callExpression.arguments[0].value === 'string'
          ) {
            // The service name is the string argument.
            checkForViolationAndReport(node, callExpression.arguments[0].value);
          } else {
            // Ignore this case since the argument is not a string.
          }
        } else {
          // The service name is the property name.
          checkForViolationAndReport(node, node.key.name);
        }
      },

      // Handles:
      // * @service myService
      // * @service() myService
      // * @service('myService') propertyName
      ClassProperty(node) {
        if (!emberUtils.isInjectedServiceProp(node)) {
          return;
        }

        // Find the service decorator.
        const serviceDecorator = decoratorUtils.findDecorator(node, 'service');

        // Get the service name either from the string argument or from the property name.
        const serviceName =
          serviceDecorator.expression.type === 'CallExpression' &&
          serviceDecorator.expression.arguments &&
          serviceDecorator.expression.arguments.length === 1 &&
          serviceDecorator.expression.arguments[0].type === 'Literal' &&
          typeof serviceDecorator.expression.arguments[0].value === 'string'
            ? serviceDecorator.expression.arguments[0].value
            : node.key.name;

        checkForViolationAndReport(node, serviceName);
      },
    };
  },
};
