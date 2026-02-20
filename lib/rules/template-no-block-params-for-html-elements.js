/** @type {import('eslint').Rule.RuleModule} */
const htmlTags = require('html-tags');

module.exports = {
  meta: {
    type: 'problem',
    docs: {
      description: 'disallow block params on HTML elements',
      category: 'Best Practices',
      strictGjs: true,
      strictGts: true,
      url: 'https://github.com/ember-cli/eslint-plugin-ember/tree/master/docs/rules/template-no-block-params-for-html-elements.md',
    },
    fixable: null,
    schema: [],
    messages: {
      noBlockParamsForHtmlElements:
        'Block params can only be used with components, not HTML elements.',
    },
  },

  create(context) {
    const sourceCode = context.sourceCode;
    const HTML_ELEMENTS = new Set(htmlTags);

    return {
      GlimmerElementNode(node) {
        // Check if this is an HTML element (lowercase)
        if (!HTML_ELEMENTS.has(node.tag)) {
          return;
        }

        // If the tag name is a variable in scope, it's being used as a component, not an HTML element
        const scope = sourceCode.getScope(node.parent);
        const isVariable = scope.references.some((ref) => ref.identifier === node.parts[0]);
        if (isVariable) {
          return;
        }

        // Check for block params
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
