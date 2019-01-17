class UI {

  static alert(msg) {
    // TODO: convert to a bootstrap modal
    alert('msg');
  }

  static clearInputs() {
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

  static getLoggedTimeStr(minutes) {

    let hours = 0;
    let remainMinutes = 0;

    if (minutes > 60) {
      hours = Math.floor(minutes / 60);
      remainMinutes = minutes % 60;
    }
    else {
      remainMinutes = minutes
    }

    return (hours > 0 ? `${hours}h ` : '') + `${remainMinutes}m`;

  }

  static createCol(row, id, width, desc, value) {

    const newCol = document.createElement('div');
    newCol.classList = `col col-${width} align-center`;
    if (['logged', 'link'].includes(desc)) {
      newCol.classList += ' text-right';
    }
    newCol.id = `col-task-${desc}-${id}`;
    const newColContent = document.createTextNode(value);
    newCol.appendChild(newColContent);
    row.appendChild(newCol);

  }

  static displayTask(task) {

    // create our new row
    const newRow = document.createElement('div');
    newRow.classList = 'row p-2 border-top align-items-center';
    newRow.id = `row-task-${task.id}`;

    // add columns to our new row
    // UI.createCol(newRow, task.id, 'id', task.id);
    UI.createCol(newRow, task.id, 6, 'name', task.name);
    // these values will bet set when taskChanged() is called below
    UI.createCol(newRow, task.id, 3, 'logged', '');
    UI.createCol(newRow, task.id, 2, 'last-active', '');
    UI.createCol(newRow, task.id, 1, 'link', '');

    // add the new row
    const taskList = document.getElementById('task-list');
    const rowHeader = document.getElementById('row-header');
    taskList.insertBefore(newRow, rowHeader.nextElementSibling);

    // add link html
    const elLink = document.getElementById(`col-task-link-${task.id}`);
    elLink.innerHTML = `
      <span class="icon mr-3"></span>
      <span>
        <i class="fas fa-trash"></i>
      </span>
    `;

    // add click event handler
    const el = document.getElementById(newRow.id);
    const elIcon = document.querySelector(`#col-task-link-${task.id} > .icon`);
    el.addEventListener('click', (e) => {
      // if they clicked on the trash icon then delete the task
      if (e.target.classList.contains('fa-trash')) {
        deleteTask(task.id);
      }
      else {
        // toggle the task
        UI.toggleTask(task.id);
        // hide icon after they click
        elIcon.innerHTML = '';
      }
    });

    // add hover event handler
    el.addEventListener('mouseenter', (e) => {
      if (document.getElementById(`row-task-${task.id}`).classList.contains('bg-success')) {
        elIcon.innerHTML = '<i class="fas fa-stop"></i>';
      } else {
        elIcon.innerHTML = '<i class="fas fa-play"></i>';
      }
    });
    el.addEventListener('mouseleave', (e) => {
      elIcon.innerHTML = '';
    });

    // call taskChanged to set the initial time values
    UI.taskChanged(task);

  }

  static removeTask(taskId) {
    document.getElementById(`row-task-${taskId}`).remove();
  }

  static refreshLastActive(task) {
    document.getElementById(`col-task-last-active-${task.id}`).innerHTML = UI.getLastActiveStr(task);
  }

  static toggleTask(taskId) {
    // call thet app.js level function to toggle
    toggleTask(taskId);
  }

  static taskChanged(task, which = false) {

    // update Last Active
    UI.refreshLastActive(task);

    // update Time Logged
    document.getElementById(`col-task-logged-${task.id}`).innerHTML = UI.getLoggedTimeStr(task.logged);

    // set ACTIVE style
    if (task.started !== null) {
      // Add CSS to indicate the task is active
      document.getElementById(`row-task-${task.id}`).classList.add('bg-success');
    }

    // if the task was stopped, indicate the change by setting the background color to red for 3 seconds
    if (which == 'STOPPED') {
      document.getElementById(`row-task-${task.id}`).classList.remove('bg-success');
      document.getElementById(`row-task-${task.id}`).classList.add('bg-danger');
      setTimeout(() => {
        document.getElementById(`row-task-${task.id}`).classList.remove('bg-danger');
      }, 3000)
    }

  }

}