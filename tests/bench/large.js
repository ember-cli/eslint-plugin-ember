import Component from '@glimmer/component';
import { tracked } from '@glimmer/tracking';
import { action } from '@ember/object';
import { inject as service } from '@ember/service';
import { later, cancel } from '@ember/runloop';
import { A } from '@ember/array';

export default class ProjectDashboardComponent extends Component {
  @service store;
  @service router;
  @service('notifications') notify;
  @service intl;
  @service session;
  @service('analytics') tracking;

  @tracked projects = [];
  @tracked tasks = [];
  @tracked users = [];
  @tracked comments = [];
  @tracked selectedProject = null;
  @tracked selectedTask = null;
  @tracked searchQuery = '';
  @tracked activeTab = 'overview';
  @tracked isLoading = false;
  @tracked sortField = 'name';
  @tracked sortDirection = 'asc';
  @tracked currentPage = 1;
  @tracked pageSize = 25;
  @tracked totalRecords = 0;
  @tracked showFilters = false;
  @tracked filterStatus = null;
  @tracked filterAssignee = null;
  @tracked filterPriority = null;
  @tracked dateRange = null;
  @tracked errorMessage = null;
  @tracked showCreateModal = false;
  @tracked showEditModal = false;
  @tracked editingEntity = null;

  @tracked newProjectName = '';
  @tracked newProjectDescription = '';
  @tracked newProjectColor = '#3B82F6';
  @tracked newProjectDeadline = null;

  @tracked newTaskTitle = '';
  @tracked newTaskDescription = '';
  @tracked newTaskPriority = 'medium';
  @tracked newTaskAssignee = null;
  @tracked newTaskDueDate = null;
  @tracked newTaskLabels = [];
  @tracked newTaskEstimate = null;

  @tracked draggedTask = null;
  @tracked dragOverColumn = null;

  @tracked viewMode = 'list';
  @tracked showCompletedTasks = true;
  @tracked groupBy = 'status';
  @tracked isCollapsed = {};

  @tracked activityLog = [];
  @tracked showActivitySidebar = false;

  @tracked timeEntries = [];
  @tracked activeTimer = null;
  @tracked timerElapsed = 0;
  _timerInterval = null;

  // ── Computed: Projects ──────────────────────────────────────────────────

  get filteredProjects() {
    let result = this.projects;

    if (this.searchQuery) {
      const q = this.searchQuery.toLowerCase();
      result = result.filter(
        (p) =>
          p.name.toLowerCase().includes(q) ||
          (p.description && p.description.toLowerCase().includes(q)),
      );
    }

    if (this.filterStatus) {
      result = result.filter((p) => p.status === this.filterStatus);
    }

    return result;
  }

  get sortedProjects() {
    const sorted = [...this.filteredProjects].sort((a, b) => {
      const aVal = a[this.sortField];
      const bVal = b[this.sortField];
      if (aVal < bVal) return -1;
      if (aVal > bVal) return 1;
      return 0;
    });
    return this.sortDirection === 'desc' ? sorted.reverse() : sorted;
  }

  get paginatedProjects() {
    const start = (this.currentPage - 1) * this.pageSize;
    return this.sortedProjects.slice(start, start + this.pageSize);
  }

  get totalPages() {
    return Math.ceil(this.sortedProjects.length / this.pageSize);
  }

  get hasNextPage() {
    return this.currentPage < this.totalPages;
  }

  get hasPreviousPage() {
    return this.currentPage > 1;
  }

  // ── Computed: Tasks ─────────────────────────────────────────────────────

  get currentProjectTasks() {
    if (!this.selectedProject) return this.tasks;
    return this.tasks.filter((t) => t.projectId === this.selectedProject.id);
  }

