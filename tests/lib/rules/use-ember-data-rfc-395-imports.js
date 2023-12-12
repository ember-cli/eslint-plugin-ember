'use strict';

//------------------------------------------------------------------------------
// Requirements
//------------------------------------------------------------------------------

const rule = require('../../../lib/rules/use-ember-data-rfc-395-imports');
const RuleTester = require('eslint').RuleTester;

const parserOptions = { ecmaVersion: 2020, sourceType: 'module' };

const { ERROR_MESSAGE: message } = rule;

//------------------------------------------------------------------------------
// Tests
//------------------------------------------------------------------------------

const ruleTester = new RuleTester({
  parserOptions,
  parser: require.resolve('@babel/eslint-parser'),
});
ruleTester.run('use-ember-data-rfc-395-imports', rule, {
  valid: [
    "import Model from '@ember-data/model';",
    `import Model, { attr } from '@ember-data';

     export default Model.extend({
       name: attr('string'),
       ...foo
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
    "import AdapterRegistry from 'ember-data/types/registries/adapter';",
    "import ModelRegistry from 'ember-data/types/registries/model';",
    "import SerializerRegistry from 'ember-data/types/registries/serializer';",
    "import TransformRegistry from 'ember-data/types/registries/transform';",
  ],

  invalid: [
    {
      code: `import DS from 'ember-data';

        export default DS.Model.extend({
          ...foo
        });
      `,
      output: null,
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
      output: null,
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
      output: null,
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
      output: `import Model from '@ember-data/model';

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
      output: `import Model from '@ember-data/model';
        import { attr } from '@ember-data/model';

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
      output: `import Model from '@ember-data/model';
        import { attr } from '@ember-data/model';

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
      output: `import Model from '@ember-data/model';
        import { attr as namedAttr } from '@ember-data/model';

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
      output: null,
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
      output: null,
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
