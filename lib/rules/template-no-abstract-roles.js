const { roles } = require('aria-query');

// Abstract ARIA roles, sourced from aria-query. Abstract roles exist only for
// taxonomy — authors should never set role="widget" / "landmark" / etc.
// https://www.w3.org/TR/wai-aria-1.2/#abstract_roles
const PROHIBITED_ROLE_VALUES = new Set(
  [...roles.keys()].filter((role) => roles.get(role).abstract)
);

/** @type {import('eslint').Rule.RuleModule} */
module.exports = {
  meta: {
    type: 'problem',
    docs: {
      description: 'disallow abstract ARIA roles',
      category: 'Accessibility',

      url: 'https://github.com/ember-cli/eslint-plugin-ember/tree/master/docs/rules/template-no-abstract-roles.md',
    },
    fixable: null,
    schema: [],
    messages: {
      abstractRole:
        '{{role}} is an abstract role, and is not a valid value for the role attribute.',
    },
    originallyFrom: {
      name: 'ember-template-lint',
      rule: 'lib/rules/no-abstract-roles.js',
      docs: 'docs/rule/no-abstract-roles.md',
      tests: 'test/unit/rules/no-abstract-roles-test.js',
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
