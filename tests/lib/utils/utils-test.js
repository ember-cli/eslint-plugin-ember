'use strict';

const babelEslint = require('babel-eslint');
const utils = require('../../../lib/utils/utils');

function parse(code) {
  return babelEslint.parse(code).body[0].expression;
}

function parseVariableDeclarator(code) {
  return babelEslint.parse(code).body[0].declarations[0];
}

describe('collectObjectPatternBindings', () => {
  it('collects bindings correctly', () => {
    const node = parseVariableDeclarator('const { $ } = Ember');
    const collectedBindings = utils.collectObjectPatternBindings(node, {
      Ember: ['$'],
    });

    expect(collectedBindings).toStrictEqual(['$']);
  });

  it('collects aliased bindings correctly', () => {
    const node = parseVariableDeclarator('const { $:foo } = Ember');
    const collectedBindings = utils.collectObjectPatternBindings(node, {
      Ember: ['$'],
    });

    expect(collectedBindings).toStrictEqual(['foo']);
  });

  it('collects only relevant bindings correctly for multiple destructurings', () => {
    const node = parseVariableDeclarator('const { $, computed } = Ember');
    const collectedBindings = utils.collectObjectPatternBindings(node, {
      Ember: ['$'],
    });

    expect(collectedBindings).toStrictEqual(['$']);
  });

  it('collects only relevant bindings correctly for multiple destructurings and aliases', () => {
    const node = parseVariableDeclarator('const { $: foo, computed } = Ember');
    const collectedBindings = utils.collectObjectPatternBindings(node, {
      Ember: ['$'],
    });

    expect(collectedBindings).toStrictEqual(['foo']);
  });

  it('collects multiple relevant bindings', () => {
    const node = parseVariableDeclarator('const { $: foo, computed } = Ember');
    const collectedBindings = utils.collectObjectPatternBindings(node, {
      Ember: ['$', 'computed'],
    });

    expect(collectedBindings).toStrictEqual(['foo', 'computed']);
  });
});

describe('findNodes', () => {
  const node = parse(`test = [
    {test: "a"}, b, "c", [d, e], "f", "g", h, {test: "i"}, function() {}, [], new Date()
  ]`).right.elements;

  it('should find nodes based on their name', () => {
    const literals = utils.findNodes(node, 'Literal');
    const identifiers = utils.findNodes(node, 'Identifier');
    const objects = utils.findNodes(node, 'ObjectExpression');
    const functions = utils.findNodes(node, 'FunctionExpression');
    const news = utils.findNodes(node, 'NewExpression');
    const arrays = utils.findNodes(node, 'ArrayExpression');

    expect(literals).toHaveLength(3);
    expect(identifiers).toHaveLength(2);
    expect(objects).toHaveLength(2);
    expect(functions).toHaveLength(1);
    expect(news).toHaveLength(1);
    expect(arrays).toHaveLength(2);
  });
});

describe('flatten', function () {
  it('correctly flattens arrays', function () {
    expect(utils.flatten([])).toStrictEqual([]);
    expect(utils.flatten(null)).toBeNull();
    expect(utils.flatten([[1], [2]])).toStrictEqual([1, 2]);
    expect(
      utils.flatten([
        [1, 2],
        [3, 4],
      ])
    ).toStrictEqual([1, 2, 3, 4]);
    expect(utils.flatten([[1], [2, 3], [4, 5, 6]])).toStrictEqual([1, 2, 3, 4, 5, 6]); // different lengths forward
    expect(utils.flatten([[6, 5, 4], [3, 2], [1]])).toStrictEqual([6, 5, 4, 3, 2, 1]); // different lengths reverse
    expect(utils.flatten([[1], null, [2]])).toStrictEqual([1, null, 2]); // with null array
  });
});

describe('function sort order', function () {
  it('has exported functions in sorted order', function () {
    expect(Object.getOwnPropertyNames(utils)).toStrictEqual(
      Object.getOwnPropertyNames(utils).sort()
    );
  });
});

describe('getPropertyValue', () => {
  const simpleObject = {
    foo: true,
    bar: {
      baz: 1,
      fizz: {
        buzz: 'buzz',
      },
    },
  };

  const node = babelEslint.parse(`
    export default Ember.Component({
      init() {
        this._super(...arguments);
        this._valueCache = this.value;
        this.updated = false;
      },
      didReceiveAttrs() {
        if (this._valueCache !== this.value) {
          this._valueCache = this.value;
          this.set('updated', true);
        } else {
          this.set('updated', false);
        }
      }
    });
  `).body[0].declaration;

  it('should return null when property value not found for simpleObject', () => {
    const value = utils.getPropertyValue(simpleObject, 'blah');
    expect(value).toBeUndefined();
  });

  it('should return value when using a simple property path for simpleObject', () => {
    const value = utils.getPropertyValue(simpleObject, 'foo');
    expect(value).toStrictEqual(true);
  });

  it('should return value when using a full property path for simpleObject', () => {
    const buzz = utils.getPropertyValue(simpleObject, 'bar.fizz.buzz');
    expect(buzz).toStrictEqual('buzz');
  });

  it('should return null when property value not found for node', () => {
    const value = utils.getPropertyValue(node, 'blah');
    expect(value).toBeUndefined();
  });

  it('should return value when using a simple property path for node', () => {
    const type = utils.getPropertyValue(node, 'type');
    expect(type).toStrictEqual('CallExpression');
  });

  it('should return value when using a full property path for node', () => {
    const name = utils.getPropertyValue(node, 'callee.object.name');
    expect(name).toStrictEqual('Ember');
  });
});

describe('getSize', () => {
  const node = parse(
    'some = {\nfew: "line",\nheight: "statement",\nthat: "should",\nhave: "6 lines",\n};'
  );

  it('should check size of given expression', () => {
    expect(utils.getSize(node)).toStrictEqual(6);
  });
});

describe('isGlobalCallExpression', () => {
  it('recognizes when call is not global', () => {
    const node = parse("$('foo')");
    expect(utils.isGlobalCallExpression(node, '$', ['$', 'jQuery'])).not.toBeTruthy();
  });

  it('recognizes when global call', () => {
    const node = parse("$('foo')");
    expect(utils.isGlobalCallExpression(node, 'jQuery', ['$', 'jQuery'])).toBeTruthy();
  });
});

describe('parseArgs', () => {
  it('should parse arguments', () => {
    const node = parse('Ember.computed("asd", "qwe", "zxc", function() {})');
    const parsedArgs = utils.parseArgs(node);
    expect(parsedArgs).toHaveLength(3);
    expect(parsedArgs).toStrictEqual(['asd', 'qwe', 'zxc']);
  });
});

describe('parseCallee', () => {
  it('should parse calleeExpression', () => {
    const node = parse('Ember.computed.or("asd", "qwe")');
    const parsedCallee = utils.parseCallee(node);
    expect(parsedCallee).toHaveLength(3, 'it has 3 elements in array');
    expect(parsedCallee).toStrictEqual(['Ember', 'computed', 'or']);
  });

  it('should parse newExpression', () => {
    const node = parse('new Ember.A()');
    const parsedCallee = utils.parseCallee(node);
    expect(parsedCallee).toHaveLength(2, 'it has 2 elements in array');
    expect(parsedCallee).toStrictEqual(['Ember', 'A']);
  });
});
