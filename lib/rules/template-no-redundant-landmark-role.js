const LANDMARK_ROLES = new Set([
  'banner',
  'complementary',
  'contentinfo',
  'form',
  'main',
  'navigation',
  'region',
  'search',
]);

const ELEMENT_TO_ROLE = {
  header: 'banner',
  aside: 'complementary',
  footer: 'contentinfo',
  form: 'form',
  main: 'main',
  nav: 'navigation',
  section: 'region',
};

// Elements that change the implicit role of <header> and <footer>.
// When nested inside these sectioning elements, <header> no longer maps to "banner"
// and <footer> no longer maps to "contentinfo".
// See: https://www.w3.org/TR/html-aria/#el-header and https://www.w3.org/TR/html-aria/#el-footer
const SECTIONING_ELEMENTS = new Set(['article', 'aside', 'main', 'nav', 'section']);

// Elements whose implicit role depends on ancestor context.
const CONTEXT_SENSITIVE_ELEMENTS = new Set(['header', 'footer']);

/**
 * Check whether a node is nested inside a sectioning element that strips
 * <header>/<footer> of their implicit landmark role.
 */
function isNestedInSectioningElement(node) {
  let current = node.parent;
  while (current) {
    if (current.type === 'GlimmerElementNode' && SECTIONING_ELEMENTS.has(current.tag)) {
      return true;
    }
    current = current.parent;
  }
  return false;
}

/** @type {import('eslint').Rule.RuleModule} */
module.exports = {
  meta: {
    type: 'problem',
    docs: {
      description: 'disallow redundant landmark roles that are implicit on HTML elements',
      category: 'Accessibility',
      url: 'https://github.com/ember-cli/eslint-plugin-ember/tree/master/docs/rules/template-no-redundant-landmark-role.md',
      templateMode: 'both',
    },
    fixable: 'code',
    schema: [],
    messages: {
      redundant:
        'Redundant role "{{role}}". The <{{tag}}> element already has this role implicitly.',
    },
  },

  create(context) {
    return {
      GlimmerElementNode(node) {
        const implicitRole = ELEMENT_TO_ROLE[node.tag];
        if (!implicitRole) {
          return;
        }

        // <header> and <footer> only have their implicit landmark role when
        // they are NOT nested inside <article>, <aside>, <main>, <nav>, or <section>.
        if (CONTEXT_SENSITIVE_ELEMENTS.has(node.tag) && isNestedInSectioningElement(node)) {
          return;
        }

        const roleAttr = node.attributes?.find((a) => a.name === 'role');
        if (!roleAttr || roleAttr.value?.type !== 'GlimmerTextNode') {
          return;
        }

        const explicitRole = roleAttr.value.chars.trim();
        if (explicitRole === implicitRole) {
          context.report({
            node: roleAttr,
            messageId: 'redundant',
            data: {
              role: explicitRole,
              tag: node.tag,
            },
            fix(fixer) {
              const sourceCode = context.sourceCode;
              const text = sourceCode.getText();
              const attrStart = roleAttr.range[0];
              const attrEnd = roleAttr.range[1];

              // Look for whitespace before the attribute
              let removeStart = attrStart;
              while (removeStart > 0 && /\s/.test(text[removeStart - 1])) {
                removeStart--;
              }

              return fixer.removeRange([removeStart, attrEnd]);
            },
          });
        }
      },
    };
  },
};
