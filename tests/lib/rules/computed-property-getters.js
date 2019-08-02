'use strict';

//------------------------------------------------------------------------------
// Requirements
//------------------------------------------------------------------------------

const rule = require('../../../lib/rules/computed-property-getters');
const RuleTester = require('eslint').RuleTester;

//------------------------------------------------------------------------------
// Tests
//------------------------------------------------------------------------------

const { ERROR_MESSAGE } = rule;
const ruleTester = new RuleTester();
const parserOptions = { ecmaVersion: 2018, sourceType: 'module' };
const errors = [
  {
    message: ERROR_MESSAGE,
  },
];
const output = null;

const codeWithoutGettersOrSetters = [
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
    }`,
];

const codeWithOnlyGetters = [
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
    }`,
];

const codeWithOnlySetters = [
  `{
      foo: computed({
        set() {
          return true;
        }
      }).readonly()
    }`,
  `{
      foo: computed({
        set() {
          return true;
        }
      })
    }`,
  `{
      foo: computed('model.foo', {
        set() {
          return true;
        }
      }).readonly()
    }`,
  `{
      foo: computed('model.foo', {
        set() {
          return true;
        }
      })
    }`,
  `{
      foo: computed('model.foo', {
        set() {}
      })
    }`,
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
    }`,
];

const validWithDefaultOptions = [];
validWithDefaultOptions.push(...codeWithoutGettersOrSetters.map(code => ({ code, parserOptions })));
validWithDefaultOptions.push(...codeWithSettersAndGetters.map(code => ({ code, parserOptions })));

const validWithAlwaysWithSetterOptions = [];
validWithAlwaysWithSetterOptions.push(
  ...codeWithoutGettersOrSetters.map(code => {
    const options = ['always-with-setter'];
    return { code, parserOptions, options };
  })
);
validWithAlwaysWithSetterOptions.push(
  ...codeWithSettersAndGetters.map(code => {
    const options = ['always-with-setter'];
    return { code, parserOptions, options };
  })
);

const validWithNeverOption = codeWithoutGettersOrSetters.map(code => {
  const options = ['never'];
  return { code, parserOptions, options };
});

const validWithAlwaysOption = [];
validWithAlwaysOption.push(
  ...codeWithOnlyGetters.map(code => {
    const options = ['always'];
    return { code, parserOptions, options };
  })
);
validWithAlwaysOption.push(
  ...codeWithSettersAndGetters.map(code => {
    const options = ['always'];
    return { code, parserOptions, options };
  })
);

const inValidWithDefaultOptions = [];
inValidWithDefaultOptions.push(
  ...codeWithOnlyGetters.map(code => ({ code, parserOptions, output, errors }))
);
inValidWithDefaultOptions.push(
  ...codeWithOnlySetters.map(code => ({ code, parserOptions, output, errors }))
);

const inValidWithNeverOption = [];
inValidWithNeverOption.push(
  ...codeWithOnlyGetters.map(code => {
    const options = ['never'];
    return { code, parserOptions, options, output, errors };
  })
);
inValidWithNeverOption.push(
  ...codeWithOnlySetters.map(code => {
    const options = ['never'];
    return { code, parserOptions, options, output, errors };
  })
);
inValidWithNeverOption.push(
  ...codeWithSettersAndGetters.map(code => {
    const options = ['never'];
    return { code, parserOptions, options, output, errors };
  })
);

const inValidWithAlwaysOption = [];
inValidWithAlwaysOption.push(
  ...codeWithoutGettersOrSetters.map(code => {
    const options = ['always'];
    return { code, parserOptions, options, output, errors };
  })
);
inValidWithAlwaysOption.push(
  ...codeWithOnlySetters.map(code => {
    const options = ['always'];
    return { code, parserOptions, options, output, errors };
  })
);

ruleTester.run('computed-property-getters', rule, {
  valid: [
    ...validWithDefaultOptions,
    ...validWithAlwaysWithSetterOptions,
    ...validWithNeverOption,
    ...validWithAlwaysOption,
  ],
  invalid: [...inValidWithDefaultOptions, ...inValidWithNeverOption, ...inValidWithAlwaysOption],
});
