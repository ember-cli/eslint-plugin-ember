'use strict';

//------------------------------------------------------------------------------
// Requirements
//------------------------------------------------------------------------------

const rule = require('../../../lib/rules/use-ember-data-rfc-395-imports');
const RuleTester = require('eslint').RuleTester;

const parserOptions = { ecmaVersion: 6, sourceType: 'module' };

const { ERROR_MESSAGE: message } = rule;

//------------------------------------------------------------------------------
// Tests
//------------------------------------------------------------------------------

const ruleTester = new RuleTester({ parserOptions });
ruleTester.run('use-ember-data-rfc-395-imports', rule, {
  valid: [
    "import Model from '@ember-data/model';",
    `import Model, { attr } from '@ember-data';

     export default Model.extend({
       name: attr('string')
     });
    `,
    `import LOL from 'who-knows-but-definitely-not-ember-data';
     import Fragment from 'ember-data-model-fragments/fragment';

     const { Model } = LOL;
    `,
    `import Model from '@ember-data/model';

     export default Model.extend({
       name: SomethingRandom.DS('string')
     });
    `,
  ],

  invalid: [
    {
      code: `import DS from 'ember-data';

        export default DS.Model.extend({
        });
      `,
      errors: [
        {
          message,
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
      errors: [
        {
          message,
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
        const { Model, attr } = DS;

        export default Model.extend({
          name: attr('string')
        });
      `,
      errors: [
        {
          message,
          type: 'ImportDeclaration',
        },
        {
          message: "Use `import Model from '@ember-data/model';` instead of using DS destructuring",
          type: 'Property',
        },
        {
          message:
            "Use `import { attr } from '@ember-data/model';` instead of using DS destructuring",
          type: 'Property',
        },
      ],
    },
    {
      code: `import Model from 'ember-data/model';

        export default Model.extend({
        });
      `,
      errors: [
        {
          message,
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
      errors: [
        {
          message,
          type: 'ImportDeclaration',
        },
        {
          message,
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
      errors: [
        {
          message,
          type: 'ImportDeclaration',
        },
      ],
    },
    {
      code: `import Model from '@ember-data/model';
        import namedAttr from 'ember-data/attr';

        export default Model.extend({
          name: namedAttr('string')
        });
      `,
      errors: [
        {
          message,
          type: 'ImportDeclaration',
        },
      ],
    },
    {
      code: `import { Model } from 'ember-data';

        export default Model.extend({
        });
      `,
      errors: [
        {
          message,
          type: 'ImportDeclaration',
        },
      ],
    },
    {
      code: `import ED from 'ember-data';

        const { Model } = ED;
      `,
      errors: [
        {
          message,
          type: 'ImportDeclaration',
        },
        {
          message: "Use `import Model from '@ember-data/model';` instead of using DS destructuring",
          type: 'Property',
        },
      ],
    },
  ],
});
