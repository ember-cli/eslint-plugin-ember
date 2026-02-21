const ROLES_REQUIRING_CONTEXT = {
  listitem: ['list', 'group', 'directory'],
  option: ['listbox', 'group'],
  tab: ['tablist'],
  menuitem: ['menu', 'menubar', 'group'],
  menuitemcheckbox: ['menu', 'menubar', 'group'],
  menuitemradio: ['menu', 'menubar', 'group'],
  treeitem: ['tree', 'group'],
  row: ['table', 'grid', 'treegrid', 'rowgroup'],
  rowgroup: ['grid', 'table', 'treegrid'],
  rowheader: ['row'],
  columnheader: ['row'],
  gridcell: ['row'],
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
    const elementStack = [];

    return {
      GlimmerElementNode(node) {
        elementStack.push(node);

        const role = getRoleFromNode(node);

        if (role && ROLES_REQUIRING_CONTEXT[role]) {
          // Skip check if at root level (no parent elements — context may be external)
          if (elementStack.length > 1 && !isInsideAriaHidden(elementStack)) {
            const parentRole = getAccessibleParentRole(elementStack);
            if (parentRole === undefined) {
              // No non-transparent parent found (effectively root) — skip
            } else if (
              !parentRole ||
              !ROLES_REQUIRING_CONTEXT[role].includes(parentRole)
            ) {
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
        }
      },

      'GlimmerElementNode:exit'() {
        elementStack.pop();
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

/**
 * Check if any ancestor element in the stack has aria-hidden="true".
 */
function isInsideAriaHidden(elementStack) {
  // Check ancestors (all elements except the current one)
  for (let i = elementStack.length - 2; i >= 0; i--) {
    const node = elementStack[i];
    const ariaHidden = node.attributes?.find((a) => a.name === 'aria-hidden');
    if (
      ariaHidden?.value?.type === 'GlimmerTextNode' &&
      ariaHidden.value.chars === 'true'
    ) {
      return true;
    }
  }
  return false;
}

/**
 * Get the role of the nearest non-transparent ancestor element.
 * Transparent elements are those with role="presentation"/"none" or named blocks (tag starts with ':').
 * Returns:
 *   - a role string if a non-transparent ancestor with a role is found
 *   - null if a non-transparent ancestor WITHOUT a role is found (breaks context)
 *   - undefined if no non-transparent ancestor exists (root level)
 */
function getAccessibleParentRole(elementStack) {
  for (let i = elementStack.length - 2; i >= 0; i--) {
    const node = elementStack[i];

    // Named blocks (e.g. <:content>) and <template> wrapper are transparent
    if (node.tag && (node.tag.startsWith(':') || node.tag === 'template')) {
      continue;
    }

    const role = getRoleFromNode(node);

    // Presentation/none roles are transparent in the accessibility tree
    if (role === 'presentation' || role === 'none') {
      continue;
    }

    return role; // could be null (element with no role) or a role string
  }
  return undefined; // no non-transparent ancestor found
}
