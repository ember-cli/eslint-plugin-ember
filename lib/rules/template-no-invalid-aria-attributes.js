/** @type {import('eslint').Rule.RuleModule} */
module.exports = {
  meta: {
    type: 'problem',
    docs: {
      description: 'disallow invalid aria-* attributes',
      category: 'Accessibility',
      url: 'https://github.com/ember-cli/eslint-plugin-ember/tree/master/docs/rules/template-no-invalid-aria-attributes.md',
    },
    schema: [],
    messages: {
      noInvalidAriaAttribute: 'Invalid ARIA attribute: {{attribute}}',
    },
    strictGjs: true,
    strictGts: true,
  },

  create(context) {
    const validAriaAttributes = new Set([
      'aria-activedescendant',
      'aria-atomic',
      'aria-autocomplete',
      'aria-busy',
      'aria-checked',
      'aria-colcount',
      'aria-colindex',
      'aria-colspan',
      'aria-controls',
      'aria-current',
      'aria-describedby',
      'aria-details',
      'aria-disabled',
      'aria-dropeffect',
      'aria-errormessage',
      'aria-expanded',
      'aria-flowto',
      'aria-grabbed',
      'aria-haspopup',
      'aria-hidden',
      'aria-invalid',
      'aria-keyshortcuts',
      'aria-label',
      'aria-labelledby',
      'aria-level',
      'aria-live',
      'aria-modal',
      'aria-multiline',
      'aria-multiselectable',
      'aria-orientation',
      'aria-owns',
      'aria-placeholder',
      'aria-posinset',
      'aria-pressed',
      'aria-readonly',
      'aria-relevant',
      'aria-required',
      'aria-roledescription',
      'aria-rowcount',
      'aria-rowindex',
      'aria-rowspan',
      'aria-selected',
      'aria-setsize',
      'aria-sort',
      'aria-valuemax',
      'aria-valuemin',
      'aria-valuenow',
      'aria-valuetext',
    ]);

    return {
      GlimmerAttrNode(node) {
        if (node.name.startsWith('aria-')) {
          if (!validAriaAttributes.has(node.name)) {
            context.report({
              node,
              messageId: 'noInvalidAriaAttribute',
              data: { attribute: node.name },
            });
          }
        }
      },
    };
  },
};
