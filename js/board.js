const rowIdName = [
    { id: 'todo', name: 'ToDo', addbutton: true },
    { id: 'inprogress', name: 'In Progress', addbutton: true },
    { id: 'awaitfeedback', name: 'Await Feedback', addbutton: true },
    { id: 'done', name: 'Done', addbutton: false },
]

let current_flyingwindow_id = '';
let current_taskID = '';


function testrequest() {
    let div = getElement('requestdiv');
    div.innerHTML = getRequestWindowHTML(1, 'testfrage?');
    showOverlay('requestdiv');
}


/**
 * initfunction for the board site
 */
async function initBoardSite() {
    await initJoin();
    renderRows();
    renderTasks();
    renderAddtaskFields();
    renderAssignedContacts('edittask_assigned_list', 'edittask_');
    setAttribute('edittask_duedate', 'min', new Date().toISOString().split('T')[0]);
    actionAfterAddTask = afterAddTask;
}


function afterAddTask() {
    storeSessionTasksToRemoteStorage();
    closeOverlay();
    renderTasks();
}


function showOverlay(windowID) {
    current_flyingwindow_id = windowID;
    setStyle('board_overlay', 'z-index', '10');
    setStyle('board_overlay', 'background-color', 'rgba(0, 0, 0, 0.2)');
    setStyle(windowID, 'transform', `translateX(0)`);
}


/**
 * close the current showing overlay
 */
function closeOverlay(event = null) {
    if (current_flyingwindow_id != '') {
        setStyle(current_flyingwindow_id, 'transform', 'translateX(100vw)');
        setStyle('board_overlay', 'background-color', 'rgba(0, 0, 0, 0.0)');
        current_flyingwindow_id = '';
        setTimeout(() => { setStyle('board_overlay', 'z-index', '-1'); }, 200);
        hideEditTaskMode();
    }
}


function renderRows() {
    let rowsHTML = '';
    for (let index = 0; index < rowIdName.length; index++) {
        rowsHTML += getTaskRowHTML(rowIdName[index]);
    }
    setInnerHTML('board_task_rows', rowsHTML);
}


/**
 * render all task in the related rows
 */
function renderTasks() {
    clearRows();
    for (let index = 0; index < sessionTasks.length; index++) {
        const task = sessionTasks[index];
        const tasksHTML = `<div id="taskcard_${task.id}">${getTaskHTML(task)}</div>`;
        const tasklist = document.getElementById('tasklist_' + task.status);
        if (tasklist) tasklist.innerHTML += tasksHTML;
    }
    renderEmptyRowMessage();
}


/**
 * render info in empty rows
 */
function renderEmptyRowMessage() {
    for (let index = 0; index < rowIdName.length; index++) {
        const tasklist = document.getElementById('tasklist_' + rowIdName[index].id);
        if (tasklist.innerHTML == '') {
            tasklist.innerHTML = `<div class="board_task_empty">No tasks ${rowIdName[index].name}</div>`;
        }
    }
}


/**
 * clear all the rows of the board
 */
function clearRows() {
    for (let index = 0; index < rowIdName.length; index++) {
        const tasklist = document.getElementById('tasklist_' + rowIdName[index].id);
        tasklist.innerHTML = ``;
    }
}


/**
 * render and show the big task view window
 * 
 * @param {string} taskID 
 */
function showBigTaskView(taskID) {
    const task = sessionTasks.find(t => t.id == taskID);
    if (task) {
        current_taskID = taskID;
        updateBigTaskView(task);
        // setInnerHTML('task_big_showing', getBigTaskHTML(task));
        showOverlay('task_big')
    }
}


function updateBigTaskView(task) {
    setInnerHTML('task_big_showing', getBigTaskHTML(task));
}


function showAddTaskOverlay(newtaskStatus) {
    presetStatusByAddTask = newtaskStatus;
    showOverlay('addtask_overlay');
}


function updateMiniTaskCard(taskID) {
    const task = sessionTasks.find(t => t.id == taskID);
    const taskCard = getElement('taskcard_' + taskID);
    if (task && taskCard) {
        taskCard.innerHTML = getTaskHTML(task);
    }
}


