'use strict';

//------------------------------------------------------------------------------
// Requirements
//------------------------------------------------------------------------------

const rule = require('../../../lib/rules/computed-property-getters');
const RuleTester = require('eslint').RuleTester;


//------------------------------------------------------------------------------
// Tests
//------------------------------------------------------------------------------

const ruleTester = new RuleTester();
const parserOptions = { ecmaVersion: 2018, sourceType: 'module' };

const codeWithoutGetters = [
  `
  {
    foo: computed('model', function() {})
  }`,
  `{
      foo: computed('model', function() {}).volatile()
    }`,
  `{
      foo: computed(function() {})
    }`,
  `{
      foo: computed(async function() {})
    }`,
  `{
      foo: computed('model', async function() {})
    }`
];

const codeWithGetters = [
  `{
      foo: computed({
        get() {
          return true;
        }
      }).readonly()
    }`,
  `{
      foo: computed({
        get() {
          return true;
        }
      })
    }`,
  `{
      foo: computed('model.foo', {
        get() {
          return true;
        }
      }).readonly()
    }`,
  `{
      foo: computed('model.foo', {
        get() {
          return true;
        }
      })
    }`,
  `{
      foo: computed('model.foo', {
        get() {}
      })
    }`
];

const codeWithSettersAndGetters = [
  `{
      foo: computed({
        get() {
          return true;
        },
        set() {
          return true;
        }
      }).readonly()
    }`,
  `{
      foo: computed({
        get() {
          return true;
        },
        set() {
          return true;
        }
      })
    }`,
  `{
      foo: computed('model.foo', {
        get() {
          return true;
        },
        set() {
          return true;
        }
      }).readonly()
    }`,
  `{
      foo: computed('model.foo', {
        get() {
          return true;
        },
        set() {
          return true;
        }
      })
    }`,
  `{
      foo: computed('model.foo', {
        get() {},
        set() {},
      })
    }`
];


const validWithDefaultOptions = [];
validWithDefaultOptions.push(...codeWithoutGetters.map(code => ({ code, parserOptions })));
validWithDefaultOptions.push(...codeWithSettersAndGetters.map(code => ({ code, parserOptions })));

const validWithAlwaysWithSetterOptions = [];
validWithAlwaysWithSetterOptions.push(...codeWithoutGetters.map((code) => {
  const options = ['always-with-setter'];
  return { code, parserOptions, options };
}));
validWithAlwaysWithSetterOptions.push(...codeWithSettersAndGetters.map((code) => {
  const options = ['always-with-setter'];
  return { code, parserOptions, options };
}));

const validWithNeverOption = codeWithoutGetters.map((code) => {
  const options = ['never'];
  return { code, parserOptions, options };
});

const validWithAlwaysOption = codeWithGetters.map((code) => {
  const options = ['always'];
  return { code, parserOptions, options };
});

const inValidWithDefaultOptions = codeWithGetters.map(code => (
  {
    code,
    parserOptions,
    output: null,
    errors: [{
      message: rule.meta.message,
    }]
  }
));

const inValidWithNeverOption = codeWithGetters.map((code) => {
  const options = ['never'];
  return {
    code,
    parserOptions,
    options,
    output: null,
    errors: [{
      message: rule.meta.message,
    }]
  };
});

const inValidWithAlwaysOption = codeWithoutGetters.map((code) => {
  const options = ['always'];
  return {
    code,
    parserOptions,
    options,
    output: null,
    errors: [{
      message: rule.meta.message,
    }]
  };
});

ruleTester.run('computed-property-getters', rule, {
  valid: [
    ...validWithDefaultOptions,
    ...validWithAlwaysWithSetterOptions,
    ...validWithNeverOption,
    ...validWithAlwaysOption
  ],
  invalid: [...inValidWithDefaultOptions, ...inValidWithNeverOption, ...inValidWithAlwaysOption],
});
