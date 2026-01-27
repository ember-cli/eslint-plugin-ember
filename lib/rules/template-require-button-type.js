/** @type {import('eslint').Rule.RuleModule} */
module.exports = {
  meta: {
    type: 'problem',
    docs: {
      description: 'require button elements to have a valid type attribute',
      category: 'Best Practices',
      recommendedGjs: true,
      recommendedGts: true,
      url: 'https://github.com/ember-cli/eslint-plugin-ember/tree/master/docs/rules/template-require-button-type.md',
    },
    fixable: 'code',
    schema: [],
    messages: {
      missing: 'All `<button>` elements should have a valid `type` attribute',
      invalid: 'Button type must be "button", "submit", or "reset"',
    },
  },

  create(context) {
    const sourceCode = context.sourceCode;

    function hasParentForm(node) {
      let current = node.parent;
      while (current) {
        if (current.type === 'GlimmerElementNode' && current.tag === 'form') {
          return true;
        }
        current = current.parent;
      }
      return false;
    }

    return {
      GlimmerElementNode(node) {
        if (node.tag !== 'button') {
          return;
        }

        const typeAttr = node.attributes?.find((attr) => attr.name === 'type');

        if (!typeAttr) {
          context.report({
            node,
            messageId: 'missing',
            fix(fixer) {
              // If inside a form, default to "submit", otherwise "button"
              const defaultType = hasParentForm(node) ? 'submit' : 'button';
              
              // Find the position to insert the attribute
              const openTag = sourceCode.getText(node).match(/^<button[^>]*/)[0];
              const insertPos = node.range[0] + openTag.length;
              
              return fixer.insertTextBeforeRange([insertPos, insertPos], ` type="${defaultType}"`);
            },
          });
          return;
        }

        // Check if the type value is valid
        const value = typeAttr.value;
        if (value && value.type === 'GlimmerTextNode') {
          const typeValue = value.chars;
          if (!['button', 'submit', 'reset'].includes(typeValue)) {
            context.report({
              node: typeAttr,
              messageId: 'invalid',
              fix(fixer) {
                return fixer.replaceText(typeAttr, 'type="button"');
              },
            });
          }
        }
      },
    };
  },
};
