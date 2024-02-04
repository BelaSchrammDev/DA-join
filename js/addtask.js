let openAssignedContactsList = false;


function addTaskClickAssignedContacts(contactsID) {
    let div = document.getElementById('assignedContacts_' + contactsID);
    if (div.getAttribute('checked') == "true") div.setAttribute('checked', 'false');
    else div.setAttribute('checked', 'true');
}


function openAssignedContactsDropDownList() {
    if (openAssignedContactsList == true) return;
    openAssignedContactsList = true;
    document.getElementById('inputAssignContacts').placeholder = 'Search contact';
    showAllAssignedContacts();
    const list = document.getElementById('edit_assigned_list');
    document.getElementById('edit_assigned').style = 'border: 1px solid #29abe2;'
    document.getElementById('edit_assigned').children[1].style = 'transform: rotate(180deg);'
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
    document.getElementById('edit_assigned').children[1].style = '';
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
    const excludedIDs = ['edit_assigned_list', 'edit_assigned', 'inputAssignContacts', 'atncddm']
    if (event.target.id.startsWith('assignedContacts_')) return;
    for (let index = 0; index < excludedIDs.length; index++) {
        const elementID = excludedIDs[index];
        if (event.target.id == elementID) return;
    }
    console.log('dropdown closed by ' + event.target.id);
    closeAssignedContactsDropDownList();
}


function clickAssignedContactsDropDownList(event) {
    event.stopPropagation();
    const list = document.getElementById('edit_assigned_list');
    if (list.clientHeight == 0) openAssignedContactsDropDownList();
    else closeAssignedContactsDropDownList();
}