'use strict';

const rule = require('../../../lib/rules/no-restricted-property-modifications');
const RuleTester = require('eslint').RuleTester;

const ruleTester = new RuleTester({
  parserOptions: {
    ecmaVersion: 2020,
    sourceType: 'module',
  },
});

ruleTester.run('no-restricted-property-modifications', rule, {
  valid: [
    // ****************************************
    // Test cases for computed property macros.
    // ****************************************

    // readOnly
    {
      code: "import {readOnly} from '@ember/object/computed'; readOnly('currentUser')",
      options: [{ properties: ['currentUser'] }],
    },
    {
      code: "import {readOnly} from '@ember/object/computed'; readOnly('currentUser.isUS')",
      options: [{ properties: ['currentUser'] }],
    },
    {
      code: "import {computed} from '@ember/object'; computed.readOnly('currentUser.isUS')",
      options: [{ properties: ['currentUser'] }],
    },

    // alias
    {
      code: "import {alias} from '@ember/object/computed'; alias('myProperty')",
      options: [{ properties: ['currentUser'] }],
    },
    {
      code: "import {alias} from '@ember/object/computed'; alias('myProperty.otherThing')",
      options: [{ properties: ['currentUser'] }],
    },
    {
      code: "import {computed} from '@ember/object'; computed.alias('myProperty')",
      options: [{ properties: ['currentUser'] }],
    },

    // reads
    {
      code: "import {reads} from '@ember/object/computed'; reads('myProperty')",
      options: [{ properties: ['currentUser'] }],
    },
    {
      code: "import {reads} from '@ember/object/computed'; reads('myProperty.otherThing')",
      options: [{ properties: ['currentUser'] }],
    },
    {
      code: "import {computed} from '@ember/object'; computed.reads('myProperty')",
      options: [{ properties: ['currentUser'] }],
    },

    // Without import
    {
      code: "alias('currentUser')",
      options: [{ properties: ['currentUser'] }],
    },
    {
      code: "reads('currentUser')",
      options: [{ properties: ['currentUser'] }],
    },
    {
      code: "computed.alias('currentUser')",
      options: [{ properties: ['currentUser'] }],
    },
    {
      code: "computed.reads('currentUser')",
      options: [{ properties: ['currentUser'] }],
    },
    {
      code: "import {computed} from 'wrong-import'; computed.reads('currentUser')",
      options: [{ properties: ['currentUser'] }],
    },
    {
      code: "import {reads} from '@ember/object/computed'; computed.reads('currentUser')",
      options: [{ properties: ['currentUser'] }],
    },

    // ****************************************
    // Test cases for this.set(...);
    // ****************************************
    {
      code: "this.get('currentUser.somePermission')",
      options: [{ properties: ['currentUser'] }],
    },
    {
      code: "something.set('currentUser.somePermission', true)",
      options: [{ properties: ['currentUser'] }],
    },
    {
      code: "this.set('someProperty.somePermission', true)",
      options: [{ properties: ['currentUser'] }],
    },
    {
      code: "this.set('someProperty.currentUser', true)",
      options: [{ properties: ['currentUser'] }],
    },
    {
      code: "this.set('currentUserWithLongerName.somePermission', true)",
      options: [{ properties: ['currentUser'] }],
    },

    // ****************************************
    // Test cases for assignment
    // ****************************************
    {
      code: 'this.foo = 123;',
      options: [{ properties: ['currentUser'] }],
    },
    {
      code: 'this.foo.bar = 123;',
      options: [{ properties: ['currentUser'] }],
    },
    {
      code: 'this.foo.currentUser = 123;',
      options: [{ properties: ['currentUser'] }],
    },
    {
      code: 'currentUser = 123;',
      options: [{ properties: ['currentUser'] }],
    },
    {
      code: 'const currentUser = 123;',
      options: [{ properties: ['currentUser'] }],
    },
  ],
  invalid: [
    // ****************************************
    // Test cases for computed property macros.
    // ****************************************
    {
      code: "import {alias} from '@ember/object/computed'; alias('currentUser')",
      options: [{ properties: ['currentUser'] }],
      output: "import {alias} from '@ember/object/computed'; readOnly('currentUser')",
      errors: [{ messageId: 'useReadOnlyMacro', type: 'CallExpression' }],
    },
    {
      code: "import {alias} from '@ember/object/computed'; alias('currentUser.isUS')",
      options: [{ properties: ['currentUser'] }],
      output: "import {alias} from '@ember/object/computed'; readOnly('currentUser.isUS')",
      errors: [{ messageId: 'useReadOnlyMacro', type: 'CallExpression' }],
    },
    {
      code: "import {computed} from '@ember/object'; computed.alias('currentUser')",
      options: [{ properties: ['currentUser'] }],
      output: "import {computed} from '@ember/object'; computed.readOnly('currentUser')",
      errors: [{ messageId: 'useReadOnlyMacro', type: 'CallExpression' }],
    },
    {
      code: "import {reads} from '@ember/object/computed'; reads('currentUser')",
      options: [{ properties: ['currentUser'] }],
      output: "import {reads} from '@ember/object/computed'; readOnly('currentUser')",
      errors: [{ messageId: 'useReadOnlyMacro', type: 'CallExpression' }],
    },
    {
      code: "import {reads} from '@ember/object/computed'; reads('currentUser.isUS')",
      options: [{ properties: ['currentUser'] }],
      output: "import {reads} from '@ember/object/computed'; readOnly('currentUser.isUS')",
      errors: [{ messageId: 'useReadOnlyMacro', type: 'CallExpression' }],
    },
    {
      code: "import {computed} from '@ember/object'; computed.reads('currentUser')",
      options: [{ properties: ['currentUser'] }],
      output: "import {computed} from '@ember/object'; computed.readOnly('currentUser')",
      errors: [{ messageId: 'useReadOnlyMacro', type: 'CallExpression' }],
    },

    // ****************************************
    // Test cases for this.set(...);
    // ****************************************
    {
      code: "this.set('currentUser', {})",
      options: [{ properties: ['currentUser'] }],
      output: null,
      errors: [{ messageId: 'doNotUseSet', type: 'CallExpression' }],
    },
    {
      code: "this.set('currentUser.somePermission', true)",
      options: [{ properties: ['currentUser'] }],
      output: null,
      errors: [{ messageId: 'doNotUseSet', type: 'CallExpression' }],
    },

    // ****************************************
    // Test cases for assignment
    // ****************************************
    {
      code: 'this.currentUser = {};',
      options: [{ properties: ['currentUser'] }],
      output: null,
      errors: [{ messageId: 'doNotUseAssignment', type: 'AssignmentExpression' }],
    },
    {
      code: 'this.currentUser.foo = true;',
      options: [{ properties: ['currentUser'] }],
      output: null,
      errors: [{ messageId: 'doNotUseAssignment', type: 'AssignmentExpression' }],
    },
  ],
});
