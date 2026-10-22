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

/** @type {import('eslint').Rule.RuleModule} */
module.exports = {
  meta: {
    type: 'layout',
    docs: {
      description: 'enforce where <template> appears in classes using template tags',
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
              const otherMembersBlock = nonTemplateMembers
                .map((member) => indentFirstLine(sourceCode.getText(member).trim(), indentation))
                .join(`${linebreak}${linebreak}`);

              const ordered = shouldBeBefore
                ? [templateBlock, otherMembersBlock]
                : [otherMembersBlock, templateBlock];

              const replacement = `${linebreak}${ordered.join(`${linebreak}${linebreak}`)}${linebreak}`;

              return fixer.replaceTextRange([node.range[0] + 1, node.range[1] - 1], replacement);
            },
          });
        }
      },
    };
  },
};