  get filteredTasks() {
    let result = this.currentProjectTasks;

    if (!this.showCompletedTasks) {
      result = result.filter((t) => t.status !== 'done');
    }

    if (this.searchQuery) {
      const q = this.searchQuery.toLowerCase();
      result = result.filter(
        (t) =>
          t.title.toLowerCase().includes(q) ||
          (t.description && t.description.toLowerCase().includes(q)),
      );
    }

    if (this.filterAssignee) {
      result = result.filter((t) => t.assigneeId === this.filterAssignee);
    }

    if (this.filterPriority) {
      result = result.filter((t) => t.priority === this.filterPriority);
    }

    if (this.filterStatus) {
      result = result.filter((t) => t.status === this.filterStatus);
    }

    if (this.dateRange) {
      result = result.filter((t) => {
        if (!t.dueDate) return false;
        const due = new Date(t.dueDate);
        return due >= this.dateRange.start && due <= this.dateRange.end;
      });
    }

    return result;
  }

  get groupedTasks() {
    const groups = {};
    for (const task of this.filteredTasks) {
      const key = task[this.groupBy] || 'none';
      if (!groups[key]) groups[key] = [];
      groups[key].push(task);
    }
    return groups;
  }

  get tasksByStatus() {
    return {
      backlog: this.filteredTasks.filter((t) => t.status === 'backlog'),
      todo: this.filteredTasks.filter((t) => t.status === 'todo'),
      inProgress: this.filteredTasks.filter((t) => t.status === 'in-progress'),
      review: this.filteredTasks.filter((t) => t.status === 'review'),
      done: this.filteredTasks.filter((t) => t.status === 'done'),
    };
  }

  get overdueTasks() {
    return this.filteredTasks.filter(
      (t) => t.dueDate && new Date(t.dueDate) < new Date() && t.status !== 'done',
    );
  }

  get upcomingDeadlines() {
    const nextWeek = new Date();
    nextWeek.setDate(nextWeek.getDate() + 7);
    return this.filteredTasks
      .filter(
        (t) =>
          t.dueDate &&
          new Date(t.dueDate) >= new Date() &&
          new Date(t.dueDate) <= nextWeek &&
          t.status !== 'done',
      )
      .sort((a, b) => new Date(a.dueDate) - new Date(b.dueDate));
  }

  // ── Computed: Users & Stats ─────────────────────────────────────────────

  get projectMembers() {
    if (!this.selectedProject) return this.users;
    return this.users.filter((u) =>
      this.selectedProject.memberIds.includes(u.id),
    );
  }

  get taskAssignmentMap() {
    const map = {};
    for (const user of this.projectMembers) {
      map[user.id] = this.currentProjectTasks.filter(
        (t) => t.assigneeId === user.id,
      );
    }
    return map;
  }

  get projectStats() {
    const tasks = this.currentProjectTasks;
    const total = tasks.length;
    const done = tasks.filter((t) => t.status === 'done').length;
    const inProgress = tasks.filter((t) => t.status === 'in-progress').length;
    const overdue = this.overdueTasks.length;
    const totalEstimate = tasks.reduce((sum, t) => sum + (t.estimate || 0), 0);
    const completedEstimate = tasks
      .filter((t) => t.status === 'done')
      .reduce((sum, t) => sum + (t.estimate || 0), 0);

    return {
      total,
      done,
      inProgress,
      overdue,
      progress: total > 0 ? Math.round((done / total) * 100) : 0,
      velocity: completedEstimate,
      remaining: totalEstimate - completedEstimate,
    };
  }

  get globalStats() {
    return {
      totalProjects: this.projects.length,
      activeProjects: this.projects.filter((p) => p.status === 'active').length,
      totalTasks: this.tasks.length,
      completedTasks: this.tasks.filter((t) => t.status === 'done').length,
      overdueTasks: this.overdueTasks.length,
      teamSize: this.users.length,
    };
  }

  get burndownData() {
    const tasks = this.currentProjectTasks;
    const total = tasks.length;
    const byDate = {};

    for (const task of tasks) {
      if (task.completedAt) {
        const dateKey = new Date(task.completedAt).toISOString().slice(0, 10);
        byDate[dateKey] = (byDate[dateKey] || 0) + 1;
      }
    }

    let remaining = total;
    const dates = Object.keys(byDate).sort();
    return dates.map((date) => {
      remaining -= byDate[date];
      return { date, remaining, completed: byDate[date] };
    });
  }

