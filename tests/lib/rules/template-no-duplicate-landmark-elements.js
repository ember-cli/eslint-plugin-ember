const rule = require('../../../lib/rules/template-no-duplicate-landmark-elements');
const RuleTester = require('eslint').RuleTester;

const ruleTester = new RuleTester({
  parser: require.resolve('ember-eslint-parser'),
  parserOptions: { ecmaVersion: 2022, sourceType: 'module' },
});

ruleTester.run('template-no-duplicate-landmark-elements', rule, {
  valid: [
    '<template><nav aria-label="primary site navigation"></nav><nav aria-label="secondary site navigation within home page"></nav></template>',
    '<template><nav aria-label="primary site navigation"></nav><div role="navigation" aria-label="secondary site navigation within home page"></div></template>',
    '<template><form aria-labelledby="form-title"><div id="form-title">Shipping Address</div></form><form aria-label="meaningful title of second form"></form></template>',
    '<template><form role="search"></form><form></form></template>',
    '<template><header></header><main></main><footer></footer></template>',
    '<template><img role="none"><img role="none"></template>',
    // Conditional branches: elements in if/else are mutually exclusive
    '<template>{{#if this.isCreateProjectFromSavedSearchEnabled}}<form></form>{{else}}<form></form>{{/if}}</template>',
    // header inside sectioning element loses landmark role
    "<template><main><header><h1>Main Page Header</h1></header></main><dialog id='my-dialog'><header><h1>Dialog Header</h1></header></dialog></template>",
  ],

  invalid: [
    {
      code: '<template><nav></nav><nav></nav></template>',
      output: null,
      errors: [{ messageId: 'duplicate' }],
    },
    {
      code: '<template><nav></nav><div role="navigation"></div></template>',
      output: null,
      errors: [{ messageId: 'duplicate' }],
    },
    {
      code: '<template><nav></nav><nav aria-label="secondary navigation"></nav></template>',
      output: null,
      errors: [{ messageId: 'duplicate' }],
    },
    {
      code: '<template><main></main><div role="main"></div></template>',
      output: null,
      errors: [{ messageId: 'duplicate' }],
    },
    {
      code: '<template><nav aria-label="site navigation"></nav><nav aria-label="site navigation"></nav></template>',
      output: null,
      errors: [{ messageId: 'duplicate' }],
    },
    {
      code: '<template><form aria-label="search-form"></form><form aria-label="search-form"></form></template>',
      output: null,
      errors: [{ messageId: 'duplicate' }],
    },
    {
      code: '<template><form aria-labelledby="form-title"></form><form aria-labelledby="form-title"></form></template>',
      output: null,
      errors: [{ messageId: 'duplicate' }],
    },
  ],
});

const hbsRuleTester = new RuleTester({
  parser: require.resolve('ember-eslint-parser/hbs'),
  parserOptions: { ecmaVersion: 2022, sourceType: 'module' },
});

hbsRuleTester.run('template-no-duplicate-landmark-elements (hbs)', rule, {
  valid: [
    '<nav aria-label="primary site navigation"></nav><nav aria-label="secondary site navigation within home page"></nav>',
    '<nav aria-label="primary site navigation"></nav><div role="navigation" aria-label="secondary site navigation within home page"></div>',
    '<nav aria-label="primary site navigation"></nav><div role={{role}} aria-label="secondary site navigation within home page"></div>',
    '<form aria-labelledby="form-title"><div id="form-title">Shipping Address</div></form><form aria-label="meaningful title of second form"></form>',
    '<form role="search"></form><form></form>',
    '<header></header><main></main><footer></footer>',
    '<img role="none"><img role="none">',
    // Dynamic aria-label values are treated as unique (can't statically determine duplicates)
    '<nav aria-label={{siteNavigation}}></nav><nav aria-label={{siteNavigation}}></nav>',
    '<nav aria-label="primary navigation"></nav><nav aria-label={{this.something}}></nav>',
    // header/footer inside sectioning elements lose their landmark role
    "<main><header><h1>Main Page Header</h1></header><button commandfor='my-dialog'>Open Dialog</button></main><dialog id='my-dialog'><header><h1>Dialog Header</h1></header></dialog>",
    "<main><header><h1>Main Page Header</h1></header><button commandfor='my-dialog'>Open Dialog</button></main><div popover id='my-dialog'><header><h1>Dialog Header</h1></header></div>",
    // Conditional branches: elements in if/else are mutually exclusive
    '{{#if this.isCreateProjectFromSavedSearchEnabled}}<form></form>{{else}}<form></form>{{/if}}',
  ],
  invalid: [
    {
      code: '<nav></nav><nav></nav>',
      output: null,
      errors: [{ messageId: 'duplicate' }],
    },
    {
      code: '<nav></nav><div role="navigation"></div>',
      output: null,
      errors: [{ messageId: 'duplicate' }],
    },
    {
      code: '<nav></nav><nav aria-label="secondary navigation"></nav>',
      output: null,
      errors: [{ messageId: 'duplicate' }],
    },
    {
      code: '<main></main><div role="main"></div>',
      output: null,
      errors: [{ messageId: 'duplicate' }],
    },
    {
      code: '<nav aria-label="site navigation"></nav><nav aria-label="site navigation"></nav>',
      output: null,
      errors: [{ messageId: 'duplicate' }],
    },
    {
      code: '<form aria-label="search-form"></form><form aria-label="search-form"></form>',
      output: null,
      errors: [{ messageId: 'duplicate' }],
    },
    {
      code: '<form aria-labelledby="form-title"></form><form aria-labelledby="form-title"></form>',
      output: null,
      errors: [{ messageId: 'duplicate' }],
    },
  ],
});
