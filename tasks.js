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
    }

  }

  // Adds a new task an object with either 
  //    {error: true, msg: ''} or
  //    {error: false, id: }
  addTask(name, hours, minutes) {

    let nameExists = false;

    // Ensure another task with that name doesn't already exist
    for (let taskId in this.tasks.list) {
      if (this.tasks.list[taskId].name == name) {
        nameExists = true;
      }
    }
    if (nameExists === true) {
      return {error: true, msg: 'A task already exists with that name.'};
    }

    // Ensure hours and minutes are positive values
    hours = parseInt(hours);
    minutes = parseInt(minutes);
    if (hours < 0 || minutes < 0) {
      return {error: true, msg: 'Hours and minutes must be positive integer values.'};
    }

    // Add new task
    const newId = this.tasks.idx++;
    const newTask = {
      id: newId,
      name: name,
      logged: (hours * 60) + minutes,
      started: null,
      last: null
    };
    this.tasks.list[newId] = newTask;

    // Store tasks
    this.storeTasks();

    return {error: false, id: newId};

  }

  deleteTask(taskId) {

    // If this was the currently active task, clear it
    if (this.tasks.currentTaskId == taskId) {
      this.tasks.currentTaskId = null;
    }

    // Delete the task
    delete this.tasks.list[taskId];

    // Store tasks
    this.storeTasks();

  }

  getTasks() {
    return this.tasks;
  }

  getTask(taskId) {
    return this.tasks.list[taskId];
  }

  /*
  setTask(task) {
    this.tasks.list[taskId] = task;
    this.storeTasks();
  }
  */

  // Starts a task, if it has to stop a currently running task it will return the stopped task's id
  // Object returned will be
  //    {error: true, msg: ''} or
  //    {error: false, stoppedId: }
  startTask(taskId) {

    let stoppedId = null;

    // console.log('START ' + taskId);

    // This is by reference so we can update task and changes will get stored when we call storeTasks
    const task = this.tasks.list[taskId];

    // Ensure this task is not already active
    if (task.started !== null) {
      return {error: true, msg: 'This task is already active.'};
    }

    // Stop currently running task
    if (this.tasks.currentTaskId !== null) {
      stoppedId = this.tasks.currentTaskId;
      const result = this.stopTask(this.tasks.currentTaskId);
      if (result.error) {
        return result;
      }
    }
    // Start this task
    this.tasks.currentTaskId = taskId;
    // Set started Date
    task.started = new Date();

    // Store tasks
    this.storeTasks();

    return {error: false, stoppedId: stoppedId};

  }

  // Stops and task and returns an object
  //    {error: true, msg: ''} or
  //    {error: false }
  stopTask(taskId) {

    // console.log('STOP ' + taskId);

    // This is by reference so we can update task and changes will get stored
    const task = this.tasks.list[taskId];

    // Ensure this task is actually active
    if (task.started === null) {
      return {error: true, msg: 'This task is not currently active.'};
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

    // Store tasks
    this.storeTasks();

    return {error: false};

  }

  storeTasks() {

    window.localStorage.setItem('tasks', JSON.stringify(this.tasks));

  }

  // starts/stops a task depending on it's current state
  // if another task is stopped due to the toggle it's id is returned
  // via the the object returned by startTask()
  toggleTask(taskId) {

    const task = this.tasks.list[taskId];

    if (task.started === null) {
      return this.startTask(task.id);
    }
    else {
      return this.stopTask(task.id);
    }

  }

}