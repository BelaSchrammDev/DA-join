/**
 * Represents the currently open dropdown.
 * @type {Object}
 */
let currentOpenDropDown = null;

/**
 * Represents a list of dropdowns.
 * @type {Array}
 */
let dropdowns = [];

/**
 * The click event handler function when a dropdown is open.
 * @param {Event} event - The click event object.
 */
const clickFunction = function (event) { clickWhenDropDownOpen(event); };

/**
 * The list of elements that trigger the close event.
 * @type {Array}
 */
const closeEventElements = ['body', 'addtask_template', 'task_big_edit', 'addtask_overlay', 'task_big'];

/**
 * Adds a dropdown to the dropdown list.
 * 
 * @param {string} listID - The ID of the dropdown list.
 * @param {Function} openFunc - The function to be called when the dropdown open and close.
 * @param {string} formID - The ID of the form associated with the dropdown.
 */
function addDropDown(listID, openFunc, formID) {
    if (dropdowns.find(l => l.id == listID)) return;
    let newDropDown = { id: listID, openFunction: openFunc, formid: formID, open: false };
    dropdowns.push(newDropDown);
}

/**
 * Resets all the dropdowns by closing them.
 */
function resetAllDropDowns() {
    closeDropDown();
    dropdowns.forEach(l => l.open == false);
}

/**
 * Removes a dropdown from the dropdown list.
 * @param {string} listID - The ID of the dropdown list to be removed.
 */
function removeDropDown(listID) {
    const dropdownIndex = dropdowns.findIndex(l => l.id == listID);
    if (dropdownIndex == -1) return;
    dropdowns.splice(dropdownIndex, 1);
}

/**
 * Sets up the close event elements by adding click event listeners to them.
 */
function setCloseEventElements() {
    for (let index = 0; index < closeEventElements.length; index++) {
        const elementID = closeEventElements[index];
        const element = (elementID == 'body' ? document.body : document.getElementById(elementID))
        if (element) element.addEventListener('click', clickFunction);
    }
}

/**
 * Unsets the close event elements by removing click event listeners from them.
 */
function unsetCloseEventElements() {
    for (let index = 0; index < closeEventElements.length; index++) {
        const elementID = closeEventElements[index];
        const element = (elementID == 'body' ? document.body : document.getElementById(elementID))
        if (element) element.removeEventListener('click', clickFunction);
    }
}

/**
 * Handles the click event when a dropdown is open.
 * @param {Event} event - The click event object.
 */
function clickWhenDropDownOpen(event) {
    event.stopPropagation();
    if (event.target.getAttribute('nolistclose') != null) return false;
    closeDropDown();
}

/**
 * Handles the click event when a dropdown is toggled.
 * @param {Event} event - The click event object.
 * @param {string} listID - The ID of the dropdown list.
 */
function clickDropDown(event, listID) {
    event.stopPropagation();
    let dropDown = dropdowns.find(d => d.id == listID);
    if (dropDown == currentOpenDropDown) closeDropDown();
    else {
        closeDropDown();
        openDropDown(listID);
    }
}

/**
 * Opens a dropdown.
 * @param {string} listID - The ID of the dropdown list to be opened.
 */
function openDropDown(listID) {
    if (currentOpenDropDown != null) {
        currentOpenDropDown.openFunction(currentOpenDropDown.formid, false);
        currentOpenDropDown.open = false;
    }
    else setCloseEventElements();
    currentOpenDropDown = dropdowns.find(d => d.id == listID);
    currentOpenDropDown.openFunction(currentOpenDropDown.formid, true);
    currentOpenDropDown.open = true;
}

/**
 * Closes the currently open dropdown.
 */
function closeDropDown() {
    if (currentOpenDropDown == null) return;
    currentOpenDropDown.openFunction(currentOpenDropDown.formid, false);
    currentOpenDropDown.open = false;
    currentOpenDropDown = null;
    unsetCloseEventElements();
}


function openFlyWindow(formID, open) {
    setStyle(formID, 'transform', open ? 'translateX(0)' : 'translateX(150vw)');
}


