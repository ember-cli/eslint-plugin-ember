'use strict';

const { getTemplateLocals } = require('@glimmer/syntax');
const {
  preprocessEmbeddedTemplates,
} = require('ember-template-imports/lib/preprocess-embedded-templates');
const util = require('ember-template-imports/src/util');

const TRANSFORM_CACHE = new Map();
const TEXT_CACHE = new Map();

function gjs(text, filename) {
  const isGlimmerFile = filename.endsWith('.gjs') || filename.endsWith('.gts');

  if (!isGlimmerFile) {
    return [
      {
        filename,
        text,
      },
    ];
  }

  if (text.includes(util.TEMPLATE_TAG_PLACEHOLDER)) {
    return [
      {
        filename,
        text,
      },
    ];
  }

  const preprocessed = preprocessEmbeddedTemplates(text, {
    getTemplateLocals,
    relativePath: filename,

    templateTag: util.TEMPLATE_TAG_NAME,
    templateTagReplacement: util.TEMPLATE_TAG_PLACEHOLDER,

    includeSourceMaps: false,
    includeTemplateTokens: true,
  });

  // Because the output looks like
  // `, { strictMode: true, scope: () => ({on,noop}) })]
  // we could accidentally have this line formatted with
  // prettier, or trailing commas, or any variety of formatting rules.
  //
  // We need to disable all of eslint around this "scope" return
  // value and allow-list the rules that check for undefined identifiers
  const transformed = preprocessed.output;

  TRANSFORM_CACHE.set(filename, transformed);
  TEXT_CACHE.set(filename, text);

  return [
    {
      filename,
      text: transformed,
    },
  ];
}

function mapRange(messages, filename) {
  const transformed = TRANSFORM_CACHE.get(filename);
  const original = TEXT_CACHE.get(filename);
  const flattened = messages.flat();

  if (!transformed) {
    return flattened;
  }

  if (!transformed.includes(util.TEMPLATE_TAG_PLACEHOLDER)) {
    return flattened;
  }

  const lines = transformed.split('\n');
  const originalLines = original.split('\n');

  return flattened.map((message) => {
    const line = lines[message.line - 1];
    const token = line.slice(message.column - 1, message.endColumn - 1);

    // Now that we have the token, we need to find the location
    // in the original text
    //
    // TODO: Long term, we should use glimmer syntax parsing to find
    // the correct node -- otherwise it's too easy to
    // partially match on similar text
    let originalLineNumber = 0;
    let originalColumnNumber = 0;

    for (const [index, line] of originalLines.entries()) {
      const column = line.search(new RegExp(`\\b${token}\\b`));
      if (column > -1) {
        originalLineNumber = index + 1;
        originalColumnNumber = column + 1;
        break;
      }
    }

    const modified = {
      ...message,
      line: originalLineNumber,
      column: originalColumnNumber,
      endLine: originalLineNumber,
      endColumn: originalColumnNumber + token.length,
    };

    return modified;
  });
}

module.exports = {
  preprocess: gjs,
  postprocess: mapRange,
};
