const gts = require('ember-template-tag');
const glimmer = require('@glimmer/syntax');
const DocumentLines = require('../utils/document');
const path = require('path');
// eslint-disable-next-line import/no-dynamic-require
const glimmerVisitorKeys = require(path.join(
  path.dirname(require.resolve('@glimmer/syntax')),
  'lib/v1/visitor-keys'
)).default;
const babelParser = require('@babel/eslint-parser');
const typescriptParser = require('@typescript-eslint/parser');
const TypescriptScope = require('@typescript-eslint/scope-manager');
const { Reference, Scope, Variable, Definition } = require('eslint-scope');

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
  if (!scope) {
    return { scope: findParentScope(scopeManager, nodePath) };
  }
  return { scope, variable: scope.set.get(name) };
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
    scope.through.push(ref);
    scope.upper.through.push(ref);
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
  for (const [i, c] of [...template].entries()) {
    if (isAlphaNumeric(c.codePointAt(0))) {
      if (current.length === 0) {
        start = i;
      }
      current += c;
    } else {
      let range = [startOffset + start, startOffset + i];
      if (current.length > 0) {
        const t = {
          type: 'word',
          value: current,
          range,
          start: range[0],
          end: range[1],
          loc: {
            start: { ...doc.offsetToPosition(range[0]), index: range[0] },
            end: { ...doc.offsetToPosition(range[1]), index: range[1] },
          },
        };
        tokens.push(t);
        current = '';
      }
      range = [startOffset + i, startOffset + i + 1];
      if (!isWhiteSpace(c)) {
        tokens.push({
          type: 'Punctuator',
          value: c,
          range,
          start: range[0],
          end: range[1],
          loc: {
            start: { ...doc.offsetToPosition(range[0]), index: range[0] },
            end: { ...doc.offsetToPosition(range[1]), index: range[1] },
          },
        });
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
  const templateInfos = info.replacements.map((r) => ({
    range: r.original.contentRange,
    templateRange: r.original.range,
    replacedRange: r.replaced.range,
  }));
  const templateVisitorKeys = {};
  const codeLines = new DocumentLines(code);
  const comments = [];
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
      },
    });
    ast.content = template;
    const allNodeTypes = new Set();
    for (const n of allNodes) {
      // remove empty text nodes
      if (n.type === 'TextNode' && n.chars.trim().length === 0) {
        if (n.parent.children) {
          const idx = n.parent.children.indexOf(n);
          n.parent.children.splice(idx, 1);
        }
        if (n.parent.body) {
          const idx = n.parent.body.indexOf(n);
          n.parent.body.splice(idx, 1);
        }
      }
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
          ? [tpl.replacedRange[0], tpl.replacedRange[1]]
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
    // tokens should not contain tokens of comments
    ast.tokens = ast.tokens.filter(
      (t) => !comments.some((c) => c.range[0] <= t.range[0] && c.range[1] >= t.range[1])
    );
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
    const firstIdx = result.ast.tokens.findIndex((t) => t.range[0] === ti.replacedRange[0]);
    const lastIdx = result.ast.tokens.findIndex((t) => t.range[1] === ti.replacedRange[1]);
    result.ast.tokens.splice(firstIdx, lastIdx - firstIdx + 1, ...ti.ast.tokens);
  }

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
        (t) => t.replacedRange[0] === range[0] && t.replacedRange[1] === range[1]
      );
      if (!template) {
        return null;
      }
      counter++;
      const ast = template.ast;
      Object.assign(node, ast);
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
      node.name = node.tag;
      const { scope, variable } = findVarInParentScopes(result.scopeManager, path, node.tag) || {};
      if (scope && (variable || isUpperCase(node.tag[0]))) {
        registerNodeInScope(node, scope, variable);
      }
    }
    return null;
  });

  if (counter !== templateInfos.length) {
    throw new Error('failed to process all templates');
  }
}

/**
 * implements https://eslint.org/docs/latest/extend/custom-parsers
 * 1. transforms gts/gjs files into parseable ts/js without changing the offsets and locations around it
 * 2. parses the transformed code and generates the AST for TS ot JS
 * 3. preprocesses the templates info and prepares the Glimmer AST
 * 4. converts the js/ts AST so that it includes the Glimmer AST at the right locations, replacing the original
 */
module.exports = {
  parseForESLint(code, options, isTypescript) {
    let jsCode = code;
    const info = gts.transformForLint({
      input: jsCode,
      templateTag: 'template',
      explicitMode: true,
      linterMode: true,
    });
    jsCode = info.output;

    let result = null;
    result = isTypescript
      ? typescriptParser.parseForESLint(jsCode, { ...options, ranges: true })
      : babelParser.parseForESLint(jsCode, { ...options, ranges: true });
    if (!info.replacements?.length) {
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
