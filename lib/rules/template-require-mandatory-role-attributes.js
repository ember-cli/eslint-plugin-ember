/** @type {import('eslint').Rule.RuleModule} */
module.exports = {
  meta: {
    type: 'problem',
    docs: {
      description: 'require mandatory ARIA attributes for ARIA roles',
      category: 'Accessibility',
      strictGjs: true,
      strictGts: true,
      url: 'https://github.com/ember-cli/eslint-plugin-ember/tree/master/docs/rules/template-require-mandatory-role-attributes.md',
    },
    fixable: null,
    schema: [],
    messages: {
      missingAttribute: 'Role "{{role}}" requires ARIA attribute "{{attribute}}" to be present.',
    },
    originallyFrom: {
      name: 'ember-template-lint',
      rule: 'lib/rules/require-mandatory-role-attributes.js',
      docs: 'docs/rule/require-mandatory-role-attributes.md',
      tests: 'test/unit/rules/require-mandatory-role-attributes-test.js',
    },
  },

  create(context) {
    // Map of roles to their mandatory ARIA attributes
    const MANDATORY_ROLE_ATTRIBUTES = {
      checkbox: ['aria-checked'],
      radio: ['aria-checked'],
      slider: ['aria-valuenow', 'aria-valuemin', 'aria-valuemax'],
      spinbutton: ['aria-valuenow', 'aria-valuemin', 'aria-valuemax'],
      switch: ['aria-checked'],
      scrollbar: ['aria-valuenow', 'aria-valuemin', 'aria-valuemax', 'aria-controls'],
      option: ['aria-selected'],
      tab: ['aria-selected'],
      combobox: ['aria-expanded'],
      heading: ['aria-level'],
    };

    return {
      GlimmerElementNode(node) {
        const role = getRoleValue(node);
        if (!role || !MANDATORY_ROLE_ATTRIBUTES[role]) {
          return;
        }

        const mandatoryAttrs = MANDATORY_ROLE_ATTRIBUTES[role];
        const presentAttrs = new Set(
          node.attributes?.filter((attr) => attr.name).map((attr) => attr.name) || []
        );

        for (const requiredAttr of mandatoryAttrs) {
          if (!presentAttrs.has(requiredAttr)) {
            context.report({
              node,
              messageId: 'missingAttribute',
              data: {
                role,
                attribute: requiredAttr,
              },
            });
          }
        }
      },

      GlimmerMustacheStatement(node) {
        const name = node.path?.original;
        if (!name || typeof name !== 'string') {
          return;
        }

        const pairs = node.hash?.pairs || [];
        const rolePair = pairs.find((p) => p.key === 'role');
        if (!rolePair) {
          return;
        }

        const role = rolePair.value?.value || rolePair.value?.chars;
        if (!role || typeof role !== 'string' || !MANDATORY_ROLE_ATTRIBUTES[role]) {
          return;
        }

        const mandatoryAttrs = MANDATORY_ROLE_ATTRIBUTES[role];
        const presentAttrs = new Set(pairs.map((p) => p.key));

        for (const requiredAttr of mandatoryAttrs) {
          if (!presentAttrs.has(requiredAttr)) {
            context.report({
              node,
              messageId: 'missingAttribute',
              data: {
                role,
                attribute: requiredAttr,
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
