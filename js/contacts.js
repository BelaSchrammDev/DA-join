const USER_STARTING_LETTER = [];


async function initContactsSite() {
    await initJoin();
    renderContacts();
    // renderfunctions
}


function contactActive() {
    let container = document.getElementById('contact1');
    container.classList.add('contact-data-container-active');
    container.classList.remove('contact-data-container');
}


function showAddToContactWindow() {
    let background = document.getElementById('addEditContactContainer');
    background.innerHTML = /*html*/`
        <div onclick="event.stopPropagation()" id="addEditContact" class="add-edit-contact">
            <div class="add-edit-contact-left">
                <img src="./img/logo/join-small.png" alt="join-logo">
                <h2>Add contact</h2>
                <span>Tasks are better with a team!</span>
                <div></div>
            </div>
            <div class="add-edit-contact-middle">
                <div>
                    <img src="./img/icons/contacts/profile.svg" alt="user">
                </div>
            </div>
            <div class="add-edit-contact-right">
                <div onclick="closeAddEditWindow()">
                    <img src="./img/icons/contacts/cancel.svg" alt="exit">
                </div>
                <form onsubmit="createContact(); return false;">
                    <div class="input-container">
                        <input id="nameCreate" placeholder="Name" class="input-class name-input" type="text" required>
                        <input id="emailCreate" placeholder="Email" class="input-class email-input" type="email" required>
                        <input id="phoneCreate" placeholder="Phone" class="input-class phone-input" type="tel" minlength="12" maxlength="12" required>
                    </div>
                    <div class="button-container">
                        <button onclick="closeAddEditWindow()" type="button" class="cancel-button">
                            <span>Cancel</span>
                            <img src="./img/icons/contacts/cancel.svg" alt="cancel">
                        </button>
                        <button type="submit" class="create-button">
                            <span>Create Contact</span>
                            <img src="./img/icons/contacts/check-white.svg" alt="check">
                        </button>
                    </div>
                </form>
            </div>
        </div>
    `;
    let window = document.getElementById('addEditContact');
    background.classList.remove('hide');
    setTimeout(() => {
        background.classList.add('add-edit-contact-container');
    }, 0);
    setTimeout(() => {
        window.style.transform = 'translateX(0)';
    }, 50);
}


