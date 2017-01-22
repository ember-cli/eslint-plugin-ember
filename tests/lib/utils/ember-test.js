const assert = require('chai').assert;
const babelEslint = require('babel-eslint');
const emberUtils = require('../../../lib/utils/ember');

function parse(code) {
  return babelEslint.parse(code).body[0].expression;
}

function getProperty(code) {
  return parse(code).right.properties[0];
}

describe('isModule', function() {
  let node;

  it('should check if it\'s a proper module', function() {
    node = parse(`Ember.test()`);
    assert.ok(emberUtils.isModule(node, 'test'));

    node = parse(`Ember.Component()`);
    assert.ok(emberUtils.isModule(node, 'Component'));

    node = parse(`DS.test()`);
    assert.ok(emberUtils.isModule(node, 'test', 'DS'));

    node = parse(`DS.Model()`);
    assert.ok(emberUtils.isModule(node, 'Model', 'DS'));
  });
});

describe('isDSModel', function() {
  const node = parse(`DS.Model()`);

  it('should check if it\'s a DS Model', function() {
    assert.ok(emberUtils.isDSModel(node));
  });
});

describe('isEmberComponent', function() {
  const node = parse(`Ember.Component()`);

  it('should check if it\'s an Ember Component', function() {
    assert.ok(emberUtils.isEmberComponent(node));
  });
});

describe('isEmberController', function() {
  const node = parse(`Ember.Controller()`);

  it('should check if it\'s an Ember Controller', function() {
    assert.ok(emberUtils.isEmberController(node));
  });
});

describe('isEmberRoute', function() {
  const node = parse(`Ember.Route()`);

  it('should check if it\'s an Ember Route', function() {
    assert.ok(emberUtils.isEmberRoute(node));
  });
});

describe('isInjectedServiceProp', function() {
  let node;

  it('should check if it\'s an injected service prop', function() {
    node = parse(`service()`);
    assert.ok(emberUtils.isInjectedServiceProp(node));

    node = parse(`Ember.service()`);
    assert.ok(emberUtils.isInjectedServiceProp(node));
  });
});

describe('isComputedProp', function() {
  let node;

  it('should check if it\'s an computed prop', function() {
    node = parse(`computed()`);
    assert.ok(emberUtils.isComputedProp(node));

    node = parse(`Ember.computed()`);
    assert.ok(emberUtils.isComputedProp(node));
  });
});

describe('isObserverProp', function() {
  let node;

  it('should check if it\'s an observer prop', function() {
    node = parse(`observer()`);
    assert.ok(emberUtils.isObserverProp(node));

    node = parse(`Ember.observer()`);
    assert.ok(emberUtils.isObserverProp(node));
  });
});

describe('isArrayProp', function() {
  let node;

  it('should be an array', function() {
    node = getProperty(`test = { test: new Ember.A() }`);
    assert.ok(emberUtils.isArrayProp(node));

    node = getProperty(`test = { test: new A() }`);
    assert.ok(emberUtils.isArrayProp(node));

    node = getProperty(`test = { test: [] }`);
    assert.ok(emberUtils.isArrayProp(node));
  });
});

describe('isObjectProp', function() {
  let node;

  it('should be an object', function() {
    node = getProperty(`test = { test: new Ember.Object() }`);
    assert.ok(emberUtils.isObjectProp(node));

    node = getProperty(`test = { test: new Object() }`);
    assert.ok(emberUtils.isObjectProp(node));

    node = getProperty(`test = { test: {} }`);
    assert.ok(emberUtils.isObjectProp(node));
  });
});

describe('isCustomProp', function() {
  let node;

  it('should be custom property', function() {
    node = getProperty(`test = { test: 'someLiteral' }`);
    assert.ok(emberUtils.isCustomProp(node));

    node = getProperty(`test = { test: someIdentifier }`);
    assert.ok(emberUtils.isCustomProp(node));

    node = getProperty(`test = { test: [] }`);
    assert.ok(emberUtils.isCustomProp(node));

    node = getProperty(`test = { test: {} }`);
    assert.ok(emberUtils.isCustomProp(node));

    node = getProperty(`test = { actions: {} }`);
    assert.notOk(emberUtils.isCustomProp(node));
  });
});

describe('isModelProp', function() {
  let node;

  if('should be a model prop', function() {
    node = getProperty(`test = { model() {} }`);
    assert.ok(emberUtils.isModelProp(node));

    node = getProperty(`test = { model: function() {} }`);
    assert.ok(emberUtils.isModelProp(node));
  });
});

describe('isActionsProp', function() {
  const node = getProperty(`test = { actions: {} }`);

  if('should be actions prop', function() {
    assert.ok(emberUtils.isActionsProp(node));
  });
});

describe('getModuleProperties', function() {
  const module = parse(`
    Ember.Component.extend(SomeMixin, {
      asd: 'qwe',
      actions: {},
      someMethod() {}
    })
  `);

    it('returns module\'s properties', function() {
      const properties = emberUtils.getModuleProperties(module);
      assert.equal(properties.length, 3);
    });
});

describe('isSingleLineFn', function() {
  const property = getProperty(`test = {
    test: computed.or('asd', 'qwe')
  }`);

  it('should check if given function has one line', function() {
    assert.ok(emberUtils.isSingleLineFn(property));
  });
});

describe('isMultiLineFn', function() {
  const property = getProperty(`test = {
    test: computed('asd', function() {
      return get(this, 'asd') + 'test';
    })
  }`);

  it('should check if given function has more than one line', function() {
    assert.ok(emberUtils.isMultiLineFn(property));
  });
});

describe('isFunctionExpression', function() {
  let property;

  it('should check if given property is a function expression', function() {
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

describe('isRelation', function() {
  let property;

  it('should detect hasMany relation', function() {
    property = getProperty(`test = {
      test: hasMany()
    }`);
    assert.ok(emberUtils.isRelation(property));

    property = getProperty(`test = {
      test: DS.hasMany()
    }`);
    assert.ok(emberUtils.isRelation(property));
  });

  it('should detect belongsTo relation', function() {
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
