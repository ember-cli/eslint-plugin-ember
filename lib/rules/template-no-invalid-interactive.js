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

function hasEventHandler(node) {
  const handlers = [];
  for (const attr of node.attributes || []) {
    if (!attr.name) {
      continue;
    }
    const name = attr.name.toLowerCase();
    // Check on* attributes with dynamic values
    if (
      name.startsWith('on') &&
      name.length > 2 &&
      (attr.value?.type === 'GlimmerMustacheStatement' ||
        attr.value?.type === 'GlimmerConcatStatement')
    ) {
      handlers.push(name);
    }
  }
  // Check {{on}} and {{action}} modifiers
  for (const mod of node.modifiers || []) {
    if (mod.path?.original === 'on' || mod.path?.original === 'action') {
      handlers.push(`{{${mod.path.original}}}`);
    }
  }
  return handlers;
}

/** @type {import('eslint').Rule.RuleModule} */
module.exports = {
  meta: {
    type: 'problem',
    docs: {
      description: 'disallow non-interactive elements with interactive handlers',
      category: 'Accessibility',
      strictGjs: true,
      strictGts: true,
      url: 'https://github.com/ember-cli/eslint-plugin-ember/tree/master/docs/rules/template-no-invalid-interactive.md',
    },
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
      noInvalidInteractive:
        'Non-interactive element <{{tagName}}> should not have interactive handler "{{handler}}".',
    },
  },

  create(context) {
    const options = context.options[0] || {};
    const additionalInteractiveTags = new Set(options.additionalInteractiveTags || []);
    const ignoredTags = new Set(options.ignoredTags || []);
    const ignoreTabindex = options.ignoreTabindex || false;
    const ignoreUsemap = options.ignoreUsemap || false;

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
      'menuitem',
      'menuitemcheckbox',
      'menuitemradio',
      'option',
      'radio',
      'searchbox',
      'slider',
      'spinbutton',
      'switch',
      'tab',
      'textbox',
      'combobox',
      'gridcell',
    ]);

    function isInteractive(node) {
      const tag = node.tag?.toLowerCase();
      if (!tag) {
        return false;
      }

      if (additionalInteractiveTags.has(tag)) {
        return true;
      }
      if (NATIVE_INTERACTIVE_ELEMENTS.has(tag)) {
        // Hidden input is not interactive
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

    return {
      GlimmerElementNode(node) {
        const tag = node.tag?.toLowerCase();
        if (!tag) {
          return;
        }
        if (ignoredTags.has(tag)) {
          return;
        }

        // Skip if element is interactive
        if (isInteractive(node)) {
          return;
        }

        // Skip components (PascalCase)
        if (/^[A-Z]/.test(node.tag)) {
          return;
        }

        const handlers = hasEventHandler(node);
        for (const handler of handlers) {
          // Allow {{on "submit"}} on <form> and {{on "error"/"load"}} on <img>
          if (tag === 'form' && (handler === '{{on}}' || handler === 'onsubmit')) {
            continue;
          }
          if (tag === 'img' && handler === '{{on}}') {
            continue;
          }

          context.report({
            node,
            messageId: 'noInvalidInteractive',
            data: { tagName: tag, handler },
          });
        }
      },
    };
  },
};
