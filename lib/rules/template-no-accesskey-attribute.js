/** @type {import('eslint').Rule.RuleModule} */
module.exports = {
  meta: {
    type: 'suggestion',
    docs: {
      description: 'disallow accesskey attribute',
      category: 'Accessibility',
      strictGjs: true,
      strictGts: true,
      url: 'https://github.com/ember-cli/eslint-plugin-ember/tree/master/docs/rules/template-no-accesskey-attribute.md',
    },
    fixable: 'code',
    schema: [],
    messages: {
      noAccesskey:
        'No access key attribute allowed. Inconsistencies between keyboard shortcuts and keyboard commands used by screenreader and keyboard only users create accessibility complications.',
    },
  },

  create(context) {
    return {
      GlimmerElementNode(node) {
        const accesskeyAttr = node.attributes?.find((attr) => attr.name === 'accesskey');

        if (accesskeyAttr) {
          context.report({
            node: accesskeyAttr,
            messageId: 'noAccesskey',
            fix(fixer) {
              // Remove the attribute including preceding whitespace
              const sourceCode = context.sourceCode;
              const text = sourceCode.getText();
              const attrStart = accesskeyAttr.range[0];
              const attrEnd = accesskeyAttr.range[1];

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
