/** @type {import('eslint').Rule.RuleModule} */
module.exports = {
  meta: {
    type: 'problem',
    docs: {
      description: 'require rel="noopener noreferrer" on links with target="_blank"',
      category: 'Security',
      recommendedGjs: true,
      recommendedGts: true,
      url: 'https://github.com/ember-cli/eslint-plugin-ember/tree/master/docs/rules/template-link-rel-noopener.md',
    },
    fixable: 'code',
    schema: [],
    messages: {
      missingRel: 'links with target="_blank" must have rel="noopener noreferrer"',
    },
  },
  create(context) {
    return {
      GlimmerElementNode(node) {
        if (node.tag !== 'a') {
          return;
        }

        const targetAttr = node.attributes?.find((a) => a.name === 'target');
        if (!targetAttr?.value || targetAttr.value.type !== 'GlimmerTextNode') {
          return;
        }
        if (targetAttr.value.chars !== '_blank') {
          return;
        }

        const relAttr = node.attributes?.find((a) => a.name === 'rel');
        const hasProperRel =
          relAttr?.value?.type === 'GlimmerTextNode' &&
          /noopener/.test(relAttr.value.chars) &&
          /noreferrer/.test(relAttr.value.chars);

        if (!hasProperRel) {
          context.report({
            node: targetAttr,
            messageId: 'missingRel',
            fix(fixer) {
              const sourceCode = context.sourceCode;
              const openTag = sourceCode.getText(node).match(/^<a[^>]*/)[0];
              const insertPos = node.range[0] + openTag.length;
              return fixer.insertTextBeforeRange(
                [insertPos, insertPos],
                ' rel="noopener noreferrer"'
              );
            },
          });
        }
      },
    };
  },
};
