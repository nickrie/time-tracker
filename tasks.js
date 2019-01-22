// Tasks controller class

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

  // Adds a new task and returns an object with either 
  //    {error: true, focus: '', msg: ''} or
  //    {error: false, id: }
  addTask(name, hours, minutes) {

    // Validate input values
    hours = parseInt(hours);
    minutes = parseInt(minutes);
    const result = this.checkInputValues(false, name, hours, minutes);
    if (result.error) {
      return result;
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

  // Updates a task and returns an object with either 
  //    {error: true, focus: '', msg: ''} or
  //    {error: false }
  updateTask(id, name, hours, minutes) {

    // Validate input values
    hours = parseInt(hours);
    minutes = parseInt(minutes);
    const result = this.checkInputValues(id, name, hours, minutes);
    if (result.error) {
      return result;
    }
    
    // This is by reference so we can update task and changes will get stored when we call storeTasks
    const task = this.tasks.list[id];

    // Update values
    task.name = name;
    task.logged = (hours * 60) + minutes;
    
    // Store tasks
    this.storeTasks();

    return {error: false};
    
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

  // Returns a task object for the given id
  getTask(taskId) {
    return this.tasks.list[taskId];
  }

  // Starts a task
  // If it has to stop a currently running task it will return the stopped task's id.
  // Object returned will be
  //    {error: true, msg: ''} or
  //    {error: false, stoppedId: }
  startTask(taskId) {

    let stoppedId = null;

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

    // This is by reference so we can update task and changes will get stored
    const task = this.tasks.list[taskId];

    // Ensure this task is actually active
    if (task.started === null) {
      return {error: true, msg: 'This task is not currently active.'};
    }

    // Update logged minutes
    //    We always round up, but if it was active for less than 5 seconds then don't log any time
    let a = moment(new Date());
    let b = moment(task.started);
    let seconds = a.diff(b, 'seconds');
    let minutes = seconds < 5 ? 0 : Math.ceil(seconds / 60);
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

  // Updates the tasks object in LS
  storeTasks() {

    window.localStorage.setItem('tasks', JSON.stringify(this.tasks));

  }

  // starts/stops a task depending on it's current state
  // if another task is stopped due to the toggle it's id is returned
  // via the the object returned by startTask()
  toggleTask(taskId) {

    const task = this.tasks.list[taskId];
    let result;

    if (task.started === null) {
      result = this.startTask(task.id);
      result.toggleAction = 'START'
    }
    else {
      result = this.stopTask(task.id);
      result.toggleAction = 'STOP';
    }

    return result;

  }

  checkInputValues(id, name, hours, minutes) {

    // Ensure another task with that name doesn't already exist

    let nameExists = false;

    for (let taskId in this.tasks.list) {
      if (this.tasks.list[taskId].name == name && taskId != id) {
        nameExists = true;
      }
    }
    if (nameExists === true) {
      return {error: true, focus: 'name', msg: 'A task already exists with that name.'};
    }

    // Check hours and minutes to ensure they are integer values of the expected size

    if (hours < 0 || minutes < 0 || isNaN(hours) || isNaN(minutes)) {
      return {error: true, focus: 'hours', msg: 'Hours and minutes must be positive integer values.'};
    }

    if (minutes >= 60) {
      return {error: true, focus: 'minutes', msg: 'Minutes must be under 60.'};
    }

    return {error: false};

  }

}