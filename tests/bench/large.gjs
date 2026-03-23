import Component from '@glimmer/component';
import { tracked } from '@glimmer/tracking';
import { action } from '@ember/object';
import { on } from '@ember/modifier';
import { fn } from '@ember/helper';

const Avatar = <template>
  <span class="avatar avatar--{{if @size @size 'md'}}" aria-label={{@user.name}}>
    {{get @user.name 0}}
  </span>
</template>;

const Badge = <template>
  <span class="badge badge--{{@role}}">{{@role}}</span>
</template>;

const UserCard = <template>
  <article class="user-card {{if @user.active '' 'inactive'}}">
    <Avatar @user={{@user}} @size="lg" />
    <div class="user-card__info">
      <strong>{{@user.name}}</strong>
      <span>{{@user.email}}</span>
      <Badge @role={{@user.role}} />
    </div>
    <button type="button" {{on "click" (fn @onSelect @user)}}>
      Select
    </button>
  </article>
</template>;

const PostSummary = <template>
  <div class="post-summary">
    <h2>{{@post.title}}</h2>
    <p class="post-summary__meta">
      By <Avatar @user={{@author}} @size="sm" /> {{@author.name}}
      {{#if @post.publishedAt}}
        · {{@post.publishedAt}}
      {{else}}
        · <em>Draft</em>
      {{/if}}
    </p>
    <p class="post-summary__body">{{@post.body}}</p>
    <ul class="post-summary__tags">
      {{#each @post.tags as |tag|}}
        <li class="tag">{{tag}}</li>
      {{/each}}
    </ul>
  </div>
</template>;

const CommentItem = <template>
  <div class="comment">
    <Avatar @user={{@author}} @size="sm" />
    <div class="comment__content">
      <strong>{{@author.name}}</strong>
      <time>{{@comment.createdAt}}</time>
      <p>{{@comment.body}}</p>
    </div>
  </div>
</template>;

export default class Dashboard extends Component {
  @tracked selectedUser = null;
  @tracked searchQuery = '';
  @tracked activeTab = 'users';

  @action
  selectUser(user) {
    this.selectedUser = user;
  }

  @action
  clearSelection() {
    this.selectedUser = null;
  }

  @action
  setTab(tab) {
    this.activeTab = tab;
    this.selectedUser = null;
  }

  @action
  updateSearch(event) {
    this.searchQuery = event.target.value;
  }

  get filteredUsers() {
    const q = this.searchQuery.toLowerCase();
    return this.args.users.filter(
      (u) =>
        u.name.toLowerCase().includes(q) || u.email.toLowerCase().includes(q),
    );
  }

  get filteredPosts() {
    const q = this.searchQuery.toLowerCase();
    return this.args.posts.filter((p) => p.title.toLowerCase().includes(q));
  }

  get postsWithAuthors() {
    return this.filteredPosts.map((post) => ({
      post,
      author: this.args.users.find((u) => u.id === post.authorId),
    }));
  }

  get commentsWithAuthors() {
    return this.args.comments.map((comment) => ({
      comment,
      author: this.args.users.find((u) => u.id === comment.authorId),
    }));
  }

  <template>
    <main class="dashboard">
      <header class="dashboard__header">
        <h1>Dashboard</h1>
        <input
          type="search"
          placeholder="Search…"
          value={{this.searchQuery}}
          {{on "input" this.updateSearch}}
        />
      </header>

      <nav class="dashboard__tabs">
        <button
          type="button"
          class={{if (eq this.activeTab "users") "active"}}
          {{on "click" (fn this.setTab "users")}}
        >
          Users ({{this.filteredUsers.length}})
        </button>
        <button
          type="button"
          class={{if (eq this.activeTab "posts") "active"}}
          {{on "click" (fn this.setTab "posts")}}
        >
          Posts ({{this.postsWithAuthors.length}})
        </button>
        <button
          type="button"
          class={{if (eq this.activeTab "comments") "active"}}
          {{on "click" (fn this.setTab "comments")}}
        >
          Comments ({{this.args.comments.length}})
        </button>
      </nav>

      <section class="dashboard__content">
        {{#if (eq this.activeTab "users")}}
          {{#if this.selectedUser}}
            <div class="detail-panel">
              <button type="button" {{on "click" this.clearSelection}}>← Back</button>
              <UserCard @user={{this.selectedUser}} @onSelect={{this.selectUser}} />
            </div>
          {{else}}
            <div class="user-grid">
              {{#each this.filteredUsers as |user|}}
                <UserCard @user={{user}} @onSelect={{this.selectUser}} />
              {{/each}}
            </div>
          {{/if}}
        {{else if (eq this.activeTab "posts")}}
          <div class="post-list">
            {{#each this.postsWithAuthors as |entry|}}
              <PostSummary @post={{entry.post}} @author={{entry.author}} />
            {{/each}}
          </div>
        {{else}}
          <div class="comment-list">
            {{#each this.commentsWithAuthors as |entry|}}
              <CommentItem @comment={{entry.comment}} @author={{entry.author}} />
            {{/each}}
          </div>
        {{/if}}
      </section>
    </main>
  </template>
}
