const DISALLOWED_LINK_TEXTS = new Set(['click here', 'more info', 'read more', 'more']);

function getTextContentResult(node) {
  if (node.type === 'GlimmerTextNode') {
    return { text: node.chars.replaceAll('&nbsp;', ' '), hasDynamic: false };
  }
  if (node.type === 'GlimmerMustacheStatement' || node.type === 'GlimmerSubExpression') {
    return { text: '', hasDynamic: true };
  }
  if (node.type === 'GlimmerElementNode' && node.children) {
    let text = '';
    let hasDynamic = false;
    for (const child of node.children) {
      const result = getTextContentResult(child);
      text += result.text;
      if (result.hasDynamic) {
        hasDynamic = true;
      }
    }
    return { text, hasDynamic };
  }
  return { text: '', hasDynamic: false };
}

function isDynamicValue(value) {
  return value?.type === 'GlimmerMustacheStatement' || value?.type === 'GlimmerConcatStatement';
}

/**
 * Checks aria-labelledby and aria-label attributes.
 * Returns:
 *   { skip: true }                          — has valid accessible name, skip element
 *   { report: true, text: string }          — aria-label is itself a disallowed text, report it
 *   { skip: false }                         — no valid aria override, check text content
 */
function checkAriaAttributes(attrs) {
  const ariaLabelledby = attrs.find((a) => a.name === 'aria-labelledby');
  if (ariaLabelledby) {
    if (isDynamicValue(ariaLabelledby.value)) {
      return { skip: true };
    }
    if (ariaLabelledby.value?.type === 'GlimmerTextNode') {
      if (ariaLabelledby.value.chars.trim().length > 0) {
        return { skip: true }; // valid non-empty labelledby
      }
    }
    // empty aria-labelledby → fall through
    return { skip: false };
  }

  const ariaLabel = attrs.find((a) => a.name === 'aria-label');
  if (ariaLabel) {
    if (isDynamicValue(ariaLabel.value)) {
      return { skip: true };
    }
    if (ariaLabel.value?.type === 'GlimmerTextNode') {
      const val = ariaLabel.value.chars.replaceAll('&nbsp;', ' ').toLowerCase().trim();
      if (val.length > 0 && !DISALLOWED_LINK_TEXTS.has(val)) {
        return { skip: true }; // valid aria-label
      }
      if (val.length > 0) {
        return { skip: true, report: true, text: val }; // aria-label itself is disallowed
      }
    }
  }

  return { skip: false };
}

/** @type {import('eslint').Rule.RuleModule} */
module.exports = {
  meta: {
    type: 'problem',
    docs: {
      description: 'disallow invalid or uninformative link text content',
      category: 'Accessibility',
      url: 'https://github.com/ember-cli/eslint-plugin-ember/tree/master/docs/rules/template-no-invalid-link-text.md',
      templateMode: 'both',
    },
    fixable: null,
    schema: [
      {
        type: 'object',
        properties: {
          allowEmptyLinks: { type: 'boolean' },
          linkComponents: { type: 'array', items: { type: 'string' } },
        },
        additionalProperties: false,
      },
    ],
    messages: {
      invalidText:
        'Link text "{{text}}" is not descriptive. Use meaningful text that describes the link destination.',
    },
    originallyFrom: {
      name: 'ember-template-lint',
      rule: 'lib/rules/no-invalid-link-text.js',
      docs: 'docs/rule/no-invalid-link-text.md',
      tests: 'test/unit/rules/no-invalid-link-text-test.js',
    },
  },

  create(context) {
    const options = context.options[0] || {};
    const allowEmptyLinks = options.allowEmptyLinks || false;
    const customLinkComponents = options.linkComponents || [];

    const filename = context.filename ?? context.getFilename();
    const isStrictMode = filename.endsWith('.gjs') || filename.endsWith('.gts');

    // In HBS, LinkTo always refers to Ember's router link component.
    // In GJS/GTS, LinkTo must be explicitly imported from '@ember/routing'.
    // local alias → true (any truthy value marks it as a tracked link component)
    const importedLinkComponents = new Map();

    const linkTags = new Set(['a', ...customLinkComponents]);
    if (!isStrictMode) {
      linkTags.add('LinkTo');
    }

    function checkLinkContent(node, children) {
      const attrs = node.attributes || [];

      // Skip if aria-hidden="true"
      const ariaHidden = attrs.find((a) => a.name === 'aria-hidden');
      if (ariaHidden?.value?.type === 'GlimmerTextNode' && ariaHidden.value.chars === 'true') {
        return;
      }

      // Skip if hidden attribute present
      if (attrs.some((a) => a.name === 'hidden')) {
        return;
      }

      const ariaResult = checkAriaAttributes(attrs);
      if (ariaResult.report) {
        context.report({ node, messageId: 'invalidText', data: { text: ariaResult.text } });
        return;
      }
      if (ariaResult.skip) {
        return;
      }

      // Check text content
      let fullText = '';
      let hasDynamic = false;
      for (const child of children || []) {
        const result = getTextContentResult(child);
        fullText += result.text;
        if (result.hasDynamic) {
          hasDynamic = true;
        }
      }

      if (hasDynamic) {
        return; // can't validate dynamic content
      }

      const normalized = fullText.trim().toLowerCase().replaceAll(/\s+/g, ' ');

      if (!normalized.replaceAll(' ', '')) {
        if (!allowEmptyLinks) {
          context.report({ node, messageId: 'invalidText', data: { text: '(empty)' } });
        }
        return;
      }

      if (DISALLOWED_LINK_TEXTS.has(normalized)) {
        context.report({ node, messageId: 'invalidText', data: { text: normalized } });
      }
    }

    return {
      ImportDeclaration(node) {
        if (node.source.value === '@ember/routing') {
          for (const specifier of node.specifiers) {
            if (specifier.type === 'ImportSpecifier' && specifier.imported.name === 'LinkTo') {
              importedLinkComponents.set(specifier.local.name, true);
              linkTags.add(specifier.local.name);
            }
          }
        }
      },

      GlimmerElementNode(node) {
        if (!linkTags.has(node.tag)) {
          return;
        }
        checkLinkContent(node, node.children);
      },

      GlimmerBlockStatement(node) {
        if (node.path?.type === 'GlimmerPathExpression' && node.path.original === 'link-to') {
          checkLinkContent(node, node.program?.body);
        }
      },
    };
  },
};
