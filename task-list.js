class TaskList {

  constructor() {
    // Get Tasks from LS
    if (window.localStorage.getItem('tasks') === null) {
      this.tasks = {
        idx: 1,
        currentTaskId: null,
        list: []
      };
    } else {
      this.tasks = JSON.parse(window.localStorage.getItem('tasks'));
      this.tasks.list.forEach((task) => {
        this.displayTask(task);
      });
      // sort list by last started
      // todo
    }
  }

  addTask(name) {

    let nameExists = false;

    // Ensure another task with that name doesn't already exist
    this.tasks.list.forEach((task) => {
      if (task.name == name) {
        nameExists = true;
      }
    });
    if (nameExists === true) {
      alert('A task already exists with that name.');
      return;
    }

    // Stop currently running task
    this.stopCurrentTask();

    // Add new task
    const newId = this.tasks.idx++;
    const newTask = {
      id: newId,
      name: name,
      duration: 0,
      started: null
    };
    this.tasks.list.push(newTask);

    // Add task to UI
    this.displayTask(newTask);

    // Start the new task automatically
    this.startTask(newId);

    // Store tasks
    this.storeTasks();
  }

  createCol(row, value) {
    const newCol = document.createElement('div');
    newCol.classList = 'col';
    const newColContent = document.createTextNode(value);
    newCol.appendChild(newColContent);
    row.appendChild(newCol);
  }

  displayTask(task) {
    // create our new row
    const newRow = document.createElement('div');
    newRow.classList = 'row p-2'
    newRow.id = `row-task-${task.id}`;

    // add columns to our new row
    this.createCol(newRow, task.id);
    this.createCol(newRow, task.name);
    this.createCol(newRow, task.duration);
    this.createCol(newRow, (task.started === null ? '' : task.started));

    // add the new row
    const taskList = document.getElementById('task-list');
    const rowHeader = document.getElementById('row-header');    
    taskList.insertBefore(newRow, rowHeader.nextElementSibling);
  }

  startTask(newId) {
    this.tasks.currentTaskId = newId;
    document.getElementById(`row-task-${newId}`).classList.add('bg-success');
  }

  stopCurrentTask() {

    if (this.currentTaskId !== null) {
      this.tasks.currentTaskId = null;
    }

  }

  storeTasks() {
    window.localStorage.setItem('tasks', JSON.stringify(this.tasks));
    console.log('stored: ' + JSON.stringify(this.tasks));
  }

}