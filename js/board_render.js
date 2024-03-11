/**
 * An array of objects representing each row in the board.
 * Each object contains the id, name, and addbutton properties.
 * 
 * @type {Array<{id: string, name: string, addbutton: boolean}>}
 */
const rowIdName = [
    { id: 'todo', name: 'ToDo', addbutton: true },
    { id: 'inprogress', name: 'In Progress', addbutton: true },
    { id: 'awaitfeedback', name: 'Await Feedback', addbutton: true },
    { id: 'done', name: 'Done', addbutton: false },
]


/**
 * Renders the rows of the board.
 */
function renderRows() {
    let rowsHTML = '';
    for (let index = 0; index < rowIdName.length; index++) {
        rowsHTML += getTaskRowHTML(rowIdName[index]);
    }
    setInnerHTML('board_task_rows', rowsHTML);
}


/**
 * Renders all tasks in the related rows.
 * 
 * @param {string} [filter=''] - The filter string to apply to the tasks.
 */
function renderTasks(filter = '') {
    resetAllDropDowns();
    clearRows();
    for (let index = 0; index < sessionTasks.length; index++) {
        const task = sessionTasks[index];
        if (filter == ''
            || task.title.toLowerCase().includes(filter.toLowerCase())
            || task.description.toLowerCase().includes(filter.toLowerCase())) {

            const tasksHTML = `<div id="taskcard_${task.id}">${getTaskHTML(task)}</div>`;
            const tasklist = document.getElementById('tasklist_' + task.status);
            if (tasklist) tasklist.innerHTML += tasksHTML;
            addDropDownList('taskmove_' + task.id, openMoveMenu, 'taskmove_' + task.id);
        }
    }
    renderEmptyRowMessage();
}


/**
 * Renders an info message in empty rows.
 */
function renderEmptyRowMessage() {
    for (let index = 0; index < rowIdName.length; index++) {
        const tasklist = document.getElementById('tasklist_' + rowIdName[index].id);
        if (tasklist.innerHTML == '') {
            tasklist.innerHTML = `<div class="board_task_empty">No tasks<br>${rowIdName[index].name}</div>`;
        }
    }
}


/**
 * Clears all the rows of the board.
 */
function clearRows() {
    for (let index = 0; index < rowIdName.length; index++) {
        const tasklist = document.getElementById('tasklist_' + rowIdName[index].id);
        tasklist.innerHTML = ``;
    }
}


/**
 * Renders and shows the big task view window.
 * 
 * @param {string} taskID - The ID of the task to display.
 */
function showBigTaskView(taskID) {
    const task = sessionTasks.find(t => t.id == taskID);
    if (task) {
        current_taskID = taskID;
        updateBigTaskView(task);
        showOverlay('task_big')
    }
}


/**
 * Updates the content of the big task view window.
 * 
 * @param {Object} task - The task object to display.
 */
function updateBigTaskView(task) {
    setInnerHTML('task_big_showing', getBigTaskHTML(task));
}


/**
 * Updates the mini task card.
 * 
 * @param {string} taskID - The ID of the task to update.
 */
function updateMiniTaskCard(taskID) {
    const task = sessionTasks.find(t => t.id == taskID);
    const taskCard = getElement('taskcard_' + taskID);
    if (task && taskCard) {
        taskCard.innerHTML = getTaskHTML(task);
    }
}


