/** @type {import('eslint').Rule.RuleModule} */
module.exports = {
  meta: {
    type: 'suggestion',
    docs: {
      description: 'disallow bare strings in templates (require translation/localization)',
      category: 'Best Practices',
      strictGjs: true,
      strictGts: true,
      url: 'https://github.com/ember-cli/eslint-plugin-ember/tree/master/docs/rules/template-no-bare-strings.md',
    },
    fixable: null,
    schema: [
      {
        type: 'object',
        properties: {
          allowlist: {
            type: 'array',
            items: {
              type: 'string',
            },
          },
          globalAttributes: {
            type: 'array',
            items: {
              type: 'string',
            },
          },
        },
        additionalProperties: false,
      },
    ],
    messages: {
      bareString:
        'Bare string "{{string}}" found in template. Use a translation helper or move to a property.',
    },
  },

  create(context) {
    const options = context.options[0] || {};
    const allowlist = new Set(options.allowlist || []);
    const globalAttributes = new Set(
      options.globalAttributes || ['title', 'aria-label', 'alt', 'placeholder']
    );

    function isAllowed(str) {
      // Allow whitespace-only strings
      if (!str.trim()) {
        return true;
      }

      // Allow strings with only punctuation and numbers
      if (/^[\s\d\p{P}]+$/u.test(str)) {
        return true;
      }

      // Check allowlist
      if (allowlist.has(str.trim())) {
        return true;
      }

      return false;
    }

    function checkTextNode(node) {
      if (node.type !== 'GlimmerTextNode') {
        return;
      }

      const text = node.chars.trim();
      if (!text || isAllowed(node.chars)) {
        return;
      }

      context.report({
        node,
        messageId: 'bareString',
        data: { string: text.slice(0, 20) + (text.length > 20 ? '...' : '') },
      });
    }

    return {
      GlimmerTextNode(node) {
        // Check if this text node is inside an attribute value
        let parent = node.parent;
        while (parent) {
          if (parent.type === 'GlimmerAttrNode') {
            // Only check if it's a global attribute
            if (globalAttributes.has(parent.name)) {
              checkTextNode(node);
            }
            return;
          }
          parent = parent.parent;
        }

        // Not in an attribute, check as regular text
        checkTextNode(node);
      },
    };
  },
};
