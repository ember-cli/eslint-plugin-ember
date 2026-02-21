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

const DISALLOWED_DOM_EVENTS = new Set([
  // Mouse events:
  'click',
  'dblclick',
  'mousedown',
  'mousemove',
  'mouseover',
  'mouseout',
  'mouseup',
  // Keyboard events:
  'keydown',
  'keypress',
  'keyup',
]);

const ELEMENT_ALLOWED_EVENTS = {
  form: new Set(['submit', 'reset', 'change']),
  img: new Set(['load', 'error']),
};

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
      'canvas',
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

        const allowedEvents = ELEMENT_ALLOWED_EVENTS[tag];

        // Check attributes
        for (const attr of node.attributes || []) {
          const attrName = attr.name?.toLowerCase();
          if (!attrName || attrName.startsWith('@')) {
            continue;
          }

          const isDynamic =
            attr.value?.type === 'GlimmerMustacheStatement' ||
            attr.value?.type === 'GlimmerConcatStatement';
          if (!isDynamic) {
            continue;
          }

          const isOnAttr = attrName.startsWith('on') && attrName.length > 2;
          const event = isOnAttr ? attrName.slice(2) : null;

          // Allow element-specific events (e.g. submit/reset/change on form, load/error on img)
          if (isOnAttr && event && allowedEvents?.has(event)) {
            continue;
          }

          const isActionHelper =
            attr.value?.type === 'GlimmerMustacheStatement' &&
            attr.value.path?.original === 'action';

          // Flag {{action}} helper used in any attribute on a non-interactive element
          if (isActionHelper) {
            context.report({
              node,
              messageId: 'noInvalidInteractive',
              data: { tagName: tag, handler: attrName },
            });
            continue;
          }

          // Flag disallowed DOM events (click, mousedown, keydown, etc.) with dynamic values
          if (isOnAttr && DISALLOWED_DOM_EVENTS.has(event)) {
            context.report({
              node,
              messageId: 'noInvalidInteractive',
              data: { tagName: tag, handler: attrName },
            });
          }
        }

        // Check modifiers
        for (const mod of node.modifiers || []) {
          const modName = mod.path?.original;

          if (modName === 'on') {
            const eventParam = mod.params?.[0];
            const event =
              eventParam?.type === 'GlimmerStringLiteral' ? eventParam.value : undefined;

            // Allow element-specific events
            if (event && allowedEvents?.has(event)) {
              continue;
            }
            // Allow non-disallowed events (scroll, copy, toggle, pause, etc.)
            if (event && !DISALLOWED_DOM_EVENTS.has(event)) {
              continue;
            }

            context.report({
              node,
              messageId: 'noInvalidInteractive',
              data: { tagName: tag, handler: '{{on}}' },
            });
          } else if (modName === 'action') {
            // Determine the event from on= hash param (default: 'click')
            let event = 'click';
            const onPair = mod.hash?.pairs?.find((p) => p.key === 'on');
            if (onPair) {
              event = onPair.value?.value || onPair.value?.original || 'click';
            }

            // Allow element-specific events
            if (allowedEvents?.has(event)) {
              continue;
            }

            context.report({
              node,
              messageId: 'noInvalidInteractive',
              data: { tagName: tag, handler: '{{action}}' },
            });
          }
        }
      },
    };
  },
};
