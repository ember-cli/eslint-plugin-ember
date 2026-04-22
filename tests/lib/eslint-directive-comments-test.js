'use strict';

/**
 * Regression coverage for `{{! eslint-disable-* }}` directives inside
 * `<template>` blocks in .gjs/.gts files.
 *
 * ESLint's inline-config scanner reads `Program.comments`. For .gjs/.gts the
 * template is parsed by ember-eslint-parser (via ember-estree). Upstream
 * ember-estree 0.4.3 (NullVoxPopuli/ember-estree#31) kept Glimmer comment
 * nodes inside the template body and stopped mirroring them into
 * `Program.comments`, which silently dropped template-level directives.
 *
 * The current lockfile pins ember-estree@0.4.2 so these tests pass today.
 * They exist to trip loudly if a future bump re-introduces the regression
 * without a corresponding fix in ember-eslint-parser / ember-estree.
 * The pure-hbs parser path has always behaved correctly and is exercised
 * here as a positive control.
 */

const { Linter } = require('eslint');
const rule = require('../../lib/rules/template-no-unnecessary-concat');

const RULE_ID = 'ember/template-no-unnecessary-concat';

function makeLinter(parserName) {
  const linter = new Linter();
  linter.defineParser('ember-eslint-parser', require('ember-eslint-parser'));
  linter.defineParser('ember-eslint-parser/hbs', require('ember-eslint-parser/hbs'));
  linter.defineRule(RULE_ID, rule);
  return {
    verify(code, filename) {
      return linter.verify(
        code,
        {
          parser: parserName,
          parserOptions: { ecmaVersion: 2022, sourceType: 'module' },
          rules: { [RULE_ID]: 'error' },
        },
        { filename }
      );
    },
  };
}

describe('eslint-disable directives inside <template> — .gts (gjs-gts-parser)', () => {
  const linter = makeLinter('ember-eslint-parser');

  it('rule fires without a directive (sanity check)', () => {
    const code = ['<template>', '  <li aria-current="{{foo}}"></li>', '</template>'].join('\n');
    const messages = linter.verify(code, 'test.gts');
    const ruleMsgs = messages.filter((m) => m.ruleId === RULE_ID);
    expect(ruleMsgs).toHaveLength(1);
  });

  it('{{! eslint-disable-next-line ember/rule }} suppresses the rule on the next line', () => {
    const code = [
      '<template>',
      '  <li',
      '    {{! eslint-disable-next-line ember/template-no-unnecessary-concat }}',
      '    aria-current="{{foo}}"',
      '  ></li>',
      '</template>',
    ].join('\n');
    const messages = linter.verify(code, 'test.gts');
    const ruleMsgs = messages.filter((m) => m.ruleId === RULE_ID);
    expect(ruleMsgs).toEqual([]);
  });

  it('long-form {{!-- eslint-disable-next-line ember/rule --}} suppresses the rule', () => {
    const code = [
      '<template>',
      '  <li',
      '    {{!-- eslint-disable-next-line ember/template-no-unnecessary-concat --}}',
      '    aria-current="{{foo}}"',
      '  ></li>',
      '</template>',
    ].join('\n');
    const messages = linter.verify(code, 'test.gts');
    const ruleMsgs = messages.filter((m) => m.ruleId === RULE_ID);
    expect(ruleMsgs).toEqual([]);
  });
});

describe('eslint-disable directives inside <template> — .hbs (hbs-parser) [positive control]', () => {
  const linter = makeLinter('ember-eslint-parser/hbs');

  it('rule fires without a directive (sanity check)', () => {
    const code = '<li aria-current="{{foo}}"></li>\n';
    const messages = linter.verify(code, 'test.hbs');
    const ruleMsgs = messages.filter((m) => m.ruleId === RULE_ID);
    expect(ruleMsgs).toHaveLength(1);
  });

  it('{{! eslint-disable-next-line ember/rule }} suppresses the rule on the next line', () => {
    const code = [
      '<li',
      '  {{! eslint-disable-next-line ember/template-no-unnecessary-concat }}',
      '  aria-current="{{foo}}"',
      '></li>',
    ].join('\n');
    const messages = linter.verify(code, 'test.hbs');
    const ruleMsgs = messages.filter((m) => m.ruleId === RULE_ID);
    expect(ruleMsgs).toEqual([]);
  });
});