  // ── Computed: Time Tracking ─────────────────────────────────────────────

  get totalTimeSpent() {
    return this.timeEntries.reduce((sum, entry) => sum + entry.duration, 0);
  }

  get timeByTask() {
    const map = {};
    for (const entry of this.timeEntries) {
      if (!map[entry.taskId]) map[entry.taskId] = 0;
      map[entry.taskId] += entry.duration;
    }
    return map;
  }

  get timeByUser() {
    const map = {};
    for (const entry of this.timeEntries) {
      if (!map[entry.userId]) map[entry.userId] = 0;
      map[entry.userId] += entry.duration;
    }
    return map;
  }

  get isTimerRunning() {
    return this.activeTimer !== null;
  }

  // ── Computed: Navigation ────────────────────────────────────────────────

  get isOverviewTab() {
    return this.activeTab === 'overview';
  }

  get isTasksTab() {
    return this.activeTab === 'tasks';
  }

  get isBoardTab() {
    return this.activeTab === 'board';
  }

  get isTimelineTab() {
    return this.activeTab === 'timeline';
  }

  get isMembersTab() {
    return this.activeTab === 'members';
  }

  get isSettingsTab() {
    return this.activeTab === 'settings';
  }

  get isActivityTab() {
    return this.activeTab === 'activity';
  }

  // ── Actions: Data Loading ───────────────────────────────────────────────

  @action
  async loadData() {
    this.isLoading = true;
    this.errorMessage = null;

    try {
      const [projects, tasks, users, comments] = await Promise.all([
        this.store.findAll('project'),
        this.store.findAll('task'),
        this.store.findAll('user'),
        this.store.findAll('comment'),
      ]);
      this.projects = projects.slice();
      this.tasks = tasks.slice();
      this.users = users.slice();
      this.comments = comments.slice();
      this.totalRecords = projects.length + tasks.length;
      this.tracking.track('dashboard_loaded', { projectCount: projects.length });
    } catch (error) {
      this.errorMessage = error.message;
      this.notify.error('Failed to load dashboard data');
    } finally {
      this.isLoading = false;
    }
  }

  @action
  async refreshData() {
    await this.loadData();
    this.notify.info('Data refreshed');
  }

  // ── Actions: Project CRUD ───────────────────────────────────────────────

  @action
  selectProject(project) {
    this.selectedProject = project;
    this.selectedTask = null;
    this.currentPage = 1;
    this.tracking.track('project_selected', { projectId: project.id });
  }

  @action
  clearProjectSelection() {
    this.selectedProject = null;
    this.selectedTask = null;
  }

  @action
  async createProject() {
    const name = this.newProjectName.trim();
    if (!name) return;

    const project = this.store.createRecord('project', {
      name,
      description: this.newProjectDescription.trim(),
      color: this.newProjectColor,
      deadline: this.newProjectDeadline,
      status: 'active',
      memberIds: [this.session.currentUser.id],
      createdAt: new Date(),
    });

    try {
      await project.save();
      this.projects = [...this.projects, project];
      this._resetProjectForm();
      this.showCreateModal = false;
      this.notify.success(`Project "${name}" created`);
      this.tracking.track('project_created', { projectId: project.id });
    } catch (error) {
      project.rollbackAttributes();
      this.notify.error('Failed to create project');
    }
  }

  @action
  async updateProject(project, changes) {
    const original = {};
    for (const [key, value] of Object.entries(changes)) {
      original[key] = project[key];
      project[key] = value;
    }

    try {
      await project.save();
      this._logActivity('project_updated', project);
      this.notify.success('Project updated');
    } catch (error) {
      for (const [key, value] of Object.entries(original)) {
        project[key] = value;
      }
      this.notify.error('Failed to update project');
    }
  }

