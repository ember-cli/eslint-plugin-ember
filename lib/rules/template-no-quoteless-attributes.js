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
    },
    fixable: 'code',
    schema: [],
    messages: {
      missing: '{{type}} {{name}} should be either quoted or wrapped in mustaches',
    },
  },
  create(context) {
    return {
      GlimmerAttrNode(node) {
        // Check if attribute has text value without quotes
        if (node.value?.type === 'GlimmerTextNode' && !node.value.chars.match(/^["']/)) {
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
