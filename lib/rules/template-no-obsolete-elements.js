const OBSOLETE = [
  'acronym',
  'applet',
  'basefont',
  'bgsound',
  'big',
  'blink',
  'center',
  'dir',
  'font',
  'frame',
  'frameset',
  'isindex',
  'keygen',
  'listing',
  'marquee',
  'menuitem',
  'multicol',
  'nextid',
  'nobr',
  'noembed',
  'noframes',
  'plaintext',
  's',
  'spacer',
  'strike',
  'tt',
  'u',
  'xmp',
];
/** @type {import('eslint').Rule.RuleModule} */
module.exports = {
  meta: {
    type: 'suggestion',
    docs: {
      description: 'disallow obsolete HTML elements',
      category: 'Best Practices',
      strictGjs: true,
      strictGts: true,
      url: 'https://github.com/ember-cli/eslint-plugin-ember/tree/master/docs/rules/template-no-obsolete-elements.md',
    },
    schema: [],
    messages: { obsolete: '<{{element}}> is obsolete, use modern alternatives' },
  },
  create(context) {
    const obsolete = new Set(OBSOLETE);
    return {
      GlimmerElementNode(node) {
        if (obsolete.has(node.tag)) {
          context.report({ node, messageId: 'obsolete', data: { element: node.tag } });
        }
      },
    };
  },
};
