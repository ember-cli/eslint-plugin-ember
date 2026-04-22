const { roles, elementRoles } = require('aria-query');

function createUnsupportedAttributeErrorMessage(attribute, role, element) {
  if (element) {
    return `The attribute ${attribute} is not supported by the element ${element} with the implicit role of ${role}`;
  }

  return `The attribute ${attribute} is not supported by the role ${role}`;
}

function getStaticAttrValue(node, name) {
  const attr = node.attributes?.find((a) => a.name === name);
  if (!attr) {
    return undefined;
  }
  if (!attr.value || attr.value.type !== 'GlimmerTextNode') {
    // Presence with dynamic value — treat as "set" but unknown string.
    return '';
  }
  return attr.value.chars;
}

function nodeSatisfiesAttributeConstraint(node, attrSpec) {
  const value = getStaticAttrValue(node, attrSpec.name);
  const isSet = value !== undefined;

  if (attrSpec.constraints?.includes('set')) {
    return isSet;
  }
  if (attrSpec.constraints?.includes('undefined')) {
    return !isSet;
  }
  if (attrSpec.value !== undefined) {
    return isSet && value === attrSpec.value;
  }
  // No constraint listed — just require presence.
  return isSet;
}

function keyMatchesNode(node, key) {
  if (key.name !== node.tag) {
    return false;
  }
  if (!key.attributes || key.attributes.length === 0) {
    return true;
  }
  return key.attributes.every((attrSpec) => nodeSatisfiesAttributeConstraint(node, attrSpec));
}

function getImplicitRole(node) {
  // Honor aria-query's attribute constraints when mapping element -> implicit role.
  // Each elementRoles entry lists attributes that must match (with optional
  // constraints "set" / "undefined"); pick the most specific entry whose
  // attribute spec is fully satisfied by the node.
  //
  // Heuristic: "specificity = attribute-constraint count". aria-query exports
  // elementRoles as an unordered Map and does not document how consumers
  // should resolve multi-match cases; this count-based tiebreak is an
  // inference from the data shape. It resolves the motivating bugs:
  //   - <input type="text"> without `list` → textbox, not combobox
  //     (the combobox entry requires `list=set`, a stricter 2-attr match;
  //     the textbox entry's 1-attr type=text wins when `list` is absent).
  //   - <input type="password"> → no role (no elementRoles entry matches).
  // If aria-query ever publishes a resolution order, switch to that.
  let bestKey;
  let bestSpecificity = -1;
  for (const key of elementRoles.keys()) {
    if (!keyMatchesNode(node, key)) {
      continue;
    }
    const specificity = key.attributes?.length ?? 0;
    if (specificity > bestSpecificity) {
      bestKey = key;
      bestSpecificity = specificity;
    }
  }
  if (!bestKey) {
    return undefined;
  }
  return elementRoles.get(bestKey)[0];
}

function getExplicitRole(node) {
  const roleAttr = node.attributes?.find((attr) => attr.name === 'role');
  if (roleAttr && roleAttr.value?.type === 'GlimmerTextNode') {
    return roleAttr.value.chars.trim();
  }
  return null;
}

function removeRangeWithAdjacentWhitespace(sourceText, range) {
  let [start, end] = range;

  if (sourceText[end - 1] === ' ') {
    return [start, end];
  }

  if (sourceText[start - 1] === ' ') {
    start -= 1;
  } else if (sourceText[end] === ' ') {
    end += 1;
  }

  return [start, end];
}

/** @type {import('eslint').Rule.RuleModule} */
module.exports = {
  meta: {
    type: 'problem',
    docs: {
      description: 'disallow ARIA attributes that are not supported by the element role',
      category: 'Accessibility',
      url: 'https://github.com/ember-cli/eslint-plugin-ember/tree/master/docs/rules/template-no-unsupported-role-attributes.md',
      templateMode: 'both',
    },
    fixable: 'code',
    schema: [],
    messages: {
      unsupportedExplicit: 'The attribute {{attribute}} is not supported by the role {{role}}',
      unsupportedImplicit:
        'The attribute {{attribute}} is not supported by the element {{element}} with the implicit role of {{role}}',
    },
    originallyFrom: {
      name: 'ember-template-lint',
      rule: 'lib/rules/no-unsupported-role-attributes.js',
      docs: 'docs/rule/no-unsupported-role-attributes.md',
      tests: 'test/unit/rules/no-unsupported-role-attributes-test.js',
    },
  },

  create(context) {
    const sourceCode = context.sourceCode;

    function reportUnsupported(node, invalidNode, attribute, role, element) {
      const messageId = element ? 'unsupportedImplicit' : 'unsupportedExplicit';

      context.report({
        node,
        messageId,
        data: element ? { attribute, role, element } : { attribute, role },
        fix(fixer) {
          const [start, end] = removeRangeWithAdjacentWhitespace(
            sourceCode.getText(),
            invalidNode.range
          );
          return fixer.removeRange([start, end]);
        },
      });
    }

    return {
      GlimmerElementNode(node) {
        let role = getExplicitRole(node);
        let element;

        if (!role) {
          element = node.tag;
          role = getImplicitRole(node);
        }

        if (!role) {
          return;
        }

        const roleDefinition = roles.get(role);
        if (!roleDefinition) {
          return;
        }

        const supportedProps = Object.keys(roleDefinition.props);

        for (const attr of node.attributes || []) {
          if (attr.type !== 'GlimmerAttrNode' || !attr.name?.startsWith('aria-')) {
            continue;
          }

          if (!supportedProps.includes(attr.name)) {
            reportUnsupported(node, attr, attr.name, role, element);
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

        const role = rolePair.value.value;
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
            reportUnsupported(node, pair, pair.key, role);
          }
        }
      },
    };
  },
};
