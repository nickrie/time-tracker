// Tasks
const tasks = new Tasks();

// Focus the New Task input
document.getElementById('input-task-name').focus();

// Add new task when button clicked
document.getElementById('btn-add-task').addEventListener('click', (e) => {
  addTask(
    document.getElementById('input-task-name').value,
    document.getElementById('input-task-hours').value,
    document.getElementById('input-task-minutes').value
  );
});

// refresh Last Active occationally
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

function deleteTask(taskId) {
  if (confirm('Are you sure you want to delete this task?')) {
    tasks.deleteTask(taskId);
  }
}

function toggleTask(taskId) {
  tasks.toggleTask(taskId);
}