let actionAfterAddTask = null;
let presetStatusByAddTask = 'todo';


async function initAddtaskSite() {
    await initJoin();
    initDropDowns();
    renderAddtaskFields();
    actionAfterAddTask = afterAddTaskTemplateSubmit;
}


function resetAddTaskForm(prefix) {
    setInnerHTML(prefix + 'subtask_list', '');
    setInnerHTML(prefix + 'assignedcontacts_bar', '');
}


function renderAddtaskFields() {
    renderCategorys();
    renderAssignedContacts('addtask_assigned_list', 'addtask_');
    setAttribute('addtask_duedate', 'min', new Date().toISOString().split('T')[0]);
}


function renderAssignedContacts(listDropDownID, prefix) {
    let listHTML = '';
    for (let index = 0; index < sessionContacts.length; index++) {
        listHTML += getAssignedContactHTML(sessionContacts[index], prefix);
    }
    setInnerHTML(listDropDownID, listHTML);
}


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


function renderCategorys() {
    let html = '';
    categoryKeys = Object.keys(taskCategorys);
    for (let index = 0; index < categoryKeys.length; index++) {
        const category = taskCategorys[categoryKeys[index]];
        html += `<div onclick="selectTaskCategory(${categoryKeys[index]})"><span>${category.name}</span></div>`
    }
    setInnerHTML('addtask_category_list', html);
}


function openTaskCategoryDropDownList(prefix, open) {
    setAttribute(prefix + 'category_div', 'dropdownopen', open);
}


function openAssignedContactsDropDownList(prefix, open) {
    if (open) {
        showAllAssignedContacts();
        setPlaceHolder(prefix + 'assignedinput', 'Search contact');
        setFocus(prefix + 'assignedinput');
    }
    else {
        setAssignedContactsBar(prefix);
        setPlaceHolder(prefix + 'assignedinput', 'Select contacts to assign');
        setInputValue(prefix + 'assignedinput', '');
    }
    setAttribute(prefix + 'assigned', 'dropdownopen', open);
}


function showAllAssignedContacts() {
    let contactsDivs = document.getElementById('addtask_assigned_list').children;
    for (let index = 0; index < contactsDivs.length; index++) {
        setStyle(contactsDivs[index], 'display', 'flex');
    }
}


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


function enterSubtaskInput(event, prefix) {
    if (event.key == 'Enter') {
        createNewSubTask(prefix);
        setFocus(prefix + 'subtask_input');
        event.stopPropagation();
        event.preventDefault();
    }
}


function selectTaskCategory(categoryID) {
    setInputValue('addtask_category', taskCategorys[categoryID].name);
    closeDropDown();
}


function createNewSubTask(prefix) {
    let newSubTaskName = getInputValue(prefix + 'subtask_input');
    if (newSubTaskName == '') return;
    addInnerHTML(prefix + 'subtask_list', getSubTaskHTML(createUniqueID('ST'), newSubTaskName));
    setInputValue(prefix + 'subtask_input');
}


function deleteSubTask(subtaskID) {
    getElement('subtaskdiv' + subtaskID).remove();
}


function changeSubTask(subtaskID) {
    const inputSubTask = getElement('subtask' + subtaskID);
    const spanSubTask = getElement('subtaskspan' + subtaskID);
    if (inputSubTask.value != '') spanSubTask.innerHTML = inputSubTask.value;
    else inputSubTask.value = spanSubTask.innerHTML;
    setSubTaskEditMode(subtaskID, false);
}


function setSubTaskEditMode(subtaskID, mode) {
    setAttribute('subtaskdiv' + subtaskID, 'editmode', mode);
    setAttribute('subtask' + subtaskID, 'tabindex', '0');
    window.requestAnimationFrame(() => setFocus('subtask' + subtaskID));
}


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


async function afterAddTaskTemplateSubmit() {
    await storeSessionTasksToRemoteStorage();
    window.location.href = './board.html';
}


function fillTaskObjectFromFormData(task, formData) {
    if (formData.task_category) task.category = getCategoryID(formData.task_category);
    task.title = formData.task_title;
    task.description = formData.task_description;
    task.date = formData.task_date;
    task.priority = formData.task_priority;
    task.assignedto = addPropertysToArray('task_assigned_', formData,
        (key) => {
            return key;
        });
    task.subtasks = addPropertysToArray('task_subtask', formData,
        (key, property) => {
            let _done = false;
            if (task.subtasks) {
                const oldSubtask = task.subtasks.find(st => st.name == property);
                if (oldSubtask) _done = oldSubtask.done;
            }
            return {
                name: property,
                done: _done
            }
        });
}


function getCategoryID(category) {
    if (category == 'User Story') return 1;
    else if (category == 'Technical Task') return 2;
    return 0;
}


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
