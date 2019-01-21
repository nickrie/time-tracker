// UI controller class

class UI {

  static alert(msg) {
    // TODO: convert to a bootstrap modal
    alert(msg);
  }

  static clearInputs() {
    document.getElementById('input-task-id').value = '';
    document.getElementById('input-task-name').value = '';
    document.getElementById('input-task-hours').value = 0;
    document.getElementById('input-task-minutes').value = 0;
  }

  static getLastActiveStr(task) {

    let lastActive;

    if (task.started !== null) {
      let a = moment(new Date());
      let b = moment(task.started);
      let seconds = a.diff(b, 'seconds');
      let minutes = Math.ceil(seconds / 60);
      lastActive = 'ACTIVE for ' + UI.getLoggedTimeStr(minutes);
      // + moment(task.started).toNow(true);
    }
    else {
      lastActive = moment(task.last).from(new Date());
    }

    return lastActive;

  }

  static getHoursMinutes(minutes) {

    let hours = 0;
    let remainMinutes = 0;

    if (minutes > 60) {
      hours = Math.floor(minutes / 60);
      remainMinutes = minutes % 60;
    }
    else {
      remainMinutes = minutes;
    }

    return {
      hours: hours, 
      minutes: remainMinutes
    };
  }

  static getLoggedTimeStr(minutes) {

    const time = UI.getHoursMinutes(minutes);

    return (time.hours > 0 ? `${time.hours}h ` : '') + `${time.minutes}m`;

  }

  static createCol(row, id, width, desc, value) {

    const newCol = document.createElement('div');
    newCol.classList = `col col-${width} align-center`;
    if (['logged', 'edit-icon'].includes(desc)) {
      newCol.classList += ' text-right';
    }
    newCol.id = `col-task-${desc}-${id}`;
    const newColContent = document.createTextNode(value);
    newCol.appendChild(newColContent);
    row.appendChild(newCol);

  }

  static displayTask(task, justAdded = false) {

    // create our new row
    const newRow = document.createElement('div');
    newRow.classList = 'row row-task p-2 border-top align-items-center';
    newRow.id = `row-task-${task.id}`;

    // add columns to our new row
    // UI.createCol(newRow, task.id, 'id', task.id);
    UI.createCol(newRow, task.id, 1, 'toggle-icon', '');
    UI.createCol(newRow, task.id, 5, 'name', task.name);
    // these values will bet set when taskChanged() is called below
    UI.createCol(newRow, task.id, 3, 'logged', '');
    UI.createCol(newRow, task.id, 2, 'last-active', '');
    UI.createCol(newRow, task.id, 1, 'edit-icon', '');

    // add the new row
    const taskList = document.getElementById('task-list');
    const rowHeader = document.getElementById('row-header');
    taskList.insertBefore(newRow, rowHeader.nextElementSibling);

    // add toggle icon
    const elToggle = document.getElementById(`col-task-toggle-icon-${task.id}`);
    elToggle.innerHTML = (justAdded ? '<i class="fas fa-rocket"></i>' : '');

    // add edit icon html
    const elLink = document.getElementById(`col-task-edit-icon-${task.id}`);
    elLink.innerHTML = `
          <i class="fas fa-pencil-alt"></i>
    `;

    // add toggle icon hover event handler
    const el = document.getElementById(newRow.id);
    const elToggleIcon = document.querySelector(`#col-task-toggle-icon-${task.id}`);
    el.addEventListener('mouseenter', (e) => {
      if (document.getElementById(`row-task-${task.id}`).classList.contains('bg-success')) {
        elToggleIcon.innerHTML = '<i class="fas fa-stop"></i>';
      } else {
        elToggleIcon.innerHTML = '<i class="fas fa-play"></i>';
      }
    });
    el.addEventListener('mouseleave', (e) => {
      elToggleIcon.innerHTML = '';
    });

    // call taskChanged to set the initial time values
    UI.taskChanged(task);

  }

