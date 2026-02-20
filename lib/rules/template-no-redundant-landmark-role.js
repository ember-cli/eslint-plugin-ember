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

/** @type {import('eslint').Rule.RuleModule} */
module.exports = {
  meta: {
    type: 'problem',
    docs: {
      description: 'disallow redundant landmark roles that are implicit on HTML elements',
      category: 'Accessibility',
      strictGjs: true,
      strictGts: true,
      url: 'https://github.com/ember-cli/eslint-plugin-ember/tree/master/docs/rules/template-no-redundant-landmark-role.md',
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
