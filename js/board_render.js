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
 * Renders the rowheaders of the board.
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
 * only tasks that match the filter will be rendered.
 * if filter is empty, all tasks will be rendered.
 * function returns the number of tasks rendered.
 * 
 * @param {string} [filter=''] - The filter string to apply to the tasks.
 * @returns {number} - The number of tasks rendered.
 */
function renderTasks(filter = '') {
    resetAllDropDowns();
    clearRows();
    let renderedTasks = 0;
    for (let index = 0; index < sessionTasks.length; index++) {
        const task = sessionTasks[index];
        if (ifFilterTask(task, filter)) {
            renderedTasks++;
            const tasksHTML = `<div id="taskcard_${task.id}">${getTaskHTML(task)}</div>`;
            const tasklist = document.getElementById('tasklist_' + task.status);
            if (tasklist) tasklist.innerHTML += tasksHTML;
            addDropDown('taskmove_' + task.id, openMoveMenu, 'taskmove_' + task.id);
        }
    }
    renderEmptyRowMessage();
    return renderedTasks;
}


/**
 * Checks if a task matches the given filter.
 * If the filter is empty, the task will always match.
 *
 * @param {Object} task - The task object to check.
 * @param {string} filter - The filter string to match against the task.
 * @returns {boolean} - Returns true if the task matches the filter, false otherwise.
 */
function ifFilterTask(task, filter) {
    return filter == ''
        || task.title.toLowerCase().includes(filter.toLowerCase())
        || task.description.toLowerCase().includes(filter.toLowerCase());
}


/**
 * Renders an info message when a row is empty.
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
 * Clears all the tasks from the board.
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


