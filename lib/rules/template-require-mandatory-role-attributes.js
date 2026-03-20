const { roles } = require('aria-query');

function createRequiredAttributeErrorMessage(attrs, role) {
  if (attrs.length < 2) {
    return `The attribute ${attrs[0]} is required by the role ${role}`;
  }

  return `The attributes ${attrs.join(', ')} are required by the role ${role}`;
}

function getStaticRoleFromElement(node) {
  const roleAttr = node.attributes?.find((attr) => attr.name === 'role');

  if (roleAttr?.value?.type === 'GlimmerTextNode') {
    return roleAttr.value.chars || undefined;
  }

  return undefined;
}

function getStaticRoleFromMustache(node) {
  const rolePair = node.hash?.pairs?.find((pair) => pair.key === 'role');

  if (rolePair?.value?.type === 'GlimmerStringLiteral') {
    return rolePair.value.original;
  }

  return undefined;
}

function getMissingRequiredAttributes(role, foundAriaAttributes) {
  const roleDefinition = roles.get(role);

  if (!roleDefinition) {
    return null;
  }

  const requiredAttributes = Object.keys(roleDefinition.requiredProps);
  const missingRequiredAttributes = requiredAttributes.filter(
    (requiredAttribute) => !foundAriaAttributes.includes(requiredAttribute)
  );

  return missingRequiredAttributes.length > 0 ? missingRequiredAttributes : null;
}

/** @type {import('eslint').Rule.RuleModule} */
module.exports = {
  meta: {
    type: 'problem',
    docs: {
      description: 'require mandatory ARIA attributes for ARIA roles',
      category: 'Accessibility',
      url: 'https://github.com/ember-cli/eslint-plugin-ember/tree/master/docs/rules/template-require-mandatory-role-attributes.md',
      templateMode: 'both',
    },
    fixable: null,
    schema: [],
    messages: {
      missingAttributes:
        'The {{attributeWord}} {{attributes}} {{verb}} required by the role {{role}}',
    },
    originallyFrom: {
      name: 'ember-template-lint',
      rule: 'lib/rules/require-mandatory-role-attributes.js',
      docs: 'docs/rule/require-mandatory-role-attributes.md',
      tests: 'test/unit/rules/require-mandatory-role-attributes-test.js',
    },
  },

  create(context) {
    function reportMissingAttributes(node, role, missingRequiredAttributes) {
      context.report({
        node,
        messageId: 'missingAttributes',
        data: {
          attributeWord: missingRequiredAttributes.length < 2 ? 'attribute' : 'attributes',
          attributes: missingRequiredAttributes.join(', '),
          verb: missingRequiredAttributes.length < 2 ? 'is' : 'are',
          role,
        },
      });
    }

    return {
      GlimmerElementNode(node) {
        const role = getStaticRoleFromElement(node);

        if (!role) {
          return;
        }

        const foundAriaAttributes = (node.attributes ?? [])
          .filter((attribute) => attribute.name?.startsWith('aria-'))
          .map((attribute) => attribute.name);

        const missingRequiredAttributes = getMissingRequiredAttributes(role, foundAriaAttributes);

        if (missingRequiredAttributes) {
          reportMissingAttributes(node, role, missingRequiredAttributes);
        }
      },

      GlimmerMustacheStatement(node) {
        const role = getStaticRoleFromMustache(node);

        if (!role) {
          return;
        }

        const foundAriaAttributes = (node.hash?.pairs ?? [])
          .filter((pair) => pair.key.startsWith('aria-'))
          .map((pair) => pair.key);

        const missingRequiredAttributes = getMissingRequiredAttributes(role, foundAriaAttributes);

        if (missingRequiredAttributes) {
          reportMissingAttributes(node, role, missingRequiredAttributes);
        }
      },
    };
  },
};
