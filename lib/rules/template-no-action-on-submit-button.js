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
    function isInsideForm(node) {
      let current = node.parent;
      while (current) {
        if (current.type === 'GlimmerElementNode' && current.tag === 'form') {
          return true;
        }
        current = current.parent;
      }
      return false;
    }

    function isSubmitButton(node) {
      for (const attr of node.attributes || []) {
        if (
          attr.name === 'type' &&
          attr.value?.type === 'GlimmerTextNode' &&
          attr.value.chars !== 'submit'
        ) {
          return false;
        }
      }
      return true;
    }

    function hasClickHandlingModifier(node) {
      for (const mod of node.modifiers || []) {
        if (mod.path?.original === 'action') {
          // {{action ...}} defaults to click event
          const onPair = mod.hash?.pairs?.find((p) => p.key === 'on');
          if (!onPair) {
            return true;
          }
          const eventValue = onPair.value?.value ?? onPair.value?.chars;
          if (eventValue === 'click') {
            return true;
          }
        }
        if (mod.path?.original === 'on') {
          // {{on "event" handler}}
          if (
            mod.params?.length > 0 &&
            mod.params[0].value === 'click'
          ) {
            return true;
          }
        }
      }
      return false;
    }

    return {
      GlimmerElementNode(node) {
        if (node.tag !== 'button' && node.tag !== 'input') {
          return;
        }

        let hasActionAttribute = false;
        let isSubmitButtonExplicit = false;
        let hasNonSubmitType = false;

        for (const attr of node.attributes || []) {
          if (attr.type === 'GlimmerAttrNode') {
            if (attr.name === 'action') {
              hasActionAttribute = true;
            }
            if (attr.name === 'type') {
              const value = attr.value;
              if (value.type === 'GlimmerTextNode' && value.chars === 'submit') {
                isSubmitButtonExplicit = true;
              } else if (value.type === 'GlimmerTextNode' && value.chars !== 'submit') {
                hasNonSubmitType = true;
              }
            }
          }
        }

        const isDefaultSubmitButton =
          node.tag === 'button' && !hasNonSubmitType && !isSubmitButtonExplicit;

        // Existing: check for action HTML attribute on submit buttons
        if (hasActionAttribute && (isSubmitButtonExplicit || isDefaultSubmitButton)) {
          context.report({
            node,
            messageId: 'noActionOnSubmitButton',
          });
          return;
        }

        // New: check for action/on click modifiers on submit buttons inside forms
        if (
          node.tag === 'button' &&
          isSubmitButton(node) &&
          isInsideForm(node) &&
          hasClickHandlingModifier(node)
        ) {
          context.report({
            node,
            messageId: 'noActionOnSubmitButton',
          });
        }
      },
    };
  },
};