  @action
  async deleteProject(project) {
    try {
      const projectTasks = this.tasks.filter((t) => t.projectId === project.id);
      this.projects = this.projects.filter((p) => p !== project);
      this.tasks = this.tasks.filter((t) => t.projectId !== project.id);

      if (this.selectedProject === project) {
        this.selectedProject = null;
      }

      await Promise.all(projectTasks.map((t) => t.destroyRecord()));
      await project.destroyRecord();
      this.notify.success(`Project "${project.name}" deleted`);
    } catch (error) {
      this.projects = [...this.projects, project];
      this.notify.error('Failed to delete project');
    }
  }

  @action
  async archiveProject(project) {
    project.status = 'archived';
    try {
      await project.save();
      this.notify.success(`Project "${project.name}" archived`);
    } catch (error) {
      project.status = 'active';
      this.notify.error('Failed to archive project');
    }
  }

  // ── Actions: Task CRUD ──────────────────────────────────────────────────

  @action
  selectTask(task) {
    this.selectedTask = task;
  }

  @action
  clearTaskSelection() {
    this.selectedTask = null;
  }

  @action
  async createTask() {
    const title = this.newTaskTitle.trim();
    if (!title) return;

    const task = this.store.createRecord('task', {
      title,
      description: this.newTaskDescription.trim(),
      priority: this.newTaskPriority,
      assigneeId: this.newTaskAssignee,
      dueDate: this.newTaskDueDate,
      labels: [...this.newTaskLabels],
      estimate: this.newTaskEstimate,
      projectId: this.selectedProject?.id,
      status: 'todo',
      createdAt: new Date(),
      createdBy: this.session.currentUser.id,
    });

    try {
      await task.save();
      this.tasks = [...this.tasks, task];
      this._resetTaskForm();
      this.showCreateModal = false;
      this._logActivity('task_created', task);
      this.notify.success(`Task "${title}" created`);
    } catch (error) {
      task.rollbackAttributes();
      this.notify.error('Failed to create task');
    }
  }

  @action
  async updateTaskStatus(task, newStatus) {
    const oldStatus = task.status;
    task.status = newStatus;

    if (newStatus === 'done') {
      task.completedAt = new Date();
    } else if (oldStatus === 'done') {
      task.completedAt = null;
    }

    try {
      await task.save();
      this._logActivity('task_status_changed', task, { from: oldStatus, to: newStatus });
    } catch (error) {
      task.status = oldStatus;
      this.notify.error('Failed to update task status');
    }
  }

  @action
  async assignTask(task, userId) {
    const oldAssignee = task.assigneeId;
    task.assigneeId = userId;

    try {
      await task.save();
      this._logActivity('task_assigned', task, { assignee: userId });
    } catch (error) {
      task.assigneeId = oldAssignee;
      this.notify.error('Failed to assign task');
    }
  }

  @action
  async updateTaskPriority(task, priority) {
    const oldPriority = task.priority;
    task.priority = priority;

    try {
      await task.save();
      this._logActivity('task_priority_changed', task, { from: oldPriority, to: priority });
    } catch (error) {
      task.priority = oldPriority;
      this.notify.error('Failed to update priority');
    }
  }

  @action
  async deleteTask(task) {
    try {
      this.tasks = this.tasks.filter((t) => t !== task);
      if (this.selectedTask === task) {
        this.selectedTask = null;
      }
      await task.destroyRecord();
      this._logActivity('task_deleted', task);
      this.notify.success('Task deleted');
    } catch (error) {
      this.tasks = [...this.tasks, task];
      this.notify.error('Failed to delete task');
    }
  }

  @action
  async duplicateTask(task) {
    const newTask = this.store.createRecord('task', {
      title: `${task.title} (copy)`,
      description: task.description,
      priority: task.priority,
      assigneeId: task.assigneeId,
      dueDate: task.dueDate,
      labels: [...(task.labels || [])],
      estimate: task.estimate,
      projectId: task.projectId,
      status: 'todo',
      createdAt: new Date(),
      createdBy: this.session.currentUser.id,
    });

    try {
      await newTask.save();
      this.tasks = [...this.tasks, newTask];
      this.notify.success('Task duplicated');
    } catch (error) {
      newTask.rollbackAttributes();
      this.notify.error('Failed to duplicate task');
    }
  }

