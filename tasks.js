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

    // Start the new task and store it
    this.startTask(newId);

    // Add task to UI
    UI.displayTask(newTask);

  }

  startTask(newId) {

    // Stop currently running task
    if (this.tasks.currentTaskId !== null) {
      this.stopTask(this.tasks.list[this.tasks.currentTaskId]);
    }
    // Start this task
    this.tasks.currentTaskId = newId;
    // Set started Date
    this.tasks.list[newId].started = new Date();

    // Store tasks
    this.storeTasks();

  }

  stopTask(task) {

    // Update logged minutes
    let a = moment(new Date());
    let b = moment(task.started);
    let seconds = a.diff(b, 'seconds');
    let minutes = Math.ceil(seconds / 60);
    task.logged = minutes;

    // Clear started date
    task.started = null;

    // Update last date
    task.last = new Date();

    UI.taskChanged(task, 'STOPPED');

    // clear currentTaskId
    this.tasks.currentTaskId = null;

    // Store tasks
    this.storeTasks();

  }

  storeTasks() {

    window.localStorage.setItem('tasks', JSON.stringify(this.tasks));

  }

  updateLastActive() {

    for (let taskId in this.tasks.list) {
      UI.updateLastActive(this.tasks.list[taskId])
    }

    console.log('updateLastActive ran');

    // run this again in lastActiveRefresh
    setTimeout(() => {
      this.updateLastActive();
    }, lastActiveRefresh);

  }

}