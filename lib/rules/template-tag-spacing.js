'use strict';

function getLinebreak(source) {
  const match = source.match(/\r\n|\n|\r/);
  return match ? match[0] : '\n';
}

function getIndentation(source, index) {
  const lineStart = source.lastIndexOf('\n', index - 1) + 1;
  const before = source.slice(lineStart, index);
  const match = before.match(/^\s*/u);

  return match ? match[0] : '';
}

function hasBlankLineBetween(source, firstNode, secondNode) {
  const between = source.slice(firstNode.range[1], secondNode.range[0]);
  const linebreaks = between.match(/\r\n|\n|\r/gu);

  return Boolean(linebreaks && linebreaks.length >= 2);
}

function reportMissingBlankLine(context, sourceText, linebreak, current, next) {
  if (hasBlankLineBetween(sourceText, current, next)) {
    return;
  }

  const indentation = getIndentation(sourceText, next.range[0]);

  context.report({
    node: next.type === 'GlimmerTemplate' ? next : current,
    messageId: 'missingBlankLine',
    fix(fixer) {
      return fixer.replaceTextRange(
        [current.range[1], next.range[0]],
        `${linebreak}${linebreak}${indentation}`
      );
    },
  });
}

/** @type {import('eslint').Rule.RuleModule} */
module.exports = {
  meta: {
    type: 'layout',
    docs: {
      description: 'require a blank line between class members and `<template>` tags',
      category: 'Stylistic Issues',
      url: 'https://github.com/ember-cli/eslint-plugin-ember/tree/master/docs/rules/template-tag-spacing.md',
    },
    fixable: 'whitespace',
    schema: [],
    messages: {
      missingBlankLine: 'Add an empty line between class members and <template>.',
    },
  },

  create(context) {
    const sourceCode = context.sourceCode;
    const sourceText = sourceCode.text;
    const linebreak = getLinebreak(sourceText);

    return {
      ClassBody(node) {
        const members = node.body;

        if (members.length <= 1) {
          return;
        }

        const templateMembers = members.filter((member) => member.type === 'GlimmerTemplate');
        if (templateMembers.length !== 1) {
          return;
        }

        const templateIndex = members.indexOf(templateMembers[0]);
        const isInMiddle = templateIndex > 0 && templateIndex < members.length - 1;

        // Let template-tag-position own middle-placement fixes to avoid overlapping
        // fix ranges when editors apply save-actions differently than CLI --fix.
        if (isInMiddle) {
          return;
        }

        for (let index = 0; index < members.length - 1; index++) {
          const current = members[index];
          const next = members[index + 1];
          const touchesTemplate =
            current.type === 'GlimmerTemplate' || next.type === 'GlimmerTemplate';

          if (!touchesTemplate) {
            continue;
          }

          reportMissingBlankLine(context, sourceText, linebreak, current, next);
        }
      },

      Program(node) {
        const body = node.body;

        if (body.length <= 1) {
          return;
        }

        for (let index = 0; index < body.length - 1; index++) {
          const current = body[index];
          const next = body[index + 1];
          const touchesTemplate =
            current.type === 'GlimmerTemplate' || next.type === 'GlimmerTemplate';

          if (!touchesTemplate) {
            continue;
          }

          reportMissingBlankLine(context, sourceText, linebreak, current, next);
        }
      },
    };
  },
};
