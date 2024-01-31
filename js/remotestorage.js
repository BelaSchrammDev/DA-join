const STORAGE_TOKEN = "QRFWKZVNK81DEAU7AMO2GVI5JL8YYYMLU187EAAJ";
const STORAGE_URL = 'https://remote-storage.developerakademie.org/item';


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
        return "";
    });
}


/**
 * get a JSON from the remotestorage with the key as string
 * returns empty JSON if key not found
 * 
 * @param {string} key that will be downloaded
 * @returns {JSON} the value from the storageapi
 */
async function getItemAsJson(key) {
    return JSON.parse(await getItem(key));
}