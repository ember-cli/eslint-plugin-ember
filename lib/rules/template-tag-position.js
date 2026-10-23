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

function indentFirstLine(text, indentation) {
  return `${indentation}${text}`;
}

function getLineStart(source, index) {
  return source.lastIndexOf('\n', index - 1) + 1;
}

function getLineEnd(source, index) {
  const lineEnd = source.indexOf('\n', index);
  return lineEnd === -1 ? source.length : lineEnd;
}

/** @type {import('eslint').Rule.RuleModule} */
module.exports = {
  meta: {
    type: 'layout',
    docs: {
      description: 'enforce where `<template>` appears in classes using template tags',
      category: 'Stylistic Issues',
      url: 'https://github.com/ember-cli/eslint-plugin-ember/tree/master/docs/rules/template-tag-position.md',
    },
    fixable: 'whitespace',
    schema: [
      {
        enum: ['before', 'after'],
      },
    ],
    messages: {
      wrongPosition: 'Place <template> {{position}} class members.',
    },
  },

  create(context) {
    const sourceCode = context.sourceCode;
    const sourceText = sourceCode.text;
    const option = context.options[0] || 'after';
    const linebreak = getLinebreak(sourceText);

    return {
      ClassBody(node) {
        const members = node.body;
        const templateMembers = members.filter((member) => member.type === 'GlimmerTemplate');

        if (templateMembers.length !== 1) {
          return;
        }

        const templateNode = templateMembers[0];
        const nonTemplateMembers = members.filter((member) => member !== templateNode);

        if (nonTemplateMembers.length === 0) {
          return;
        }

        const templateIndex = members.indexOf(templateNode);
        const shouldBeBefore = option === 'before';
        const expectedIndex = shouldBeBefore ? 0 : members.length - 1;

        if (templateIndex !== expectedIndex) {
          context.report({
            node: templateNode,
            messageId: 'wrongPosition',
            data: { position: option },
            fix(fixer) {
              const indentation =
                getIndentation(sourceText, templateNode.range[0]) ||
                getIndentation(sourceText, nonTemplateMembers[0].range[0]) ||
                '  ';
              const templateText = sourceCode.getText(templateNode).trim();
              const templateBlock = indentFirstLine(templateText, indentation);

              const removeStart = getLineStart(sourceText, templateNode.range[0]);
              let removeEnd = getLineEnd(sourceText, templateNode.range[1]);
              const nextLine = sourceText.slice(removeEnd, removeEnd + linebreak.length);

              if (nextLine === linebreak) {
                removeEnd += linebreak.length;
              }

              if (shouldBeBefore) {
                const insertAt = getLineStart(sourceText, nonTemplateMembers[0].range[0]);
                return [
                  fixer.replaceTextRange([removeStart, removeEnd], ''),
                  fixer.insertTextBeforeRange(
                    [insertAt, insertAt],
                    `${templateBlock}${linebreak}${linebreak}`
                  ),
                ];
              }

              const lastMember = nonTemplateMembers.at(-1);
              const insertAt = getLineEnd(sourceText, lastMember.range[1]);

              return [
                fixer.replaceTextRange([removeStart, removeEnd], ''),
                fixer.insertTextAfterRange(
                  [insertAt, insertAt],
                  `${linebreak}${linebreak}${templateBlock}`
                ),
              ];
            },
          });
        }
      },
    };
  },
};
