const { isNativeElement } = require('../utils/is-native-element');

/** @type {import('eslint').Rule.RuleModule} */
module.exports = {
  meta: {
    type: 'problem',
    docs: {
      description: 'disallow block params on HTML elements',
      category: 'Best Practices',

      url: 'https://github.com/ember-cli/eslint-plugin-ember/tree/master/docs/rules/template-no-block-params-for-html-elements.md',
    },
    fixable: null,
    schema: [],
    messages: {
      noBlockParamsForHtmlElements:
        'Block params can only be used with components, not HTML elements.',
    },
    originallyFrom: {
      name: 'ember-template-lint',
      rule: 'lib/rules/no-block-params-for-html-elements.js',
      docs: 'docs/rule/no-block-params-for-html-elements.md',
      tests: 'test/unit/rules/no-block-params-for-html-elements-test.js',
    },
  },

  create(context) {
    const sourceCode = context.sourceCode;

    return {
      GlimmerElementNode(node) {
        if (!isNativeElement(node, sourceCode)) {
          return;
        }

        if (node.blockParams && node.blockParams.length > 0) {
          context.report({
            node,
            messageId: 'noBlockParamsForHtmlElements',
          });
        }
      },
    };
  },
};
