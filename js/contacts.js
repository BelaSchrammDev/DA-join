const USER_STARTING_LETTER = [];
let entryNumber = undefined;


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
        let contactSection = document.getElementById('contactSection');
        let showContactSection = document.getElementById('showContactSection');
        contactSection.style.display = 'none';
        showContactSection.style.display = 'flex';
    }
}


window.addEventListener("resize", showLargeContactsView);

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
    const mobileMenu = getElement('mobileMenu');
    if (mobileMenu) addClass(mobileMenu, 'mobile-menu-active');
}


function closeMobileMenu() {
    const mobileMenu = getElement('mobileMenu');
    if (mobileMenu) removeClass(mobileMenu, 'mobile-menu-active');
}


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
        id: `${createUniqueID('C')}`,
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
        if (window.innerWidth > 1080) {
            document.getElementById('createdMsg').style.transform = 'translateX(0)';
        }
        document.getElementById('createdMsg').style.transform = 'translateY(0)';
    }, 300);
    setTimeout(() => {
        if (window.innerWidth > 1080) {
            document.getElementById('createdMsg').style.transform = 'translateX(1000%)';
        }
        document.getElementById('createdMsg').style.transform = 'translateY(1000%)';
    }, 2000);
    await storeSessionContactsToRemoteStorage();
    closeAddEditWindow();
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
    await storeSessionContactsToRemoteStorage();
    closeAddEditWindow();
}


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
