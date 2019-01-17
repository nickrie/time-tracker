// Tasks
const tasks = new Tasks();

// Focus the New Task input
document.getElementById('input-task-name').focus();

// Hide the edit buttons
document.querySelector('#btns-edit').style.display = 'none';

// Refresh Last Active occationally
lastActiveRefresh = 20000; // 20 seconds
setTimeout(() => {
  tasks.refreshLastActive();
}, lastActiveRefresh);

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
    UI.toggleTask(taskId);
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
  UI.cancelEditTask();
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

  // add the new task (this will also stop any previous task and start the new one)
  hours = (hours === null || hours == '' ? 0 : hours);
  minutes = (minutes === null || minutes == '' ? 0 : minutes);
  tasks.addTask(name, hours, minutes);

}

function editTask(taskId) {
  UI.editTask(tasks.getTask(taskId));
}

function deleteTask(taskId) {
  if (confirm('Are you sure you want to delete this task?')) {
    tasks.deleteTask(taskId);
  }
}

function toggleTask(taskId) {
  tasks.toggleTask(taskId);
}