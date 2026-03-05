/** @type {import('eslint').Rule.RuleModule} */
module.exports = {
  meta: {
    type: 'suggestion',
    docs: {
      description: 'disallow potential path strings in templates',
      category: 'Best Practices',
      recommended: false,
      url: 'https://github.com/ember-cli/eslint-plugin-ember/tree/master/docs/rules/template-no-potential-path-strings.md',
      templateMode: 'both',
    },
    fixable: null,
    schema: [],
    messages: {
      noPotentialPathStrings:
        'Potential path string detected. Use dynamic values instead of path strings.',
    },
    originallyFrom: {
      name: 'ember-template-lint',
      rule: 'lib/rules/no-potential-path-strings.js',
      docs: 'docs/rule/no-potential-path-strings.md',
      tests: 'test/unit/rules/no-potential-path-strings-test.js',
    },
  },

  create(context) {
    const attrTextNodes = new WeakSet();

    return {
      GlimmerAttrNode(node) {
        if (node.value && node.value.type === 'GlimmerTextNode') {
          attrTextNodes.add(node.value);
          const text = node.value.chars;
          // Check for potential paths in attribute values:
          // - this.something (should be {{this.something}})
          // - @argName without / \ | (should be {{@argName}})
          if (/^this\.\w+/.test(text) || /^@[\w-]+$/.test(text)) {
            context.report({
              node: node.value,
              messageId: 'noPotentialPathStrings',
            });
          }
        }
      },

      GlimmerTextNode(node) {
        if (!node.chars || attrTextNodes.has(node)) {
          return;
        }

        // Check if text content looks like it could be a path (e.g., "foo.bar" or "this.foo")
        const pathPattern = /\b(this\.\w+|\w+\.\w+)\b/;
        if (pathPattern.test(node.chars)) {
          context.report({
            node,
            messageId: 'noPotentialPathStrings',
          });
        }
      },
    };
  },
};
