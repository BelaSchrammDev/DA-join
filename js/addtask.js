/**
 * Action to be performed after adding a task.
 * @type {Function}
 */
let actionAfterAddTask = null;


/**
 * Preset status for the task to be added.
 * @type {string}
 */
let presetStatusByAddTask = 'todo';


/**
 * Initializes the add task site.
 * @async
 */
async function initAddtaskSite() {
    await initJoin();
    renderAddtaskFields();
    actionAfterAddTask = afterAddTaskTemplateSubmit;
}


/**
 * Resets the add task form.
 * 
 * @param {string} prefix - The prefix for the form elements.
 */
function resetAddTaskForm(prefix) {
    setInnerHTML(prefix + 'subtask_list', '');
    setInnerHTML(prefix + 'assignedcontacts_bar', '');
}


/**
 * Renders the fields for adding a task.
 */
function renderAddtaskFields() {
    renderCategorys();
    renderAssignedContacts('addtask_assigned_list', 'addtask_');
    setAttribute('addtask_duedate', 'min', new Date().toISOString().split('T')[0]);
    addDropDownList('addtask_assignet', openAssignedContactsDropDownList, 'addtask_');
    addDropDownList('addtask_category', openTaskCategoryDropDownList, 'addtask_');
}


/**
 * Renders the assigned contacts.
 * 
 * @param {string} listDropDownID - The ID of the dropdown list.
 * @param {string} prefix - The prefix for the form elements.
 */
function renderAssignedContacts(listDropDownID, prefix) {
    let listHTML = '';
    for (let index = 0; index < sessionContacts.length; index++) {
        listHTML += getAssignedContactHTML(sessionContacts[index], prefix);
    }
    setInnerHTML(listDropDownID, listHTML);
}


/**
 * Sets the assigned contacts bar.
 * 
 * @param {string} prefix - The prefix for the form elements.
 */
function setAssignedContactsBar(prefix) {
    let contactsBarHTML = '';
    for (let index = 0; index < sessionContacts.length; index++) {
        const contact = sessionContacts[index];
        const contactsAssignedCheckbox = getElement(prefix + 'task_assigned_' + contact.id);
        if (contactsAssignedCheckbox.checked) {
            contactsBarHTML += `<span style="background-color: ${contact.color}">${contact.initial}</span>`
        }
    }
    setInnerHTML(prefix + 'assignedcontacts_bar', contactsBarHTML);
}


/**
 * Renders the categories.
 */
function renderCategorys() {
    let html = '';
    categoryKeys = Object.keys(taskCategorys);
    for (let index = 0; index < categoryKeys.length; index++) {
        const category = taskCategorys[categoryKeys[index]];
        html += `<div onclick="selectTaskCategory(${categoryKeys[index]})"><span>${category.name}</span></div>`
    }
    setInnerHTML('addtask_category_list', html);
}


/**
 * Opens the task category dropdown list.
 * 
 * @param {string} prefix - The prefix for the form elements.
 * @param {boolean} open - Whether to open the dropdown list.
 */
function openTaskCategoryDropDownList(prefix, open) {
    setAttribute(prefix + 'category_div', 'dropdownopen', open);
}


/**
 * Opens the assigned contacts dropdown list.
 * 
 * @param {string} prefix - The prefix for the form elements.
 * @param {boolean} open - Whether to open the dropdown list.
 */
function openAssignedContactsDropDownList(prefix, open) {
    if (open) {
        showAllAssignedContacts();
        setPlaceHolder(prefix + 'assignedinput', 'Search contact');
        setFocus(prefix + 'assignedinput');
    }
    else {
        setAssignedContactsBar(prefix);
        setPlaceHolder(prefix + 'assignedinput', 'Choose contacts');
        setInputValue(prefix + 'assignedinput', '');
    }
    setAttribute(prefix + 'assigned', 'dropdownopen', open);
}


/**
 * Shows all assigned contacts.
 */
function showAllAssignedContacts() {
    let contactsDivs = document.getElementById('addtask_assigned_list').children;
    for (let index = 0; index < contactsDivs.length; index++) {
        setStyle(contactsDivs[index], 'display', 'flex');
    }
}


/**
 * Changes the assigned contacts search term.
 * 
 * @param {Event} event - The event object.
 * @param {string} prefix - The prefix for the form elements.
 */
function changeAssignedContactsSearchTerm(event, prefix) {
    const searchTerm = document.getElementById(prefix + 'assignedinput').value.toLowerCase();
    let contactsDivs = document.getElementById(prefix + 'assigned_list').children;
    for (let index = 0; index < contactsDivs.length; index++) {
        const contactDiv = contactsDivs[index];
        const nameTerm = contactDiv.children[0].children[1].innerText.toLowerCase();
        if (nameTerm.includes(searchTerm)) contactDiv.style = 'display: flex;'
        else contactDiv.style = 'display: none;';
    }
    event.preventDefault();
}


/**
 * Sets the characters left for a textarea element.
 * 
 * @param {HTMLTextAreaElement} taElement - The textarea element.
 */
