'use strict';

const emberUtils = require('../utils/ember');
const { getImportIdentifier } = require('../utils/import');
const Stack = require('../utils/stack');
const types = require('../utils/types');
const decoratorUtils = require('../utils/decorators');

function getBaseFixSteps(fixer, context, currentClass) {
  const fixSteps = [];
  const sourceCode = context.getSourceCode();
  let serviceInjectImportName = currentClass.serviceInjectImportName;
  let routerServicePropertyName = currentClass.routerServicePropertyName;

  // For now, we insert the legacy form. If we can detect the Ember version we can insert the new version instead.
  if (!serviceInjectImportName) {
    fixSteps.push(
      fixer.insertTextBefore(
        sourceCode.ast,
        "import { inject as service } from '@ember/service';\n"
      )
    );

    serviceInjectImportName = 'service';
  }

  if (!routerServicePropertyName) {
    fixSteps.push(
      currentClass.node.type === 'CallExpression'
        ? fixer.insertTextBefore(
            currentClass.node.arguments[0].properties[0],
            `router: ${serviceInjectImportName}('router'),\n`
          )
        : fixer.insertTextBefore(
            currentClass.node.body.body[0],
            `@${serviceInjectImportName}('router') router;\n`
          )
    );

    routerServicePropertyName = 'router';
  }

  return { fixSteps, routerServicePropertyName };
}

//------------------------------------------------------------------------------
// Rule Definition
//------------------------------------------------------------------------------

/** @type {import('eslint').Rule.RuleModule} */
module.exports = {
  meta: {
    type: 'suggestion',
    docs: {
      description: 'enforce usage of router service transition methods',
      category: 'Deprecations',
      recommended: true,
      url: 'https://github.com/ember-cli/eslint-plugin-ember/tree/master/docs/rules/no-deprecated-router-transition-methods.md',
    },
    fixable: 'code',
    schema: [],
    messages: {
      main: 'Calling "{{methodUsed}}" in {{moduleType}}s is deprecated, call {{desiredMethod}} on the injected router service instead.',
    },
  },

  create(context) {
    // State being tracked for this file.
    let serviceInjectImportName = undefined;
    let routerServicePropertyName = undefined;
    let isValidModule = false;

    // State being tracked for the current class we're inside.
    const classStack = new Stack();

    function onClassEnter(node) {
      if (emberUtils.isAnyEmberCoreModule(context, node)) {
        const classMembers = node.body.body;

        if (serviceInjectImportName) {
          for (const classMember of classMembers) {
            if (emberUtils.isInjectedServiceProp(classMember, undefined, serviceInjectImportName)) {
              const serviceExpression = decoratorUtils.findDecorator(
                classMember,
                serviceInjectImportName
              ).expression;

              if (serviceExpression.type === 'CallExpression') {
                if (
                  (serviceExpression.arguments.length === 0 && classMember.key.name === 'router') ||
                  (serviceExpression.arguments.length > 0 &&
                    serviceExpression.arguments[0].value === 'router')
                ) {
                  routerServicePropertyName = classMember.key.name;
                }
              } else if (classMember.key.name === 'router') {
                routerServicePropertyName = classMember.key.name;
              }
            }
          }
        }

        const isRoute = emberUtils.isEmberRoute(context, node);
        const isController = emberUtils.isEmberController(context, node);
        isValidModule = isRoute || isController;

        classStack.push({
          node,
          serviceInjectImportName,
          routerServicePropertyName,
          isValidModule,
          isRoute,
          isController,
        });
      } else {
        classStack.push({
          node,
          isValidModule: false,
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
            serviceInjectImportName ||
            getImportIdentifier(node, '@ember/service', 'inject') ||
            getImportIdentifier(node, '@ember/service', 'service');
        }
      },

      ClassDeclaration: onClassEnter,
      ClassExpression: onClassEnter,
      CallExpression(node) {
        if (emberUtils.isAnyEmberCoreModule(context, node)) {
          const lastExtendArg = node.arguments.at(-1);

          if (lastExtendArg && lastExtendArg.type === 'ObjectExpression') {
            const classMembers = lastExtendArg.properties;
            for (const classMember of classMembers) {
              if (
                emberUtils.isInjectedServiceProp(classMember, undefined, serviceInjectImportName)
              ) {
                const callExpression = classMember.value;

                if (
                  (callExpression.arguments.length === 0 && classMember.key.name === 'router') ||
                  (callExpression.arguments.length > 0 &&
                    callExpression.arguments[0].value === 'router')
                ) {
                  routerServicePropertyName = classMember.key.name;
                }
              }
            }
            const isRoute = emberUtils.isEmberRoute(context, node);
            const isController = emberUtils.isEmberController(context, node);
            isValidModule = isRoute || isController;

            classStack.push({
              node,
              serviceInjectImportName,
              routerServicePropertyName,
              isValidModule,
              isRoute,
              isController,
            });
          }
        }
      },

      'ClassDeclaration:exit': onClassExit,
      'ClassExpression:exit': onClassExit,
      'CallExpression:exit': onClassExit,

      MemberExpression(node) {
        if (!isValidModule) {
          return;
        }

        const currentClass = classStack.peek();

        if (!currentClass) {
          return;
        }

        if (types.isThisExpression(node.object) && types.isIdentifier(node.property)) {
          // Routes should not call transitionTo or replaceWith
          const propertyName = node.property.name;

          if (
            currentClass.isRoute &&
            (propertyName === 'transitionTo' || propertyName === 'replaceWith')
          ) {
            context.report({
              node,
              messageId: 'main',
              data: {
                methodUsed: propertyName,
                desiredMethod: propertyName,
                moduleType: 'Route',
              },
              fix(fixer) {
                const { routerServicePropertyName, fixSteps } = getBaseFixSteps(
                  fixer,
                  context,
                  currentClass
                );

                return [
                  ...fixSteps,
                  fixer.insertTextBefore(node.property, `${routerServicePropertyName}.`),
                ];
              },
            });
          }

          if (
            currentClass.isController &&
            (propertyName === 'transitionToRoute' || propertyName === 'replaceRoute')
          ) {
            const replacementPropertyName =
              propertyName === 'transitionToRoute' ? 'transitionTo' : 'replaceWith';
            context.report({
              node,
              messageId: 'main',
              data: {
                methodUsed: propertyName,
                desiredMethod: replacementPropertyName,
                moduleType: 'Controller',
              },
              fix(fixer) {
                const { routerServicePropertyName, fixSteps } = getBaseFixSteps(
                  fixer,
                  context,
                  currentClass
                );

                return [
                  ...fixSteps,
                  fixer.replaceText(
                    node.property,
                    `${routerServicePropertyName}.${replacementPropertyName}`
                  ),
                ];
              },
            });
          }
        }
      },
    };
  },
};
