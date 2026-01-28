'use strict';

module.exports = {
  meta: {
    type: 'suggestion',
    docs: {
      description: 'disallow unnecessary curly braces in attributes',
      category: 'Style',
      url: 'https://github.com/ember-cli/eslint-plugin-ember/tree/master/docs/rules/template-no-unnecessary-curly-in-string-attrs.md',
    },
    strictGjs: true,
    strictGts: true,
    schema: [],
    messages: {
      unnecessaryCurlyInStringAttr:
        'Unnecessary curly braces around string attribute. Use static string instead.',
    },
  },

  create(context) {
    return {
      GlimmerAttrNode(node) {
        if (
          node.value.type === 'GlimmerMustacheStatement' &&
          node.value.path.type === 'GlimmerStringLiteral'
        ) {
          context.report({
            node: node.value,
            messageId: 'unnecessaryCurlyInStringAttr',
          });
        }
      },
    };
  },
};
