const ContentTag = require('content-tag');
const glimmer = require('@glimmer/syntax');
const DocumentLines = require('../utils/document');
const { visitorKeys: glimmerVisitorKeys } = require('@glimmer/syntax');
const babelParser = require('@babel/eslint-parser');
const typescriptParser = require('@typescript-eslint/parser');
const TypescriptScope = require('@typescript-eslint/scope-manager');
const { Reference, Scope, Variable, Definition } = require('eslint-scope');
const { registerParsedFile } = require('../preprocessors/noop');
const htmlTags = require('html-tags');

/**
 * finds the nearest node scope
 * @param scopeManager
 * @param nodePath
 * @return {*|null}
 */
function findParentScope(scopeManager, nodePath) {
  let scope = null;
  let path = nodePath;
  while (path) {
    scope = scopeManager.acquire(path.node, true);
    if (scope) {
      return scope;
    }
    path = path.parentPath;
  }
  return null;
}

/**
 * tries to find the variable names {name} in any parent scope
 * if the variable is not found it just returns the nearest scope,
 * so that it's usage can be registered.
 * @param scopeManager
 * @param nodePath
 * @param name
 * @return {{scope: null, variable: *}|{scope: (*|null)}}
 */
function findVarInParentScopes(scopeManager, nodePath, name) {
  let scope = null;
  let path = nodePath;
  while (path) {
    scope = scopeManager.acquire(path.node, true);
    if (scope && scope.set.has(name)) {
      break;
    }
    path = path.parentPath;
  }
  const currentScope = findParentScope(scopeManager, nodePath);
  if (!scope) {
    return { scope: currentScope };
  }
  return { scope: currentScope, variable: scope.set.get(name) };
}

/**
 * registers a node variable usage in the scope.
 * @param node
 * @param scope
 * @param variable
 */
function registerNodeInScope(node, scope, variable) {
  const ref = new Reference(node, scope, Reference.READ);
  if (variable) {
    variable.references.push(ref);
    ref.resolved = variable;
  } else {
    // register missing variable in most upper scope.
    let s = scope;
    while (s.upper) {
      s = s.upper;
    }
    s.through.push(ref);
  }
  scope.references.push(ref);
}

/**
 * traverses all nodes using the {visitorKeys} calling the callback function, visitor
 * @param visitorKeys
 * @param node
 * @param visitor
 */
function traverse(visitorKeys, node, visitor) {
  const allVisitorKeys = visitorKeys;
  const queue = [];

  queue.push({
    node,
    parent: null,
    parentKey: null,
    parentPath: null,
  });

  while (queue.length > 0) {
    const currentPath = queue.pop();

    visitor(currentPath);

    const visitorKeys = allVisitorKeys[currentPath.node.type];
    if (!visitorKeys) {
      continue;
    }

    for (const visitorKey of visitorKeys) {
      const child = currentPath.node[visitorKey];

      if (!child) {
        continue;
      } else if (Array.isArray(child)) {
        for (const item of child) {
          queue.push({
            node: item,
            parent: currentPath.node,
            parentKey: visitorKey,
            parentPath: currentPath,
          });
        }
      } else {
        queue.push({
          node: child,
          parent: currentPath.node,
          parentKey: visitorKey,
          parentPath: currentPath,
        });
      }
    }
  }
}

function isUpperCase(char) {
  return char.toUpperCase() === char;
}

function isAlphaNumeric(code) {
  return !(
    !(code > 47 && code < 58) && // numeric (0-9)
    !(code > 64 && code < 91) && // upper alpha (A-Z)
    !(code > 96 && code < 123)
  );
}

function isWhiteSpace(code) {
  return code === ' ' || code === '\t' || code === '\r' || code === '\n' || code === '\v';
}

/**
 * simple tokenizer for templates, just splits it up into words and punctuators
 * @param template {string}
 * @param startOffset {number}
 * @param doc {DocumentLines}
 * @return {Token[]}
 */
