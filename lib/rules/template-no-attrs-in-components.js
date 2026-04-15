// Matches traditional, pod, ui/components, and -components/ paths.
// Also matches Octane co-located templates (app/components/foo.hbs) via
// /components/ — cf. ember-template-lint#1445.
const COMPONENT_TEMPLATE_REGEX = new RegExp(
  'templates/components|components/.*/template|ui/components|-components/|/components/'
);

/** @type {import('eslint').Rule.RuleModule} */
module.exports = {
  meta: {
    type: 'suggestion',
    docs: {
      description: 'disallow attrs in component templates',
      category: 'Deprecations',
      url: 'https://github.com/ember-cli/eslint-plugin-ember/tree/master/docs/rules/template-no-attrs-in-components.md',
      templateMode: 'both',
    },
    schema: [],
    messages: {
      noAttrs: 'Component templates should not contain `attrs`.',
    },
    originallyFrom: {
      name: 'ember-template-lint',
      rule: 'lib/rules/no-attrs-in-components.js',
      docs: 'docs/rule/no-attrs-in-components.md',
      tests: 'test/unit/rules/no-attrs-in-components-test.js',
    },
  },
  create(context) {
    if (!COMPONENT_TEMPLATE_REGEX.test(context.filename)) {
      return {};
    }
    return {
      GlimmerPathExpression(node) {
        // Flag `attrs.*` and `this.attrs.*` — both are pre-Octane args-leakage
        // patterns from @ember/component. In the Glimmer AST, `this.attrs.foo`
        // has parts[0] === 'attrs' (this is the receiver, not a part).
        if (node.parts && node.parts[0] === 'attrs') {
          context.report({ node, messageId: 'noAttrs' });
        }
      },
    };
  },
};