  @action
  async addTaskLabel(task, label) {
    task.labels = [...(task.labels || []), label];
    await task.save();
  }

  @action
  async removeTaskLabel(task, label) {
    task.labels = (task.labels || []).filter((l) => l !== label);
    await task.save();
  }

  // ── Actions: Comments ───────────────────────────────────────────────────

  @action
  async addComment(taskId, body) {
    const comment = this.store.createRecord('comment', {
      taskId,
      body: body.trim(),
      authorId: this.session.currentUser.id,
      createdAt: new Date(),
    });

    try {
      await comment.save();
      this.comments = [...this.comments, comment];
      this._logActivity('comment_added', { taskId });
    } catch (error) {
      this.notify.error('Failed to add comment');
    }
  }

  @action
  async deleteComment(comment) {
    this.comments = this.comments.filter((c) => c !== comment);
    try {
      await comment.destroyRecord();
    } catch (error) {
      this.comments = [...this.comments, comment];
      this.notify.error('Failed to delete comment');
    }
  }

  get taskComments() {
    if (!this.selectedTask) return [];
    return this.comments
      .filter((c) => c.taskId === this.selectedTask.id)
      .sort((a, b) => new Date(a.createdAt) - new Date(b.createdAt));
  }

  // ── Actions: Kanban Board ───────────────────────────────────────────────

  @action
  onDragStart(task) {
    this.draggedTask = task;
  }

  @action
  onDragOver(column) {
    this.dragOverColumn = column;
  }

  @action
  async onDrop(column) {
    if (this.draggedTask && this.draggedTask.status !== column) {
      await this.updateTaskStatus(this.draggedTask, column);
    }
    this.draggedTask = null;
    this.dragOverColumn = null;
  }

  @action
  onDragEnd() {
    this.draggedTask = null;
    this.dragOverColumn = null;
  }

  // ── Actions: Time Tracking ──────────────────────────────────────────────

  @action
  startTimer(taskId) {
    if (this.isTimerRunning) {
      this.stopTimer();
    }

    this.activeTimer = {
      taskId,
      startedAt: new Date(),
      userId: this.session.currentUser.id,
    };
    this.timerElapsed = 0;

    this._timerInterval = setInterval(() => {
      this.timerElapsed = Date.now() - this.activeTimer.startedAt.getTime();
    }, 1000);
  }

  @action
  async stopTimer() {
    if (!this.activeTimer) return;

    clearInterval(this._timerInterval);
    this._timerInterval = null;

    const duration = Date.now() - this.activeTimer.startedAt.getTime();
    const entry = this.store.createRecord('time-entry', {
      taskId: this.activeTimer.taskId,
      userId: this.activeTimer.userId,
      startedAt: this.activeTimer.startedAt,
      duration,
    });

    try {
      await entry.save();
      this.timeEntries = [...this.timeEntries, entry];
    } catch (error) {
      this.notify.error('Failed to save time entry');
    }

    this.activeTimer = null;
    this.timerElapsed = 0;
  }

  @action
  async deleteTimeEntry(entry) {
    this.timeEntries = this.timeEntries.filter((e) => e !== entry);
    try {
      await entry.destroyRecord();
    } catch (error) {
      this.timeEntries = [...this.timeEntries, entry];
      this.notify.error('Failed to delete time entry');
    }
  }

  // ── Actions: Navigation & UI ────────────────────────────────────────────

