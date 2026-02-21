const { roles, elementRoles } = require('aria-query');

/**
 * Get the implicit ARIA role for an HTML element based on its tag name and type attribute.
 * Uses the aria-query elementRoles mapping.
 */
function getImplicitRole(tagName, typeAttribute) {
  // For input elements, match against entries with the specific type attribute
  if (tagName === 'input') {
    for (const key of elementRoles.keys()) {
      if (key.name === tagName && key.attributes) {
        for (const attribute of key.attributes) {
          if (attribute.name === 'type' && attribute.value === typeAttribute) {
            return elementRoles.get(key)[0];
          }
        }
      }
    }
  }
  // For all elements, fall back to the first matching entry by tag name
  for (const key of elementRoles.keys()) {
    if (key.name === tagName) {
      return elementRoles.get(key)[0];
    }
  }
  return null;
}

function getExplicitRole(node) {
  const roleAttr = node.attributes?.find((attr) => attr.name === 'role');
  if (roleAttr && roleAttr.value?.type === 'GlimmerTextNode') {
    return roleAttr.value.chars.trim();
  }
  return null;
}

function getTypeAttribute(node) {
  const typeAttr = node.attributes?.find((attr) => attr.name === 'type');
  if (typeAttr && typeAttr.value?.type === 'GlimmerTextNode') {
    return typeAttr.value.chars.trim();
  }
  return null;
}

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
    return {
      GlimmerElementNode(node) {
        // Determine the role: explicit first, then implicit
        let role = getExplicitRole(node);
        if (!role) {
          const tagName = node.tag;
          const typeAttribute = getTypeAttribute(node);
          role = getImplicitRole(tagName, typeAttribute);
        }

        if (!role) {
          return;
        }

        const roleDefinition = roles.get(role);
        if (!roleDefinition) {
          return;
        }

        const supportedProps = Object.keys(roleDefinition.props);
        const ariaAttributes = node.attributes?.filter(
          (attr) =>
            attr.type === 'GlimmerAttrNode' && attr.name && attr.name.startsWith('aria-')
        );

        for (const attr of ariaAttributes || []) {
          if (!supportedProps.includes(attr.name)) {
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

      GlimmerMustacheStatement(node) {
        if (!node.hash || !node.hash.pairs) {
          return;
        }

        const rolePair = node.hash.pairs.find((pair) => pair.key === 'role');
        if (!rolePair || rolePair.value?.type !== 'GlimmerStringLiteral') {
          return;
        }

        const role = rolePair.value.original;
        if (!role) {
          return;
        }

        const roleDefinition = roles.get(role);
        if (!roleDefinition) {
          return;
        }

        const supportedProps = Object.keys(roleDefinition.props);
        const ariaPairs = node.hash.pairs.filter((pair) => pair.key.startsWith('aria-'));

        for (const pair of ariaPairs) {
          if (!supportedProps.includes(pair.key)) {
            context.report({
              node: pair,
              messageId: 'unsupported',
              data: {
                attribute: pair.key,
                role,
              },
            });
          }
        }
      },
    };
  },
};
