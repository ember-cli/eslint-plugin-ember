/** @type {import('eslint').Rule.RuleModule} */
module.exports = {
  meta: {
    type: 'problem',
    docs: {
      description: 'disallow duplicate id attributes',
      category: 'Best Practices',
      recommendedGjs: true,
      recommendedGts: true,
      url: 'https://github.com/ember-cli/eslint-plugin-ember/tree/master/docs/rules/template-no-duplicate-id.md',
    },
    schema: [],
    messages: { duplicate: 'Duplicate id attribute "{{id}}" found' },
  },
  create(context) {
    const seenIds = new Map();
    return {
      'GlimmerTemplate:exit'() {
        seenIds.clear();
      },
      GlimmerElementNode(node) {
        const idAttr = node.attributes?.find((a) => a.name === 'id');
        if (idAttr?.value?.type === 'GlimmerTextNode') {
          const id = idAttr.value.chars;
          if (seenIds.has(id)) {
            context.report({ node: idAttr, messageId: 'duplicate', data: { id } });
          } else {
            seenIds.set(id, idAttr);
          }
        }
      },
    };
  },
};