function tokenize(template, doc, startOffset) {
  const tokens = [];
  let current = '';
  let start = 0;
  function pushToken(value, type, range) {
    const t = {
      type,
      value,
      range,
      start: range[0],
      end: range[1],
      loc: {
        start: { ...doc.offsetToPosition(range[0]), index: range[0] },
        end: { ...doc.offsetToPosition(range[1]), index: range[1] },
      },
    };
    tokens.push(t);
  }
  for (const [i, c] of [...template].entries()) {
    if (isAlphaNumeric(c.codePointAt(0))) {
      if (current.length === 0) {
        start = i;
      }
      current += c;
    } else {
      let range = [startOffset + start, startOffset + i];
      if (current.length > 0) {
        pushToken(current, 'word', range);
        current = '';
      }
      range = [startOffset + i, startOffset + i + 1];
      if (!isWhiteSpace(c)) {
        pushToken(c, 'Punctuator', range);
      }
    }
  }
  return tokens;
}

/**
 * Preprocesses the template info, parsing the template content to Glimmer AST,
 * fixing the offsets and locations of all nodes
 * also calculates the block params locations & ranges
 * and adding it to the info
 * @param info
 * @param code
 * @return {{templateVisitorKeys: {}, comments: *[], templateInfos: {templateRange: *, range: *, replacedRange: *}[]}}
 */
function preprocessGlimmerTemplates(info, code) {
  const templateInfos = info.templateInfos.map((r) => ({
    range: [r.contentRange.start, r.contentRange.end],
    templateRange: [r.range.start, r.range.end],
  }));
  const templateVisitorKeys = {};
  const codeLines = new DocumentLines(code);
  const comments = [];
  const textNodes = [];
  for (const tpl of templateInfos) {
    const range = tpl.range;
    const template = code.slice(...range);
    const docLines = new DocumentLines(template);
    const ast = glimmer.preprocess(template, { mode: 'codemod' });
    ast.tokens = tokenize(code.slice(...tpl.templateRange), codeLines, tpl.templateRange[0]);
    const allNodes = [];
    glimmer.traverse(ast, {
      All(node, path) {
        const n = node;
        n.parent = path.parentNode;
        allNodes.push(node);
        if (node.type === 'CommentStatement' || node.type === 'MustacheCommentStatement') {
          comments.push(node);
        }
        if (node.type === 'TextNode') {
          n.value = node.chars;
          textNodes.push(node);
        }
      },
    });
    ast.content = template;
    const allNodeTypes = new Set();
    for (const n of allNodes) {
      if (n.type === 'PathExpression') {
        n.head.range = [
          range[0] + docLines.positionToOffset(n.head.loc.start),
          range[0] + docLines.positionToOffset(n.head.loc.end),
        ];
        n.head.loc = {
          start: codeLines.offsetToPosition(n.head.range[0]),
          end: codeLines.offsetToPosition(n.head.range[1]),
        };
      }
      n.range =
        n.type === 'Template'
          ? [tpl.templateRange[0], tpl.templateRange[1]]
          : [
              range[0] + docLines.positionToOffset(n.loc.start),
              range[0] + docLines.positionToOffset(n.loc.end),
            ];

      n.start = n.range[0];
      n.end = n.range[1];
      n.loc = {
        start: codeLines.offsetToPosition(n.range[0]),
        end: codeLines.offsetToPosition(n.range[1]),
      };
      if (n.type === 'Template') {
        n.loc.start = codeLines.offsetToPosition(tpl.templateRange[0]);
        n.loc.end = codeLines.offsetToPosition(tpl.templateRange[1]);
      }
      // split up element node into sub nodes to be able to reference tag name
      // parts <Foo.Bar /> -> nodes for `Foo` and `Bar`
      if (n.type === 'ElementNode') {
        n.name = n.tag;
        n.parts = [];
        let start = n.range[0];
        let codeSlice = code.slice(...n.range);
        for (const part of n.tag.split('.')) {
          const regex = new RegExp(`\\b${part}\\b`);
          const match = codeSlice.match(regex);
          const range = [start + match.index, 0];
          range[1] = range[0] + part.length;
          codeSlice = code.slice(range[1], n.range[1]);
          start = range[1];
          n.parts.push({
            type: 'GlimmerElementNodePart',
            name: part,
            range,
            parent: n,
            loc: {
              start: codeLines.offsetToPosition(range[0]),
              end: codeLines.offsetToPosition(range[1]),
            },
          });
        }
      }
      // block params do not have location information
      // add our own nodes so we can reference them
      if ('blockParams' in n) {
        n.params = [];
      }
      if ('blockParams' in n && n.parent) {
        let part = code.slice(...n.parent.range);
        let start = n.parent.range[0];
        let idx = part.indexOf('|') + 1;
        start += idx;
        part = part.slice(idx, -1);
        idx = part.indexOf('|');
        part = part.slice(0, idx);
        for (const param of n.blockParams) {
          const regex = new RegExp(`\\b${param}\\b`);
          const match = part.match(regex);
          const range = [start + match.index, 0];
          range[1] = range[0] + param.length;
          n.params.push({
            type: 'BlockParam',
            name: param,
            range,
            parent: n,
            loc: {
              start: codeLines.offsetToPosition(range[0]),
              end: codeLines.offsetToPosition(range[1]),
            },
          });
        }
      }
      n.type = `Glimmer${n.type}`;
      allNodeTypes.add(n.type);
    }
    // ast should not contain comment nodes
    for (const comment of comments) {
      const parentBody = comment.parent.body || comment.parent.children;
      const idx = parentBody.indexOf(comment);
      parentBody.splice(idx, 1);
      // comment type can be a block comment or a line comment
      // mark comments as always block comment, this works for eslint in all cases
      comment.type = 'Block';
    }
    // tokens should not contain tokens of comments
    ast.tokens = ast.tokens.filter(
      (t) => !comments.some((c) => c.range[0] <= t.range[0] && c.range[1] >= t.range[1])
    );
    // tokens should not contain tokens of text nodes, but represent the whole node
    // remove existing tokens
    ast.tokens = ast.tokens.filter(
      (t) => !textNodes.some((c) => c.range[0] <= t.range[0] && c.range[1] >= t.range[1])
    );
    // merge in text nodes
    let currentTextNode = textNodes.pop();
    for (let i = ast.tokens.length - 1; i >= 0; i--) {
      const t = ast.tokens[i];
      while (currentTextNode && t.range[0] < currentTextNode.range[0]) {
        ast.tokens.splice(i + 1, 0, currentTextNode);
        currentTextNode = textNodes.pop();
      }
    }
    ast.contents = template;
    tpl.ast = ast;
  }
  for (const [k, v] of Object.entries(glimmerVisitorKeys)) {
    templateVisitorKeys[`Glimmer${k}`] = [...v];
  }
  return {
    templateVisitorKeys,
    templateInfos,
    comments,
  };
}

