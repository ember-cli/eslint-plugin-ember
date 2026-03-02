/** @type {import('eslint').Rule.RuleModule} */
module.exports = {
  meta: {
    type: 'problem',
    docs: {
      description: 'disallow redundant `this.this` in templates',
      category: 'Best Practices',
      strictGjs: true,
      strictGts: true,
      url: 'https://github.com/ember-cli/eslint-plugin-ember/tree/master/docs/rules/template-no-chained-this.md',
    },
    fixable: 'code',
    schema: [],
    messages: {
      noChainedThis:
        'this.this.* is not allowed in templates. This is likely a mistake — remove the redundant this.',
    },
    originallyFrom: {
      name: 'ember-template-lint',
      rule: 'lib/rules/no-chained-this.js',
      docs: 'docs/rule/no-chained-this.md',
      tests: 'test/unit/rules/no-chained-this-test.js',
    },
  },

  create(context) {
    const sourceCode = context.sourceCode;

    return {
      GlimmerPathExpression(node) {
        const text = sourceCode.getText(node);
        if (!text.startsWith('this.this.')) {
          return;
        }

        const fixed = text.replace('this.this.', 'this.');

        context.report({
          node,
          messageId: 'noChainedThis',
          fix(fixer) {
            const fixes = [fixer.replaceText(node, fixed)];

            // Block statements have a closing tag path that must match
            const parent = node.parent;
            if (parent?.type === 'GlimmerBlockStatement' && parent.path === node) {
              const closingPathEnd = parent.range[1] - 2; // before '}}'
              const closingPathStart = closingPathEnd - text.length;
              fixes.push(fixer.replaceTextRange([closingPathStart, closingPathEnd], fixed));
            }

            return fixes;
          },
        });
      },
      GlimmerElementNode(node) {
        if (!node.tag?.startsWith('this.this.')) {
          return;
        }

        const fixedTag = node.tag.replace('this.this.', 'this.');

        context.report({
          node,
          messageId: 'noChainedThis',
          fix(fixer) {
            // Replace the tag name after '<'
            const openStart = node.range[0] + 1;
            return fixer.replaceTextRange([openStart, openStart + node.tag.length], fixedTag);
          },
        });
      },
    };
  },
};
