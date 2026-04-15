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
  return linkTexts.some((linkText) => titleValues.some((title) => linkText.includes(title)));
}

/** @type {import('eslint').Rule.RuleModule} */
module.exports = {
  meta: {
    type: 'problem',
    docs: {
      description: 'disallow invalid title attributes on link elements',
      category: 'Accessibility',
      url: 'https://github.com/ember-cli/eslint-plugin-ember/tree/master/docs/rules/template-no-invalid-link-title.md',
      templateMode: 'both',
    },
    schema: [],
    messages: {
      noInvalidLinkTitle: 'Link title attribute should not be the same as link text or empty.',
    },
    originallyFrom: {
      name: 'ember-template-lint',
      rule: 'lib/rules/no-invalid-link-title.js',
      docs: 'docs/rule/no-invalid-link-title.md',
      tests: 'test/unit/rules/no-invalid-link-title-test.js',
    },
  },

  create(context) {
    const filename = context.filename;
    const isStrictMode = filename.endsWith('.gjs') || filename.endsWith('.gts');

    // In HBS, <LinkTo> always refers to Ember's router link component.
    // In GJS/GTS, LinkTo must be explicitly imported from '@ember/routing'.
    // local alias → true (any truthy value marks it as a tracked link component)
    const importedLinkComponents = new Map();

    const linkTags = new Set(['a']);
    if (!isStrictMode) {
      linkTags.add('LinkTo');
    }

    // eslint-disable-next-line complexity
    function checkElementNode(node) {
      if (!linkTags.has(node.tag)) {
        return;
      }
      // Determine if this tag should be treated as <LinkTo> for @title handling
      const isLinkTo = node.tag === 'LinkTo' || importedLinkComponents.has(node.tag);

      const titleAttr = node.attributes.find(
        (attr) => attr.type === 'GlimmerAttrNode' && attr.name === 'title'
      );
      const titleArgAttr = isLinkTo
        ? node.attributes.find((attr) => attr.type === 'GlimmerAttrNode' && attr.name === '@title')
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
      const titleValues = [titleAttrValue, isLinkTo ? titleArgValue : null]
        .filter((v) => typeof v === 'string')
        .map((v) => v.toLowerCase().trim());

      // Error if both title and @title are specified on LinkTo
      if (isLinkTo && titleAttrValue !== undefined && titleArgValue !== undefined) {
        context.report({
          node: titleAttr || node,
          messageId: 'noInvalidLinkTitle',
        });
        return;
      }

      // Check empty title
      if (titleValues.includes('')) {
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
      ImportDeclaration(node) {
        if (!isStrictMode) {
          return;
        }
        if (node.source.value === '@ember/routing') {
          for (const specifier of node.specifiers) {
            if (specifier.type === 'ImportSpecifier' && specifier.imported.name === 'LinkTo') {
              importedLinkComponents.set(specifier.local.name, true);
              linkTags.add(specifier.local.name);
            }
          }
        }
      },
      GlimmerElementNode: checkElementNode,
      GlimmerBlockStatement: checkBlockStatement,
    };
  },
};
