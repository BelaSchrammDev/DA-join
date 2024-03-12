/**
 * The ID of the currently dragged task.
 * @type {string}
 */
let currentDraggableTaskID = '';


/**
 * The ID of the currently displayed flying window.
 * @type {string}
 */
let current_flyingwindow_id = '';


/**
 * The ID of the currently selected task.
 * @type {string}
 */
let current_taskID = '';


/**
 * Initializes the board site.
 */
async function initBoardSite() {
    await initJoin();
    renderRows();
    renderTasks();
    renderAddtaskFields();
    renderAssignedContacts('edittask_assigned_list', 'edittask_');
    addDropDownList('edittask_assignet', openAssignedContactsDropDownList, 'edittask_');
    addDropDownList('deletetask_confirm', openDeleteTaskConfirm, '');
    setAttribute('edittask_duedate', 'min', new Date().toISOString().split('T')[0]);
    actionAfterAddTask = afterAddTask;
    addMediaQueryForDragToggling();
}


/**
 * Adds a media query for toggling draggable tasks based on screen size.
 */
function addMediaQueryForDragToggling() {
    let query = window.matchMedia("(max-width: 1200px)");
    query.onchange = (query) => {
        const taskdivs = document.querySelectorAll('div.board_task');
        const value = !query.matches;
        taskdivs.forEach(div => div.draggable = value);
    }
    query.onchange(query);
}


/**
 * Callback function after adding a task.
 * Stores the tasks to the remote storage and closes the overlay.
 */
function afterAddTask() {
    storeSessionTasksToRemoteStorage();
    closeOverlay();
    renderTasks();
}


/**
 * Shows an overlay window.
 * 
 * @param {string} windowID - The ID of the window to show.
 */
function showOverlay(windowID) {
    current_flyingwindow_id = windowID;
    setStyle('board_overlay', 'z-index', '10');
    setStyle('board_overlay', 'background-color', 'rgba(0, 0, 0, 0.2)');
    setStyle(windowID, 'transform', `translateX(0)`);
}


/**
 * Closes the currently displayed overlay window.
 */
function closeOverlay() {
    if (current_flyingwindow_id != '') {
        setStyle(current_flyingwindow_id, 'transform', 'translateX(130vw)');
        setStyle('board_overlay', 'background-color', 'rgba(0, 0, 0, 0.0)');
        current_flyingwindow_id = '';
        setTimeout(() => { setStyle('board_overlay', 'z-index', '-1'); }, 200);
        hideEditTaskMode();
        current_taskID = '';
    }
}


/**
 * Shows the add task overlay window.
 * 
 * @param {string} newtaskStatus - The status of the new task.
 */
function showAddTaskOverlay(newtaskStatus) {
    presetStatusByAddTask = newtaskStatus;
    getElement('addtask_form').reset();
    showOverlay('addtask_overlay');
}


/**
 * Submits the edit task form.
 */
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


/**
 * Shows the edit task mode.
 * 
 * @param {string} taskID - The ID of the task to edit.
 */
function showEditTaskMode(taskID) {
    const task = sessionTasks.find(t => t.id == taskID);
    if (task) {
        fillEditTaskFormular(task);
        setStyle('task_big_showing', 'display', 'none');
        setStyle('edittask_form', 'display', 'flex');
    }
}


/**
 * switches the edit task mode off and shows the task big view.
 */
function hideEditTaskMode() {
    setStyle('task_big_showing', 'display', 'flex');
    setStyle('edittask_form', 'display', 'none');
}


/**
 * Fills the edit task form with data from a task object.
 * 
 * @param {Object} task - The task object to fill the form with.
 */
function fillEditTaskFormular(task) {
    setInputValue('edittask_category', taskCategorys[task.category].name);
    setInputValue('edittask_title', task.title);
    setInputValue('edittask_decription', task.description);
    setCharactersLeft(getElement('edittask_decription'));
    setInputValue('edittask_duedate', task.date);
    setPriorityRadioButton(task.priority);
    setAssignedToButtons(task.assignedto);
    setSubTasks(task.subtasks);
}


/**
 * Sets the subtasks in the edit task form.
 * 
 * @param {Array} subtaskList - The list of subtasks.
 */
function setSubTasks(subtaskList) {
    let subtaskHTML = '';
    for (let index = 0; index < subtaskList.length; index++) {
        const subtask = subtaskList[index];
        if (!subtask.id) subtask.id = createUniqueID('est_');
        subtaskHTML += getSubTaskHTML(subtask.id, subtask.name);
    }
    setInnerHTML('edittask_subtask_list', subtaskHTML);
}


/**
 * Sets the assigned contacts in the edit task form.
 * 
 * @param {Array} assignedToList - The list of assigned contacts.
 */
function setAssignedToButtons(assignedToList) {
    for (let index = 0; index < sessionContacts.length; index++) {
        const contactsID = sessionContacts[index].id;
        const assignedCheckBox = getElement('edittask_task_assigned_' + contactsID);
        if (assignedCheckBox) assignedCheckBox.checked = assignedToList.includes(contactsID);
    }
    setAssignedContactsBar('edittask_')
}


/**
 * Sets the priority radio button in the edit task form.
 * 
 * @param {string} priority - The priority value.
 */
