const rowIdName = [
    { id: 'todo', name: 'ToDo' },
    { id: 'inprogress', name: 'In Progress' },
    { id: 'awaitfeedback', name: 'Await Feedback' },
    { id: 'done', name: 'Done' },
]


async function initBoardSite() {
    await initJoin();
    clearRows();
    renderTasks();
    renderEmptyRowMessage();
}


function debug_view_taskbigcard() {
    let taskBigWidth = document.getElementById('task_big').clientWidth;
    document.getElementById('board_overlay').style = "z-index: 10;";
    document.getElementById('task_big').style = `right: calc(50% - ${taskBigWidth / 2}px);`;
}


function debug_hide_taskbigcard() {
    let taskBigWidth = document.getElementById('task_big').clientWidth;
    document.getElementById('task_big').style = `right: -${taskBigWidth}px;`;
    setTimeout(() => {
        document.getElementById('board_overlay').style = "z-index: -1;";
    }, 200);
}


function renderTasks() {
    for (let index = 0; index < sessionTasks.length; index++) {
        const task = sessionTasks[index];
        const tasksHTML = getTaskHTML(task);
        const tasklist = document.getElementById('tasklist_' + task.status);
        if (tasklist) tasklist.innerHTML += tasksHTML;
    }
}


function renderEmptyRowMessage() {
    for (let index = 0; index < rowIdName.length; index++) {
        const tasklist = document.getElementById('tasklist_' + rowIdName[index].id);
        if (tasklist.innerHTML == '') {
            tasklist.innerHTML = `<div class="board_task_empty">No tasks ${rowIdName[index].name}</div>`;
        }
    }
}


function clearRows() {
    for (let index = 0; index < rowIdName.length; index++) {
        const tasklist = document.getElementById('tasklist_' + rowIdName[index].id);
        tasklist.innerHTML = ``;
    }
}


function getTaskHTML(task) {
    return `
    <div onclick="debug_view_taskbigcard()" class="board_task">
        <span style="background-color: ${taskCategorys[task.category].color};">${taskCategorys[task.category].name}</span>
        <div class="board_tast_description">
            <span>${task.title}</span>
            <span>${task.description}</span>
        </div>
        ${getSubTaskHTML(task)}
        <div class="board_task_footer">
            <div class="board_task_assign">
            ${getTaskAssignedContactsHTML(task)}
            </div>
            ${getTaskPriorityHTML(task)}
        </div>
    </div>`;
}


function getTaskPriorityHTML(task) {
    const priorityIMGs = {
        urgent: './img/icons/board/urgent.svg',
        medium: './img/icons/board/medium.svg',
        low: './img/icons/board/low.svg',
    }
    return `<img src="${priorityIMGs[task.priority] ? priorityIMGs[task.priority] : ''}">`;
}


function getSubTaskHTML(task) {
    if (task.subtasks.length == 0) return '';
    let subtaskHTML = '<div class="board_task_sub">';
    if (task.subtasks.length > 0) {
        let taskDone = 0;
        task.subtasks.forEach(t => { if (t.done) taskDone++; })
        subtaskHTML += `
            <div><div style="width: ${taskDone / task.subtasks.length * 100}%;"></div>
            </div><span>${taskDone}/${task.subtasks.length} Subtask</span>
        `;
    }
    subtaskHTML += '</div>';
    return subtaskHTML;
}


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