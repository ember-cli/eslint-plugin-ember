/** @type {import('eslint').Rule.RuleModule} */
module.exports = {
  meta: {
    type: 'suggestion',
    docs: {
      description: 'require quotes on all attribute values',
      category: 'Style',
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
    const sourceCode = context.sourceCode;
    return {
      GlimmerAttrNode(node) {
        if (node.value?.type !== 'GlimmerTextNode') {
          return;
        }

        const valueSource = sourceCode.getText(node.value);
        if (valueSource.length === 0 || valueSource[0] === '"' || valueSource[0] === "'") {
          return;
        }

        const type = node.name?.startsWith('@') ? 'Argument' : 'Attribute';
        context.report({
          node,
          messageId: 'missing',
          data: { type, name: node.name },
          fix(fixer) {
            return fixer.replaceText(node, `${node.name}="${node.value.chars}"`);
          },
        });
      },
    };
  },
};
