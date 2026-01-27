/** @type {import('eslint').Rule.RuleModule} */
module.exports = {
  meta: {
    type: 'problem',
    docs: {
      description: 'disallow aria-hidden on body element',
      category: 'Accessibility',
      recommendedGjs: true,
      recommendedGts: true,
      url: 'https://github.com/ember-cli/eslint-plugin-ember/tree/master/docs/rules/template-no-aria-hidden-body.md',
    },
    fixable: 'code',
    schema: [],
    messages: {
      noAriaHiddenBody:
        'The aria-hidden attribute should never be present on the <body> element, as it hides the entire document from assistive technology',
    },
  },

  create(context) {
    return {
      GlimmerElementNode(node) {
        if (node.tag === 'body') {
          const ariaHiddenAttr = node.attributes?.find((attr) => attr.name === 'aria-hidden');

          if (ariaHiddenAttr) {
            context.report({
              node: ariaHiddenAttr,
              messageId: 'noAriaHiddenBody',
              fix(fixer) {
                const sourceCode = context.sourceCode;
                const text = sourceCode.getText();
                const attrStart = ariaHiddenAttr.range[0];
                const attrEnd = ariaHiddenAttr.range[1];

                let removeStart = attrStart;
                while (removeStart > 0 && /\s/.test(text[removeStart - 1])) {
                  removeStart--;
                }

                return fixer.removeRange([removeStart, attrEnd]);
              },
            });
          }
        }
      },
    };
  },
};
