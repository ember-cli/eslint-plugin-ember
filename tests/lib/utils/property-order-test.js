'use-strict';

const propertyOrder = require('../../../lib/utils/property-order');
const { FauxContext } = require('../../helpers/faux-context');

describe('addBackwardsPosition', () => {
  it('should not change the order if the desired position is already included in the order', () => {
    const newOrder = propertyOrder.addBackwardsPosition(
      ['method', 'empty-method'],
      'empty-method',
      'method'
    );
    expect(newOrder).toEqual(['method', 'empty-method']);
  });

  it('should not change the order if the desired position is already included as part of another position group', () => {
    const newOrder = propertyOrder.addBackwardsPosition(
      [['method', 'empty-method'], 'foo'],
      'empty-method',
      'method'
    );
    expect(newOrder).toEqual([['method', 'empty-method'], 'foo']);
  });

  it('should not add the position, if the target position is not present', () => {
    const newOrder = propertyOrder.addBackwardsPosition(['foo'], 'empty-method', 'bar');
    expect(newOrder).toEqual(['foo']);
  });

  it('should add the desired position to the existing target position when the target position is on its own position', () => {
    const newOrder = propertyOrder.addBackwardsPosition(
      ['method', 'foo'],
      'empty-method',
      'method'
    );
    expect(newOrder).toEqual([['method', 'empty-method'], 'foo']);
  });

  it('should add the desired position to the existing target position when the target position is part of a group', () => {
    const newOrder = propertyOrder.addBackwardsPosition(
      [['method', 'bar'], 'foo'],
      'empty-method',
      'method'
    );
    expect(newOrder).toEqual([['method', 'bar', 'empty-method'], 'foo']);
  });
});

describe('determinePropertyType', () => {
  describe('classic classes', () => {
    it('should determine service-type props', () => {
      const context = new FauxContext(
        `export default Controller.extend({
          currentUser: service(),
        });`
      );
      const node = context.ast.body[0].declaration.arguments[0].properties[0];
      expect(propertyOrder.determinePropertyType(node, 'controller')).toEqual('service');
    });

    it('should determine controller-type props', () => {
      const context = new FauxContext(
        `export default Controller.extend({
          application: controller(),
        });`
      );
      const node = context.ast.body[0].declaration.arguments[0].properties[0];
      expect(propertyOrder.determinePropertyType(node, 'controller')).toEqual('controller');
    });

    it('should determine init-type props', () => {
      const context = new FauxContext(
        `export default Controller.extend({
          init() {}
        });`
      );
      const node = context.ast.body[0].declaration.arguments[0].properties[0];
      expect(propertyOrder.determinePropertyType(node, 'controller')).toEqual('init');
    });

    it('should determine component lifecycle hooks', () => {
      const context = new FauxContext(
        `export default Component.extend({
          didInsertElement() {}
        });`
      );
      const node = context.ast.body[0].declaration.arguments[0].properties[0];
      expect(propertyOrder.determinePropertyType(node, 'component')).toEqual('didInsertElement');
    });

    it('should determine query-params', () => {
      const context = new FauxContext(
        `export default Controller.extend({
          queryParams: []
        });`
      );
      const node = context.ast.body[0].declaration.arguments[0].properties[0];
      expect(propertyOrder.determinePropertyType(node, 'controller')).toEqual('query-params');
    });

    it('should determine inherited properties', () => {
      const context = new FauxContext(
        `export default Controller.extend({
          isDestroyed: false
        });`
      );
      const node = context.ast.body[0].declaration.arguments[0].properties[0];
      expect(propertyOrder.determinePropertyType(node, 'controller')).toEqual('inherited-property');
    });

    it('should determine attributes', () => {
      const context = new FauxContext(
        `export default Model.extend({
          someAttr: DS.attr()
        });`
      );
      const node = context.ast.body[0].declaration.arguments[0].properties[0];
      expect(propertyOrder.determinePropertyType(node, 'model')).toEqual('attribute');
    });

    it('should determine relationships', () => {
      const context = new FauxContext(
        `export default Model.extend({
          someRelationship: hasMany('otherModel')
        });`
      );
      const node = context.ast.body[0].declaration.arguments[0].properties[0];
      expect(propertyOrder.determinePropertyType(node, 'model')).toEqual('relationship');
    });

    it('should determine observer-type props', () => {
      const context = new FauxContext(
        `export default Controller.extend({
          someObvs: observer(),
        });`
      );
      const node = context.ast.body[0].declaration.arguments[0].properties[0];
      expect(propertyOrder.determinePropertyType(node, 'controller')).toEqual('observer');
    });

    it('should determine actions', () => {
      const context = new FauxContext(
        `export default Component.extend({
          actions: {}
        });`
      );
      const node = context.ast.body[0].declaration.arguments[0].properties[0];
      expect(propertyOrder.determinePropertyType(node, 'component')).toEqual('actions');
    });

    it('should determine single-line functions', () => {
      const context = new FauxContext(
        `export default Component.extend({
          foo: boo()
        });`
      );
      const node = context.ast.body[0].declaration.arguments[0].properties[0];
      expect(propertyOrder.determinePropertyType(node, 'component')).toEqual(
        'single-line-function'
      );
    });

    it('should determine multi-line functions', () => {
      const context = new FauxContext(
        `export default Component.extend({
          foo: boo(bar, baz, () => {
            console.log('boop')
          })
        });`
      );
      const node = context.ast.body[0].declaration.arguments[0].properties[0];
      expect(propertyOrder.determinePropertyType(node, 'component')).toEqual('multi-line-function');
    });

    it('should determine properties', () => {
      const context = new FauxContext(
        `export default Component.extend({
          foo: "boo"
        });`
      );
      const node = context.ast.body[0].declaration.arguments[0].properties[0];
      expect(propertyOrder.determinePropertyType(node, 'component')).toEqual('property');
    });

    it('should determine empty methods', () => {
      const context = new FauxContext(
        `export default Component.extend({
          foo() {}
        });`
      );
      const node = context.ast.body[0].declaration.arguments[0].properties[0];
      expect(propertyOrder.determinePropertyType(node, 'component')).toEqual('empty-method');
    });

    it('should determine methods', () => {
      const context = new FauxContext(
        `export default Component.extend({
          foo() { console.log("hello") }
        });`
      );
      const node = context.ast.body[0].declaration.arguments[0].properties[0];
      expect(propertyOrder.determinePropertyType(node, 'component')).toEqual('method');
    });
  });

  describe('native classes', () => {
    it('should determine service-type props', () => {
      const context = new FauxContext(
        `class MyController extends Controller {
          @service currentUser;
        }`
      );
      const node = context.ast.body[0].body.body[0];
      expect(propertyOrder.determinePropertyType(node, 'controller')).toEqual('service');
    });

    it('should determine controller-type props', () => {
      const context = new FauxContext(
        `class MyController extends Controller {
          @controller application;
        }`
      );
      const node = context.ast.body[0].body.body[0];
      expect(propertyOrder.determinePropertyType(node, 'controller')).toEqual('controller');
    });

    it('should determine init-type props', () => {
      const context = new FauxContext(
        `class MyController extends Controller {
          init() {}
        }`
      );
      const node = context.ast.body[0].body.body[0];
      expect(propertyOrder.determinePropertyType(node, 'controller')).toEqual('init');
    });

    it('should determine query-params', () => {
      const context = new FauxContext(
        `class MyController extends Controller {
          queryParams = [];
        }`
      );
      const node = context.ast.body[0].body.body[0];
      expect(propertyOrder.determinePropertyType(node, 'controller')).toEqual('query-params');
    });

    it('should determine attributes', () => {
      const context = new FauxContext(
        `class MyModel extends Model {
          @attr someAttr;
        }`
      );
      const node = context.ast.body[0].body.body[0];
      expect(propertyOrder.determinePropertyType(node, 'model')).toEqual('attribute');
    });

    it('should determine relationships', () => {
      const context = new FauxContext(
        `class MyModel extends Model {
          @hasMany('otherModel') someRelationship;
        }`
      );
      const node = context.ast.body[0].body.body[0];
      expect(propertyOrder.determinePropertyType(node, 'model')).toEqual('relationship');
    });

    it('should determine observer-type props', () => {
      const context = new FauxContext(
        `class MyController extends Controller {
          @observer someObvs;
        }`
      );
      const node = context.ast.body[0].body.body[0];
      expect(propertyOrder.determinePropertyType(node, 'controller')).toEqual('observer');
    });

    it('should determine single-line functions', () => {
      const context = new FauxContext(
        `class MyComponent extends Component {
          foo() {}
        }`
      );
      const node = context.ast.body[0].body.body[0];
      expect(propertyOrder.determinePropertyType(node, 'component')).toEqual(
        'single-line-function'
      );
    });

    it('should determine multi-line functions', () => {
      const context = new FauxContext(
        `class MyComponent extends Component {
          foo(bar) {
            console.log(bar)
          }
        }`
      );
      const node = context.ast.body[0].body.body[0];
      expect(propertyOrder.determinePropertyType(node, 'component')).toEqual('multi-line-function');
    });

    it('should determine properties', () => {
      const context = new FauxContext(
        `class MyComponent extends Component {
          foo = "boo";
        }`
      );
      const node = context.ast.body[0].body.body[0];
      expect(propertyOrder.determinePropertyType(node, 'component')).toEqual('property');
    });
  });
});

