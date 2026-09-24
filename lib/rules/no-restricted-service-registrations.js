'use strict';

const assert = require('assert');
const emberUtils = require('../utils/ember');
const {getImportIdentifier} = require('../utils/import');

const DEFAULT_ERROR_MESSAGE = 'Registering this service is not allowed';
const DEFAULT_RESTRICTED_REGISTRATIONS = ['router'];

/**
 * @type {import('eslint').Rule.RuleModule}
 */
module.exports = {
  meta: {
    type: 'suggestion',
    docs: {
      description: 'disallow registering certain services under certain paths',
      category: 'Services',
      url: 'https://github.com/ember-cli/eslint-plugin-ember/tree/master/docs/rules/no-restricted-service-registrations.md',
    },
    schema: {
      type: 'array',
      uniqueItems: true,
      minItems: 1,
      items: [
        {
          type: 'object',
          required: ['services'],
          properties: {
            services: {
              type: 'array',
              uniqueItems: true,
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
    if (!emberUtils.isTestFile(context.getFilename())) {
      return {};
    }

    // Validate options.
    for (const option of context.options) {
      for (const service of option.services) {
        assert(
          service.toLowerCase() === service,
          'Service name should be passed in kebab-case (all lower case)'
        );
      }
    }

    function checkForViolationAndReport(node, serviceName) {
      const serviceNameKebabCase = emberUtils.convertServiceNameToKebabCase(serviceName); // splitting is used to avoid converting folder/ to folder-

      for (const denylist of denylists) {
        // Denylist services are always passed in in kebab-case, so we can do a kebab-case comparison.
        if (denylist.services.includes(serviceNameKebabCase)) {
          context.report({
            node,
            message: denylist.message || DEFAULT_ERROR_MESSAGE,
          });
        }
      }
    }

    let getContextName;
    let potentials = [];

    return {
      ImportDeclaration(node) {
        if (node.source.value === '@ember/test-helpers') {
          getContextName = getContextName || getImportIdentifier(node, 'getContext');
        }
      },

      MemberExpression(node) {
        if (node.object.name === 'owner' && node.property.name === 'register') {
          potentials.push(node);
        }

      },

      CallExpression(node) {
        potentials = [];
      },

      'CallExpression:exit'(node) {
        for (let potential of potentials) {
          let first = node.arguments[0].value;

          let [namespace, name] = first.split(':');

          if (namespace !== 'service') {
            return;
          }

          if (name === 'router') {
            context.report({
              node,
              message: `Cannot register the router service`,
            });
          }
        }
      }

    };
  },
};
