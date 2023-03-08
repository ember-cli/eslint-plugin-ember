'use strict';

const { getTemplateLocals } = require('@glimmer/syntax');
const {
  preprocessEmbeddedTemplates,
} = require('ember-template-imports/lib/preprocess-embedded-templates');
const util = require('ember-template-imports/src/util');

const TRANSFORM_CACHE = new Map();
const TEXT_CACHE = new Map();

// source: https://developer.mozilla.org/en-US/docs/Web/JavaScript/Guide/Regular_Expressions#escaping
function escapeRegExp(string) {
  return string.replace(/[$()*+.?[\\\]^{|}]/g, '\\$&'); // $& means the whole matched string
}

function arrayEq(arr1, arr2) {
  let returnVal = true;
  for (const [idx, val1] of arr1.entries()) {
    if (val1 !== arr2[idx]) {
      returnVal = false;
    }
  }

  return returnVal;
}

// regex for single-line
const oneLineTemplateRegex = /\[__GLIMMER_TEMPLATE\(`(.*)`, {.*}\)]/;
const openingTemplateTagRegex = /\[__GLIMMER_TEMPLATE\(`$/;
const closingTemplateTagRegex = /`, {.*}\)]/;

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
    // 1. handle eslint diagnostics on single lines.
    if (message.line === message.endLine) {
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
        // if we haven't fallen into one of the cases above, we are likely dealing with
        // a scope token in the template placeholder, typically for being used but not
        // defined. the `token` should be the specific template API which the error is on,
        // so we need to find the usage of the token in the template

        // TODO: this is still bug-prone, and should be refactored to do something like:
        // 1. for given token, find associated template tag
        // 2. conduct search for token only within associated template
        // 3. ensure we are not matching token inside comments
        for (const [index, line] of originalLines.entries()) {
          const newColumn = line.search(new RegExp(`\\b${escapeRegExp(token)}\\b`));
          if (newColumn > -1) {
            modified.line = index + 1;
            modified.column = newColumn + 1;
            modified.endColumn = newColumn + token.length + 1;
            break;
          }
        }
      }

      return modified;
    } else {
      // 2. handle multi-line diagnostics from eslint
      const originalRange = originalLines.slice(message.line - 1, message.endLine);
      const transformedRange = lines.slice(message.line - 1, message.endLine);
      if (arrayEq(originalRange, transformedRange)) {
        // original line range and transformed linerange match exactly. return original diagnostic message
        return message;
      }

      // for ranges containing template tag placeholders, the only change we should need to make is
      // on the endColumn field, as this is the only one guaranteed to be different. The start column
      // field does not need to be transformed, because it should be the same regardless of if we are
      // using a <template> tag or the placeholder.
      //
      // we modify the endColumn below by finding the index of the closing placeholder tag, and
      // mapping the placeholder syntax back into the ending column of the original `</template>` tag

      const modified = { ...message };

      const endLine = lines[message.endLine - 1];
      if (closingTemplateTagRegex.test(endLine)) {
        const originalEndLine = originalLines[message.endLine - 1];
        const closingTemplateTag = `</${util.TEMPLATE_TAG_NAME}>`;
        const closingTagIndex = originalEndLine.indexOf(closingTemplateTag);

        if (closingTagIndex) {
          modified.endColumn = closingTagIndex + closingTemplateTag.length;
        }
      }

      return modified;
    }
  });
}

module.exports = {
  preprocess: gjs,
  postprocess: mapRange,
};
