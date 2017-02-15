

const assert = require('chai').assert;
const babelEslint = require('babel-eslint');
const emberUtils = require('../../../lib/utils/ember');

function parse(code) {
  return babelEslint.parse(code).body[0].expression;
}

function getProperty(code) {
  return parse(code).right.properties[0];
}

describe('isModule', () => {
  let node;

  it('should check if it\'s a proper module', () => {
    node = parse('Ember.test()');
    assert.ok(emberUtils.isModule(node, 'test'));

    node = parse('Ember.Component()');
    assert.ok(emberUtils.isModule(node, 'Component'));

    node = parse('DS.test()');
    assert.ok(emberUtils.isModule(node, 'test', 'DS'));

    node = parse('DS.Model()');
    assert.ok(emberUtils.isModule(node, 'Model', 'DS'));
  });
});

describe('isDSModel', () => {
  const node = parse('DS.Model()');

  it('should check if it\'s a DS Model', () => {
    assert.ok(emberUtils.isDSModel(node));
  });
});

describe('isEmberComponent', () => {
  const node = parse('Ember.Component()');

  it('should check if it\'s an Ember Component', () => {
    assert.ok(emberUtils.isEmberComponent(node));
  });
});

describe('isEmberController', () => {
  const node = parse('Ember.Controller()');

  it('should check if it\'s an Ember Controller', () => {
    assert.ok(emberUtils.isEmberController(node));
  });
});

describe('isEmberRoute', () => {
  const node = parse('Ember.Route()');

  it('should check if it\'s an Ember Route', () => {
    assert.ok(emberUtils.isEmberRoute(node));
  });
});

describe('isInjectedServiceProp', () => {
  let node;

  it('should check if it\'s an injected service prop', () => {
    node = parse('service()');
    assert.ok(emberUtils.isInjectedServiceProp(node));

    node = parse('Ember.service()');
    assert.ok(emberUtils.isInjectedServiceProp(node));
  });
});

describe('isComputedProp', () => {
  let node;

  it('should check if it\'s an computed prop', () => {
    node = parse('computed()');
    assert.ok(emberUtils.isComputedProp(node));

    node = parse('Ember.computed()');
    assert.ok(emberUtils.isComputedProp(node));
  });
});

describe('isObserverProp', () => {
  let node;

  it('should check if it\'s an observer prop', () => {
    node = parse('observer()');
    assert.ok(emberUtils.isObserverProp(node));

    node = parse('Ember.observer()');
    assert.ok(emberUtils.isObserverProp(node));
  });
});

describe('isArrayProp', () => {
  let node;

  it('should be an array', () => {
    node = getProperty('test = { test: new Ember.A() }');
    assert.ok(emberUtils.isArrayProp(node));

    node = getProperty('test = { test: new A() }');
    assert.ok(emberUtils.isArrayProp(node));

    node = getProperty('test = { test: [] }');
    assert.ok(emberUtils.isArrayProp(node));
  });
});

describe('isObjectProp', () => {
  let node;

  it('should be an object', () => {
    node = getProperty('test = { test: new Ember.Object() }');
    assert.ok(emberUtils.isObjectProp(node));

    node = getProperty('test = { test: new Object() }');
    assert.ok(emberUtils.isObjectProp(node));

    node = getProperty('test = { test: {} }');
    assert.ok(emberUtils.isObjectProp(node));
  });
});

describe('isCustomProp', () => {
  let node;

  it('should be custom property', () => {
    node = getProperty('test = { test: \'someLiteral\' }');
    assert.ok(emberUtils.isCustomProp(node));

    node = getProperty('test = { test: someIdentifier }');
    assert.ok(emberUtils.isCustomProp(node));

    node = getProperty('test = { test: [] }');
    assert.ok(emberUtils.isCustomProp(node));

    node = getProperty('test = { test: {} }');
    assert.ok(emberUtils.isCustomProp(node));

    node = getProperty('test = { test: foo ? \'bar\': \'baz\' }');
    assert.ok(emberUtils.isCustomProp(node));

    node = getProperty('test = { actions: {} }');
    assert.notOk(emberUtils.isCustomProp(node));
  });
});

describe('isModelProp', () => {
  let node;

  it('should be a model prop', () => {
    node = getProperty('test = { model() {} }');
    assert.ok(emberUtils.isModelProp(node));

    node = getProperty('test = { model: function() {} }');
    assert.ok(emberUtils.isModelProp(node));
  });
});

describe('isActionsProp', () => {
  const node = getProperty('test = { actions: {} }');

  it('should be actions prop', () => {
    assert.ok(emberUtils.isActionsProp(node));
  });
});

describe('getModuleProperties', () => {
  const module = parse(`
    Ember.Component.extend(SomeMixin, {
      asd: 'qwe',
      actions: {},
      someMethod() {}
    })
  `);

  it('returns module\'s properties', () => {
    const properties = emberUtils.getModuleProperties(module);
    assert.equal(properties.length, 3);
  });
});

describe('isSingleLineFn', () => {
  const property = getProperty(`test = {
    test: computed.or('asd', 'qwe')
  }`);

  it('should check if given function has one line', () => {
    assert.ok(emberUtils.isSingleLineFn(property));
  });
});

describe('isMultiLineFn', () => {
  const property = getProperty(`test = {
    test: computed('asd', function() {
      return get(this, 'asd') + 'test';
    })
  }`);

  it('should check if given function has more than one line', () => {
    assert.ok(emberUtils.isMultiLineFn(property));
  });
});

describe('isFunctionExpression', () => {
  let property;

  it('should check if given property is a function expression', () => {
    property = getProperty(`test = {
      test: someFn(function() {})
    }`);
    assert.ok(emberUtils.isFunctionExpression(property.value));

    property = getProperty(`test = {
      test() {}
    }`);
    assert.ok(emberUtils.isFunctionExpression(property.value));

    property = getProperty(`test = {
      test: function() {}
    }`);
    assert.ok(emberUtils.isFunctionExpression(property.value));

    property = getProperty(`test = {
      test: () => {}
    }`);
    assert.ok(emberUtils.isFunctionExpression(property.value));
  });
});

describe('isRelation', () => {
  let property;

  it('should detect hasMany relation', () => {
    property = getProperty(`test = {
      test: hasMany()
    }`);
    assert.ok(emberUtils.isRelation(property));

    property = getProperty(`test = {
      test: DS.hasMany()
    }`);
    assert.ok(emberUtils.isRelation(property));
  });

  it('should detect belongsTo relation', () => {
    property = getProperty(`test = {
      test: belongsTo()
    }`);
    assert.ok(emberUtils.isRelation(property));

    property = getProperty(`test = {
      test: DS.belongsTo()
    }`);
    assert.ok(emberUtils.isRelation(property));
  });
});
