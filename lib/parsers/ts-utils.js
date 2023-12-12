const fs = require('node:fs');
const { transformForLint } = require('./transform');
const babel = require('@babel/core');
const { replaceRange } = require('./transform');

let patchTs, replaceExtensions, syncMtsGtsSourceFiles, typescriptParser;

try {
  const ts = require('typescript');
  typescriptParser = require('@typescript-eslint/parser');
  patchTs = function patchTs() {
    const sys = { ...ts.sys };
    const newSys = {
      ...ts.sys,
      readDirectory(...args) {
        const results = sys.readDirectory.call(this, ...args);
        return [
          ...results,
          ...results.filter((x) => x.endsWith('.gts')).map((f) => f.replace(/\.gts$/, '.mts')),
        ];
      },
      fileExists(fileName) {
        return fs.existsSync(fileName.replace(/\.mts$/, '.gts')) || fs.existsSync(fileName);
      },
      readFile(fname) {
        let fileName = fname;
        let content = '';
        try {
          content = fs.readFileSync(fileName).toString();
        } catch {
          fileName = fileName.replace(/\.mts$/, '.gts');
          content = fs.readFileSync(fileName).toString();
        }
        if (fileName.endsWith('.gts')) {
          content = transformForLint(content).output;
        }
        if (
          (!fileName.endsWith('.d.ts') && fileName.endsWith('.ts')) ||
          fileName.endsWith('.gts')
        ) {
          content = replaceExtensions(content);
        }
        return content;
      },
    };
    ts.setSys(newSys);
  };

  replaceExtensions = function replaceExtensions(code) {
    let jsCode = code;
    const babelParseResult = babel.parse(jsCode, {
      parserOpts: { ranges: true, plugins: ['typescript'] },
    });
    const length = jsCode.length;
    for (const b of babelParseResult.program.body) {
      if (b.type === 'ImportDeclaration' && b.source.value.endsWith('.gts')) {
        const value = b.source.value.replace(/\.gts$/, '.mts');
        const strWrapper = jsCode[b.source.start];
        jsCode = replaceRange(
          jsCode,
          b.source.start,
          b.source.end,
          strWrapper + value + strWrapper
        );
      }
    }
    if (length !== jsCode.length) {
      throw new Error('bad replacement');
    }
    return jsCode;
  };

  /**
   *
   * @param program {ts.Program}
   */
  syncMtsGtsSourceFiles = function syncMtsGtsSourceFiles(program) {
    const sourceFiles = program.getSourceFiles();
    for (const sourceFile of sourceFiles) {
      // check for deleted gts files, need to remove mts as well
      if (sourceFile.path.endsWith('.mts') && sourceFile.isVirtualGts) {
        const gtsFile = program.getSourceFile(sourceFile.path.replace(/\.mts$/, '.gts'));
        if (!gtsFile) {
          sourceFile.version = null;
        }
      }
      if (sourceFile.path.endsWith('.gts')) {
        /**
         * @type {ts.SourceFile}
         */
        const mtsSourceFile = program.getSourceFile(sourceFile.path.replace(/\.gts$/, '.mts'));
        if (mtsSourceFile) {
          const keep = {
            fileName: mtsSourceFile.fileName,
            path: mtsSourceFile.path,
            originalFileName: mtsSourceFile.originalFileName,
            resolvedPath: mtsSourceFile.resolvedPath,
          };
          Object.assign(mtsSourceFile, sourceFile, keep);
          mtsSourceFile.isVirtualGts = true;
        }
      }
    }
  };
} catch /* istanbul ignore next */ {
  // typescript not available
  patchTs = () => null;
  replaceExtensions = (code) => code;
  syncMtsGtsSourceFiles = () => null;
}

module.exports = {
  patchTs,
  replaceExtensions,
  syncMtsGtsSourceFiles,
  typescriptParser,
};
