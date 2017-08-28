'use-strict';

const propertyOrder = require('../../../lib/utils/property-order');

describe('addBackwardsPosition', () => {
  it('should not change the order if the desired position is already included in the order', () => {
    const newOrder = propertyOrder.addBackwardsPosition(['method', 'empty-method'], 'empty-method', 'method');
    expect(newOrder).toEqual(['method', 'empty-method']);
  });

  it('should not change the order if the desired position is already included as part of another position group', () => {
    const newOrder = propertyOrder.addBackwardsPosition([['method', 'empty-method'], 'foo'], 'empty-method', 'method');
    expect(newOrder).toEqual([['method', 'empty-method'], 'foo']);
  });

  it('should not add the position, if the target position is not present', () => {
    const newOrder = propertyOrder.addBackwardsPosition(['foo'], 'empty-method', 'bar');
    expect(newOrder).toEqual(['foo']);
  });

  it('should add the desired position to the existing target position when the target position is on its own position', () => {
    const newOrder = propertyOrder.addBackwardsPosition(['method', 'foo'], 'empty-method', 'method');
    expect(newOrder).toEqual([['method', 'empty-method'], 'foo']);
  });

  it('should add the desired position to the existing target position when the target position is part of a group', () => {
    const newOrder = propertyOrder.addBackwardsPosition([['method', 'bar'], 'foo'], 'empty-method', 'method');
    expect(newOrder).toEqual([['method', 'bar', 'empty-method'], 'foo']);
  });
});
