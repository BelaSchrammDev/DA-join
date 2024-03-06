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
    setStyle(formID + 'info', 'display', 'none');
}


function setInputErrorMessages(formID, errorMessage) {
    const errorField = errorMessage.split('#')[0];
    const errorType = errorMessage.split('#')[1];
    if (errorType == 'userarray') {
        setStyle(formID + 'error', 'display', 'block');
    } else {
        addClass(formID + errorField, 'message');
        addClass(formID + errorField, 'message_' + errorField + '_' + errorType);
    }
}


async function submitLogin(event) {
    clearAllMessagesFromInputs('login_', ['password', 'email']);
    const formData = Object.fromEntries(new FormData(event.target));
    showLoadAnimation('login_loadanim', true);
    let response = await tryLogin(formData.email, formData.password);
    showLoadAnimation('login_loadanim', false);
    if (typeof response === 'string') {
        setInputErrorMessages('login_', response);
    } else {
        showFlyinfo('fly_info_login_success');
        setTimeout(() => { loginUser(response); }, 1200);
    }
}


async function submitSignIn(event) {
    clearAllMessagesFromInputs('signin_', ['name', 'email', 'confirm_password']);
    const formData = Object.fromEntries(new FormData(event.target));
    showLoadAnimation('signin_loadanim', true);
    let response = await trySignIn(formData.name, formData.email, formData.password, formData.confirm_password);
    showLoadAnimation('signin_loadanim', false);
    if (typeof response === 'string') {
        setInputErrorMessages('signin_', response);
    }
    else {
        showFlyinfo('fly_info_signin_success');
        setTimeout(() => { location.reload(); }, 1200);
    }
}


function showLoadAnimation(svgID, show) {
    setStyle(svgID, 'display', show ? 'flex' : 'none');
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


function showSignInMask(show = true) {
    removeClass('login_form', 'login_mask_animation');
    removeClass('signin_button', 'login_mask_animation');
    setStyle('signin_button', 'display', show ? 'none' : 'flex');
    setStyle('login_mask', 'display', show ? 'none' : 'block');
    setStyle('signup_mask', 'display', show ? 'block' : 'none');
}