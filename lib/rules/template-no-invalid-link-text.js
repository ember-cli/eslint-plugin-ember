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

/**
 * Check if the node has a valid aria-label or aria-labelledby that
 * exempts it from link text validation.
 */
function hasValidAriaLabelOrLabelledby(node) {
  const attrs = node.attributes || [];

  // Check aria-labelledby
  const ariaLabelledby = attrs.find((a) => a.name === 'aria-labelledby');
  if (ariaLabelledby) {
    if (ariaLabelledby.value && ariaLabelledby.value.type === 'GlimmerTextNode') {
      const val = ariaLabelledby.value.chars.trim();
      // Only valid if non-empty
      return val.length > 0;
    }
    // Dynamic value — assume valid
    if (
      ariaLabelledby.value &&
      (ariaLabelledby.value.type === 'GlimmerMustacheStatement' ||
        ariaLabelledby.value.type === 'GlimmerConcatStatement')
    ) {
      return true;
    }
    // No value or empty — not valid
    return false;
  }

  // Check aria-label
  const ariaLabel = attrs.find((a) => a.name === 'aria-label');
  if (ariaLabel) {
    // Dynamic value — assume valid
    if (
      ariaLabel.value &&
      (ariaLabel.value.type === 'GlimmerMustacheStatement' ||
        ariaLabel.value.type === 'GlimmerConcatStatement')
    ) {
      return true;
    }
    if (ariaLabel.value && ariaLabel.value.type === 'GlimmerTextNode') {
      const val = ariaLabel.value.chars.replaceAll('&nbsp;', ' ').toLowerCase().trim();
      // aria-label itself must not be disallowed text
      return val.length > 0 && !DISALLOWED_LINK_TEXTS.has(val);
    }
    return false;
  }

  return false;
}

/** @type {import('eslint').Rule.RuleModule} */
module.exports = {
  meta: {
    type: 'problem',
    docs: {
      description: 'disallow invalid or uninformative link text content',
      category: 'Accessibility',
      strictGjs: true,
      strictGts: true,
      url: 'https://github.com/ember-cli/eslint-plugin-ember/tree/master/docs/rules/template-no-invalid-link-text.md',
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
  },

  create(context) {
    const options = context.options[0] || {};
    const allowEmptyLinks = options.allowEmptyLinks || false;
    const customLinkComponents = options.linkComponents || [];
    const linkTags = new Set(['a', 'LinkTo', ...customLinkComponents]);

    function checkLinkContent(node, children) {
      // Skip if has aria-hidden
      const ariaHidden = (node.attributes || []).find((a) => a.name === 'aria-hidden');
      if (ariaHidden?.value?.type === 'GlimmerTextNode' && ariaHidden.value.chars === 'true') {
        return;
      }

      // Skip if has hidden attribute
      if ((node.attributes || []).some((a) => a.name === 'hidden')) {
        return;
      }

      // Check aria-label / aria-labelledby
      if (hasValidAriaLabelOrLabelledby(node)) {
        return;
      }

      let fullText = '';
      let hasDynamic = false;

      for (const child of children || []) {
        const result = getTextContentResult(child);
        fullText += result.text;
        if (result.hasDynamic) {
          hasDynamic = true;
        }
      }

      // If there's dynamic content, skip (can't validate)
      if (hasDynamic) {
        return;
      }

      const normalized = fullText.trim().toLowerCase().replaceAll(/\s+/g, ' ');

      // Empty link check
      if (!normalized.replaceAll(' ', '')) {
        if (!allowEmptyLinks) {
          context.report({
            node,
            messageId: 'invalidText',
            data: { text: '(empty)' },
          });
        }
        return;
      }

      if (DISALLOWED_LINK_TEXTS.has(normalized)) {
        context.report({
          node,
          messageId: 'invalidText',
          data: { text: normalized },
        });
      }
    }

    return {
      GlimmerElementNode(node) {
        if (!linkTags.has(node.tag)) {
          return;
        }

        checkLinkContent(node, node.children);
      },

      GlimmerBlockStatement(node) {
        if (
          node.path &&
          node.path.type === 'GlimmerPathExpression' &&
          node.path.original === 'link-to'
        ) {
          checkLinkContent(node, node.program && node.program.body);
        }
      },
    };
  },
};
