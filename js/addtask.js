
let actionAfterAddTask = null;

let presetStatusByAddTask = 'todo';


async function initAddtaskSite() {
    await initJoin();
    renderAddtaskFields();
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


function getSubTaskHTML(subtaskID, subtaskname) {
    return `
    <div id="subtaskdiv${subtaskID}" editmode="false" class="subtask_row">
    <input onkeydown="if(event.key == 'Enter') changeSubTask('${subtaskID}')" name="task_subtask${subtaskID}" id="subtask${subtaskID}" type="text" value="${subtaskname}">
    <div lipoint class="subtask_point"></div>
    <span ondblclick="setSubTaskEditMode('${subtaskID}','true')" id="subtaskspan${subtaskID}">${subtaskname}</span>
    <div showaction>
        <img onclick="setSubTaskEditMode('${subtaskID}','true')" src="../img/icons/add-task/edit.svg" alt="">
        <div line></div>
        <img onclick="deleteSubTask('${subtaskID}')" src="../img/icons/add-task/delete.svg" alt="">
    </div>
    <div editaction>
        <img onclick="deleteSubTask('${subtaskID}')" src="../img/icons/add-task/delete.svg" alt="">
        <div line></div>
        <img onmousedown="changeSubTask('${subtaskID}')" src="../img/icons/add-task/ok.svg" alt="">
    </div>
    </div>
    `
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


function openTaskCategoryDropDownList(prefix) {
    setAttribute(prefix + 'category_div', 'dropdownopen', 'true');
}


function closeTaskCategoryDropDownList(prefix) {
    setAttribute(prefix + 'category_div', 'dropdownopen', 'false');
}


function openAssignedContactsDropDownList(prefix) {
    showAllAssignedContacts();
    setAttribute(prefix + 'assigned', 'dropdownopen', true);
    setPlaceHolder(prefix + 'assignedinput', 'Search contact');
    setFocus(prefix + 'assignedinput');
}


function closeAssignedContactsDropDownList(prefix) {
    setAssignedContactsBar(prefix);
    setAttribute(prefix + 'assigned', 'dropdownopen', false);
    setPlaceHolder(prefix + 'assignedinput', 'Select contacts to assign');
    setInputValue(prefix + 'assignedinput', '');
}


function showAllAssignedContacts() {
    let contactsDivs = document.getElementById('addtask_assigned_list').children;
    for (let index = 0; index < contactsDivs.length; index++) {
        contactsDivs[index].style = 'display: flex;'
    }
}


function changeAssignedContactsSearchTerm(prefix) {
    const searchTerm = document.getElementById(prefix + 'assignedinput').value.toLowerCase();
    let contactsDivs = document.getElementById(prefix + 'assigned_list').children;
    for (let index = 0; index < contactsDivs.length; index++) {
        const contactDiv = contactsDivs[index];
        const nameTerm = contactDiv.children[0].children[1].innerText.toLowerCase();
        if (nameTerm.includes(searchTerm)) contactDiv.style = 'display: flex;'
        else contactDiv.style = 'display: none;';
    }
}


function enterSubtaskInput(event, prefix) {
    if (event.key == 'Enter') {
        createNewSubTask(prefix);
        setFocus(prefix + 'subtask_input');
    }
}


function selectTaskCategory(categoryID) {
    setInputValue('addtask_category', taskCategorys[categoryID].name);
    DropDownList.closeAll();
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
    let newSubTaskName = getInputValue('subtask' + subtaskID);
    setInnerHTML('subtaskspan' + subtaskID, newSubTaskName);
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


function fillTaskObjectFromFormData(task, formData) {
    if (formData.task_category) task.category = getCategoryID(formData.task_category);
    task.title = formData.task_title;
    task.description = formData.task_description;
    task.date = formData.task_date;
    task.priority = formData.task_priority;
    task.assignedto = addPropertysToArray('task_assigned_', formData, (key) => { return key; });
    task.subtasks = addPropertysToArray('task_subtask', formData, (key, property) => { return { name: property, done: false } });
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
