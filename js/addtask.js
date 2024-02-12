let dropDownObjects = {
    'addtask_assignet': {
        openDropDown() {
            openAssignedContactsDropDownList(this.fromprefix);
            this.stateDropDown = 'open';
        },
        closeDropDown() {
            closeAssignedContactsDropDownList(this.fromprefix);
            this.stateDropDown = 'close'
        },
        toggleDropDown() {
            if (this.stateDropDown == 'open') this.closeDropDown();
            else this.openDropDown();
        },
        stateDropDown: 'close',
        fromprefix: 'addtask_'
    },
    'addtask_category': {
        openDropDown() {
            openTaskCategoryDropDownList(this.fromprefix);
            this.stateDropDown = 'open';
        },
        closeDropDown() {
            closeTaskCategoryDropDownList(this.fromprefix);
            this.stateDropDown = 'close'
        },
        toggleDropDown() {
            if (this.stateDropDown == 'open') this.closeDropDown();
            else this.openDropDown();
        },
        stateDropDown: 'close',
        fromprefix: 'addtask_'
    }
}


async function initAddtaskSite() {
    await initJoin();
    renderAddtaskFields();
}


function resetAddTaskForm() {
    document.getElementById('subtask_list').innerHTML = '';
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
    document.getElementById('addtask_assigned_list').innerHTML = listHTML;
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


function renderSubTasks() {
    let subtasksHTML = '';
    subtasksHTML += getSubTaskHTML(1, 'Erster task');
    subtasksHTML += getSubTaskHTML(2, 'Zweiter task');
    subtasksHTML += getSubTaskHTML(3, 'Dritter task');
    document.getElementById('subtask_list').innerHTML = subtasksHTML;
}


function getSubTaskHTML(subtaskID, subtaskname) {
    return `
    <div id="subtaskdiv${subtaskID}" editmode="false" class="subtask_row">
    <input name="task_subtask${subtaskID}" id="subtask${subtaskID}" type="text" value="${subtaskname}">
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
    const taskCategoryDiv = document.getElementById('addtask_category_list');
    let html = '';
    categoryKeys = Object.keys(taskCategorys);
    for (let index = 0; index < categoryKeys.length; index++) {
        const category = taskCategorys[categoryKeys[index]];
        html += `<div onclick="selectTaskCategory(${categoryKeys[index]})"><span>${category.name}</span></div>`
    }
    taskCategoryDiv.innerHTML = html;
}


function addCloseDropDownListBehavior() {
    setAttribute(document.body, 'onclick', 'clickAddTaskTemplate(event)');
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
    addCloseDropDownListBehavior();
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
    addCloseDropDownListBehavior();
}


function closeAssignedContactsDropDownList(prefix) {
    setAttribute(prefix + 'assigned', 'dropdownopen', false);
    setAttribute(prefix + 'assigned_arrow', 'open', false);
    setPlaceHolder(prefix + 'assignedinput', 'Select contacts to assign');
    setInputValue(prefix + 'assignedinput', '');
}


function setCheckedStateForAllContacts() {
    let contactsDivs = document.getElementById('addtask_assigned_list').children;
    for (let index = 0; index < contactsDivs.length; index++) {

    }
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
    document.getElementById('addtask_category').value = taskCategorys[categoryID].name;
    closeTaskCategoryDropDownList();
}


function createNewSubTask() {
    let newSubTaskName = document.getElementById('addtask_subtask_input').value;
    if (newSubTaskName == '') return;
    let newSubTaskHTML = getSubTaskHTML(createUniqueID('ST'), newSubTaskName);
    document.getElementById('subtask_list').innerHTML += newSubTaskHTML;
    setInputValue('addtask_subtask_input');
}


function deleteSubTask(subtaskID) {
    let subtaskdiv = document.getElementById('subtaskdiv' + subtaskID);
    subtaskdiv.remove();
}


function changeSubTask(subtaskID) {
    let newSubTaskName = document.getElementById('subtask' + subtaskID).value;
    document.getElementById('subtaskspan' + subtaskID).innerHTML = newSubTaskName;
    setSubTaskEditMode(subtaskID, false);
}


function setSubTaskEditMode(subtaskID, mode) {
    document.getElementById('subtaskdiv' + subtaskID).setAttribute('editmode', mode);
    const inputelement = document.getElementById('subtask' + subtaskID);
    inputelement.setAttribute('tabindex', '0');
    window.requestAnimationFrame(() => inputelement.focus());
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
