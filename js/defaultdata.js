// example arrays for testing only ---------------------------------------------------
let defaultTasks = [
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

let defaultContacts = [
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

const userGuest = {
    id: 'UXXXXXXX',
    name: 'Guest',
    initial: 'G',
    email: 'guest@gmail.com',
    color: '#0038FF',
    phone: '',
}

