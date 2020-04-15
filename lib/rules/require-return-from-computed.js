'use strict';

const ember = require('../utils/ember');

//------------------------------------------------------------------------------
// General rule - Always return a value from computed properties
//------------------------------------------------------------------------------

function isReachable(segment) {
  return segment.reachable;
}

const ERROR_MESSAGE = 'Always return a value from computed properties';

module.exports = {
  meta: {
    type: 'problem',
    docs: {
      description: 'disallow missing return statements in computed properties',
      category: 'Computed Properties',
      recommended: true,
      url:
        'https://github.com/ember-cli/eslint-plugin-ember/tree/master/docs/rules/require-return-from-computed.md',
    },
    fixable: null,
    schema: [],
  },

  ERROR_MESSAGE,

  create(context) {
    const report = function (node) {
      context.report(node, ERROR_MESSAGE);
    };

    let funcInfo = {
      upper: null,
      codePath: null,
      shouldCheck: false,
      node: null,
    };

    function checkLastSegment(node) {
      if (funcInfo.shouldCheck && funcInfo.codePath.currentSegments.some(isReachable)) {
        report(node);
      }
    }

    return {
      onCodePathStart(codePath) {
        funcInfo = {
          upper: funcInfo,
          codePath,
          shouldCheck: context.getAncestors().findIndex(ember.isComputedProp) > -1,
        };
      },

      onCodePathEnd() {
        funcInfo = funcInfo.upper;
      },

      'FunctionExpression:exit'(node) {
        if (ember.isComputedProp(node.parent) || ember.isComputedProp(node.parent.parent.parent)) {
          checkLastSegment(node);
        }
      },
    };
  },
};
