/** @type {import('eslint').Rule.RuleModule} */
module.exports = {
  meta: {
    type: 'problem',
    docs: {
      description: 'disallow DOM event handler attributes',
      category: 'Best Practices',
      strictGjs: true,
      strictGts: true,
      url: 'https://github.com/ember-cli/eslint-plugin-ember/tree/master/docs/rules/template-no-inline-event-handlers.md',
    },
    fixable: null,
    schema: [],
    messages: {
      unexpected:
        'Do not use inline event handlers like "{{name}}". Use the (on) modifier instead.',
    },
  },

  create(context) {
    const EVENT_HANDLER_ATTRS = new Set([
      'onclick',
      'ondblclick',
      'onmousedown',
      'onmouseup',
      'onmousemove',
      'onmouseout',
      'onmouseover',
      'onkeydown',
      'onkeyup',
      'onkeypress',
      'onchange',
      'oninput',
      'onsubmit',
      'onfocus',
      'onblur',
      'onload',
      'onerror',
      'onscroll',
    ]);

    return {
      GlimmerElementNode(node) {
        if (node.attributes) {
          for (const attr of node.attributes) {
            if (attr.name && EVENT_HANDLER_ATTRS.has(attr.name.toLowerCase())) {
              context.report({
                node: attr,
                messageId: 'unexpected',
                data: { name: attr.name },
              });
            }
          }
        }
      },
    };
  },
};
