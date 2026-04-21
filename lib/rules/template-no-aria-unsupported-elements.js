const { dom } = require('aria-query');

// HTML elements that don't support ARIA — sourced from aria-query's dom map,
// which marks spec-reserved elements with .reserved = true. Matches the authoritative
// list in the HTML-AAM spec (https://www.w3.org/TR/html-aria/#docconformance).
const ELEMENTS_WITHOUT_ARIA_SUPPORT = new Set(
  [...dom].filter(([, def]) => def.reserved).map(([tag]) => tag)
);

/** @type {import('eslint').Rule.RuleModule} */
module.exports = {
  meta: {
    type: 'problem',
    docs: {
      description:
        'disallow ARIA roles, states, and properties on elements that do not support them',
      category: 'Accessibility',

      url: 'https://github.com/ember-cli/eslint-plugin-ember/tree/master/docs/rules/template-no-aria-unsupported-elements.md',
    },
    fixable: null,
    schema: [],
    messages: {
      unsupported:
        'ARIA attribute "{{attribute}}" is not supported on <{{element}}> elements. Consider using a different element.',
    },
    originallyFrom: {
      name: 'ember-template-lint',
      rule: 'lib/rules/no-aria-unsupported-elements.js',
      docs: 'docs/rule/no-aria-unsupported-elements.md',
      tests: 'test/unit/rules/no-aria-unsupported-elements-test.js',
    },
  },

  create(context) {
    return {
      GlimmerElementNode(node) {
        if (ELEMENTS_WITHOUT_ARIA_SUPPORT.has(node.tag)) {
          const ariaAttributes = node.attributes?.filter(
            (attr) =>
              attr.type === 'GlimmerAttrNode' &&
              attr.name &&
              (attr.name.startsWith('aria-') || attr.name === 'role')
          );

          for (const attr of ariaAttributes || []) {
            context.report({
              node: attr,
              messageId: 'unsupported',
              data: {
                attribute: attr.name,
                element: node.tag,
              },
            });
          }
        }
      },
    };
  },
};
