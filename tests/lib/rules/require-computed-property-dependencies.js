'use strict';

const rule = require('../../../lib/rules/require-computed-property-dependencies');
const RuleTester = require('eslint').RuleTester;

const { ERROR_MESSAGE_NON_STRING_VALUE } = rule;

const ruleTester = new RuleTester();
ruleTester.run('require-computed-property-dependencies', rule, {
  valid: [
    `
      Ember.computed();
    `,
    `
      Ember.computed(function() {});
    `,
    `
      Ember.computed('unused', function() {});
    `,
    // Volatile:
    `
      Ember.computed('name', function() {
        return this.get('name');
      }).volatile()
    `,
    // ES5 getter usage:
    `
      Ember.computed('name', function() {
        return this.name;
      });
    `,
    `
      Ember.computed('name', function() {
        return this.get('name');
      });
    `,
    `
      Ember.computed(function() {
        return this.someArray[i];
      });
    `,
    // TODO: an improvement would be to detect the missing `someArray.[]` dependency key.
    `
      Ember.computed(function() {
        return this.someArray[1];
      });
    `,
    // Without `Ember.`:
    `
      computed('name', function() {
        return this.get('name');
      });
    `,
    `
      Ember.computed('list.@each.foo', function() {
        return this.get('list').map(function(item) {
          return item.get('foo');
        });
      });
    `,
    `
      Ember.computed('list.[]', function() {
        return this.get('list.length');
      });
    `,
    `
      Ember.computed('deeper.than.needed.but.okay', function() {
        return this.get('deeper');
      });
    `,
    `
      Ember.computed('array.[]', function() {
        return this.get('array.firstObject');
      });
    `,
    `
      Ember.computed('array.[]', function() {
        return this.get('array.lastObject');
      });
    `,
    `
      Ember.computed('foo.{bar,baz}', function() {
        return this.get('foo.bar') + this.get('foo.baz');
      });
    `,
    `
      Ember.computed('foo.@each.{bar,baz}', function() {
        return this.get('foo').mapBy('bar') + this.get('foo').mapBy('bar');
      });
    `,
    // Computed macro that should be ignored:
    `
      Ember.computed.someMacro(function() {
        return this.x;
      })
    `,
    `
      Ember.computed.someMacro('test')
    `,
    // Incorrect usage that should be ignored:
    `
      Ember.computed(123)
    `,
  ],
  invalid: [
    {
      code: 'Ember.computed(dynamic, function() {});',
      output: null,
      errors: [
        {
          message: ERROR_MESSAGE_NON_STRING_VALUE,
          type: 'Identifier',
        },
      ],
    },
    {
      code: 'Ember.computed(...PROPERTIES, function() {});',
      output: null,
      parserOptions: { ecmaVersion: 6, sourceType: 'module' },
      errors: [
        {
          message: ERROR_MESSAGE_NON_STRING_VALUE,
          type: 'SpreadElement',
        },
      ],
    },
    {
      code: `
        Ember.computed(function() {
          return Ember.get(this, 'undeclared');
        });
      `,
      output: `
        Ember.computed('undeclared', function() {
          return Ember.get(this, 'undeclared');
        });
      `,
      errors: [
        {
          message: 'Use of undeclared dependencies in computed property: undeclared',
          type: 'CallExpression',
        },
      ],
    },
    {
      code: `
        Ember.computed(function() {
          return this.get('undeclared') + this.get('undeclared2');
        });
      `,
      output: `
        Ember.computed('undeclared', 'undeclared2', function() {
          return this.get('undeclared') + this.get('undeclared2');
        });
      `,
      errors: [
        {
          message: 'Use of undeclared dependencies in computed property: undeclared, undeclared2',
          type: 'CallExpression',
        },
      ],
    },
    // Volatile:
    {
      code: `
        Ember.computed(function() {
          return this.get('undeclared');
        }).volatile();
      `,
      output: `
        Ember.computed('undeclared', function() {
          return this.get('undeclared');
        }).volatile();
      `,
      errors: [
        {
          message: 'Use of undeclared dependencies in computed property: undeclared',
          type: 'CallExpression',
        },
      ],
    },
    // ES5 getter usage:
    {
      code: `
        Ember.computed(function() {
          return this.undeclared + this.undeclared2;
        });
      `,
      output: `
        Ember.computed('undeclared', 'undeclared2', function() {
          return this.undeclared + this.undeclared2;
        });
      `,
      errors: [
        {
          message: 'Use of undeclared dependencies in computed property: undeclared, undeclared2',
          type: 'CallExpression',
        },
      ],
    },
    // ES5 getter usage with nesting:
    {
      code: `
        Ember.computed(function() {
          return this.a.b.c;
        });
      `,
      output: `
        Ember.computed('a.b.c', function() {
          return this.a.b.c;
        });
      `,
      errors: [
        {
          message: 'Use of undeclared dependencies in computed property: a.b.c',
          type: 'CallExpression',
        },
      ],
    },
    {
      // Without `Ember.`:
      code: `
        computed(function() {
          return this.get('undeclared') + this.get('undeclared2');
        });
      `,
      output: `
        computed('undeclared', 'undeclared2', function() {
          return this.get('undeclared') + this.get('undeclared2');
        });
      `,
      errors: [
        {
          message: 'Use of undeclared dependencies in computed property: undeclared, undeclared2',
          type: 'CallExpression',
        },
      ],
    },
    {
      code: `
        Ember.computed(function() {
          return this.get('undeclared') + this.get('undeclared');
        });
      `,
      output: `
        Ember.computed('undeclared', function() {
          return this.get('undeclared') + this.get('undeclared');
        });
      `,
      errors: [
        {
          message: 'Use of undeclared dependencies in computed property: undeclared',
          type: 'CallExpression',
        },
      ],
    },
    {
      code: `
        Ember.computed(function() {
          return this.get('foo.bar.baz');
        });
      `,
      output: `
        Ember.computed('foo.bar.baz', function() {
          return this.get('foo.bar.baz');
        });
      `,
      errors: [
        {
          message: 'Use of undeclared dependencies in computed property: foo.bar.baz',
          type: 'CallExpression',
        },
      ],
    },
    // Ensure that the redundant key (`foo`) is removed.
    {
      code: `
        Ember.computed('foo', function() {
          return this.get('foo.bar.baz');
        });
      `,
      output: `
        Ember.computed('foo.bar.baz', function() {
          return this.get('foo.bar.baz');
        });
      `,
      errors: [
        {
          message: 'Use of undeclared dependencies in computed property: foo.bar.baz',
          type: 'CallExpression',
        },
      ],
    },
    {
      code: `
        Ember.computed(function() {
          return this.getProperties('a', dynamic, 'b', 'c');
        });
      `,
      output: `
        Ember.computed('a', 'b', 'c', function() {
          return this.getProperties('a', dynamic, 'b', 'c');
        });
      `,
      errors: [
        {
          message: 'Use of undeclared dependencies in computed property: a, b, c',
          type: 'CallExpression',
        },
      ],
    },
    {
      code: `
        Ember.computed(function() {
          return this.getProperties(['a', dynamic, 'b', 'c']);
        });
      `,
      output: `
        Ember.computed('a', 'b', 'c', function() {
          return this.getProperties(['a', dynamic, 'b', 'c']);
        });
      `,
      errors: [
        {
          message: 'Use of undeclared dependencies in computed property: a, b, c',
          type: 'CallExpression',
        },
      ],
    },
    {
      code: `
        Ember.computed(function() {
          return Ember.getProperties(this, ['a', dynamic, 'b', 'c']);
        });
      `,
      output: `
        Ember.computed('a', 'b', 'c', function() {
          return Ember.getProperties(this, ['a', dynamic, 'b', 'c']);
        });
      `,
      errors: [
        {
          message: 'Use of undeclared dependencies in computed property: a, b, c',
          type: 'CallExpression',
        },
      ],
    },
    {
      code: `
        Ember.computed(function() {
          return this.getWithDefault('maybe', {});
        });
      `,
      output: `
        Ember.computed('maybe', function() {
          return this.getWithDefault('maybe', {});
        });
      `,
      errors: [
        {
          message: 'Use of undeclared dependencies in computed property: maybe',
          type: 'CallExpression',
        },
      ],
    },
    {
      code: `
        Ember.computed(function() {
          return Ember.getWithDefault(this, 'maybe', {});
        });
      `,
      output: `
        Ember.computed('maybe', function() {
          return Ember.getWithDefault(this, 'maybe', {});
        });
      `,
      errors: [
        {
          message: 'Use of undeclared dependencies in computed property: maybe',
          type: 'CallExpression',
        },
      ],
    },
    {
      code: `
        Ember.computed('constructor.bar', function() {
          return this.get('constructor.bar') + this.get('constructor.baz');
        });
      `,
      output: `
        Ember.computed('constructor.{bar,baz}', function() {
          return this.get('constructor.bar') + this.get('constructor.baz');
        });
      `,
      errors: [
        {
          message: 'Use of undeclared dependencies in computed property: constructor.baz',
          type: 'CallExpression',
        },
      ],
    },
    {
      code: `
        Ember.computed('foo.bar', 'quux.[]', 'quux.length', function() {
          return this.get('foo.bar') + this.get('foo.baz');
        });
      `,
      output: `
        Ember.computed('foo.{bar,baz}', 'quux.[]', 'quux.length', function() {
          return this.get('foo.bar') + this.get('foo.baz');
        });
      `,
      errors: [
        {
          message: 'Use of undeclared dependencies in computed property: foo.baz',
          type: 'CallExpression',
        },
      ],
    },
    {
      // don't expand @each.{foo,bar}
      code: `
        Ember.computed('foo.@each.{bar,baz}', function() {
          return this.get('foo').mapBy('bar') + this.get('quux');
        });
      `,
      output: `
        Ember.computed('foo.@each.{bar,baz}', 'quux', function() {
          return this.get('foo').mapBy('bar') + this.get('quux');
        });
      `,
      errors: [
        {
          message: 'Use of undeclared dependencies in computed property: quux',
          type: 'CallExpression',
        },
      ],
    },
  ],
});
