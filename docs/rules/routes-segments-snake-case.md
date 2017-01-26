### Route naming

#### `routes-segments-snake-case`

Dynamic segments in routes should use _snake case_, so Ember doesn't have to do extra serialization in order to resolve promises.

```javascript
// GOOD
this.route('tree', { path: ':tree_id'});

// BAD
this.route('tree', { path: ':treeId'});
```
