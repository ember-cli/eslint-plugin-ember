'use strict';

const { getTemplateLocals } = require('@glimmer/syntax');
const {
  preprocessEmbeddedTemplates,
} = require('ember-template-imports/lib/preprocess-embedded-templates');
const { TEMPLATE_TAG_PLACEHOLDER } = require('ember-template-imports/src/util');
const util = require('ember-template-imports/src/util');

const TRANSFORM_CACHE = new Map();
const TEXT_CACHE = new Map();

// source: https://developer.mozilla.org/en-US/docs/Web/JavaScript/Guide/Regular_Expressions#escaping
function escapeRegExp(string) {
  return string.replace(/[$()*+.?[\\\]^{|}]/g, '\\$&'); // $& means the whole matched string
}

// regex for single-line
const oneLineTemplateRegex = /\[__GLIMMER_TEMPLATE\(`(.*)`, {.*}\)]/;
const openingTemplateTagRegex = /\[__GLIMMER_TEMPLATE\(`$/;
const closingTemplateTagRegex = /^`, {.*}\)]/;
/**
 * This function is responsible for running the embedded templates transform
 * from ember-template-imports.
 *
 * It takes a gjs or gts file and converts <template> tags to their
 * intermediary (private) format.
 *
 * This is needed so that eslint knows what variables accessed within the template
 * are missing or accessed within the JS scope, because
 * part of the output includes a snippet that looks like:
 *
 * `, { strictMode: true, scope: () => ({on,noop}) })]
 *
 * So if on and noop are not present in the JS, we will have an error to work with
 */
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

  /**
   * If the file is already processed, we don't need to process it again.
   *
   * a file will not have a TEMPLATE_TAG_PLACEHOLDER unless it has been processed
   */
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

/**
 * This function is for mapping back from the intermediary (private) format
 * back to gjs/gts / <template> so that we can appropriately display errors
 * or warnings in the correct location in the original source file in the user's
 * editor.
 */
function mapRange(messages, filename) {
  const transformed = TRANSFORM_CACHE.get(filename);
  const original = TEXT_CACHE.get(filename);
  const flattened = messages.flat();

  if (!transformed) {
    return flattened;
  }

  // if there are no instances of the placeholder value, then this template
  // did not contain a <template> tag, so preprocessed === postprocessed
  if (!transformed.includes(util.TEMPLATE_TAG_PLACEHOLDER)) {
    return flattened;
  }

  const lines = transformed.split('\n');
  const originalLines = original.split('\n');

  // this function assumes the original output and transformed output
  // are identical, minus the changes to transform `<template>` into the
  // placeholder `[__GLIMMER_TEMPLATE()]
  //
  // in the future, for a usecase like integrating prettier --fix,
  // this assumption will no longer be valid, and should be removed/refactored
  if (lines.length !== originalLines.length) {
    throw new Error(
      'eslint-plugin-ember expected source file and transform file to have the same line length, but they differed'
    );
  }

  return flattened.map((message) => {
    const originalLine = originalLines[message.line - 1];
    const transformedLine = lines[message.line - 1];
    if (originalLine === transformedLine) {
      // original line and transformed line match exactly. return original diagnostic message
      return message;
    }

    // when the lines do not match, we've hit a lint error on the line containing the
    // <template> tag, meaning we need to re-work the message
    const modified = { ...message };
    let token = transformedLine.slice(message.column - 1, message.endColumn - 1);

    // lint error is specifically on JUST the opening <template> tag
    if (openingTemplateTagRegex.test(token)) {
      token = `<${util.TEMPLATE_TAG_NAME}>`;

      // this case is simple: we know the starting column will be correct, so we just
      // need to adjust the endColumn for the difference in length between the transformed
      // token and the original token.
      modified.endColumn = modified.column + token.length;
    } else if (oneLineTemplateRegex.test(token)) {
      // lint error is on a full, one-line <template>foo</template>
      const templateContext = token.match(oneLineTemplateRegex)[1];
      token = `<${util.TEMPLATE_TAG_NAME}>${templateContext}<${util.TEMPLATE_TAG_NAME}>`;

      // this case is simple: we know we have a one-line template invocation, and the
      // start `column` will be the same regardless of syntax. simply calculate the
      // length of the full token `<template>...</template>` and set the endColumn.
      modified.endColumn = modified.column + token.length;
    } else {
      // TODO: how do we end up here? template context? unused-vars in `scope`?
      // for (const [index, line] of originalLines.entries()) {
      //   const newColumn = line.search(new RegExp(`\\b${escapeRegExp(token)}\\b`));
      //   if (newColumn > -1) {
      //     modified.line = index + 1;
      //     modified.column = newColumn + 1;
      //     modified.endColumn = newColumn + token.length + 1;
      //     break;
      //   }
      // }
    }

    return modified;
  });
}

module.exports = {
  preprocess: gjs,
  postprocess: mapRange,
};