function showEditWindow(number) {
    let contactData = sessionContacts[number];
    let background = document.getElementById('addEditContactContainer');
    background.innerHTML = /*html*/`
        <div onclick="event.stopPropagation()" id="addEditContact" class="add-edit-contact">
            <div class="add-edit-contact-left">
                <img src="./img/logo/join-small.png" alt="join-logo">
                <h2>Edit contact</h2> 
                <div></div>
            </div>
            <div class="add-edit-contact-middle">
                <div class="contact-bg-large"  style="background-color: ${contactData.color}">
                    <span class="contact-short-large">${contactData.initial}</span>
                </div>
            </div>
            <div class="add-edit-contact-right">
                <div onclick="closeAddEditWindow()">
                    <img src="./img/icons/contacts/cancel.svg" alt="exit">
                </div>
                <form onsubmit="editContact(${number}); return false;">
                    <div class="input-container">
                        <input id="nameEdit" placeholder="Name" class="input-class name-input" type="text" required>
                        <input id="emailEdit" placeholder="Email" class="input-class email-input" type="email" required>
                        <input id="phoneEdit" placeholder="Phone" class="input-class phone-input" type="tel" minlength="12" maxlength="12" required>
                    </div>
                    <div class="button-container">
                        <button type="button" class="cancel-button" onclick="deleteContactProof(${number})">
                            <span>Delete</span>
                        </button>
                        <button type="submit" class="create-button">
                            <span>Save</span>
                            <img src="./img/icons/contacts/check-white.svg" alt="check">
                        </button>
                    </div>
                </form>
            </div>
        </div>
    `;
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


function deleteContactProof(number) {
    let background = document.getElementById('deleteProofWindow');
    background.innerHTML = /*html*/`
        <div onclick="event.stopPropagation()" id="deleteContactProof" class="delete-contact-proof-window">
            <div class="delete-question-container">
                <span class="delete-question">Are you sure you want to delete this contact permanently?</span>
            </div>
            <div class="delete-button-container">   
                <button type="button" class="cancel-button cancel-delete" onclick="closeDeleteProofWindow()">
                    <span>Cancel</span>
                    <img src="./img/icons/contacts/cancel.svg" alt="cancel">
                </button>
                <button type="button" class="create-button yes-delete" onclick="deleteContact(${number})">
                    <span>Yes</span>
                    <img src="./img/icons/contacts/check-white.svg" alt="check">
                </button>
            </div>
        </div>
    `;
    let window = document.getElementById('deleteContactProof');
    background.classList.remove('hide');
    setTimeout(() => {
        background.classList.add('add-edit-contact-container');
    }, 0);
    setTimeout(() => {
        window.style.transform = 'translateX(0)';
    }, 50);
}


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


async function showUserEntry(number) {
    resetContactButton(number);
    let container = document.getElementById('showUserEntry');
    let contact = document.getElementById(`contact${number}`);
    let user = sessionContacts[number];
    contact.classList.add('contact-data-container-active');
    contact.classList.remove('contact-data-container');
    if (window.innerWidth > 1080) {
        container.innerHTML = /*html*/`
            <div id="userEntry" class="user-entry">
                <div class="show-contact-large-container">
                    <div class="contact-bg-large"  style="background-color: ${user.color}">
                        <span class="contact-short-large">${user.initial}</span>
                    </div>
                    <div>
                        <span class="contact-name-large">${user.name}</span>
                        <div class="edit-delete-contact">
                            <div onclick="showEditWindow(${number})" class="edit-contact">
                                <img src="./img/icons/contacts/pen-black.svg" alt="">
                                <span>Edit</span>
                            </div>
                            <div onclick="deleteContactProof(${number})" class="delete-contact">
                                <img src="./img/icons/contacts/trash-black.svg" alt="">
                                <span>Delete</span>
                            </div>
                        </div>
                    </div>
                </div>
                <div class="info-headline">
                    <span>Contact Information</span>
                </div>
                <div class="info-entry-container">
                    <span class="bold">Email</span>
                    <span class="contact-email">${user.email}</span>
                    <span class="bold">Phone</span>
                    <span>${user.phone.replace(/(\d{2})(\d{4})(\d{3})(\d{2})(\d{1})/, `+$1 $2 $3 $4 $5`)}</span>
                </div>
            </div>
            `;
        contact.onclick = null;
        setTimeout(() => {
            document.getElementById('userEntry').style.transform = 'translateX(0)';
        }, 0);
    }
    if (window.innerWidth <= 1080) {
        let contactSection = document.getElementById('contactSection');
        let showContactSection = document.getElementById('showContactSection');
        contactSection.style.display = 'none';
        showContactSection.style.display = 'flex';
        container.innerHTML = /*html*/`
            <img onclick="closeMobileUserEntry()" class="mobile-back-arrow" src="../img/icons/contacts/back-arrow.svg" alt="back-arrow">
            <div id="userEntry" class="user-entry">
                <div class="show-contact-large-container">
                    <div class="contact-bg-large"  style="background-color: ${user.color}">
                        <span class="contact-short-large">${user.initial}</span>
                    </div>
                    <div>
                        <span class="contact-name-large">${user.name}</span>
                        <div class="edit-delete-contact">
                            <div onclick="showEditWindow(${number})" class="edit-contact">
                                <img src="./img/icons/contacts/pen-black.svg" alt="">
                                <span>Edit</span>
                            </div>
                            <div onclick="deleteContactProof(${number})" class="delete-contact">
                                <img src="./img/icons/contacts/trash-black.svg" alt="">
                                <span>Delete</span>
                            </div>
                        </div>
                    </div>
                </div>
                <div class="info-headline">
                    <span>Contact Information</span>
                </div>
                <div class="info-entry-container">
                    <span class="bold">Email</span>
                    <span class="contact-email">${user.email}</span>
                    <span class="bold">Phone</span>
                    <span>${user.phone.replace(/(\d{2})(\d{4})(\d{3})(\d{2})(\d{1})/, `+$1 $2 $3 $4 $5`)}</span>
                </div>
            </div>
            <div onclick="openMobileMenu(); event.stopPropagation();" class="mobile-menu-button-bg">
                <img class="mobile-menu-button" src="../img/icons/contacts/mobile-menu.svg" alt="mobile-menu">
            </div>
            <div onclick="event.stopPropagation()" id="mobileMenu" class="mobile-menu-bg">
                <div>
                    <div class="mobile-menu-nav-button mobile-menu-nav-button-edit">
                        <img src="../img/icons/contacts/pen-black.svg" alt="black-pen">
                        <span>Edit</span>
                    </div>
                    <div class="mobile-menu-nav-button mobile-menu-nav-button-delete">
                        <img src="../img/icons/contacts/trash-black.svg" alt="black-trash">
                        <span>Delete</span>
                    </div>
                </div>
            </div>
            `;
    }
}


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


function closeMobileUserEntry() {
    let contactSection = document.getElementById('contactSection');
    let showContactSection = document.getElementById('showContactSection');
    contactSection.style.display = 'flex';
    showContactSection.style.display = 'none';
    resetContactButtonMobile();
}


function resetContactButtonMobile() {
    for (let index = 0; index < sessionContacts.length; index++) {
        let contact = document.getElementById(`contact${index}`);
        contact.classList.remove('contact-data-container-active');
        contact.classList.add('contact-data-container');
        contact.onclick = () => { showUserEntry(index); };
    }
}


function openMobileMenu() {
    document.getElementById('mobileMenu').classList.add('mobile-menu-active');
}


function closeMobileMenu() {
    document.getElementById('mobileMenu').classList.remove('mobile-menu-active');
}


async function renderContacts() {
    USER_STARTING_LETTER.length = 0;
    await saveUserStartingLetters();
    let container = document.getElementById('contactsContainer');
    container.innerHTML = '';
    for (let letter = 0; letter < USER_STARTING_LETTER.length; letter++) {
        let userLetter = USER_STARTING_LETTER[letter];
        container.innerHTML += /*html*/`
            <h3 class="contact-letter">${userLetter}</h3>
            <div class="contact-seperator"></div>
        `;
        for (let user = 0; user < sessionContacts.length; user++) {
            let contact = sessionContacts[user];
            let firstLetter = contact.name.charAt(0).toUpperCase();
            if (userLetter == firstLetter) {
                container.innerHTML += /*html*/`
                    <div onclick="showUserEntry(${user})" id="contact${user}" class="contact-data-container">
                        <div class="contact-bg" style="background-color: ${contact.color}">
                            <span class="contact-short">${contact.initial}</span>
                        </div>
                        <div class="contact-name-email-container">
                            <span class="contact-name">${contact.name}</span>
                            <span class="contact-email">${contact.email}</span>
                        </div>
                    </div>
                `;
            }
        }
    }
}


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


async function createContact() {
    let nameInput = document.getElementById('nameCreate').value;
    let name = nameInput.split(' ').map((name) => { return name[0].toUpperCase() + name.substring(1) }).join(' ');
    let initial = nameInput.split(' ').map((item) => { return item[0].toUpperCase() }).join('');
    let email = document.getElementById('emailCreate').value;
    let phone = document.getElementById('phoneCreate').value;
    let contactData = {
        id: `C${getId()}`,
        name: name,
        initial: initial,
        email: email,
        color: hexColors[randomColor()],
        phone: phone.toString()
    }
    sessionContacts.push(contactData);
    await renderContacts();
    showUserEntry(sessionContacts.length - 1);
    setTimeout(() => {
        document.getElementById('createdMsg').style.transform = 'translateX(0)';
    }, 300);
    setTimeout(() => {
        document.getElementById('createdMsg').style.transform = 'translateX(1000%)';
    }, 3500);
    // insert by bela, only stored to sessionstorage
    await storeSessionContactsToRemoteStorage();
    // ----------------------------------------------
    closeAddEditWindow();
}


function getId() {
    let date = new Date();
    let time = date.getTime().toString();
    return time.slice(-3);
}


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
    // insert by bela, only stored to sessionstorage
    await storeSessionContactsToRemoteStorage();
    // ----------------------------------------------
    closeAddEditWindow();
}


async function deleteContact(number) {
    sessionContacts.splice(number, 1);
    document.getElementById('showUserEntry').innerHTML = '';
    renderContacts();
    // insert by bela, only stored to sessionstorage
    await storeSessionContactsToRemoteStorage();
    // ----------------------------------------------
    closeDeleteProofWindow();
    closeAddEditWindow();
}
