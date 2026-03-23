import Component from '@glimmer/component';
import { tracked } from '@glimmer/tracking';
import { action } from '@ember/object';
import { on } from '@ember/modifier';
import { fn } from '@ember/helper';
import type { TOC } from '@ember/component/template-only';

interface TodoItemData {
  id: number;
  label: string;
  done: boolean;
}

const TodoItem: TOC<{ Args: { item: TodoItemData; onToggle: (id: number) => void } }> = <template>
  <li class={{if @item.done "done"}}>
    <label>
      <input
        type="checkbox"
        checked={{@item.done}}
        {{on "change" (fn @onToggle @item.id)}}
      />
      {{@item.label}}
    </label>
  </li>
</template>;

const EmptyState: TOC<{}> = <template>
  <p class="empty">No items yet. Add one above!</p>
</template>;

interface TodoListArgs {
  title: string;
}

export default class TodoList extends Component<{ Args: TodoListArgs }> {
  @tracked items: TodoItemData[] = [];
  @tracked newLabel = '';

  @action
  addItem() {
    if (!this.newLabel.trim()) return;
    this.items = [
      ...this.items,
      { id: Date.now(), label: this.newLabel.trim(), done: false },
    ];
    this.newLabel = '';
  }

  @action
  toggleItem(id: number) {
    this.items = this.items.map((item) =>
      item.id === id ? { ...item, done: !item.done } : item,
    );
  }

  @action
  removeCompleted() {
    this.items = this.items.filter((item) => !item.done);
  }

  get completedCount(): number {
    return this.items.filter((i) => i.done).length;
  }

  <template>
    <section class="todo-list">
      <h1>{{@title}}</h1>
      <form {{on "submit" this.addItem}}>
        <input
          type="text"
          placeholder="New item…"
          value={{this.newLabel}}
          {{on "input" (fn (mut this.newLabel))}}
        />
        <button type="submit">Add</button>
      </form>
      {{#if this.items.length}}
        <ul>
          {{#each this.items as |item|}}
            <TodoItem @item={{item}} @onToggle={{this.toggleItem}} />
          {{/each}}
        </ul>
        <footer>
          {{this.completedCount}} / {{this.items.length}} completed
          <button type="button" {{on "click" this.removeCompleted}}>
            Remove completed
          </button>
        </footer>
      {{else}}
        <EmptyState />
      {{/if}}
    </section>
  </template>
}
