//------------------------------------------------------------------------------
// Requirements
//------------------------------------------------------------------------------

const rule = require('../../../lib/rules/no-html-safe');
const RuleTester = require('eslint').RuleTester;

const htmlSafeError = (type, extra = {}) => ({
  messageId: 'noHtmlSafe',
  data: { name: 'htmlSafe' },
  type,
  ...extra,
});
const trustHTMLError = (type, extra = {}) => ({
  messageId: 'noHtmlSafe',
  data: { name: 'trustHTML' },
  type,
  ...extra,
});

//------------------------------------------------------------------------------
// Tests
//------------------------------------------------------------------------------

const ruleTester = new RuleTester({
  parserOptions: {
    ecmaVersion: 2022,
    sourceType: 'module',
  },
});

ruleTester.run('no-html-safe', rule, {
  valid: [
    // Wrong function:
    "import { ANYTHING } from '@ember/string'; ANYTHING('foo');",
    "import { ANYTHING } from '@ember/template'; ANYTHING('foo');",
    "import { isHTMLSafe } from '@ember/template'; isHTMLSafe('foo');",

    // Wrong import path:
    "import { htmlSafe } from 'something/else'; htmlSafe('foo');",
    "export { htmlSafe } from 'something/else';",

    // `trustHTML` was never in `@ember/string`:
    "import { trustHTML } from '@ember/string'; trustHTML('foo');",

    // No import:
    "htmlSafe('foo');",
    "import EmberString from '@ember/string'; htmlSafe('foo');",

    // Wrong object:
    "import { htmlSafe } from '@ember/string'; foo.htmlSafe('foo');",

    // Shadowed by a local:
    "import { htmlSafe } from '@ember/template'; function f(htmlSafe) { return htmlSafe('foo'); }",
    "import { htmlSafe } from '@ember/template'; { const htmlSafe = (s) => s; htmlSafe('foo'); }",

    // Imported but not used:
    "import { htmlSafe } from '@ember/template';",

    // `typeof` does not mark anything safe:
    "import { htmlSafe } from '@ember/template'; if (typeof htmlSafe === 'function') {}",

    // Namespace import, other export:
    "import * as t from '@ember/template'; t.isHTMLSafe('foo');",
    "import * as t from '@ember/template'; t[name]('foo');",
  ],
  invalid: [
    {
      code: "import { htmlSafe } from '@ember/string'; htmlSafe('foo');",
      output: null,
      errors: [htmlSafeError('CallExpression')],
    },
    {
      code: "import { htmlSafe } from '@ember/template'; htmlSafe('foo');",
      output: null,
      errors: [htmlSafeError('CallExpression')],
    },
    {
      code: "import { htmlSafe as myCustomNameForHtmlSafe } from '@ember/template'; myCustomNameForHtmlSafe();",
      output: null,
      errors: [htmlSafeError('CallExpression')],
    },
    {
      code: "import { trustHTML } from '@ember/template'; trustHTML('foo');",
      output: null,
      errors: [trustHTMLError('CallExpression')],
    },
    {
      code: "import { trustHTML as trust } from '@ember/template'; trust('foo');",
      output: null,
      errors: [trustHTMLError('CallExpression')],
    },
    {
      // String import name:
      code: "import { 'htmlSafe' as safe } from '@ember/template'; safe('foo');",
      output: null,
      errors: [htmlSafeError('CallExpression')],
    },
    {
      // Every call is reported, so each one needs its own disable comment:
      code: "import { htmlSafe } from '@ember/template'; htmlSafe('foo'); htmlSafe('bar');",
      output: null,
      errors: [htmlSafeError('CallExpression'), htmlSafeError('CallExpression')],
    },
    {
      // Each import is reported:
      code: "import { htmlSafe as a } from '@ember/string'; import { htmlSafe as b } from '@ember/template'; a('foo'); b('bar');",
      output: null,
      errors: [htmlSafeError('CallExpression'), htmlSafeError('CallExpression')],
    },
    {
      // Called before the import:
      code: "htmlSafe('foo'); import { htmlSafe } from '@ember/template';",
      output: null,
      errors: [htmlSafeError('CallExpression')],
    },
    {
      // Optional call:
      code: "import { htmlSafe } from '@ember/template'; htmlSafe?.('foo');",
      output: null,
      errors: [htmlSafeError('CallExpression')],
    },

    // Passed on rather than called:
    {
      code: "import { htmlSafe } from '@ember/template'; const f = htmlSafe; f('foo');",
      output: null,
      errors: [htmlSafeError('Identifier')],
    },
    {
      code: "import { htmlSafe } from '@ember/template'; items.map(htmlSafe);",
      output: null,
      errors: [htmlSafeError('Identifier')],
    },
    {
      code: "import { htmlSafe } from '@ember/template'; htmlSafe.call(null, 'foo');",
      output: null,
      errors: [htmlSafeError('Identifier')],
    },
    {
      code: "import { htmlSafe } from '@ember/string'; htmlSafe.foo('foo');",
      output: null,
      errors: [htmlSafeError('Identifier')],
    },
    {
      code: "import { htmlSafe } from '@ember/template'; class A { format = htmlSafe; }",
      output: null,
      errors: [htmlSafeError('Identifier')],
    },
    {
      code: "import { htmlSafe } from '@ember/template'; export { htmlSafe };",
      output: null,
      errors: [htmlSafeError('Identifier')],
    },

    // Re-exports:
    {
      code: "export { htmlSafe } from '@ember/template';",
      output: null,
      errors: [htmlSafeError('ExportSpecifier')],
    },
    {
      code: "export { trustHTML as trust, isHTMLSafe } from '@ember/template';",
      output: null,
      errors: [trustHTMLError('ExportSpecifier')],
    },

    // Namespace imports:
    {
      code: "import * as t from '@ember/template'; t.htmlSafe('foo');",
      output: null,
      errors: [htmlSafeError('CallExpression')],
    },
    {
      code: "import * as t from '@ember/template'; t['trustHTML']('foo');",
      output: null,
      errors: [trustHTMLError('CallExpression')],
    },
    {
      code: "import * as t from '@ember/template'; t[`htmlSafe`]('foo');",
      output: null,
      errors: [htmlSafeError('CallExpression')],
    },
    {
      code: "import * as s from '@ember/string'; const f = s.htmlSafe;",
      output: null,
      errors: [htmlSafeError('MemberExpression')],
    },
  ],
});

