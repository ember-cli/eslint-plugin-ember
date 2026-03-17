// ------------------------------------------------------------------------------
// Requirements
// ------------------------------------------------------------------------------

const rule = require('../../../lib/rules/no-empty-attrs');
const RuleTester = require('eslint').RuleTester;

// ------------------------------------------------------------------------------
// Tests
// ------------------------------------------------------------------------------

const eslintTester = new RuleTester({
  parser: require.resolve('@babel/eslint-parser'),
  parserOptions: {
    ecmaVersion: 2022,
    sourceType: 'module',
    babelOptions: {
      configFile: require.resolve('../../../.babelrc'),
    },
  },
});

const message = 'Supply proper attribute type';

eslintTester.run('no-empty-attrs', rule, {
  valid: [
    'export default Model.extend();',
    'export default Model.extend({name: attr("string"), points: attr("number"), dob: attr("date")});',
    'export default Model.extend({name: attr("string")});',
    {
      code: `someArrayOfStrings.filter(function(attr) {
        return attr.underscore();
      });`,
      parserOptions: { ecmaVersion: 2022 },
    },
    `export default Model.extend({
        someArray: someArrayOfStrings.filter(function(attr) {
          return attr.underscore();
        }),
      });`,
    `import Model, { attr } from '@ember-data/model';
      export default class UserModel extends Model {
        @attr('string') name;
      }`,
  ],
  invalid: [
    {
      code: `export default Model.extend({
        name: attr(),
        points: attr("number"),
        dob: attr("date")
      });`,
      output: null,
      errors: [{ message, line: 2 }],
    },
    {
      // With object variable.
      code: 'const body = {name: attr()}; export default Model.extend(body);',
      output: null,
      errors: [{ message, line: 1 }],
    },
    {
      code: `export default Model.extend({
        name: attr("string"),
        points: attr("number"),
        dob: attr()
      });`,
      output: null,
      errors: [{ message, line: 4 }],
    },
    {
      code: `export default Model.extend({
        name: attr("string"),
        points: attr(),
        dob: attr("date")
      });`,
      output: null,
      errors: [{ message, line: 3 }],
    },
    {
      code: `export default Model.extend({
        name: attr("string"),
        points: attr(),
        dob: attr(),
        someComputedProperty: computed.bool(true)
      });`,
      output: null,
      errors: [
        { message, line: 3 },
        { message, line: 4 },
      ],
    },
    {
      code: `export default Model.extend({
        name: attr(),
        points: attr(),
        dob: attr()
      });`,
      output: null,
      errors: [
        { message, line: 2 },
        { message, line: 3 },
        { message, line: 4 },
      ],
    },
    {
      filename: 'example-app/models/some-model.js',
      code: 'export default CustomModel.extend({name: attr()});',
      output: null,
      errors: [{ message, line: 1 }],
    },
    {
      code: `import Model, { attr } from '@ember-data/model';
        export default class UserModel extends Model {
          @attr() name;
        }`,
      output: null,
      errors: [{ message, line: 3 }],
    },
    {
      code: `import Model, { attr } from '@ember-data/model';
        export default class UserModel extends Model {
          @attr name;
        }`,
      output: null,
      errors: [{ message, line: 3 }],
    },
    {
      code: `import Model, { attr } from '@ember-data/model';
        export default (class UserModel extends Model {
          @attr name;
        });`,
      output: null,
      errors: [{ message, line: 3 }],
    },
  ],
});
