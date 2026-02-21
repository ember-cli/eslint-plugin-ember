/**
 * Get all static text content from children of a node, lowercased and trimmed.
 */
function getChildTextContents(children) {
  const texts = [];
  for (const child of children || []) {
    if (child.type === 'GlimmerTextNode') {
      const trimmed = child.chars.toLowerCase().trim();
      if (trimmed.length > 0) {
        texts.push(trimmed);
      }
    }
  }
  return texts;
}

/**
 * Check if any link text contains any of the title values.
 */
function hasInvalidLinkTitle(children, titleValues) {
  const linkTexts = getChildTextContents(children);
  return linkTexts.some((linkText) =>
    titleValues.some((title) => linkText.includes(title))
  );
}

/** @type {import('eslint').Rule.RuleModule} */
module.exports = {
  meta: {
    type: 'problem',
    docs: {
      description: 'disallow invalid title attributes on link elements',
      category: 'Accessibility',
      url: 'https://github.com/ember-cli/eslint-plugin-ember/tree/master/docs/rules/template-no-invalid-link-title.md',
    },
    schema: [],
    messages: {
      noInvalidLinkTitle: 'Link title attribute should not be the same as link text or empty.',
    },
    strictGjs: true,
    strictGts: true,
  },

  create(context) {
    function checkElementNode(node) {
      if (node.tag !== 'a' && node.tag !== 'LinkTo') {
        return;
      }

      const titleAttr = node.attributes.find(
        (attr) => attr.type === 'GlimmerAttrNode' && attr.name === 'title'
      );
      const titleArgAttr = node.tag === 'LinkTo'
        ? node.attributes.find(
            (attr) => attr.type === 'GlimmerAttrNode' && attr.name === '@title'
          )
        : null;

      // Get title attribute text value
      let titleAttrValue;
      if (titleAttr && titleAttr.value && titleAttr.value.type === 'GlimmerTextNode') {
        titleAttrValue = titleAttr.value.chars;
      }

      // Get @title argument text value (LinkTo only)
      let titleArgValue;
      if (titleArgAttr && titleArgAttr.value && titleArgAttr.value.type === 'GlimmerTextNode') {
        titleArgValue = titleArgAttr.value.chars;
      }

      // Collect all title values (lowercased, trimmed)
      const titleValues = [titleAttrValue, node.tag === 'LinkTo' ? titleArgValue : null]
        .filter((v) => typeof v === 'string')
        .map((v) => v.toLowerCase().trim());

      // Error if both title and @title are specified on LinkTo
      if (node.tag === 'LinkTo' && titleAttrValue !== undefined && titleArgValue !== undefined) {
        context.report({
          node: titleAttr || node,
          messageId: 'noInvalidLinkTitle',
        });
        return;
      }

      // Check empty title
      if (titleValues.length > 0 && titleValues.some((v) => v === '')) {
        context.report({
          node: titleAttr || node,
          messageId: 'noInvalidLinkTitle',
        });
        return;
      }

      // Check if title is included in link text
      if (titleValues.length > 0 && hasInvalidLinkTitle(node.children, titleValues)) {
        context.report({
          node: titleAttr || titleArgAttr || node,
          messageId: 'noInvalidLinkTitle',
        });
      }
    }

    function checkBlockStatement(node) {
      if (
        !node.path ||
        node.path.type !== 'GlimmerPathExpression' ||
        node.path.original !== 'link-to'
      ) {
        return;
      }

      // Find title in hash pairs
      let titleValue;
      if (node.hash && node.hash.pairs) {
        const titlePair = node.hash.pairs.find((pair) => pair.key === 'title');
        if (titlePair && titlePair.value) {
          if (titlePair.value.type === 'GlimmerStringLiteral') {
            titleValue = titlePair.value.value;
          } else if (titlePair.value.type === 'GlimmerTextNode') {
            titleValue = titlePair.value.chars;
          }
        }
      }

      if (typeof titleValue !== 'string') {
        return;
      }

      const normalizedTitle = titleValue.toLowerCase().trim();

      if (!normalizedTitle) {
        context.report({
          node,
          messageId: 'noInvalidLinkTitle',
        });
        return;
      }

      if (hasInvalidLinkTitle(node.program && node.program.body, [normalizedTitle])) {
        context.report({
          node,
          messageId: 'noInvalidLinkTitle',
        });
      }
    }

    return {
      GlimmerElementNode: checkElementNode,
      GlimmerBlockStatement: checkBlockStatement,
    };
  },
};
