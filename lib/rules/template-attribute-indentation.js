'use strict';

function getWhiteSpaceLength(statement) {
  const whiteSpace = statement.match(/^\s+/) || [];
  return (whiteSpace[0] || '').length;
}

function getEndLocationForOpen(node) {
  return node.type === 'GlimmerBlockStatement' ? node.program.loc.start : node.loc.end;
}

function canApplyRule(node, config, sourceCode) {
  let end;
  if (node.type === 'GlimmerElementNode') {
    // Use the first `>` token to find the end of the opening tag
    const tokens = sourceCode.getTokens(node);
    const openEnd = tokens.find((t) => t.value === '>');
    end = openEnd ? openEnd.loc.end : node.loc.end;
  } else {
    end = getEndLocationForOpen(node);
  }
  const start = node.loc.start;
  if (start.line === end.line) {
    return end.column - start.column > config.maxLength;
  }
  return true;
}

function getSourceForLoc(sourceLines, loc) {
  const startLine = loc.start.line;
  const startColumn = loc.start.column;
  const endLine = loc.end?.line || startLine;
  const endColumn = loc.end?.column;

  if (startLine === endLine) {
    return endColumn === undefined
      ? sourceLines[startLine - 1].slice(startColumn)
      : sourceLines[startLine - 1].slice(startColumn, endColumn);
  }

  const lines = [];
  for (let i = startLine; i <= endLine; i++) {
    if (i === startLine) {
      lines.push(sourceLines[i - 1].slice(startColumn));
    } else if (i === endLine && endColumn !== undefined) {
      lines.push(sourceLines[i - 1].slice(0, endColumn));
    } else {
      lines.push(sourceLines[i - 1]);
    }
  }
  return lines.join('\n');
}

function getSourceForNode(sourceLines, node) {
  return getSourceForLoc(sourceLines, node.loc);
}

function parseOptions(options) {
  if (!options || typeof options !== 'object') {
    return {
      maxLength: 80,
      indentation: 2,
      processElements: true,
      mustacheOpenEnd: 'new-line',
      elementOpenEnd: 'new-line',
    };
  }

  const result = {
    maxLength: 80,
    indentation: 2,
    mustacheOpenEnd: 'new-line',
    elementOpenEnd: 'new-line',
  };

  if ('open-invocation-max-len' in options) {
    result.maxLength = options['open-invocation-max-len'];
  }
  if ('indentation' in options) {
    result.indentation = options.indentation;
  }
  if ('process-elements' in options) {
    result.processElements = options['process-elements'];
  }
  if ('mustache-open-end' in options) {
    result.mustacheOpenEnd = options['mustache-open-end'];
  }
  if ('element-open-end' in options) {
    result.processElements = true;
    result.elementOpenEnd = options['element-open-end'];
  }
  if ('as-indentation' in options) {
    result.asIndentation = options['as-indentation'];
  }
  return result;
}

