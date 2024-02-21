let currentOpenDropDown = null;
let dropdownList = [];
const clickFunction = function (event) { clickWhenDropDownOpen(event); };
const closeEventElements = ['body', 'addtask_template', 'task_big_edit', 'addtask_overlay', 'task_big'];


function initDropDowns() {
    addDropDownList('addtask_assignet', openAssignedContactsDropDownList, 'addtask_');
    addDropDownList('edittask_assignet', openAssignedContactsDropDownList, 'edittask_');
    addDropDownList('addtask_category', openTaskCategoryDropDownList, 'addtask_');
}


function addDropDownList(listID, openFunc, formID) {
    let newDropDown = { id: listID, openFunction: openFunc, formid: formID, open: false };
    dropdownList.push(newDropDown);
}


function setCloseEventElements() {
    for (let index = 0; index < closeEventElements.length; index++) {
        const elementID = closeEventElements[index];
        const element = (elementID == 'body' ? document.body : document.getElementById(elementID))
        if (element) element.addEventListener('click', clickFunction);
    }
}


function unsetCloseEventElements() {
    for (let index = 0; index < closeEventElements.length; index++) {
        const elementID = closeEventElements[index];
        const element = (elementID == 'body' ? document.body : document.getElementById(elementID))
        if (element) element.removeEventListener('click', clickFunction);
    }
}


function clickWhenDropDownOpen(event) {
    event.stopPropagation();
    if (event.target.getAttribute('nolistclose') != null) return false;
    closeDropDown();
}


function clickDropDown(event, listID) {
    event.stopPropagation();
    let dropDown = dropdownList.find(d => d.id == listID);
    if (dropDown == currentOpenDropDown) closeDropDown();
    else {
        closeDropDown();
        openDropDown(listID);
    }
}


function openDropDown(listID) {
    if (currentOpenDropDown != null) {
        currentOpenDropDown.openFunction(currentOpenDropDown.formid, false);
        currentOpenDropDown.open = false;
    }
    else setCloseEventElements();
    currentOpenDropDown = dropdownList.find(d => d.id == listID);
    currentOpenDropDown.openFunction(currentOpenDropDown.formid, true);
    currentOpenDropDown.open = true;
}


function closeDropDown() {
    if (currentOpenDropDown == null) return;
    currentOpenDropDown.openFunction(currentOpenDropDown.formid, false);
    currentOpenDropDown.open = false;
    currentOpenDropDown = null;
    unsetCloseEventElements();
}


