let currentuser = undefined;
let sessionTasks = [];
let sessionContacts = [];

const taskCategorys = {
    1: { id: 1, name: 'User Story', color: '#0038ff', },
    2: { id: 2, name: 'Technical Task', color: '#1FD7C1', }
}


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
    '#FFE62B',
];


function closeHeaderMenu() {
    document.getElementById('headerMenu').classList.remove('show-header-menu');
}


function toggleHeaderMenu() {
    document.getElementById('headerMenu').classList.toggle('show-header-menu');
}


function randomColor() {
    let randomColor = Math.floor(Math.random() * hexColors.length);
    return randomColor;
}


function logOut() {
    sessionStorage.removeItem('currentuser');
    sessionStorage.removeItem('sessiontasks');
    sessionStorage.removeItem('sessioncontacts');
    window.location.href = './index.html';
}


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
    let currentUserString = sessionStorage.getItem('currentuser');
    if (!currentUserString) window.location.href = './index.html';
    currentuser = JSON.parse(currentUserString);
    if (!currentuser.id) window.location.href = './index.html';
    // user is correct logged in
    await includeHTML();
    const initialSpan = getElement('currentuser-initial');
    if (initialSpan) setInnerHTML(initialSpan, currentuser.initial);
    await loadSessionDataFromSessionStorage();
}


/**
 * init function for the login site
 */
async function initLoginSite() {
    await includeHTML();
    // load users from remotestorage for login
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


function addClass(elementIdOrObj, className) {
    getElement(elementIdOrObj).classList.add(className);
}


function removeClass(elementIdOrObj, className) {
    getElement(elementIdOrObj).classList.remove(className);
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
