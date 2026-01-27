/** @type {import('eslint').Rule.RuleModule} */
module.exports = {
  meta: {
    type: 'problem',
    docs: {
      description: 'disallow ARIA attributes that are not supported by the element role',
      category: 'Accessibility',
      strictGjs: true,
      strictGts: true,
      url: 'https://github.com/ember-cli/eslint-plugin-ember/tree/master/docs/rules/template-no-unsupported-role-attributes.md',
    },
    fixable: null,
    schema: [],
    messages: {
      unsupported:
        'ARIA attribute "{{attribute}}" is not supported for role "{{role}}". Remove the attribute or change the role.',
    },
  },

  create(context) {
    // Map of roles to their supported ARIA attributes
    const ROLE_ATTRIBUTES = {
      button: ['aria-pressed', 'aria-expanded', 'aria-haspopup'],
      checkbox: ['aria-checked', 'aria-required'],
      radio: ['aria-checked', 'aria-posinset', 'aria-setsize'],
      tab: ['aria-selected', 'aria-expanded', 'aria-controls'],
      menuitem: ['aria-haspopup', 'aria-expanded'],
      option: ['aria-selected', 'aria-posinset', 'aria-setsize'],
      slider: ['aria-valuenow', 'aria-valuemin', 'aria-valuemax', 'aria-valuetext'],
      switch: ['aria-checked'],
    };

    return {
      GlimmerElementNode(node) {
        const role = getRoleValue(node);
        if (!role || !ROLE_ATTRIBUTES[role]) {
          return;
        }

        const supportedAttrs = ROLE_ATTRIBUTES[role];
        const ariaAttributes = node.attributes?.filter(
          (attr) =>
            attr.type === 'GlimmerAttrNode' &&
            attr.name &&
            attr.name.startsWith('aria-') &&
            attr.name !== 'aria-label' &&
            attr.name !== 'aria-labelledby' &&
            attr.name !== 'aria-describedby' &&
            attr.name !== 'aria-hidden'
        );

        for (const attr of ariaAttributes || []) {
          if (!supportedAttrs.includes(attr.name)) {
            context.report({
              node: attr,
              messageId: 'unsupported',
              data: {
                attribute: attr.name,
                role,
              },
            });
          }
        }
      },
    };
  },
};

function getRoleValue(node) {
  const roleAttr = node.attributes?.find((attr) => attr.name === 'role');
  if (roleAttr && roleAttr.value?.type === 'GlimmerTextNode') {
    return roleAttr.value.chars.trim();
  }
  return null;
}
