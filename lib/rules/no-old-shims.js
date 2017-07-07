'use strict';

const oldShimsData = require('ember-rfc176-data/old-shims.json');

//------------------------------------------------------------------------------
// General rule - Don't use import paths from ember-cli-shims
//------------------------------------------------------------------------------

module.exports = {
  meta: {
    docs: {}
  },

  create(context) {
    return {
      ImportDeclaration(node) {
        const moduleName = node.source.value;
        if (!(moduleName in oldShimsData)) {
          return;
        }

        context.report(node, 'Don\'t use import paths from ember-cli-shims');
      },
    };
  }
};
