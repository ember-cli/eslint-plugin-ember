'use strict';

const utils = require('../utils/utils');
const types = require('../utils/types');
const { getImportIdentifier } = require('../utils/import');
const { ReferenceTracker } = require('eslint-utils');
const { globalMap, esmMap } = require('../utils/jquery');

//------------------------------------------------------------------------------
// General rule - Don’t use jQuery without Ember Run Loop
//------------------------------------------------------------------------------

const ERROR_MESSAGE = "Don't use jQuery without Ember Run Loop";

module.exports = {
  meta: {
    type: 'problem',
    docs: {
      description: 'disallow usage of jQuery without an Ember run loop',
      category: 'jQuery',
      recommended: true,
      url:
        'https://github.com/ember-cli/eslint-plugin-ember/tree/master/docs/rules/jquery-ember-run.md',
    },
    fixable: null,
    schema: [],
  },

  ERROR_MESSAGE,

  create(context) {
    const report = function (node) {
      context.report(node, ERROR_MESSAGE);
    };

    let importedEmberName;
    let importedBindName;

    function checkJqueryCall(node) {
      if (
        // Check to see if this jquery call looks like: $(...).on(() => { ... }));
        node.parent.type === 'MemberExpression' &&
        node.parent.object === node &&
        node.parent.property.type === 'Identifier' &&
        node.parent.property.name === 'on' &&
        node.parent.parent.type === 'CallExpression'
      ) {
        const onCall = node.parent.parent;
        const fnNodes = utils.findNodes(onCall.arguments, 'ArrowFunctionExpression');
        fnNodes.forEach((fnNode) => {
          const fnBody = fnNode.body.body;
          const fnExpressions = utils.findNodes(fnBody, 'ExpressionStatement');
          fnExpressions.forEach((fnExpression) => {
            const expression = fnExpression.expression;

            // Check for imported call to: bind()
            const isBindCall =
              types.isCallExpression(expression) &&
              expression.callee.type === 'Identifier' &&
              expression.callee.name === importedBindName;

            // Check for old-style: Ember.run.bind()
            const isEmberBindCall =
              types.isCallExpression(expression) &&
              expression.callee.type === 'MemberExpression' &&
              expression.callee.property.type === 'Identifier' &&
              expression.callee.property.name === 'bind' &&
              expression.callee.object.type === 'MemberExpression' &&
              expression.callee.object.property.type === 'Identifier' &&
              expression.callee.object.property.name === 'run' &&
              expression.callee.object.object.type === 'Identifier' &&
              expression.callee.object.object.name === importedEmberName;

            if (!isBindCall && !isEmberBindCall) {
              report(expression.callee);
            }
          });
        });
      }
    }

    return {
      ImportDeclaration(node) {
        if (node.source.value === 'ember') {
          importedEmberName = importedEmberName || getImportIdentifier(node, 'ember');
        }
        if (node.source.value === '@ember/runloop') {
          importedBindName =
            importedBindName || getImportIdentifier(node, '@ember/runloop', 'bind');
        }
      },

      'Program:exit'() {
        const scope = context.getScope();
        const tracker = new ReferenceTracker(scope);

        /**
         * Global references
         *
         * eg; $(body) and $.post()
         */
        for (const { node } of tracker.iterateGlobalReferences(globalMap)) {
          checkJqueryCall(node);
        }

        /**
         * ESM references
         *   import $ from 'jquery'
         *   import { $ as jq } from 'ember'
         *
         * eg;
         *   $(body) and jq.post()
         */
        for (const { node } of tracker.iterateEsmReferences(esmMap)) {
          checkJqueryCall(node);
        }
      },
    };
  },
};
