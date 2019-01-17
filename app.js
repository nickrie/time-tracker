// Tasks
const tasks = new Tasks();

// Focus the New Task input
document.getElementById('new-task').focus();

// Add new task when button clicked
document.getElementById('btn-new-task').addEventListener('click', (e) => {
  addTask(document.getElementById('new-task').value);
});

// refresh Last Active occationally
lastActiveRefresh = 20000; // 20 seconds
setTimeout(() => {
  tasks.refreshLastActive();
}, lastActiveRefresh);

function addTask(name) {

  // Clear the input
  document.getElementById('new-task').value = '';

  // add the new task (this will also stop any previous task and start the new one)
  tasks.addTask(name);

}

function deleteTask(taskId) {
  if (confirm('Are you sure you want to delete this task?')) {
    tasks.deleteTask(taskId);
  }
}

function toggleTask(taskId) {
  tasks.toggleTask(taskId);
}