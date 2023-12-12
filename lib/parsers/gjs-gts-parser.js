const babelParser = require('@babel/eslint-parser');
const { registerParsedFile } = require('../preprocessors/noop');
const {
  patchTs,
  replaceExtensions,
  syncMtsGtsSourceFiles,
  typescriptParser,
} = require('./ts-utils');
const { transformForLint, preprocessGlimmerTemplates, convertAst } = require('./transform');

patchTs();

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
    const filePath = options.filePath;
    if (options.project) {
      jsCode = replaceExtensions(jsCode);
    }

    if (isTypescript && !typescriptParser) {
      throw new Error('Please install typescript to process gts');
    }

    result = isTypescript
      ? typescriptParser.parseForESLint(jsCode, { ...options, ranges: true, filePath })
      : babelParser.parseForESLint(jsCode, { ...options, ranges: true });
    if (!info.templateInfos?.length) {
      return result;
    }
    const preprocessedResult = preprocessGlimmerTemplates(info, code);
    const { templateVisitorKeys } = preprocessedResult;
    const visitorKeys = { ...result.visitorKeys, ...templateVisitorKeys };
    result.isTypescript = isTypescript;
    convertAst(result, preprocessedResult, visitorKeys);
    if (result.services?.program) {
      syncMtsGtsSourceFiles(result.services?.program);
    }
    return { ...result, visitorKeys };
  },
};