function setCharactersLeft(taElement) {
    const spanElement = taElement.nextElementSibling;
    const cLeft = taElement.maxLength - taElement.value.length;
    spanElement.innerHTML = cLeft + ' characters left';
}


/**
 * Handles the enter key press on the subtask input.
 * 
 * @param {KeyboardEvent} event - The event object.
 * @param {string} prefix - The prefix for the form elements.
 */
function enterSubtaskInput(event, prefix) {
    if (event.key == 'Enter') {
        createNewSubTask(prefix);
        setFocus(prefix + 'subtask_input');
        event.stopPropagation();
        event.preventDefault();
    }
}


/**
 * Selects a task category.
 * 
 * @param {number} categoryID - The ID of the category.
 */
function selectTaskCategory(categoryID) {
    setInputValue('addtask_category', taskCategorys[categoryID].name);
    closeDropDown();
}


/**
 * Creates a new subtask.
 * 
 * @param {string} prefix - The prefix for the form elements.
 */
function createNewSubTask(prefix) {
    let newSubTaskName = getInputValue(prefix + 'subtask_input');
    if (newSubTaskName == '') return;
    addInnerHTML(prefix + 'subtask_list', getSubTaskHTML(createUniqueID('ST'), newSubTaskName));
    setInputValue(prefix + 'subtask_input');
}


/**
 * Deletes a subtask.
 * 
 * @param {string} subtaskID - The ID of the subtask.
 */
function deleteSubTask(subtaskID) {
    getElement('subtaskdiv' + subtaskID).remove();
}


/**
 * Changes a subtask.
 * 
 * @param {string} subtaskID - The ID of the subtask.
 */
function changeSubTask(subtaskID) {
    const inputSubTask = getElement('subtask' + subtaskID);
    const spanSubTask = getElement('subtaskspan' + subtaskID);
    if (inputSubTask.value != '') spanSubTask.innerHTML = inputSubTask.value;
    else inputSubTask.value = spanSubTask.innerHTML;
    setSubTaskEditMode(subtaskID, false);
}


/**
 * Sets the edit mode for a subtask.
 * 
 * @param {string} subtaskID - The ID of the subtask.
 * @param {boolean} mode - Whether to set the edit mode.
 */
function setSubTaskEditMode(subtaskID, mode) {
    setAttribute('subtaskdiv' + subtaskID, 'editmode', mode);
    setAttribute('subtask' + subtaskID, 'tabindex', '0');
    window.requestAnimationFrame(() => setFocus('subtask' + subtaskID));
}


/**
 * Submits the add task form.
 */
function submitAddTaskForm() {
    const searchForm = document.getElementById('addtask_form');
    let formData = new FormData(searchForm);
    let newTask = new Object();
    newTask.id = createUniqueID('T');
    newTask.status = presetStatusByAddTask;
    fillTaskObjectFromFormData(newTask, Object.fromEntries(formData));
    sessionTasks.push(newTask);
    searchForm.reset();
    if (actionAfterAddTask) actionAfterAddTask();
}


/**
 * Performs actions after the add task template is submitted.
 * 
 * @async
 */
async function afterAddTaskTemplateSubmit() {
    await storeSessionTasksToRemoteStorage();
    await sessionStorage.setItem('taskadded', 'true');
    window.location.href = './board.html';
}


/**
 * Fills a task object from form data.
 * 
 * @param {Object} task - The task object.
 * @param {Object} formData - The form data.
 */
function fillTaskObjectFromFormData(task, formData) {
    if (formData.task_category) task.category = getCategoryID(formData.task_category);
    task.title = formData.task_title;
    task.description = formData.task_description;
    task.date = formData.task_date;
    task.priority = formData.task_priority;
    task.assignedto = addPropertysToArray('task_assigned_', formData, (key) => { return key; });
    task.subtasks = addPropertysToArray('task_subtask', formData,
        (key, property) => {
            let _done = false;
            if (task.subtasks) {
                const oldSubtask = task.subtasks.find(st => st.id == key);
                if (oldSubtask) _done = oldSubtask.done;
            }
            return { id: key, name: property, done: _done }
        });
}


/**
 * Gets the ID of a category.
 * 
 * @param {string} category - The category name.
 * @returns {number} The category ID.
 */
function getCategoryID(category) {
    if (category == 'User Story') return 1;
    else if (category == 'Technical Task') return 2;
    return 0;
}


/**
 * Adds properties to an array from form data.
 * 
 * @param {string} searchString - The search string to filter the form data keys.
 * @param {Object} formData - The form data.
 * @param {Function} pushFunction - The function to push the properties to the array.
 * @returns {Array} The new array.
 */
function addPropertysToArray(searchString, formData, pushFunction) {
    let newArray = [];
    const relevantStrings = Object.keys(formData).filter((key) => key.startsWith(searchString));
    for (let index = 0; index < relevantStrings.length; index++) {
        const inputProperty = formData[relevantStrings[index]];
        const keyID = relevantStrings[index].substring(searchString.length);
        newArray.push(pushFunction(keyID, inputProperty));
    }
    return newArray;
}