/**
 * traverses the AST and replaces the transformed template parts with the Glimmer
 * AST.
 * This also creates the scopes for the Glimmer Blocks and registers the block params
 * in the scope, and also any usages of variables in path expressions
 * this allows the basic eslint rules no-undef and no-unsused to work also for the
 * templates without needing any custom rules
 * @param result
 * @param preprocessedResult
 * @param visitorKeys
 */
function convertAst(result, preprocessedResult, visitorKeys) {
  const templateInfos = preprocessedResult.templateInfos;
  let counter = 0;
  result.ast.comments.push(...preprocessedResult.comments);

  for (const ti of templateInfos) {
    const firstIdx = result.ast.tokens.findIndex((t) => t.range[0] === ti.templateRange[0]);
    const lastIdx = result.ast.tokens.findIndex((t) => t.range[1] === ti.templateRange[1]);
    result.ast.tokens.splice(firstIdx, lastIdx - firstIdx + 1, ...ti.ast.tokens);
  }

  // eslint-disable-next-line complexity
  traverse(visitorKeys, result.ast, (path) => {
    const node = path.node;
    if (
      node.type === 'ExpressionStatement' ||
      node.type === 'StaticBlock' ||
      node.type === 'TemplateLiteral' ||
      node.type === 'ExportDefaultDeclaration'
    ) {
      let range = node.range;
      if (node.type === 'ExportDefaultDeclaration') {
        range = [node.declaration.range[0], node.declaration.range[1]];
      }

      const template = templateInfos.find(
        (t) => t.templateRange[0] === range[0] && t.templateRange[1] === range[1]
      );
      if (!template) {
        return null;
      }
      counter++;
      const ast = template.ast;
      Object.assign(node, ast);
    }

    if (node.type === 'GlimmerPathExpression' && node.head.type === 'VarHead') {
      const name = node.head.name;
      if (glimmer.isKeyword(name)) {
        return null;
      }
      const { scope, variable } = findVarInParentScopes(result.scopeManager, path, name) || {};
      if (scope) {
        node.head.parent = node;
        registerNodeInScope(node.head, scope, variable);
      }
    }
    if (node.type === 'GlimmerElementNode') {
      // always reference first part of tag name, this also has the advantage
      // that errors regarding this tag will only mark the tag name instead of
      // the whole tag + children
      const n = node.parts[0];
      const { scope, variable } = findVarInParentScopes(result.scopeManager, path, n.name) || {};
      if (
        scope &&
        (variable ||
          isUpperCase(n.name[0]) ||
          node.name.includes('.') ||
          !htmlTags.includes(node.name))
      ) {
        registerNodeInScope(n, scope, variable);
      }
    }

    if ('blockParams' in node) {
      const upperScope = findParentScope(result.scopeManager, path);
      const scope = result.isTypescript
        ? new TypescriptScope.BlockScope(result.scopeManager, upperScope, node)
        : new Scope(result.scopeManager, 'block', upperScope, node);
      for (const [i, b] of node.params.entries()) {
        const v = new Variable(b.name, scope);
        v.identifiers.push(b);
        v.defs.push(new Definition('Parameter', b, node, node, i, 'Block Param'));
        scope.variables.push(v);
        scope.set.set(b.name, v);
      }
    }
    return null;
  });

  if (counter !== templateInfos.length) {
    throw new Error('failed to process all templates');
  }
}