  static editTask(task) {
    
    const elName = document.querySelector('#input-task-name');

    // Change the background color of the item being edited
    const elRow = document.querySelector(`#row-task-${task.id}`);
    elRow.classList.add('bg-primary');
    elRow.classList.add('text-light');

    // Change the color of the input card
    const elCard = document.querySelector('#input-card');
    elCard.classList.remove('bg-light');
    elCard.classList.add('bg-primary');

    // Hide all edit links
    const elEditLinks = document.querySelectorAll('.fa-pencil-alt');
    elEditLinks.forEach((el) => {
      el.style.display = 'none';
    });

    // Hide the add button and show the edit buttons
    document.querySelector('#btn-add-task').style.display = 'none';
    document.querySelector('#btns-edit').style.display = 'inline';
    // Focus the input
    elName.focus();
    elName.scrollTop;

    // Set the values
    document.querySelector('#input-task-id').value = task.id;
    elName.value = task.name;
    const time = UI.getHoursMinutes(task.logged);
    document.querySelector('#input-task-hours').value = time.hours;
    document.querySelector('#input-task-minutes').value = time.minutes;

  }

  static clearEditTask() {

    // Revert row color changes
    const taskId = document.querySelector('#input-task-id').value
    const elRow = document.querySelector(`#row-task-${taskId}`);
    if (elRow !== null) {
      elRow.classList.remove('bg-primary');
      elRow.classList.remove('text-light');
    }

    // Revert input card background color
    const elCard = document.querySelector('#input-card');
    elCard.classList.remove('bg-primary');
    elCard.classList.add('bg-light');
    
    // Show all edit links
    const elEditLinks = document.querySelectorAll('.fa-pencil-alt');
    elEditLinks.forEach((el) => {
      el.style.display = 'block';
    });
    
    // Hide the edit buttons and show the add buttons
    document.querySelector('#btn-add-task').style.display = 'block';
    document.querySelector('#btns-edit').style.display = 'none';

    // Clear inputs
    UI.clearInputs();

  }

  static removeTask(taskId) {
    document.getElementById(`row-task-${taskId}`).remove();
  }

  static refreshLastActive(task) {
    document.getElementById(`col-task-last-active-${task.id}`).innerHTML = UI.getLastActiveStr(task);
  }

  static taskChanged(task) {

    // console.log('taskChanged(' + task.id + ')');

    // update Name
    document.getElementById(`col-task-name-${task.id}`).innerHTML = task.name;    

    // update Last Active
    UI.refreshLastActive(task);

    // update Time Logged
    document.getElementById(`col-task-logged-${task.id}`).innerHTML = UI.getLoggedTimeStr(task.logged);

    // set ACTIVE style
    if (task.started !== null) {
      // Add CSS to indicate the task is active
      document.getElementById(`row-task-${task.id}`).classList.add('bg-success');
    }

    // if the task was stopped, indicate the change by setting the background color to red temporarily
    if (task.started === null && document.getElementById(`row-task-${task.id}`).classList.contains('bg-success')) {
      document.getElementById(`row-task-${task.id}`).classList.remove('bg-success');
      document.getElementById(`row-task-${task.id}`).classList.add('bg-danger');
      document.querySelector(`#col-task-toggle-icon-${task.id}`).innerHTML = '<i class="fas fa-hand-paper"></i>';
      // After 1 second remove the red background and clear the icon indicating it stopped
      setTimeout(() => {
        document.getElementById(`row-task-${task.id}`).classList.remove('bg-danger');
        document.querySelector(`#col-task-toggle-icon-${task.id}`).innerHTML = '';
      }, 1000)
    }

  }

  // Takes an event target and return the task id for the parent row
  static parentRowTaskId(target) {
    let el = target;
    while (!el.classList.contains('row')) {
      // console.log('SKIPPED ' + el.id);
      el = el.parentNode;
    }
    // console.log('FOUND ' + el.id);
    return parseInt(el.id.replace('row-task-', ''));
  }

}