  @action
  setTab(tab) {
    this.activeTab = tab;
    this.selectedTask = null;
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
  setFilterStatus(status) {
    this.filterStatus = status;
    this.currentPage = 1;
  }

  @action
  setFilterAssignee(userId) {
    this.filterAssignee = userId;
    this.currentPage = 1;
  }

  @action
  setFilterPriority(priority) {
    this.filterPriority = priority;
    this.currentPage = 1;
  }

  @action
  setDateRange(range) {
    this.dateRange = range;
    this.currentPage = 1;
  }

  @action
  clearFilters() {
    this.filterStatus = null;
    this.filterAssignee = null;
    this.filterPriority = null;
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
  setViewMode(mode) {
    this.viewMode = mode;
  }

  @action
  setGroupBy(field) {
    this.groupBy = field;
  }

  @action
  toggleCompleted() {
    this.showCompletedTasks = !this.showCompletedTasks;
  }

  @action
  toggleGroupCollapse(groupKey) {
    this.isCollapsed = {
      ...this.isCollapsed,
      [groupKey]: !this.isCollapsed[groupKey],
    };
  }

  @action
  nextPage() {
    if (this.hasNextPage) this.currentPage++;
  }

  @action
  previousPage() {
    if (this.hasPreviousPage) this.currentPage--;
  }

  @action
  goToPage(page) {
    this.currentPage = Math.max(1, Math.min(page, this.totalPages));
  }

  @action
  openCreateModal() {
    this.showCreateModal = true;
  }

  @action
  closeCreateModal() {
    this.showCreateModal = false;
    this._resetProjectForm();
    this._resetTaskForm();
  }

  @action
  openEditModal(entity) {
    this.editingEntity = entity;
    this.showEditModal = true;
  }

  @action
  closeEditModal() {
    this.editingEntity = null;
    this.showEditModal = false;
  }

  @action
  toggleActivitySidebar() {
    this.showActivitySidebar = !this.showActivitySidebar;
  }

  // ── Actions: Import / Export ─────────────────────────────────────────────

  @action
  exportProjectData() {
    const project = this.selectedProject;
    if (!project) return null;

    const tasks = this.currentProjectTasks.map((t) => ({
      title: t.title,
      description: t.description,
      status: t.status,
      priority: t.priority,
      assignee: this.users.find((u) => u.id === t.assigneeId)?.name,
      dueDate: t.dueDate,
      labels: t.labels,
      estimate: t.estimate,
      completedAt: t.completedAt,
    }));

    return JSON.stringify(
      {
        project: {
          name: project.name,
          description: project.description,
          status: project.status,
        },
        tasks,
        exportedAt: new Date().toISOString(),
        exportedBy: this.session.currentUser.name,
      },
      null,
      2,
    );
  }

  @action
  async importProjectData(jsonString) {
    try {
      const data = JSON.parse(jsonString);
      const project = this.store.createRecord('project', {
        name: data.project.name,
        description: data.project.description,
        status: 'active',
        memberIds: [this.session.currentUser.id],
        createdAt: new Date(),
      });
      await project.save();
      this.projects = [...this.projects, project];

      for (const taskData of data.tasks || []) {
        const task = this.store.createRecord('task', {
          title: taskData.title,
          description: taskData.description,
          status: taskData.status || 'todo',
          priority: taskData.priority || 'medium',
          labels: taskData.labels || [],
          estimate: taskData.estimate,
          projectId: project.id,
          createdAt: new Date(),
          createdBy: this.session.currentUser.id,
        });
        await task.save();
        this.tasks = [...this.tasks, task];
      }

      this.notify.success(`Imported project "${data.project.name}" with ${data.tasks.length} tasks`);
    } catch (error) {
      this.notify.error('Failed to import project data');
    }
  }

  // ── Private Helpers ─────────────────────────────────────────────────────

  _resetProjectForm() {
    this.newProjectName = '';
    this.newProjectDescription = '';
    this.newProjectColor = '#3B82F6';
    this.newProjectDeadline = null;
  }

  _resetTaskForm() {
    this.newTaskTitle = '';
    this.newTaskDescription = '';
    this.newTaskPriority = 'medium';
    this.newTaskAssignee = null;
    this.newTaskDueDate = null;
    this.newTaskLabels = [];
    this.newTaskEstimate = null;
  }

  _logActivity(type, entity, metadata = {}) {
    this.activityLog = [
      {
        type,
        entityId: entity.id || entity.taskId,
        userId: this.session.currentUser.id,
        timestamp: new Date(),
        metadata,
      },
      ...this.activityLog,
    ].slice(0, 200);
  }

  willDestroy() {
    super.willDestroy();
    if (this._timerInterval) {
      clearInterval(this._timerInterval);
    }
  }
}
