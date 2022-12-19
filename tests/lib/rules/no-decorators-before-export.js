const rule = require('../../../lib/rules/no-decorators-before-export');
const RuleTester = require('eslint').RuleTester;

const eslintTester = new RuleTester({
  parser: require.resolve('@babel/eslint-parser'),
  parserOptions: {
    ecmaVersion: 2022,
    sourceType: 'module',
    requireConfigFile: false,
    babelOptions: {
      babelrc: false,
      plugins: [['@babel/plugin-proposal-decorators', { decoratorsBeforeExport: true }]],
    },
  },
});

eslintTester.run('no-decorators-before-export', rule, {
  valid: [
    'export default class {}',
    'export default class Foo {}',
    'class Foo {}\nexport default Foo;',
    'export class Foo {}',
    'class Foo {}\nexport { Foo };',
    "import classic from 'ember-classic-decorators';\n@classic\nclass Foo {}\nexport { Foo };",
    "import classic from 'ember-classic-decorators';\n@classic\nclass Foo {}\nexport default Foo;",
  ],
  invalid: [
    // basic
    {
      code: "import classic from 'ember-classic-decorators';\n@classic\nexport class Foo {}",
      output:
        "import classic from 'ember-classic-decorators';\n@classic\nclass Foo {}\nexport { Foo };\n",
      errors: [
        'Usage of class decorator on the export Foo must occur prior to exporting the class.',
      ],
    },
    {
      code: "import classic from 'ember-classic-decorators';\n@classic\nexport default class Foo {}",
      output:
        "import classic from 'ember-classic-decorators';\n@classic\nclass Foo {}\nexport default Foo;\n",
      errors: [
        'Usage of class decorator on the default export Foo must occur prior to exporting the class.',
      ],
    },
    {
      code: "import classic from 'ember-classic-decorators';\n@classic\nexport default class {}",
      output: null,
      errors: [
        'Usage of class decorator on the un-named default export must occur prior to exporting the class.',
      ],
    },
    // ensure interop
    {
      code: "import classic from 'ember-classic-decorators';\n@classic\nexport class Foo {\n  someProp = false;\n}\nexport class Bar {};\n",
      output:
        "import classic from 'ember-classic-decorators';\n@classic\nclass Foo {\n  someProp = false;\n}\nexport { Foo };\n\nexport class Bar {};\n",
      errors: [
        'Usage of class decorator on the export Foo must occur prior to exporting the class.',
      ],
    },
    {
      code: "import classic from 'ember-classic-decorators';\n@classic\nexport default class Foo {\n  someProp = false;\n}\nexport class Bar {};\n",
      output:
        "import classic from 'ember-classic-decorators';\n@classic\nclass Foo {\n  someProp = false;\n}\nexport default Foo;\n\nexport class Bar {};\n",
      errors: [
        'Usage of class decorator on the default export Foo must occur prior to exporting the class.',
      ],
    },
  ],
});