function setPriorityRadioButton(priority) {
    const prioTypes = ['urgent', 'medium', 'low'];
    for (let index = 0; index < prioTypes.length; index++) {
        const prioInput = getElement('edittaskprio_' + prioTypes[index]);
        prioInput.checked = prioTypes[index] == priority;
    }
}


/**
 * Handles the click event on a subtask and changes its state,
 * stores the changes to the remote storage and updates the mini task card.
 * 
 * @param {string} taskID - The ID of the task.
 * @param {number} subtaskNumber - The index of the subtask.
 */
function clickSubTaskDone(taskID, subtaskNumber) {
    let task = sessionTasks.find(t => t.id == taskID);
    if (task) {
        let subtask = task.subtasks[subtaskNumber];
        subtask.done = !subtask.done;
        document.getElementById(task.id + '_' + subtaskNumber).src = getSubTaskStateImgSrc(subtask.done);
        updateMiniTaskCard(taskID);
        storeSessionTasksToRemoteStorage();
    }
}


/**
 * Deletes a task and stores the changes to the remote storage,
 * closes the overlay and renders the tasks.
 * 
 * @param {string} taskID - The ID of the task to delete.
 */
function deletetask() {
    const taskArrayIndex = sessionTasks.findIndex(t => t.id == current_taskID);
    if (taskArrayIndex) {
        sessionTasks.splice(taskArrayIndex, 1);
        storeSessionTasksToRemoteStorage();
        closeOverlay();
        renderTasks();
    }
}


/**
 * Sets the new status of a task and clears the search field.
 * also stores the changes to the remote storage.
 * 
 * @param {string} taskID - The ID of the task to update.
 * @param {string} newStatus - The new status value.
 */
function setNewStatus(taskID, newStatus) {
    const task = sessionTasks.find(t => t.id == taskID);
    if (task && newStatus != '') task.status = newStatus;
    setInputValue('tasksearchfield');
    renderTasks();
    storeSessionTasksToRemoteStorage();
}


/**
 * Event handler for the draggable task when the drag starts.
 * 
 * @param {DragEvent} event - The drag event.
 * @param {string} taskID - The ID of the task being dragged.
 */
function draggableBegin(event, taskID) {
    currentDraggableTaskID = taskID;
    addClass('minitask_' + taskID, 'task_draggable');
}


/**
 * Event handler for the draggable task when the drag ends.
 * 
 * @param {DragEvent} event - The drag event.
 * @param {string} taskID - The ID of the task being dragged.
 */
function draggableEnd(event, taskID) {
    event.preventDefault();
    removeClass('minitask_' + taskID, 'task_draggable');
    const hightlightedRow = document.querySelector('.row_draggable');
    if (hightlightedRow) removeClass(hightlightedRow, 'row_draggable');
    setNewStatus(taskID, getRowIDFromMousePosition(event.clientX, event.clientY));
}


/**
 * Event handler for the dragover event. to chenge the cursor.
 * 
 * @param {DragEvent} event - The drag event.
 */
function dragOver(event) {
    event.preventDefault();
}


/**
 * Gets the ID of the row based on the mouse position.
 * 
 * @param {number} posX - The X coordinate of the mouse position.
 * @param {number} posY - The Y coordinate of the mouse position.
 * @returns {string} - The ID of the row.
 */
function getRowIDFromMousePosition(posX, posY) {
    const isBetween = (num1, value, num2) => num1 < value && value < num2;
    for (let index = 0; index < rowIdName.length; index++) {
        const element = getElement('taskrow_' + rowIdName[index].id);
        const rect = element.getBoundingClientRect();
        if (isBetween(rect.left, posX, rect.right) && isBetween(rect.top, posY, rect.bottom))
            return rowIdName[index].id;
    }
    return '';
}


/**
 * Event handler for the draggable task when it enters a row.
 * 
 * @param {DragEvent} event - The drag event.
 * @param {string} rowID - The ID of the row.
 */
function draggableEnter(event, rowID) {
    event.preventDefault();
    addClass('taskrow_' + rowID, 'row_draggable');
    currentDragHighlightID = event.target.id;
}


/**
 * Event handler for the draggable task when it leaves a row.
 * 
 * @param {DragEvent} event - The drag event.
 * @param {string} rowID - The ID of the row.
 */
function draggableLeave(event, rowID) {
    event.preventDefault();
    if (currentDragHighlightID === event.target.id) {
        removeClass('taskrow_' + rowID, 'row_draggable');
        currentDragHighlightID = '';
    }
}


/**
 * Opens the move menu for a task.
 * 
 * @param {string} menuID - The ID of the move menu.
 * @param {boolean} open - Whether to open or close the move menu.
 */
function openMoveMenu(menuID, open) {
    const menu = getElement(menuID);
    if (menu) menu.setAttribute('dropdownopen', open);
}


/**
 * Executes when the user presses any key in the task search field.
 * 
 * @param {Event} event 
 */
function changeTaskSearchTerm(event) {
    renderTasks(event.target.value);
}


/**
 * Clears the task search field and render all tasks.
 */
function clickClearTaskSearch() {
    setInputValue('tasksearchfield');
    renderTasks();
}


function openDeleteTaskConfirm(formID, open) {
    setStyle('delete_task_confirm', 'transform', open ? 'translateX(0)' : 'translateX(150vw)');
}