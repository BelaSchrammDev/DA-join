let openAssignedContactsList = false;
let openTaskCategoryList = false;


async function initAddtaskSite() {
    await initJoin();
    renderAddtaskFields();
}


function renderAddtaskFields() {
    renderCategorys();
    renderSubTasks();
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
    <input name="subtask${subtaskID}" id="subtask${subtaskID}" type="text" value="${subtaskname}">
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
    const taskCategoryDiv = document.getElementById('edit_category_list');
    let html = '';
    for (let index = 0; index < taskCategorys.length; index++) {
        const category = taskCategorys[index];
        html += `<div onclick="selectTaskCategory(${index})"><span>${category.name}</span></div>`
    }
    taskCategoryDiv.innerHTML = html;
}


function openTaskCategoryDropDownList() {
    closeAssignedContactsDropDownList();
    if (openTaskCategoryList == true) return;
    openTaskCategoryList = true;
    const list = document.getElementById('edit_category_list');
    document.getElementById('edit_category_div').setAttribute('dropdownopen', 'true');
    document.getElementById('edit_category').style = 'border: 1px solid #29abe2;'
    list.style['max-height'] = '300px';
    setTimeout(() => {
        list.style.overflow = 'auto';
        document.body.setAttribute("onclick", "clickAddTaskTemplate(event)");
    }, 200);
}


function closeTaskCategoryDropDownList() {
    if (openTaskCategoryList == false) return;
    openTaskCategoryList = false;
    const list = document.getElementById('edit_category_list');
    document.getElementById('edit_category').style = '';
    document.getElementById('edit_category_div').setAttribute('dropdownopen', 'false');
    list.style.overflow = 'hidden';
    list.style['max-height'] = '0';
}


function toggleAssignedContactsCheckState(contactsID) {
    const contactsCheckBox = document.getElementById('contactsCheckbox_' + contactsID);
    contactsCheckBox.checked = !contactsCheckBox.checked;
}


function openAssignedContactsDropDownList() {
    closeTaskCategoryDropDownList();
    if (openAssignedContactsList == true) return;
    openAssignedContactsList = true;
    document.getElementById('edit_assigned').setAttribute('dropdownopen', true);
    document.getElementById('inputAssignContacts').placeholder = 'Search contact';
    showAllAssignedContacts();
    document.getElementById('edit_assigned').children[1].setAttribute('open', true);
    document.getElementById('inputAssignContacts').focus();
    document.body.setAttribute("onclick", "clickAddTaskTemplate(event)");
}


function closeAssignedContactsDropDownList() {
    if (openAssignedContactsList == false) return;
    openAssignedContactsList = false;
    document.getElementById('edit_assigned').setAttribute('dropdownopen', false);
    document.getElementById('edit_assigned').children[1].setAttribute('open', false);
    const input = document.getElementById('inputAssignContacts');
    input.placeholder = 'Select contacts to assign';
    input.value = '';
}


function setCheckedStateForAllContacts() {
    let contactsDivs = document.getElementById('edit_assigned_list').children;
    for (let index = 0; index < contactsDivs.length; index++) {

    }
}


function closeAllDropDowns() {
    closeAssignedContactsDropDownList();
    closeTaskCategoryDropDownList();
    document.body.removeAttribute("onclick");
}


function showAllAssignedContacts() {
    let contactsDivs = document.getElementById('edit_assigned_list').children;
    for (let index = 0; index < contactsDivs.length; index++) {
        contactsDivs[index].style = 'display: flex;'
    }
}


function changeAssignedContactsSearchTerm() {
    const searchTerm = document.getElementById('inputAssignContacts').value;
    let contactsDivs = document.getElementById('edit_assigned_list').children;
    for (let index = 0; index < contactsDivs.length; index++) {
        const contactDiv = contactsDivs[index];
        const nameTerm = contactDiv.children[1].innerText.toLowerCase();
        if (nameTerm.includes(searchTerm)) contactDiv.style = 'display: flex;'
        else contactDiv.style = 'display: none;';
    }
}


function clickAddTaskTemplate(event) {
    const excludedIDs = ['edit_assigned_list', 'edit_assigned', 'inputAssignContacts', 'atncddm',]
    if (event.target.id.startsWith('assignedContacts_')) return;
    for (let index = 0; index < excludedIDs.length; index++) {
        const elementID = excludedIDs[index];
        if (event.target.id == elementID) return;
    }
    event.stopPropagation();
    closeAllDropDowns()
}


function clickAssignedContactsDropDownList(event) {
    event.stopPropagation();
    const list = document.getElementById('edit_assigned_list');
    if (list.clientHeight == 0) openAssignedContactsDropDownList();
    else closeAssignedContactsDropDownList();
}

function clickTaskCategoryDropDownList(event) {
    event.stopPropagation();
    const list = document.getElementById('edit_category_list');
    if (list.clientHeight == 0) openTaskCategoryDropDownList();
    else closeTaskCategoryDropDownList();
}


function selectTaskCategory(categoryID) {
    document.getElementById('edit_category').value = taskCategorys[categoryID].name;
    closeTaskCategoryDropDownList();
}


function createNewSubTask() {
    let newSubTaskName = document.getElementById('edit_subtask_input').value;
    if (newSubTaskName == '') return;
    let newSubTaskHTML = getSubTaskHTML(createUniqueID('ST'), newSubTaskName);
    document.getElementById('subtask_list').innerHTML += newSubTaskHTML;
    setInputValue('edit_subtask_input');
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