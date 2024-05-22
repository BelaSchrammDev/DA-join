const FB_URL = 'https://da-join-41-default-rtdb.europe-west1.firebasedatabase.app/';
const USER_GUEST_ID = 'UXXXXXXX';


/**
 * stores the current session tasks to the remote storage
 */
async function storeSessionTasksToRemoteStorage() {
    sessionStorage.setItem('sessiontasks', JSON.stringify(sessionTasks));
    if (currentuser.id != USER_GUEST_ID) await saveItemToFirebase(currentuser.id + 'tasks', sessionTasks);
}


/**
 * stores the current session contacts to the remote storage
 */
async function storeSessionContactsToRemoteStorage() {
    sessionStorage.setItem('sessioncontacts', JSON.stringify(sessionContacts));
    if (currentuser.id != USER_GUEST_ID) await saveItemToFirebase(currentuser.id + 'contacts', sessionContacts);
}


/**
 * load the tasks from the remote storage into the session tasks
 */
async function loadSessionTasksFromRemoteStorage() {
    let loadedTasks = await loadItemFromFirebase(currentuser.id + 'tasks');
    if (loadedTasks) sessionTasks = loadedTasks;
}


/**
 * load the contacts from the remote storage into the session contacts
 */
async function loadSessionContactsFromRemoteStorage() {
    let loadedContacts = await loadItemFromFirebase(currentuser.id + 'contacts');
    if (loadedContacts) sessionContacts = loadedContacts;
}


/**
 * load the tasks and the contacts from the session storage
 */
async function loadSessionDataFromSessionStorage() {
    let tasksString = await sessionStorage.getItem('sessiontasks');
    if (tasksString) sessionTasks = JSON.parse(tasksString);
    let contactsString = await sessionStorage.getItem('sessioncontacts');
    if (contactsString) sessionContacts = JSON.parse(contactsString);
}


/**
 * Loads an item from Firebase at the specified path.
 * @param {string} path - The path to the item in Firebase.
 * @returns {Promise<any>} - A promise that resolves to the item data.
 */
async function loadItemFromFirebase(path = '') {
    const response = await fetch(`${FB_URL}${path}.json`);
    return await response.json();
}


/**
 * Saves an item to Firebase at the specified path.
 * @param {string} path - The path where the item should be saved.
 * @param {any} data - The data to be saved.
 * @returns {Promise<void>} A promise that resolves when the item is successfully saved.
 */
async function saveItemToFirebase(path = '', data) {
    const response = await fetch(`${FB_URL}${path}.json`, {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(data)
    });
}


