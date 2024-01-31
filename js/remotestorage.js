const STORAGE_TOKEN = "QRFWKZVNK81DEAU7AMO2GVI5JL8YYYMLU187EAAJ";
const STORAGE_URL = 'https://remote-storage.developerakademie.org/item';


async function setItem(key, value) {
    const payload = { key, value, token: STORAGE_TOKEN };
    return fetch(STORAGE_URL, { method: 'POST', body: JSON.stringify(payload) })
        .then(res => res.json());
}


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