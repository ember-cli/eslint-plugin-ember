'use strict';

//------------------------------------------------------------------------------
// Requirements
//------------------------------------------------------------------------------

const rule = require('../../../lib/rules/computed-property-getters');
const RuleTester = require('eslint').RuleTester;

//------------------------------------------------------------------------------
// Tests
//------------------------------------------------------------------------------

const { PREVENT_GETTER_MESSAGE, ALWAYS_GETTER_MESSAGE, ALWAYS_WITH_SETTER_MESSAGE } = rule;
const ruleTester = new RuleTester();
const parserOptions = { ecmaVersion: 2018, sourceType: 'module' };
const output = null;

const alwaysWithSetterOptionErrors = [
  {
    message: ALWAYS_WITH_SETTER_MESSAGE,
  },
];

const neverOptionErrors = [
  {
    message: PREVENT_GETTER_MESSAGE,
  },
];

const alwaysOptionErrors = [
  {
    message: ALWAYS_GETTER_MESSAGE,
  },
];

const codeWithRawComputed = [
  `
  {
    foo: computed('model')
  }`,
  `
  {
    foo: computed()
  }`,
  `
  {
    foo: computed
  }`,
];

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
validWithAlwaysWithSetterOptions.push(
  ...codeWithRawComputed.map(code => {
    const options = ['always-with-setter'];
    return { code, parserOptions, options };
  })
);

const validWithNeverOption = [];
validWithNeverOption.push(
  ...codeWithoutGettersOrSetters.map(code => {
    const options = ['never'];
    return { code, parserOptions, options };
  })
);
validWithNeverOption.push(
  ...codeWithRawComputed.map(code => {
    const options = ['never'];
    return { code, parserOptions, options };
  })
);

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
validWithAlwaysOption.push(
  ...codeWithRawComputed.map(code => {
    const options = ['always'];
    return { code, parserOptions, options };
  })
);

const inValidWithDefaultOptions = [];
inValidWithDefaultOptions.push(
  ...codeWithOnlyGetters.map(code => ({
    code,
    parserOptions,
    output,
    errors: alwaysWithSetterOptionErrors,
  }))
);
inValidWithDefaultOptions.push(
  ...codeWithOnlySetters.map(code => ({
    code,
    parserOptions,
    output,
    errors: alwaysWithSetterOptionErrors,
  }))
);

const inValidWithNeverOption = [];
inValidWithNeverOption.push(
  ...codeWithOnlyGetters.map(code => {
    const options = ['never'];
    return { code, parserOptions, options, output, errors: neverOptionErrors };
  })
);
inValidWithNeverOption.push(
  ...codeWithOnlySetters.map(code => {
    const options = ['never'];
    return { code, parserOptions, options, output, errors: neverOptionErrors };
  })
);
inValidWithNeverOption.push(
  ...codeWithSettersAndGetters.map(code => {
    const options = ['never'];
    return { code, parserOptions, options, output, errors: neverOptionErrors };
  })
);

const inValidWithAlwaysOption = [];
inValidWithAlwaysOption.push(
  ...codeWithoutGettersOrSetters.map(code => {
    const options = ['always'];
    return { code, parserOptions, options, output, errors: alwaysOptionErrors };
  })
);
inValidWithAlwaysOption.push(
  ...codeWithOnlySetters.map(code => {
    const options = ['always'];
    return { code, parserOptions, options, output, errors: alwaysOptionErrors };
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
