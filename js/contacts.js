const USER_STARTING_LETTER = [];
let entryNumber = undefined;


/**
 * Initializes the contacts site by performing necessary setup tasks asynchronously.
 * @async
 * @function initContactsSite
 * @returns {Promise<void>} A Promise that resolves when the initialization is complete.
 */
async function initContactsSite() {
    await initJoin();
    renderContacts();
}


/**
 * Activates the contact data container by adding a CSS class to make it visually active.
 * @function
 * @name contactActive
 * @returns {void}
 */
function contactActive() {
    let container = document.getElementById('contact1');
    container.classList.add('contact-data-container-active');
    container.classList.remove('contact-data-container');
}


/**
 * Displays the add/edit contact window on the webpage.
 */
function showAddToContactWindow() {
    let background = document.getElementById('addEditContactContainer');
    background.innerHTML = addToContactWindowHtml();
    let window = document.getElementById('addEditContact');
    background.classList.remove('hide');
    setTimeout(() => {
        background.classList.add('add-edit-contact-container');
    }, 0);
    setTimeout(() => {
        window.style.transform = 'translateX(0)';
    }, 50);
}


/**
 * Displays the edit window for a contact.
 * @param {number} number - The index of the contact in the sessionContacts array.
 */
function showEditWindow(number) {
    let contactData = sessionContacts[number];
    let background = document.getElementById('addEditContactContainer');
    background.innerHTML = editWindowHtml(contactData, number);
    document.getElementById('nameEdit').value = contactData.name;
    document.getElementById('emailEdit').value = contactData.email;
    document.getElementById('phoneEdit').value = contactData.phone;
    let window = document.getElementById('addEditContact');
    background.classList.remove('hide');
    setTimeout(() => {
        background.classList.add('add-edit-contact-container');
    }, 0);
    setTimeout(() => {
        window.style.transform = 'translateX(0)';
    }, 50);
}


/**
 * Closes the add/edit window for a contact.
 */
function closeAddEditWindow() {
    let background = document.getElementById('addEditContactContainer');
    let window = document.getElementById('addEditContact');
    setTimeout(() => {
        window.style.transform = 'translateX(1000%)';
    }, 0);
    setTimeout(() => {
        background.classList.remove('add-edit-contact-container');
    }, 500);
    setTimeout(() => {
        background.classList.add('hide');
    }, 700);
}


/**
 * Deletes a contact proof by updating the UI.
 * @param {number} number - The contact proof number to delete.
 */
function deleteContactProof(number) {
    let background = document.getElementById('deleteProofWindow');
    background.innerHTML = deleteContactHtml(number);
    let window = document.getElementById('deleteContactProof');
    background.classList.remove('hide');
    setTimeout(() => {
        background.classList.add('add-edit-contact-container');
    }, 0);
    setTimeout(() => {
        window.style.transform = 'translateX(0)';
    }, 50);
}


/**
 * Closes the delete proof window with animations.
 */
function closeDeleteProofWindow() {
    let background = document.getElementById('deleteProofWindow');
    let window = document.getElementById('deleteContactProof');
    setTimeout(() => {
        window.style.transform = 'translateX(1000%)';
    }, 0);
    setTimeout(() => {
        background.classList.remove('add-edit-contact-container');
    }, 500);
    setTimeout(() => {
        background.classList.add('hide');
    }, 700);
}


/**
 * Displays the user entry corresponding to the given number.
 * @async
 * @param {number} number - The number representing the user entry.
 * @returns {Promise<void>} - A promise that resolves when the user entry is displayed.
 */
async function showUserEntry(number) {
    entryNumber = number;
    resetContactButton(number);
    let container = document.getElementById('showUserEntry');
    let contact = document.getElementById(`contact${number}`);
    let user = sessionContacts[number];
    contact.classList.add('contact-data-container-active');
    contact.classList.remove('contact-data-container');
    container.innerHTML = userEntryHtml(user, number);
    contact.onclick = null;
    setTimeout(() => {
        document.getElementById('userEntry').style.transform = 'translateX(0)';
    }, 0);
    if (window.innerWidth <= 1080) {
        turnOnMobileContacts();
    }
}


