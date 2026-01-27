/** @type {import('eslint').Rule.RuleModule} */
module.exports = {
  meta: {
    type: 'problem',
    docs: {
      description: 'disallow duplicate attribute names in templates',
      category: 'Best Practices',
      recommendedGjs: true,
      recommendedGts: true,
      url: 'https://github.com/ember-cli/eslint-plugin-ember/tree/master/docs/rules/template-no-duplicate-attributes.md',
    },
    fixable: 'code',
    schema: [],
    messages: {
      duplicateElement: "Duplicate attribute '{{name}}' found in the Element.",
      duplicateBlock: "Duplicate attribute '{{name}}' found in the BlockStatement.",
      duplicateMustache: "Duplicate attribute '{{name}}' found in the MustacheStatement.",
      duplicateSubExpr: "Duplicate attribute '{{name}}' found in the SubExpression.",
    },
  },

  create(context) {
    function checkForDuplicates(node, attributes, identifier, messageId) {
      if (!attributes || attributes.length < 2) {
        return;
      }

      const seen = new Map();

      for (const attr of attributes) {
        const key = attr[identifier];
        if (seen.has(key)) {
          context.report({
            node: attr,
            messageId,
            data: { name: key },
            fix(fixer) {
              // Remove the duplicate attribute
              return fixer.remove(attr);
            },
          });
        } else {
          seen.set(key, attr);
        }
      }
    }

    return {
      GlimmerElementNode(node) {
        checkForDuplicates(node, node.attributes, 'name', 'duplicateElement');
      },

      GlimmerBlockStatement(node) {
        const attributes = node.hash?.pairs || [];
        checkForDuplicates(node, attributes, 'key', 'duplicateBlock');
      },

      GlimmerMustacheStatement(node) {
        const attributes = node.hash?.pairs || [];
        checkForDuplicates(node, attributes, 'key', 'duplicateMustache');
      },

      GlimmerSubExpression(node) {
        const attributes = node.hash?.pairs || [];
        checkForDuplicates(node, attributes, 'key', 'duplicateSubExpr');
      },
    };
  },
};
