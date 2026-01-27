'use strict';

const { resolveEditorConfig } = require('../utils/editorconfig');

const VOID_TAGS = new Set([
  'area',
  'base',
  'br',
  'col',
  'command',
  'embed',
  'hr',
  'img',
  'input',
  'keygen',
  'link',
  'meta',
  'param',
  'source',
  'track',
  'wbr',
]);
const IGNORED_ELEMENTS = new Set(['pre', 'script', 'style', 'textarea']);

function isControlChar(char) {
  return char === '~' || char === '{' || char === '}';
}

function getDisplayName(node) {
  switch (node.type) {
    case 'GlimmerElementNode': {
      return `<${node.tag}>`;
    }
    case 'GlimmerBlockStatement': {
      return `{{#${node.path.original}}}`;
    }
    case 'GlimmerMustacheStatement': {
      return `{{${node.path.original}}}`;
    }
    case 'GlimmerTextNode': {
      return node.chars.replace(/^\s*/, '');
    }
    case 'GlimmerCommentStatement': {
      return `<!--${node.value}-->`;
    }
    case 'GlimmerMustacheCommentStatement': {
      return `{{!${node.value}}}`;
    }
    default: {
      return node.path?.original || '';
    }
  }
}

function childrenFor(node) {
  if (node.type === 'GlimmerBlockStatement') {
    return node.program.body;
  }
  return node.children || [];
}

function hasChildren(node) {
  return childrenFor(node).length > 0;
}

function hasLeadingContent(child, siblings) {
  const currentIndex = siblings.indexOf(child);
  for (let j = currentIndex - 1; j >= 0; j--) {
    const sibling = siblings[j];
    if (sibling.loc && sibling.type !== 'GlimmerTextNode') {
      if (sibling.loc.end.line === child.loc.start.line) {
        return true;
      }
      break;
    } else if (sibling.type === 'GlimmerTextNode') {
      const lines = sibling.chars.split(/[\n\r]/);
      const lastLine = lines.at(-1);
      if (lastLine.trim()) {
        return true;
      }
      if (lines.length > 1) {
        break;
      }
    }
  }
  return false;
}

function detectNestedElseIfBlock(node) {
  const inverse = node.inverse;
  const firstItem = inverse && inverse.body[0];
  if (inverse && firstItem && firstItem.type === 'GlimmerBlockStatement') {
    return (
      inverse.loc.start.line === firstItem.loc.start.line &&
      inverse.loc.start.column > firstItem.loc.start.column
    );
  }
  return false;
}

function parseOptions(options) {
  if (!options) {
    return { indentation: 2 };
  }
  if (typeof options === 'number') {
    return { indentation: options };
  }
  if (options === 'tab') {
    return { indentation: 1 };
  }
  if (typeof options === 'object') {
    return {
      indentation: options.indentation || 2,
      ignoreComments: options.ignoreComments || false,
    };
  }
  return { indentation: 2 };
}