function replaceRange(s, start, end, substitute) {
  return s.slice(0, start) + substitute + s.slice(end);
}

function transformForLint(code) {
  let jsCode = code;
  const processor = new ContentTag.Preprocessor();
  /**
   *
   * @type {{
   *   type: 'expression' | 'class-member';
   *   tagName: 'template';
   *   contents: string;
   *   range: {
   *     start: number;
   *     end: number;
   *   };
   *   contentRange: {
   *     start: number;
   *     end: number;
   *   };
   *   startRange: {
   *     end: number;
   *     start: number;
   *   };
   *   endRange: {
   *     start: number;
   *     end: number;
   *   };
   * }[]}
   */
  const result = processor.parse(code);
  for (const tplInfo of result.reverse()) {
    const lineBreaks = [...tplInfo.contents].reduce(
      (prev, curr) => prev + (DocumentLines.isLineBreak(curr.codePointAt(0)) ? 1 : 0),
      0
    );
    if (tplInfo.type === 'class-member') {
      const tplLength = tplInfo.range.end - tplInfo.range.start;
      const spaces = tplLength - 'static{`'.length - '`}'.length - lineBreaks;
      const total = ' '.repeat(spaces) + '\n'.repeat(lineBreaks);
      const replacementCode = `static{\`${total}\`}`;
      jsCode = replaceRange(jsCode, tplInfo.range.start, tplInfo.range.end, replacementCode);
    } else {
      const tplLength = tplInfo.range.end - tplInfo.range.start;
      const spaces = tplLength - '`'.length - '`'.length - lineBreaks;
      const total = ' '.repeat(spaces) + '\n'.repeat(lineBreaks);
      const replacementCode = `\`${total}\``;
      jsCode = replaceRange(jsCode, tplInfo.range.start, tplInfo.range.end, replacementCode);
    }
  }
  if (jsCode.length !== code.length) {
    throw new Error('bad transform');
  }
  return {
    templateInfos: result,
    output: jsCode,
  };
}

/**
 * implements https://eslint.org/docs/latest/extend/custom-parsers
 * 1. transforms gts/gjs files into parseable ts/js without changing the offsets and locations around it
 * 2. parses the transformed code and generates the AST for TS ot JS
 * 3. preprocesses the templates info and prepares the Glimmer AST
 * 4. converts the js/ts AST so that it includes the Glimmer AST at the right locations, replacing the original
 */
/**
 *
 * @type {import('eslint').ParserModule}
 */
module.exports = {
  parseForESLint(code, options) {
    registerParsedFile(options.filePath);
    let jsCode = code;
    const info = transformForLint(code);
    jsCode = info.output;

    const isTypescript = options.filePath.endsWith('.gts');

    let result = null;
    result = isTypescript
      ? typescriptParser.parseForESLint(jsCode, { ...options, ranges: true })
      : babelParser.parseForESLint(jsCode, { ...options, ranges: true });
    if (!info.templateInfos?.length) {
      return result;
    }
    const preprocessedResult = preprocessGlimmerTemplates(info, code);
    const { templateVisitorKeys } = preprocessedResult;
    const visitorKeys = { ...result.visitorKeys, ...templateVisitorKeys };
    result.isTypescript = isTypescript;
    convertAst(result, preprocessedResult, visitorKeys);
    return { ...result, visitorKeys };
  },
};
