/**
 * get the contact HTML string for the assignedto list
 * 
 * @param {Object} contact 
 * @param {string} prefix 
 * @returns {string}
 */
function getAssignedContactHTML(contact, prefix) {
    return `
    <div nolistclose id="${prefix}assignedContacts_${contact.id}" checked="true">
        <label nolistclose for="${prefix}task_assigned_${contact.id}">
            <span nolistclose style="background-color: ${contact.color};">${contact.initial}</span>
            <span nolistclose>${contact.name}</span>
            <img nolistclose src="../img/icons/add-task/cf-unchecked-black.svg" alt="">
        </label>
        <input nolistclose id="${prefix}task_assigned_${contact.id}" name="task_assigned_${contact.id}" type="checkbox" id="contactsCheckbox_${contact.id}">
    </div>
`;
}


/**
 * get the subtask HTML string
 * 
 * @param {string} subtaskID 
 * @param {string} subtaskname 
 * @returns {string}
 */
function getSubTaskHTML(subtaskID, subtaskname) {
    return `
    <div id="subtaskdiv${subtaskID}" editmode="false" class="subtask_row">
    <input maxlength="100" onfocusout="changeSubTask('${subtaskID}')" onkeydown="if(event.key == 'Enter') changeSubTask('${subtaskID}')" name="task_subtask${subtaskID}" id="subtask${subtaskID}" type="text" value="${subtaskname}">
    <div lipoint class="subtask_point"></div>
    <span ondblclick="setSubTaskEditMode('${subtaskID}','true')" id="subtaskspan${subtaskID}">${subtaskname}</span>
    <div showaction>
        <img onclick="setSubTaskEditMode('${subtaskID}','true')" src="../img/icons/add-task/edit.svg" alt="">
        <div line></div>
        <img onclick="deleteSubTask('${subtaskID}')" src="../img/icons/add-task/delete.svg" alt="">
    </div>
    <div editaction>
        <img onmousedown="deleteSubTask('${subtaskID}')" src="../img/icons/add-task/delete.svg" alt="">
        <div line></div>
        <img onmousedown="changeSubTask('${subtaskID}')" src="../img/icons/add-task/ok.svg" alt="">
    </div>
    </div>
    `
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
            <img class="round_button" onclick="closeOverlay(event)" src="./img/icons/board/close.svg" alt="">
        </div>
            <div class="task_scrolldiv custom-scrollbar">
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
        </div>
        <div class="task_big_buttons">
            <button onclick="deletetask('${task.id}')"><img src="./img/icons/board/delete-img.png" alt=""></button>
            <div></div>
            <button onclick="showEditTaskMode('${task.id}')"><img src="./img/icons/board/edit-img.png" alt=""></button>
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
    <div id="minitask_${task.id}"
        ondragend="draggableEnd(event, '${task.id}')"
        ondragstart="draggableBegin(event,'${task.id}')"
        onclick="showBigTaskView('${task.id}')"
        class="board_task"
        draggable="true">
        <div class="minitask_header">
            ${getCategoryHTML(task)}
            ${getMoveTaskMenu(task)}
        </div>
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
 * get the movetask menu
 * 
 * @param {Object} task 
 * @returns {string}
 */
function getMoveTaskMenu(task) {
    let menuPoints = '';
    rowIdName.forEach((row) => {
        if (task.status != row.id) menuPoints += `
            <span onclick="setNewStatus('${task.id}','${row.id}'); event.stopPropagation();">${row.name}</span>
            `;
    });
    return `
    <div class="taskmove" title="Move task...">
        <img onclick="clickDropDown(event,'taskmove_${task.id}')" src="./img/icons/general/white/board-white.svg">
        <div dropdownopen=false class="taskmove_menu" id="taskmove_${task.id}">${menuPoints}</div>
    </div>
    `;
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
 * get the subtasklist for the big task view
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
 * get the contacts that assigned to the task for the mini task view
 * 
 * @param {Object} task 
 * @returns {string} rednered html
 */
function getTaskAssignedContactsHTML(task) {
    let assignedcontactsHTML = '';
    for (let index = 0; index < task.assignedto.length && index < 3; index++) {
        const contactID = task.assignedto[index];
        const contact = sessionContacts.find(c => c.id == contactID);
        if (contact) {
            assignedcontactsHTML += getAssignedToSpan(contact.color, contact.initial);
        }
    }
    if (task.assignedto.length > 3) {
        assignedcontactsHTML += getAssignedToSpan('lightgray', '&plus;' + (task.assignedto.length - 3));
    }
    return assignedcontactsHTML;
}


function getAssignedToSpan(badgeColor, badgeInitials) {
    return `
    <span style="background-color: ${badgeColor}; color: black;">${badgeInitials}</span>
    `;
}


/**
 * get the HTML string for the row header of the tasklist
 * 
 * @param {Object} rowObj 
 * @returns {string}
 */
function getTaskRowHTML(rowObj) {
    return `
        <div id="taskrow_${rowObj.id}" class="board_task_row" ondragenter="draggableEnter(event,'${rowObj.id}')" ondragleave="draggableLeave(event,'${rowObj.id}')">
        <div class="board_task_head">
            <span>${rowObj.name}</span>
            ${rowObj.addbutton
            ? `<img onclick="showAddTaskOverlay('${rowObj.id}')" src="./img/icons/board/plus-button.svg" alt="">`
            : ''
        }
        </div>
        <div id="tasklist_${rowObj.id}" class="board_task_list"></div></div>
    `;
}


function getRequestWindowHTML(id, question) {
    return `
    <div onclick="event.stopPropagation()" id="${id}" class="request-proof-window">
    <div class="request-question-container">
        <span class="request-question">${question}</span>
    </div>
    <div class="request-button-container">   
        <button type="button" class="btnCancel" onclick="">
            <span>Cancel</span>
            <img src="./img/icons/contacts/cancel.svg" alt="cancel">
        </button>
        <button type="button" class="btnAddOk" onclick="">
            <span>Yes</span>
            <img src="./img/icons/contacts/check-white.svg" alt="check">
        </button>
    </div>
</div>
`;
}