const ROLES_REQUIRING_CONTEXT = {
  listitem: ['list'],
  option: ['listbox'],
  tab: ['tablist'],
  menuitem: ['menu', 'menubar'],
  menuitemcheckbox: ['menu', 'menubar'],
  menuitemradio: ['menu', 'menubar'],
  treeitem: ['tree'],
  row: ['table', 'grid', 'treegrid', 'rowgroup'],
  rowheader: ['table', 'grid', 'treegrid', 'row'],
  columnheader: ['table', 'grid', 'treegrid', 'row'],
  gridcell: ['table', 'grid', 'treegrid', 'row'],
};

/** @type {import('eslint').Rule.RuleModule} */
module.exports = {
  meta: {
    type: 'problem',
    docs: {
      description: 'require ARIA roles to be used in appropriate context',
      category: 'Accessibility',
      strictGjs: true,
      strictGts: true,
      url: 'https://github.com/ember-cli/eslint-plugin-ember/tree/master/docs/rules/template-require-context-role.md',
    },
    fixable: null,
    schema: [],
    messages: {
      missingContext:
        'Role "{{role}}" must be contained in an element with one of these roles: {{requiredRoles}}',
    },
  },

  create(context) {
    const roleStack = [];

    return {
      GlimmerElementNode(node) {
        const role = getRoleFromNode(node);

        if (role && ROLES_REQUIRING_CONTEXT[role]) {
          if (!hasRequiredParentRole(role, roleStack)) {
            context.report({
              node,
              messageId: 'missingContext',
              data: {
                role,
                requiredRoles: ROLES_REQUIRING_CONTEXT[role].join(', '),
              },
            });
          }
        }

        if (role) {
          roleStack.push(role);
        }
      },

      'GlimmerElementNode:exit'(node) {
        const role = getRoleFromNode(node);
        if (role) {
          roleStack.pop();
        }
      },
    };
  },
};

function getRoleFromNode(node) {
  const roleAttr = node.attributes?.find((a) => a.name === 'role');
  if (roleAttr?.value?.type === 'GlimmerTextNode') {
    return roleAttr.value.chars;
  }
  return null;
}

function hasRequiredParentRole(role, roleStack) {
  const requiredRoles = ROLES_REQUIRING_CONTEXT[role];
  if (!requiredRoles) {
    return true; // No context requirement
  }

  return roleStack.some((parentRole) => requiredRoles.includes(parentRole));
}
