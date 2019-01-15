// TaskList
const tasks = new Tasks();

// Focus the New Task input
document.getElementById('new-task').focus();

// Add new task when button clicked
document.getElementById('btn-new-task').addEventListener('click', (e) => {
  addTask(document.getElementById('new-task').value);
});

// update Last Active in lastActiveRefresh
lastActiveRefresh = 20000; // 20 seconds
setTimeout(() => {
  tasks.updateLastActive();
}, lastActiveRefresh);

function addTask(name) {

  // Clear the input
  document.getElementById('new-task').value = '';

  // add the new task (this will also stop any previous task and start the new one)
  tasks.addTask(name);

}