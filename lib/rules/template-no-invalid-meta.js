/** @type {import('eslint').Rule.RuleModule} */
module.exports = {
  meta: {
    type: 'problem',
    docs: {
      description: 'disallow invalid meta tags',
      category: 'Best Practices',
      strictGjs: true,
      strictGts: true,
      url: 'https://github.com/ember-cli/eslint-plugin-ember/tree/master/docs/rules/template-no-invalid-meta.md',
    },
    fixable: null,
    schema: [],
    messages: {
      invalidCharset: 'Meta charset should be "utf-8". Found: "{{charset}}".',
    },
  },

  create(context) {
    return {
      GlimmerElementNode(node) {
        // Check if this is a meta element
        if (node.tag !== 'meta') {
          return;
        }

        let hasCharset = false;
        let hasName = false;
        let charsetValue = null;

        for (const attr of node.attributes) {
          if (attr.type === 'GlimmerAttrNode') {
            if (attr.name === 'charset') {
              hasCharset = true;
              if (attr.value && attr.value.type === 'GlimmerTextNode') {
                charsetValue = attr.value.chars;
              }
            }
            if (attr.name === 'name') {
              hasName = true;
            }
          }
        }

        // Check for invalid charset value
        if (hasCharset && charsetValue) {
          const lowerCharset = charsetValue.toLowerCase();
          if (lowerCharset !== 'utf8' && lowerCharset !== 'utf-8') {
            context.report({
              node,
              messageId: 'invalidCharset',
              data: {
                charset: charsetValue,
              },
            });
          }
        }
      },
    };
  },
};
