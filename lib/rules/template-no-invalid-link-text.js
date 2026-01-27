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

function getTextContent(node) {
  let text = '';
  let hasDynamicContent = false;

  if (node.type === 'GlimmerTextNode') {
    text += node.chars.replaceAll('&nbsp;', ' ');
  } else if (
    node.type === 'GlimmerMustacheStatement' ||
    node.type === 'GlimmerBlockStatement' ||
    node.type === 'GlimmerElementNode'
  ) {
    // Dynamic content — can't validate
    if (node.type !== 'GlimmerElementNode') {
      hasDynamicContent = true;
    }
    if (node.children) {
      for (const child of node.children) {
        const result = getTextContentResult(child);
        text += result.text;
        if (result.hasDynamic) {
          hasDynamicContent = true;
        }
      }
    }
  }

  return { text, hasDynamic: hasDynamicContent };
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

    return {
      GlimmerElementNode(node) {
        if (!linkTags.has(node.tag)) {
          return;
        }

        // Skip if has aria-hidden
        const ariaHidden = node.attributes?.find((a) => a.name === 'aria-hidden');
        if (ariaHidden?.value?.type === 'GlimmerTextNode' && ariaHidden.value.chars === 'true') {
          return;
        }

        // Skip if has hidden attribute
        if (node.attributes?.some((a) => a.name === 'hidden')) {
          return;
        }

        // Skip if has aria-label or aria-labelledby
        if (node.attributes?.some((a) => a.name === 'aria-label' || a.name === 'aria-labelledby')) {
          return;
        }

        let fullText = '';
        let hasDynamic = false;

        for (const child of node.children || []) {
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

        const normalized = fullText.trim().toLowerCase();

        // Empty link check
        if (!normalized) {
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
      },
    };
  },
};
