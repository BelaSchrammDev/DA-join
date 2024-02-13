async function initContactsSite(){
    await initJoin();
    // renderfunctions
}


function contactActive() {
    let container = document.getElementById('contact1');
    container.classList.add('contact-data-container-active');
    container.classList.remove('contact-data-container');
}


function showAddToContactWindow() {
    let background = document.getElementById('addEditContactContainer');
    background.innerHTML = `
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
                        <input placeholder="Name" class="input-class name-input" type="text" required>
                        <input placeholder="Email" class="input-class email-input" type="email" required>
                        <input placeholder="Phone" class="input-class phone-input" type="tel" required>
                    </div>
                    <div class="button-container">
                        <button type="button" class="cancel-button">
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


function showEditWindow() {
    let background = document.getElementById('addEditContactContainer');
    background.innerHTML = `
        <div onclick="event.stopPropagation()" id="addEditContact" class="add-edit-contact">
            <div class="add-edit-contact-left">
                <img src="./img/logo/join-small.png" alt="join-logo">
                <h2>Edit contact</h2> 
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
                <form onsubmit="editContact(); return false;">
                    <div class="input-container">
                        <input placeholder="Name" class="input-class name-input" type="text" required>
                        <input placeholder="Email" class="input-class email-input" type="email" required>
                        <input placeholder="Phone" class="input-class phone-input" type="tel" required>
                    </div>
                    <div class="button-container">
                        <button type="button" class="cancel-button">
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
        window.style.transform = 'translateX(200%)';
    }, 0);
    setTimeout(() => {
        background.classList.remove('add-edit-contact-container');
    }, 500);
    setTimeout(() => {
        background.classList.add('hide');
    }, 700);
}

