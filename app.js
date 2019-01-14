// TaskList
const taskList = new TaskList();

// Focus the New Task input
document.getElementById('new-task').focus();
// Add new task when button clicked
document.getElementById('btn-new-task').addEventListener('click', (e) => {
  addTask(document.getElementById('new-task').value);
});

// Every 10 seconds update Last Active
lastActiveRefresh = 10000;
setTimeout(() => {
  taskList.updateLastActive();
}, lastActiveRefresh);

function addTask(name) {
  // Clear the input
  document.getElementById('new-task').value = '';

  taskList.addTask(name);

}