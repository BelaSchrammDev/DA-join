class DropDownList {
    constructor(openFunc, closeFunc, formPrefix) {
        this.openFunction = openFunc;
        this.closeFunction = closeFunc;
        this.formprefix = formPrefix;
        this.stateDropDown = 'close';
    }
    openDropDown() {
        this.openFunction(this.formprefix);
        setAttribute(document.body, 'onclick', 'clickAddTaskTemplate(event)');
        this.stateDropDown = 'open';
    }
    closeDropDown() {
        this.closeFunction(this.formprefix);
        this.stateDropDown = 'close';
    }
    toggleDropDown() {
        if (this.stateDropDown == 'open') this.closeDropDown();
        else this.openDropDown();
    }
}


let dropDownObjects = {
    'addtask_assignet': new DropDownList(openAssignedContactsDropDownList, closeAssignedContactsDropDownList, 'addtask_'),
    'addtask_category': new DropDownList(openTaskCategoryDropDownList, closeTaskCategoryDropDownList, 'addtask_'),
}


async function initAddtaskSite() {
    await initJoin();
    renderAddtaskFields();
}


function resetAddTaskForm() {
    setInnerHTML('subtask_list', '');
    setInnerHTML('assignedcontacts_bar', '');
}


function renderAddtaskFields() {
    renderCategorys();
    renderAssignedContacts();
}


function renderAssignedContacts() {
    let listHTML = '';
    for (let index = 0; index < sessionContacts.length; index++) {
        listHTML += getAssignedContactHTML(sessionContacts[index]);
    }
    setInnerHTML('addtask_assigned_list', listHTML);
}


function getAssignedContactHTML(contact) {
    return `
    <div nolistclose id="assignedContacts_${contact.id}" checked="true">
        <label nolistclose for="task_assigned_${contact.id}">
            <span nolistclose style="background-color: ${contact.color};">${contact.initial}</span>
            <span nolistclose>${contact.name}</span>
            <img nolistclose src="../img/icons/add-task/cf-unchecked-black.svg" alt="">
        </label>
        <input nolistclose id="task_assigned_${contact.id}" name="task_assigned_${contact.id}" type="checkbox" id="contactsCheckbox_${contact.id}">
    </div>
`;
}


function setAssignedContactsBar() {
    let contactsBarHTML = '';
    for (let index = 0; index < sessionContacts.length; index++) {
        const contact = sessionContacts[index];
        const contactsAssignedCheckbox = getElement('task_assigned_' + contact.id);
        if (contactsAssignedCheckbox.checked) {
            contactsBarHTML += `<span style="background-color: ${contact.color}">${contact.initial}</span>`
        }
    }
    setInnerHTML('assignedcontacts_bar', contactsBarHTML);
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


function clickAddTaskTemplate(event) {
    if (event.target.getAttribute('nolistclose') != null) return false;
    event.stopPropagation();
    closeAllDropDowns();
    document.body.removeAttribute("onclick");
}


function openTaskCategoryDropDownList(prefix) {
    setAttribute(prefix + 'category_div', 'dropdownopen', 'true');
    setStyle(prefix + 'category', 'border', '1px solid #29abe2');
    setStyle(prefix + 'category_list', 'max-height', '300px');
}


function closeTaskCategoryDropDownList(prefix) {
    setStyle(prefix + 'category', 'border', '');
    setAttribute(prefix + 'category_div', 'dropdownopen', 'false');
    setStyle(prefix + 'category_list', 'overflow', 'hidden');
    setStyle(prefix + 'category_list', 'max-height', '0');
}


function openAssignedContactsDropDownList(prefix) {
    setAttribute(prefix + 'assigned', 'dropdownopen', true);
    setPlaceHolder(prefix + 'assignedinput', 'Search contact');
    showAllAssignedContacts();
    setAttribute(prefix + 'assigned_arrow', 'open', true);
    setFocus(prefix + 'assignedinput');
}


function closeAssignedContactsDropDownList(prefix) {
    setAttribute(prefix + 'assigned', 'dropdownopen', false);
    setAttribute(prefix + 'assigned_arrow', 'open', false);
    setPlaceHolder(prefix + 'assignedinput', 'Select contacts to assign');
    setInputValue(prefix + 'assignedinput', '');
    setAssignedContactsBar();
}


function showAllAssignedContacts() {
    let contactsDivs = document.getElementById('addtask_assigned_list').children;
    for (let index = 0; index < contactsDivs.length; index++) {
        contactsDivs[index].style = 'display: flex;'
    }
}


function changeAssignedContactsSearchTerm() {
    const searchTerm = document.getElementById('addtask_assignedinput').value;
    let contactsDivs = document.getElementById('addtask_assigned_list').children;
    for (let index = 0; index < contactsDivs.length; index++) {
        const contactDiv = contactsDivs[index];
        const nameTerm = contactDiv.children[0].children[1].innerText.toLowerCase();
        if (nameTerm.includes(searchTerm)) contactDiv.style = 'display: flex;'
        else contactDiv.style = 'display: none;';
    }
}


function clickDropDownList(event, listID) {
    closeAllDropDowns(listID);
    if (dropDownObjects[listID]) {
        event.stopPropagation();
        dropDownObjects[listID].toggleDropDown();
    }
}


function enterSubtaskInput(event) {
    if (event.key == 'Enter') {
        createNewSubTask();
        setFocus('addtask_subtask_input');
    }
}


function openDropDownList(listID) {
    closeAllDropDowns();
    if (dropDownObjects[listID]) {
        dropDownObjects[listID].openDropDown();
    }
}


function closeDropDownList(listID) {
    if (dropDownObjects[listID]) {
        dropDownObjects[listID].closeDropDown();
    }
}


function closeAllDropDowns(exclusionID = '') {
    const listIDs = Object.keys(dropDownObjects);
    for (let index = 0; index < listIDs.length; index++) {
        const listID = listIDs[index];
        if (listID != exclusionID) dropDownObjects[listIDs[index]].closeDropDown();
    }
}


function selectTaskCategory(categoryID) {
    setInputValue('addtask_category', taskCategorys[categoryID].name);
    closeAllDropDowns();
}


function createNewSubTask() {
    let newSubTaskName = getInputValue('addtask_subtask_input');
    if (newSubTaskName == '') return;
    let newSubTaskHTML = getSubTaskHTML(createUniqueID('ST'), newSubTaskName);
    addInnerHTML('subtask_list', newSubTaskHTML);
    setInputValue('addtask_subtask_input');
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
    sessionTasks.push(createTaskObjectFromForm(Object.fromEntries(formData)));
    searchForm.reset();
}


function createTaskObjectFromForm(formData) {
    let newTask = new Object();
    newTask.id = createUniqueID('T');
    newTask.status = 'todo';
    newTask.title = formData.task_title;
    newTask.description = formData.task_description;
    newTask.date = formData.task_date;
    newTask.priority = formData.task_priority;
    newTask.assignedto = addPropertysToArray('task_assigned_', formData, (key) => { return key; })
    newTask.subtasks = addPropertysToArray('task_subtask', formData, (key, property) => { return { name: property, done: false } });
    return newTask;
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
