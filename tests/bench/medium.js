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
  @tracked editingItem = null;
  @tracked editText = '';
  @tracked sortBy = 'createdAt';
  @tracked sortOrder = 'desc';
  @tracked selectedItems = new Set();
  @tracked showBulkActions = false;
  @tracked searchQuery = '';
  @tracked categories = [];
  @tracked selectedCategory = null;
  @tracked dueDate = null;
  @tracked priority = 'normal';
  @tracked isArchiveView = false;
  @tracked archivedItems = [];
  @tracked undoStack = [];
  @tracked redoStack = [];

  get filteredItems() {
    let result = this.isArchiveView ? this.archivedItems : this.items;

    if (this.searchQuery) {
      const q = this.searchQuery.toLowerCase();
      result = result.filter(
        (item) =>
          item.label.toLowerCase().includes(q) ||
          (item.notes && item.notes.toLowerCase().includes(q)),
      );
    }

    if (this.selectedCategory) {
      result = result.filter(
        (item) => item.category === this.selectedCategory,
      );
    }

    switch (this.filter) {
      case 'active':
        return result.filter((item) => !item.done);
      case 'completed':
        return result.filter((item) => item.done);
      case 'high-priority':
        return result.filter((item) => item.priority === 'high');
      case 'overdue':
        return result.filter(
          (item) => item.dueDate && new Date(item.dueDate) < new Date() && !item.done,
        );
      default:
        return result;
    }
  }

  get sortedItems() {
    const items = [...this.filteredItems];
    items.sort((a, b) => {
      let aVal = a[this.sortBy];
      let bVal = b[this.sortBy];

      if (this.sortBy === 'priority') {
        const priorityOrder = { high: 0, normal: 1, low: 2 };
        aVal = priorityOrder[aVal] ?? 1;
        bVal = priorityOrder[bVal] ?? 1;
      }

      if (aVal < bVal) return this.sortOrder === 'asc' ? -1 : 1;
      if (aVal > bVal) return this.sortOrder === 'asc' ? 1 : -1;
      return 0;
    });
    return items;
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

  get selectedCount() {
    return this.selectedItems.size;
  }

  get hasSelection() {
    return this.selectedCount > 0;
  }

  get allSelected() {
    return (
      this.filteredItems.length > 0 &&
      this.filteredItems.every((item) => this.selectedItems.has(item.id))
    );
  }

  get overdueCount() {
    return this.items.filter(
      (item) => item.dueDate && new Date(item.dueDate) < new Date() && !item.done,
    ).length;
  }

  get itemsByCategory() {
    const grouped = {};
    for (const item of this.items) {
      const cat = item.category || 'Uncategorized';
      if (!grouped[cat]) grouped[cat] = [];
      grouped[cat].push(item);
    }
    return grouped;
  }

  get canUndo() {
    return this.undoStack.length > 0;
  }

  get canRedo() {
    return this.redoStack.length > 0;
  }

  get progressPercentage() {
    if (this.items.length === 0) return 0;
    return Math.round((this.completedCount / this.items.length) * 100);
  }

  get statsForDisplay() {
    return {
      total: this.items.length,
      active: this.activeCount,
      completed: this.completedCount,
      overdue: this.overdueCount,
      archived: this.archivedItems.length,
      progress: this.progressPercentage,
    };
  }

  _pushUndo(actionDescription) {
    this.undoStack = [
      ...this.undoStack,
      {
        description: actionDescription,
        snapshot: JSON.parse(JSON.stringify(this.items)),
      },
    ];
    this.redoStack = [];
  }

  @action
  async addItem() {
    const label = this.newLabel.trim();
    if (!label) return;

    this.isLoading = true;
    this.errorMessage = null;
    this._pushUndo('add item');

    try {
      const record = this.store.createRecord('todo', {
        label,
        done: false,
        priority: this.priority,
        category: this.selectedCategory,
        dueDate: this.dueDate,
        notes: '',
        createdAt: new Date(),
      });
      await record.save();
      this.items = [...this.items, record];
      this.newLabel = '';
      this.priority = 'normal';
      this.dueDate = null;
      this.notify.success(`Added "${label}"`);
    } catch (error) {
      this.errorMessage = error.message;
      this.notify.error('Failed to add item');
    } finally {
      this.isLoading = false;
    }
  }

  @action
  toggleItem(item) {
    this._pushUndo('toggle item');
    item.done = !item.done;
    item.save();
  }

  @action
  removeItem(item) {
    this._pushUndo('remove item');
    this.items = this.items.filter((i) => i !== item);
    this.selectedItems.delete(item.id);
    item.destroyRecord();
  }

  @action
  clearCompleted() {
    this._pushUndo('clear completed');
    const completed = this.items.filter((i) => i.done);
    this.items = this.items.filter((i) => !i.done);
    completed.forEach((item) => {
      this.selectedItems.delete(item.id);
      item.destroyRecord();
    });
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
    } else if (event.key === 'Escape') {
      this.newLabel = '';
    }
  }

  @action
  toggleAll() {
    this._pushUndo('toggle all');
    const allDone = this.allCompleted;
    this.items.forEach((item) => {
      item.done = !allDone;
      item.save();
    });
  }

  @action
  startEditing(item) {
    this.editingItem = item;
    this.editText = item.label;
  }

  @action
  cancelEditing() {
    this.editingItem = null;
    this.editText = '';
  }

  @action
  async saveEdit() {
    if (!this.editingItem) return;
    const text = this.editText.trim();
    if (!text) return;

    this._pushUndo('edit item');
    this.editingItem.label = text;
    await this.editingItem.save();
    this.editingItem = null;
    this.editText = '';
  }

  @action
  toggleSelection(itemId) {
    const next = new Set(this.selectedItems);
    if (next.has(itemId)) {
      next.delete(itemId);
    } else {
      next.add(itemId);
    }
    this.selectedItems = next;
    this.showBulkActions = next.size > 0;
  }

  @action
  selectAll() {
    if (this.allSelected) {
      this.selectedItems = new Set();
    } else {
      this.selectedItems = new Set(this.filteredItems.map((i) => i.id));
    }
    this.showBulkActions = this.selectedItems.size > 0;
  }

  @action
  bulkDelete() {
    this._pushUndo('bulk delete');
    const ids = this.selectedItems;
    const toDelete = this.items.filter((i) => ids.has(i.id));
    this.items = this.items.filter((i) => !ids.has(i.id));
    this.selectedItems = new Set();
    this.showBulkActions = false;
    toDelete.forEach((item) => item.destroyRecord());
  }

  @action
  bulkComplete() {
    this._pushUndo('bulk complete');
    const ids = this.selectedItems;
    this.items.forEach((item) => {
      if (ids.has(item.id)) {
        item.done = true;
        item.save();
      }
    });
  }

  @action
  bulkSetPriority(priority) {
    this._pushUndo('bulk set priority');
    const ids = this.selectedItems;
    this.items.forEach((item) => {
      if (ids.has(item.id)) {
        item.priority = priority;
        item.save();
      }
    });
  }

  @action
  archiveCompleted() {
    this._pushUndo('archive completed');
    const completed = this.items.filter((i) => i.done);
    this.archivedItems = [...this.archivedItems, ...completed];
    this.items = this.items.filter((i) => !i.done);
  }

  @action
  restoreFromArchive(item) {
    item.done = false;
    this.archivedItems = this.archivedItems.filter((i) => i !== item);
    this.items = [...this.items, item];
    item.save();
  }

  @action
  toggleArchiveView() {
    this.isArchiveView = !this.isArchiveView;
  }

  @action
  setSortBy(field) {
    if (this.sortBy === field) {
      this.sortOrder = this.sortOrder === 'asc' ? 'desc' : 'asc';
    } else {
      this.sortBy = field;
      this.sortOrder = 'asc';
    }
  }

  @action
  updateSearch(event) {
    this.searchQuery = event.target.value;
  }

  @action
  setCategory(category) {
    this.selectedCategory = category;
  }

  @action
  setPriority(priority) {
    this.priority = priority;
  }

  @action
  setDueDate(date) {
    this.dueDate = date;
  }

  @action
  undo() {
    if (!this.canUndo) return;
    const entry = this.undoStack[this.undoStack.length - 1];
    this.redoStack = [
      ...this.redoStack,
      {
        description: entry.description,
        snapshot: JSON.parse(JSON.stringify(this.items)),
      },
    ];
    this.undoStack = this.undoStack.slice(0, -1);
    this.items = entry.snapshot;
  }

  @action
  redo() {
    if (!this.canRedo) return;
    const entry = this.redoStack[this.redoStack.length - 1];
    this.undoStack = [
      ...this.undoStack,
      {
        description: entry.description,
        snapshot: JSON.parse(JSON.stringify(this.items)),
      },
    ];
    this.redoStack = this.redoStack.slice(0, -1);
    this.items = entry.snapshot;
  }

  @action
  async duplicateItem(item) {
    this._pushUndo('duplicate item');
    const record = this.store.createRecord('todo', {
      label: `${item.label} (copy)`,
      done: false,
      priority: item.priority,
      category: item.category,
      dueDate: item.dueDate,
      notes: item.notes,
      createdAt: new Date(),
    });
    await record.save();
    this.items = [...this.items, record];
  }

  @action
  exportItems() {
    const data = this.items.map((item) => ({
      label: item.label,
      done: item.done,
      priority: item.priority,
      category: item.category,
      dueDate: item.dueDate,
      notes: item.notes,
    }));
    return JSON.stringify(data, null, 2);
  }

  @action
  async importItems(jsonString) {
    this._pushUndo('import items');
    try {
      const data = JSON.parse(jsonString);
      for (const entry of data) {
        const record = this.store.createRecord('todo', {
          ...entry,
          createdAt: new Date(),
        });
        await record.save();
        this.items = [...this.items, record];
      }
      this.notify.success(`Imported ${data.length} items`);
    } catch (error) {
      this.notify.error('Invalid import data');
    }
  }
}
