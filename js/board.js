/**
 * Represents the ID of the current flying window.
 * 
 * @type {string}
 */
let current_flyingwindow_id = '';

/**
 * Represents the ID of the current task in the big task view.
 * 
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
    initAddtaskFields();
    renderAssignedContacts('edittask_assigned_list', 'edittask_');
    addDropDowns();
    setAttribute('edittask_duedate', 'min', new Date().toISOString().split('T')[0]);
    actionAfterAddTask = afterAddTask;
    addMediaQueryForDragToggling();
    checkIfTaskAdded();
}


/**
 * Adds drop-down menus to the page.
 */
function addDropDowns() {
    addDropDown('edittask_assignet', openAssignedContactsDropDown, 'edittask_');
    addDropDown('deletetask_confirm', openFlyWindow, 'delete_task_confirm');
    addDropDown('taskadded_info', openFlyWindow, 'add_task_info');
}


/**
 * Checks if a task has been added and shows the info if so. 
 */
async function checkIfTaskAdded() {
    const taskaddedItem = await sessionStorage.getItem('taskadded');
    if (taskaddedItem) {
        showTaskAddedInfo();
        sessionStorage.removeItem('taskadded');
    }
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
 * Also renders the tasks and shows the task added info.
 */
function afterAddTask() {
    storeSessionTasksToRemoteStorage();
    closeOverlay();
    renderTasks();
    showTaskAddedInfo();
}


/**
 * Shows an overlay window and sets the current flying window ID.
 * 
 * @param {string} windowID - The ID of the window to show.
 */
function showOverlay(windowID) {
    current_flyingwindow_id = windowID;
    stopScrolling();
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
        allowScrolling();
        setTimeout(() => { setStyle('board_overlay', 'z-index', '-1'); }, 200);
        hideEditTaskMode();
        current_taskID = '';
    }
}


function allowScrolling() {
    setStyle(document.body, 'overflow-y', 'auto');
}


function stopScrolling() {
    setStyle(document.body, 'overflow-y', 'hidden');
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
 * Switches to the edit task mode and fill the edit form with the current task propertys.
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
 * Switches the edit task mode off and shows the task big view.
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
    renderAssignedContactsBar('edittask_');
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
    const renderedTasks = renderTasks(event.target.value);
    if (renderedTasks == 0) addClass('tasksearchfield_div', 'searchfield_not_found');
    else removeClass('tasksearchfield_div', 'searchfield_not_found');
}


/**
 * Clears the task search field and render all tasks.
 */
function clickClearTaskSearch() {
    setInputValue('tasksearchfield');
    renderTasks();
    removeClass('tasksearchfield_div', 'searchfield_not_found');
}


/**
 * Shows the task added information by opening a dropdown and closing it after 2 seconds.
 */
function showTaskAddedInfo() {
    openDropDown('taskadded_info');
    setTimeout(() => { closeDropDown(); }, 2000);
}