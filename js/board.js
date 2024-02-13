const rowIdName = [
    { id: 'todo', name: 'ToDo' },
    { id: 'inprogress', name: 'In Progress' },
    { id: 'awaitfeedback', name: 'Await Feedback' },
    { id: 'done', name: 'Done' },
]


/**
 * initfunction for the board site
 */
async function initBoardSite() {
    await initJoin();
    clearRows();
    renderTasks();
    renderEmptyRowMessage();
    renderAddtaskFields();
}


// DEBUGING ##################################################################
// change for addtask and bigtask
function debug_hide_taskbigcard() {
    setStyle('task_big', 'transform', 'translateX(200%)');
    setTimeout(() => {
        document.getElementById('board_overlay').style = "z-index: -1;";
    }, 200);
}
//############################################################################


/**
 * render all task in the related rows
 */
function renderTasks() {
    for (let index = 0; index < sessionTasks.length; index++) {
        const task = sessionTasks[index];
        const tasksHTML = getTaskHTML(task);
        const tasklist = document.getElementById('tasklist_' + task.status);
        if (tasklist) tasklist.innerHTML += tasksHTML;
    }
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
        setInnerHTML('task_big', getBigTaskHTML(task));
        let taskBigWidth = document.getElementById('task_big').clientWidth;
        setStyle('board_overlay', 'z-index', '10');
        setStyle('task_big', 'transform', `translateX(0)`);
    }
}


/**
 * get the rendered html structure of the big task view
 * 
 * @param {Object} task 
 * @returns {string} rendered html
 */
function getBigTaskHTML(task) {
    return `
        <div class="task_big_headline">
            ${getCategoryHTML(task)}
            <img onclick="debug_hide_taskbigcard()" src="./img/icons/board/close.svg" alt="">
        </div>
        <span class="task_big_title">${task.title}</span>
        <span class="task_big_description">${task.description ? task.description : ''}</span>
        <div class="task_big_property"><span class="">Due Date:</span><span>${task.date}</span></div>
        <div class="task_big_property">
            <span>Priority:</span>
            <span>${getPascalCaseWord(task.priority)}</span>
            ${getTaskPriorityHTML(task)}
        </div>
        <div>
            <span>Assigned To:</span>
            <div class="task_big_assign_list">${getAssignedToHTML(task)}</div>
        </div>
        <div>${getSubTaskBigHTML(task)}</div>
        <div class="task_big_buttons">
            <button><img src="./img/icons/board/delete-img.png" alt=""></button>
            <div></div>
            <button><img src="./img/icons/board/edit-img.png" alt=""></button>
        </div>
    `;
}


/**
 * get the rendered html structure of the mini task view for board rows
 * 
 * @param {Object} task 
 * @returns {string} rendered html
 */
function getTaskHTML(task) {
    return `
    <div onclick="showBigTaskView('${task.id}')" class="board_task">
        ${getCategoryHTML(task)}
        <div class="board_tast_description">
            <span>${task.title}</span>
            <span>${task.description}</span>
        </div>
        ${getMiniSubTaskHTML(task)}
        <div class="board_task_footer">
            <div class="board_task_assign">
            ${getTaskAssignedContactsHTML(task)}
            </div>
            ${getTaskPriorityHTML(task)}
        </div>
    </div>`;
}


/**
 * get the contactslist that assigned to the task for big task view
 * 
 * @param {Object} task 
 * @returns {string} rendered html
 */
function getAssignedToHTML(task) {
    let assignedHTML = '';
    for (let index = 0; index < task.assignedto.length; index++) {
        const contact = sessionContacts.find(c => c.id == task.assignedto[index]);
        if (contact) assignedHTML += `
            <div>
                <span style="background-color: ${contact.color};">${contact.initial}</span>
                <span>${contact.name}</span>
            </div>
        `;
    }
    return assignedHTML;
}


/**
 * get the html structure of the task category for big and mini view
 * 
 * @param {Object} task 
 * @returns {string} rendered html
 */
function getCategoryHTML(task) {
    return `
        <span style="background-color: ${taskCategorys[task.category].color};">
        ${taskCategorys[task.category].name}
        </span>
    `;
}


/**
 * get the img tag for task priority with the right picture src
 * 
 * @param {Object} task 
 * @returns {string} rendered html
 */
function getTaskPriorityHTML(task) {
    const priorityIMGs = {
        urgent: './img/icons/board/urgent.svg',
        medium: './img/icons/board/medium.svg',
        low: './img/icons/board/low.svg',
    }
    return `<img src="${priorityIMGs[task.priority] ? priorityIMGs[task.priority] : ''}">`;
}


/**
 * get the subtasklist for the mini task view
 * 
 * @param {Object} task 
 * @returns {string} rednered html
 */
function getMiniSubTaskHTML(task) {
    if (task.subtasks.length == 0) return '';
    let subtaskHTML = '<div class="board_task_sub">';
    let taskDone = 0;
    task.subtasks.forEach(t => { if (t.done) taskDone++; })
    subtaskHTML += `
            <div><div style="width: ${taskDone / task.subtasks.length * 100}%;"></div>
            </div><span>${taskDone}/${task.subtasks.length} Subtask</span>
        `;
    subtaskHTML += '</div>';
    return subtaskHTML;
}


/**
 * get the bubtasklist for the big task view
 * 
 * @param {Object} task 
 * @returns {string} rendered html
 */
function getSubTaskBigHTML(task) {
    if (task.subtasks.length == 0) return '';
    let subtaskHTML = '<span>Subtasks</span><div class="task_big_subtask_list">';
    for (let index = 0; index < task.subtasks.length; index++) {
        const subtask = task.subtasks[index];
        subtaskHTML += `
            <div>
                <img id="${task.id + '_' + index}" onclick="clickSubTaskDone('${task.id}',${index})" src="${getSubTaskStateImgSrc(subtask.done)}">
                <span>${subtask.name}</span>
            </div>
            `;
    }
    subtaskHTML += '</div>';
    return subtaskHTML;
}


/**
 * get the right (checked/unchecked) src for the subtask
 * 
 * @param {boolean} state 
 * @returns {string} image src path
 */
function getSubTaskStateImgSrc(state) {
    return `./img/icons/board/${state ? 'cf_checked.svg' : 'cf_unchecked.svg'}`;
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
    let subtask = task.subtasks[subtaskNumber];
    subtask.done = !subtask.done;
    document.getElementById(task.id + '_' + subtaskNumber).src = getSubTaskStateImgSrc(subtask.done);
}


/**
 * get the contacts that assigned to the task for the mini task view
 * 
 * @param {Object} task 
 * @returns {string} rednered html
 */
function getTaskAssignedContactsHTML(task) {
    let assignedcontactsHTML = '';
    for (let index = 0; index < task.assignedto.length; index++) {
        const contactID = task.assignedto[index];
        const contact = sessionContacts.find(c => c.id == contactID);
        if (contact) {
            assignedcontactsHTML += `
            <span style="background-color: ${contact.color}; color: black;">
            ${contact.initial}
            </span>
            `;
        }
    }
    return assignedcontactsHTML;
}