let sessionTasks = [
    {
        id: 'T12',
        title: 'Testtask 2',
        description: 'Titel 2 beschreibung',
        assignedto: ['C123'],
        date: '14.02.2024',
        priority: '',
        category: 1,
        subtasks: [
            { name: 'subtask 1', done: true },
            { name: 'subtask 2', done: true },
        ]
    },
    {
        id: 'T123',
        title: 'Testtask 2',
        description: 'Titel 2 beschreibung',
        assignedto: ['C456'],
        date: '14.04.2024',
        priority: 'low',
        category: 2,
        subtasks: []
    },
    {
        id: 'T123454',
        title: 'Testtask 3',
        description: 'Titel 3 beschreibung',
        assignedto: ['C789','C456'],
        date: '14.02.2025',
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
        passwort: 'BS'
    },
    {
        id: 'C456',
        name: 'Nadja Reuther',
        initial: 'NR',
        email: 'belaschramm@aol.de',
        color: '#00BEE8',
        passwort: 'NR'
    },
    {
        id: 'C789',
        name: 'Simon Henke',
        initial: 'SH',
        email: 'belaschramm@aol.de',
        color: '#1FD7C1',
        passwort: 'SH'
    },
    {
        id: 'C321',
        name: 'Michael Buschmann',
        initial: 'MB',
        email: 'belaschramm@aol.de',
        color: '#6E52FF',
        passwort: 'MB'
    },
    {
        id: 'C654',
        name: 'Bruse Willis',
        initial: 'BW',
        email: 'belaschramm@aol.de',
        color: '#9747FF',
        passwort: 'BW'
    },
    {
        id: 'C987',
        name: 'Max Mustermann',
        initial: 'MM',
        email: 'belaschramm@aol.de',
        color: '#C3FF2B',
        passwort: 'MM'
    },
]


let currentuser = '';


const taskCategorys = {
    1: { id: 1, name: 'User Story', color: '#0038ff', },
    2: { id: 2, name: 'Technical Task', color: '#1FD7C1', }
}


function createUniqueID(prefix) {
    const idnumber = new Date().getTime();
    return prefix + idnumber;
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


async function initJoin() {
    // test if user logged in
    currentuser = sessionStorage.getItem('currentuser');
    if (currentuser == null || currentuser == '') window.location.href = './index.html';
    // user is correct logged in
    await includeHTML();
    // load task from sessionstorage and or from remotestorage
}


async function initLoginSite() {
    await includeHTML();
    // load contacts from remotestorage for login
    sessionStorage.setItem('sessioncontacts', JSON.stringify(sessionContacts));
}


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


function setFocus(elementID) {
    document.getElementById(elementID).focus();
}


function setInputValue(elementID, newvalue = '') {
    document.getElementById(elementID).value = newvalue;
}

