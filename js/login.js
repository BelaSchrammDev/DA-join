const userGuest = {
    id: USER_GUEST_ID,
    name: 'Guest',
    initial: 'G',
    email: 'guest@gmail.com',
    color: '#0038FF',
    phone: '',
}

let current_flyID = '';


/**
 * Attempts to log in a user with the provided email and password.
 * 
 * @param {string} loginEmail - The email of the user trying to log in.
 * @param {string} loginPassword - The password of the user trying to log in.
 * @returns {Promise<string|object>} - A promise that resolves to either a string representing an error code or an object representing the logged-in user.
 */
async function tryLogin(loginEmail, loginPassword) {
    const users = await getItemAsJson('users');
    if (!users) return 'remote#userarray';
    const user = users.find(u => u.email == loginEmail);
    if (!user) return 'email#unknow';
    if (user.password != loginPassword) return 'password#wrong';
    return user;
}


/**
 * Tries to sign in a user with the provided information.
 * 
 * @param {string} signinName - The name of the user.
 * @param {string} signinEmail - The email of the user.
 * @param {string} signinPassword - The password of the user.
 * @param {string} signinPasswordConfirm - The confirmation password of the user.
 * @returns {Promise<string|object>} - A promise that resolves to a string or an object.
 *    - If the sign-in is successful, it returns the newly created user object.
 *    - If the sign-in fails, it returns a string indicating the reason for the failure.
 */
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


/**
 * Logs in the user and load tasks and contacts from the remotestorage,
 * then save it to the sessionstorage to use it on other pages.
 * if no tasks or contacts found, use the defaultdata.
 * then redirect to the summary page.
 * 
 * @param {Object} user - The user object containing login data.
 * @returns {Promise<void>} - A promise that resolves when the login process is complete.
 */
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


/**
 * Toggles the visibility of a password input field.
 * 
 * @param {string} inputID - The ID of the password input field.
 */
function togglePasswortVisibility(inputID) {
    const passwordInput = document.getElementById(inputID);
    if (passwordInput.type == 'password') passwordInput.type = 'text';
    else passwordInput.type = 'password';
}


/**
 * Logs in the user as a guest.
 * Sets the current user, session tasks, and session contacts in the session storage.
 * Redirects the user to the summary page.
 * 
 * @returns {void}
 */
async function loginAsGuest() {
    sessionStorage.setItem('currentuser', JSON.stringify(userGuest));
    sessionStorage.setItem('sessiontasks', JSON.stringify(defaultTasks));
    sessionStorage.setItem('sessioncontacts', JSON.stringify(defaultContacts));
    window.location.href = './summary.html';
}


/**
 * Clears all error messages from the specified inputs.
 * 
 * @param {string} formID - The ID of the form element.
 * @param {string[]} inputs - An array of input IDs.
 */
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
    setStyle(formID + 'error', 'display', 'none');
}


/**
 * Sets error messages on input fields based on the provided form ID and error message.
 *
 * @param {string} formID - The ID of the form element.
 * @param {string} errorMessage - The error message in the format "errorField#errorType".
 */
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


/**
 * Submits the login form.
 * 
 * @param {Event} event - The event object representing the form submission.
 * @returns {Promise<void>} - A promise that resolves when the login process is complete.
 */
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


/**
 * Submits the sign-in form.
 * 
 * @param {Event} event - The event object representing the form submission.
 * @returns {Promise<void>} - A promise that resolves when the sign-in process is complete.
 */
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


/**
 * Shows or hides a load animation.
 *
 * @param {string} svgID - The ID of the SVG element.
 * @param {boolean} show - Whether to show or hide the load animation.
 */
function showLoadAnimation(svgID, show) {
    lockBody(show);
    setStyle(svgID, 'display', show ? 'flex' : 'none');
}


/**
 * Locks or unlocks the body element by adjusting the z-index of the login overlay.
 * 
 * @param {boolean} lock - Indicates whether to lock or unlock the body element. Default is true.
 */
function lockBody(lock = true) {
    setStyle('login_overlay', 'z-index', lock ? '10' : '-1');
}


/**
 * Displays fly information by setting the transform property of the specified element to 'translateX(0)'.
 * 
 * @param {string} infoID - The ID of the element to show fly information for.
 */
function showFlyinfo(infoID = '') {
    lockBody();
    setStyle(infoID, 'transform', 'translateX(0)');
}


/**
 * Shows or hides the sign-in mask.
 * 
 * @param {boolean} [show=true] - Indicates whether to show or hide the sign-in mask. Default is true.
 */
function showSignInMask(show = true) {
    setStyle('signin_button', 'display', show ? 'none' : 'flex');
    setStyle('login_form', 'display', show ? 'none' : 'flex');
    setStyle('signin_form', 'display', show ? 'flex' : 'none');
}