const gjsRuleTester = new RuleTester({
  parser: require.resolve('ember-eslint-parser'),
  parserOptions: { ecmaVersion: 2022, sourceType: 'module' },
});

gjsRuleTester.run('no-html-safe', rule, {
  valid: [
    // Not imported from Ember:
    {
      filename: 'test.gjs',
      code: `import { htmlSafe } from './my-lib';
        <template>{{htmlSafe @content}}</template>`,
    },
    {
      filename: 'test.gjs',
      code: `import { trustHTML } from 'something/else';
        <template>{{trustHTML @content}}</template>`,
    },

    // Not imported at all:
    {
      filename: 'test.gjs',
      code: '<template>{{htmlSafe @content}}</template>',
    },

    // Wrong export:
    {
      filename: 'test.gjs',
      code: `import { isHTMLSafe } from '@ember/template';
        <template>{{if (isHTMLSafe @content) "yes"}}</template>`,
    },
    {
      filename: 'test.gjs',
      code: `import * as t from '@ember/template';
        <template>{{if (t.isHTMLSafe @content) "yes"}}</template>`,
    },

    // `trustHTML` was never in `@ember/string`:
    {
      filename: 'test.gjs',
      code: `import { trustHTML } from '@ember/string';
        <template>{{trustHTML @content}}</template>`,
    },

    // Shadowed by a block param:
    {
      filename: 'test.gjs',
      code: `import { htmlSafe } from '@ember/template';
        <template>{{#each @items as |htmlSafe|}}{{htmlSafe}}{{/each}}</template>`,
    },
    {
      filename: 'test.gjs',
      code: `import { htmlSafe } from '@ember/template';
        <template><MyComponent as |htmlSafe|>{{htmlSafe}}</MyComponent></template>`,
    },

    // Shadowed by a JS parameter around the template:
    {
      filename: 'test.gjs',
      code: `import { htmlSafe } from '@ember/template';
        function make(htmlSafe) {
          return <template>{{htmlSafe @content}}</template>;
        }`,
    },

    // Not the import:
    {
      filename: 'test.gjs',
      code: `import { htmlSafe } from '@ember/template';
        <template>{{this.htmlSafe @content}}</template>`,
    },

    // Only used as a type:
    {
      filename: 'test.gts',
      code: `import { htmlSafe } from '@ember/template';
        type Safe = ReturnType<typeof htmlSafe>;
        <template>{{@content}}</template>`,
    },
    {
      filename: 'test.gts',
      code: `import type { htmlSafe } from '@ember/template';
        type Safe = ReturnType<typeof htmlSafe>;`,
    },
    {
      filename: 'test.gts',
      code: `import { htmlSafe } from '@ember/template';
        export type { htmlSafe };`,
    },
    {
      filename: 'test.gts',
      code: `import { htmlSafe } from '@ember/template';
        export { type htmlSafe };`,
    },
    {
      filename: 'test.gts',
      code: "export type { htmlSafe } from '@ember/template';",
    },
  ],
  invalid: [
    {
      filename: 'test.gjs',
      code: `import { htmlSafe } from '@ember/template';
        <template>{{htmlSafe @content}}</template>`,
      output: null,
      errors: [htmlSafeError('GlimmerPathExpression')],
    },
    {
      filename: 'test.gjs',
      code: `import { trustHTML } from '@ember/template';
        <template>{{trustHTML @content}}</template>`,
      output: null,
      errors: [trustHTMLError('GlimmerPathExpression')],
    },
    {
      filename: 'test.gjs',
      code: `import { htmlSafe } from '@ember/string';
        <template>{{htmlSafe @content}}</template>`,
      output: null,
      errors: [htmlSafeError('GlimmerPathExpression')],
    },
    {
      // Renamed import, used in an attribute and as a subexpression:
      filename: 'test.gjs',
      code: `import { htmlSafe as safe } from '@ember/template';
        <template>
          <div style={{safe @style}}></div>
          <MyComponent @body={{concat (safe @body) "!"}} />
        </template>`,
      output: null,
      errors: [
        htmlSafeError('GlimmerPathExpression', { line: 3 }),
        htmlSafeError('GlimmerPathExpression', { line: 4 }),
      ],
    },
    {
      // Triple curlies:
      filename: 'test.gjs',
      code: `import { htmlSafe } from '@ember/template';
        <template>{{{htmlSafe @content}}}</template>`,
      output: null,
      errors: [htmlSafeError('GlimmerPathExpression')],
    },
    {
      // Passed as a value:
      filename: 'test.gjs',
      code: `import { htmlSafe } from '@ember/template';
        <template><MyComponent @format={{htmlSafe}} /></template>`,
      output: null,
      errors: [htmlSafeError('GlimmerPathExpression')],
    },
    {
      // Namespace import:
      filename: 'test.gjs',
      code: `import * as t from '@ember/template';
        <template>{{t.trustHTML @content}}</template>`,
      output: null,
      errors: [trustHTMLError('GlimmerPathExpression')],
    },
    {
      // Used in JS and in the template:
      filename: 'test.gjs',
      code: `import { htmlSafe } from '@ember/template';
        const style = htmlSafe('color: red');
        <template>{{htmlSafe @content}}</template>`,
      output: null,
      errors: [
        htmlSafeError('CallExpression', { line: 2 }),
        htmlSafeError('GlimmerPathExpression', { line: 3 }),
      ],
    },
    {
      // A component written in TypeScript:
      filename: 'test.gts',
      code: `import { htmlSafe } from '@ember/template';
        import Component from '@glimmer/component';

        interface Signature { Args: { color: string; content: string } }

        export default class Content extends Component<Signature> {
          get style(): ReturnType<typeof htmlSafe> {
            return htmlSafe(\`color: \${this.args.color}\`);
          }

          <template>
            <p style={{this.style}}>{{htmlSafe @content}}</p>
          </template>
        }`,
      output: null,
      errors: [
        htmlSafeError('CallExpression', { line: 8 }),
        htmlSafeError('GlimmerPathExpression', { line: 12 }),
      ],
    },
    {
      // TypeScript wrappers around the callee are reported as the call:
      filename: 'test.gts',
      code: `import { htmlSafe } from '@ember/template';
        import * as t from '@ember/template';
        htmlSafe!('a');
        (htmlSafe as (s: string) => unknown)('b');
        (t.trustHTML satisfies unknown as typeof htmlSafe)('c');`,
      output: null,
      errors: [
        htmlSafeError('CallExpression', { line: 3 }),
        htmlSafeError('CallExpression', { line: 4 }),
        trustHTMLError('CallExpression', { line: 5 }),
      ],
    },
  ],
});
