module.exports = class Stack {
  constructor() {
    this.stack = new Array();
  }
  pop() {
    return this.stack.pop();
  }
  push(item) {
    this.stack.push(item);
  }
  peek() {
    return this.stack.length > 0 ? this.stack.at(-1) : undefined;
  }
  size() {
    return this.stack.length;
  }
};
