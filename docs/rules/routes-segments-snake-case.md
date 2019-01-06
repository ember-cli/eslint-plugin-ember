## Route naming

### Rule name: `routes-segments-snake-case`

Dynamic segments in routes should use _snake case_, so Ember doesn't have to do extra serialization in order to resolve promises.

```javascript
// GOOD
this.route('tree', { path: ':tree_id'});

// BAD
this.route('tree', { path: ':treeId'});
```

### References

* [Ember Routing Guide](https://guides.emberjs.com/release/routing/)

### Related Rules

* [no-capital-letters-in-routes](no-capital-letters-in-routes.md)
* [no-unnecessary-route-path-option](no-unnecessary-route-path-option.md)
* [route-path-style](route-path-style.md)