function turnOnMobileContacts() {
    let contactSection = document.getElementById('contactSection');
        let showContactSection = document.getElementById('showContactSection');
        contactSection.style.display = 'none';
        showContactSection.style.display = 'flex';
}


window.addEventListener("resize", showLargeContactsView);


/**
 * Event listener for resizing the window to show large contacts view.
 * @returns {void}
 */
function showLargeContactsView() {
    let contactSection = document.getElementById('contactSection');
    let showContactSection = document.getElementById('showContactSection');
    let contact = document.getElementById(`contact${entryNumber}`);
    if (window.innerWidth > 1080) {
        contactSection.style.display = 'flex';
        showContactSection.style.display = 'flex';
        if (contact) {
            contact.classList.add('contact-data-container-active');
            contact.classList.remove('contact-data-container');
            closeMobileMenu();
        }
    }
    if (window.innerWidth <= 1080) {
        closeMobileUserEntry();
    }
}


/**
 * Resets the styling and event listeners of contact buttons except for the one specified.
 * @param {number} number - The index of the contact button to exclude from reset.
 */
function resetContactButton(number) {
    for (let index = 0; index < sessionContacts.length; index++) {
        let contact = document.getElementById(`contact${index}`);
        if (number != index) {
            contact.classList.remove('contact-data-container-active');
            contact.classList.add('contact-data-container');
            contact.onclick = () => { showUserEntry(index); };
        }
    }
}


/**
 * Closes the mobile user entry section and resets contact buttons styling and event listeners.
 */
function closeMobileUserEntry() {
    let contactSection = document.getElementById('contactSection');
    let showContactSection = document.getElementById('showContactSection');
    contactSection.style.display = 'flex';
    showContactSection.style.display = 'none';
    resetContactButtonMobile();
}


/**
 * Resets the appearance and functionality of contact buttons on mobile devices.
 * Removes active class from contact data containers and adds a click event listener
 * to each contact button to show user entry.
 */
function resetContactButtonMobile() {
    for (let index = 0; index < sessionContacts.length; index++) {
        let contact = document.getElementById(`contact${index}`);
        contact.classList.remove('contact-data-container-active');
        contact.classList.add('contact-data-container');
        contact.onclick = () => { showUserEntry(index); };
    }
}


/**
 * Opens the mobile menu by adding 'mobile-menu-active' class to the mobile menu element.
 */
function openMobileMenu() {
    const mobileMenu = getElement('mobileMenu');
    if (mobileMenu) addClass(mobileMenu, 'mobile-menu-active');
}


/**
 * Closes the mobile menu by removing 'mobile-menu-active' class from the mobile menu element.
 */
function closeMobileMenu() {
    const mobileMenu = getElement('mobileMenu');
    if (mobileMenu) removeClass(mobileMenu, 'mobile-menu-active');
}


/**
 * Renders contacts based on the starting letters of their names.
 * Clears the container, populates it with HTML representing contacts grouped by starting letter,
 * and adds an option to add new contacts.
 * @async
 * @function renderContacts
 * @returns {Promise<void>} Promise object representing the completion of rendering contacts.
 */
async function renderContacts() {
    USER_STARTING_LETTER.length = 0;
    await saveUserStartingLetters();
    let container = document.getElementById('contactsContainer');
    container.innerHTML = '';
    for (let letter = 0; letter < USER_STARTING_LETTER.length; letter++) {
        let userLetter = USER_STARTING_LETTER[letter];
        container.innerHTML += contactSeperatorHtml(userLetter);
        for (let user = 0; user < sessionContacts.length; user++) {
            let contact = sessionContacts[user];
            let firstLetter = contact.name.charAt(0).toUpperCase();
            if (userLetter == firstLetter) {
                container.innerHTML += contactHtml(user, contact);
            }
        }
    }
    container.innerHTML += contactAddHtml();
}


/**
 * Saves unique starting letters of contact names into the global array USER_STARTING_LETTER.
 * Sorts the array alphabetically.
 * @function saveUserStartingLetters
 */
