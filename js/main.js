// example arrays for testing only ---------------------------------------------------
let sessionTasks = [
    {
        id: 'T12',
        status: 'todo',
        title: 'Kochwelt Page & Recipe Recommender',
        description: 'Build start page with recipe recommendation',
        assignedto: ['C123'],
        date: '2024-03-16',
        priority: '',
        category: 1,
        subtasks: [
            { name: 'subtask 1', done: true },
            { name: 'subtask 2', done: false },
            { name: 'subtask 3', done: false },
            { name: 'subtask 4', done: false },
        ]
    },
    {
        id: 'T123',
        status: 'inprogress',
        title: 'HTML Base Template Creation',
        description: 'Create reusable HTML base templates',
        assignedto: ['C456'],
        date: '2024-03-16',
        priority: 'low',
        category: 2,
        subtasks: []
    },
    {
        id: 'T123454',
        status: 'awaitfeedback',
        title: 'Join fertigmachen',
        description: '',
        assignedto: ['C789', 'C456'],
        date: '2024-03-16',
        priority: 'medium',
        category: 1,
        subtasks: [
            { name: 'subtask 1', done: true },
            { name: 'subtask 2', done: false },
        ]
    },
]

let sessionContacts = [
    {
        id: 'C123',
        name: 'Bela Schramm',
        initial: 'BS',
        email: 'belaschramm@aol.de',
        color: '#0038FF',
        phone: '491111111111',
    },
    {
        id: 'C456',
        name: 'Nadja Reuther',
        initial: 'NR',
        email: 'belaschramm@aol.de',
        color: '#00BEE8',
        phone: '491111111345',
    },
    {
        id: 'C789',
        name: 'Simon Henke',
        initial: 'SH',
        email: 'belaschramm@aol.de',
        color: '#1FD7C1',
        phone: '491118731111',
    },
    {
        id: 'C321',
        name: 'Michael Buschmann',
        initial: 'MB',
        email: 'belaschramm@aol.de',
        color: '#6E52FF',
        phone: '491111128011',
    },
    {
        id: 'C654',
        name: 'Bruse Willis',
        initial: 'BW',
        email: 'belaschramm@aol.de',
        color: '#9747FF',
        phone: '494711151111',
    },
    {
        id: 'C987',
        name: 'Max Mustermann',
        initial: 'MM',
        email: 'belaschramm@aol.de',
        color: '#C3FF2B',
        phone: '491146801111',
    },
]

let users = [
    {
        id: 'U123',
        name: 'Bela Schramm',
        email: 'belaschramm@aol.de',
        passwort: 'BS',
    },
    {
        id: 'U456',
        name: 'Nadja Reuther',
        email: 'nadjareuther@aol.de',
        passwort: 'NR',
    },
    {
        id: 'U789',
        name: 'Simon Henke',
        email: 'simonhenke@aol.de',
        passwort: 'SH',
    },
]
// example arrays for testing only ---------------------------------------------------END

let currentuser = '';

const taskCategorys = {
    1: { id: 1, name: 'User Story', color: '#0038ff', },
    2: { id: 2, name: 'Technical Task', color: '#1FD7C1', }
}


// DEBUG SECTION BEGIN -----------------------------
function testGuestLogin() {
    sessionStorage.setItem('currentuser', 'Guest');
    sessionStorage.setItem('sessiontasks', JSON.stringify(sessionTasks));
    window.location.href = './summary.html';
}


function loadAllFromLocalStorage() {
    let tasks = localStorage.getItem('testtasks');
    if (tasks) sessionTasks = JSON.parse(tasks);
    let contacts = localStorage.getItem('testcontacts');
    if (contacts) sessionContacts = JSON.parse(contacts);
}


function saveAllToLocalStorage() {
    localStorage.setItem('testtasks', JSON.stringify(sessionTasks));
    localStorage.setItem('testcontacts', JSON.stringify(sessionContacts));
}
// DEBUG SECTION END -----------------------------


/**
 * create and return an unique id with optional prefix string
 * 
 * @param {string} prefix 
 * @returns {string}
 */
