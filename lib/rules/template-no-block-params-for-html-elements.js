const htmlTags = require('html-tags');
const svgTags = require('svg-tags');
const { mathmlTagNames } = require('mathml-tag-names');

const ELEMENT_TAGS = new Set([...htmlTags, ...svgTags, ...mathmlTagNames]);

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
  },

  create(context) {
    const sourceCode = context.sourceCode;

    return {
      GlimmerElementNode(node) {
        if (!ELEMENT_TAGS.has(node.tag)) {
          return;
        }

        // A known HTML/SVG tag can still be a component if it's bound in scope
        // (block param, import, local).
        const scope = sourceCode.getScope(node.parent);
        const isVariable = scope.references.some((ref) => ref.identifier === node.parts[0]);
        if (isVariable) {
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
