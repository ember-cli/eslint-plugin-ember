/** @type {import('eslint').Rule.RuleModule} */
module.exports = {
  meta: {
    type: 'suggestion',
    docs: {
      description: 'require quotes on all attribute values',
      category: 'Style',
      recommendedGjs: false,
      recommendedGts: false,
      url: 'https://github.com/ember-cli/eslint-plugin-ember/tree/master/docs/rules/template-no-quoteless-attributes.md',
      templateMode: 'both',
    },
    fixable: 'code',
    schema: [],
    messages: {
      missing: '{{type}} {{name}} should be either quoted or wrapped in mustaches',
    },
    originallyFrom: {
      name: 'ember-template-lint',
      rule: 'lib/rules/no-quoteless-attributes.js',
      docs: 'docs/rule/no-quoteless-attributes.md',
      tests: 'test/unit/rules/no-quoteless-attributes-test.js',
    },
  },
  create(context) {
    return {
      GlimmerAttrNode(node) {
        // Check if attribute has text value without quotes
        if (node.value?.type === 'GlimmerTextNode' && !/^["']/.test(node.value.chars)) {
          const sourceCode = context.sourceCode;
          const attrText = sourceCode.getText(node);

          // If value looks unquoted (no = or =value without quotes)
          if (/=\s*[^"'{]/.test(attrText)) {
            const type = node.name?.startsWith('@') ? 'Argument' : 'Attribute';
            context.report({
              node,
              messageId: 'missing',
              data: { type, name: node.name },
              fix(fixer) {
                const valueText = node.value.chars;
                const replacementText = `${node.name}="${valueText}"`;
                return fixer.replaceText(node, replacementText);
              },
            });
          }
        }
      },
    };
  },
};
