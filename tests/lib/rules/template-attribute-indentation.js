//------------------------------------------------------------------------------
// Requirements
//------------------------------------------------------------------------------

const rule = require('../../../lib/rules/template-attribute-indentation');
const RuleTester = require('eslint').RuleTester;

//------------------------------------------------------------------------------
// Tests
//------------------------------------------------------------------------------

const hbsRuleTester = new RuleTester({
  parser: require.resolve('ember-eslint-parser/hbs'),
  parserOptions: { ecmaVersion: 2022, sourceType: 'module' },
});

const gjsRuleTester = new RuleTester({
  parser: require.resolve('ember-eslint-parser'),
  parserOptions: { ecmaVersion: 2022, sourceType: 'module' },
});

// ---- HBS tests ----

hbsRuleTester.run('template-attribute-indentation', rule, {
  valid: [
    // Short invocations on a single line are fine (< 80 chars)
    '{{employee-details firstName=firstName}}',
    '<input disabled>',

    // Non-block with no params
    '{{contact-details}}',
    // Default config with open-invocation (< 80 chars) - positional params
    '{{contact-details firstName lastName}}',
    // named params
    '{{contact-details firstName=firstName lastName=lastName}}',

    // Mustache non-block with proper indentation and new-line close
    {
      code: ['{{contact-details', '  firstName=firstName', '  lastName=lastName', '}}'].join('\n'),
      options: [{ 'mustache-open-end': 'new-line' }],
    },
    // Mustache non-block with last-attribute close
    {
      code: ['{{contact-details', '  firstName=firstName', '  lastName=lastName}}'].join('\n'),
      options: [{ 'mustache-open-end': 'last-attribute' }],
    },

    // Open-invocation with multiple lines
    ['{{contact-details', '  firstName=firstName', '  lastName=lastName', '}}'].join('\n'),
    // Positional params multi-line
    ['{{contact-details', '  firstName', '  lastName', '}}'].join('\n'),
    // Helper
    [
      '{{if',
      '  (or logout.isRunning (not session.isAuthenticated))',
      '  "Logging Out..."',
      '  "Log Out"',
      '}}',
    ].join('\n'),
    // Helper unfolded
    [
      '{{if',
      '  (or ',
      '    logout.isRunning',
      '    (not session.isAuthenticated)',
      '  )',
      '  "Logging Out..."',
      '  "Log Out"',
      '}}',
    ].join('\n'),
    // Positional null
    ['{{contact-null', '  null', '}}'].join('\n'),
    // Component helper
    ['{{component', '  field', '  action=(action reaction)', '}}'].join('\n'),
    // Multiple open-invocations
    [
      '{{contact-details',
      '  firstName=firstName',
      '  lastName=lastName',
      '}}',
      '{{contact-details',
      '  firstName=firstName',
      '  lastName=lastName',
      '}}',
    ].join('\n'),
    // Component from hash
    ['{{t.body', '  canExpand=true', '}}'].join('\n'),
    // With helper
    ['{{print-debug', '  foo=(or', '    foo', '    bar', '  )', '  baz=baz', '}}'].join('\n'),
    // With positional helper
    ['{{print-debug', '  (hash', '    foo="bar"', '  )', '  title="baz"', '}}'].join('\n'),
    // yield with hash
    [
      '{{yield',
      '  (hash',
      '    header=(component "x-very-long-name-header")',
      '    body=(component "x-very-long-name-body")',
      '  )',
      '}}',
    ].join('\n'),

    // Block form within 80 characters - positional params
    ['{{#contact-details firstName lastName}}', ' {{contactImage}}', '{{/contact-details}}'].join(
      '\n'
    ),
    // Block form with named params
    [
      '{{#contact-details firstName=firstName lastName=lastName}}',
      ' {{contactImage}}',
      '{{/contact-details}}',
    ].join('\n'),
    // Component from hash block form
    [
      '{{#t.body',
      '  canExpand=true',
      '  multiRowExpansion=false',
      '}}',
      '  {{foo}}',
      '{{/t.body}}',
    ].join('\n'),
    // Block form with block params
    [
      '{{#contact-details firstName=firstName lastName=lastName as |contact|}}',
      ' {{contact.fullName}}',
      '{{/contact-details}}',
    ].join('\n'),
    // Component from positional block form
    [
      '{{#t.body',
      '  canExpand=(helper help)',
      '  multiRowExpansion=false',
      'as |body|',
      '}}',
      '  {{foo}}',
      '{{/t.body}}',
    ].join('\n'),
    // Indented block params
    [
      '  {{#t.body',
      '    canExpand=(helper help)',
      '    multiRowExpansion=false',
      '  as |body|',
      '  }}',
      '    {{foo}}',
      '  {{/t.body}}',
    ].join('\n'),

    // Non-block form with open-invocation-max-len
    {
      code: '{{contact-details firstName=firstName lastName=lastName avatarUrl=avatarUrl age=age address=address phoneNo=phoneNo}}',
      options: [{ 'open-invocation-max-len': 120 }],
    },

    // Block form with open-invocation > 80, config allows 120
    {
      code: [
        '{{#contact-details firstName=firstName lastName=lastName age=age avatarUrl=avatarUrl as |contact|}}',
        ' {{contact.fullName}}',
        '{{/contact-details}}',
      ].join('\n'),
      options: [{ 'mustache-open-end': 'last-attribute', 'open-invocation-max-len': 120 }],
    },

    // Block form with multiple line invocation
    [
      '{{#contact-details',
      '  firstName=firstName',
      '  lastName=lastName',
      'as |fullName|',
      '}}',
      '  {{fullName}}',
      '{{/contact-details}}',
    ].join('\n'),
    // Block form with no params
    [
      '{{#contact-details',
      'as |contact|',
      '}}',
      '  {{contact.fullName}}',
      '{{/contact-details}}',
    ].join('\n'),

    // Nested elements sanity check
    '<div>\n  <p></p>\n</div>',

    // Block params with last-attribute
    {
      code: [
        '{{#contact-details',
        '  param0',
        '  param1=abc',
        '  param2=abc',
        'as |ab cd ef  cd ef |}}',
        '  {{contact.fullName}}',
        '{{/contact-details}}',
      ].join('\n'),
      options: [{ 'mustache-open-end': 'last-attribute' }],
    },
    // Block params with new-line
    {
      code: [
        '{{#contact-details',
        '  param0',
        '  param1=abc',
        '  param2=abc',
        'as |ab cd ef  cd ef |',
        '}}',
        '  {{contact.fullName}}',
        '{{/contact-details}}',
      ].join('\n'),
      options: [{ 'mustache-open-end': 'new-line' }],
    },

    // Mixed element + mustache: new-line/new-line
    {
      code: [
        '<div',
        '  class="classy"',
        '>',
        '{{#contact-details',
        '  param0',
        '  param1=abc',
        '  param2=abc',
        'as |ab cd ef  cd ef |',
        '}}',
        '  {{contact.fullName}}',
        '{{/contact-details}}',
        '</div>',
      ].join('\n'),
      options: [{ 'mustache-open-end': 'new-line', 'element-open-end': 'new-line' }],
    },
    // Mixed element + mustache: last-attribute/last-attribute
    {
      code: [
        '<div',
        '  class="classy">',
        '{{#contact-details',
        '  param0',
        '  param1=abc',
        '  param2=abc',
        'as |ab cd ef  cd ef |}}',
        '  {{contact.fullName}}',
        '{{/contact-details}}',
        '</div>',
      ].join('\n'),
      options: [{ 'mustache-open-end': 'last-attribute', 'element-open-end': 'last-attribute' }],
    },
    // Mixed element + mustache: last-attribute/new-line
    {
      code: [
        '<div',
        '  class="classy"',
        '>',
        '{{#contact-details',
        '  param0',
        '  param1=abc',
        '  param2=abc',
        'as |ab cd ef  cd ef |}}',
        '  {{contact.fullName}}',
        '{{/contact-details}}',
        '</div>',
      ].join('\n'),
      options: [{ 'mustache-open-end': 'last-attribute', 'element-open-end': 'new-line' }],
    },
    // Mixed element + mustache: new-line/last-attribute
    {
      code: [
        '<div',
        '  class="classy">',
        '{{#contact-details',
        '  param0',
        '  param1=abc',
        '  param2=abc',
        'as |ab cd ef  cd ef |',
        '}}',
        '  {{contact.fullName}}',
        '{{/contact-details}}',
        '</div>',
      ].join('\n'),
      options: [{ 'mustache-open-end': 'new-line', 'element-open-end': 'last-attribute' }],
    },

    // Block form with proper indentation
    {
      code: [
        '{{#employee-details',
        '  firstName=firstName',
        '  lastName=lastName',
        'as |employee|',
        '}}',
        '  {{employee.fullName}}',
        '{{/employee-details}}',
      ].join('\n'),
      options: [{ 'mustache-open-end': 'new-line' }],
    },
    // Block form with as-indentation attribute
    {
      code: ['{{#foo', '  attribute=this.mine', '  as |let|', '}}', '{{/foo}}'].join('\n'),
      options: [
        {
          'mustache-open-end': 'new-line',
          'element-open-end': 'new-line',
          'as-indentation': 'attribute',
        },
      ],
    },
    // Block form with as-indentation closing-brace
    {
      code: ['{{#foo', '  attribute=this.mine', 'as |let|', '}}', '{{/foo}}'].join('\n'),
      options: [
        {
          'mustache-open-end': 'new-line',
          'element-open-end': 'new-line',
          'as-indentation': 'closing-brace',
        },
      ],
    },

    // Nested sub-expression in element attribute
    {
      code: [
        '<div',
        '  foo={{action',
        '    (if',
        '      abc',
        '      def',
        '      ghi)',
        '    stuff',
        '  }}',
        '  baz=qux',
        '/>',
      ].join('\n'),
      options: [{ 'mustache-open-end': 'new-line', 'element-open-end': 'new-line' }],
    },

    // HTML element with new-line close
    {
      code: '<div\n  foo=bar\n  baz=qux\n/>',
      options: [{ 'element-open-end': 'new-line' }],
    },
    // HTML element with last-attribute close
    {
      code: '<div\n  foo=bar\n  baz=qux/>',
      options: [{ 'element-open-end': 'last-attribute' }],
    },
    // Input element with new-line close
    {
      code: '<input\n  foo=bar\n  baz=qux\n>',
      options: [{ 'element-open-end': 'new-line' }],
    },
    // Input element with last-attribute close
    {
      code: '<input\n  foo=bar\n  baz=qux>',
      options: [{ 'element-open-end': 'last-attribute' }],
    },

    // Element with mustache-open-end:new-line, element-open-end:last-attribute
    {
      code: ['<div', '  foo={{action', '    some', '    stuff', '  }}', '  baz=qux/>'].join('\n'),
      options: [{ 'mustache-open-end': 'new-line', 'element-open-end': 'last-attribute' }],
    },

    // element-open-end:new-line alone (no mustache-open-end set)
    {
      code: ['<div', '  foo={{action', '    some', '    stuff', '  }}', '  baz=qux', '/>'].join(
        '\n'
      ),
      options: [{ 'element-open-end': 'new-line' }],
    },
    // Inline mustache value in element
    {
      code: '<div\n  foo={{action some stuff}}\n  baz=qux\n/>',
      options: [{ 'element-open-end': 'new-line' }],
    },

    // Mustache with sub-expression
    {
      code: [
        '{{my-component',
        '  foo=bar',
        '  baz=qux',
        '  my-attr=(component "my-other-component" data=(hash',
        '    foo=bar',
        '    foo=bar',
        '    baz=qux))',
        '}}',
      ].join('\n'),
      options: [{ 'mustache-open-end': 'new-line' }],
    },
    // Mustache with sub-expression and last-attribute close
    {
      code: [
        '{{my-component',
        '  foo=bar',
        '  baz=qux',
        '  my-attr=(component "my-other-component" data=(hash',
        '    foo=bar',
        '    foo=bar',
        '    baz=qux))}}',
      ].join('\n'),
      options: [{ 'mustache-open-end': 'last-attribute' }],
    },
    // Element with nested mustache value
    {
      code: ['<div', '  foo={{action', '    some', '    stuff}}', '  baz=qux', '/>'].join('\n'),
      options: [{ 'mustache-open-end': 'last-attribute', 'element-open-end': 'new-line' }],
    },
    // Element with nested mustache and new-line close
    {
      code: ['<div', '  foo={{action', '    some', '    stuff', '  }}', '  baz=qux', '/>'].join(
        '\n'
      ),
      options: [{ 'mustache-open-end': 'new-line', 'element-open-end': 'new-line' }],
    },
    // Element with nested mustache, last-attribute for both
    {
      code: ['<div', '  foo={{action', '    some', '    stuff}}', '  baz=qux/>'].join('\n'),
      options: [{ 'mustache-open-end': 'last-attribute', 'element-open-end': 'last-attribute' }],
    },
    // Angle bracket invocation
    {
      code: [
        '<SiteHeader',
        '  @selected={{this.user.country}} as |Option|',
        '>{{#each this.availableCountries as |country|}}',
        '<Option @value={{country}}>{{country.name}}</Option>',
        '{{/each}}',
        '</SiteHeader>',
      ].join('\n'),
      options: [{ 'process-elements': true }],
    },
    // Non-block HTML with wrong indentation but process-elements is off
    {
      code: '<input\ndisabled\n>',
      options: [{ 'process-elements': false }],
    },
    // Block HTML element
    {
      code: '<a\n  disabled\n>abc\n</a>',
      options: [{ 'process-elements': true }],
    },
    // Block HTML element with last-attribute
    {
      code: '<a\n  disabled>\nabc\n</a>',
      options: [{ 'process-elements': true, 'element-open-end': 'last-attribute' }],
    },
    // Nested elements
    {
      code: ['<a', '  disabled', '>', '<span', '  class="abc"', '>spam me', '</span>', '</a>'].join(
        '\n'
      ),
      options: [{ 'process-elements': true }],
    },
    // Element with nested each block
    {
      code: [
        '<a',
        '  disabled',
        '>',
        '{{#each',
        '  class="abc"',
        '}}spam me',
        '{{/each}}',
        '</a>',
      ].join('\n'),
      options: [{ 'process-elements': true }],
    },

    // Element with inline mustache content after close
    {
      code: '<a\n  disabled\n>{{contact-details firstName lastName}}\n</a>',
      options: [{ 'process-elements': true }],
    },
    // Complex <a> with disabled={{if...}} and nested mustache children
    {
      code: [
        '<a',
        '  disabled={{if',
        '    true',
        '    (action "mostPowerfulAction" value=target.value)',
        '    (action "lessPowerfulAction" value=target.value)',
        '  }}',
        '>{{contact-details',
        '   firstName',
        '   lastName',
        ' }}',
        '</a>',
      ].join('\n'),
      options: [{ 'process-elements': true }],
    },
    // Complex <a> with disabled={{if...}} and block mustache
    {
      code: [
        '<a',
        '  disabled={{if',
        '    true',
        '    (action "mostPowerfulAction" value=target.value)',
        '    (action "lessPowerfulAction" value=target.value)',
        '  }}',
        '>{{#contact-details',
        '   firstName',
        '   lastName',
        ' }}{{foo}}{{/contact-details}}',
        '</a>',
      ].join('\n'),
      options: [{ 'process-elements': true }],
    },
    // Complex <a> with all last-attribute
    {
      code: [
        '<a',
        '  disabled={{if',
        '    true',
        '    (action "mostPowerfulAction" value=target.value)',
        '    (action "lessPowerfulAction" value=target.value)}}>',
        '{{#contact-details',
        '  firstName',
        '  lastName}}',
        ' {{foo}}{{/contact-details}}',
        '</a>',
      ].join('\n'),
      options: [
        {
          'process-elements': true,
          'element-open-end': 'last-attribute',
          'mustache-open-end': 'last-attribute',
        },
      ],
    },
    // Complex <a> with element-open-end:new-line, mustache-open-end:last-attribute
    {
      code: [
        '<a',
        '  disabled={{if',
        '    true',
        '    (action "mostPowerfulAction" value=target.value)',
        '    (action "lessPowerfulAction" value=target.value)}}',
        '>',
        '  {{#contact-details',
        '    firstName',
        '    lastName}}',
        '  {{foo}}',
        '  {{/contact-details}}',
        '</a>',
      ].join('\n'),
      options: [
        {
          'process-elements': true,
          'element-open-end': 'new-line',
          'mustache-open-end': 'last-attribute',
        },
      ],
    },
    // Complex <a> with element-open-end:last-attribute, mustache-open-end:new-line
    {
      code: [
        '<a',
        '  disabled={{if',
        '    true',
        '    (action "mostPowerfulAction" value=target.value)',
        '    (action "lessPowerfulAction" value=target.value)',
        '  }}>',
        '  {{#contact-details',
        '    firstName',
        '    lastName',
        '  }}',
        '   {{foo}}{{/contact-details}}',
        '</a>',
      ].join('\n'),
      options: [
        {
          'process-elements': true,
          'element-open-end': 'last-attribute',
          'mustache-open-end': 'new-line',
        },
      ],
    },

    // Self closing single line with process-elements
    {
      code: '<div disabled />',
      options: [{ 'process-elements': true }],
    },
    // Self closing multi line with process-elements
    {
      code: '<div\n  disabled\n/>',
      options: [{ 'process-elements': true }],
    },
    // Non-block input multi line with process-elements
    {
      code: '<input\n  disabled\n>',
      options: [{ 'process-elements': true }],
    },
    // Input with process-elements (single line)
    {
      code: '<input disabled>',
      options: [{ 'process-elements': true }],
    },
    // Input with action attribute
    {
      code: '<input\n  disabled={{action "mostPowerfulAction" value=target.value}}\n>',
      options: [{ 'process-elements': true }],
    },
    // Input with nested if in attribute
    {
      code: [
        '<input',
        '  disabled={{if',
        '    true',
        '    (action "mostPowerfulAction" value=target.value)',
        '    (action "lessPowerfulAction" value=target.value)',
        '  }}',
        '>',
      ].join('\n'),
      options: [{ 'process-elements': true }],
    },

    // SomeThing with @long-arg={{hash}} last-attribute
    {
      code: ['<SomeThing', '  @long-arg={{hash', '    foo="bar"}}', '/>'].join('\n'),
      options: [{ 'mustache-open-end': 'last-attribute' }],
    },
    // SomeThing with @long-arg={{hash}} new-line
    {
      code: ['<SomeThing', '  @long-arg={{hash', '    foo="bar"', '  }}', '/>'].join('\n'),
      options: [{ 'mustache-open-end': 'new-line' }],
    },
    // SomeThing with @long-arg and data-after-long-arg
    [
      '<SomeThing',
      '  @long-arg={{hash',
      '    foo="bar"',
      '  }}',
      '  data-after-long-arg={{true}}',
      '/>',
    ].join('\n'),

    // Form with element modifier
    [
      '<form',
      "  class='form-signin'",
      "  {{action 'authenticate' email password}}",
      '>',
      '</form>',
    ].join('\n'),

    // Triple stash
    ['<div>', '  {{{i18n', '    param=true', '    otherParam=false', '  }}}', '</div>'].join('\n'),

    // Empty block form short
    '{{#employee-details as |employee|}}{{employee.fullName}}{{/employee-details}}',
    // Block with just positional params
    {
      code: [
        '{{#employee-details',
        '  firstName',
        '  lastName',
        '  age',
        'as |employee|',
        '}}',
        '  {{employee.fullName}}',
        '{{/employee-details}}',
      ].join('\n'),
      options: [{ 'mustache-open-end': 'new-line' }],
    },
  ],

  invalid: [
    // Element with process-elements
    {
      code: '<input disabled\n>',
      output: null,
      options: [{ 'process-elements': true }],
      errors: [{ messageId: 'incorrectParamIndentation' }, { messageId: 'incorrectCloseBracket' }],
    },
    // Self closing element with process-elements
    {
      code: '<div disabled\n/>',
      output: null,
      options: [{ 'process-elements': true }],
      errors: [{ messageId: 'incorrectParamIndentation' }, { messageId: 'incorrectCloseBracket' }],
    },
    // Too long single-line input >80 chars with process-elements
    {
      code: '<input disabled type="text" value="abc" class="classy classic classist" id="input-now">',
      output: null,
      options: [{ 'process-elements': true }],
      errors: [
        { messageId: 'incorrectParamIndentation' },
        { messageId: 'incorrectParamIndentation' },
        { messageId: 'incorrectParamIndentation' },
        { messageId: 'incorrectParamIndentation' },
        { messageId: 'incorrectParamIndentation' },
        { messageId: 'incorrectCloseBracket' },
      ],
    },
    // Element with element-open-end: last-attribute but close on new line
    {
      code: '<input\n  foo=bar\n  baz=bar\n>',
      output: null,
      options: [{ 'element-open-end': 'last-attribute' }],
      errors: [{ messageId: 'incorrectCloseBracket' }],
    },
    // Element with element-open-end: new-line but close on last attribute
    {
      code: '<input\n  foo=bar\n  baz=qux>',
      output: null,
      options: [{ 'element-open-end': 'new-line' }],
      errors: [{ messageId: 'incorrectCloseBracket' }],
    },
    // Mustache with mustache-open-end: last-attribute but close on new line
    {
      code: [
        '{{my-component',
        '  foo=bar',
        '  baz=qux',
        '  my-attr=(component "my-other-component" data=(hash',
        '    foo=bar',
        '    foo=bar',
        '    baz=qux))',
        '}}',
      ].join('\n'),
      output: null,
      options: [{ 'mustache-open-end': 'last-attribute' }],
      errors: [{ messageId: 'incorrectCloseBrace' }],
    },
    // Mustache with mustache-open-end: new-line but close on last attribute
    {
      code: [
        '{{my-component',
        '  foo=bar',
        '  baz=qux',
        '  my-attr=(component "my-other-component" data=(hash',
        '    foo=bar',
        '    foo=bar',
        '    baz=qux))}}',
      ].join('\n'),
      output: null,
      options: [{ 'mustache-open-end': 'new-line' }],
      errors: [{ messageId: 'incorrectCloseBrace' }],
    },
    // Element close brace: mixed mustache-open-end + element-open-end
    {
      code: ['<div', '  foo={{action', '    some', '    stuff}}', '  baz=qux/>'].join('\n'),
      output: null,
      options: [{ 'mustache-open-end': 'new-line', 'element-open-end': 'new-line' }],
      errors: [{ messageId: 'incorrectCloseBrace' }, { messageId: 'incorrectCloseBracket' }],
    },
    // Element close brace: element-open-end: last-attribute but close on new line
    {
      code: ['<div', '  foo={{action', '    some', '    stuff', '  }}', '  baz=qux', '/>'].join(
        '\n'
      ),
      output: null,
      options: [{ 'mustache-open-end': 'last-attribute', 'element-open-end': 'last-attribute' }],
      errors: [{ messageId: 'incorrectCloseBrace' }, { messageId: 'incorrectCloseBracket' }],
    },
    // Incorrect attribute indentation on mustache
    {
      code: ['{{contact-details', 'firstName=firstName', '  lastName=lastName', '}}'].join('\n'),
      output: null,
      options: [{ 'mustache-open-end': 'new-line' }],
      errors: [{ messageId: 'incorrectParamIndentation' }],
    },
    // Block form attribute indentation wrong
    {
      code: ['{{#foo-bar', 'baz=true', '}}', '{{/foo-bar}}'].join('\n'),
      output: null,
      errors: [{ messageId: 'incorrectParamIndentation' }],
    },
    // Incorrect attribute indentation on element
    {
      code: '<div\nfoo=bar\n  baz=qux\n/>',
      output: null,
      options: [{ 'element-open-end': 'new-line' }],
      errors: [{ messageId: 'incorrectParamIndentation' }],
    },
    // Non-block form more than 30 characters
    {
      code: '{{contact-details firstName=firstName lastName=lastName}}',
      output: null,
      options: [{ 'open-invocation-max-len': 30 }],
      errors: [
        { messageId: 'incorrectParamIndentation' },
        { messageId: 'incorrectParamIndentation' },
        { messageId: 'incorrectCloseBrace' },
      ],
    },
    // Block form with wrong attr indent + block params + close brace
    {
      code: [
        '{{#contact-details',
        ' firstName=firstName lastName=lastName as |contact|}}',
        ' {{contact.fullName}}',
        '{{/contact-details}}',
      ].join('\n'),
      output: null,
      errors: [
        { messageId: 'incorrectParamIndentation' },
        { messageId: 'incorrectParamIndentation' },
        { messageId: 'incorrectBlockParamIndentation' },
        { messageId: 'incorrectCloseBrace' },
      ],
    },
    // Block form with close brace on wrong line
    {
      code: [
        '{{#contact-details',
        '  firstName=firstName',
        '  lastName=lastName',
        'as |fullName|}}',
        '  {{fullName}}',
        '{{/contact-details}}',
      ].join('\n'),
      output: null,
      errors: [{ messageId: 'incorrectCloseBrace' }],
    },
    // Block form > 80 chars with all on one line
    {
      code: [
        '{{#contact-details firstName=firstName lastName=lastName age=age avatar=avatar as |contact|}}',
        '  {{fullName}}',
        '{{/contact-details}}',
      ].join('\n'),
      output: null,
      errors: [
        { messageId: 'incorrectParamIndentation' },
        { messageId: 'incorrectParamIndentation' },
        { messageId: 'incorrectParamIndentation' },
        { messageId: 'incorrectParamIndentation' },
        { messageId: 'incorrectBlockParamIndentation' },
        { messageId: 'incorrectCloseBrace' },
      ],
    },
    // Block form with empty lines before block params
    {
      code: [
        '{{#contact-details',
        '',
        '',
        'as |contact|}}',
        '  {{contact.fullName}}',
        '{{/contact-details}}',
      ].join('\n'),
      output: null,
      errors: [
        { messageId: 'incorrectBlockParamIndentation' },
        { messageId: 'incorrectCloseBrace' },
      ],
    },
    // Helper > 80 chars
    {
      code: '{{if (or logout.isRunning (not session.isAuthenticated)) "Logging Out..." "Log Out"}}',
      output: null,
      options: [{ 'open-invocation-max-len': 80 }],
      errors: [
        { messageId: 'incorrectParamIndentation' },
        { messageId: 'incorrectParamIndentation' },
        { messageId: 'incorrectParamIndentation' },
        { messageId: 'incorrectCloseBrace' },
      ],
    },
    // Mixed element + mustache: new-line/new-line with wrong close positions
    {
      code: [
        '<div',
        '  class="classy">',
        '{{#contact-details',
        '  param0',
        '  param1=abc',
        '  param2=abc',
        'as |ab cd ef  cd ef |}}',
        '  {{contact.fullName}}',
        '{{/contact-details}}',
        '</div>',
      ].join('\n'),
      output: null,
      options: [{ 'mustache-open-end': 'new-line', 'element-open-end': 'new-line' }],
      errors: [{ messageId: 'incorrectCloseBracket' }, { messageId: 'incorrectCloseBrace' }],
    },
    // Mixed: last-attribute/last-attribute with wrong close positions
    {
      code: [
        '<div',
        '  class="classy"',
        '>',
        '{{#contact-details',
        '  param0',
        '  param1=abc',
        '  param2=abc',
        'as |ab cd ef  cd ef |',
        '}}',
        '  {{contact.fullName}}',
        '{{/contact-details}}',
        '</div>',
      ].join('\n'),
      output: null,
      options: [{ 'mustache-open-end': 'last-attribute', 'element-open-end': 'last-attribute' }],
      errors: [{ messageId: 'incorrectCloseBracket' }, { messageId: 'incorrectCloseBrace' }],
    },
    // Mixed: last-attribute/new-line with wrong close positions
    {
      code: [
        '<div',
        '  class="classy">',
        '{{#contact-details',
        '  param0',
        '  param1=abc',
        '  param2=abc',
        'as |ab cd ef  cd ef |',
        '}}',
        '  {{contact.fullName}}',
        '{{/contact-details}}',
        '</div>',
      ].join('\n'),
      output: null,
      options: [{ 'mustache-open-end': 'last-attribute', 'element-open-end': 'new-line' }],
      errors: [{ messageId: 'incorrectCloseBracket' }, { messageId: 'incorrectCloseBrace' }],
    },
    // Mixed: new-line/last-attribute with wrong close positions
    {
      code: [
        '<div',
        '  class="classy"',
        '>',
        '{{#contact-details',
        '  param0',
        '  param1=abc',
        '  param2=abc',
        'as |ab cd ef  cd ef |}}',
        '  {{contact.fullName}}',
        '{{/contact-details}}',
        '</div>',
      ].join('\n'),
      output: null,
      options: [{ 'mustache-open-end': 'new-line', 'element-open-end': 'last-attribute' }],
      errors: [{ messageId: 'incorrectCloseBracket' }, { messageId: 'incorrectCloseBrace' }],
    },
    // Close brace on wrong line in nested block
    {
      code: ['{{#foo bar as |foo|}}', '    {{foo.bar', '      baz}}{{/foo}}'].join('\n'),
      output: null,
      errors: [{ messageId: 'incorrectCloseBrace' }],
    },
  ],
});

// ---- GJS tests ----

gjsRuleTester.run('template-attribute-indentation', rule, {
  valid: [
    // Short invocation
    '<template>{{foo bar=baz}}</template>',
    // Multi-line with proper indentation
    {
      code: [
        '<template>',
        '{{contact-details',
        '  firstName=firstName',
        '  lastName=lastName',
        '}}',
        '</template>',
      ].join('\n'),
      options: [{ 'mustache-open-end': 'new-line' }],
    },
    // Element with proper indentation
    {
      code: ['<template>', '<div', '  foo=bar', '  baz=qux', '/>', '</template>'].join('\n'),
      options: [{ 'element-open-end': 'new-line' }],
    },
  ],
  invalid: [
    // Incorrect indentation in GJS
    {
      code: [
        '<template>',
        '{{contact-details',
        'firstName=firstName',
        '  lastName=lastName',
        '}}',
        '</template>',
      ].join('\n'),
      output: null,
      options: [{ 'mustache-open-end': 'new-line' }],
      errors: [
        {
          messageId: 'incorrectParamIndentation',
        },
      ],
    },
  ],
});
