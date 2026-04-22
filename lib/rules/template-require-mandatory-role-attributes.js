const { roles } = require('aria-query');
const { AXObjectRoles, elementAXObjects } = require('axobject-query');

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
    return rolePair.value.value;
  }

  return undefined;
}

// Reads the static lowercase value of `name` from either a GlimmerElementNode
// (angle-bracket attributes) or a GlimmerMustacheStatement (hash pairs).
// Returns undefined for dynamic values or missing attributes.
function getStaticAttrValue(node, name) {
  if (node?.type === 'GlimmerElementNode') {
    const attr = node.attributes?.find((a) => a.name === name);
    if (attr?.value?.type === 'GlimmerTextNode') {
      return attr.value.chars?.toLowerCase();
    }
    return undefined;
  }
  if (node?.type === 'GlimmerMustacheStatement') {
    const pair = node.hash?.pairs?.find((p) => p.key === name);
    if (pair?.value?.type === 'GlimmerStringLiteral') {
      return pair.value.value?.toLowerCase();
    }
    return undefined;
  }
  return undefined;
}

function getTagName(node) {
  if (node?.type === 'GlimmerElementNode') {
    return node.tag;
  }
  if (node?.type === 'GlimmerMustacheStatement' && node.path?.original === 'input') {
    // The classic `{{input}}` helper renders a native <input>.
    return 'input';
  }
  return null;
}

// Does this {element, role} pair match one of axobject-query's elementAXObjects
// concepts? If so, the native element exposes the role's required ARIA state
// automatically (e.g., <input type=checkbox> exposes aria-checked via the
// `checked` attribute for both role=checkbox and role=switch).
//
// Mirrors jsx-a11y's `isSemanticRoleElement` util
// (https://github.com/jsx-eslint/eslint-plugin-jsx-a11y/blob/main/src/util/isSemanticRoleElement.js).
//
// Perf note: this walks the full `elementAXObjects` map for every call, giving
// an O(n·m) scan per node (n = concepts, m = axObject→roles). In practice the
// map is small (~dozens of entries) and callers only invoke this after a role
// attribute has already been matched, so it hasn't shown up as a hotspot.
// A future optimization could precompute a `{tag,role} → boolean` lookup.
function isSemanticRoleElement(node, role) {
  const tag = getTagName(node);
  if (!tag || typeof role !== 'string') {
    return false;
  }
  const targetRole = role.toLowerCase();

  for (const [concept, axObjectNames] of elementAXObjects) {
    if (concept.name !== tag) {
      continue;
    }
    const conceptAttrs = concept.attributes || [];
    const allMatch = conceptAttrs.every((cAttr) => {
      const nodeVal = getStaticAttrValue(node, cAttr.name);
      if (nodeVal === undefined) {
        return false;
      }
      if (cAttr.value === undefined) {
        return true;
      }
      return nodeVal === String(cAttr.value).toLowerCase();
    });
    if (!allMatch) {
      continue;
    }

    for (const axName of axObjectNames) {
      const axRoles = AXObjectRoles.get(axName);
      if (!axRoles) {
        continue;
      }
      for (const axRole of axRoles) {
        if (axRole.name === targetRole) {
          return true;
        }
      }
    }
  }
  return false;
}

function getMissingRequiredAttributes(role, foundAriaAttributes, node) {
  const roleDefinition = roles.get(role);

  if (!roleDefinition) {
    return null;
  }

  // If axobject-query classifies this {element, role} pair as a semantic role
  // element, the native element provides all required ARIA state — skip the
  // missing-attribute check entirely (matches jsx-a11y's approach).
  if (isSemanticRoleElement(node, role)) {
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

        const missingRequiredAttributes = getMissingRequiredAttributes(
          role,
          foundAriaAttributes,
          node
        );

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

        const missingRequiredAttributes = getMissingRequiredAttributes(
          role,
          foundAriaAttributes,
          node
        );

        if (missingRequiredAttributes) {
          reportMissingAttributes(node, role, missingRequiredAttributes);
        }
      },
    };
  },
};
