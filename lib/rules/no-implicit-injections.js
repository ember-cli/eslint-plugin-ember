'use strict';

const assert = require('assert');
const emberUtils = require('../utils/ember');
const { getImportIdentifier } = require('../utils/import');
const Stack = require('../utils/stack');
const types = require('../utils/types');
const camelCase = require('lodash.camelcase');

const defaultServiceConfig = { service: 'store', moduleNames: ['Route', 'Controller'] };
const MODULE_TYPES = [
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
];

// ----- -------------------------------------------------------------------------
// Rule Definition
//------------------------------------------------------------------------------

function fixService(fixer, currentClass, serviceInjectImportName, failedConfig) {
  const serviceInjectPath = failedConfig.service;

  return currentClass.node.type === 'CallExpression'
    ? fixer.insertTextBefore(
        currentClass.node.arguments[0].properties[0],
        `${failedConfig.propertyName}: ${serviceInjectImportName}('${serviceInjectPath}'),\n`
      )
    : fixer.insertTextBefore(
        currentClass.node.body.body[0],
        `@${serviceInjectImportName}('${serviceInjectPath}') ${failedConfig.propertyName};\n`
      );
}

function normalizeConfiguration(denyList) {
  return denyList.map((config) => ({
    service: config.service,
    propertyName: config.propertyName ?? camelCase(config.service),
    moduleNames: config.moduleNames ?? MODULE_TYPES,
  }));
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
        required: ['denyList'],
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
                propertyName: {
                  type: 'string',
                  minLength: 1,
                },
                moduleNames: {
                  type: 'array',
                  items: {
                    enum: MODULE_TYPES,
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
        emberUtils.convertServiceNameToKebabCase(config.service) === config.service,
        'Service name should be passed in kebab-case (all lower case)'
      );

      assert(
        !config.service.includes('/') || config.propertyName,
        'Nested services must declare a property name'
      );
    }

    // State being tracked for this file.
    let serviceInjectImportName = undefined;
    const normalizedConfiguration = normalizeConfiguration(denyList);

    // State being tracked for the current class we're inside.
    const classStack = new Stack();

    // Array of posible types that could declare existing properties on native or legacy modules
    const propertyDefintionTypes = new Set([
      'Property',
      'ClassProperty',
      'PropertyDefinition',
      'MethodDefinition',
    ]);

    function onModuleFound(node) {
      // Get the name of services for the current module type
      let configToCheckFor = normalizedConfiguration.filter((serviceConfig) => {
        return (
          serviceConfig.moduleNames === undefined ||
          serviceConfig.moduleNames.some((moduleName) =>
            emberUtils.isEmberCoreModule(context, node, moduleName)
          )
        );
      });

      const modulePropertyDeclarations =
        node.type === 'CallExpression'
          ? node.arguments[node.arguments.length - 1].properties
          : node.body.body;

      // Get Services that don't have properties/service injections declared
      configToCheckFor = modulePropertyDeclarations.reduce((accum, n) => {
        if (propertyDefintionTypes.has(n.type)) {
          return accum.filter((config) => !(config.propertyName === n.key.name));
        }
        return accum;
      }, configToCheckFor);

      classStack.push({
        node,
        isEmberModule: true,
        configToCheckFor,
      });
    }

    function onClassEnter(node) {
      if (emberUtils.isAnyEmberCoreModule(context, node)) {
        onModuleFound(node);
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
      CallExpression(node) {
        if (emberUtils.isAnyEmberCoreModule(context, node) && emberUtils.isExtendObject(node)) {
          const lastExtendArg = node.arguments[node.arguments.length - 1];

          if (lastExtendArg && lastExtendArg.type === 'ObjectExpression') {
            onModuleFound(node);
          }
        }
      },

      'ClassDeclaration:exit': onClassExit,
      'ClassExpression:exit': onClassExit,
      'CallExpression:exit': onClassExit,

      MemberExpression(node) {
        const currentClass = classStack.peek();

        if (!currentClass || !currentClass.isEmberModule) {
          return;
        }

        if (types.isThisExpression(node.object) && types.isIdentifier(node.property)) {
          const failedConfig = currentClass.configToCheckFor.find(
            (s) => s.propertyName === node.property.name
          );

          if (failedConfig) {
            context.report({
              node,
              messageId: 'main',
              data: {
                serviceName: failedConfig.service,
              },
              fix(fixer) {
                const sourceCode = context.getSourceCode();

                // service inject is already declared
                if (serviceInjectImportName) {
                  return fixService(fixer, currentClass, serviceInjectImportName, failedConfig);
                }

                return [
                  fixer.insertTextBefore(
                    sourceCode.ast,
                    "import { inject as service } from '@ember/service';\n"
                  ),
                  fixService(fixer, currentClass, 'service', failedConfig),
                ];
              },
            });
          }
        }
      },
    };
  },
};
