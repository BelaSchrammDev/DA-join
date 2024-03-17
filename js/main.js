/**
 * @typedef {Object} TaskCategory
 * @property {number} id - The ID of the task category.
 * @property {string} name - The name of the task category.
 * @property {string} color - The color associated with the task category.
 */


const taskCategorys = {
    1: { id: 1, name: 'User Story', color: '#0038ff' },
    2: { id: 2, name: 'Technical Task', color: '#1FD7C1' }
};


/**
 * Array of colors for the contacts.
 * @type {string[]}
 */
const hexColors = [
    '#0038FF',
    '#00BEE8',
    '#1FD7C1',
    '#6E52FF',
    '#9747FF',
    '#C3FF2B',
    '#FC71FF',
    '#FF4646',
    '#FF5EB3',
    '#FF745E',
    '#FF7A00',
    '#FFA35E',
    '#FFBB2B',
    '#FFC701',
    '#FFE62B'
];


/**
 * Closes the header menu by removing the 'show-header-menu' class from the 'headerMenu' element.
 */
function closeHeaderMenu() {
    removeClass('headerMenu', 'show-header-menu');
}


/**
 * Toggles the header menu by adding or removing the 'show-header-menu' class from the 'headerMenu' element.
 * If the dropdown is open, it is closed by calling the 'closeDropDown' function.
 */
function toggleHeaderMenu() {
    if (typeof closeDropDown !== 'undefined') closeDropDown();
    toggleClass('headerMenu', 'show-header-menu');
}


/**
 * Generates a random color from the 'hexColors' array.
 * 
 * @returns {string} A random color in hexadecimal format.
 */
function randomColor() {
    let randomColor = Math.floor(Math.random() * hexColors.length);
    return randomColor;
}


/**
 * Logs out the current user by removing session data and redirecting to the login page.
 */
function logOut() {
    sessionStorage.removeItem('currentuser');
    sessionStorage.removeItem('sessiontasks');
    sessionStorage.removeItem('sessioncontacts');
    sessionStorage.removeItem('intro');
    window.location.href = './index.html';
}


/**
 * Creates and returns a unique ID with an optional prefix string.
 * 
 * @param {string} prefix - The prefix for the unique ID.
 * @returns {string} The unique ID.
 */
function createUniqueID(prefix) {
    const uniqueID = Math.random().toString(16).slice(2);
    return prefix + uniqueID;
}


/**
 * Initializes the join application by checking if the user is logged in,
 * loading HTML templates, and loading session data.
 */
async function initJoin() {
    loadCurrentUser(true);
    await includeHTML();
    highlightCurrentPageLink();
    setInitialSpan();
    await loadSessionDataFromSessionStorage();
}


/**
 * Loads the current user from session storage
 * and redirects to the login page if the user is not logged in.
 * 
 * @param {boolean} forceLogin - Whether to force the user to log in.
 */
async function loadCurrentUser(forceLogin = false) {
    let currentUserString = await sessionStorage.getItem('currentuser');
    if (forceLogin && !currentUserString) window.location.href = './index.html';
    currentuser = JSON.parse(currentUserString);
    if (forceLogin && !currentuser.id) window.location.href = './index.html';
}


/**
 * Initializes the legal notice and privacy policy page by loading the current user,
 * including HTML templates, and hiding the menu if the user is empty.
 */
async function initLegalNoticePrivacyPolicy() {
    loadCurrentUser();
    await includeHTML();
    hideMenuIfEmptyUser();
    highlightCurrentPageLink();
    setInitialSpan();
}


/**
 * Sets the initial span element with the current user's initial
 * or hides the current user badge if there is no current user.
 */
function setInitialSpan() {
    if (currentuser) {
        const initialSpan = getElement('currentuser-initial');
        if (initialSpan) setInnerHTML(initialSpan, currentuser.initial);
    } else {
        setStyle('current_user_badge', 'display', 'none');
    }
}


/**
 * Includes HTML templates into the site by fetching and inserting the HTML content
 * into elements with the 'w3-include-html' attribute.
 */
async function includeHTML() {
    let includeElements = document.querySelectorAll('[w3-include-html]');
    for (let i = 0; i < includeElements.length; i++) {
        const element = includeElements[i];
        file = element.getAttribute("w3-include-html");
        let resp = await fetch(file);
        if (resp.ok) {
            let htmlText = await resp.text();
            element.innerHTML = htmlText;
        } else {
            element.innerHTML = 'Page not found';
        }
    }
}


function highlightCurrentPageLink() {
    let currentPage = window.location.pathname.split('/').pop();
    let links = document.querySelectorAll('.nav_list_element');
    links.forEach(link => {
        let linkPage = link.getAttribute('href').split('/').pop();
        if (linkPage === currentPage) {
            link.classList.add('nav_list_element_highlighted');
        }
    });
}



/**
 * Hides the menu if there is no current user.
 */
