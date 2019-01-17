class Tasks {

  constructor() {

    // Get Tasks from LS
    if (window.localStorage.getItem('tasks') === null) {
      this.tasks = {
        idx: 1,
        currentTaskId: null,
        list: {}
      };
    } else {
      this.tasks = JSON.parse(window.localStorage.getItem('tasks'));
      for (let taskId in this.tasks.list) {
        UI.displayTask(this.tasks.list[taskId]);
      }
      // sort list by last
      // todo
    }

  }

  addTask(name) {

    let nameExists = false;

    // Ensure another task with that name doesn't already exist
    for (let taskId in this.tasks.list) {
      if (this.tasks.list[taskId].name == name) {
        nameExists = true;
      }
    }
    if (nameExists === true) {
      alert('A task already exists with that name.');
      return;
    }

    // Add new task
    const newId = this.tasks.idx++;
    const newTask = {
      id: newId,
      name: name,
      logged: 0, // minutes
      started: null,
      last: null
    };
    this.tasks.list[newId] = newTask;

    // Add task to UI (we must add before starting it since start updates the UI)
    UI.displayTask(newTask);

    // Start the new task and Store it
    this.startTask(newId);

  }

  deleteTask(taskId) {

    // If this was the currently active task, clear it
    if (this.tasks.currentTaskId == taskId) {
      this.tasks.currentTaskId = null;
    }

    // Delete the task
    delete this.tasks.list[taskId];

    // Remove the task from the UI
    UI.removeTask(taskId);

    // Store tasks
    this.storeTasks();

  }

  startTask(taskId) {

    // This is by reference so we can update task and changes will get stored when we call storeTasks
    const task = this.tasks.list[taskId];

    // Ensure this task is not already active
    if (task.started !== null) {
      alert('This task is already active.');
      return;
    }

    // Stop currently running task
    if (this.tasks.currentTaskId !== null) {
      this.stopTask(this.tasks.currentTaskId);
    }
    // Start this task
    this.tasks.currentTaskId = taskId;
    // Set started Date
    task.started = new Date();

    // Update the UI
    UI.taskChanged(task);

    // Store tasks
    this.storeTasks();

  }

  stopTask(taskId) {

    // This is by reference so we can update task and changes will get stored
    const task = this.tasks.list[taskId];

    // Ensure this task is actually active
    if (task.started === null) {
      alert(`"This task is not currently active.`);
      return;
    }

    // Update logged minutes
    let a = moment(new Date());
    let b = moment(task.started);
    let seconds = a.diff(b, 'seconds');
    let minutes = Math.ceil(seconds / 60);
    task.logged += minutes;

    // Clear started date
    task.started = null;

    // Update last date
    task.last = new Date();

    // Clear currentTaskId
    this.tasks.currentTaskId = null;

    // Update the UI
    UI.taskChanged(task, 'STOPPED');

    // Store tasks
    this.storeTasks();

  }

  storeTasks() {

    window.localStorage.setItem('tasks', JSON.stringify(this.tasks));

  }

  toggleTask(taskId) {

    const task = this.tasks.list[taskId];

    if (task.started === null) {
      this.startTask(task.id);
    }
    else {
      this.stopTask(task.id);
    }

  }

  refreshLastActive() {

    for (let taskId in this.tasks.list) {
      UI.refreshLastActive(this.tasks.list[taskId])
    }

    console.log('refreshLastActive ran');

    // run this again in lastActiveRefresh
    setTimeout(() => {
      this.refreshLastActive();
    }, lastActiveRefresh);

  }

}