// Comprehensive Ember event handler names
const EMBER_EVENTS = new Set([
  'touchStart',
  'touchMove',
  'touchEnd',
  'touchCancel',
  'keyDown',
  'keyUp',
  'keyPress',
  'mouseDown',
  'mouseUp',
  'contextMenu',
  'click',
  'doubleClick',
  'mouseMove',
  'mouseEnter',
  'mouseLeave',
  'focusIn',
  'focusOut',
  'submit',
  'change',
  'input',
  'dragStart',
  'drag',
  'dragEnter',
  'dragLeave',
  'dragOver',
  'dragEnd',
  'drop',
]);

function isEventName(name) {
  return EMBER_EVENTS.has(name);
}

/** @type {import('eslint').Rule.RuleModule} */
module.exports = {
  meta: {
    type: 'suggestion',
    docs: {
      description: 'disallow passing event handlers directly as component arguments',
      category: 'Best Practices',
      strictGjs: true,
      strictGts: true,
      url: 'https://github.com/ember-cli/eslint-plugin-ember/tree/master/docs/rules/template-no-passed-in-event-handlers.md',
    },
    fixable: null,
    schema: [
      {
        type: 'object',
        properties: {
          ignore: {
            type: 'object',
            additionalProperties: {
              type: 'array',
              items: { type: 'string' },
            },
          },
        },
        additionalProperties: false,
      },
    ],
    messages: {
      unexpected:
        'Event handler "@{{name}}" should not be passed as a component argument. Use the `on` modifier instead.',
    },
  },

  create(context) {
    const options = context.options[0] || {};
    const ignoreConfig = options.ignore || {};

    return {
      GlimmerElementNode(node) {
        // Only check component invocations (PascalCase)
        if (!/^[A-Z]/.test(node.tag)) {
          return;
        }
        // Skip built-in Input/Textarea
        if (node.tag === 'Input' || node.tag === 'Textarea') {
          return;
        }

        if (!node.attributes) {
          return;
        }

        const ignoredAttrs = ignoreConfig[node.tag] || [];

        for (const attr of node.attributes) {
          if (!attr.name || !attr.name.startsWith('@')) {
            continue;
          }
          const argName = attr.name.slice(1);

          // Check ignore config
          if (ignoredAttrs.includes(attr.name)) {
            continue;
          }

          if (isEventName(argName)) {
            context.report({
              node: attr,
              messageId: 'unexpected',
              data: { name: argName },
            });
          }
        }
      },
    };
  },
};
