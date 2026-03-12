const rule = require('../../../lib/rules/template-no-invalid-meta');
const RuleTester = require('eslint').RuleTester;

const ruleTester = new RuleTester({
  parser: require.resolve('ember-eslint-parser'),
  parserOptions: { ecmaVersion: 2022, sourceType: 'module' },
});

ruleTester.run('template-no-invalid-meta', rule, {
  valid: [
    '<template><meta charset="utf-8" /></template>',
    '<template><meta charset="UTF-8" /></template>',
    '<template><meta charset="utf8" /></template>',
    '<template><meta name="viewport" content="width=device-width" /></template>',

    // Bare meta (no attrs)
    '<template><meta></template>',

    // Valid http-equiv refresh (delay=0 for redirect, >72000)
    '<template><meta http-equiv="refresh" content="0; url=http://www.example.com"></template>',
    '<template><meta http-equiv="refresh" content="72001"></template>',

    // Dynamic attributes (can't validate at lint time)
    '<template><meta http-equiv={{httpEquiv}} content={{content}}></template>',
    '<template><meta name={{name}} content={{content}}></template>',

    // Viewport with user-scalable=yes (valid)
    '<template><meta name="viewport" content="width=device-width, initial-scale=1.0, user-scalable=yes"></template>',
    '<template><meta name="viewport" content="width=device-width, initial-scale=1"></template>',

    // property and itemprop with content (valid)
    '<template><meta property="og:type" content="website"></template>',
    '<template><meta itemprop="type" content="website"></template>',
  ],

  invalid: [
    {
      code: '<template><meta charset="iso-8859-1" /></template>',
      output: null,
      errors: [
        {
          message: 'Meta charset should be "utf-8". Found: "iso-8859-1".',
          type: 'GlimmerElementNode',
        },
      ],
    },
    {
      code: '<template><meta charset="latin1" /></template>',
      output: null,
      errors: [
        {
          message: 'Meta charset should be "utf-8". Found: "latin1".',
          type: 'GlimmerElementNode',
        },
      ],
    },
    {
      code: '<template><meta charset="windows-1252" /></template>',
      output: null,
      errors: [
        {
          message: 'Meta charset should be "utf-8". Found: "windows-1252".',
          type: 'GlimmerElementNode',
        },
      ],
    },

    {
      code: '<template><meta http-equiv="refresh" content="1; url=http://www.example.com"></template>',
      output: null,
      errors: [{ messageId: 'metaRefreshRedirect' }],
    },
    {
      code: '<template><meta http-equiv="refresh" content="71999"></template>',
      output: null,
      errors: [{ messageId: 'metaRefreshDelay' }],
    },
    {
      code: '<template><meta name="viewport" content="user-scalable=no"></template>',
      output: null,
      errors: [{ messageId: 'viewportUserScalable' }],
    },
    {
      code: '<template><meta name="viewport" content="user-scalable = no"></template>',
      output: null,
      errors: [{ messageId: 'viewportUserScalable' }],
    },
    {
      code: '<template><meta name="viewport" content="user-scalable= no"></template>',
      output: null,
      errors: [{ messageId: 'viewportUserScalable' }],
    },
    {
      code: '<template><meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0"></template>',
      output: null,
      errors: [{ messageId: 'viewportMaximumScale' }],
    },
    {
      code: '<template><meta name="viewport"></template>',
      output: null,
      errors: [{ messageId: 'metaMissingContent' }],
    },
    {
      code: '<template><meta property="og:type"></template>',
      output: null,
      errors: [{ messageId: 'metaMissingContent' }],
    },
    {
      code: '<template><meta itemprop="type"></template>',
      output: null,
      errors: [{ messageId: 'metaMissingContent' }],
    },
    {
      code: '<template><meta http-equiv="refresh"></template>',
      output: null,
      errors: [{ messageId: 'metaMissingContent' }],
    },
    {
      code: '<template><meta content="72001"></template>',
      output: null,
      errors: [{ messageId: 'metaMissingIdentifier' }],
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

hbsRuleTester.run('template-no-invalid-meta', rule, {
  valid: [
    '<meta>',
    '<meta charset="UTF-8">',
    '<meta http-equiv="refresh" content="0; url=http://www.example.com">',
    '<meta http-equiv="refresh" content="72001">',
    '<meta http-equiv={{httpEquiv}} content={{content}}>',
    '<meta name="viewport" content="width=device-width, initial-scale=1.0, user-scalable=yes">',
    '<meta name="viewport" content="width=device-width, initial-scale=1.0, user-scalable = yes">',
    '<meta name="viewport" content="width=device-width, initial-scale=1.0, user-scalable= yes">',
    '<meta name="viewport" content="width=device-width, initial-scale=1">',
    '<meta name={{name}} content={{content}}>',
    '<meta property="og:type" content="website">',
    '<meta itemprop="type" content="website">',
    '<div></div>',
  ],
  invalid: [
    {
      code: '<meta http-equiv="refresh" content="1; url=http://www.example.com">',
      output: null,
      errors: [{ message: 'A meta redirect should not have a delay value greater than zero.' }],
    },
    {
      code: '<meta http-equiv="refresh" content="71999">',
      output: null,
      errors: [{ message: 'A meta refresh should have a delay greater than 72000 seconds.' }],
    },
    {
      code: '<meta name="viewport" content="user-scalable=no">',
      output: null,
      errors: [{ message: 'A meta viewport should not restrict user-scalable.' }],
    },
    {
      code: '<meta name="viewport" content="user-scalable = no">',
      output: null,
      errors: [{ message: 'A meta viewport should not restrict user-scalable.' }],
    },
    {
      code: '<meta name="viewport" content="user-scalable= no">',
      output: null,
      errors: [{ message: 'A meta viewport should not restrict user-scalable.' }],
    },
    {
      code: '<meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0">',
      output: null,
      errors: [{ message: 'A meta viewport should not set a maximum scale on content.' }],
    },
    {
      code: '<meta name="viewport">',
      output: null,
      errors: [
        {
          message:
            'A meta content attribute must be defined if the name, property, itemprop, or http-equiv attribute is defined.',
        },
      ],
    },
    {
      code: '<meta property="og:type">',
      output: null,
      errors: [
        {
          message:
            'A meta content attribute must be defined if the name, property, itemprop, or http-equiv attribute is defined.',
        },
      ],
    },
    {
      code: '<meta itemprop="type">',
      output: null,
      errors: [
        {
          message:
            'A meta content attribute must be defined if the name, property, itemprop, or http-equiv attribute is defined.',
        },
      ],
    },
    {
      code: '<meta http-equiv="refresh">',
      output: null,
      errors: [
        {
          message:
            'A meta content attribute must be defined if the name, property, itemprop, or http-equiv attribute is defined.',
        },
      ],
    },
    {
      code: '<meta content="72001">',
      output: null,
      errors: [
        {
          message:
            'A meta content attribute cannot be defined if the name, property, itemprop, nor the http-equiv attributes are defined.',
        },
      ],
    },
  ],
});
