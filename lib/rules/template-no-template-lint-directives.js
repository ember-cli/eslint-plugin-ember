'use strict';

const DIRECTIVE_COMMENT =
  /^(?<open>{{!(?:--)?)\s*template-lint-(?<action>disable|enable)(?<rules>\s+[^]*?)?\s*(?:--)?}}$/;

/** @type {import('eslint').Rule.RuleModule} */
module.exports = {
  meta: {
    type: 'suggestion',
    docs: {
      description:
        'disallow `{{! template-lint-* }}` directives (use the `{{! eslint-* }}` equivalents)',
      category: 'Best Practices',
      url: 'https://github.com/ember-cli/eslint-plugin-ember/tree/master/docs/rules/template-no-template-lint-directives.md',
      templateMode: 'both',
    },
    fixable: 'code',
    schema: [],
    messages: {
      convert: 'Use `eslint-{{action}}` instead of `template-lint-{{action}}`.',
    },
  },

  create(context) {
    const sourceCode = context.sourceCode;
    // Glimmer parks comments that appear inside an element's opening tag
    // (between attributes) on `element.comments`, not in the children. We
    // collect them so the Program:exit pass can lift a converted directive
    // to before its enclosing element — ESLint scopes line-based directives
    // from where they appear, and the violation typically lives on the
    // element's start line, not on the in-attribute line.
    const elementByCommentStart = new Map();

    return {
      GlimmerElementNode(node) {
        for (const c of node.comments || []) {
          if (c.range) {
            elementByCommentStart.set(c.range[0], node);
          }
        }
      },

      'Program:exit'() {
        for (const comment of sourceCode.getAllComments()) {
          const raw = sourceCode.text.slice(...comment.range);
          const converted = convertComment(raw);
          if (!converted) {
            continue;
          }
          const enclosingElement = elementByCommentStart.get(comment.range[0]);
          context.report({
            node: comment,
            messageId: 'convert',
            data: { action: converted.action },
            fix: (fixer) =>
              enclosingElement
                ? liftBeforeElement(
                    fixer,
                    comment,
                    converted.newComment,
                    enclosingElement,
                    sourceCode
                  )
                : fixer.replaceTextRange(comment.range, converted.newComment),
          });
        }
      },
    };
  },
};

function convertComment(rawComment) {
  const match = rawComment.match(DIRECTIVE_COMMENT);
  if (!match) {
    return null;
  }
  const { open, action, rules: rulesPart } = match.groups;
  // ESLint directives use comma-separated rule names; template-lint uses
  // whitespace. Prefix each with `ember/template-` to land in the namespace
  // where the ports live.
  const rules = (rulesPart || '')
    .trim()
    .split(/\s+/)
    .filter(Boolean)
    .map((r) => `ember/template-${r}`)
    .join(', ');
  const body = rules ? `eslint-${action} ${rules}` : `eslint-${action}`;
  // Emit symmetric markers regardless of what the source did.
  const close = open.length === 5 ? '--}}' : '}}';
  return {
    action,
    newComment: `${open} ${body} ${close}`,
  };
}

// Strip the in-attribute comment line entirely (leading indent through
// trailing newline) and re-emit the converted directive on its own line at
// the element's indent, just above the element.
function liftBeforeElement(fixer, comment, newComment, element, sourceCode) {
  const text = sourceCode.text;
  const lineStart = comment.range[0] - comment.loc.start.column;
  const lineEnd = text[comment.range[1]] === '\n' ? comment.range[1] + 1 : comment.range[1];
  const indent = ' '.repeat(element.loc.start.column);
  return [
    fixer.removeRange([lineStart, lineEnd]),
    fixer.insertTextBeforeRange(element.range, `${newComment}\n${indent}`),
  ];
}
