'use strict';

const assert = require('assert');
const emberUtils = require('../utils/ember');
const { getImportIdentifier } = require('../utils/import');
const Stack = require('../utils/stack');
const types = require('../utils/types');
const kebabCase = require('lodash.kebabcase');
const camelCase = require('lodash.camelcase');

const defaultServiceConfig = { service: 'store', moduleNames: ['Route', 'Controller'] };

// ----- -------------------------------------------------------------------------
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
      recommended: false,
      url: 'https://github.com/ember-cli/eslint-plugin-ember/tree/master/docs/rules/no-implicit-injections.md',
    },
    fixable: 'code',
    schema: [
      {
        type: 'object',
        properties: {
          denyList: {
            minItems: 1,
            type: 'array',
            items: {
              type: 'object',
              default: [defaultServiceConfig],
              required: ['service'],
              properties: {
                service: {
                  type: 'string',
                  minLength: 1,
                },
                moduleNames: {
                  type: 'array',
                  items: {
                    enum: [
                      'Component',
                      'GlimmerComponent',
                      'Controller',
                      'Mixin',
                      'Route',
                      'Service',
                      'ArrayProxy',
                      'ObjectProxy',
                      'EmberObject',
                      'Helper',
                    ],
                  },
                },
              },
              additionalProperties: false,
            },
          },
        },
        additionalProperties: false,
      },
    ],
    messages: {
      main: 'Do not rely on implicit service injections for the "{{serviceName}}" service. Implicit service injections were deprecated in Ember 3.26 and will not work in 4.0.',
    },
  },

  create(context) {
    const options = context.options[0] || {
      denyList: [defaultServiceConfig],
    };
    const denyList = options.denyList || [defaultServiceConfig];

    for (const config of denyList) {
      assert(
        config.service.toLowerCase() === config.service,
        'Service name should be passed in kebab-case (all lower case)'
      );
    }

    // State being tracked for this file.
    let serviceInjectImportName = undefined;
    let serviceNamesWithImplicitInjection = denyList;

    // State being tracked for the current class we're inside.
    const classStack = new Stack();

    function onClassEnter(node) {
      if (emberUtils.isAnyEmberCoreModule(context, node)) {
        // Get the name of services for the current module type
        const serviceNames = denyList
          .filter((serviceConfig) => {
            return (
              serviceConfig.moduleNames === undefined ||
              serviceConfig.moduleNames.some((moduleName) =>
                emberUtils.isEmberCoreModule(context, node, moduleName)
              )
            );
          })
          .map((a) => camelCase(a.service));

        // Get Services that don't have properties/service injections declared
        serviceNamesWithImplicitInjection = node.body.body.reduce((accum, n) => {
          if (types.isClassPropertyOrPropertyDefinition(n)) {
            return accum.filter((serviceName) => !(serviceName === n.key.name));
          }
          return accum;
        }, serviceNames);

        classStack.push({
          node,
          isEmberModule: true,
          serviceNamesWithImplicitInjection,
        });
      } else {
        classStack.push({
          node,
          isEmberModule: false,
        });
      }
    }

    function onClassExit(node) {
      // Leaving current (native) class.
      if (classStack.size() > 0 && classStack.peek().node === node) {
        classStack.pop();
      }
    }

    return {
      ImportDeclaration(node) {
        if (node.source.value === '@ember/service') {
          serviceInjectImportName =
            serviceInjectImportName || getImportIdentifier(node, '@ember/service', 'inject');
        }
      },

      ClassDeclaration: onClassEnter,
      ClassExpression: onClassEnter,

      'ClassDeclaration:exit': onClassExit,
      'ClassExpression:exit': onClassExit,

      MemberExpression(node) {
        const currentClass = classStack.peek();

        if (!currentClass || !currentClass.isEmberModule) {
          return;
        }

        if (types.isThisExpression(node.object) && types.isIdentifier(node.property)) {
          const serviceMissingInjection = serviceNamesWithImplicitInjection.find(
            (s) => s === node.property.name
          );

          if (serviceMissingInjection) {
            context.report({
              node,
              messageId: 'main',
              data: {
                serviceName: kebabCase(serviceMissingInjection),
              },
              fix(fixer) {
                const sourceCode = context.getSourceCode();

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
