'use strict';

const emberUtils = require('../utils/ember');
const { getImportIdentifier } = require('../utils/import');
const Stack = require('../utils/stack');
const types = require('../utils/types');
const kebabCase = require('lodash.kebabcase');
const camelCase = require('lodash.camelcase');

const defaultServiceConfig = { serviceName: 'store', moduleNames: ['Route', 'Controller'] };

const ERROR_MESSAGE =
  'Do not rely on implicit service injections, these were deprecated in Ember 3.26 and will not work in 4.0.';

//------------------------------------------------------------------------------
// Rule Definition
//------------------------------------------------------------------------------

function fixService(fixer, currentClass, serviceInjectImportName, servicePropertyName) {
  const serviceInjectPath = kebabCase(servicePropertyName);

  return fixer.insertTextBefore(
    currentClass.node.body.body[0],
    `@${serviceInjectImportName}('${serviceInjectPath}') ${servicePropertyName};\n`
  );
}

/** @type {import('eslint').Rule.RuleModule} */
module.exports = {
  meta: {
    type: 'suggestion',
    docs: {
      description: 'enforce usage of implicit service injections',
      category: 'Deprecations',
      recommended: true,
      url: 'https://github.com/ember-cli/eslint-plugin-ember/tree/master/docs/rules/no-implicit-injections.md',
    },
    fixable: 'code',
    schema: [
      {
        type: 'object',
        properties: {
          services: {
            type: 'array',
            items: {
              type: 'object',
              default: [{ serviceName: 'store', moduleNames: ['Route', 'Controller'] }],
              properties: {
                serviceName: {
                  type: 'string',
                },
                moduleNames: {
                  type: 'array',
                  items: {
                    type: 'string',
                  },
                },
              },
            },
          },
        },
        additionalProperties: false,
      },
    ],
  },

  ERROR_MESSAGE,

  create(context) {
    const options = context.options[0] || {
      services: [defaultServiceConfig],
    };
    const servicesConfig = options.services || [defaultServiceConfig];

    // State being tracked for this file.
    let serviceInjectImportName = undefined;
    let serviceNamesWithImplicitInjection = servicesConfig;
    let isEmberModule = false;

    // State being tracked for the current class we're inside.
    const classStack = new Stack();

    // This rule does not apply to test files or non class modules
    if (emberUtils.isTestFile(context.getFilename())) {
      return {};
    }

    return {
      ImportDeclaration(node) {
        if (node.source.value === '@ember/service') {
          serviceInjectImportName =
            serviceInjectImportName || getImportIdentifier(node, '@ember/service', 'inject');
        }
      },

      ClassDeclaration(node) {
        if (emberUtils.isAnyEmberCoreModule(context, node)) {
          isEmberModule = true;

          // Get the name of services for the current module type
          const serviceNames = servicesConfig
            .filter((serviceConfig) => {
              return (
                serviceConfig.moduleNames === undefined ||
                serviceConfig.moduleNames.some((moduleName) =>
                  emberUtils.isEmberCoreModule(context, node, moduleName)
                )
              );
            })
            .map((a) => camelCase(a.serviceName));

          // Get Services that don't have properties/service injections declared
          serviceNamesWithImplicitInjection = node.body.body.reduce((accum, n) => {
            if (types.isClassPropertyOrPropertyDefinition(n)) {
              return accum.filter((serviceName) => !(serviceName === n.key.name));
            }
            return accum;
          }, serviceNames);

          classStack.push({
            node,
            serviceNamesWithImplicitInjection,
          });
        }
      },

      'ClassDeclaration:exit'(node) {
        // Leaving current (native) class.
        if (classStack.size() > 0 && classStack.peek().node === node) {
          classStack.pop();
        }
      },

      MemberExpression(node) {
        if (!isEmberModule) {
          return;
        }

        if (types.isThisExpression(node.object) && types.isIdentifier(node.property)) {
          const serviceMissingInjection = serviceNamesWithImplicitInjection.find(
            (s) => s === node.property.name
          );

          if (serviceMissingInjection) {
            context.report({
              node,
              message: ERROR_MESSAGE,
              fix(fixer) {
                const sourceCode = context.getSourceCode();
                const currentClass = classStack.peek();

                // service inject is already declared
                if (serviceInjectImportName) {
                  return fixService(
                    fixer,
                    currentClass,
                    serviceInjectImportName,
                    serviceMissingInjection
                  );
                }

                return [
                  fixer.insertTextBefore(
                    sourceCode.ast,
                    "import { inject as service } from '@ember/service';\n"
                  ),
                  fixService(fixer, currentClass, 'service', serviceMissingInjection),
                ];
              },
            });
          }
        }
      },
    };
  },
};
