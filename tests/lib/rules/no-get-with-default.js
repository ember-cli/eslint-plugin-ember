const rule = require('../../../lib/rules/no-get-with-default');
const RuleTester = require('eslint').RuleTester;

const { ERROR_MESSAGE } = rule;
const ruleTester = new RuleTester({
  parserOptions: {
    ecmaVersion: 2015,
    sourceType: 'module',
  },
});

ruleTester.run('no-get-with-default', rule, {
  valid: [
    // get
    "this.get('key') || [];",
    "import { get } from '@ember/object'; get(this, 'target') || [];",

    // getWithDefault
    "testClass.getWithDefault('key', [])",
    "import { getWithDefault } from '@ember/object'; getWithDefault.testMethod(testClass, 'key', [])",
    "getWithDefault(this, 'key', []);", // Missing import

    // With catchSafeObjects: false
    {
      code: "import { getWithDefault } from '@ember/object'; getProperties('person', 'name', '');",
      options: [{ catchSafeObjects: false }],
    },

    // With catchUnsafeObjects: false
    "person.getWithDefault('name', '');",
    {
      code: "person.getWithDefault('name', '');",
      options: [{ catchUnsafeObjects: false }],
    },
  ],
  invalid: [
    // this.getWithDefault
    {
      code: "const test = this.getWithDefault('key', []);", // With a string property.
      output: "const test = (this.get('key') === undefined ? [] : this.get('key'));",
      errors: [
        {
          message: ERROR_MESSAGE,
          type: 'CallExpression',
        },
      ],
    },
    {
      code: 'const test = this.getWithDefault(SOME_VARIABLE, []);', // With a variable property.
      output:
        'const test = (this.get(SOME_VARIABLE) === undefined ? [] : this.get(SOME_VARIABLE));',
      errors: [
        {
          message: ERROR_MESSAGE,
          type: 'CallExpression',
        },
      ],
    },
    {
      // Having parenthesis around the autofix matters in this example.
      code: "this.getWithDefault('name', '').trim()",
      output: "(this.get('name') === undefined ? '' : this.get('name')).trim()",
      errors: [
        {
          message: ERROR_MESSAGE,
          type: 'CallExpression',
        },
      ],
    },

    // getWithDefault (imported)
    {
      code: "import { getWithDefault } from '@ember/object'; getWithDefault(this, 'key', []);", // With a string property.
      output: `import { get } from '@ember/object';
import { getWithDefault } from '@ember/object'; (get(this, 'key') === undefined ? [] : get(this, 'key'));`,
      errors: [
        {
          message: ERROR_MESSAGE,
          type: 'CallExpression',
        },
      ],
    },
    {
      // With renamed `getWithDefault` import:
      code: "import { getWithDefault as gwd } from '@ember/object'; gwd(this, 'key', []);",
      output: `import { get } from '@ember/object';
import { getWithDefault as gwd } from '@ember/object'; (get(this, 'key') === undefined ? [] : get(this, 'key'));`,
      errors: [
        {
          message: ERROR_MESSAGE,
          type: 'CallExpression',
        },
      ],
    },
    {
      // With existing and renamed `get` import:
      code:
        "import { getWithDefault, get as g } from '@ember/object'; getWithDefault(this, 'key', []);",
      output:
        "import { getWithDefault, get as g } from '@ember/object'; (g(this, 'key') === undefined ? [] : g(this, 'key'));",
      errors: [
        {
          message: ERROR_MESSAGE,
          type: 'CallExpression',
        },
      ],
    },
    {
      code:
        "import { getWithDefault } from '@ember/object'; getWithDefault(this, SOME_VARIABLE, []);", // With a variable property.
      output: `import { get } from '@ember/object';
import { getWithDefault } from '@ember/object'; (get(this, SOME_VARIABLE) === undefined ? [] : get(this, SOME_VARIABLE));`,
      errors: [
        {
          message: ERROR_MESSAGE,
          type: 'CallExpression',
        },
      ],
    },
    {
      // Having parenthesis around the autofix matters in this example.
      code:
        "import { getWithDefault } from '@ember/object'; getWithDefault(this, 'name', '').trim()",
      output: `import { get } from '@ember/object';
import { getWithDefault } from '@ember/object'; (get(this, 'name') === undefined ? '' : get(this, 'name')).trim()`,
      errors: [
        {
          message: ERROR_MESSAGE,
          type: 'CallExpression',
        },
      ],
    },

    // With catchSafeObjects: true
    {
      code: "import { getWithDefault } from '@ember/object'; getWithDefault(person, 'name', '');",
      output: `import { get } from '@ember/object';
import { getWithDefault } from '@ember/object'; (get(person, 'name') === undefined ? '' : get(person, 'name'));`,
      errors: [{ message: ERROR_MESSAGE, type: 'CallExpression' }],
    },
    {
      code: "import { getWithDefault } from '@ember/object'; getWithDefault(person, 'name', '');",
      options: [{ catchSafeObjects: true }],
      output: `import { get } from '@ember/object';
import { getWithDefault } from '@ember/object'; (get(person, 'name') === undefined ? '' : get(person, 'name'));`,
      errors: [
        {
          message: ERROR_MESSAGE,
          type: 'CallExpression',
        },
      ],
    },

    // With catchUnsafeObjects: true
    {
      code: "person.getWithDefault('name', '');",
      options: [{ catchUnsafeObjects: true }],
      output: "(person.get('name') === undefined ? '' : person.get('name'));",
      errors: [
        {
          message: ERROR_MESSAGE,
          type: 'CallExpression',
        },
      ],
    },
  ],
});
