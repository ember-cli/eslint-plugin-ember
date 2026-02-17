/** @type {import('eslint').Rule.RuleModule} */
module.exports = {
  meta: {
    type: 'problem',
    docs: {
      description: 'disallow `accesskey` attribute on HTML elements in templates',
      category: 'Best Practices',
      url: 'https://github.com/ember-cli/eslint-plugin-ember/tree/master/docs/rules/template-no-accesskey-attribute.md',
    },
    fixable: 'code',
    schema: [],
    messages: {
      noAccesskey:
        'No access key attribute allowed. Inconsistencies between keyboard shortcuts and keyboard comments used by screenreader and keyboard only users create a11y complications.',
    },
  },

  create(context) {
    const sourceCode = context.sourceCode;

    return {
      GlimmerElementNode(node) {
        if (!node.attributes) {
          return;
        }

        const accessKeyAttr = node.attributes.find(
          (attr) =>
            attr.type === 'GlimmerAttrNode' &&
            attr.name &&
            attr.name === 'accesskey'
        );

        if (accessKeyAttr) {
          context.report({
            node: accessKeyAttr,
            messageId: 'noAccesskey',
            fix(fixer) {
              // Get the range of the attribute
              const attrStart = accessKeyAttr.range[0];
              const attrEnd = accessKeyAttr.range[1];

              // Check if there's whitespace before the attribute that should be removed
              const sourceText = sourceCode.getText();
              let removeStart = attrStart;
              
              // Look for preceding whitespace
              while (removeStart > 0 && /\s/.test(sourceText[removeStart - 1])) {
                removeStart--;
                // Stop if we hit a non-whitespace character that's not right before the attribute
                if (sourceText[removeStart] === '\n' || sourceText[removeStart] === '\r') {
                  // Don't remove newlines, just spaces/tabs on the same line
                  const beforeNewline = removeStart;
                  while (removeStart > 0 && /[\t ]/.test(sourceText[removeStart - 1])) {
                    removeStart--;
                  }
                  if (sourceText[removeStart] === '\n' || sourceText[removeStart] === '\r') {
                    // If there's a newline, keep one space before
                    removeStart = beforeNewline;
                  }
                  break;
                }
              }

              // For simple case, just remove preceding space if it exists
              removeStart = attrStart > 0 && sourceText[attrStart - 1] === ' ' ? attrStart - 1 : attrStart;

              return fixer.removeRange([removeStart, attrEnd]);
            },
          });
        }
      },
    };
  },
};
