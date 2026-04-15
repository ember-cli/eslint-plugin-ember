const htmlTags = require('html-tags');
const svgTags = require('svg-tags');

const ELEMENT_TAGS = new Set([...htmlTags, ...svgTags]);

/** @type {import('eslint').Rule.RuleModule} */
module.exports = {
  meta: {
    type: 'problem',
    docs: {
      description: 'disallow @arguments on HTML elements',
      category: 'Best Practices',

      url: 'https://github.com/ember-cli/eslint-plugin-ember/tree/master/docs/rules/template-no-arguments-for-html-elements.md',
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

    return {
      GlimmerElementNode(node) {
        if (!ELEMENT_TAGS.has(node.tag)) {
          return;
        }

        // A known HTML/SVG tag can still be a component if it's bound in scope
        // (block param, import, local).
        const scope = sourceCode.getScope(node.parent);
        const isVariable = scope.references.some((ref) => ref.identifier === node.parts[0]);
        if (isVariable) {
          return;
        }

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
