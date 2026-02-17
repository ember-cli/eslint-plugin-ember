/** @type {import('eslint').Rule.RuleModule} */
module.exports = {
  meta: {
    type: 'suggestion',
    docs: {
      description: 'disallow autofocus attribute',
      category: 'Accessibility',
      url: 'https://github.com/ember-cli/eslint-plugin-ember/tree/master/docs/rules/template-no-autofocus-attribute.md',
    },
    fixable: 'code',
    schema: [],
    messages: {
      noAutofocus:
        'Avoid using autofocus attribute. Autofocusing elements can cause usability issues for sighted and non-sighted users.',
    },
  },

  create(context) {
    return {
      GlimmerElementNode(node) {
        const autofocusAttr = node.attributes?.find((attr) => attr.name === 'autofocus');

        if (autofocusAttr) {
          context.report({
            node: autofocusAttr,
            messageId: 'noAutofocus',
            fix(fixer) {
              // Remove the attribute including preceding whitespace
              const sourceCode = context.sourceCode;
              const text = sourceCode.getText();
              const attrStart = autofocusAttr.range[0];
              const attrEnd = autofocusAttr.range[1];

              let removeStart = attrStart;
              while (removeStart > 0 && /\s/.test(text[removeStart - 1])) {
                removeStart--;
              }

              return fixer.removeRange([removeStart, attrEnd]);
            },
          });
        }
      },
    };
  },
};
