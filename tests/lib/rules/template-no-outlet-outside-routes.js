//------------------------------------------------------------------------------
// Requirements
//------------------------------------------------------------------------------

const rule = require('../../../lib/rules/template-no-outlet-outside-routes');
const RuleTester = require('eslint').RuleTester;

const ruleTester = new RuleTester({
  parser: require.resolve('ember-eslint-parser'),
  parserOptions: { ecmaVersion: 2022, sourceType: 'module' },
});

ruleTester.run('template-no-outlet-outside-routes', rule, {
  valid: [
    // Non-outlet usage in components
    '<template><div>Content</div></template>',
    '<template>{{foo}}</template>',
    '<template>{{button}}</template>',
    // GJS route templates — outlet is allowed
    {
      filename: 'app/routes/foo.gjs',
      code: '<template>{{outlet}}</template>',
    },
    {
      filename: 'app/routes/foo.gts',
      code: '<template>{{outlet}}</template>',
    },
  ],
  invalid: [
    // Co-located component (explicit filename)
    {
      filename: 'app/components/my-component.gjs',
      code: '<template>{{outlet}}</template>',
      output: null,
      errors: [{ messageId: 'noOutletOutsideRoutes' }],
    },
    {
      filename: 'app/components/my-component.gts',
      code: '<template>{{outlet}}</template>',
      output: null,
      errors: [{ messageId: 'noOutletOutsideRoutes' }],
    },
    {
      filename: 'app/components/my-component.gjs',
      code: '<template><div>{{outlet}}</div></template>',
      output: null,
      errors: [{ messageId: 'noOutletOutsideRoutes' }],
    },
  ],
});

const hbsRuleTester = new RuleTester({
  parser: require.resolve('ember-eslint-parser/hbs'),
  parserOptions: {
    ecmaVersion: 2022,
    sourceType: 'module',
  },
});

hbsRuleTester.run('template-no-outlet-outside-routes', rule, {
  valid: [
    // Non-outlet usage
    '{{foo}}',
    '{{button}}',
    // Route templates — outlet is allowed
    {
      filename: 'app/templates/foo/route.hbs',
      code: '{{outlet}}',
    },
    {
      filename: 'app/templates/routes/foo.hbs',
      code: '{{outlet}}',
    },
    // Block form in route templates
    {
      filename: 'app/templates/foo/route.hbs',
      code: '{{#outlet}}Why?!{{/outlet}}',
    },
    {
      filename: 'app/templates/routes/foo.hbs',
      code: '{{#outlet}}Why?!{{/outlet}}',
    },
    // Ambiguous path — not clearly a component, so allowed
    {
      filename: 'app/templates/something/foo.hbs',
      code: '{{#outlet}}Works because ambiguous{{/outlet}}',
    },
    // "components" appears in prefix but not under <app>/templates/components/ or <app>/components/
    {
      filename: 'components/templates/application.hbs',
      code: '{{outlet}}',
    },
  ],
  invalid: [
    // Classic component template
    {
      filename: 'app/templates/components/foo/layout.hbs',
      code: '{{outlet}}',
      output: null,
      errors: [{ messageId: 'noOutletOutsideRoutes' }],
    },
    // Partial (basename starts with '-')
    {
      filename: 'app/templates/foo/-mything.hbs',
      code: '{{outlet}}',
      output: null,
      errors: [{ messageId: 'noOutletOutsideRoutes' }],
    },
    // Co-located component template
    {
      filename: 'app/components/foo/layout.hbs',
      code: '{{outlet}}',
      output: null,
      errors: [{ messageId: 'noOutletOutsideRoutes' }],
    },
    // Nested outlet in component
    {
      filename: 'app/components/foo/layout.hbs',
      code: '<div>{{outlet}}</div>',
      output: null,
      errors: [{ messageId: 'noOutletOutsideRoutes' }],
    },
  ],
});