/** @type {import('eslint').Rule.RuleModule} */
module.exports = {
  meta: {
    type: 'layout',
    docs: {
      description: 'enforce proper indentation of attributes and arguments in multi-line templates',
      category: 'Stylistic Issues',
      recommended: false,
      recommendedGjs: false,
      recommendedGts: false,
      url: 'https://github.com/ember-cli/eslint-plugin-ember/tree/master/docs/rules/template-attribute-indentation.md',
      templateMode: 'both',
    },
    fixable: null,
    schema: [
      {
        type: 'object',
        properties: {
          'open-invocation-max-len': { type: 'integer', minimum: 0 },
          indentation: { type: 'integer', minimum: 0 },
          'process-elements': { type: 'boolean' },
          'mustache-open-end': { enum: ['new-line', 'last-attribute'] },
          'element-open-end': { enum: ['new-line', 'last-attribute'] },
          'as-indentation': { enum: ['attribute', 'closing-brace'] },
        },
        additionalProperties: false,
      },
    ],
    messages: {
      incorrectParamIndentation:
        "Incorrect indentation of {{paramType}} '{{paramName}}' beginning at L{{actualLine}}:C{{actualColumn}}. Expected '{{paramName}}' to be at L{{expectedLine}}:C{{expectedColumn}}.",
      incorrectCloseBrace:
        "Incorrect indentation of close curly braces '}}' for the component '{{{{componentName}}}}' beginning at L{{actualLine}}:C{{actualColumn}}. Expected '{{{{componentName}}}}' to be at L{{expectedLine}}:C{{expectedColumn}}.",
      incorrectCloseBracket:
        "Incorrect indentation of close bracket '>' for the element '<{{tagName}}>' beginning at L{{actualLine}}:C{{actualColumn}}. Expected '<{{tagName}}>' to be at L{{expectedLine}}:C{{expectedColumn}}.",
      incorrectBlockParamIndentation:
        "Incorrect indentation of block params '{{blockParamStatement}}' beginning at L{{actualLine}}:C{{actualColumn}}. Expecting the block params to be at L{{expectedLine}}:C{{expectedColumn}}.",
    },
    originallyFrom: {
      name: 'ember-template-lint',
      rule: 'lib/rules/attribute-indentation.js',
      docs: 'docs/rule/attribute-indentation.md',
      tests: 'test/unit/rules/attribute-indentation-test.js',
    },
  },

  create(context) {
    const config = parseOptions(context.options[0]);
    const sourceCode = context.sourceCode;
    const sourceLines = sourceCode.getText().split('\n');

    function getLineIndentation(node) {
      const currentLine = sourceLines[node.loc.start.line - 1];
      const leadingWhitespace = getWhiteSpaceLength(currentLine);
      if (leadingWhitespace === 0) {
        return node.loc.start.column;
      }
      return leadingWhitespace;
    }

    function getBlockParamStartLoc(node) {
      let actual, expected;
      const actualProgramStartLine = /^\s*}}/.test(sourceLines[node.program.loc.start.line - 1])
        ? 1
        : 0;
      const programStartLoc = {
        line: node.program.loc.start.line - actualProgramStartLine,
        column: node.program.loc.start.column,
      };
      const nodeStart = node.loc.start;
      if (node.params.length === 0 && (!node.hash || node.hash.pairs.length === 0)) {
        expected = {
          line: nodeStart.line + 1,
          column: nodeStart.column,
        };
        if (nodeStart.line === programStartLoc.line) {
          const displayName = `{{#${node.path.original}`;
          actual = {
            line: nodeStart.line,
            column: displayName.length,
          };
        } else {
          const source = getSourceForLoc(sourceLines, {
            start: {
              line: programStartLoc.line,
              column: 0,
            },
            end: programStartLoc,
          });
          actual = {
            line: programStartLoc.line,
            column: getWhiteSpaceLength(source),
          };
        }
      } else {
        let paramOrHashPairEndLoc;

        if (node.params.length > 0) {
          paramOrHashPairEndLoc = node.params.at(-1).loc.end;
        }

        if (node.hash && node.hash.pairs.length > 0) {
          paramOrHashPairEndLoc = node.hash.loc.end;
        }

        const indentation = config.asIndentation === 'attribute' ? 2 : 0;
        expected = {
          line: paramOrHashPairEndLoc.line + 1,
          column: node.loc.start.column + indentation,
        };
        if (paramOrHashPairEndLoc.line === programStartLoc.line) {
          actual = paramOrHashPairEndLoc;
        } else if (paramOrHashPairEndLoc.line < programStartLoc.line) {
          const loc = {
            start: paramOrHashPairEndLoc,
            end: {
              line: paramOrHashPairEndLoc.line,
            },
          };

          const hashPairLineEndSource = getSourceForLoc(sourceLines, loc).trim();

          actual = hashPairLineEndSource
            ? paramOrHashPairEndLoc
            : {
                line: programStartLoc.line,
                column: getWhiteSpaceLength(sourceLines[programStartLoc.line - 1]),
              };
        }
      }
      return { actual, expected };
    }

    function validateBlockParams(node) {
      const location = getBlockParamStartLoc(node);
      const actual = location.actual;
      const expected = location.expected;

      if (actual.line !== expected.line || actual.column !== expected.column) {
        const blockParamStatement = getSourceForLoc(sourceLines, {
          start: actual,
          end: node.program.loc.start,
        }).trim();

        context.report({
          node,
          messageId: 'incorrectBlockParamIndentation',
          loc: { line: actual.line, column: actual.column },
          data: {
            blockParamStatement,
            actualLine: actual.line,
            actualColumn: actual.column,
            expectedLine: expected.line,
            expectedColumn: expected.column,
          },
        });
      }
      const expectedColumnNextLocation =
        node.type === 'GlimmerElementNode' && !node.selfClosing ? 1 : 2;
      return {
        line: expected.line + 1,
        column: expected.column + node.program.loc.start.column - expectedColumnNextLocation,
      };
    }

    function iterateParams(params, type, initialExpectedLineStart, expectedColumnStart, node) {
      let expectedLineStart = initialExpectedLineStart;
      let paramType = type;
      let namePath;

      switch (type) {
        case 'positional': {
          paramType = 'positional param';
          namePath = 'original';
          break;
        }
        case 'htmlAttribute': {
          paramType = 'htmlAttribute';
          namePath = 'name';
          break;
        }
        case 'element modifier': {
          paramType = 'element modifier';
          break;
        }
        default: {
          paramType = type;
          namePath = 'key';
        }
      }

      let nextColumn = expectedColumnStart;
      for (const param of params) {
        const actualStartLocation = param.loc.start;
        nextColumn = param.loc.end.column;
        if (
          expectedLineStart !== actualStartLocation.line ||
          expectedColumnStart !== actualStartLocation.column
        ) {
          const paramName = param[namePath] || param.path?.original;
          context.report({
            node: param,
            messageId: 'incorrectParamIndentation',
            loc: { line: actualStartLocation.line, column: actualStartLocation.column },
            data: {
              paramType,
              paramName,
              actualLine: actualStartLocation.line,
              actualColumn: actualStartLocation.column,
              expectedLine: expectedLineStart,
              expectedColumn: expectedColumnStart,
            },
          });
        }

        const paramValueType = param.value ? param.value.type : param.type;
        if (paramValueType === 'GlimmerSubExpression' || paramValueType === 'SubExpression') {
          if (param.loc.start.line !== param.loc.end.line) {
            expectedLineStart = param.loc.end.line;
          }
        } else if (
          paramValueType === 'GlimmerMustacheStatement' ||
          paramValueType === 'MustacheStatement'
        ) {
          expectedLineStart = param.value.loc.end.line;
          nextColumn = param.value.loc.end.column;
        }

        expectedLineStart++;
      }

      return {
        line: expectedLineStart,
        column: nextColumn,
      };
    }

    function validateParams(node) {
      const leadingWhitespace = getLineIndentation(node);
      const expectedColumnStart = leadingWhitespace + config.indentation;
      const expectedLineStart = node.loc.start.line + 1;

      let nextLocation = {
        line: expectedLineStart,
        column: node.loc.start.column,
      };

      if (node.type === 'GlimmerElementNode') {
        if (node.attributes.length > 0) {
          nextLocation = iterateParams(
            node.attributes,
            'htmlAttribute',
            expectedLineStart,
            expectedColumnStart,
            node
          );
        }

        if (node.modifiers.length > 0) {
          nextLocation = iterateParams(
            node.modifiers,
            'element modifier',
            nextLocation.line,
            expectedColumnStart,
            node
          );
        }
      } else {
        if (node.params.length > 0) {
          nextLocation = iterateParams(
            node.params,
            'positional',
            expectedLineStart,
            expectedColumnStart,
            node
          );
        }
        if (node.hash && node.hash.pairs.length > 0) {
          nextLocation = iterateParams(
            node.hash.pairs,
            'attribute',
            nextLocation.line,
            expectedColumnStart,
            node
          );
        }
      }

      return nextLocation;
    }

    function validateCloseBrace(node, nextLocation) {
      const openIndentation = getLineIndentation(node);

      let actualStartLocation;

      if (node.type === 'GlimmerElementNode') {
        // Use tokens to find the actual `>` position
        const tokens = sourceCode.getTokens(node);
        const openEnd = tokens.find((t) => t.value === '>');
        if (!openEnd) {
          return;
        }
        // For self-closing `/>`, the `>` is preceded by `/`
        if (node.selfClosing) {
          const slashToken = tokens.find((t) => t.value === '/' && t.range[1] === openEnd.range[0]);
          actualStartLocation = slashToken ? slashToken.loc.start : openEnd.loc.start;
        } else {
          actualStartLocation = openEnd.loc.start;
        }
      } else {
        const end = getEndLocationForOpen(node);
        const actualColumnStartLocation =
          node.type === 'GlimmerMustacheStatement' && node.trusting ? 3 : 2;

        actualStartLocation = {
          line: end.line,
          column: end.column - actualColumnStartLocation,
        };
      }

      const endPosition =
        node.type === 'GlimmerElementNode' ? config.elementOpenEnd : config.mustacheOpenEnd;
      const expectedStartLocation = {
        line: endPosition === 'last-attribute' ? nextLocation.line - 1 : nextLocation.line,
        column: endPosition === 'last-attribute' ? nextLocation.column : openIndentation,
      };

      if (
        actualStartLocation.line !== expectedStartLocation.line ||
        actualStartLocation.column !== expectedStartLocation.column
      ) {
        if (node.type === 'GlimmerElementNode') {
          const tagName = node.tag;
          context.report({
            node,
            messageId: 'incorrectCloseBracket',
            loc: { line: actualStartLocation.line, column: actualStartLocation.column },
            data: {
              tagName,
              actualLine: actualStartLocation.line,
              actualColumn: actualStartLocation.column,
              expectedLine: expectedStartLocation.line,
              expectedColumn: expectedStartLocation.column,
            },
          });
        } else {
          const componentName = node.path.original;
          context.report({
            node,
            messageId: 'incorrectCloseBrace',
            loc: { line: actualStartLocation.line, column: actualStartLocation.column },
            data: {
              componentName,
              actualLine: actualStartLocation.line,
              actualColumn: actualStartLocation.column,
              expectedLine: expectedStartLocation.line,
              expectedColumn: expectedStartLocation.column,
            },
          });
        }
      }
    }

    function validateNonBlockForm(node) {
      if (node.params.length > 0 || (node.hash && node.hash.pairs.length > 0)) {
        const nextLocation = validateParams(node);
        validateCloseBrace(node, nextLocation);
        return nextLocation;
      }
      return undefined;
    }

    function validateBlockForm(node) {
      let nextLocation;
      if (node.params.length > 0 || (node.hash && node.hash.pairs.length > 0)) {
        nextLocation = validateParams(node);
      }
      if (node.program?.blockParams && node.program.blockParams.length > 0) {
        nextLocation = validateBlockParams(node);
      }
      if (nextLocation) {
        validateCloseBrace(node, nextLocation);
      }
    }

    return {
      GlimmerBlockStatement(node) {
        if (canApplyRule(node, config, sourceCode)) {
          validateBlockForm(node);
        }
      },

      GlimmerMustacheStatement(node) {
        if (canApplyRule(node, config, sourceCode)) {
          validateNonBlockForm(node);
        }
      },

      GlimmerElementNode(node) {
        if (config.processElements) {
          if (canApplyRule(node, config, sourceCode)) {
            if (node.modifiers.length > 0 || node.attributes.length > 0) {
              const expectedCloseBraceLocation = validateParams(node);
              validateCloseBrace(node, expectedCloseBraceLocation);
            }
          }
        }
      },
    };
  },
};
