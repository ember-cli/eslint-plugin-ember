/** @type {import('eslint').Rule.RuleModule} */
module.exports = {
  meta: {
    type: 'problem',
    docs: {
      description: 'disallow invalid meta tags',
      category: 'Best Practices',
      url: 'https://github.com/ember-cli/eslint-plugin-ember/tree/master/docs/rules/template-no-invalid-meta.md',
    },
    fixable: null,
    schema: [],
    messages: {
      invalidCharset: 'Meta charset should be "utf-8". Found: "{{charset}}".',
      metaRefreshRedirect: 'A meta redirect should not have a delay value greater than zero.',
      metaRefreshDelay: 'A meta refresh should have a delay greater than 72000 seconds.',
      viewportUserScalable: 'A meta viewport should not restrict user-scalable.',
      viewportMaximumScale: 'A meta viewport should not set a maximum scale on content.',
      metaMissingContent:
        'A meta content attribute must be defined if the name, property, itemprop, or http-equiv attribute is defined.',
      metaMissingIdentifier:
        'A meta content attribute cannot be defined if the name, property, itemprop, nor the http-equiv attributes are defined.',
    },
    originallyFrom: {
      name: 'ember-template-lint',
      rule: 'lib/rules/no-invalid-meta.js',
      docs: 'docs/rule/no-invalid-meta.md',
      tests: 'test/unit/rules/no-invalid-meta-test.js',
    },
  },

  create(context) {
    return {
      // eslint-disable-next-line complexity
      GlimmerElementNode(node) {
        if (node.tag !== 'meta') {
          return;
        }

        function findAttr(name) {
          return node.attributes.find((a) => a.type === 'GlimmerAttrNode' && a.name === name);
        }

        function getAttrText(name) {
          const attr = findAttr(name);
          if (attr && attr.value && attr.value.type === 'GlimmerTextNode') {
            return attr.value.chars;
          }
          return undefined;
        }

        const hasCharset = Boolean(findAttr('charset'));
        const hasName = Boolean(findAttr('name'));
        const hasHttpEquiv = Boolean(findAttr('http-equiv'));
        const hasProperty = Boolean(findAttr('property'));
        const hasItemprop = Boolean(findAttr('itemprop'));
        const hasContent = Boolean(findAttr('content'));
        const hasIdentifier = hasName || hasHttpEquiv || hasProperty || hasItemprop;

        // Check for invalid charset value
        const charsetValue = getAttrText('charset');
        if (hasCharset && charsetValue) {
          const normalizedCharset = charsetValue.toLowerCase().replaceAll('-', '');
          if (normalizedCharset !== 'utf8') {
            context.report({
              node,
              messageId: 'invalidCharset',
              data: { charset: charsetValue },
            });
          }
        }

        // Check: identifier present but no content
        if (hasIdentifier && !hasContent && !hasCharset) {
          context.report({
            node,
            messageId: 'metaMissingContent',
          });
        }

        // Check: content present but no identifier or charset
        if (hasContent && !hasIdentifier && !hasCharset) {
          context.report({
            node,
            messageId: 'metaMissingIdentifier',
          });
        }

        // Check content-based validations
        const contentValue = getAttrText('content');

        if (hasContent && typeof contentValue === 'string') {
          // http-equiv="refresh" checks
          if (hasHttpEquiv) {
            if (contentValue.includes(';')) {
              // Redirect: should not have delay > 0
              if (contentValue.charAt(0) !== '0') {
                context.report({
                  node,
                  messageId: 'metaRefreshRedirect',
                });
              }
            } else {
              // Plain refresh: delay should be > 72000
              const delay = Number.parseInt(contentValue, 10);
              if (delay <= 72_000) {
                context.report({
                  node,
                  messageId: 'metaRefreshDelay',
                });
              }
            }
          }

          // Viewport checks
          const userScalableRegExp = /user-scalable(\s*?)=(\s*?)no/gim;
          if (userScalableRegExp.test(contentValue)) {
            context.report({
              node,
              messageId: 'viewportUserScalable',
            });
          }

          if (contentValue.includes('maximum-scale')) {
            context.report({
              node,
              messageId: 'viewportMaximumScale',
            });
          }
        }
      },
    };
  },
};
