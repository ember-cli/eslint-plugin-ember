'use strict';

const ember = require('../utils/ember');
const decoratorUtils = require('../utils/decorators');

//------------------------------------------------------------------------------
// Ember Data - Be explicit with Ember data attribute types
//------------------------------------------------------------------------------

/** @type {import('eslint').Rule.RuleModule} */
module.exports = {
  meta: {
    type: 'suggestion',
    docs: {
      description: 'disallow usage of empty attributes in Ember Data models',
      category: 'Ember Data',
      recommended: false,
      url: 'https://github.com/ember-cli/eslint-plugin-ember/tree/master/docs/rules/no-empty-attrs.md',
    },
    fixable: null,
    schema: [],
  },

  create(context) {
    const message = 'Supply proper attribute type';
    const filePath = context.filename;

    const report = function (node) {
      context.report({ node, message });
    };

    const sourceCode = context.sourceCode;
    const { scopeManager } = sourceCode;

    function reportNativeClassAttrs(node) {
      for (const property of node.body.body) {
        const attrDecorator = decoratorUtils.findDecorator(property, 'attr');

        if (!attrDecorator) {
          continue;
        }

        if (
          attrDecorator.expression.type === 'Identifier' ||
          (attrDecorator.expression.type === 'CallExpression' &&
            attrDecorator.expression.arguments.length === 0)
        ) {
          report(attrDecorator.expression);
        }
      }
    }

    return {
      CallExpression(node) {
        if (!ember.isDSModel(node, filePath)) {
          return;
        }

        const allProperties = ember.getModuleProperties(node, scopeManager);
        const isDSAttr = allProperties.filter((property) =>
          ember.isModule(property.value, 'attr', 'DS')
        );

        for (const attr of isDSAttr) {
          if (attr.value.arguments.length === 0) {
            report(attr.value);
          }
        }
      },
      ClassDeclaration(node) {
        if (!ember.isEmberDataModel(context, node)) {
          return;
        }

        reportNativeClassAttrs(node);
      },
      ClassExpression(node) {
        if (!ember.isEmberDataModel(context, node)) {
          return;
        }

        reportNativeClassAttrs(node);
      },
    };
  },
};
