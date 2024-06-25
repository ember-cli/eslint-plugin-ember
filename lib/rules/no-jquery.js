'use strict';

const { ReferenceTracker } = require('eslint-utils');
const { isCallExpression } = require('../utils/types');
const { globalMap, esmMap } = require('../utils/jquery');

//------------------------------------------------------------------------------
// General rule -  Disallow usage of jQuery
//------------------------------------------------------------------------------

const ERROR_MESSAGE = 'Do not use jQuery';

/** @type {import('eslint').Rule.RuleModule} */
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
      context.report({ node, message: ERROR_MESSAGE });
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
      Program(node) {
        const sourceCode = context.sourceCode ?? context.getSourceCode();
        const scope = sourceCode.getScope ? sourceCode.getScope(node) : context.getScope();

        const tracker = new ReferenceTracker(scope);

        /**
         * Global references
         *
         * eg; $(body) and $.post()
         */
        for (const { node } of tracker.iterateGlobalReferences(globalMap)) {
          report(node);
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
          report(node);
        }
      },
    };
  },
};