describe('reportUnorderedProperties', () => {
  describe('classic classes', () => {
    it('should not report nodes if the order is correct', () => {
      const order = ['controller', 'service', 'query-params'];
      const context = new FauxContext(
        `export default Controller.extend({
        application: controller(),
        currentUser: service(),
        queryParams: [],
      });`,
        '',
        jest.fn()
      );
      const node = context.ast.body[0].declaration;

      propertyOrder.reportUnorderedProperties(node, context, 'controller', order);
      expect(context.report).not.toHaveBeenCalled();
    });

    it('should report nodes if the order is incorrect', () => {
      const order = ['controller', 'service', 'query-params'];
      const context = new FauxContext(
        `export default Controller.extend({
          currentUser: service(),
          application: controller(),
          queryParams: [],
        });`,
        '',
        jest.fn()
      );
      const node = context.ast.body[0].declaration;

      propertyOrder.reportUnorderedProperties(node, context, 'controller', order);
      expect(context.report).toHaveBeenCalled();
    });
  });

  describe('native classes', () => {
    it('should not report nodes if the order is correct', () => {
      const order = ['controller', 'service', 'query-params'];
      const context = new FauxContext(
        `export default class MyController extends Controller {
          @controller application;
          @service currentUser;
          queryParams = [];
        }`,
        '',
        jest.fn()
      );
      const node = context.ast.body[0].declaration;

      propertyOrder.reportUnorderedProperties(node, context, 'controller', order);
      expect(context.report).not.toHaveBeenCalled();
    });

    it('should report nodes if the order is incorrect', () => {
      const order = ['controller', 'service', 'query-params'];
      const context = new FauxContext(
        `export default class MyController extends Controller {
          @service currentUser;
          @controller application;
          queryParams = [];
        }`,
        '',
        jest.fn()
      );
      const node = context.ast.body[0].declaration;

      propertyOrder.reportUnorderedProperties(node, context, 'controller', order);
      expect(context.report).toHaveBeenCalled();
    });
  });
});
