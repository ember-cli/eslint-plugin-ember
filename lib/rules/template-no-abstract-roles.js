const PROHIBITED_ROLE_VALUES = new Set([
  'command',
  'composite',
  'input',
  'landmark',
  'range',
  'roletype',
  'section',
  'sectionhead',
  'select',
  'structure',
  'widget',
  'window',
]);

/** @type {import('eslint').Rule.RuleModule} */
module.exports = {
  meta: {
    type: 'problem',
    docs: {
      description: 'disallow abstract ARIA roles',
      category: 'Accessibility',
      recommendedGjs: true,
      recommendedGts: true,
      url: 'https://github.com/ember-cli/eslint-plugin-ember/tree/master/docs/rules/template-no-abstract-roles.md',
    },
    fixable: null,
    schema: [],
    messages: {
      abstractRole: '{{role}} is an abstract role, and is not a valid value for the role attribute.',
    },
  },

  create(context) {
    return {
      GlimmerElementNode(node) {
        const roleAttr = node.attributes?.find((attr) => attr.name === 'role');

        if (roleAttr && roleAttr.value && roleAttr.value.type === 'GlimmerTextNode') {
          const roleValue = roleAttr.value.chars;

          if (PROHIBITED_ROLE_VALUES.has(roleValue)) {
            context.report({
              node: roleAttr,
              messageId: 'abstractRole',
              data: { role: roleValue },
            });
          }
        }
      },
    };
  },
};
