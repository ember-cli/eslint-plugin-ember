import Component from '@glimmer/component';
import { tracked } from '@glimmer/tracking';
import { action } from '@ember/object';
import { inject as service } from '@ember/service';
import { later, cancel } from '@ember/runloop';

export default class TodoListComponent extends Component {
  @service store;
  @service router;
  @service('notifications') notify;

  @tracked items = [];
  @tracked newLabel = '';
  @tracked filter = 'all';
  @tracked isLoading = false;
  @tracked errorMessage = null;

  get filteredItems() {
    switch (this.filter) {
      case 'active':
        return this.items.filter((item) => !item.done);
      case 'completed':
        return this.items.filter((item) => item.done);
      default:
        return this.items;
    }
  }

  get completedCount() {
    return this.items.filter((i) => i.done).length;
  }

  get activeCount() {
    return this.items.length - this.completedCount;
  }

  get hasCompleted() {
    return this.completedCount > 0;
  }

  get allCompleted() {
    return this.items.length > 0 && this.completedCount === this.items.length;
  }

  @action
  async addItem() {
    const label = this.newLabel.trim();
    if (!label) return;

    this.isLoading = true;
    this.errorMessage = null;

    try {
      const record = this.store.createRecord('todo', { label, done: false });
      await record.save();
      this.items = [...this.items, record];
      this.newLabel = '';
    } catch (error) {
      this.errorMessage = error.message;
    } finally {
      this.isLoading = false;
    }
  }

  @action
  toggleItem(item) {
    item.done = !item.done;
    item.save();
  }

  @action
  removeItem(item) {
    this.items = this.items.filter((i) => i !== item);
    item.destroyRecord();
  }

  @action
  clearCompleted() {
    const completed = this.items.filter((i) => i.done);
    this.items = this.items.filter((i) => !i.done);
    completed.forEach((item) => item.destroyRecord());
  }

  @action
  setFilter(filter) {
    this.filter = filter;
  }

  @action
  updateLabel(event) {
    this.newLabel = event.target.value;
  }

  @action
  handleKeydown(event) {
    if (event.key === 'Enter') {
      this.addItem();
    }
  }

  @action
  toggleAll() {
    const allDone = this.allCompleted;
    this.items.forEach((item) => {
      item.done = !allDone;
      item.save();
    });
  }
}
