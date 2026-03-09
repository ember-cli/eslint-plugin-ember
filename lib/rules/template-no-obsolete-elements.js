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
  'param',
  'plaintext',
  'rb',
  'rtc',
  'spacer',
  'strike',
  'tt',
  'xmp',
];
/** @type {import('eslint').Rule.RuleModule} */
module.exports = {
  meta: {
    type: 'suggestion',
    docs: {
      description: 'disallow obsolete HTML elements',
      category: 'Best Practices',
      url: 'https://github.com/ember-cli/eslint-plugin-ember/tree/master/docs/rules/template-no-obsolete-elements.md',
      templateMode: 'both',
    },
    schema: [],
    messages: { obsolete: '<{{element}}> is obsolete, use modern alternatives' },
    originallyFrom: {
      name: 'ember-template-lint',
      rule: 'lib/rules/no-obsolete-elements.js',
      docs: 'docs/rule/no-obsolete-elements.md',
      tests: 'test/unit/rules/no-obsolete-elements-test.js',
    },
  },
  create(context) {
    const obsolete = new Set(OBSOLETE);
    const blockParamsInScope = [];

    return {
      GlimmerBlockStatement(node) {
        const params = node.program?.blockParams || [];
        blockParamsInScope.push(...params);
      },
      'GlimmerBlockStatement:exit'(node) {
        const params = node.program?.blockParams || [];
        for (let i = 0; i < params.length; i++) {
          blockParamsInScope.pop();
        }
      },
      GlimmerElementNode(node) {
        if (blockParamsInScope.includes(node.tag)) {
          return;
        }
        if (obsolete.has(node.tag)) {
          context.report({ node, messageId: 'obsolete', data: { element: node.tag } });
        }
      },
    };
  },
};
