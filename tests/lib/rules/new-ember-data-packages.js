'use strict';

//------------------------------------------------------------------------------
// Requirements
//------------------------------------------------------------------------------

const rule = require('../../../lib/rules/new-ember-data-packages');
const RuleTester = require('eslint').RuleTester;
const parserOptions = { ecmaVersion: 6, sourceType: 'module' };

//------------------------------------------------------------------------------
// Tests
//------------------------------------------------------------------------------

const ruleTester = new RuleTester();
ruleTester.run('new-ember-data-packages', rule, {
  valid: [
    {
      code: `import Model from '@ember-data/model';`,
      parserOptions,
    },
    {
      code: `import Model, { attr } from '@ember-data';

        export default Model.extend({
          name: attr('string')
        });
      `,
      parserOptions,
    },
  ],

  invalid: [
    {
      code: `import DS from 'ember-data';

        export default DS.Model.extend({
        });
      `,
      parserOptions,
      errors: [
        {
          message:
            'Imports from new @ember-data packages should be prefered over imports from ember-data',
          type: 'ImportDeclaration',
        },
        {
          message: "Use `import Model from '@ember-data/model';` instead of using DS.Model",
          type: 'Identifier',
        },
      ],
    },
    {
      code: `import DS, { Model } from 'ember-data';

        export default Model.extend({
          name: DS.attr('string')
        });
      `,
      parserOptions,
      errors: [
        {
          message:
            'Imports from new @ember-data packages should be prefered over imports from ember-data',
          type: 'ImportDeclaration',
        },
        {
          message: "Use `import { attr } from '@ember-data/model';` instead of using DS.attr",
          type: 'Identifier',
        },
      ],
    },
    {
      code: `import DS from 'ember-data';
        const { Model } = DS;

        export default Model.extend({
          name: DS.attr('string')
        });
      `,
      parserOptions,
      errors: [
        {
          message:
            'Imports from new @ember-data packages should be prefered over imports from ember-data',
          type: 'ImportDeclaration',
        },
        {
          message: "Use `import Model from '@ember-data/model';` instead of using DS destructuring",
          type: 'Property',
        },
        {
          message: "Use `import { attr } from '@ember-data/model';` instead of using DS.attr",
          type: 'Identifier',
        },
      ],
    },
    {
      code: `import Model from 'ember-data/model';

        export default Model.extend({
        });
      `,
      parserOptions,
      errors: [
        {
          message:
            'Imports from new @ember-data packages should be prefered over imports from ember-data',
          type: 'ImportDeclaration',
        },
      ],
    },
    {
      code: `import Model from 'ember-data/model';
        import attr  from 'ember-data/attr';

        export default Model.extend({
          name: attr('string')
        });
      `,
      parserOptions,
      errors: [
        {
          message:
            'Imports from new @ember-data packages should be prefered over imports from ember-data',
          type: 'ImportDeclaration',
        },
        {
          message:
            'Imports from new @ember-data packages should be prefered over imports from ember-data',
          type: 'ImportDeclaration',
        },
      ],
    },
    {
      code: `import Model from '@ember-data/model';
        import attr from 'ember-data/attr';

        export default Model.extend({
          name: attr('string')
        });
      `,
      parserOptions,
      errors: [
        {
          message:
            'Imports from new @ember-data packages should be prefered over imports from ember-data',
          type: 'ImportDeclaration',
        },
      ],
    },
    {
      code: `import Model from '@ember-data/model';
        import namedAttr from 'ember-data/attr';

        export default Model.extend({
          name: attr('string')
        });
      `,
      parserOptions,
      errors: [
        {
          message:
            'Imports from new @ember-data packages should be prefered over imports from ember-data',
          type: 'ImportDeclaration',
        },
      ],
    },
    {
      code: `import { Model } from 'ember-data';

        export default Model.extend({
        });
      `,
      parserOptions,
      errors: [
        {
          message:
            'Imports from new @ember-data packages should be prefered over imports from ember-data',
          type: 'ImportDeclaration',
        },
      ],
    },
  ],
});
