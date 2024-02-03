let openAssignedContactsList = false;

function addTaskClickAssignedContacts(contactsID) {
    let div = document.getElementById('assignedContacts_' + contactsID);
    if (div.checked) {
        div.checked = false;
        div.classList.remove('assigned_contact');
        div.classList.add('unassigned_contact');
        div.children[2].src = './img/icons/add-task/cf-unchecked-black.svg';
    } else {
        div.checked = true;
        div.classList.remove('unassigned_contact');
        div.classList.add('assigned_contact');
        div.children[2].src = './img/icons/add-task/cf-checked-white.svg';
    }
}


function focusAssignContacts() {
    document.getElementById('inputAssignContacts').placeholder = '';
    openAssignedContactsDropDownList();
}


function openAssignedContactsDropDownList() {
    if (openAssignedContactsList == true) return;
    openAssignedContactsList = true;
    showAllAssignedContacts();
    const list = document.getElementById('edit_assigned_list');
    document.getElementById('edit_assigned').style = 'border: 1px solid #29abe2;'
    list.style['max-height'] = '200px';
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
    document.getElementById('edit_assigned').style = ''
    list.style.overflow = 'hidden';
    list.style['max-height'] = '0';
    const input = document.getElementById('inputAssignContacts');
    input.placeholder = 'Select contacts to assign';
    input.value = '';
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
    if (event.target.id == 'addtaskTemplate') closeAssignedContactsDropDownList();
}

function clickAssignedContactsDropDownList() {
    const list = document.getElementById('edit_assigned_list');
    if (list.clientHeight == 0) openAssignedContactsDropDownList();
    else closeAssignedContactsDropDownList();
}