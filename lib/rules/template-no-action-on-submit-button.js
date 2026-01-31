/** @type {import('eslint').Rule.RuleModule} */
module.exports = {
  meta: {
    type: 'problem',
    docs: {
      description: 'disallow action attribute on submit buttons',
      category: 'Best Practices',
      strictGjs: true,
      strictGts: true,
      url: 'https://github.com/ember-cli/eslint-plugin-ember/tree/master/docs/rules/template-no-action-on-submit-button.md',
    },
    fixable: null,
    schema: [],
    messages: {
      noActionOnSubmitButton:
        'Do not use action attribute on submit buttons. Use on modifier instead or handle form submission.',
    },
  },

  create(context) {
    return {
      GlimmerElementNode(node) {
        // Check if this is a button element
        if (node.tag !== 'button' && node.tag !== 'input') {
          return;
        }

        let hasActionAttribute = false;
        let isSubmitButton = false;
        let hasNonSubmitType = false;

        for (const attr of node.attributes) {
          if (attr.type === 'GlimmerAttrNode') {
            // Check for action attribute
            if (attr.name === 'action') {
              hasActionAttribute = true;
            }
            // Check if type="submit" or no type (defaults to submit for button)
            if (attr.name === 'type') {
              const value = attr.value;
              if (value.type === 'GlimmerTextNode' && value.chars === 'submit') {
                isSubmitButton = true;
              } else if (value.type === 'GlimmerTextNode' && value.chars !== 'submit') {
                hasNonSubmitType = true;
              }
            }
          }
        }

        // For buttons, default type is submit unless explicitly set otherwise
        const isDefaultSubmitButton = node.tag === 'button' && !hasNonSubmitType && !isSubmitButton;

        if (hasActionAttribute && (isSubmitButton || isDefaultSubmitButton)) {
          context.report({
            node,
            messageId: 'noActionOnSubmitButton',
          });
        }
      },
    };
  },
};
