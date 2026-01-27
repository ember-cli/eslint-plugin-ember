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
    schema: [],
    messages: {
      noInvalidInteractive:
        'Non-interactive element <{{tagName}}> should not have interactive handler "{{handler}}"',
    },
  },

  create(context) {
    const INTERACTIVE_HANDLERS = new Set([
      'onclick',
      'ondblclick',
      'onmousedown',
      'onmouseup',
      'onkeydown',
      'onkeyup',
      'onkeypress',
    ]);

    const NON_INTERACTIVE_ELEMENTS = new Set([
      'div',
      'span',
      'p',
      'section',
      'article',
      'main',
      'header',
      'footer',
      'aside',
      'nav',
      'h1',
      'h2',
      'h3',
      'h4',
      'h5',
      'h6',
      'ul',
      'ol',
      'li',
      'img',
    ]);

    return {
      GlimmerElementNode(node) {
        const tagName = node.tag.toLowerCase();

        if (!NON_INTERACTIVE_ELEMENTS.has(tagName)) {
          return;
        }

        // Check if element has role that makes it interactive
        const roleAttr = node.attributes.find(
          (attr) => attr.type === 'GlimmerAttrNode' && attr.name === 'role'
        );
        if (roleAttr && roleAttr.value && roleAttr.value.type === 'GlimmerTextNode') {
          const role = roleAttr.value.chars;
          const interactiveRoles = ['button', 'link', 'checkbox', 'radio', 'tab', 'menuitem'];
          if (interactiveRoles.includes(role)) {
            return; // Element has interactive role, so handlers are okay
          }
        }

        // Check for interactive handlers
        for (const attr of node.attributes) {
          if (attr.type === 'GlimmerAttrNode') {
            const attrName = attr.name.toLowerCase();
            if (INTERACTIVE_HANDLERS.has(attrName)) {
              context.report({
                node,
                messageId: 'noInvalidInteractive',
                data: {
                  tagName,
                  handler: attrName,
                },
              });
            }
          }
        }
      },
    };
  },
};
