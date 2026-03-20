/** @type {import('eslint').Rule.RuleModule} */
module.exports = {
  meta: {
    type: 'suggestion',
    docs: {
      description: 'require splattributes usage in component templates',
      category: 'Best Practices',
      recommended: false,
      url: 'https://github.com/ember-cli/eslint-plugin-ember/tree/master/docs/rules/template-require-splattributes.md',
      templateMode: 'both',
    },
    fixable: null,
    schema: [],
    messages: {
      rootElement: 'The root element in this template should use `...attributes`',
      atLeastOne: 'At least one element in this template should use `...attributes`',
    },
    originallyFrom: {
      name: 'ember-template-lint',
      rule: 'lib/rules/require-splattributes.js',
      docs: 'docs/rule/require-splattributes.md',
      tests: 'test/unit/rules/require-splattributes-test.js',
    },
  },

  create(context) {
    let foundSplattributes = false;

    return {
      GlimmerAttrNode(node) {
        if (node.name === '...attributes') {
          foundSplattributes = true;
        }
      },

      'GlimmerTemplate:exit'(node) {
        if (foundSplattributes) {
          return;
        }

        const body = node.body ?? [];
        const effectiveBody =
          body.length === 1 &&
          body[0].type === 'GlimmerElementNode' &&
          body[0].tag === 'template' &&
          Array.isArray(body[0].children)
            ? body[0].children
            : body;
        const elementNodes = effectiveBody.filter((child) => child.type === 'GlimmerElementNode');
        const significantTextNodes = effectiveBody.filter(
          (child) => child.type === 'GlimmerTextNode' && child.chars.trim() !== ''
        );
        const hasOnlyOneElement = elementNodes.length === 1 && significantTextNodes.length === 0;

        if (hasOnlyOneElement) {
          context.report({
            node: elementNodes[0],
            messageId: 'rootElement',
          });
        } else {
          context.report({
            node,
            messageId: 'atLeastOne',
          });
        }
      },
    };
  },
};
