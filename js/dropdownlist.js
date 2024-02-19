class DropDownList {

    static closeEventElements = ['body', 'addtask_template', 'task_big_edit', 'addtask_overlay', 'task_big'];


    static setCloseEventElements() {
        if (DropDownList.isOneOpen()) return;
        for (let index = 0; index < DropDownList.closeEventElements.length; index++) {
            const elementID = DropDownList.closeEventElements[index];
            const element = (elementID == 'body' ? document.body : document.getElementById(elementID))
            if (element) element.addEventListener('click', clickFunction);
        }
    }


    static unsetCloseEventElements() {
        for (let index = 0; index < DropDownList.closeEventElements.length; index++) {
            const elementID = DropDownList.closeEventElements[index];
            const element = (elementID == 'body' ? document.body : document.getElementById(elementID))
            if (element) element.removeEventListener('click', clickFunction);
        }
    }


    static isOneOpen() {
        const listIDs = Object.keys(dropDownObjects);
        let oneOpen = false;
        listIDs.forEach(listID => { if (dropDownObjects[listID].stateDropDown == 'open') oneOpen = true });
        return oneOpen;
    }


    static closeAll(exclusionID = '') {
        const listIDs = Object.keys(dropDownObjects);
        for (let index = 0; index < listIDs.length; index++) {
            const listID = listIDs[index];
            if (listID != exclusionID) dropDownObjects[listIDs[index]].closeDropDown();
        }
    }


    constructor(openFunc, formPrefix) {
        this.openFunction = openFunc;
        this.formprefix = formPrefix;
        this.stateDropDown = 'close';
    }


    openDropDown() {
        if (this.stateDropDown == 'open') return;
        if (DropDownList.isOneOpen()) DropDownList.closeAll();
        this.openFunction(this.formprefix, true);
        DropDownList.setCloseEventElements();
        this.stateDropDown = 'open';
    }


    closeDropDown() {
        if (this.stateDropDown == 'close') return;
        this.openFunction(this.formprefix, false);
        this.stateDropDown = 'close';
        DropDownList.unsetCloseEventElements()
    }


    toggleDropDown() {
        if (this.stateDropDown == 'open') this.closeDropDown();
        else this.openDropDown();
    }
}


const clickFunction = function (event) { clickWhenDropDownListOpen(event); }


function clickWhenDropDownListOpen(event) {
    event.stopPropagation();
    if (event.target.getAttribute('nolistclose') != null) return false;
    DropDownList.closeAll();
}


function clickDropDownList(event, listID) {
    if (dropDownObjects[listID]) {
        event.stopPropagation();
        dropDownObjects[listID].toggleDropDown();
    }
}


function openDropDownList(listID) {
    if (dropDownObjects[listID]) {
        dropDownObjects[listID].openDropDown();
    }
}


function closeDropDownList(listID) {
    if (dropDownObjects[listID]) {
        dropDownObjects[listID].closeDropDown();
    }
}


let dropDownObjects = {
    'addtask_assignet': new DropDownList(openAssignedContactsDropDownList, 'addtask_'),
    'edittask_assignet': new DropDownList(openAssignedContactsDropDownList, 'edittask_'),
    'addtask_category': new DropDownList(openTaskCategoryDropDownList, 'addtask_'),
}
