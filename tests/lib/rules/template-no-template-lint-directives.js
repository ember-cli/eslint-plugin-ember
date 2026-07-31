//------------------------------------------------------------------------------
// Requirements
//------------------------------------------------------------------------------

const rule = require('../../../lib/rules/template-no-template-lint-directives');
const RuleTester = require('eslint').RuleTester;

const ruleTester = new RuleTester({
  parser: require.resolve('ember-eslint-parser'),
  parserOptions: { ecmaVersion: 2022, sourceType: 'module' },
});

ruleTester.run('template-no-template-lint-directives', rule, {
  valid: [
    // Unrelated Glimmer comment
    '<template>{{! just a comment }}<div></div></template>',
    // JS-side block comment with similar text — not in a template
    '/* template-lint-disable no-log */ const x = 1;',
  ],
  invalid: [
    // A directive standing on its own applies from the comment to the end of
    // the template, which is what `eslint-disable` already means.
    {
      code: '<template>{{! template-lint-disable no-log }}{{log "x"}}</template>',
      output: '<template>{{! eslint-disable ember/template-no-log }}{{log "x"}}</template>',
      errors: [{ messageId: 'convert' }],
    },
    {
      code: '<template>{{!-- template-lint-disable no-log --}}{{log "x"}}</template>',
      output: '<template>{{!-- eslint-disable ember/template-no-log --}}{{log "x"}}</template>',
      errors: [{ messageId: 'convert' }],
    },
    {
      code: '<template>{{! template-lint-disable no-log no-debugger }}{{log "x"}}{{debugger}}</template>',
      output:
        '<template>{{! eslint-disable ember/template-no-log, ember/template-no-debugger }}{{log "x"}}{{debugger}}</template>',
      errors: [{ messageId: 'convert' }],
    },
    {
      code: '<template>{{! template-lint-disable no-log}}{{log "x"}}</template>',
      output: '<template>{{! eslint-disable ember/template-no-log }}{{log "x"}}</template>',
      errors: [{ messageId: 'convert' }],
    },
    {
      code: '<template>{{! template-lint-disable }}{{log "x"}}</template>',
      output: '<template>{{! eslint-disable }}{{log "x"}}</template>',
      errors: [{ messageId: 'convert' }],
    },
    {
      code: '<template>{{! template-lint-enable no-log }}{{log "x"}}</template>',
      output: '<template>{{! eslint-enable ember/template-no-log }}{{log "x"}}</template>',
      errors: [{ messageId: 'convert' }],
    },
    // ember-template-lint unquotes each rule name (single or double quotes),
    // so quoted names are live directives in migrating codebases and must
    // convert to bare eslint rule names.
    {
      code: '<template>{{! template-lint-disable "no-log" }}{{log "x"}}</template>',
      output: '<template>{{! eslint-disable ember/template-no-log }}{{log "x"}}</template>',
      errors: [{ messageId: 'convert' }],
    },
    {
      code: '<template>{{! template-lint-disable \'no-log\' }}{{log "x"}}</template>',
      output: '<template>{{! eslint-disable ember/template-no-log }}{{log "x"}}</template>',
      errors: [{ messageId: 'convert' }],
    },
    {
      code: '<template>{{! template-lint-disable "no-log" no-debugger }}{{log "x"}}</template>',
      output:
        '<template>{{! eslint-disable ember/template-no-log, ember/template-no-debugger }}{{log "x"}}</template>',
      errors: [{ messageId: 'convert' }],
    },
    {
      code: '<template>{{! template-lint-enable "no-log" }}{{log "x"}}</template>',
      output: '<template>{{! eslint-enable ember/template-no-log }}{{log "x"}}</template>',
      errors: [{ messageId: 'convert' }],
    },
    // Mismatched or lone quotes are not a quoted name — upstream's unquote
    // only strips when the first and last character are the same quote.
    {
      code: '<template>{{! template-lint-disable "no-log\' }}{{log "x"}}</template>',
      output: '<template>{{! eslint-disable ember/template-"no-log\' }}{{log "x"}}</template>',
      errors: [{ messageId: 'convert' }],
    },
    // Inside an opening tag the directive is scoped to the element, so it
    // becomes a disable/enable pair bracketing that element. With no children,
    // the `-tree` and non-`-tree` scopes coincide.
    {
      code: `<template>
  <div
    class="x"
    {{! template-lint-disable no-invalid-interactive }}
    {{on "click" this.click}}
  ></div>
</template>`,
      output: `<template>
  {{! eslint-disable ember/template-no-invalid-interactive }}
  <div
    class="x"
    {{on "click" this.click}}
  ></div>
  {{! eslint-enable ember/template-no-invalid-interactive }}
</template>`,
      errors: [{ messageId: 'convert' }],
    },
    // A directive sharing its line with markup is stripped on its own, not by
    // the line: reaching back to the line start would delete the opening tag
    // with it.
    {
      code: '<template><div {{! template-lint-disable no-invalid-interactive }} {{on "click" this.click}}></div></template>',
      output: `<template>{{! eslint-disable ember/template-no-invalid-interactive }}
<div {{on "click" this.click}}></div>
{{! eslint-enable ember/template-no-invalid-interactive }}</template>`,
      errors: [{ messageId: 'convert' }],
    },
    {
      code: `<template>
  <div class="x" {{! template-lint-disable no-invalid-interactive }}
    {{on "click" this.click}}
  ></div>
</template>`,
      output: `<template>
  {{! eslint-disable ember/template-no-invalid-interactive }}
  <div class="x"
    {{on "click" this.click}}
  ></div>
  {{! eslint-enable ember/template-no-invalid-interactive }}
</template>`,
      errors: [{ messageId: 'convert' }],
    },
    // With children, the non-`-tree` scope covers the opening tag only, so the
    // region closes as the element's first child and descendants keep linting.
    {
      code: `<template>
  <div
    {{! template-lint-disable no-invalid-interactive }}
    {{on "click" this.click}}
  ><span>hi</span></div>
</template>`,
      output: `<template>
  {{! eslint-disable ember/template-no-invalid-interactive }}
  <div
    {{on "click" this.click}}
  >{{! eslint-enable ember/template-no-invalid-interactive }}<span>hi</span></div>
</template>`,
      errors: [{ messageId: 'convert' }],
    },
    // `-tree` covers the subtree, so the region closes after the element.
    {
      code: `<template>
  <div
    {{! template-lint-disable-tree no-invalid-interactive }}
    {{on "click" this.click}}
  ><span>hi</span></div>
</template>`,
      output: `<template>
  {{! eslint-disable ember/template-no-invalid-interactive }}
  <div
    {{on "click" this.click}}
  ><span>hi</span></div>
  {{! eslint-enable ember/template-no-invalid-interactive }}
</template>`,
      errors: [{ messageId: 'convert' }],
    },
  ],
});

