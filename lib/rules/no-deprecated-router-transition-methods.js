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
      fixer.insertTextBefore(
        currentClass.node.body.body[0],
        `@${serviceInjectImportName}('router') router;\n`
      )
    );

    routerServicePropertyName = 'router';
  }

  return { fixSteps, routerServicePropertyName };
}

const ERROR_MESSAGE =
  'Do not rely on implicit service injections, these were deprecated in Ember 3.26 and will not work in 4.0.';

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
      recommended: false,
      url: 'https://github.com/ember-cli/eslint-plugin-ember/tree/master/docs/rules/no-deprecated-router-transition-methods.md',
    },
    fixable: 'code',
    schema: [],
  },

  ERROR_MESSAGE,

  create(context) {
    // State being tracked for this file.
    let serviceInjectImportName = undefined;
    let routerServicePropertyName = undefined;
    let isValidModule = false;

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
          for (const classMember of node.body.body) {
            if (
              decoratorUtils.isClassPropertyOrPropertyDefinitionWithDecorator(
                classMember,
                serviceInjectImportName
              )
            ) {
              const decorator = decoratorUtils.getDecorator(classMember, serviceInjectImportName);

              if (
                types.isCallExpression(decorator.expression) &&
                decorator.expression.arguments[0]
              ) {
                if (decorator.expression.arguments[0].value === 'router') {
                  routerServicePropertyName = classMember.key.name;
                }
              } else if (classMember.key.name === 'router') {
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
      },

      'ClassDeclaration:exit'(node) {
        // Leaving current (native) class.
        if (classStack.size() > 0 && classStack.peek().node === node) {
          classStack.pop();
        }
      },

      MemberExpression(node) {
        if (!isValidModule) {
          return;
        }

        const currentClass = classStack.peek();

        if (types.isThisExpression(node.object) && types.isIdentifier(node.property)) {
          // Routes should not call transitionTo or replaceWith
          const propertyName = node.property.name;

          if (
            currentClass.isRoute &&
            (propertyName === 'transitionTo' || propertyName === 'replaceWith')
          ) {
            context.report({
              node,
              message: ERROR_MESSAGE,
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
            context.report({
              node,
              message: ERROR_MESSAGE,
              fix(fixer) {
                const { routerServicePropertyName, fixSteps } = getBaseFixSteps(
                  fixer,
                  context,
                  currentClass
                );

                const replacementText =
                  propertyName === 'transitionToRoute'
                    ? `${routerServicePropertyName}.transitionTo`
                    : `${routerServicePropertyName}.replaceWith`;

                return [...fixSteps, fixer.replaceText(node.property, replacementText)];
              },
            });
          }
        }
      },
    };
  },
};