function createUniqueID(prefix) {
    const uniqueID = Math.random().toString(16).slice(2);
    return prefix + uniqueID;
}


/**
 * main init function with check if user loged in
 */
async function initJoin() {
    // test if user logged in
    currentuser = sessionStorage.getItem('currentuser');
    if (currentuser == null || currentuser == '') window.location.href = './index.html';
    // user is correct logged in
    await includeHTML();
    // load task from sessionstorage and or from remotestorage
}


/**
 * init function for the login site
 */
async function initLoginSite() {
    await includeHTML();
    // load contacts from remotestorage for login
    sessionStorage.setItem('sessioncontacts', JSON.stringify(sessionContacts));
}


/**
 * includes html templates to the site
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


/**
 * converts a string to pascalcase, undefined parameter returns a empty string
 * 
 * @param {string} word - string that be converted
 * @returns {string} to pascalcase converted string
 */
function getPascalCaseWord(word) {
    if (word) return word.charAt(0).toUpperCase() + word.slice(1).toLowerCase();
    else return '';
}


/**
 * gets a html element with the id or the element itself
 * 
 * @param {string|Object} elementIdOrObj 
 * @returns {Object} htmlelement
 */
function getElement(elementIdOrObj) {
    if (typeof elementIdOrObj === 'string') return document.getElementById(elementIdOrObj);
    return elementIdOrObj;
}


/**
 * set the focus to the given element or element id
 * 
 * @param {string|Object} elementIdOrObj 
 */
function setFocus(elementIdOrObj) {
    getElement(elementIdOrObj).focus();
}


/**
 * set the value of a input element or element id
 * 
 * @param {string|Object} elementIdOrObj 
 * @param {string} newvalue 
 */
function setInputValue(elementIdOrObj, newvalue = '') {
    getElement(elementIdOrObj).value = newvalue;
}


/**
 * get the value of the given input element or input element id
 * 
 * @param {string|Object} elementIdOrObj 
 */
function getInputValue(elementIdOrObj) {
    return getElement(elementIdOrObj).value;
}


/**
 * set the givent style property of the elemnet or the element id with the stylevalue
 * 
 * @param {string|Object} elementIdOrObj 
 * @param {string} styleProperty 
 * @param {string} styleValue 
 */
function setStyle(elementIdOrObj, styleProperty, styleValue) {
    getElement(elementIdOrObj).style[styleProperty] = styleValue;
}


/**
 * set the attribute of the element or the element id with the value
 * 
 * @param {string|Object} elementIdOrObj 
 * @param {string} attribute 
 * @param {string} value 
 */
function setAttribute(elementIdOrObj, attribute, value) {
    getElement(elementIdOrObj).setAttribute(attribute, value);
}


/**
 * set the placeholder property of a input element or a element id
 * 
 * @param {string|Object} elementIdOrObj 
 * @param {string} placeholderString 
 */
function setPlaceHolder(elementIdOrObj, placeholderString) {
    getElement(elementIdOrObj).placeholder = placeholderString;
}


/**
 * set the innerHTML property of an element or an element id with the new htmlstring
 * 
 * @param {string|Object} elementIdOrObj 
 * @param {string} htmlString 
 */
function setInnerHTML(elementIdOrObj, htmlString = '') {
    getElement(elementIdOrObj).innerHTML = htmlString;
}


/**
 * add the htmlstring to the innerHTML property of an element or an element id
 * 
 * @param {string|Object} elementIdOrObj 
 * @param {string} htmlString 
 */
function addInnerHTML(elementIdOrObj, htmlString) {
    getElement(elementIdOrObj).innerHTML += htmlString;
}


/**
 * set the focus to the input with id nextInputID when enter key is pressed
 * 
 * @param {Object} event 
 * @param {string} nextInputID 
 */
function getToNextInputOnKeyEnter(event, nextInputID = '') {
    if (event.key == 'Enter') {
        const nextElement = getElement(nextInputID);
        if (nextElement) nextElement.focus();
        event.preventDefault();
    }
}