/** @type {import('eslint').Rule.RuleModule} */
module.exports = {
  meta: {
    type: 'layout',
    docs: {
      description: 'enforce consistent indentation for block statements and their children',
      category: 'Stylistic Issues',
      recommended: false,
      recommendedGjs: false,
      recommendedGts: false,
      url: 'https://github.com/ember-cli/eslint-plugin-ember/tree/master/docs/rules/template-block-indentation.md',
      templateMode: 'both',
    },
    fixable: null,
    schema: [
      {
        oneOf: [
          { type: 'integer', minimum: 0 },
          { enum: ['tab'] },
          {
            type: 'object',
            properties: {
              indentation: { type: 'integer', minimum: 0 },
              ignoreComments: { type: 'boolean' },
            },
            additionalProperties: false,
          },
        ],
      },
    ],
    messages: {
      incorrectEnd:
        'Incorrect indentation for `{{displayName}}` beginning at L{{startLine}}:C{{startColumn}}. Expected `{{display}}` ending at L{{endLine}}:C{{endColumn}} to be at an indentation of {{expectedColumn}}, but was found at {{actualColumn}}.',
      incorrectChild:
        'Incorrect indentation for `{{display}}` beginning at L{{startLine}}:C{{startColumn}}. Expected `{{display}}` to be at an indentation of {{expectedColumn}}, but was found at {{actualColumn}}.',
      incorrectElse:
        'Incorrect indentation for inverse block of `{{{{#{{displayName}}}}}}` beginning at L{{startLine}}:C{{startColumn}}. Expected `{{{{else}}}}` starting at L{{elseLine}}:C{{elseColumn}} to be at an indentation of {{expectedColumn}}, but was found at {{actualColumn}}.',
    },
    originallyFrom: {
      name: 'ember-template-lint',
      rule: 'lib/rules/block-indentation.js',
      docs: 'docs/rule/block-indentation.md',
      tests: 'test/unit/rules/block-indentation-test.js',
    },
  },

  create(context) {
    const options = context.options[0];
    let config;
    if (options === undefined) {
      // No explicit config — try .editorconfig for indent_size
      const filePath = context.filename || context.getFilename();
      const editorConfig = resolveEditorConfig(filePath);
      const indent = editorConfig.indent_size;
      config = { indentation: typeof indent === 'number' ? indent : 2 };
    } else {
      config = parseOptions(options);
    }
    const sourceCode = context.sourceCode;
    const sourceText = sourceCode.getText();
    const sourceLines = sourceText.split('\n');
    const elementStack = [];
    const seen = new Set();
    const elseIfBlocks = new WeakSet();
    let templateRange = null;

    function isWithinIgnoredElement() {
      return elementStack.some((n) => IGNORED_ELEMENTS.has(n.tag));
    }

    function endingControlCharCount(node) {
      if (node.type === 'GlimmerElementNode') {
        return 3; // </>
      }

      const nodeSource = sourceCode.getText(node);
      const endingToken = `/${node.path.original}`;
      const indexOfEnding = nodeSource.lastIndexOf(endingToken);

      let leadingControlCharCount = 0;
      let i = indexOfEnding - 1;
      while (i >= 0 && isControlChar(nodeSource[i])) {
        leadingControlCharCount++;
        i--;
      }

      let trailingControlCharCount = 0;
      i = indexOfEnding + endingToken.length;
      while (i < nodeSource.length && isControlChar(nodeSource[i])) {
        trailingControlCharCount++;
        i++;
      }

      return leadingControlCharCount + 1 + trailingControlCharCount; // +1 for closing slash
    }

    function shouldValidateBlockEnd(node) {
      if (elseIfBlocks.has(node)) {
        return false;
      }
      if (node.type === 'GlimmerElementNode' && VOID_TAGS.has(node.tag)) {
        return false;
      }
      if (isWithinIgnoredElement()) {
        return false;
      }
      if (node.type === 'GlimmerElementNode') {
        return hasChildren(node);
      }
      return true;
    }

    function validateBlockEnd(node) {
      if (!shouldValidateBlockEnd(node)) {
        return;
      }

      const isElement = node.type === 'GlimmerElementNode';
      const displayName = isElement ? node.tag : node.path.original;
      const display = isElement ? `</${displayName}>` : `{{/${displayName}}}`;
      const startColumn = node.loc.start.column;
      const endColumn = node.loc.end.column;

      const controlCharCount = endingControlCharCount(node);
      const correctedEndColumn = endColumn - displayName.length - controlCharCount;
      const expectedEndColumn = startColumn;

      if (correctedEndColumn !== expectedEndColumn) {
        context.report({
          node,
          messageId: 'incorrectEnd',
          loc: { line: node.loc.end.line, column: correctedEndColumn },
          data: {
            displayName,
            display,
            startLine: node.loc.start.line,
            startColumn: node.loc.start.column,
            endLine: node.loc.end.line,
            endColumn: node.loc.end.column,
            expectedColumn: expectedEndColumn,
            actualColumn: correctedEndColumn,
          },
        });
      }
    }

    function validateBlockChildren(node) {
      if (isWithinIgnoredElement()) {
        return;
      }

      const children = childrenFor(node).filter((x) => !elseIfBlocks.has(x));

      if (!hasChildren(node)) {
        return;
      }

      // Blocks that start and end on the same line cannot have indentation issues
      if (node.loc.start.line === node.loc.end.line) {
        return;
      }

      const startColumn = node.loc.start.column;
      const expectedStartColumn = startColumn + config.indentation;

      for (const child of children) {
        if (!child.loc) {
          continue;
        }

        if (
          config.ignoreComments &&
          (child.type === 'GlimmerCommentStatement' ||
            child.type === 'GlimmerMustacheCommentStatement')
        ) {
          break;
        }

        if (hasLeadingContent(child, children)) {
          continue;
        }

        let childStartColumn = child.loc.start.column;
        let childStartLine = child.loc.start.line;

        // Sanitize text node starting column info
        if (child.type === 'GlimmerTextNode') {
          const withoutLeadingNewLines = child.chars.replace(/^(\r\n|\n)*/, '');
          const firstNonWhitespace = withoutLeadingNewLines.search(/\S/);

          // The TextNode is whitespace only, skip
          if (firstNonWhitespace === -1) {
            continue;
          }

          // Reset the child start column if there's a line break
          if (/^(\r\n|\n)/.test(child.chars)) {
            childStartColumn = 0;
            const newLineLength = child.chars.length - withoutLeadingNewLines.length;
            const leadingNewLines = child.chars.slice(0, newLineLength);
            childStartLine += (leadingNewLines.match(/\n/g) || []).length;
          }

          childStartColumn += firstNonWhitespace;

          // Detect if the TextNode starts with `{{`, correct for the stripped leading backslash
          if (withoutLeadingNewLines.slice(0, 2) === '{{') {
            childStartColumn -= 1;
          }
        }

        if (expectedStartColumn !== childStartColumn) {
          const display = getDisplayName(child);

          context.report({
            node,
            messageId: 'incorrectChild',
            loc: { line: childStartLine, column: childStartColumn },
            data: {
              display,
              startLine: childStartLine,
              startColumn: childStartColumn,
              expectedColumn: expectedStartColumn,
              actualColumn: childStartColumn,
            },
          });
        }
      }
    }

    function validateBlockElse(node) {
      if (node.type !== 'GlimmerBlockStatement' || !node.inverse) {
        return;
      }

      if (detectNestedElseIfBlock(node)) {
        elseIfBlocks.add(node.inverse.body[0]);
      }

      const startColumn = node.loc.start.column;
      const expectedStartColumn = startColumn;
      const elseStartColumn = node.program.loc.end.column;

      if (elseStartColumn !== expectedStartColumn) {
        const displayName = node.path.original;

        context.report({
          node,
          messageId: 'incorrectElse',
          loc: { line: node.inverse.loc.start.line, column: elseStartColumn },
          data: {
            displayName,
            startLine: node.loc.start.line,
            startColumn: node.loc.start.column,
            elseLine: node.inverse.loc.start.line,
            elseColumn: elseStartColumn,
            expectedColumn: expectedStartColumn,
            actualColumn: elseStartColumn,
            else: 'else',
          },
        });
      }
    }

    function process(node) {
      // Skip nodes that start and end on the same line
      if (node.loc.start.line === node.loc.end.line || seen.has(node)) {
        seen.add(node);
        return;
      }

      validateBlockElse(node);
      validateBlockEnd(node);
      validateBlockChildren(node);

      seen.add(node);
    }

    return {
      GlimmerTemplate(node) {
        // Track the template range so we can skip the wrapper element in GJS
        templateRange = node.range;
      },

      GlimmerBlockStatement(node) {
        process(node);
      },

      GlimmerElementNode(node) {
        // Skip the <template> wrapper element in GJS mode.
        // In GJS, the wrapper has tag='template' and same range as GlimmerTemplate.
        // In HBS, root elements share the range but have their actual tag name.
        if (
          templateRange &&
          node.tag === 'template' &&
          node.range[0] === templateRange[0] &&
          node.range[1] === templateRange[1]
        ) {
          return;
        }
        elementStack.push(node);
        process(node);
      },

      'GlimmerElementNode:exit'(node) {
        if (
          templateRange &&
          node.tag === 'template' &&
          node.range[0] === templateRange[0] &&
          node.range[1] === templateRange[1]
        ) {
          return;
        }
        elementStack.pop();
      },
    };
  },
};
