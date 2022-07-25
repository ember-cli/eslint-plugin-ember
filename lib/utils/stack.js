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
    return this.stack.length > 0 ? this.stack[this.stack.length - 1] : undefined;
  }
  size() {
    return this.stack.length;
  }
};
