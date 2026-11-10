'use strict';

const { classifyAttribute } = require('../utils/glimmer-attr-presence');

/** @type {import('eslint').Rule.RuleModule} */
module.exports = {
  meta: {
    type: 'problem',
    docs: {
      description: 'require rel="noopener noreferrer" on links with target="_blank"',
      category: 'Security',

      url: 'https://github.com/ember-cli/eslint-plugin-ember/tree/master/docs/rules/template-link-rel-noopener.md',
    },
    fixable: 'code',
    schema: [],
    messages: {
      missingRel: 'links with target="_blank" must have rel="noopener noreferrer"',
    },
    originallyFrom: {
      name: 'ember-template-lint',
      rule: 'lib/rules/link-rel-noopener.js',
      docs: 'docs/rule/link-rel-noopener.md',
      tests: 'test/unit/rules/link-rel-noopener-test.js',
    },
  },
  create(context) {
    return {
      GlimmerElementNode(node) {
        if (node.tag !== 'a') {
          return;
        }

        // `target` is a plain string attribute. Use classifyAttribute so the
        // rule recognizes any source form that renders as `target="_blank"` —
        // including `target={{"_blank"}}` (i2 analog) and `target="{{'_blank'}}"`
        // (i3 analog) — instead of only the static text-node case.
        const targetAttr = node.attributes?.find((a) => a.name === 'target');
        const targetClass = classifyAttribute(targetAttr);
        if (targetClass.presence !== 'present' || targetClass.value !== '_blank') {
          return;
        }

        const relAttr = node.attributes?.find((a) => a.name === 'rel');
        const relClass = classifyAttribute(relAttr);

        // Conservative-skip when rel is present but its runtime value cannot
        // be determined statically (e.g., `rel={{this.x}}` or
        // `rel="prefix-{{this.y}}"`). Flagging here would be a false positive
        // — the runtime value may already include the required tokens. The
        // doc cross-attribute observation "Concat is never falsy" guarantees
        // that any concat form does render *some* attribute value; it just
        // isn't statically extractable.
        if (relClass.presence === 'present' && relClass.value === null) {
          return;
        }

        const relValue = relClass.value || '';
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
                const oldValue = relAttr.value.chars.trim().replaceAll(/\s+/g, ' ');
                const filtered = oldValue
                  .split(' ')
                  .filter((t) => t !== 'noopener' && t !== 'noreferrer')
                  .join(' ');
                const newValue = `${filtered} noopener noreferrer`.trim();
                return fixer.replaceText(relAttr.value, `"${newValue}"`);
              }
              // Don't autofix when rel is present in a non-text form (e.g.,
              // bare-string-literal mustache or concat) — replacing/inserting
              // would either produce a duplicate `rel` attribute or destroy
              // the author's binding. Report-only.
              if (relAttr) {
                return null;
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
