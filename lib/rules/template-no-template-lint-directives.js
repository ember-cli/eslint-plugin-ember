'use strict';

const DIRECTIVE_COMMENT =
  /^(?<open>{{!(?:--)?)\s*template-lint-(?<action>disable|enable)(?<tree>-tree)?(?<rules>\s+[^]*?)?\s*(?:--)?}}$/;

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
      convert: 'Use `{{replacement}}` instead of `{{directive}}`.',
    },
  },

  create(context) {
    const sourceCode = context.sourceCode;
    // Glimmer parks comments that appear inside an element's opening tag
    // (between attributes) on `element.comments`, not in the children. Those
    // are the element-scoped directives, and converting them faithfully needs
    // the element they belong to.
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
          const directive = parseDirective(sourceCode.text.slice(...comment.range));
          if (!directive) {
            continue;
          }
          const enclosingElement = elementByCommentStart.get(comment.range[0]);
          const scoped = directive.action === 'disable' && enclosingElement;
          context.report({
            node: comment,
            messageId: 'convert',
            data: {
              directive: `template-lint-${directive.action}${directive.tree ? '-tree' : ''}`,
              replacement: scoped ? 'eslint-disable`/`eslint-enable' : `eslint-${directive.action}`,
            },
            fix: (fixer) =>
              scoped
                ? wrapElementInRegion(fixer, comment, directive, enclosingElement, sourceCode)
                : fixer.replaceTextRange(
                    comment.range,
                    buildComment(directive, `eslint-${directive.action}`)
                  ),
          });
        }
      },
    };
  },
};

// ember-template-lint accepts quoted rule names in its directives and strips
// the quotes before matching, so `{{! template-lint-disable "no-log" }}` is a
// live directive. Mirror its `unquote` exactly: strip only when the first and
// last character are the same quote character.
function unquote(name) {
  if (name.length < 3) {
    return name;
  }
  const first = name[0];
  if (first === name.at(-1) && (first === '"' || first === "'")) {
    return name.slice(1, -1);
  }
  return name;
}

function parseDirective(rawComment) {
  const match = rawComment.match(DIRECTIVE_COMMENT);
  if (!match) {
    return null;
  }
  const { open, action, tree, rules: rulesPart } = match.groups;
  // ESLint directives use comma-separated rule names; template-lint uses
  // whitespace. Prefix each with `ember/template-` to land in the namespace
  // where the ports live.
  const rules = (rulesPart || '')
    .trim()
    .split(/\s+/)
    .filter(Boolean)
    .map((r) => `ember/template-${unquote(r)}`)
    .join(', ');
  return {
    action,
    tree: Boolean(tree),
    rules,
    open,
    // Emit symmetric markers regardless of what the source did.
    close: open.length === 5 ? '--}}' : '}}',
  };
}

// Indentation to give an inserted comment: the element's own, but only when the
// element opens its line. Nested directives are converted over several fix
// passes, and by a later pass the element can already be preceded on its line
// by comments an earlier pass inserted — indenting to its column then would
// push the markup out by the width of those comments.
function indentOf(element, text) {
  const lineStart = element.range[0] - element.loc.start.column;
  const prefix = text.slice(lineStart, element.range[0]);
  return /^\s*$/.test(prefix) ? prefix : '';
}

function buildComment(directive, eslintDirective) {
  const body = directive.rules ? `${eslintDirective} ${directive.rules}` : eslintDirective;
  return `${directive.open} ${body} ${directive.close}`;
}

// A `template-lint-disable` sitting inside an element's opening tag is scoped
// to that element: without `-tree` it covers the opening tag only, with `-tree`
// it covers the element's whole subtree. ESLint has no element scope, but an
// `eslint-disable` / `eslint-enable` pair delimits an arbitrary region, so
// bracketing the element reproduces either scope exactly. Closing the region
// right after the opening tag (as the element's first child) leaves
// descendants reporting, which is the non-`-tree` behaviour.
function wrapElementInRegion(fixer, comment, directive, element, sourceCode) {
  const text = sourceCode.text;
  // Strip the directive, leaving the opening tag as the author wrote it. When
  // the comment has the line to itself, take the whole line — leading indent
  // through trailing newline — so no blank line is left behind. When it shares
  // the line with markup, take the comment plus the single space it sat in;
  // reaching back to the line start there would swallow the tag itself.
  const lineStart = comment.range[0] - comment.loc.start.column;
  const ownsLine = /^\s*$/.test(text.slice(lineStart, comment.range[0]));
  let removeFrom = ownsLine ? lineStart : comment.range[0];
  let removeTo = comment.range[1];
  if (ownsLine) {
    if (text[removeTo] === '\n') {
      removeTo += 1;
    }
  } else if (text[removeTo] === ' ') {
    removeTo += 1;
  } else if (text[removeFrom - 1] === ' ') {
    removeFrom -= 1;
  }
  const indent = indentOf(element, text);

  const fixes = [
    fixer.removeRange([removeFrom, removeTo]),
    fixer.insertTextBeforeRange(
      element.range,
      `${buildComment(directive, 'eslint-disable')}\n${indent}`
    ),
  ];

  const enableComment = buildComment(directive, 'eslint-enable');
  const firstChild = element.children?.[0];
  if (!directive.tree && firstChild) {
    fixes.push(fixer.insertTextBeforeRange(firstChild.range, enableComment));
  } else {
    // `-tree`, or an element with no children where the two scopes coincide.
    fixes.push(fixer.insertTextAfterRange(element.range, `\n${indent}${enableComment}`));
  }
  return fixes;
}
