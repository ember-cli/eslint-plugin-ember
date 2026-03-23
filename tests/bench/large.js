import Component from '@glimmer/component';
import { tracked } from '@glimmer/tracking';
import { action } from '@ember/object';
import { inject as service } from '@ember/service';
import { later, cancel } from '@ember/runloop';
import { A } from '@ember/array';

export default class DashboardComponent extends Component {
  @service store;
  @service router;
  @service('notifications') notify;
  @service intl;
  @service session;

  @tracked users = [];
  @tracked posts = [];
  @tracked comments = [];
  @tracked selectedUser = null;
  @tracked searchQuery = '';
  @tracked activeTab = 'users';
  @tracked isLoading = false;
  @tracked sortField = 'name';
  @tracked sortDirection = 'asc';
  @tracked currentPage = 1;
  @tracked pageSize = 25;
  @tracked totalRecords = 0;
  @tracked showFilters = false;
  @tracked filterRole = null;
  @tracked filterStatus = null;
  @tracked dateRange = null;
  @tracked errorMessage = null;

  get filteredUsers() {
    let result = this.users;

    if (this.searchQuery) {
      const q = this.searchQuery.toLowerCase();
      result = result.filter(
        (u) =>
          u.name.toLowerCase().includes(q) || u.email.toLowerCase().includes(q),
      );
    }

    if (this.filterRole) {
      result = result.filter((u) => u.role === this.filterRole);
    }

    if (this.filterStatus !== null) {
      result = result.filter((u) => u.active === this.filterStatus);
    }

    return result;
  }

  get sortedUsers() {
    const sorted = [...this.filteredUsers].sort((a, b) => {
      const aVal = a[this.sortField];
      const bVal = b[this.sortField];
      if (aVal < bVal) return -1;
      if (aVal > bVal) return 1;
      return 0;
    });

    return this.sortDirection === 'desc' ? sorted.reverse() : sorted;
  }

  get paginatedUsers() {
    const start = (this.currentPage - 1) * this.pageSize;
    return this.sortedUsers.slice(start, start + this.pageSize);
  }

  get totalPages() {
    return Math.ceil(this.sortedUsers.length / this.pageSize);
  }

  get hasNextPage() {
    return this.currentPage < this.totalPages;
  }

  get hasPreviousPage() {
    return this.currentPage > 1;
  }

  get filteredPosts() {
    if (!this.searchQuery) return this.posts;
    const q = this.searchQuery.toLowerCase();
    return this.posts.filter(
      (p) =>
        p.title.toLowerCase().includes(q) ||
        p.body.toLowerCase().includes(q),
    );
  }

  get postsWithAuthors() {
    return this.filteredPosts.map((post) => ({
      post,
      author: this.users.find((u) => u.id === post.authorId),
    }));
  }

  get commentsWithAuthors() {
    return this.comments.map((comment) => ({
      comment,
      author: this.users.find((u) => u.id === comment.authorId),
    }));
  }

  get userStats() {
    return {
      total: this.users.length,
      active: this.users.filter((u) => u.active).length,
      admins: this.users.filter((u) => u.role === 'admin').length,
      editors: this.users.filter((u) => u.role === 'editor').length,
      viewers: this.users.filter((u) => u.role === 'viewer').length,
    };
  }

  get postStats() {
    return {
      total: this.posts.length,
      published: this.posts.filter((p) => p.publishedAt).length,
      drafts: this.posts.filter((p) => !p.publishedAt).length,
    };
  }

  get isUsersTab() {
    return this.activeTab === 'users';
  }

  get isPostsTab() {
    return this.activeTab === 'posts';
  }

  get isCommentsTab() {
    return this.activeTab === 'comments';
  }

  get isStatsTab() {
    return this.activeTab === 'stats';
  }

  @action
  async loadData() {
    this.isLoading = true;
    this.errorMessage = null;

    try {
      const [users, posts, comments] = await Promise.all([
        this.store.findAll('user'),
        this.store.findAll('post'),
        this.store.findAll('comment'),
      ]);
      this.users = users.slice();
      this.posts = posts.slice();
      this.comments = comments.slice();
      this.totalRecords = users.length + posts.length + comments.length;
    } catch (error) {
      this.errorMessage = error.message;
      this.notify.error('Failed to load dashboard data');
    } finally {
      this.isLoading = false;
    }
  }

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
    this.currentPage = 1;
  }

  @action
  updateSearch(event) {
    this.searchQuery = event.target.value;
    this.currentPage = 1;
  }

  @action
  clearSearch() {
    this.searchQuery = '';
    this.currentPage = 1;
  }

  @action
  toggleFilters() {
    this.showFilters = !this.showFilters;
  }

  @action
  setFilterRole(role) {
    this.filterRole = role;
    this.currentPage = 1;
  }

  @action
  setFilterStatus(status) {
    this.filterStatus = status;
    this.currentPage = 1;
  }

  @action
  clearFilters() {
    this.filterRole = null;
    this.filterStatus = null;
    this.dateRange = null;
    this.currentPage = 1;
  }

  @action
  setSortField(field) {
    if (this.sortField === field) {
      this.sortDirection = this.sortDirection === 'asc' ? 'desc' : 'asc';
    } else {
      this.sortField = field;
      this.sortDirection = 'asc';
    }
  }

  @action
  nextPage() {
    if (this.hasNextPage) {
      this.currentPage++;
    }
  }

  @action
  previousPage() {
    if (this.hasPreviousPage) {
      this.currentPage--;
    }
  }

  @action
  goToPage(page) {
    this.currentPage = Math.max(1, Math.min(page, this.totalPages));
  }

  @action
  async deleteUser(user) {
    try {
      this.users = this.users.filter((u) => u !== user);
      await user.destroyRecord();
      this.notify.success(`User ${user.name} deleted`);
    } catch (error) {
      this.users = [...this.users, user];
      this.notify.error('Failed to delete user');
    }
  }

  @action
  async toggleUserStatus(user) {
    user.active = !user.active;
    try {
      await user.save();
    } catch (error) {
      user.active = !user.active;
      this.notify.error('Failed to update user status');
    }
  }

  @action
  async createPost(title, body) {
    const post = this.store.createRecord('post', {
      title,
      body,
      authorId: this.session.currentUser.id,
      publishedAt: null,
      tags: [],
    });

    try {
      await post.save();
      this.posts = [...this.posts, post];
      this.notify.success('Post created');
    } catch (error) {
      post.rollbackAttributes();
      this.notify.error('Failed to create post');
    }
  }

  @action
  async publishPost(post) {
    post.publishedAt = new Date();
    try {
      await post.save();
      this.notify.success('Post published');
    } catch (error) {
      post.publishedAt = null;
      this.notify.error('Failed to publish post');
    }
  }

  @action
  async deletePost(post) {
    try {
      this.posts = this.posts.filter((p) => p !== post);
      await post.destroyRecord();
      this.notify.success('Post deleted');
    } catch (error) {
      this.posts = [...this.posts, post];
      this.notify.error('Failed to delete post');
    }
  }

  @action
  exportData() {
    const data = {
      users: this.users.map((u) => ({
        name: u.name,
        email: u.email,
        role: u.role,
        active: u.active,
      })),
      posts: this.posts.map((p) => ({
        title: p.title,
        body: p.body,
        published: Boolean(p.publishedAt),
      })),
      exportedAt: new Date().toISOString(),
    };

    return JSON.stringify(data, null, 2);
  }
}
