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
    // Array inside braces:
    `
      Ember.computed('article.{comments.[],title}', function() {
        return this.article.title + someFunction(this.article.comments.mapBy(function(comment) { return comment.author; }));
      });
    `,
    // Nesting inside braces:
    `
      Ember.computed('article.{comments.innerProperty,title}', function() {
        return this.article.title + someFunction(this.article.comments.innerProperty);
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
    // ES5 getter usage inside function call:
    {
      code: `
        Ember.computed(function() {
          return someFunction(this.undeclared) + some.thing(this.undeclared2) + some(this.undeclared3).thing;
        });
      `,
      output: `
        Ember.computed('undeclared', 'undeclared2', 'undeclared3', function() {
          return someFunction(this.undeclared) + some.thing(this.undeclared2) + some(this.undeclared3).thing;
        });
      `,
      errors: [
        {
          message:
            'Use of undeclared dependencies in computed property: undeclared, undeclared2, undeclared3',
          type: 'CallExpression',
        },
      ],
    },
    // ES5 getter usage inside array index:
    {
      code: `
        Ember.computed(function() {
          return someArray[this.undeclared];
        });
      `,
      output: `
        Ember.computed('undeclared', function() {
          return someArray[this.undeclared];
        });
      `,
      errors: [
        {
          message: 'Use of undeclared dependencies in computed property: undeclared',
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
    // ES5 getter usage with array with numeric index:
    // TODO: an improvement would be to detect the missing `someArray.[]` dependency key.
    {
      code: `
        Ember.computed(function() {
          return this.someArray[123];
        });
      `,
      output: `
        Ember.computed('someArray', function() {
          return this.someArray[123];
        });
      `,
      errors: [
        {
          message: 'Use of undeclared dependencies in computed property: someArray',
          type: 'CallExpression',
        },
      ],
    },
    // ES5 getter usage with array/object access:
    {
      code: `
        Ember.computed(function() {
          return this.someArrayOrObject[index];
        });
      `,
      output: `
        Ember.computed('someArrayOrObject', function() {
          return this.someArrayOrObject[index];
        });
      `,
      errors: [
        {
          message: 'Use of undeclared dependencies in computed property: someArrayOrObject',
          type: 'CallExpression',
        },
      ],
    },
    // With function calls on properties.
    {
      code: `
        Ember.computed(function() {
          return this.get('service1').someFunction() + this.service2.someFunction();
        });
      `,
      output: `
        Ember.computed('service1', 'service2', function() {
          return this.get('service1').someFunction() + this.service2.someFunction();
        });
      `,
      errors: [
        {
          message: 'Use of undeclared dependencies in computed property: service1, service2',
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
    // Ensure that the fixer removes the redundant `quux.length` dependency.
    {
      code: `
        Ember.computed('foo.bar', 'quux.[]', 'quux.length', function() {
          return this.get('foo.bar') + this.get('foo.baz') + this.get('quux.firstObject.test');
        });
      `,
      output: `
        Ember.computed('foo.{bar,baz}', 'quux.[]', 'quux.firstObject.test', function() {
          return this.get('foo.bar') + this.get('foo.baz') + this.get('quux.firstObject.test');
        });
      `,
      errors: [
        {
          message:
            'Use of undeclared dependencies in computed property: foo.baz, quux.firstObject.test',
          type: 'CallExpression',
        },
      ],
    },
    // TODO: this should actually be a valid test case because the property added by the fixer (`quux.firstObject.myProp`) is redundant.
    {
      code: `
        Ember.computed('quux.@each.myProp', function() {
          return this.get('quux.firstObject.myProp');
        });
      `,
      output: `
        Ember.computed('quux.@each.myProp', 'quux.firstObject.myProp', function() {
          return this.get('quux.firstObject.myProp');
        });
      `,
      errors: [
        {
          message: 'Use of undeclared dependencies in computed property: quux.firstObject.myProp',
          type: 'CallExpression',
        },
      ],
    },
    // Gracefully handles nesting/array inside braces:
    {
      code: `
        Ember.computed('article.{comments.[],title,first.second}', function() {
          return this.article.title + this.missingProp + someFunction(this.article.comments) + this.article.first.second;
        });
      `,
      // TODO: an improvement would be to use braces here: 'article.{comments.[],first.second,title}'
      output: `
        Ember.computed('article.comments.[]', 'article.first.second', 'article.title', 'missingProp', function() {
          return this.article.title + this.missingProp + someFunction(this.article.comments) + this.article.first.second;
        });
      `,
      errors: [
        {
          message: 'Use of undeclared dependencies in computed property: missingProp',
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
