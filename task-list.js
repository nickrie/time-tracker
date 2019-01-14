class TaskList {

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
        this.displayTask(this.tasks.list[taskId]);
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
      duration: 0,
      started: null,
      last: null
    };
    this.tasks.list[newId] = newTask;

    // Add task to UI
    this.displayTask(newTask, true);

    // Start the new task automatically
    this.startTask(newId);

    // Store tasks
    this.storeTasks();

  }

  createCol(row, id, desc, value) {

    const newCol = document.createElement('div');
    newCol.classList = 'col';
    newCol.id = `col-task-${desc}-${id}`;
    const newColContent = document.createTextNode(value);
    newCol.appendChild(newColContent);
    row.appendChild(newCol);

  }

  displayTask(task, isNew = false) {

    // create our new row
    const newRow = document.createElement('div');
    newRow.classList = 'row p-2'
    newRow.id = `row-task-${task.id}`;

    // add columns to our new row
    this.createCol(newRow, task.id, 'id', task.id);
    this.createCol(newRow, task.id, 'name', task.name);
    this.createCol(newRow, task.id, 'duration', task.duration);

    // set last
    let last;
    if (isNew === true) {
      last = 'ACTIVE';      
    }
    else if (task.last === null) {
      last = 'ACTIVE';
      // we're loading in this case so set the active class
      newRow.classList.add('bg-success');
    }
    else {
      // last = (task.last === null ? '' : task.last);
      let lastMoment = moment(task.last);
      last = lastMoment.from(new Date());
    }
    this.createCol(newRow, task.id, 'last', last);

    // add the new row
    const taskList = document.getElementById('task-list');
    const rowHeader = document.getElementById('row-header');    
    taskList.insertBefore(newRow, rowHeader.nextElementSibling);

  }

  startTask(newId) {

    // Stop currently running task
    this.stopCurrentTask();
    // Start this task
    this.tasks.currentTaskId = newId;
    // Add CSS to indicate the task is active
    document.getElementById(`row-task-${newId}`).classList.add('bg-success');
    // Set started Date
    this.tasks.list[newId].started = new Date();
  
  }

  stopCurrentTask() {

    const currentId = this.tasks.currentTaskId;

    // Update duration

    // Update last date
    if (currentId !== null) {
      this.tasks.list[currentId].last = new Date();
      document.getElementById(`col-task-last-${currentId}`).innerHTML = 'Just now';
    }

    // Remove CSS indicating a task is active
    let els = document.querySelectorAll('.bg-success');
    // there should only ever be one active task, but just in case look for all matches
    [].forEach.call(els, (el) => {
      el.classList.remove('bg-success');
      // indicate that a task was stopped with a red background that disappears after 3 seconds
      el.classList.add('bg-danger');
      setTimeout(() => {
        el.classList.remove('bg-danger');
      }, 3000)
    });

    // clear currentTaskId
    this.tasks.currentTaskId = null;

  }

  storeTasks() {

    window.localStorage.setItem('tasks', JSON.stringify(this.tasks));
    console.log('stored: ' + JSON.stringify(this.tasks));

  }

}