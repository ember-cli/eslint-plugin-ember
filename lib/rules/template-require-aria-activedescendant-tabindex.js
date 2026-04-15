const { dom } = require('aria-query');

const HTML_TAGS = new Set(dom.keys());
const INTERACTIVE_ELEMENTS = new Set(['input', 'button', 'select', 'textarea']);
const ERROR_MESSAGE =
  'A generic element using the aria-activedescendant attribute must have a tabindex';
const FIXED_TABINDEX = 'tabindex="0"';

function isInteractiveElement(node) {
  if (INTERACTIVE_ELEMENTS.has(node.tag)) {
    return true;
  }
  // <a> with href is interactive
  if (node.tag === 'a' && node.attributes?.some((a) => a.name === 'href')) {
    return true;
  }
  return false;
}

function getTabindexNumericValue(tabindexAttr) {
  if (!tabindexAttr) {
    return Number.nan;
  }

  const value = tabindexAttr.value;

  if (value.type === 'GlimmerMustacheStatement' && value.path) {
    if (
      ['GlimmerBooleanLiteral', 'GlimmerNumberLiteral', 'GlimmerStringLiteral'].includes(
        value.path.type
      )
    ) {
      return Number(value.path.value);
    }

    return Number.nan;
  }

  if (value.type === 'GlimmerTextNode') {
    return Number.parseInt(value.chars, 10);
  }

  return Number.nan;
}

/** @type {import('eslint').Rule.RuleModule} */
module.exports = {
  meta: {
    type: 'problem',
    docs: {
      description: 'require non-interactive elements with aria-activedescendant to have tabindex',
      category: 'Accessibility',
      url: 'https://github.com/ember-cli/eslint-plugin-ember/tree/master/docs/rules/template-require-aria-activedescendant-tabindex.md',
      templateMode: 'both',
    },
    fixable: 'code',
    schema: [],
    messages: {
      missingTabindex: ERROR_MESSAGE,
    },
    originallyFrom: {
      name: 'ember-template-lint',
      rule: 'lib/rules/require-aria-activedescendant-tabindex.js',
      docs: 'docs/rule/require-aria-activedescendant-tabindex.md',
      tests: 'test/unit/rules/require-aria-activedescendant-tabindex-test.js',
    },
  },

  create(context) {
    return {
      GlimmerElementNode(node) {
        const hasActiveDescendant = node.attributes?.some(
          (attr) => attr.name === 'aria-activedescendant'
        );

        if (!hasActiveDescendant) {
          return;
        }

        if (!HTML_TAGS.has(node.tag)) {
          return;
        }

        const tabindexAttr = node.attributes?.find(
          (attr) => attr.name === 'tabindex' || attr.name === 'tabIndex'
        );

        if (!tabindexAttr && isInteractiveElement(node)) {
          return;
        }

        const tabindexValue = getTabindexNumericValue(tabindexAttr);

        if (!Number.isFinite(tabindexValue) || tabindexValue < 0) {
          context.report({
            node,
            messageId: 'missingTabindex',
            fix(fixer) {
              if (!tabindexAttr) {
                const lastAttribute = node.attributes.at(-1);

                if (lastAttribute) {
                  return fixer.insertTextAfterRange(lastAttribute.range, ` ${FIXED_TABINDEX}`);
                }

                const insertPos =
                  node.parts.at(-1)?.range[1] ?? node.range[0] + 1 + node.tag.length;
                return fixer.insertTextAfterRange([insertPos, insertPos], ` ${FIXED_TABINDEX}`);
              }

              return fixer.replaceTextRange(tabindexAttr.range, FIXED_TABINDEX);
            },
          });
        }
      },
    };
  },
};
