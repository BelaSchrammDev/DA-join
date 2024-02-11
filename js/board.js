async function initBoardSite() {
    await initJoin();
    // renderfunctions
    renderTasks();
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
    let tasksHTML = '';
    for (let index = 0; index < sessionTasks.length; index++) {
        const task = sessionTasks[index];
        tasksHTML += getTaskHTML(task);
    }
    document.getElementById('tasklist_todo').innerHTML = tasksHTML;
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
            <img src="./img/icons/board/medium.svg" alt="">
        </div>
    </div>
`;
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
        assignedcontactsHTML += `
            <span style="background-color: ${contact.color}; color: black;">
            ${contact.initial}
            </span>
        `;
    }
    return assignedcontactsHTML;
}