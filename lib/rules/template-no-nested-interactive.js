const NATIVE_INTERACTIVE_ELEMENTS = new Set([
  'a',
  'button',
  'details',
  'embed',
  'iframe',
  'input',
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

function hasAttr(node, name) {
  return node.attributes?.some((a) => a.name === name);
}

function getTextAttr(node, name) {
  const attr = node.attributes?.find((a) => a.name === name);
  if (attr?.value?.type === 'GlimmerTextNode') {
    return attr.value.chars;
  }
  return undefined;
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
    schema: [
      {
        type: 'object',
        properties: {
          additionalInteractiveTags: { type: 'array', items: { type: 'string' } },
          ignoredTags: { type: 'array', items: { type: 'string' } },
          ignoreTabindex: { type: 'boolean' },
          ignoreUsemap: { type: 'boolean' },
        },
        additionalProperties: false,
      },
    ],
    messages: {
      nested: 'Do not nest interactive element <{{child}}> inside <{{parent}}>.',
    },
  },

  create(context) {
    const options = context.options[0] || {};
    const additionalInteractiveTags = new Set(options.additionalInteractiveTags || []);
    const ignoredTags = new Set(options.ignoredTags || []);
    const ignoreTabindex = options.ignoreTabindex || false;
    const ignoreUsemap = options.ignoreUsemap || false;

    const interactiveStack = [];

    function isInteractive(node) {
      const tag = node.tag?.toLowerCase();
      if (!tag) {
        return false;
      }
      if (ignoredTags.has(tag)) {
        return false;
      }
      if (additionalInteractiveTags.has(tag)) {
        return true;
      }

      if (NATIVE_INTERACTIVE_ELEMENTS.has(tag)) {
        if (tag === 'input') {
          const type = getTextAttr(node, 'type');
          if (type === 'hidden') {
            return false;
          }
        }
        return true;
      }

      // Check role
      const role = getTextAttr(node, 'role');
      if (role && INTERACTIVE_ROLES.has(role)) {
        return true;
      }

      // Check tabindex
      if (!ignoreTabindex && hasAttr(node, 'tabindex')) {
        return true;
      }

      // Check contenteditable
      const ce = getTextAttr(node, 'contenteditable');
      if (ce && ce !== 'false') {
        return true;
      }

      // Check usemap
      if (!ignoreUsemap && hasAttr(node, 'usemap')) {
        return true;
      }

      return false;
    }

    function getInteractiveReason(node) {
      const tag = node.tag?.toLowerCase();
      if (additionalInteractiveTags.has(tag)) {
        return 'is configured as interactive';
      }
      if (NATIVE_INTERACTIVE_ELEMENTS.has(tag)) {
        return 'is a native interactive element';
      }
      const role = getTextAttr(node, 'role');
      if (role && INTERACTIVE_ROLES.has(role)) {
        return `has role="${role}"`;
      }
      if (!ignoreTabindex && hasAttr(node, 'tabindex')) {
        return 'has tabindex';
      }
      return 'is interactive';
    }

    return {
      GlimmerElementNode(node) {
        const currentIsInteractive = isInteractive(node);

        if (currentIsInteractive && interactiveStack.length > 0) {
          const parentEntry = interactiveStack.at(-1);

          // Exception: <summary> as first child of <details>
          if (node.tag === 'summary' && parentEntry.tag === 'details') {
            // Allow but still push to track nesting below summary
          } else if (parentEntry.tag === 'label') {
            // Label can contain ONE interactive child — track and flag additional ones
            if (parentEntry.interactiveChildCount >= 1) {
              context.report({
                node,
                messageId: 'nested',
                data: { parent: parentEntry.tag, child: node.tag },
              });
            }
            parentEntry.interactiveChildCount++;
          } else {
            context.report({
              node,
              messageId: 'nested',
              data: { parent: parentEntry.tag, child: node.tag },
            });
          }
        }

        if (currentIsInteractive) {
          interactiveStack.push({ tag: node.tag, interactiveChildCount: 0 });
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
