const INTERACTIVE_ELEMENTS = new Set([
  'a',
  'button',
  'details',
  'embed',
  'iframe',
  'label',
  'select',
  'textarea',
]);

const INTERACTIVE_ROLES = new Set([
  'button',
  'checkbox',
  'link',
  'searchbox',
  'spinbutton',
  'switch',
  'textbox',
  'radio',
  'slider',
  'tab',
  'menuitem',
  'menuitemcheckbox',
  'menuitemradio',
  'option',
  'combobox',
  'gridcell',
]);

function isInteractive(node) {
  if (INTERACTIVE_ELEMENTS.has(node.tag)) {
    return true;
  }

  // Check for input elements
  if (node.tag === 'input') {
    const typeAttr = node.attributes?.find((a) => a.name === 'type');
    const type = typeAttr?.value?.type === 'GlimmerTextNode' ? typeAttr.value.chars : 'text';
    // Hidden inputs are not interactive
    return type !== 'hidden';
  }

  // Check for role attribute
  const roleAttr = node.attributes?.find((a) => a.name === 'role');
  if (roleAttr?.value?.type === 'GlimmerTextNode') {
    return INTERACTIVE_ROLES.has(roleAttr.value.chars);
  }

  return false;
}

/** @type {import('eslint').Rule.RuleModule} */
module.exports = {
  meta: {
    type: 'problem',
    docs: {
      description: 'disallow nested interactive elements',
      category: 'Accessibility',
      strictGjs: true,
      strictGts: true,
      url: 'https://github.com/ember-cli/eslint-plugin-ember/tree/master/docs/rules/template-no-nested-interactive.md',
    },
    fixable: null,
    schema: [],
    messages: {
      nested:
        'Do not use <{{child}}> inside <{{parent}}>. Nested interactive elements are not accessible.',
    },
  },

  create(context) {
    const interactiveStack = [];

    return {
      GlimmerElementNode(node) {
        const isCurrentInteractive = isInteractive(node);

        if (isCurrentInteractive && interactiveStack.length > 0) {
          const parent = interactiveStack.at(-1);
          context.report({
            node,
            messageId: 'nested',
            data: {
              parent,
              child: node.tag,
            },
          });
        }

        if (isCurrentInteractive) {
          interactiveStack.push(node.tag);
        }
      },

      'GlimmerElementNode:exit'(node) {
        if (isInteractive(node)) {
          interactiveStack.pop();
        }
      },
    };
  },
};
