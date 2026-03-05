/** @type {import('eslint').Rule.RuleModule} */
const htmlTags = require('html-tags');

module.exports = {
  meta: {
    type: 'problem',
    docs: {
      description: 'disallow @arguments on HTML elements',
      category: 'Best Practices',
      url: 'https://github.com/ember-cli/eslint-plugin-ember/tree/master/docs/rules/template-no-arguments-for-html-elements.md',
      templateMode: 'both',
    },
    fixable: null,
    schema: [],
    messages: {
      noArgumentsForHtmlElements:
        '@arguments can only be used on components, not HTML elements. Use regular attributes instead.',
    },
    originallyFrom: {
      name: 'ember-template-lint',
      rule: 'lib/rules/no-arguments-for-html-elements.js',
      docs: 'docs/rule/no-arguments-for-html-elements.md',
      tests: 'test/unit/rules/no-arguments-for-html-elements-test.js',
    },
  },

  create(context) {
    const sourceCode = context.sourceCode;
    const HTML_ELEMENTS = new Set(htmlTags);

    return {
      GlimmerElementNode(node) {
        // Check if this is an HTML element (lowercase)
        if (!HTML_ELEMENTS.has(node.tag)) {
          return;
        }

        // If the tag name is a variable in scope, it's being used as a component, not an HTML element
        const scope = sourceCode.getScope(node.parent);
        const isVariable = scope.references.some((ref) => ref.identifier === node.parts[0]);
        if (isVariable) {
          return;
        }

        // Check for @arguments
        for (const attr of node.attributes) {
          if (attr.type === 'GlimmerAttrNode' && attr.name.startsWith('@')) {
            context.report({
              node: attr,
              messageId: 'noArgumentsForHtmlElements',
            });
          }
        }
      },
    };
  },
};
