'use strict';

const { getTemplateLocals } = require('@glimmer/syntax');
const {
  preprocessEmbeddedTemplates,
} = require('ember-template-imports/lib/preprocess-embedded-templates');
const util = require('ember-template-imports/src/util');
const DocumentLines = require('../utils/document');

const TRANSFORM_CACHE = new Map();
const TEXT_CACHE = new Map();

function arrayEq(arr1, arr2) {
  return arr1.length === arr2.length && arr1.every((val, idx) => val === arr2[idx]);
}

// regex to capture entire template with placeholder tags
const oneLineTemplateRegex = /\[__GLIMMER_TEMPLATE\(`(.*)`, {.*}\)]/;

// regex to capture opening template tag
const openingTemplateTagRegex = /\[__GLIMMER_TEMPLATE\(`/;

// regex to capture closing template tag
const closingTemplateTagRegex = /`, {.*}\)]/;

// regex with capture group on scope token variables. In the following example:
// `, { strictMode: true, scope: () => ({on,noop}) })]
// the capture group would contain `on,noop`
const getScopeTokenRegex = /scope: \(\) => \({(.*)}\) }\)/;

// eslint rules that we allow for the template parts
// this are the only rules we want to check within a template
// Because otherwise eslint would show errors unrelated to the original code and
// apply auto fixes like spacing, comma etc. into the original template
const ALLOWED_RULESSET_FOR_TEMPLATES = new Set(['no-undef']);

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
  // this also ensures that no errors about the generated output appear.
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

  const originalDoc = new DocumentLines(original);
  const transformedDoc = new DocumentLines(transformed);

  const lines = transformed.split('\n');
  const originalLines = original.split('\n');

  // get template ranges to remove eslint messages that are inside the templates
  const templateRanges = [];
  let isInsideTemplate = false;
  for (const [index, line] of lines.entries()) {
    const lineHasOpeningTag = openingTemplateTagRegex.test(line);
    const lineHasClosingTag = closingTemplateTagRegex.test(line);

    if (lineHasOpeningTag) {
      isInsideTemplate = true;
      templateRanges.push({
        start: transformedDoc.positionToOffset({
          line: index,
          character: line.search(openingTemplateTagRegex),
        }),
        end: -1,
      });
    }

    if (lineHasClosingTag && isInsideTemplate) {
      isInsideTemplate = false;
      const match = line.match(closingTemplateTagRegex);
      const current = templateRanges.slice(-1)[0];
      current.end = transformedDoc.positionToOffset({
        line: index,
        character: match.index + match[0].length,
      });
    }
  }

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

  const filtered = flattened.filter((it) => {
    const start = transformedDoc.positionToOffset({
      line: it.line - 1,
      character: it.column - 1,
    });
    const end = transformedDoc.positionToOffset({
      line: it.endLine - 1,
      character: it.endColumn - 1,
    });
    return (
      ALLOWED_RULESSET_FOR_TEMPLATES.has(it.ruleId) ||
      // include if message wraps template
      templateRanges.some((tpl) => start === tpl.start && end === tpl.end) ||
      // exclude if message is within template (also when it ends on next line, column 1, so +1 char, e.g semi rule)
      !templateRanges.some((tpl) => start >= tpl.start && end <= tpl.end + 1)
    );
  });

  return filtered.map((message) => {
    // we need to adjust the fix range provided by eslint to the correct range in the original content
    // the lines & columns did not change, except for the template part. but the total offset did, as the template content changed
    // therefore we need to remap the range correctly:
    // 1. convert range in transformed content to line & column. We know this is the same, but offsets are different
    // 2. convert line & column back to offsets in the original content
    if (message.fix) {
      const [start, end] = message.fix.range;
      const startPos = transformedDoc.offsetToPosition(start);
      const endPos = transformedDoc.offsetToPosition(end);
      const fix = message.fix;
      fix.range = [originalDoc.positionToOffset(startPos), originalDoc.positionToOffset(endPos)];
    }

    // 1. handle eslint diagnostics on single lines.
    if (message.line === message.endLine) {
      const originalLine = originalLines[message.line - 1];
      const transformedLine = lines[message.line - 1];
      if (originalLine === transformedLine) {
        // original line and transformed line match exactly. return original diagnostic message
        return message;
      }

      // when the lines do not match, we've hit a lint error on a line containing the
      // <template> tag, the closing </template> tag, or possibly both.

      const modified = { ...message };
      const token = transformedLine.slice(message.column - 1, message.endColumn - 1);
      const lineHasOpeningTag = openingTemplateTagRegex.test(transformedLine);
      const lineHasClosingTag = closingTemplateTagRegex.test(transformedLine);

      if (oneLineTemplateRegex.test(token)) {
        // lint error is on a full, one-line <template>foo</template>
        const templateContext = token.match(oneLineTemplateRegex)[1];
        const newToken = `<${util.TEMPLATE_TAG_NAME}>${templateContext}<${util.TEMPLATE_TAG_NAME}>`;

        // this case is simple: we know we have a one-line template invocation, and the
        // start `column` will be the same regardless of syntax. simply calculate the
        // length of the full token `<template>...</template>` and set the endColumn.
        modified.endColumn = modified.column + newToken.length + 1;
        return modified;
      }

      if (lineHasClosingTag) {
        const scopeTokens = transformedLine.match(getScopeTokenRegex)?.[1]?.split(',') ?? [];
        if (scopeTokens.includes(token)) {
          // when we have an error specifically with a scope token, we output the error
          // on the starting <template> tag. Currently, we do not know the position of
          // the token in the template, so there were efforts to do regex searches to
          // find the token. Long story short, these all were very bug-prone, so now we
          // just modify the message slightly and return it on the opening template tag.

          let idx = message.line - 1;
          let curLine = lines[idx];

          while (idx) {
            const templateTag = curLine.search(openingTemplateTagRegex);
            if (templateTag > -1) {
              modified.line = idx + 1;
              modified.endLine = idx + 1;
              modified.column = templateTag + 1;
              modified.endColumn = templateTag + `<${util.TEMPLATE_TAG_NAME}>`.length + 1;
              modified.message = `Error in template: ${message.message}`;
              return modified;
            }
            curLine = lines[--idx];
          }
        }
      } else if (lineHasOpeningTag) {
        // token is before the <template> tag, no modifications necessary
        if (transformedLine.indexOf(token) < transformedLine.search(openingTemplateTagRegex)) {
          return message;
        }
      }
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
          modified.endColumn = closingTagIndex + closingTemplateTag.length + 1;
        }
      }

      return modified;
    }

    // if all else fails: return the original message. It may not have the correct line/col,
    // but it is better to return a mis-aligned diagnostic message than none at all.
    return message;
  });
}

module.exports = {
  preprocess: gjs,
  postprocess: mapRange,
  supportsAutofix: true,
};
