const INTERACTIVE_ELEMENTS = new Set(['input', 'button', 'select', 'textarea']);

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

function isCustomComponent(tag) {
  if (!tag) {
    return false;
  }
  // PascalCase or dotted path → custom component
  return /^[A-Z]/.test(tag) || tag.includes('.');
}

function getTabindexNumericValue(tabindexAttr) {
  if (!tabindexAttr || !tabindexAttr.value) {
    return { exists: false };
  }

  const val = tabindexAttr.value;

  if (val.type === 'GlimmerTextNode') {
    const num = Number.parseInt(val.chars, 10);
    if (Number.isNaN(num)) {
      return { exists: true, known: false };
    }
    return { exists: true, known: true, value: num, isText: true };
  }

  if (val.type === 'GlimmerMustacheStatement') {
    if (val.path?.type === 'GlimmerNumberLiteral') {
      return { exists: true, known: true, value: val.path.value, isText: false };
    }
    // Try to resolve from path.original (e.g., {{-1}} as PathExpression)
    if (val.path?.original !== null && val.path?.original !== undefined) {
      const num = Number.parseInt(String(val.path.original), 10);
      if (!Number.isNaN(num)) {
        return { exists: true, known: true, value: num, isText: false };
      }
    }
    return { exists: true, known: false };
  }

  return { exists: true, known: false };
}

/** @type {import('eslint').Rule.RuleModule} */
module.exports = {
  meta: {
    type: 'problem',
    docs: {
      description: 'require elements with aria-activedescendant to be tabbable (have tabindex)',
      category: 'Accessibility',
      url: 'https://github.com/ember-cli/eslint-plugin-ember/tree/master/docs/rules/template-require-aria-activedescendant-tabindex.md',
    },
    fixable: null,
    schema: [],
    messages: {
      missingTabindex:
        'Elements with aria-activedescendant must have tabindex attribute to be keyboard accessible.',
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
        // Skip custom components
        if (isCustomComponent(node.tag)) {
          return;
        }

        const hasActiveDescendant = node.attributes?.some(
          (attr) => attr.name === 'aria-activedescendant'
        );

        if (!hasActiveDescendant) {
          return;
        }

        const tabindexAttr = node.attributes?.find(
          (attr) => attr.name === 'tabindex' || attr.name === 'tabIndex'
        );

        if (!tabindexAttr) {
          // No tabindex - allow interactive elements
          if (isInteractiveElement(node)) {
            return;
          }
          context.report({
            node,
            messageId: 'missingTabindex',
          });
          return;
        }

        // Tabindex exists - check its value
        const result = getTabindexNumericValue(tabindexAttr);
        if (result.known) {
          if (result.isText) {
            // TextNode: allow -1 and above
            if (result.value < -1) {
              context.report({
                node,
                messageId: 'missingTabindex',
              });
            }
          } else {
            // MustacheStatement: only allow non-negative
            if (result.value < 0) {
              context.report({
                node,
                messageId: 'missingTabindex',
              });
            }
          }
        }
        // Unknown dynamic values are assumed valid
      },
    };
  },
};
