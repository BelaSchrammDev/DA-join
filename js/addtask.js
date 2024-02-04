let openAssignedContactsList = false;
let openTaskCategoryList = false;


const taskCategorys = [
    { id: 1, name: 'User Story' },
    { id: 2, name: 'Techical Task' }
]


async function initAddtaskSite() {
    await includeHTML();
    renderAddtaskFields();
}


function renderAddtaskFields() {
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
    document.getElementById('edit_category').style = 'border: 1px solid #29abe2;'
    document.getElementById('edit_category').children[1].setAttribute('open', true);
    list.style['max-height'] = '200px';
    setTimeout(() => {
        list.style.overflow = 'auto';
        document.getElementById('addtaskTemplate').setAttribute("onclick", "clickAddTaskTemplate(event)");
    }, 200);
}


function closeTaskCategoryDropDownList() {
    if (openTaskCategoryList == false) return;
    openTaskCategoryList = false;
    const list = document.getElementById('edit_category_list');
    document.getElementById('edit_category').style = '';
    document.getElementById('edit_category').children[1].setAttribute('open', false);
    list.style.overflow = 'hidden';
    list.style['max-height'] = '0';
}


function toggleAssignedContactsCheckState(contactsID) {
    const contactsCheckBox = document.getElementById('contactsCheckbox_' + contactsID);
    const state = contactsCheckBox.checked;
    contactsCheckBox.checked = !state;
    document.getElementById('assignedContacts_' + contactsID).setAttribute('checked', !state);
}


function openAssignedContactsDropDownList() {
    closeTaskCategoryDropDownList();
    if (openAssignedContactsList == true) return;
    openAssignedContactsList = true;
    document.getElementById('inputAssignContacts').placeholder = 'Search contact';
    showAllAssignedContacts();
    const list = document.getElementById('edit_assigned_list');
    document.getElementById('edit_assigned').style = 'border: 1px solid #29abe2;'
    document.getElementById('edit_assigned').children[1].setAttribute('open', true);
    list.style['max-height'] = '200px';
    document.getElementById('inputAssignContacts').focus();
    setTimeout(() => {
        list.style.overflow = 'auto';
        document.getElementById('addtaskTemplate').setAttribute("onclick", "clickAddTaskTemplate(event)");
    }, 200);
}


function closeAssignedContactsDropDownList() {
    if (openAssignedContactsList == false) return;
    openAssignedContactsList = false;
    document.getElementById('addtaskTemplate').removeAttribute("onclick");
    const list = document.getElementById('edit_assigned_list');
    document.getElementById('edit_assigned').style = '';
    document.getElementById('edit_assigned').children[1].setAttribute('open', false);
    list.style.overflow = 'hidden';
    list.style['max-height'] = '0';
    const input = document.getElementById('inputAssignContacts');
    input.placeholder = 'Select contacts to assign';
    input.value = '';
}


function closeAllDropDowns() {
    closeAssignedContactsDropDownList();
    closeTaskCategoryDropDownList();
    document.getElementById('addtaskTemplate').removeAttribute("onclick");
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
    // closeAssignedContactsDropDownList();
}


function clickAssignedContactsDropDownList(event) {
    event.stopPropagation();
    const list = document.getElementById('edit_assigned_list');
    if (list.clientHeight == 0) openAssignedContactsDropDownList();
    else closeAssignedContactsDropDownList();
}

function clickTaskPriorityDropDownList(event) {
    event.stopPropagation();
    const list = document.getElementById('edit_category_list');
    if (list.clientHeight == 0) openTaskCategoryDropDownList();
    else closeTaskCategoryDropDownList();
}


function selectTaskCategory(categoryID) {
    document.getElementById('taskcategory_name').innerHTML = taskCategorys[categoryID].name;
    closeTaskCategoryDropDownList();
}