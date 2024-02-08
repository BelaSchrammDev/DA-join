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
            { name: 'subtask 2', done: false },
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
        subtasks: [
            { name: 'subtask 1', done: true },
            { name: 'subtask 2', done: false },
        ]
    },
    {
        id: 'T123454',
        title: 'Testtask 3',
        description: 'Titel 3 beschreibung',
        assignedto: ['C789'],
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
        email: 'belaschramm@aol.de',
        passwort: 'BS'
    },
    {
        id: 'C456',
        name: 'Nadja Reuther',
        email: 'belaschramm@aol.de',
        passwort: 'NR'
    },
    {
        id: 'C789',
        name: 'SImon Henke',
        email: 'belaschramm@aol.de',
        passwort: 'SH'
    },
    {
        id: 'C321',
        name: 'Michael Buschmann',
        email: 'belaschramm@aol.de',
        passwort: 'MB'
    },
    {
        id: 'C654',
        name: 'Bruse Willis',
        email: 'belaschramm@aol.de',
        passwort: 'BW'
    },
    {
        id: 'C987',
        name: 'Max Mustermann',
        email: 'belaschramm@aol.de',
        passwort: 'MM'
    },
]


let currentuser = '';


const taskCategorys = [
    { id: 1, name: 'User Story' },
    { id: 2, name: 'Technical Task' }
]


function createUniqueID(prefix) {
    const idnumber = new Date().getTime();
    return prefix + idnumber;
}


function testGuestLogin() {
    sessionStorage.setItem('currentuser', 'Guest');
    sessionStorage.setItem('sessiontasks', JSON.stringify(sessionTasks));
    window.location.href = './summary.html';
}

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

