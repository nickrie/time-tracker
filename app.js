// Set the copyright year
const now = new Date();
document.getElementById('copy-year').innerHTML = now.getFullYear();

// Tasks
const tasks = new Tasks();
// Display existing tasks
for (let taskId in tasks.tasks.list) {
  UI.displayTask(tasks.tasks.list[taskId]);
}
// Show the Task List or Empty List depending on whether or not tasks exist
UI.checkTaskListEmpty();

// Focus the New Task input
if (!isMobile) {
  document.getElementById('input-task-name').focus();
}

// Hide the edit buttons
document.querySelector('#btns-edit').style.display = 'none';

/////////////////////////
// Event Listeners
/////////////////////////

// Row click: Toggle Task
document.querySelector('#task-list').addEventListener('click', e => {
  // if they clicked on the edit ICON then edit the task
  if (e.target.classList.contains('fa-pencil-alt')) {
    if (e.target.parentNode.disabled) return;
    const elId = e.target.parentNode.parentNode.parentNode.parentNode.id;
    const taskId = parseInt(elId.replace('col-task-action-icons-', ''));
    editTask(taskId);
  }
  // if they clicked on the edit BUTTON then edit the task
  else if (e.target.classList.contains('btn-edit')) {
    if (e.target.disabled) return;
    const elId = e.target.parentNode.parentNode.parentNode.id;
    const taskId = parseInt(elId.replace('col-task-action-icons-', ''));
    editTask(taskId);
  }

  // if they clicked on the delete ICON then delete the task
  else if (e.target.classList.contains('fa-trash')) {
    if (e.target.parentNode.disabled) return;
    const elId = e.target.parentNode.parentNode.parentNode.parentNode.id;
    const taskId = parseInt(elId.replace('col-task-action-icons-', ''));
    deleteTask(taskId);
  }
  // if they clicked on the delete BUTTON then delete the task
  else if (e.target.classList.contains('btn-delete')) {
    if (e.target.disabled) return;
    const elId = e.target.parentNode.parentNode.parentNode.id;
    const taskId = parseInt(elId.replace('col-task-action-icons-', ''));
    deleteTask(taskId);
  }

  // otherwise toggle the row (start/stop)
  else {
    // If they clicked the header row, return
    elRowHeader = document.getElementById('row-header');
    if (
      elRowHeader == e.target ||
      elRowHeader == e.target.parentNode ||
      elRowHeader == e.target.parentNode.parentNode
    ) {
      // do nothing for the row header
      return;
    }

    // find the parent row
    const taskId = UI.parentRowTaskId(e.target);

    // toggle the task
    toggleTask(taskId);

    // Focus on the name input
    if (!isMobile) {
      document.querySelector('#input-task-name').focus();
    }
  }
});

// Button: Add Task
document.getElementById('btn-add-task').addEventListener('click', e => {
  const onEditScreen =
    document.querySelector('#btns-add').style.display == 'none';

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
document.querySelector('#btn-cancel').addEventListener('click', e => {
  UI.clearEditTask();
});

// Button: Delete
document.querySelector('#btn-delete-task').addEventListener('click', e => {
  deleteTask(document.querySelector('#input-task-id').value);
});

// Button: Submit Changes
document.querySelector('#btn-submit-edit').addEventListener('click', e => {
  editTaskSubmit(
    document.querySelector('#input-task-id').value,
    document.getElementById('input-task-name').value,
    document.getElementById('input-task-hours').value,
    document.getElementById('input-task-minutes').value
  );
});

/////////////////////////
// App level functions
/////////////////////////

// Add Task
function addTask(name, hours, minutes) {
  // Add the new task (this will also stop any previous task and start the new one)
  result = tasks.addTask(name, hours, minutes);

  if (!result.error) {
    // Clear the inputs
    UI.clearInputs();
    // Add task to UI (we must add before starting it since start updates the UI)
    UI.displayTask(tasks.getTask(result.id));
    // Start the new task
    startTask(result.id);
  } else {
    // Display the error
    UI.alert(result.msg);
    // Focus on the input with an error
    if (typeof result.focus !== 'undefined') {
      document.getElementById(`input-task-${result.focus}`).focus();
    }
  }
}

// Edit Task - alter the UI to show the edit screen
function editTask(taskId) {
  UI.editTask(tasks.getTask(taskId));
}

// Edit Task Submit - submits the changes from the edit form
function editTaskSubmit(id, name, hours, minutes) {
  // Update the task
  result = tasks.updateTask(id, name, hours, minutes);

  if (!result.error) {
    // Update the UI for the updated task
    UI.taskChanged(tasks.getTask(id));
    // Hide the edit screen
    UI.clearEditTask();
  } else {
    // Display the error
    UI.alert(result.msg);
    // Focus on the input with an error
    if (typeof result.focus !== 'undefined') {
      document.getElementById(`input-task-${result.focus}`).focus();
    }
  }
}

// Delete task
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

// Toggle (Start/Stop) a task
function toggleTask(taskId) {
  const result = tasks.toggleTask(taskId);

  if (!result.error) {
    // Update the UI for the toggled task
    UI.taskChanged(tasks.getTask(taskId));
    // If another task was stopped due to the toggle, update it as well
    if (typeof result.stoppedId !== 'undefined' && result.stoppedId !== null) {
      UI.taskChanged(tasks.getTask(result.stoppedId));
    }
  } else {
    // Display the error
    UI.alert(result.error);
  }
}

// Start a task (make it active and start tracking time)
function startTask(taskId) {
  const result = tasks.startTask(taskId);

  if (!result.error) {
    // Update the UI for the started task
    UI.taskChanged(tasks.getTask(taskId));
    // If another task was stopped in order to start this task, update it too
    if (typeof result.stoppedId !== 'undefined' && result.stoppedId !== null) {
      UI.taskChanged(tasks.getTask(result.stoppedId));
    }
  } else {
    // Display the error
    UI.alert(result.msg);
  }
}

// Callback function to refresh the active / last active times via setTimeout
function refreshTimes() {
  for (let taskId in tasks.tasks.list) {
    UI.refreshLastActive(tasks.tasks.list[taskId]);
    UI.refreshTimeLogged(tasks.tasks.list[taskId]);
  }

  // run this again in timeRefresh
  setTimeout(() => {
    refreshTimes();
  }, timeRefresh);
}

// Refresh times occationally to get updated values
const timeRefresh = 20000; // 20 seconds
setTimeout(() => {
  refreshTimes();
}, timeRefresh);

// Handle show/collapse of input-card
$(document).ready(function() {
  $('#input-collapse')
    .on('show.bs.collapse', function() {
      UI.showForm();
    })
    .on('hide.bs.collapse', function() {
      UI.collapseForm();
    });
});
