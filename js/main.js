let sessionTasks = [
    {
        id: 12345,
        title: 'Testtask 1',
        description: 'Titel 1 beschreibung',
        assignedto: ['C123'],
        date: '14.02.2024',
        priority: '',
        category: 1,
        subtasks: [
            { name: 'subtask 1', done: true },
            { name: 'subtask 2', done: false },
        ]
    }
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


function testGuestLogin() {
    sessionStorage.setItem('currentuser', 'Guest');
    sessionStorage.setItem('sessiontasks', JSON.stringify(sessionTasks));
    sessionStorage.setItem('sessioncontacts', JSON.stringify(sessionContacts));
    window.location.href = './summary.html';
}

async function initJoin() {
    // test if user logged in
    currentuser = sessionStorage.getItem('currentuser');
    if (currentuser == null) window.location.href = './index.html';
    // user login
    await includeHTML();
    // load task and contacts from remotestorage
    // currently the above defined are taken
}


async function initLoginSite(){
    await includeHTML();
    // ???
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


