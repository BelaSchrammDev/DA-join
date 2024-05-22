const STORAGE_TOKEN = "QRFWKZVNK81DEAU7AMO2GVI5JL8YYYMLU187EAAJ";
const STORAGE_URL = 'https://remote-storage.developerakademie.org/item';
const FB_URL = 'https://da-join-41-default-rtdb.europe-west1.firebasedatabase.app/';


/**
 * stores the current session tasks to the remote storage
 */
async function storeSessionTasksToRemoteStorage() {
    sessionStorage.setItem('sessiontasks', JSON.stringify(sessionTasks));
    if (currentuser.id != 'UXXXXXXX') await setItemFromJson(currentuser.id + 'tasks', sessionTasks);
}


/**
 * stores the current session contacts to the remote storage
 */
async function storeSessionContactsToRemoteStorage() {
    sessionStorage.setItem('sessioncontacts', JSON.stringify(sessionContacts));
    if (currentuser.id != 'UXXXXXXX') await setItemFromJson(currentuser.id + 'contacts', sessionContacts);
}


/**
 * load the tasks from the remote storage into the session tasks
 */
async function loadSessionTasksFromRemoteStorage() {
    let taskString = await getItem(currentuser.id + 'tasks');
    if (taskString) sessionTasks = JSON.parse(taskString);
}


/**
 * load the contacts from the remote storage into the session contacts
 */
async function loadSessionContactsFromRemoteStorage() {
    let contactString = await getItem(currentuser.id + 'contacts');
    if (contactString) sessionContacts = JSON.parse(contactString);
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
 * stored a string to remotestorage
 * 
 * @param {string} key under which the value is stored
 * @param {string} value string that will be stored
 * @returns response from fetch
 */
async function setItem(key, value) {
    const payload = { key, value, token: STORAGE_TOKEN };
    return fetch(STORAGE_URL, { method: 'POST', body: JSON.stringify(payload) })
        .then(res => res.json());
}


/**
 * stored a JSON to remotestorage
 * 
 * @param {string} key under which the value is stored
 * @param {JSON} value JSON that will be stored
 * @returns response from fetch
 */
async function setItemFromJson(key, value) {
    return await setItem(key, JSON.stringify(value));
}


/**
 * get a string from the remotestorage with the key as string
 * returns empty string if key not found
 * 
 * @param {string} key that will be downloaded
 * @returns {string} the value from the storageapi
 */
async function getItem(key) {
    const url = `${STORAGE_URL}?key=${key}&token=${STORAGE_TOKEN}`;
    return fetch(url).then(res => res.json()).then(res => {
        if (res.data) return res.data.value;
        return undefined;
    }).catch(err => { return undefined; });
}


/**
 * get a JSON from the remotestorage with the key as string
 * returns empty JSON if key not found
 * 
 * @param {string} key that will be downloaded
 * @returns {JSON} the value from the storageapi
 */
async function getItemAsJson(key) {
    let response = await getItem(key);
    if (response) return JSON.parse(response);
    return undefined;
}