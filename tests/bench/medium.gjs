import Component from '@glimmer/component';
import { tracked } from '@glimmer/tracking';
import { action } from '@ember/object';
import { on } from '@ember/modifier';
import { fn } from '@ember/helper';
import { inject as service } from '@ember/service';

const PriorityBadge = <template>
  <span class="priority priority--{{@level}}">
    {{#if (eq @level "high")}}
      🔴
    {{else if (eq @level "medium")}}
      🟡
    {{else}}
      🟢
    {{/if}}
    {{@level}}
  </span>
</template>;

const CategoryTag = <template>
  <span class="tag tag--{{@color}}">
    {{@name}}
    {{#if @onRemove}}
      <button type="button" class="tag__remove" {{on "click" @onRemove}}>×</button>
    {{/if}}
  </span>
</template>;

const EmptyState = <template>
  <div class="empty-state">
    <div class="empty-state__icon">{{@icon}}</div>
    <h3 class="empty-state__title">{{@title}}</h3>
    <p class="empty-state__description">{{@description}}</p>
    {{#if @actionLabel}}
      <button type="button" class="btn btn--primary" {{on "click" @onAction}}>
        {{@actionLabel}}
      </button>
    {{/if}}
  </div>
</template>;

const ProgressBar = <template>
  <div class="progress-bar" role="progressbar" aria-valuenow={{@value}} aria-valuemin="0" aria-valuemax="100">
    <div class="progress-bar__fill" style="width: {{@value}}%"></div>
    <span class="progress-bar__label">{{@value}}%</span>
  </div>
</template>;

const TodoItem = <template>
  <li class="todo-item {{if @item.done 'todo-item--done'}} todo-item--{{@item.priority}}">
    <div class="todo-item__checkbox">
      <input
        type="checkbox"
        id="todo-{{@item.id}}"
        checked={{@item.done}}
        {{on "change" (fn @onToggle @item.id)}}
      />
    </div>
    <div class="todo-item__content">
      <label for="todo-{{@item.id}}" class="todo-item__label">
        {{@item.label}}
      </label>
      {{#if @item.notes}}
        <p class="todo-item__notes">{{@item.notes}}</p>
      {{/if}}
      <div class="todo-item__meta">
        <PriorityBadge @level={{@item.priority}} />
        {{#if @item.category}}
          <CategoryTag @name={{@item.category}} @color="blue" />
        {{/if}}
        {{#if @item.dueDate}}
          <span class="todo-item__due {{if @item.overdue 'todo-item__due--overdue'}}">
            Due: {{@item.dueDate}}
          </span>
        {{/if}}
      </div>
    </div>
    <div class="todo-item__actions">
      <button type="button" class="btn btn--icon" {{on "click" (fn @onEdit @item)}}>
        Edit
      </button>
      <button type="button" class="btn btn--icon btn--danger" {{on "click" (fn @onDelete @item.id)}}>
        Delete
      </button>
    </div>
  </li>
</template>;

const FilterBar = <template>
  <div class="filter-bar">
    <div class="filter-bar__search">
      <input
        type="search"
        placeholder="Search tasks…"
        value={{@searchQuery}}
        {{on "input" @onSearch}}
      />
    </div>
    <div class="filter-bar__filters">
      <select {{on "change" @onFilterChange}}>
        <option value="all" selected={{eq @filter "all"}}>All</option>
        <option value="active" selected={{eq @filter "active"}}>Active</option>
        <option value="completed" selected={{eq @filter "completed"}}>Completed</option>
        <option value="high-priority" selected={{eq @filter "high-priority"}}>High Priority</option>
        <option value="overdue" selected={{eq @filter "overdue"}}>Overdue</option>
      </select>
      <select {{on "change" @onSortChange}}>
        <option value="createdAt" selected={{eq @sortBy "createdAt"}}>Date Created</option>
        <option value="label" selected={{eq @sortBy "label"}}>Name</option>
        <option value="priority" selected={{eq @sortBy "priority"}}>Priority</option>
        <option value="dueDate" selected={{eq @sortBy "dueDate"}}>Due Date</option>
      </select>
    </div>
    <div class="filter-bar__actions">
      <button type="button" class="btn btn--sm" {{on "click" @onClearFilters}}>
        Clear Filters
      </button>
    </div>
  </div>
</template>;

const StatsPanel = <template>
  <div class="stats-panel">
    <div class="stats-panel__item">
      <span class="stats-panel__value">{{@stats.total}}</span>
      <span class="stats-panel__label">Total</span>
    </div>
    <div class="stats-panel__item">
      <span class="stats-panel__value">{{@stats.active}}</span>
      <span class="stats-panel__label">Active</span>
    </div>
    <div class="stats-panel__item">
      <span class="stats-panel__value">{{@stats.completed}}</span>
      <span class="stats-panel__label">Completed</span>
    </div>
    <div class="stats-panel__item stats-panel__item--warning">
      <span class="stats-panel__value">{{@stats.overdue}}</span>
      <span class="stats-panel__label">Overdue</span>
    </div>
    <div class="stats-panel__progress">
      <ProgressBar @value={{@stats.progress}} />
    </div>
  </div>
</template>;

const BulkActionsBar = <template>
  {{#if @visible}}
    <div class="bulk-actions">
      <span class="bulk-actions__count">{{@count}} selected</span>
      <button type="button" class="btn btn--sm" {{on "click" @onComplete}}>
        Mark Complete
      </button>
      <button type="button" class="btn btn--sm" {{on "click" @onSetHighPriority}}>
        Set High Priority
      </button>
      <button type="button" class="btn btn--sm btn--danger" {{on "click" @onDelete}}>
        Delete Selected
      </button>
      <button type="button" class="btn btn--sm" {{on "click" @onClear}}>
        Clear Selection
      </button>
    </div>
  {{/if}}
</template>;

const AddItemForm = <template>
  <form class="add-form" {{on "submit" @onSubmit}}>
    <div class="add-form__row">
      <input
        type="text"
        class="add-form__input"
        placeholder="What needs to be done?"
        value={{@label}}
        {{on "input" @onLabelChange}}
        {{on "keydown" @onKeydown}}
      />
      <button type="submit" class="btn btn--primary" disabled={{@isLoading}}>
        {{#if @isLoading}}
          Adding…
        {{else}}
          Add Task
        {{/if}}
      </button>
    </div>
    <div class="add-form__options">
      <select {{on "change" @onPriorityChange}}>
        <option value="low">Low Priority</option>
        <option value="normal" selected>Normal Priority</option>
        <option value="high">High Priority</option>
      </select>
      <select {{on "change" @onCategoryChange}}>
        <option value="">No Category</option>
        {{#each @categories as |cat|}}
          <option value={{cat.id}}>{{cat.name}}</option>
        {{/each}}
      </select>
      <input
        type="date"
        value={{@dueDate}}
        {{on "change" @onDueDateChange}}
      />
    </div>
    {{#if @error}}
      <div class="add-form__error" role="alert">{{@error}}</div>
    {{/if}}
  </form>
</template>;

export default class TodoList extends Component {
  @service store;
  @service('notifications') notify;

  @tracked items = [];
  @tracked newLabel = '';
  @tracked filter = 'all';
  @tracked sortBy = 'createdAt';
  @tracked searchQuery = '';
  @tracked isLoading = false;
  @tracked errorMessage = null;
  @tracked selectedItems = new Set();
  @tracked priority = 'normal';
  @tracked selectedCategory = null;
  @tracked dueDate = null;

  get filteredItems() {
    let result = this.items;
    if (this.searchQuery) {
      const q = this.searchQuery.toLowerCase();
      result = result.filter((i) => i.label.toLowerCase().includes(q));
    }
    switch (this.filter) {
      case 'active':
        return result.filter((i) => !i.done);
      case 'completed':
        return result.filter((i) => i.done);
      case 'high-priority':
        return result.filter((i) => i.priority === 'high');
      case 'overdue':
        return result.filter((i) => i.dueDate && new Date(i.dueDate) < new Date() && !i.done);
      default:
        return result;
    }
  }

  get sortedItems() {
    return [...this.filteredItems].sort((a, b) => {
      if (a[this.sortBy] < b[this.sortBy]) return -1;
      if (a[this.sortBy] > b[this.sortBy]) return 1;
      return 0;
    });
  }

  get stats() {
    return {
      total: this.items.length,
      active: this.items.filter((i) => !i.done).length,
      completed: this.items.filter((i) => i.done).length,
      overdue: this.items.filter(
        (i) => i.dueDate && new Date(i.dueDate) < new Date() && !i.done,
      ).length,
      progress:
        this.items.length > 0
          ? Math.round(
              (this.items.filter((i) => i.done).length / this.items.length) * 100,
            )
          : 0,
    };
  }

  get hasItems() {
    return this.items.length > 0;
  }

  get showBulkActions() {
    return this.selectedItems.size > 0;
  }

  @action addItem(event) {
    event.preventDefault();
    const label = this.newLabel.trim();
    if (!label) return;
    this.items = [
      ...this.items,
      { id: Date.now(), label, done: false, priority: this.priority, category: this.selectedCategory, dueDate: this.dueDate, notes: '', createdAt: new Date() },
    ];
    this.newLabel = '';
    this.priority = 'normal';
    this.dueDate = null;
  }

  @action toggleItem(id) {
    this.items = this.items.map((i) => (i.id === id ? { ...i, done: !i.done } : i));
  }

  @action deleteItem(id) {
    this.items = this.items.filter((i) => i.id !== id);
    this.selectedItems.delete(id);
  }

  @action editItem(item) {
    this.notify.info(`Editing: ${item.label}`);
  }

  @action updateLabel(event) { this.newLabel = event.target.value; }
  @action handleKeydown(event) { if (event.key === 'Escape') this.newLabel = ''; }
  @action updateSearch(event) { this.searchQuery = event.target.value; }
  @action setFilter(event) { this.filter = event.target.value; }
  @action setSort(event) { this.sortBy = event.target.value; }
  @action setPriority(event) { this.priority = event.target.value; }
  @action setCategory(event) { this.selectedCategory = event.target.value || null; }
  @action setDueDate(event) { this.dueDate = event.target.value || null; }
  @action clearFilters() { this.filter = 'all'; this.searchQuery = ''; this.sortBy = 'createdAt'; }
  @action clearSelection() { this.selectedItems = new Set(); }

  @action bulkComplete() {
    this.items = this.items.map((i) => (this.selectedItems.has(i.id) ? { ...i, done: true } : i));
    this.selectedItems = new Set();
  }

  @action bulkDelete() {
    this.items = this.items.filter((i) => !this.selectedItems.has(i.id));
    this.selectedItems = new Set();
  }

  @action bulkSetHighPriority() {
    this.items = this.items.map((i) => (this.selectedItems.has(i.id) ? { ...i, priority: 'high' } : i));
    this.selectedItems = new Set();
  }

  <template>
    <div class="todo-app">
      <header class="todo-app__header">
        <h1>{{@title}}</h1>
        <StatsPanel @stats={{this.stats}} />
      </header>

      <AddItemForm
        @label={{this.newLabel}}
        @isLoading={{this.isLoading}}
        @error={{this.errorMessage}}
        @categories={{@categories}}
        @dueDate={{this.dueDate}}
        @onSubmit={{this.addItem}}
        @onLabelChange={{this.updateLabel}}
        @onKeydown={{this.handleKeydown}}
        @onPriorityChange={{this.setPriority}}
        @onCategoryChange={{this.setCategory}}
        @onDueDateChange={{this.setDueDate}}
      />

      <FilterBar
        @searchQuery={{this.searchQuery}}
        @filter={{this.filter}}
        @sortBy={{this.sortBy}}
        @onSearch={{this.updateSearch}}
        @onFilterChange={{this.setFilter}}
        @onSortChange={{this.setSort}}
        @onClearFilters={{this.clearFilters}}
      />

      <BulkActionsBar
        @visible={{this.showBulkActions}}
        @count={{this.selectedItems.size}}
        @onComplete={{this.bulkComplete}}
        @onSetHighPriority={{this.bulkSetHighPriority}}
        @onDelete={{this.bulkDelete}}
        @onClear={{this.clearSelection}}
      />

      {{#if this.hasItems}}
        <ul class="todo-list">
          {{#each this.sortedItems as |item|}}
            <TodoItem
              @item={{item}}
              @onToggle={{this.toggleItem}}
              @onEdit={{this.editItem}}
              @onDelete={{this.deleteItem}}
            />
          {{/each}}
        </ul>
      {{else}}
        <EmptyState
          @icon="📝"
          @title="No tasks yet"
          @description="Add your first task above to get started."
        />
      {{/if}}
    </div>
  </template>
}
