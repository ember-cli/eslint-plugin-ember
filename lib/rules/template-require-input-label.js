function hasAttr(node, name) {
  return node.attributes?.some((a) => a.name === name);
}

function isString(value) {
  return typeof value === 'string';
}

function isRegExp(value) {
  return value instanceof RegExp;
}

function allowedFormat(value) {
  return isString(value) || isRegExp(value);
}

function parseConfig(config) {
  if (config === false) {
    return false;
  }

  if (config === true || config === undefined) {
    return { labelTags: ['label'] };
  }

  if (config && typeof config === 'object' && Array.isArray(config.labelTags)) {
    return {
      labelTags: ['label', ...config.labelTags.filter(allowedFormat)],
    };
  }

  return { labelTags: ['label'] };
}

function matchesLabelTag(tag, configuredTag) {
  return isRegExp(configuredTag) ? configuredTag.test(tag) : configuredTag === tag;
}

/** @type {import('eslint').Rule.RuleModule} */
module.exports = {
  meta: {
    type: 'suggestion',
    docs: {
      description: 'require label for form input elements',
      category: 'Accessibility',
      url: 'https://github.com/ember-cli/eslint-plugin-ember/tree/master/docs/rules/template-require-input-label.md',
      templateMode: 'both',
    },
    schema: [
      {
        anyOf: [
          { type: 'boolean' },
          {
            type: 'object',
            properties: {
              labelTags: {
                type: 'array',
              },
            },
            additionalProperties: false,
          },
        ],
      },
    ],
    messages: {
      requireLabel: 'form elements require a valid associated label.',
      multipleLabels: 'form elements should not have multiple labels.',
    },
    originallyFrom: {
      name: 'ember-template-lint',
      rule: 'lib/rules/require-input-label.js',
      docs: 'docs/rule/require-input-label.md',
      tests: 'test/unit/rules/require-input-label-test.js',
    },
  },

  create(context) {
    const config = parseConfig(context.options[0]);
    if (config === false) {
      return {};
    }

    const filename = context.filename;
    const isStrictMode = filename.endsWith('.gjs') || filename.endsWith('.gts');
    const elementStack = [];

    // local name → original name ('Input' | 'Textarea')
    // Only populated in GJS/GTS files via ImportDeclaration
    const importedFormComponents = new Map();

    function hasValidLabelParent() {
      for (let i = elementStack.length - 1; i >= 0; i--) {
        const entry = elementStack[i];
        const hasMatchingLabelTag = config.labelTags.some((configuredTag) =>
          matchesLabelTag(entry.tag, configuredTag)
        );

        if (hasMatchingLabelTag) {
          if (entry.tag !== 'label') {
            return true;
          }

          const children = entry.node.children || [];
          return children.length > 1;
        }
      }
      return false;
    }

    return {
      ImportDeclaration(node) {
        if (!isStrictMode) {
          return;
        }
        if (node.source.value === '@ember/component') {
          for (const specifier of node.specifiers) {
            if (specifier.type === 'ImportSpecifier') {
              const original = specifier.imported.name;
              if (original === 'Input' || original === 'Textarea') {
                importedFormComponents.set(specifier.local.name, original);
              }
            }
          }
        }
      },

      GlimmerElementNode(node) {
        elementStack.push({ tag: node.tag, node });

        const tag = node.tag;
        // Is this tag one we should check?
        // - Native <input>/<textarea>/<select> always.
        // - <Input>/<Textarea> built-ins:
        //   - In strict mode (.gjs/.gts): only if the tag resolves to a tracked
        //     import from '@ember/component' (supports renames).
        //   - In HBS: match by bare tag name.
        const isNativeFormElement = tag === 'input' || tag === 'textarea' || tag === 'select';
        const isBuiltinFormComponent = isStrictMode
          ? importedFormComponents.has(tag)
          : tag === 'Input' || tag === 'Textarea';

        if (!isNativeFormElement && !isBuiltinFormComponent) {
          return;
        }

        // Skip if input has type="hidden"
        const typeAttr = node.attributes?.find((a) => a.name === 'type');
        if (typeAttr?.value?.type === 'GlimmerTextNode' && typeAttr.value.chars === 'hidden') {
          return;
        }

        // Skip if has ...attributes (can't determine labelling)
        if (hasAttr(node, '...attributes')) {
          return;
        }

        let labelCount = 0;
        const validLabel = hasValidLabelParent();
        if (validLabel) {
          labelCount++;
        }

        const hasId = hasAttr(node, 'id');
        const hasAriaLabel = hasAttr(node, 'aria-label');
        const hasAriaLabelledBy = hasAttr(node, 'aria-labelledby');
        if (hasId) {
          labelCount++;
        }
        if (hasAriaLabel) {
          labelCount++;
        }
        if (hasAriaLabelledBy) {
          labelCount++;
        }

        if (labelCount === 1) {
          return;
        }

        if (validLabel && hasId) {
          return;
        }

        context.report({
          node,
          messageId: labelCount === 0 ? 'requireLabel' : 'multipleLabels',
        });
      },
      'GlimmerElementNode:exit'() {
        elementStack.pop();
      },

      GlimmerMustacheStatement(node) {
        // Classic {{input}}/{{textarea}} curly helpers only exist in HBS.
        // In GJS/GTS, these identifiers are user-imported JS bindings with
        // no relation to the classic helpers, so skip.
        if (isStrictMode) {
          return;
        }

        const name = node.path?.original;
        if (name !== 'input' && name !== 'textarea') {
          return;
        }

        const pairs = node.hash?.pairs || [];

        function hasPair(key) {
          return pairs.some((p) => p.key === key);
        }

        // Skip if type="hidden" (literal string only)
        const typePair = pairs.find((p) => p.key === 'type');
        if (typePair?.value?.type === 'GlimmerStringLiteral' && typePair.value.value === 'hidden') {
          return;
        }

        // If in a valid label, it's valid
        if (hasValidLabelParent()) {
          return;
        }

        // If has id, it's valid
        if (hasPair('id')) {
          return;
        }

        context.report({
          node,
          messageId: 'requireLabel',
        });
      },
    };
  },
};
