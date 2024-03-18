function addToContactWindowHtml() {
    return /*html*/`
    <div onclick="event.stopPropagation()" id="addEditContact" class="add-edit-contact">
        <div class="add-edit-contact-left">
            <div onclick="closeAddEditWindow()" class="close-mobile">
                <img src="./img/icons/contacts/cancel-white.svg" alt="exit">
            </div>
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
                    <input id="phoneCreate" placeholder="Phone (12 Digits)" class="input-class phone-input" type="tel" pattern="[0-9]{12}" minlength="12" maxlength="12" required>
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
}


function editWindowHtml(contactData, number) {
    return /*html*/`
    <div onclick="event.stopPropagation()" id="addEditContact" class="add-edit-contact">
        <div class="add-edit-contact-left">
            <div onclick="closeAddEditWindow()" class="close-mobile">
                <img src="./img/icons/contacts/cancel-white.svg" alt="exit">
            </div>
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
                    <input id="phoneEdit" placeholder="Phone (12 Digits)" class="input-class phone-input" type="tel" pattern="[0-9]{12}" minlength="12" maxlength="12" required>
                </div>
                <div class="button-container">
                    <button type="button" class="cancel-button-mobile" onclick="deleteContactProof(${number})">
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
}


function deleteContactHtml(number) {
    return /*html*/`
    <div onclick="event.stopPropagation()" id="deleteContactProof" class="delete-contact-proof-window">
        <div class="delete-question-container">
            <span class="delete-question">Are you sure you want to delete this contact permanently?</span>
        </div>
        <div class="delete-button-container">   
            <button type="button" class="cancel-button-mobile cancel-delete" onclick="closeDeleteProofWindow()">
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
}


function userEntryHtml(user, number) {
    return /*html*/`
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
                        <img src="./img/icons/contacts/pen-black.svg" alt="edit">
                        <span>Edit</span>
                    </div>
                    <div onclick="deleteContactProof(${number})" class="delete-contact">
                        <img src="./img/icons/contacts/trash-black.svg" alt="trash">
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
            <div onclick="showEditWindow(${number})" class="mobile-menu-nav-button mobile-menu-nav-button-edit">
                <img src="../img/icons/contacts/pen-black.svg" alt="black-pen">
                <span>Edit</span>
            </div>
            <div onclick="deleteContactProof(${number})" class="mobile-menu-nav-button mobile-menu-nav-button-delete">
                <img src="../img/icons/contacts/trash-black.svg" alt="black-trash">
                <span>Delete</span>
            </div>
        </div>
    </div>
    `;
}


function contactSeperatorHtml(userLetter) {
    return /*html*/`
    <h3 class="contact-letter">${userLetter}</h3>
    <div class="contact-seperator"></div>
`;
}


function contactHtml(user, contact) {
    return /*html*/`
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