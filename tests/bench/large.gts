import Component from '@glimmer/component';
import { tracked } from '@glimmer/tracking';
import { action } from '@ember/object';
import { on } from '@ember/modifier';
import { fn } from '@ember/helper';
import { inject as service } from '@ember/service';
import type { TOC } from '@ember/component/template-only';

// ── Types ─────────────────────────────────────────────────────────────────

interface User {
  id: number;
  name: string;
  email: string;
  role: 'admin' | 'editor' | 'viewer';
  active: boolean;
  department?: string;
}

interface Task {
  id: number;
  title: string;
  description?: string;
  status: 'backlog' | 'todo' | 'in-progress' | 'review' | 'done';
  priority: 'critical' | 'high' | 'medium' | 'low';
  assigneeId?: number;
  assignee?: User;
  dueDate?: string;
  labels?: string[];
  estimate?: number;
  commentCount?: number;
  overdue?: boolean;
}

interface Post {
  id: number;
  title: string;
  excerpt: string;
  body: string;
  authorId: number;
  publishedAt: Date | null;
  tags: string[];
  status: 'draft' | 'published' | 'archived';
  featured?: boolean;
  views: number;
  likes: number;
  commentCount: number;
  readTime: number;
}

interface CommentData {
  id: number;
  taskId: number;
  body: string;
  author: User;
  createdAt: Date;
  isAuthor: boolean;
  replies: CommentData[];
}

interface ActivityEntry {
  user: User;
  description: string;
  timestamp: Date;
}

interface GlobalStats {
  totalProjects: number;
  totalTasks: number;
  completedTasks: number;
  overdueTasks: number;
  teamSize: number;
  progress: number;
}

// ── Presentational Components ─────────────────────────────────────────────

const Avatar: TOC<{ Args: { user: User; size?: 'xs' | 'sm' | 'md' | 'lg' } }> = <template>
  <span class="avatar avatar--{{if @size @size 'md'}}" aria-label={{@user.name}}>
    {{get @user.name 0}}
  </span>
</template>;

const Badge: TOC<{ Args: { variant: string }; Blocks: { default: [] } }> = <template>
  <span class="badge badge--{{@variant}}">{{yield}}</span>
</template>;

const StatusDot: TOC<{ Args: { status: string } }> = <template>
  <span class="status-dot status-dot--{{@status}}" title={{@status}}></span>
</template>;

