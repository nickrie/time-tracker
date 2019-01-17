// Tasks
const tasks = new Tasks();

// Focus the New Task input
document.getElementById('input-task-name').focus();

/////////////////////////
// Button Event Listeners
/////////////////////////

// Add Task
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

// Cancel
document.querySelector('#btn-cancel').addEventListener('click', (e) => {
  UI.cancelEditTask();
});

// Delete
document.querySelector('#btn-delete-task').addEventListener('click', (e) => {
  deleteTask(document.querySelector('#input-task-id').value);
});

// Submit Changes
document.querySelector('#btn-submit-edit').addEventListener('click', (e) => {
  alert('todo');
});

/////////////////////////

// Hide the edit buttons
document.querySelector('#btns-edit').style.display = 'none';

// Refresh Last Active occationally
lastActiveRefresh = 20000; // 20 seconds
setTimeout(() => {
  tasks.refreshLastActive();
}, lastActiveRefresh);

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