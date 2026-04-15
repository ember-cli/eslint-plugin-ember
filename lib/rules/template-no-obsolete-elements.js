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
    const sourceCode = context.sourceCode;

    function hasBindingInScopeChain(scope, name) {
      for (let s = scope; s; s = s.upper) {
        if (s.set && s.set.has(name)) return true;
      }
      return false;
    }

    return {
      GlimmerElementNode(node) {
        if (!obsolete.has(node.tag)) {
          return;
        }
        // Use the parent's scope so that the element's own `as |x|` params
        // (which attach a block scope to this node) don't shadow its own tag
        // name. e.g. `<marquee as |marquee|>` must still flag the outer tag.
        const scope = sourceCode.getScope(node.parent);
        if (hasBindingInScopeChain(scope, node.tag)) {
          return;
        }
        context.report({ node, messageId: 'obsolete', data: { element: node.tag } });
      },
    };
  },
};
