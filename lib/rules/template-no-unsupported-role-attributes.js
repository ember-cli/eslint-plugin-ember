const { roles, elementRoles } = require('aria-query');

function createUnsupportedAttributeErrorMessage(attribute, role, element) {
  if (element) {
    return `The attribute ${attribute} is not supported by the element ${element} with the implicit role of ${role}`;
  }

  return `The attribute ${attribute} is not supported by the role ${role}`;
}

function getImplicitRole(tagName, typeAttribute) {
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

  const key = [...elementRoles.keys()].find((entry) => entry.name === tagName);
  const implicitRoles = key && elementRoles.get(key);

  return implicitRoles && implicitRoles[0];
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
          const typeAttribute = getTypeAttribute(node);
          role = getImplicitRole(element, typeAttribute);
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
