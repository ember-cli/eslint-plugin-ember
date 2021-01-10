'use strict';

const { ReferenceTracker, findVariable } = require('eslint-utils');
const {
  isCallExpression,
  isImportDefaultSpecifier,
  isImportSpecifier,
  isObjectPattern,
  isVariableDeclarator,
} = require('../utils/types');

//------------------------------------------------------------------------------
// General rule -  Disallow usage of jQuery
//------------------------------------------------------------------------------

const ERROR_MESSAGE = 'Do not use jQuery';

module.exports = {
  meta: {
    type: 'suggestion',
    docs: {
      description: 'disallow any usage of jQuery',
      category: 'jQuery',
      recommended: true,
      url: 'https://github.com/ember-cli/eslint-plugin-ember/tree/master/docs/rules/no-jquery.md',
    },
    fixable: null,
    schema: [],
  },

  ERROR_MESSAGE,

  create(context) {
    const report = function (node) {
      context.report(node, ERROR_MESSAGE);
    };

    return {
      /**
       * Report member expressions of jQuery
       *
       * eg; this.$.post() or this.$(body).attr()
       */
      'MemberExpression[property.name="$"][object.type="ThisExpression"]'(node) {
        if (isCallExpression(node.parent)) {
          report(node.parent);
        } else {
          report(node);
        }
      },

      /**
       * Report references of jQuery
       */
      Program() {
        const scope = context.getScope();
        const tracker = new ReferenceTracker(scope);

        const globalMap = {
          $: {
            [ReferenceTracker.READ]: true,
          },
          jQuery: {
            [ReferenceTracker.READ]: true,
          },
          Ember: {
            $: {
              [ReferenceTracker.READ]: true,
            },
          },
        };

        const esmMap = {
          jquery: {
            [ReferenceTracker.ESM]: true,
            default: {
              [ReferenceTracker.READ]: true,
            },
          },
          ember: {
            [ReferenceTracker.ESM]: true,
            default: {
              $: {
                [ReferenceTracker.READ]: true,
              },
            },
            $: {
              [ReferenceTracker.READ]: true,
            },
          },
        };

        /**
         * Global references
         * eg; $(body) and $.post()
         */
        for (const { node } of tracker.iterateGlobalReferences(globalMap)) {
          let scopeVariable;

          if (isVariableDeclarator(node.parent)) {
            // const jq = Ember.$
            scopeVariable = findVariable(scope, node.parent.id);
          } else if (isObjectPattern(node.parent)) {
            // const { $: jq } = Ember;
            scopeVariable = findVariable(scope, node.value);
          }

          if (scopeVariable) {
            // Ignore Variable Declaration
            const [, ...references] = scopeVariable.references;
            references.forEach((reference) => {
              report(reference.identifier.parent);
            });
          } else {
            report(node.parent);
          }
        }

        /**
         * ESM references
         */
        for (const { node } of tracker.iterateEsmReferences(esmMap)) {
          let scopeVariable;

          if (isImportDefaultSpecifier(node)) {
            /**
             * import $ from 'jquery'
             * $(body)
             *
             * and
             *
             * import Ember from 'ember'
             * Ember.$.post()
             */
            scopeVariable = findVariable(scope, node.local);
          } else if (isImportSpecifier(node)) {
            /**
             * import { $ } from 'ember'
             */
            scopeVariable = findVariable(scope, node.imported);
          }

          if (scopeVariable) {
            scopeVariable.references.forEach((reference) => {
              report(reference.identifier.parent);
            });
          } else {
            report(node.parent);
          }
        }
      },
    };
  },
};
