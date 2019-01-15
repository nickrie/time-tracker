class UI {

  static getLastActiveStr(task) {

    let lastActive;

    if (task.started !== null) {
      lastActive = 'ACTIVE';
    }
    else {
      let lastMoment = moment(task.last);
      lastActive = lastMoment.from(new Date());
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
    newCol.classList = `col col-${width}`;
    newCol.id = `col-task-${desc}-${id}`;
    const newColContent = document.createTextNode(value);
    newCol.appendChild(newColContent);
    row.appendChild(newCol);

  }

  static displayTask(task) {

    // create our new row
    const newRow = document.createElement('div');
    newRow.classList = 'row p-2'
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

    UI.taskChanged(task);

  }

  static refreshLastActive(task) {
    document.getElementById(`col-task-last-active-${task.id}`).innerHTML = UI.getLastActiveStr(task);
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

    // set link
    if (task.started === null) {
      document.getElementById(`col-task-link-${task.id}`).innerHTML = `
        <a href="javascript:void(0);" onclick="startTask(${task.id});"><i class="fas fa-play"></i></a>
      `;
    }
    else {
      document.getElementById(`col-task-link-${task.id}`).innerHTML = `
        <a href="javascript:void(0);" onclick="stopTask(${task.id});"><i class="fas fa-stop"></i></a>
      `;
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