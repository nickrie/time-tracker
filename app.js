// Tasks
const tasks = new Tasks();
// Display existing tasks
for (let taskId in tasks.tasks.list) {
  UI.displayTask(tasks.tasks.list[taskId]);
}

// Focus the New Task input
document.getElementById('input-task-name').focus();

// Hide the edit buttons
document.querySelector('#btns-edit').style.display = 'none';

/////////////////////////
// Event Listeners
/////////////////////////

// Row click: Toggle Task

document.querySelector('#task-list').addEventListener('click', (e) => {

  // if they clicked on the edit icon's parent div then edit the task
  //    NOTE: the parent div.link-edit exists to give the user a larger area to click for editing
  if (e.target.classList.contains('link-edit')) {
    const elId = e.target.parentNode.id;
    const taskId = elId.replace('col-task-link-','');
    // console.log('1: ' + taskId);
    editTask(taskId);
  }
  // if they clicked on the edit icon then edit the task
  else if (e.target.classList.contains('fa-pencil-alt')) {
    const elId = e.target.parentNode.parentNode.id;
    const taskId = parseInt(elId.replace('col-task-link-',''));
    // console.log('2: ' + taskId);
    editTask(taskId);
  }
  // otherwise toggle the row (start/stop)
  else {

    // find the parent row
    const taskId = UI.parentRowTaskId(e.target);

    // toggle the task
    toggleTask(taskId);
    // hide icon after they click
    document.querySelector(`#col-task-link-${taskId} > .icon`).innerHTML = '';

  }
});

// Button: Add Task
document.getElementById('btn-add-task').addEventListener('click', (e) => {

  const onEditScreen = (document.querySelector('#btn-add-task').style.display == 'none');

  // Ensure enter key does not add a task on the edit screen
  if (!onEditScreen) {
    addTask(
      document.getElementById('input-task-name').value,
      document.getElementById('input-task-hours').value,
      document.getElementById('input-task-minutes').value
    );
  }
});

// Button: Cancel
document.querySelector('#btn-cancel').addEventListener('click', (e) => {
  UI.clearEditTask();
});

// Button: Delete
document.querySelector('#btn-delete-task').addEventListener('click', (e) => {
  deleteTask(document.querySelector('#input-task-id').value);
});

// Button: Submit Changes
document.querySelector('#btn-submit-edit').addEventListener('click', (e) => {
  alert('todo');
});

/////////////////////////
// App level functions
/////////////////////////

function addTask(name, hours, minutes) {

  // Clear the inputs
  UI.clearInputs();

  // Add the new task (this will also stop any previous task and start the new one)
  hours = (hours === null || hours == '' ? 0 : hours);
  minutes = (minutes === null || minutes == '' ? 0 : minutes);
  result = tasks.addTask(name, hours, minutes);

  if (!result.error) {
    // Add task to UI (we must add before starting it since start updates the UI)
    UI.displayTask(tasks.getTask(result.id));
    // Start the new task
    startTask(result.id);
  }
  else {
    UI.alert(result.msg);
  }

}

function editTask(taskId) {
  UI.editTask(tasks.getTask(taskId));
}

function deleteTask(taskId) {
  if (confirm('Are you sure you want to delete this task?')) {
    // Delete the task
    tasks.deleteTask(taskId);
    // Remove the task from the UI
    UI.removeTask(taskId);
    // Hide the edit screen
    UI.clearEditTask();
  }
}

function toggleTask(taskId) {

  const result = tasks.toggleTask(taskId);
  
  if (!result.error) {
    // Update the UI for the toggled task
    UI.taskChanged(tasks.getTask(taskId));
    // If another task was stopped due to the toggle, update it as well
    if (typeof result.stoppedId !== 'undefined' && result.stoppedId !== null) {
      UI.taskChanged(tasks.getTask(result.stoppedId));
    }
  }
  else {
    UI.alert(result.error);
  }

}

function startTask(taskId) {

  const result = tasks.startTask(taskId);
  // console.log(`STARTED ${taskId}, stoppedId = ${stoppedId}`);

  if (!result.error) {
    // Update the UI for the started task
    UI.taskChanged(tasks.getTask(taskId));
    // If another task was stopped in order to start this task, update it too
    if (typeof result.stoppedId !== 'undefined' && result.stoppedId !== null) {
      UI.taskChanged(tasks.getTask(result.stoppedId));
    }
  }
  else {
    UI.alert(result.msg);
  }

}

function refreshLastActive() {

  for (let taskId in tasks.tasks.list) {
    UI.refreshLastActive(tasks.tasks.list[taskId])
  }

  // run this again in lastActiveRefresh
  setTimeout(() => {
    refreshLastActive();
  }, lastActiveRefresh);

  console.log('refreshLastActive ran');

}

// Refresh Last Active occationally to get updated time values
lastActiveRefresh = 20000; // 20 seconds
setTimeout(() => {
  refreshLastActive();
}, lastActiveRefresh);

