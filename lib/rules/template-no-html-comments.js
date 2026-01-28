'use strict';

const { getSourceCode } = require('../utils/utils');

module.exports = {
  meta: {
    type: 'suggestion',
    docs: {
      description: 'disallow HTML comments in templates',
      category: 'Best Practices',
      url: 'https://github.com/ember-cli/eslint-plugin-ember/tree/master/docs/rules/template-no-html-comments.md',
    },
    strictGjs: true,
    strictGts: true,
    schema: [],
    messages: {
      noHtmlComments: 'HTML comments should not be used in templates. Use {{! }} or {{!-- --}} instead.',
    },
  },

  create(context) {
    const sourceCode = getSourceCode(context);

    return {
      GlimmerCommentStatement(node) {
        if (node.value && node.value.startsWith('<!--')) {
          context.report({
            node,
            messageId: 'noHtmlComments',
          });
        }
      },
    };
  },
};