function hideMenuIfEmptyUser() {
    if (currentuser) return;
    setStyle('nav_elements', 'display', 'none');
}


/**
 * Converts a string to PascalCase. If the word parameter is undefined, an empty string is returned.
 * 
 * @param {string} word - The string to be converted.
 * @returns {string} The PascalCase converted string.
 */
function getPascalCaseWord(word) {
    if (word) return word.charAt(0).toUpperCase() + word.slice(1).toLowerCase();
    else return '';
}


/**
 * Gets an HTML element with the specified ID or the element itself.
 * 
 * @param {string|Object} elementIdOrObj - The ID of the element or the element itself.
 * @returns {Object} The HTML element.
 */
function getElement(elementIdOrObj) {
    if (typeof elementIdOrObj === 'string') return document.getElementById(elementIdOrObj);
    return elementIdOrObj;
}


/**
 * Adds a CSS class to the specified element.
 * 
 * @param {string|Object} elementIdOrObj - The ID of the element or the element itself.
 * @param {string} className - The name of the class to add.
 */
function addClass(elementIdOrObj, className) {
    getElement(elementIdOrObj).classList.add(className);
}


/**
 * Removes a CSS class from the specified element.
 * 
 * @param {string|Object} elementIdOrObj - The ID of the element or the element itself.
 * @param {string} className - The name of the class to remove.
 */
function removeClass(elementIdOrObj, className) {
    getElement(elementIdOrObj).classList.remove(className);
}


/**
 * Toggles the specified class on the given element.
 *
 * @param {string|HTMLElement} elementIdOrObj - The ID of the element or the element object itself.
 * @param {string} className - The class name to toggle.
 */
function toggleClass(elementIdOrObj, className) {
    getElement(elementIdOrObj).classList.toggle(className);
}


/**
 * Sets the focus to the specified element.
 * 
 * @param {string|Object} elementIdOrObj - The ID of the element or the element itself.
 */
function setFocus(elementIdOrObj) {
    getElement(elementIdOrObj).focus();
}


/**
 * Sets the value of the specified input element.
 * 
 * @param {string|Object} elementIdOrObj - The ID of the input element or the element itself.
 * @param {string} newvalue - The new value to set.
 */
function setInputValue(elementIdOrObj, newvalue = '') {
    getElement(elementIdOrObj).value = newvalue;
}


/**
 * Gets the value of the specified input element.
 * 
 * @param {string|Object} elementIdOrObj - The ID of the input element or the element itself.
 * @returns {string} The value of the input element.
 */
function getInputValue(elementIdOrObj) {
    return getElement(elementIdOrObj).value;
}


/**
 * Sets the specified style property of the element.
 * 
 * @param {string|Object} elementIdOrObj - The ID of the element or the element itself.
 * @param {string} styleProperty - The name of the style property.
 * @param {string} styleValue - The value to set for the style property.
 */
function setStyle(elementIdOrObj, styleProperty, styleValue) {
    getElement(elementIdOrObj).style[styleProperty] = styleValue;
}


/**
 * Sets the specified attribute of the element.
 * 
 * @param {string|Object} elementIdOrObj - The ID of the element or the element itself.
 * @param {string} attribute - The name of the attribute.
 * @param {string} value - The value to set for the attribute.
 */
function setAttribute(elementIdOrObj, attribute, value) {
    getElement(elementIdOrObj).setAttribute(attribute, value);
}


/**
 * Sets the placeholder property of the input element.
 * 
 * @param {string|Object} elementIdOrObj - The ID of the input element or the element itself.
 * @param {string} placeholderString - The placeholder string to set.
 */
function setPlaceHolder(elementIdOrObj, placeholderString) {
    getElement(elementIdOrObj).placeholder = placeholderString;
}


/**
 * Sets the innerHTML property of the element.
 * 
 * @param {string|Object} elementIdOrObj - The ID of the element or the element itself.
 * @param {string} htmlString - The HTML string to set.
 */
function setInnerHTML(elementIdOrObj, htmlString = '') {
    getElement(elementIdOrObj).innerHTML = htmlString;
}


/**
 * Adds the specified HTML string to the innerHTML property of the element.
 * 
 * @param {string|Object} elementIdOrObj - The ID of the element or the element itself.
 * @param {string} htmlString - The HTML string to add.
 */
function addInnerHTML(elementIdOrObj, htmlString) {
    getElement(elementIdOrObj).innerHTML += htmlString;
}


/**
 * Sets the focus to the next input element when the Enter key is pressed.
 * 
 * @param {Object} event - The keydown event object.
 * @param {string} nextInputID - The ID of the next input element.
 */
function getToNextInputOnKeyEnter(event, nextInputID = '') {
    if (event.key == 'Enter') {
        const nextElement = getElement(nextInputID);
        if (nextElement) nextElement.focus();
        event.preventDefault();
    }
}
