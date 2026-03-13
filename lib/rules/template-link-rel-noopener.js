/** @type {import('eslint').Rule.RuleModule} */
module.exports = {
  meta: {
    type: 'problem',
    docs: {
      description: 'require rel="noopener noreferrer" on links with target="_blank"',
      category: 'Security',
      strictGjs: true,
      strictGts: true,
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
        const relValue = relAttr?.value?.type === 'GlimmerTextNode' ? relAttr.value.chars : '';
        const hasNoopener = /(?:^|\s)noopener(?:\s|$)/.test(relValue);
        const hasNoreferrer = /(?:^|\s)noreferrer(?:\s|$)/.test(relValue);
        const hasProperRel = hasNoopener && hasNoreferrer;

        if (!hasProperRel) {
          context.report({
            node: targetAttr,
            messageId: 'missingRel',
            fix(fixer) {
              if (relAttr && relAttr.value?.type === 'GlimmerTextNode') {
                // Strip existing noopener/noreferrer tokens, then re-add in canonical order
                // (matches ember-template-lint behavior)
                const oldValue = relAttr.value.chars.trim().replaceAll(/\s+/g, ' ');
                const filtered = oldValue
                  .split(' ')
                  .filter((t) => t !== 'noopener' && t !== 'noreferrer')
                  .join(' ');
                const newValue = `${filtered} noopener noreferrer`.trim();
                return fixer.replaceText(relAttr.value, `"${newValue}"`);
              }
              // No rel attribute — insert one before the closing >
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
