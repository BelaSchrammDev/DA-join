const userGuest = {
    id: 'UXXXXXXX',
    name: 'Guest',
    initial: 'G',
    email: 'guest@gmail.com',
    color: '#0038FF',
    phone: '',
}
let current_flyID = '';


async function tryLogin(loginEmail, loginPassword) {
    const users = await getItemAsJson('users');
    if (!users) return 'remote#userarray';
    const user = users.find(u => u.email == loginEmail);
    if (!user) return 'email#unknow';
    if (user.password != loginPassword) return 'password#wrong';
    return user;
}


async function trySignIn(signinName, signinEmail, signinPassword, signinPasswordConfirm) {
    const users = await getItemAsJson('users');
    if (!users) return 'remote#userarray';
    if (users.find(u => u.name == signinName)) return 'name#exists';
    if (users.find(u => u.email == signinEmail)) return 'email#exists';
    if (signinPassword != signinPasswordConfirm) return 'password_confirm#notconfirm';
    const newUser = { id: createUniqueID('U'), name: signinName, email: signinEmail, password: signinPassword };
    users.push(newUser);
    setItemFromJson('users', users);
    return newUser;
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


function clearAllMessagesFromInputs(formID, inputs) {
    for (let index = 0; index < inputs.length; index++) {
        const input = getElement(formID + inputs[index]);
        if (input) {
            for (let x = input.classList.length - 1; x >= 0; x--) {
                const iClass = input.classList[x];
                if (iClass.startsWith('message')) input.classList.remove(iClass);
            }
        }
    }
    setInfoMessage(formID + 'info');
}


function setInputErrorMessages(formID, errorMessage) {
    const errorField = errorMessage.split('#')[0];
    const errorType = errorMessage.split('#')[1];
    if (errorType == 'userarray') {
        setInfoMessage(formID + 'info', '#FF8190', 'could not load userdata, try again later');
    } else {
        addClass(formID + errorField, 'message');
        addClass(formID + errorField, 'message_' + errorField + '_' + errorType);
    }
    console.error('[' + formID + '] error : ' + errorField + ' / ' + errorType);
}


async function submitLogin(event) {
    clearAllMessagesFromInputs('login_', ['password', 'email']);
    const formData = Object.fromEntries(new FormData(event.target));
    startBlueLineAnim('login_blueline');
    setInfoMessage('login_info', 'black', 'login in progress...');
    let response = await tryLogin(formData.email, formData.password);
    endBlueLineAnim('login_blueline');
    if (typeof response === 'string') {
        setInfoMessage('login_info', '#FF8190', 'login failed');
        setInputErrorMessages('login_', response);
    } else {
        showFlyinfo('fly_info_login_success');
        setTimeout(() => { loginUser(response); }, 1200);
    }
}


async function submitSignIn(event) {
    clearAllMessagesFromInputs('signin_', ['name', 'email', 'confirm_password']);
    const formData = Object.fromEntries(new FormData(event.target));
    startBlueLineAnim('signin_blueline');
    setInfoMessage('signin_info', 'black', 'signin in progress...');
    let response = await trySignIn(formData.name, formData.email, formData.password, formData.confirm_password);
    endBlueLineAnim('signin_blueline');
    if (typeof response === 'string') {
        setInfoMessage('signin_info', '#FF8190', 'signin failed');
        setInputErrorMessages('signin_', response);
    }
    else {
        showFlyinfo('fly_info_signin_success');
        setTimeout(() => { location.reload(); }, 1200);
    }
}


function setInfoMessage(divID, color = 'transparent', message = '') {
    setStyle(divID, 'color', color);
    setInnerHTML(divID, message);
}


function startBlueLineAnim(lineID) {
    addClass(lineID, 'blue_line_move');
}


function endBlueLineAnim(lineID) {
    removeClass(lineID, 'blue_line_move');
}


function showFlyinfo(infoID = '') {
    let nextFlyMS = 0;
    if (current_flyID != '') {
        setStyle(current_flyID, 'transform', 'translateX(200vw)');
        nextFlyMS = 200;
        current_flyID = '';
    } else {
        setStyle('login_overlay', 'z-index', '10');
    }
    if (infoID == '') {
        setTimeout(() => {
            setStyle('login_overlay', 'z-index', '-1');
        }, nextFlyMS);
    } else {
        current_flyID = infoID;
        setTimeout(() => {
            setStyle(infoID, 'transform', 'translateX(0)');
        }, nextFlyMS);
    }
}
