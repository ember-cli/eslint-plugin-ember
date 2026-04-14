const ROLES_REQUIRING_CONTEXT = {
  cell: ['row'],
  listitem: ['group', 'list'],
  option: ['listbox'],
  tab: ['tablist'],
  menuitem: ['group', 'menu', 'menubar'],
  menuitemcheckbox: ['menu', 'menubar'],
  menuitemradio: ['group', 'menu', 'menubar'],
  treeitem: ['group', 'tree'],
  row: ['grid', 'rowgroup', 'table', 'treegrid'],
  rowgroup: ['grid', 'table', 'treegrid'],
  rowheader: ['grid', 'row'],
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
      url: 'https://github.com/ember-cli/eslint-plugin-ember/tree/master/docs/rules/template-require-context-role.md',
      templateMode: 'both',
    },
    fixable: null,
    schema: [],
    messages: {
      missingContext:
        'Role "{{role}}" must be contained in an element with one of these roles: {{requiredRoles}}',
    },
    originallyFrom: {
      name: 'ember-template-lint',
      rule: 'lib/rules/require-context-role.js',
      docs: 'docs/rule/require-context-role.md',
      tests: 'test/unit/rules/require-context-role-test.js',
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
          if (elementStack.length > 1) {
            const parentContext = getParentContext(elementStack);
            if (parentContext.ariaHidden) {
              // aria-hidden on the effective parent (or a transparent wrapper
              // walked through on the way up) — upstream suppresses the rule.
              return;
            }
            const parentRole = parentContext.role;
            if (parentRole === undefined) {
              // No non-transparent parent found (effectively root) — skip
            } else if (!parentRole || !ROLES_REQUIRING_CONTEXT[role].includes(parentRole)) {
              const roleAttr = node.attributes?.find((a) => a.name === 'role');
              context.report({
                node: roleAttr || node,
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

function hasAriaHiddenTrue(node) {
  const attr = node.attributes?.find((a) => a.name === 'aria-hidden');
  return attr?.value?.type === 'GlimmerTextNode' && attr.value.chars === 'true';
}

/**
 * Walk up the ancestor chain through transparent wrappers (named-block slots,
 * `<template>`, role="presentation"/"none") checking `aria-hidden` at each
 * layer. Returns { ariaHidden, role } where:
 *   - `ariaHidden` is true if aria-hidden="true" was seen on any traversed
 *     element (including transparent wrappers) up to and including the first
 *     non-transparent parent.
 *   - `role` is the role of the first non-transparent parent: a role string,
 *     null (element with no role), or undefined (no non-transparent parent).
 */
function getParentContext(elementStack) {
  for (let i = elementStack.length - 2; i >= 0; i--) {
    const node = elementStack[i];
    if (hasAriaHiddenTrue(node)) {
      return { ariaHidden: true, role: undefined };
    }
    // Named blocks (`<:content>`) and the `<template>` wrapper are transparent
    if (node.tag && (node.tag.startsWith(':') || node.tag === 'template')) {
      continue;
    }
    const role = getRoleFromNode(node);
    // presentation/none roles are transparent in the accessibility tree
    if (role === 'presentation' || role === 'none') {
      continue;
    }
    return { ariaHidden: false, role };
  }
  return { ariaHidden: false, role: undefined };
}
