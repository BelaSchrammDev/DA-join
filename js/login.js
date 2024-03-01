const userGuest = {
    id: 'UXXXXXXX',
    name: 'Guest',
    initial: 'G',
    email: 'guest@gmail.com',
    color: '#0038FF',
    phone: '',
}


async function tryLogin(loginEmail, loginPassword) {
    const users = await getItemAsJson('users');
    if (!users) return 'userarray';
    const user = users.find(u => u.email == loginEmail);
    if (!user) return 'email';
    if (user.password != loginPassword) return 'password';
    return user;
}


async function loginUser(user) {
    currentuser = createUserObjectFromLoginData(user);
    sessionStorage.setItem('currentuser', JSON.stringify(currentuser));
    await loadSessionTasksFromRemoteStorage();
    if (sessionTasks.length == 0) sessionTasks = defaultTasks;
    sessionStorage.setItem('sessiontasks', JSON.stringify(sessionTasks));
    await loadSessionContactsFromRemoteStorage();
    if (sessionContacts.length == 0) sessionContacts = defaultContacts;
    sessionStorage.setItem('sessioncontacts', JSON.stringify(sessionContacts));
    window.location.href = './summary.html';
}


/**
 * return the object for the current user
 * 
 * @param {Object} loginObject from usersarray
 * @returns {Object} object for store data of the current user
 */
function createUserObjectFromLoginData(loginObject) {
    const initials = loginObject.name.split(' ').map((item) => { return item[0].toUpperCase() }).join('');
    return {
        id: loginObject.id,
        name: loginObject.name,
        initial: initials,
        email: loginObject.email,
        color: hexColors[randomColor()],
    }
}


function togglePasswortVisibility(inputID) {
    const passwordInput = document.getElementById(inputID);
    if (passwordInput.type == 'password') passwordInput.type = 'text';
    else passwordInput.type = 'password';
}


async function loginAsGuest() {
    sessionStorage.setItem('currentuser', JSON.stringify(userGuest));
    sessionStorage.setItem('sessiontasks', JSON.stringify(defaultTasks));
    sessionStorage.setItem('sessioncontacts', JSON.stringify(defaultContacts));
    window.location.href = './summary.html';
}


function clearAllMessagesFromInputs() {
    const inputs = ['email', 'password'];
    for (let index = 0; index < inputs.length; index++) {
        const id = inputs[index];
        removeClass('login_' + id, 'message');
        removeClass('login_' + id, 'message_' + id);
    }
    setInnerHTML('login_errormessage', '');
}


function setErrorMessages(errorMessage) {
    switch (errorMessage) {
        case 'email':
            addClass('login_email', 'message');
            addClass('login_email', 'message_email');
            break;
        case 'password':
            addClass('login_password', 'message');
            addClass('login_password', 'message_password');
            break;
        case 'userarray':
            setInnerHTML('login_errormessage', 'could not load userdata, try again later');
    }
    console.error('login denied -> ' + errorMessage);
}


async function submitLogin(event) {
    clearAllMessagesFromInputs();
    const loginForm = event.target;
    const formObject = Object.fromEntries(new FormData(loginForm));
    let response = await tryLogin(formObject.email, formObject.password);
    if (typeof response === 'string') {
        setErrorMessages(response);
    } else {
        loginUser(response);
    }
}