// The rewritten comment text is only half the contract. What has to hold is
// that the converted directive suppresses exactly the violations the original
// did — no more (which hides real problems) and no fewer (which floods a
// migration with noise). These cases mirror ember-template-lint 7.9.3 run on
// the same templates.
describe('suppression scope after conversion', () => {
  const { Linter } = require('eslint');
  const plugin = require('../../../lib/index');
  const hbsParser = require('ember-eslint-parser/hbs');

  const baseConfig = {
    files: ['**/*.hbs'],
    languageOptions: { parser: hbsParser },
    plugins: { ember: plugin },
  };

  function migrate(source) {
    return new Linter({ configType: 'flat' }).verifyAndFix(
      source,
      { ...baseConfig, rules: { 'ember/template-no-template-lint-directives': 'error' } },
      'a.hbs'
    ).output;
  }

  // Each element carries a distinct tabindex, so a violation is identified by
  // that value rather than by a line or column the fixer may have shifted.
  function stillReported(source) {
    const lines = source.split('\n');
    return new Linter({ configType: 'flat' })
      .verify(
        source,
        { ...baseConfig, rules: { 'ember/template-no-positive-tabindex': 'error' } },
        'a.hbs'
      )
      .map((message) => lines[message.line - 1].match(/tabindex="(\d+)"/)[1]);
  }

  const ELEMENT = `<div
  {{! template-lint-DIRECTIVE no-positive-tabindex }}
  tabindex="1"
>
  <span tabindex="2"></span>
</div>
<a tabindex="3"></a>`;

  it('scopes an in-tag directive to the opening tag, as template-lint does', () => {
    const migrated = migrate(ELEMENT.replace('DIRECTIVE', 'disable'));

    // template-lint suppresses the div's own tabindex="1" only. Its descendant
    // and the following sibling keep reporting — verified against
    // ember-template-lint 7.9.3 on this same template.
    expect(stillReported(migrated)).toEqual(['2', '3']);
  });

  it('scopes a -tree directive to the subtree, as template-lint does', () => {
    const migrated = migrate(ELEMENT.replace('DIRECTIVE', 'disable-tree'));

    // Element and descendants suppressed; only the following sibling reports.
    expect(stillReported(migrated)).toEqual(['3']);
  });

  it('keeps a standalone directive covering the rest of the template', () => {
    const migrated = migrate(`{{! template-lint-disable no-positive-tabindex }}
<div tabindex="1"></div>
<a tabindex="3"></a>`);

    expect(stillReported(migrated)).toEqual([]);
  });

  it('keeps the element intact when the directive shares its line with markup', () => {
    const migrated = migrate(`<div {{! template-lint-disable no-positive-tabindex }} tabindex="1">
  <span tabindex="2"></span>
</div>
<a tabindex="3"></a>`);

    // The opening tag has to survive the strip — taking the comment's whole
    // line here would delete `<div ` along with it.
    expect(migrated).toContain('<div tabindex="1">');
    expect(stillReported(migrated)).toEqual(['2', '3']);
  });

  it('converts nested element-scoped directives, each keeping its own scope', () => {
    const migrated = migrate(`<div
  {{! template-lint-disable no-positive-tabindex }}
  tabindex="1"
>
  <span tabindex="2"></span>
</div>`);

    // Nested directives are converted across several fix passes; the result
    // must still converge and must not swallow the descendant's violation.
    expect(migrated).not.toContain('template-lint-');
    expect(stillReported(migrated)).toEqual(['2']);
  });

  it('closes the region without adding whitespace to the element body', () => {
    const migrated = migrate(`<div
  {{! template-lint-disable no-positive-tabindex }}
  tabindex="1"
><span>hi</span></div>`);

    // `{{! }}` comments compile away, but a newline would introduce a
    // whitespace text node and can change inline rendering, so the enable
    // comment is inserted without one.
    expect(migrated).toContain('>{{! eslint-enable ember/template-no-positive-tabindex }}<span>');
  });
});
