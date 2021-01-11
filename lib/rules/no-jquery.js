'use strict';

const { ReferenceTracker } = require('eslint-utils');
const { isCallExpression } = require('../utils/types');
const jqueryMethods = require('../utils/jquery-methods');

//------------------------------------------------------------------------------
// General rule -  Disallow usage of jQuery
//------------------------------------------------------------------------------

const ERROR_MESSAGE = 'Do not use jQuery';

const jqueryMap = {
  [ReferenceTracker.CALL]: true,
};

for (const method of jqueryMethods) {
  jqueryMap[method] = { [ReferenceTracker.CALL]: true };
}

const globalMap = {
  $: jqueryMap,
  jQuery: jqueryMap,
};

const esmMap = {
  jquery: {
    [ReferenceTracker.ESM]: true,
    default: jqueryMap,
  },
  ember: {
    [ReferenceTracker.ESM]: true,
    default: {
      $: jqueryMap,
    },
    $: jqueryMap,
  },
};

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
