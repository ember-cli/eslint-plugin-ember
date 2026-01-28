/**
 * @param {any} node
 * @returns {boolean}
 */
function isLinkToComponent(node) {
  if (node.type === 'GlimmerElementNode') {
    return node.tag === 'LinkTo' || node.tag === 'link-to';
  }
  return false;
}

/** @type {import('eslint').Rule.RuleModule} */
module.exports = {
  meta: {
    type: 'problem',
    docs: {
      description: 'disallow tagName attribute on LinkTo component',
      category: 'Deprecations',
      strictGjs: true,
      strictGts: true,
      url: 'https://github.com/ember-cli/eslint-plugin-ember/tree/master/docs/rules/template-no-link-to-tagname.md',
    },
    schema: [],
    messages: {
      noLinkToTagname: 'tagName attribute on LinkTo is deprecated',
    },
  },

  create(context) {

    return {
      GlimmerElementNode(node) {
        if (!isLinkToComponent(node)) {
          return;
        }

        const tagNameAttr = node.attributes.find(
          (attr) =>
            attr.type === 'GlimmerAttrNode' && (attr.name === 'tagName' || attr.name === '@tagName')
        );

        if (tagNameAttr) {
          context.report({
            node: tagNameAttr,
            messageId: 'noLinkToTagname',
          });
        }
      },
    };
  },
};
