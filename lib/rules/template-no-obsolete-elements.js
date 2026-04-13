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

    // Manual block-param tracking is intentional here. In HBS mode the ESLint
    // scope manager does not register Glimmer block params (from
    // {{#let ... as |x|}} or <Comp as |x|>), so getScope() would not see them.
    // The push/pop stack handles both GlimmerBlockStatement and
    // GlimmerElementNode uniformly.
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
        // Check the element's own tag before pushing its block params, so an
        // element's own params don't shadow its own tag name (e.g.
        // `<marquee as |marquee|>` should still flag the outer <marquee>).
        if (!blockParamsInScope.includes(node.tag) && obsolete.has(node.tag)) {
          context.report({ node, messageId: 'obsolete', data: { element: node.tag } });
        }
        // Element-level block params (e.g. `<Comp as |param|>`) are scoped to
        // the children, so push them after the obsolete check. Pop on exit.
        const elementParams = node.blockParams || [];
        blockParamsInScope.push(...elementParams);
      },
      'GlimmerElementNode:exit'(node) {
        const elementParams = node.blockParams || [];
        for (let i = 0; i < elementParams.length; i++) {
          blockParamsInScope.pop();
        }
      },
    };
  },
};