function submitEditTaskForm() {
    const searchForm = document.getElementById('edittask_form');
    let formData = new FormData(searchForm);
    const task = sessionTasks.find(t => t.id == current_taskID);
    if (task) {
        fillTaskObjectFromFormData(task, Object.fromEntries(formData));
        updateMiniTaskCard(current_taskID);
        updateBigTaskView(task);
        storeSessionTasksToRemoteStorage();
    }
    hideEditTaskMode();
}


function showEditTaskMode(taskID) {
    const task = sessionTasks.find(t => t.id == taskID);
    if (task) {
        fillEditTaskFormular(task);
        setStyle('task_big_showing', 'display', 'none');
        setStyle('task_big_edit', 'display', 'flex');
    }
}


function hideEditTaskMode() {
    current_taskID = '';
    setStyle('task_big_showing', 'display', 'flex');
    setStyle('task_big_edit', 'display', 'none');
}


function fillEditTaskFormular(task) {
    setInputValue('edittask_category', taskCategorys[task.category].name);
    setInputValue('edittask_title', task.title);
    setInputValue('edittask_decription', task.description);
    setInputValue('edittask_duedate', task.date);
    setPriorityRadioButton(task.priority);
    setAssignedToButtons(task.assignedto);
    setSubTasks(task.subtasks);
}


function setSubTasks(subtaskList) {
    let subtaskHTML = '';
    for (let index = 0; index < subtaskList.length; index++) {
        const subtask = subtaskList[index];
        subtaskHTML += getSubTaskHTML(createUniqueID('est_'), subtask.name);
    }
    setInnerHTML('edittask_subtask_list', subtaskHTML);
}


function setAssignedToButtons(assignedToList) {
    for (let index = 0; index < sessionContacts.length; index++) {
        const contactsID = sessionContacts[index].id;
        const assignedCheckBox = getElement('edittask_task_assigned_' + contactsID);
        if (assignedCheckBox) assignedCheckBox.checked = assignedToList.includes(contactsID);
    }
    setAssignedContactsBar('edittask_')
}


function setPriorityRadioButton(priority) {
    const prioTypes = ['urgent', 'medium', 'low'];
    for (let index = 0; index < prioTypes.length; index++) {
        const prioInput = getElement('edittaskprio_' + prioTypes[index]);
        prioInput.checked = prioTypes[index] == priority;
    }
}


/**
 * function executes when a subtask is clicked an change the state
 * in the picture and the taskObject itself
 * 
 * @param {string} taskID 
 * @param {number} subtaskNumber subtaskindex
 */
function clickSubTaskDone(taskID, subtaskNumber) {
    let task = sessionTasks.find(t => t.id == taskID);
    if (task) {
        let subtask = task.subtasks[subtaskNumber];
        subtask.done = !subtask.done;
        document.getElementById(task.id + '_' + subtaskNumber).src = getSubTaskStateImgSrc(subtask.done);
        updateMiniTaskCard(taskID);
    }
}


function deletetask(taskID) {
    const taskArrayIndex = sessionTasks.findIndex(t => t.id == taskID);
    if (taskArrayIndex) {
        sessionTasks.splice(taskArrayIndex, 1);
        storeSessionTasksToRemoteStorage();
        closeOverlay();
        renderTasks();
    }
}

let currentDraggableTaskID = '';

function draggableBegin(event, taskID) {
    currentDraggableTaskID = taskID;
    getElement('minitask_' + taskID).classList.add('task_draggable');
}


function draggableEnd(event, taskID) {
    getElement('minitask_' + taskID).classList.remove('task_draggable');
}

function draggableOver(event, rowID = '') {
    event.preventDefault();
    getElement(rowID).classList.add('row_draggable');
    currentDragHighlightID = event.target.id;
}


function draggableLeave(event, rowID = '') {
    event.preventDefault();
    if (currentDragHighlightID === event.target.id) getElement(rowID).classList.remove('row_draggable');
}

