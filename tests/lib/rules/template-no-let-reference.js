//------------------------------------------------------------------------------
// Requirements
//------------------------------------------------------------------------------

const rule = require('../../../lib/rules/template-no-let-reference');
const RuleTester = require('eslint').RuleTester;

//------------------------------------------------------------------------------
// Tests
//------------------------------------------------------------------------------

const ruleTester = new RuleTester({
  parser: require.resolve('ember-eslint-parser'),
  parserOptions: { ecmaVersion: 2022, sourceType: 'module' },
});
ruleTester.run('template-no-let-reference', rule, {
  valid: [
    `
      const a = '';
      function create(d) {
      <template>
        <Abc as |x a|>
          {{x}}
          {{a}}
        </Abc>
      {{a}}
      {{d}}
      {{this.f}}
      </template>
      }
    `,
    `
      const a = '';
      <template>
      <a></a>
      </template>
    `,
    // make sure rule does not error out on missing references
    `
      const a = '';
      <template>
      {{ab}}
      <ab></ab>
      </template>
    `,
    `
    import { ExternalLink } from 'limber-ui';

    export const Footer = <template>
      <footer class="p-2 w-full grid shadow border-t">
        <nav class="mx-auto flex gap-4">
          <ExternalLink href="https://github.com/nullvoxpopuli/limber">
            <:custom as |DefaultContent|>
              <span class="hidden sm:block">
                <DefaultContent>
                  GitHub
                </DefaultContent>
              </span>
            </:custom>
          </ExternalLink>
          <ExternalLink href="https://guides.emberjs.com/">
            Guides
          </ExternalLink>
        </nav>
      </footer>
    </template>;
    `,
  ],

  invalid: [
    {
      code: `
      let a = '';
      <template>
      {{a}}
      </template>
      `,
      output: null,
      errors: [{ type: 'VarHead', message: rule.meta.messages['no-let'] }],
    },
  ],
});
