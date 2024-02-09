async function initContactsSite(){
    await initJoin();
    // renderfunctions
}


function contactActive() {
    let container = document.getElementById('contact1');
    container.classList.add('contact-data-container-active');
    container.classList.remove('contact-data-container');
}


async function showAddToContactWindow() {
    let background = document.getElementById('addEditContactContainer');
    let window = document.getElementById('addEditContact');
    background.classList.remove('hide');
    await setTimeout(() => {
        background.classList.add('add-edit-contact-container');
    }, 50);
    setTimeout(() => {
        window.style.transform = 'translateX(0)';
    }, 50);
    
}