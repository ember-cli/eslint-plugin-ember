'use strict';

//------------------------------------------------------------------------------
// General rule - Don't use mixins
//------------------------------------------------------------------------------

const ERROR_MESSAGE = "Don't use a mixin";
const mixinPathRegex = /\/mixins\//;

module.exports = {
  meta: {
    type: 'suggestion',
    docs: {
      description: 'disallow the usage of mixins',
      category: 'Deprecations',
      recommended: true,
      url: 'https://github.com/ember-cli/eslint-plugin-ember/tree/master/docs/rules/no-mixins.md',
    },
    fixable: null,
    schema: [],
  },

  ERROR_MESSAGE,

  create(context) {
    return {
      ImportDeclaration(node) {
        const importPath = node.source.value;
        if (importPath.match(mixinPathRegex)) {
          context.report(node, ERROR_MESSAGE);
        }
      },
    };
  },
};
