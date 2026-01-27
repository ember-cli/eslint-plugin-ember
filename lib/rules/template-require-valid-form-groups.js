/** @type {import('eslint').Rule.RuleModule} */
const FORM_ELEMENTS = new Set(['input']);

function hasRoleGroup(node) {
  const roleAttr = node.attributes?.find((attr) => attr.name === 'role');
  return roleAttr && roleAttr.value?.type === 'GlimmerTextNode' && roleAttr.value.chars === 'group';
}

function hasAriaLabel(node) {
  return node.attributes?.some((attr) => attr.name === 'aria-labelledby');
}

function isValidFormGroup(node) {
  if (node.tag === 'fieldset' || node.tag === 'legend') {
    return true;
  }

  return hasRoleGroup(node) && hasAriaLabel(node);
}

function hasMultipleFormElementsInParentScope(node) {
  const parent = node.parent;

  if (!parent || parent.type !== 'GlimmerElementNode') {
    return false;
  }

  const elementChildren =
    parent.children?.filter((child) => child.type === 'GlimmerElementNode') || [];
  const formElements = elementChildren.filter((child) => FORM_ELEMENTS.has(child.tag));

  return formElements.length > 1;
}

function hasValidGroupingAncestor(node) {
  let parent = node.parent;

  while (parent) {
    if (parent.type === 'GlimmerElementNode' && isValidFormGroup(parent)) {
      return true;
    }

    parent = parent.parent;
  }

  return false;
}

module.exports = {
  meta: {
    type: 'problem',
    docs: {
      description:
        'require grouped form controls to have fieldset/legend or WAI-ARIA group labeling',
      category: 'Accessibility',
      recommendedGjs: false,
      recommendedGts: false,
      url: 'https://github.com/ember-cli/eslint-plugin-ember/tree/master/docs/rules/template-require-valid-form-groups.md',
    },
    schema: [],
    messages: {
      requireValidFormGroups:
        'Grouped form controls should have appropriate semantics such as fieldset and legend or WAI-ARIA labels',
    },
  },

  create(context) {
    return {
      GlimmerElementNode(node) {
        if (!FORM_ELEMENTS.has(node.tag)) {
          return;
        }

        if (!hasMultipleFormElementsInParentScope(node)) {
          return;
        }

        if (hasValidGroupingAncestor(node)) {
          return;
        }

        context.report({
          node,
          messageId: 'requireValidFormGroups',
        });
      },
    };
  },
};
