'use strict';

const { parse: babelESLintParse } = require('../../helpers/babel-eslint-parser');
const utils = require('../../../lib/utils/utils');

function parse(code) {
  return babelESLintParse(code).body[0].expression;
}

function parseVariableDeclarator(code) {
  return babelESLintParse(code).body[0].declarations[0];
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

describe('function sort order', function () {
  it('has exported functions in sorted order', function () {
    expect(Object.getOwnPropertyNames(utils)).toStrictEqual(
      Object.getOwnPropertyNames(utils).sort()
    );
  });
});

describe('getName', () => {
  it('should behave correctly', () => {
    expect(utils.getName(parse('x'))).toBe('x');
    expect(utils.getName(parse('x()'))).toBe('x');
    expect(utils.getName(parse('x?.()'))).toBe('x');
    expect(utils.getName(parse('x.y'))).toBe('x.y');
    expect(utils.getName(parse('x?.y'))).toBe('x.y');
    expect(utils.getName(parse('x.y()'))).toBe('x.y');
    expect(utils.getName(parse('x?.y?.()'))).toBe('x.y');
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

  const node = babelESLintParse(`
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
    expect(value).toBe(true);
  });

  it('should return value when using a full property path for simpleObject', () => {
    const buzz = utils.getPropertyValue(simpleObject, 'bar.fizz.buzz');
    expect(buzz).toBe('buzz');
  });

  it('should return null when property value not found for node', () => {
    const value = utils.getPropertyValue(node, 'blah');
    expect(value).toBeUndefined();
  });

  it('should return value when using a simple property path for node', () => {
    const type = utils.getPropertyValue(node, 'type');
    expect(type).toBe('CallExpression');
  });

  it('should return value when using a full property path for node', () => {
    const name = utils.getPropertyValue(node, 'callee.object.name');
    expect(name).toBe('Ember');
  });
});

describe('getSize', () => {
  const node = parse(
    'some = {\nfew: "line",\nheight: "statement",\nthat: "should",\nhave: "6 lines",\n};'
  );

  it('should check size of given expression', () => {
    expect(utils.getSize(node)).toBe(6);
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

describe('startsWithThisExpression', () => {
  it('should behave correctly', () => {
    expect(utils.startsWithThisExpression(parse('x'))).toBeFalsy();
    expect(utils.startsWithThisExpression(parse('x.y'))).toBeFalsy();
    expect(utils.startsWithThisExpression(parse('x()'))).toBeFalsy();
    expect(utils.startsWithThisExpression(parse('x.y()'))).toBeFalsy();
    expect(utils.startsWithThisExpression(parse('x.y.z()'))).toBeFalsy();

    expect(utils.startsWithThisExpression(parse('this'))).toBeTruthy();
    expect(utils.startsWithThisExpression(parse('this.x'))).toBeTruthy();
    expect(utils.startsWithThisExpression(parse('this.x.y'))).toBeTruthy();
    expect(utils.startsWithThisExpression(parse('this.x()'))).toBeTruthy();
    expect(utils.startsWithThisExpression(parse('this.x.y()'))).toBeTruthy();
  });
});