const PriorityIcon: TOC<{ Args: { level: Task['priority'] } }> = <template>
  <span class="priority-icon priority-icon--{{@level}}">
    {{#if (eq @level "critical")}}⬆⬆{{/if}}
    {{#if (eq @level "high")}}⬆{{/if}}
    {{#if (eq @level "medium")}}➡{{/if}}
    {{#if (eq @level "low")}}⬇{{/if}}
  </span>
</template>;

const ProgressBar: TOC<{ Args: { value: number; color?: string; showLabel?: boolean } }> = <template>
  <div class="progress" role="progressbar" aria-valuenow={{@value}} aria-valuemin="0" aria-valuemax="100">
    <div class="progress__bar progress__bar--{{@color}}" style="width: {{@value}}%"></div>
    {{#if @showLabel}}
      <span class="progress__label">{{@value}}%</span>
    {{/if}}
  </div>
</template>;

const Tooltip: TOC<{ Args: { text: string }; Blocks: { default: [] } }> = <template>
  <span class="tooltip" data-tooltip={{@text}}>{{yield}}</span>
</template>;

const EmptyState: TOC<{ Args: { icon: string; title: string; description: string; actionLabel?: string; onAction?: () => void } }> = <template>
  <div class="empty-state">
    <div class="empty-state__icon">{{@icon}}</div>
    <h3>{{@title}}</h3>
    <p>{{@description}}</p>
    {{#if @actionLabel}}
      <button type="button" class="btn btn--primary" {{on "click" @onAction}}>
        {{@actionLabel}}
      </button>
    {{/if}}
  </div>
</template>;

const LoadingSpinner: TOC<{ Args: { size?: string } }> = <template>
  <div class="spinner {{if @size (concat 'spinner--' @size)}}" role="status">
    <span class="sr-only">Loading…</span>
  </div>
</template>;

const Pagination: TOC<{ Args: { current: number; total: number; hasNext: boolean; hasPrevious: boolean; onNext: () => void; onPrevious: () => void } }> = <template>
  <nav class="pagination" aria-label="Pagination">
    <button
      type="button"
      class="pagination__btn"
      disabled={{not @hasPrevious}}
      {{on "click" @onPrevious}}
    >
      ← Previous
    </button>
    <span class="pagination__info">
      Page {{@current}} of {{@total}}
    </span>
    <button
      type="button"
      class="pagination__btn"
      disabled={{not @hasNext}}
      {{on "click" @onNext}}
    >
      Next →
    </button>
  </nav>
</template>;

// ── Card Components ───────────────────────────────────────────────────────

const UserCard: TOC<{ Args: { user: User; onSelect: (u: User) => void; onEdit?: (u: User) => void; onToggleStatus?: (u: User) => void } }> = <template>
  <article class="user-card {{if @user.active '' 'user-card--inactive'}}">
    <div class="user-card__header">
      <Avatar @user={{@user}} @size="lg" />
      <StatusDot @status={{if @user.active "online" "offline"}} />
    </div>
    <div class="user-card__body">
      <strong class="user-card__name">{{@user.name}}</strong>
      <span class="user-card__email">{{@user.email}}</span>
      <Badge @variant={{@user.role}}>{{@user.role}}</Badge>
      {{#if @user.department}}
        <span class="user-card__dept">{{@user.department}}</span>
      {{/if}}
    </div>
    <div class="user-card__footer">
      <Tooltip @text="View profile">
        <button type="button" class="btn btn--sm" {{on "click" (fn @onSelect @user)}}>
          View
        </button>
      </Tooltip>
      {{#if @onEdit}}
        <button type="button" class="btn btn--sm btn--outline" {{on "click" (fn @onEdit @user)}}>
          Edit
        </button>
      {{/if}}
      {{#if @onToggleStatus}}
        <button
          type="button"
          class="btn btn--sm {{if @user.active 'btn--warning' 'btn--success'}}"
          {{on "click" (fn @onToggleStatus @user)}}
        >
          {{if @user.active "Deactivate" "Activate"}}
        </button>
      {{/if}}
    </div>
  </article>
</template>;

const TaskCard: TOC<{ Args: { task: Task; assignee?: User; isDragging?: boolean; onStatusChange: (task: Task, e: Event) => void; onEdit: (task: Task) => void; onDelete: (task: Task) => void } }> = <template>
  <div class="task-card task-card--{{@task.status}} {{if @isDragging 'task-card--dragging'}}">
    <div class="task-card__header">
      <PriorityIcon @level={{@task.priority}} />
      <span class="task-card__id">#{{@task.id}}</span>
      {{#if @task.labels}}
        <div class="task-card__labels">
          {{#each @task.labels as |label|}}
            <Badge @variant="label">{{label}}</Badge>
          {{/each}}
        </div>
      {{/if}}
    </div>
    <h3 class="task-card__title">{{@task.title}}</h3>
    {{#if @task.description}}
      <p class="task-card__desc">{{@task.description}}</p>
    {{/if}}
    <div class="task-card__meta">
      {{#if @assignee}}
        <Tooltip @text={{@assignee.name}}>
          <Avatar @user={{@assignee}} @size="sm" />
        </Tooltip>
      {{/if}}
      {{#if @task.dueDate}}
        <span class="task-card__due {{if @task.overdue 'task-card__due--late'}}">
          {{@task.dueDate}}
        </span>
      {{/if}}
      {{#if @task.estimate}}
        <span class="task-card__estimate">{{@task.estimate}}h</span>
      {{/if}}
      {{#if @task.commentCount}}
        <span class="task-card__comments">💬 {{@task.commentCount}}</span>
      {{/if}}
    </div>
    <div class="task-card__actions">
      <select {{on "change" (fn @onStatusChange @task)}}>
        <option value="backlog" selected={{eq @task.status "backlog"}}>Backlog</option>
        <option value="todo" selected={{eq @task.status "todo"}}>To Do</option>
        <option value="in-progress" selected={{eq @task.status "in-progress"}}>In Progress</option>
        <option value="review" selected={{eq @task.status "review"}}>Review</option>
        <option value="done" selected={{eq @task.status "done"}}>Done</option>
      </select>
      <button type="button" class="btn btn--icon" {{on "click" (fn @onEdit @task)}}>Edit</button>
      <button type="button" class="btn btn--icon btn--danger" {{on "click" (fn @onDelete @task)}}>Delete</button>
    </div>
  </div>
</template>;

const PostSummary: TOC<{ Args: { post: Post; author: User; canEdit: boolean; onView: (post: Post) => void; onEdit: (post: Post) => void } }> = <template>
  <article class="post-summary">
    <div class="post-summary__header">
      <h2 class="post-summary__title">{{@post.title}}</h2>
      {{#if @post.featured}}
        <Badge @variant="featured">Featured</Badge>
      {{/if}}
      <Badge @variant={{@post.status}}>{{@post.status}}</Badge>
    </div>
    <p class="post-summary__meta">
      By <Avatar @user={{@author}} @size="sm" /> {{@author.name}}
      {{#if @post.publishedAt}}
        · Published {{@post.publishedAt}}
      {{else}}
        · <em>Draft</em>
      {{/if}}
      · {{@post.readTime}} min read
    </p>
    <p class="post-summary__body">{{@post.excerpt}}</p>
    {{#if @post.tags.length}}
      <ul class="post-summary__tags">
        {{#each @post.tags as |tag|}}
          <li>
            <Badge @variant="tag">{{tag}}</Badge>
          </li>
        {{/each}}
      </ul>
    {{/if}}
    <div class="post-summary__stats">
      <span>👁 {{@post.views}}</span>
      <span>❤ {{@post.likes}}</span>
      <span>💬 {{@post.commentCount}}</span>
    </div>
    <div class="post-summary__actions">
      <button type="button" class="btn btn--sm" {{on "click" (fn @onView @post)}}>
        Read More
      </button>
      {{#if @canEdit}}
        <button type="button" class="btn btn--sm btn--outline" {{on "click" (fn @onEdit @post)}}>
          Edit
        </button>
      {{/if}}
    </div>
  </article>
</template>;

const CommentThread: TOC<{ Args: { comments: CommentData[]; newCommentBody: string; onCommentInput: (e: Event) => void; onSubmitComment: (e: Event) => void; onReply: (c: CommentData) => void; onEdit: (c: CommentData) => void; onDelete: (c: CommentData) => void } }> = <template>
  <div class="comment-thread">
    {{#each @comments as |comment|}}
      <div class="comment {{if comment.isAuthor 'comment--own'}}">
        <Avatar @user={{comment.author}} @size="sm" />
        <div class="comment__body">
          <div class="comment__header">
            <strong>{{comment.author.name}}</strong>
            <time>{{comment.createdAt}}</time>
          </div>
          <p>{{comment.body}}</p>
          <div class="comment__actions">
            <button type="button" class="btn btn--link" {{on "click" (fn @onReply comment)}}>
              Reply
            </button>
            {{#if comment.isAuthor}}
              <button type="button" class="btn btn--link" {{on "click" (fn @onEdit comment)}}>
                Edit
              </button>
              <button type="button" class="btn btn--link btn--danger" {{on "click" (fn @onDelete comment)}}>
                Delete
              </button>
            {{/if}}
          </div>
          {{#if comment.replies.length}}
            <div class="comment__replies">
              {{#each comment.replies as |reply|}}
                <div class="comment comment--reply">
                  <Avatar @user={{reply.author}} @size="xs" />
                  <div class="comment__body">
                    <strong>{{reply.author.name}}</strong>
                    <time>{{reply.createdAt}}</time>
                    <p>{{reply.body}}</p>
                  </div>
                </div>
              {{/each}}
            </div>
          {{/if}}
        </div>
      </div>
    {{/each}}
    <form class="comment-form" {{on "submit" @onSubmitComment}}>
      <textarea
        placeholder="Write a comment…"
        value={{@newCommentBody}}
        {{on "input" @onCommentInput}}
      ></textarea>
      <button type="submit" class="btn btn--primary btn--sm" disabled={{not @newCommentBody}}>
        Post Comment
      </button>
    </form>
  </div>
</template>;

const ActivityFeed: TOC<{ Args: { entries: ActivityEntry[] } }> = <template>
  <div class="activity-feed">
    <h3 class="activity-feed__title">Recent Activity</h3>
    {{#each @entries as |entry|}}
      <div class="activity-feed__item">
        <Avatar @user={{entry.user}} @size="xs" />
        <div class="activity-feed__content">
          <span class="activity-feed__action">
            <strong>{{entry.user.name}}</strong>
            {{entry.description}}
          </span>
          <time class="activity-feed__time">{{entry.timestamp}}</time>
        </div>
      </div>
    {{/each}}
    {{#unless @entries.length}}
      <p class="activity-feed__empty">No recent activity</p>
    {{/unless}}
  </div>
</template>;

const KanbanColumn: TOC<{ Args: { title: string; tasks: Task[]; isDropTarget?: boolean; onDragOver?: (e: Event) => void; onDrop?: (e: Event) => void; onStatusChange: (task: Task, e: Event) => void; onEdit: (task: Task) => void; onDelete: (task: Task) => void } }> = <template>
  <div
    class="kanban-column {{if @isDropTarget 'kanban-column--drop-target'}}"
    {{on "dragover" @onDragOver}}
    {{on "drop" @onDrop}}
  >
    <div class="kanban-column__header">
      <h3>{{@title}}</h3>
      <Badge @variant="count">{{@tasks.length}}</Badge>
    </div>
    <div class="kanban-column__body">
      {{#each @tasks as |task|}}
        <TaskCard
          @task={{task}}
          @assignee={{task.assignee}}
          @onStatusChange={{@onStatusChange}}
          @onEdit={{@onEdit}}
          @onDelete={{@onDelete}}
        />
      {{/each}}
      {{#unless @tasks.length}}
        <p class="kanban-column__empty">No tasks</p>
      {{/unless}}
    </div>
  </div>
</template>;

const StatsGrid: TOC<{ Args: { stats: GlobalStats } }> = <template>
  <div class="stats-grid">
    <div class="stats-grid__card">
      <span class="stats-grid__value">{{@stats.totalProjects}}</span>
      <span class="stats-grid__label">Projects</span>
    </div>
    <div class="stats-grid__card">
      <span class="stats-grid__value">{{@stats.totalTasks}}</span>
      <span class="stats-grid__label">Tasks</span>
    </div>
    <div class="stats-grid__card">
      <span class="stats-grid__value">{{@stats.completedTasks}}</span>
      <span class="stats-grid__label">Completed</span>
    </div>
    <div class="stats-grid__card stats-grid__card--warning">
      <span class="stats-grid__value">{{@stats.overdueTasks}}</span>
      <span class="stats-grid__label">Overdue</span>
    </div>
    <div class="stats-grid__card">
      <span class="stats-grid__value">{{@stats.teamSize}}</span>
      <span class="stats-grid__label">Team Members</span>
    </div>
    <div class="stats-grid__card">
      <ProgressBar @value={{@stats.progress}} @color="success" @showLabel={{true}} />
      <span class="stats-grid__label">Overall Progress</span>
    </div>
  </div>
</template>;

const FilterPanel: TOC<{ Args: { visible: boolean; members: User[]; onStatusChange: (e: Event) => void; onPriorityChange: (e: Event) => void; onAssigneeChange: (e: Event) => void; onClear: () => void } }> = <template>
  {{#if @visible}}
    <div class="filter-panel">
      <div class="filter-panel__group">
        <label>Status</label>
        <select {{on "change" @onStatusChange}}>
          <option value="">All Statuses</option>
          <option value="backlog">Backlog</option>
          <option value="todo">To Do</option>
          <option value="in-progress">In Progress</option>
          <option value="review">Review</option>
          <option value="done">Done</option>
        </select>
      </div>
      <div class="filter-panel__group">
        <label>Priority</label>
        <select {{on "change" @onPriorityChange}}>
          <option value="">All Priorities</option>
          <option value="critical">Critical</option>
          <option value="high">High</option>
          <option value="medium">Medium</option>
          <option value="low">Low</option>
        </select>
      </div>
      <div class="filter-panel__group">
        <label>Assignee</label>
        <select {{on "change" @onAssigneeChange}}>
          <option value="">All Members</option>
          {{#each @members as |member|}}
            <option value={{member.id}}>{{member.name}}</option>
          {{/each}}
        </select>
      </div>
      <button type="button" class="btn btn--sm" {{on "click" @onClear}}>
        Clear All Filters
      </button>
    </div>
  {{/if}}
</template>;

// ── Main Component ────────────────────────────────────────────────────────

interface DashboardArgs {
  projects?: { length: number }[];
}

export default class Dashboard extends Component<{ Args: DashboardArgs }> {
  @service declare store: any;
  @service declare router: any;
  @service('notifications') declare notify: any;
  @service declare session: any;

  @tracked users: User[] = [];
  @tracked tasks: Task[] = [];
  @tracked posts: Post[] = [];
  @tracked comments: CommentData[] = [];
  @tracked activityEntries: ActivityEntry[] = [];
  @tracked selectedUser: User | null = null;
  @tracked selectedTask: Task | null = null;
  @tracked searchQuery = '';
  @tracked activeTab = 'overview';
  @tracked isLoading = false;
  @tracked currentPage = 1;
  @tracked pageSize = 20;
  @tracked showFilters = false;
  @tracked filterStatus: string | null = null;
  @tracked filterPriority: string | null = null;
  @tracked filterAssignee: string | null = null;
  @tracked newCommentBody = '';
  @tracked viewMode: 'list' | 'board' = 'list';

  get filteredUsers(): User[] {
    if (!this.searchQuery) return this.users;
    const q = this.searchQuery.toLowerCase();
    return this.users.filter(
      (u) => u.name.toLowerCase().includes(q) || u.email.toLowerCase().includes(q),
    );
  }

  get filteredTasks(): Task[] {
    let result = this.tasks;
    if (this.searchQuery) {
      const q = this.searchQuery.toLowerCase();
      result = result.filter((t) => t.title.toLowerCase().includes(q));
    }
    if (this.filterStatus) result = result.filter((t) => t.status === this.filterStatus);
    if (this.filterPriority) result = result.filter((t) => t.priority === this.filterPriority);
    if (this.filterAssignee) result = result.filter((t) => t.assigneeId === Number(this.filterAssignee));
    return result;
  }

  get tasksByStatus(): Record<string, Task[]> {
    return {
      backlog: this.filteredTasks.filter((t) => t.status === 'backlog'),
      todo: this.filteredTasks.filter((t) => t.status === 'todo'),
      inProgress: this.filteredTasks.filter((t) => t.status === 'in-progress'),
      review: this.filteredTasks.filter((t) => t.status === 'review'),
      done: this.filteredTasks.filter((t) => t.status === 'done'),
    };
  }

  get filteredPosts(): Post[] {
    if (!this.searchQuery) return this.posts;
    const q = this.searchQuery.toLowerCase();
    return this.posts.filter((p) => p.title.toLowerCase().includes(q));
  }

  get postsWithAuthors(): Array<{ post: Post; author: User | undefined }> {
    return this.filteredPosts.map((post) => ({
      post,
      author: this.users.find((u) => u.id === post.authorId),
    }));
  }

  get paginatedItems(): Array<User | Task> {
    const items = this.activeTab === 'users' ? this.filteredUsers : this.filteredTasks;
    const start = (this.currentPage - 1) * this.pageSize;
    return items.slice(start, start + this.pageSize);
  }

  get totalPages(): number {
    const items = this.activeTab === 'users' ? this.filteredUsers : this.filteredTasks;
    return Math.ceil(items.length / this.pageSize);
  }

  get hasNextPage(): boolean { return this.currentPage < this.totalPages; }
  get hasPreviousPage(): boolean { return this.currentPage > 1; }

  get globalStats(): GlobalStats {
    return {
      totalProjects: this.args.projects?.length || 0,
      totalTasks: this.tasks.length,
      completedTasks: this.tasks.filter((t) => t.status === 'done').length,
      overdueTasks: this.tasks.filter(
        (t) => t.dueDate && new Date(t.dueDate) < new Date() && t.status !== 'done',
      ).length,
      teamSize: this.users.length,
      progress:
        this.tasks.length > 0
          ? Math.round(
              (this.tasks.filter((t) => t.status === 'done').length / this.tasks.length) * 100,
            )
          : 0,
    };
  }

  get selectedTaskComments(): CommentData[] {
    if (!this.selectedTask) return [];
    return this.comments.filter((c) => c.taskId === this.selectedTask!.id);
  }

  get canEditPost(): boolean {
    return this.session.currentUser?.role === 'admin' || this.session.currentUser?.role === 'editor';
  }

  @action selectUser(user: User) { this.selectedUser = user; }
  @action clearSelection() { this.selectedUser = null; }
  @action selectTask(task: Task) { this.selectedTask = task; }
  @action clearTaskSelection() { this.selectedTask = null; }
  @action setTab(tab: string) { this.activeTab = tab; this.currentPage = 1; this.selectedUser = null; this.selectedTask = null; }
  @action updateSearch(event: Event) { this.searchQuery = (event.target as HTMLInputElement).value; this.currentPage = 1; }
  @action toggleFilters() { this.showFilters = !this.showFilters; }
  @action setFilterStatus(event: Event) { this.filterStatus = (event.target as HTMLSelectElement).value || null; this.currentPage = 1; }
  @action setFilterPriority(event: Event) { this.filterPriority = (event.target as HTMLSelectElement).value || null; this.currentPage = 1; }
  @action setFilterAssignee(event: Event) { this.filterAssignee = (event.target as HTMLSelectElement).value || null; this.currentPage = 1; }
  @action clearFilters() { this.filterStatus = null; this.filterPriority = null; this.filterAssignee = null; this.currentPage = 1; }
  @action nextPage() { if (this.hasNextPage) this.currentPage++; }
  @action previousPage() { if (this.hasPreviousPage) this.currentPage--; }
  @action editUser(user: User) { this.notify.info(`Editing ${user.name}`); }
  @action toggleUserStatus(user: User) { user.active = !user.active; }
  @action editTask(task: Task) { this.notify.info(`Editing task #${task.id}`); }
  @action deleteTask(task: Task) { this.tasks = this.tasks.filter((t) => t !== task); }
  @action changeTaskStatus(task: Task, event: Event) { task.status = (event.target as HTMLSelectElement).value as Task['status']; }
  @action viewPost(post: Post) { this.router.transitionTo('posts.show', post.id); }
  @action editPost(post: Post) { this.router.transitionTo('posts.edit', post.id); }
  @action replyToComment(comment: CommentData) { this.newCommentBody = `@${comment.author.name} `; }
  @action editComment(comment: CommentData) { this.notify.info('Editing comment'); }
  @action deleteComment(comment: CommentData) { this.comments = this.comments.filter((c) => c !== comment); }
  @action updateCommentInput(event: Event) { this.newCommentBody = (event.target as HTMLTextAreaElement).value; }
  @action submitComment(event: Event) {
    event.preventDefault();
    if (!this.newCommentBody.trim() || !this.selectedTask) return;
    this.comments = [...this.comments, { id: Date.now(), taskId: this.selectedTask.id, body: this.newCommentBody, author: this.session.currentUser, createdAt: new Date(), isAuthor: true, replies: [] }];
    this.newCommentBody = '';
  }
  @action setViewMode(mode: 'list' | 'board') { this.viewMode = mode; }

  <template>
    <main class="dashboard">
      <header class="dashboard__header">
        <h1>Dashboard</h1>
        <div class="dashboard__toolbar">
          <input
            type="search"
            placeholder="Search…"
            value={{this.searchQuery}}
            {{on "input" this.updateSearch}}
          />
          <button type="button" class="btn btn--sm" {{on "click" this.toggleFilters}}>
            Filters {{if this.showFilters "▲" "▼"}}
          </button>
          <div class="dashboard__view-toggle">
            <button type="button" class={{if (eq this.viewMode "list") "active"}} {{on "click" (fn this.setViewMode "list")}}>List</button>
            <button type="button" class={{if (eq this.viewMode "board") "active"}} {{on "click" (fn this.setViewMode "board")}}>Board</button>
          </div>
        </div>
      </header>

      <FilterPanel
        @visible={{this.showFilters}}
        @members={{this.users}}
        @onStatusChange={{this.setFilterStatus}}
        @onPriorityChange={{this.setFilterPriority}}
        @onAssigneeChange={{this.setFilterAssignee}}
        @onClear={{this.clearFilters}}
      />

      <nav class="dashboard__tabs">
        <button type="button" class={{if (eq this.activeTab "overview") "active"}} {{on "click" (fn this.setTab "overview")}}>
          Overview
        </button>
        <button type="button" class={{if (eq this.activeTab "tasks") "active"}} {{on "click" (fn this.setTab "tasks")}}>
          Tasks ({{this.filteredTasks.length}})
        </button>
        <button type="button" class={{if (eq this.activeTab "users") "active"}} {{on "click" (fn this.setTab "users")}}>
          Users ({{this.filteredUsers.length}})
        </button>
        <button type="button" class={{if (eq this.activeTab "posts") "active"}} {{on "click" (fn this.setTab "posts")}}>
          Posts ({{this.postsWithAuthors.length}})
        </button>
        <button type="button" class={{if (eq this.activeTab "activity") "active"}} {{on "click" (fn this.setTab "activity")}}>
          Activity
        </button>
      </nav>

      <section class="dashboard__content">
        {{#if this.isLoading}}
          <LoadingSpinner @size="lg" />
        {{else if (eq this.activeTab "overview")}}
          <StatsGrid @stats={{this.globalStats}} />
          <div class="dashboard__overview-columns">
            <div class="dashboard__overview-main">
              <h2>Upcoming Deadlines</h2>
              {{#each this.filteredTasks as |task|}}
                {{#if task.dueDate}}
                  <TaskCard
                    @task={{task}}
                    @assignee={{task.assignee}}
                    @onStatusChange={{this.changeTaskStatus}}
                    @onEdit={{this.editTask}}
                    @onDelete={{this.deleteTask}}
                  />
                {{/if}}
              {{/each}}
            </div>
            <div class="dashboard__overview-sidebar">
              <ActivityFeed @entries={{this.activityEntries}} />
            </div>
          </div>

        {{else if (eq this.activeTab "tasks")}}
          {{#if (eq this.viewMode "board")}}
            <div class="kanban">
              <KanbanColumn @title="Backlog" @tasks={{this.tasksByStatus.backlog}} @onStatusChange={{this.changeTaskStatus}} @onEdit={{this.editTask}} @onDelete={{this.deleteTask}} />
              <KanbanColumn @title="To Do" @tasks={{this.tasksByStatus.todo}} @onStatusChange={{this.changeTaskStatus}} @onEdit={{this.editTask}} @onDelete={{this.deleteTask}} />
              <KanbanColumn @title="In Progress" @tasks={{this.tasksByStatus.inProgress}} @onStatusChange={{this.changeTaskStatus}} @onEdit={{this.editTask}} @onDelete={{this.deleteTask}} />
              <KanbanColumn @title="Review" @tasks={{this.tasksByStatus.review}} @onStatusChange={{this.changeTaskStatus}} @onEdit={{this.editTask}} @onDelete={{this.deleteTask}} />
              <KanbanColumn @title="Done" @tasks={{this.tasksByStatus.done}} @onStatusChange={{this.changeTaskStatus}} @onEdit={{this.editTask}} @onDelete={{this.deleteTask}} />
            </div>
          {{else}}
            <div class="task-list">
              {{#each this.paginatedItems as |task|}}
                <TaskCard
                  @task={{task}}
                  @assignee={{task.assignee}}
                  @onStatusChange={{this.changeTaskStatus}}
                  @onEdit={{this.editTask}}
                  @onDelete={{this.deleteTask}}
                />
              {{/each}}
              {{#unless this.filteredTasks.length}}
                <EmptyState @icon="📋" @title="No tasks found" @description="Try adjusting your filters or create a new task." />
              {{/unless}}
            </div>
            <Pagination @current={{this.currentPage}} @total={{this.totalPages}} @hasNext={{this.hasNextPage}} @hasPrevious={{this.hasPreviousPage}} @onNext={{this.nextPage}} @onPrevious={{this.previousPage}} />
          {{/if}}

          {{#if this.selectedTask}}
            <aside class="task-detail">
              <button type="button" class="btn btn--sm" {{on "click" this.clearTaskSelection}}>← Back</button>
              <TaskCard @task={{this.selectedTask}} @assignee={{this.selectedTask.assignee}} @onStatusChange={{this.changeTaskStatus}} @onEdit={{this.editTask}} @onDelete={{this.deleteTask}} />
              <CommentThread
                @comments={{this.selectedTaskComments}}
                @newCommentBody={{this.newCommentBody}}
                @onCommentInput={{this.updateCommentInput}}
                @onSubmitComment={{this.submitComment}}
                @onReply={{this.replyToComment}}
                @onEdit={{this.editComment}}
                @onDelete={{this.deleteComment}}
              />
            </aside>
          {{/if}}

        {{else if (eq this.activeTab "users")}}
          {{#if this.selectedUser}}
            <div class="detail-panel">
              <button type="button" {{on "click" this.clearSelection}}>← Back</button>
              <UserCard @user={{this.selectedUser}} @onSelect={{this.selectUser}} @onEdit={{this.editUser}} @onToggleStatus={{this.toggleUserStatus}} />
            </div>
          {{else}}
            <div class="user-grid">
              {{#each this.paginatedItems as |user|}}
                <UserCard @user={{user}} @onSelect={{this.selectUser}} @onEdit={{this.editUser}} @onToggleStatus={{this.toggleUserStatus}} />
              {{/each}}
            </div>
            <Pagination @current={{this.currentPage}} @total={{this.totalPages}} @hasNext={{this.hasNextPage}} @hasPrevious={{this.hasPreviousPage}} @onNext={{this.nextPage}} @onPrevious={{this.previousPage}} />
          {{/if}}

        {{else if (eq this.activeTab "posts")}}
          <div class="post-list">
            {{#each this.postsWithAuthors as |entry|}}
              <PostSummary @post={{entry.post}} @author={{entry.author}} @canEdit={{this.canEditPost}} @onView={{this.viewPost}} @onEdit={{this.editPost}} />
            {{/each}}
            {{#unless this.postsWithAuthors.length}}
              <EmptyState @icon="📝" @title="No posts found" @description="Try adjusting your search or create a new post." />
            {{/unless}}
          </div>

        {{else if (eq this.activeTab "activity")}}
          <ActivityFeed @entries={{this.activityEntries}} />
        {{/if}}
      </section>
    </main>
  </template>
}