function saveUserStartingLetters() {
    for (let u = 0; u < sessionContacts.length; u++) {
        let contact = sessionContacts[u].name
        let letter = contact.charAt(0).toUpperCase();
        if (!USER_STARTING_LETTER.includes(letter)) {
            USER_STARTING_LETTER.push(letter);
        }
    }
    USER_STARTING_LETTER.sort();
}


/**
 * Creates a new contact using input values from the DOM elements.
 * @async
 * @function createContact
 * @returns {Promise<void>} A promise that resolves after creating the contact.
 */
async function createContact() {
    let nameInput = document.getElementById('nameCreate').value;
    let name = nameInput.split(' ').map((name) => { return name[0].toUpperCase() + name.substring(1) }).join(' ');
    let initial = nameInput.split(' ').map((item) => { return item[0].toUpperCase() }).join('');
    let email = document.getElementById('emailCreate').value;
    let phone = document.getElementById('phoneCreate').value;
    createContactData(name, initial, email, phone);
    await renderContacts();
    showUserEntry(sessionContacts.length - 1);
    turnOnCreatedMsg();
    turnOffCreatedMsg();
    await storeSessionContactsToRemoteStorage();
    closeAddEditWindow();
}


/**
 * Creates contact data and adds it to the sessionContacts array.
 * @param {string} name - The name of the contact.
 * @param {string} initial - The initial of the contact.
 * @param {string} email - The email of the contact.
 * @param {string|number} phone - The phone number of the contact.
 */
function createContactData(name, initial, email, phone) {
    let contactData = {
        id: `${createUniqueID('C')}`,
        name: name,
        initial: initial,
        email: email,
        color: hexColors[randomColor()],
        phone: phone.toString()
    }
    sessionContacts.push(contactData);
}


/**
 * Turns on the created message by applying a transformation.
 * @function
 */
function turnOnCreatedMsg() {
    setTimeout(() => {
        if (window.innerWidth > 1080) {
            document.getElementById('createdMsg').style.transform = 'translateX(0)';
        } else {
            document.getElementById('createdMsg').style.transform = 'translateY(0)';
        }
    }, 300);
}


/**
 * Turns off the created message by applying a transformation.
 * @function
 */
function turnOffCreatedMsg() {
    setTimeout(() => {
        if (window.innerWidth > 1080) {
            document.getElementById('createdMsg').style.transform = 'translateX(1000%)';
        } else {
            document.getElementById('createdMsg').style.transform = 'translateY(1000%)';
        }
    }, 2000);
}


/**
 * Edits a contact with the provided details.
 * @async
 * @param {number} number - The index of the contact in the sessionContacts array.
 * @returns {Promise<void>} - A Promise that resolves once the operation is complete.
 */
async function editContact(number) {
    let nameInput = document.getElementById('nameEdit').value;
    let name = nameInput.split(' ').map((name) => { return name[0].toUpperCase() + name.substring(1) }).join(' ');
    let initial = nameInput.split(' ').map((item) => { return item[0].toUpperCase() }).join('');
    let email = document.getElementById('emailEdit').value;
    let phone = document.getElementById('phoneEdit').value;
    sessionContacts[number].name = name;
    sessionContacts[number].initial = initial;
    sessionContacts[number].email = email;
    sessionContacts[number].phone = phone;
    showUserEntry(number);
    renderContacts();
    await storeSessionContactsToRemoteStorage();
    closeAddEditWindow();
}


/**
 * Deletes a contact from the sessionContacts array.
 * @async
 * @param {number} number - The index of the contact to be deleted.
 * @returns {Promise<void>} - A Promise that resolves once the operation is complete.
 */
async function deleteContact(number) {
    sessionContacts.splice(number, 1);
    document.getElementById('showUserEntry').innerHTML = '';
    renderContacts();
    await storeSessionContactsToRemoteStorage();
    closeDeleteProofWindow();
    closeAddEditWindow();
    if (window.innerWidth <= 1080) {
        let contactSection = document.getElementById('contactSection');
        let showContactSection = document.getElementById('showContactSection');
        contactSection.style.display = 'flex';
        showContactSection.style.display = 'none';
        document.getElementById('createdMsg').style.transform = 'translateX(1000%)';
    }
}