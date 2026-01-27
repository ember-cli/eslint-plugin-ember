const WHITESPACE_ENTITY_LIST = [
  '&#32;',
  '&#160;',
  '&nbsp;',
  '&NonBreakingSpace;',
  '&#8194;',
  '&ensp;',
  '&#8195;',
  '&emsp;',
  '&#8196;',
  '&emsp13;',
  '&#8197;',
  '&emsp14;',
  '&#8199;',
  '&numsp;',
  '&#8200;',
  '&puncsp;',
  '&#8201;',
  '&thinsp;',
  '&ThinSpace;',
  '&#8202;',
  '&hairsp;',
  '&VeryThinSpace;',
  '&ThickSpace;',
  '&#8203;',
  '&ZeroWidthSpace;',
  '&NegativeVeryThinSpace;',
  '&NegativeThinSpace;',
  '&NegativeMediumSpace;',
  '&NegativeThickSpace;',
  '&#8204;',
  '&zwnj;',
  '&#8205;',
  '&zwj;',
  '&#8206;',
  '&lrm;',
  '&#8207;',
  '&rlm;',
  '&#8287;',
  '&MediumSpace;',
  '&ThickSpace;',
  '&#8288;',
  '&NoBreak;',
  '&#8289;',
  '&ApplyFunction;',
  '&af;',
  '&#8290;',
  '&InvisibleTimes;',
  '&it;',
  '&#8291;',
  '&InvisibleComma;',
  '&ic;',
];

const CHARACTER_REGEX = '[a-zA-Z]';

// Build a regex that catches alternating non-whitespace/whitespace characters,
// for example, 'W e l c o m e'. The pattern requires 5 alternations to avoid
// false positives: (whitespace)(char)(whitespace)(char)(whitespace)
const whitespaceOrEntityRegex = `(?:\\s|${WHITESPACE_ENTITY_LIST.map(
  (entity) => `\\${entity}`
).join('|')})+`;
const WHITESPACE_WITHIN_WORD_REGEX = new RegExp(
  `${whitespaceOrEntityRegex}${CHARACTER_REGEX}${whitespaceOrEntityRegex}${CHARACTER_REGEX}${whitespaceOrEntityRegex}`
);

/** @type {import('eslint').Rule.RuleModule} */
module.exports = {
  meta: {
    type: 'layout',
    docs: {
      description: 'disallow excess whitespace within words (e.g. "W e l c o m e")',
      category: 'Accessibility',
      url: 'https://github.com/ember-cli/eslint-plugin-ember/tree/master/docs/rules/template-no-whitespace-within-word.md',
    },
    schema: [],
    messages: {
      excessWhitespace: 'Excess whitespace in layout detected.',
    },
    strictGjs: true,
    strictGts: true,
  },

  create(context) {
    const sourceCode = context.getSourceCode();

    return {
      GlimmerTextNode(node) {
        // Skip text inside attributes
        let parent = node.parent;
        while (parent) {
          if (parent.type === 'GlimmerAttrNode') {
            return;
          }
          // Skip text inside <style> elements
          if (parent.type === 'GlimmerElementNode' && parent.tag === 'style') {
            return;
          }
          parent = parent.parent;
        }

        const text = sourceCode.getText(node);
        if (WHITESPACE_WITHIN_WORD_REGEX.test(text)) {
          context.report({
            node,
            messageId: 'excessWhitespace',
          });
        }
      },
    };
  },
};
