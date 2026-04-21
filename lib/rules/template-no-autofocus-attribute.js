/**
 * `autofocus` is a boolean HTML attribute. Per the HTML spec, any presence
 * (including `autofocus="false"`, `autofocus=""`, `autofocus="autofocus"`)
 * means the element will auto-focus. Only the genuine absence of the
 * attribute turns off auto-focus.
 *
 * jsx-a11y's `no-autofocus` treats `autofocus={false}` / `autofocus="false"`
 * as opt-outs — that is a peer-plugin convention that diverges from HTML
 * boolean-attribute semantics. vue-a11y and lit-a11y are presence-based,
 * consistent with the spec. We follow the spec.
 *
 * The only exception is a mustache boolean-literal `{{false}}` in element
 * syntax — Glimmer authors writing `autofocus={{false}}` are expressing
 * intent to omit the attribute conditionally. Treat that narrow literal
 * case as opt-out (the rendered HTML will have no autofocus attr).
 */
function isMustacheBooleanFalse(value) {
  if (value?.type !== 'GlimmerMustacheStatement') {
    return false;
  }
  const expr = value.path;
  return expr?.type === 'GlimmerBooleanLiteral' && expr.value === false;
}

/**
 * Returns true when the given GlimmerElementNode is a `<dialog>` element
 * or is nested (at any depth) inside a `<dialog>` element. Per MDN,
 * autofocus on (or within) a dialog is recommended because a dialog should
 * focus its initial element when opened.
 *
 * https://developer.mozilla.org/en-US/docs/Web/HTML/Element/dialog
 */
function isInsideDialog(node) {
  if (node.type === 'GlimmerElementNode' && node.tag === 'dialog') {
    return true;
  }
  let ancestor = node.parent;
  while (ancestor) {
    if (ancestor.type === 'GlimmerElementNode' && ancestor.tag === 'dialog') {
      return true;
    }
    ancestor = ancestor.parent;
  }
  return false;
}

/** @type {import('eslint').Rule.RuleModule} */
module.exports = {
  meta: {
    type: 'suggestion',
    docs: {
      description: 'disallow autofocus attribute',
      category: 'Accessibility',

      url: 'https://github.com/ember-cli/eslint-plugin-ember/tree/master/docs/rules/template-no-autofocus-attribute.md',
    },
    fixable: 'code',
    schema: [],
    messages: {
      noAutofocus:
        'Avoid using autofocus attribute. Autofocusing elements can cause usability issues for sighted and non-sighted users.',
    },
    originallyFrom: {
      name: 'ember-template-lint',
      rule: 'lib/rules/no-autofocus-attribute.js',
      docs: 'docs/rule/no-autofocus-attribute.md',
      tests: 'test/unit/rules/no-autofocus-attribute-test.js',
    },
  },

  create(context) {
    return {
      GlimmerElementNode(node) {
        const autofocusAttr = node.attributes?.find((attr) => attr.name === 'autofocus');

        if (!autofocusAttr) {
          return;
        }

        // Mustache boolean-literal `autofocus={{false}}` renders no attribute
        // at all — the only statically-known opt-out consistent with HTML
        // boolean-attribute semantics.
        if (isMustacheBooleanFalse(autofocusAttr.value)) {
          return;
        }

        // MDN dialog exception: autofocus on a <dialog> or inside a <dialog>
        // is recommended behavior, not an accessibility defect.
        if (isInsideDialog(node)) {
          return;
        }

        context.report({
          node: autofocusAttr,
          messageId: 'noAutofocus',
          fix(fixer) {
            const sourceCode = context.sourceCode;
            const text = sourceCode.getText();
            const attrStart = autofocusAttr.range[0];
            const attrEnd = autofocusAttr.range[1];

            let removeStart = attrStart;
            while (removeStart > 0 && /\s/.test(text[removeStart - 1])) {
              removeStart--;
            }

            return fixer.removeRange([removeStart, attrEnd]);
          },
        });
      },

      GlimmerMustacheStatement(node) {
        if (!node.hash || !node.hash.pairs) {
          return;
        }
        const autofocusPair = node.hash.pairs.find((pair) => pair.key === 'autofocus');
        if (!autofocusPair) {
          return;
        }

        // Mustache hash-pair `{{input autofocus=false}}` — boolean literal
        // false at the hash-pair level is unambiguous and renders no attr.
        // Note: `autofocus="false"` in mustache syntax IS still flagged — per
        // HTML boolean-attribute semantics the string "false" is truthy; it
        // is only jsx-a11y that carves that form out.
        const pairValue = autofocusPair.value;
        if (pairValue?.type === 'GlimmerBooleanLiteral' && pairValue.value === false) {
          return;
        }

        context.report({
          node: autofocusPair,
          messageId: 'noAutofocus',
        });
      },
    };
  },
};
