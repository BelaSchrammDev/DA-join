// this is the default tasks and contacts for the guest user

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
            { name: 'Create site structure', done: true },
            { name: 'Create 3 Recipes', done: false },
            { name: 'Implement the Calculator', done: false },
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
        subtasks: [
            { name: 'Create Header', done: true },
            { name: 'Create Footer', done: false },
            { name: 'Create Sidebar', done: false },
        ]
    },
    {
        id: 'T123454',
        status: 'done',
        title: 'Join finish off',
        description: '',
        assignedto: ['C789', 'C456'],
        date: '2024-04-16',
        priority: 'urgent',
        category: 1,
        subtasks: [
            { name: 'Addtask', done: true },
            { name: 'Summary', done: false },
            { name: 'Login', done: true },
            { name: 'Board', done: false },
            { name: 'Sidebar', done: false },
        ]
    },
    {
        id: 'T1',
        status: 'todo',
        title: 'Write the documentation for the project',
        description: 'Write the documentation for the project and create a presentation for the project',
        assignedto: ['C123'],
        date: '2024-03-17',
        priority: '',
        category: 1,
        subtasks: [
            { name: 'Create the presentation', done: true },
            { name: 'Write the documentation', done: false },
            { name: 'Create a video', done: false },
        ]
    },
    {
        id: 'T2',
        status: 'inprogress',
        title: 'Learning ReactJS',
        description: 'Learn the basics of ReactJS and create a small project with it',
        assignedto: ['C456'],
        date: '2024-03-18',
        priority: 'low',
        category: 2,
        subtasks: [
            { name: 'Create a small project', done: true },
            { name: 'Learn the basics', done: false },
        ]
    }
];

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
        email: 'reuthernadja@aol.de',
        color: '#00BEE8',
        phone: '491111111345',
    },
    {
        id: 'C789',
        name: 'Simon Henke',
        initial: 'SH',
        email: 'simonhenke@aol.de',
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
        email: 'bruce@hollywood.org',
        color: '#9747FF',
        phone: '494711152345',
    },
    {
        id: 'C987',
        name: 'Max Müller',
        initial: 'MM',
        email: 'maximilian@aol.de',
        color: '#C3FF2B',
        phone: '491146801111',
    },
    {
        id: 'C246',
        name: 'John Doe',
        initial: 'JD',
        email: 'johndoe@gmail.com',
        color: '#FC71FF',
        phone: '491234567890',
    },
    {
        id: 'C135',
        name: 'Alice Smith',
        initial: 'AS',
        email: 'alicesmith@yahoo.com',
        color: '#FF4646',
        phone: '491234567891',
    },
    {
        id: 'C864',
        name: 'Bob Johnson',
        initial: 'BJ',
        email: 'bobjohnson@hotmail.com',
        color: '#FF5EB3',
        phone: '491234567892',
    },
    {
        id: 'C579',
        name: 'Emily Davis',
        initial: 'ED',
        email: 'emilydavis@gmail.com',
        color: '#FF745E',
        phone: '491234567893',
    },
    {
        id: 'C2468',
        name: 'David Wilson',
        initial: 'DW',
        email: 'davidwilson@yahoo.com',
        color: '#FF7A00',
        phone: '491234567894',
    },
];
