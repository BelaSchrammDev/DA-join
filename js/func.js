/**
 * overwrite origin to implement error management
 * @param {string} id 
 * @returns {HTMLElement}
 * 
 */
function getElementById(id) {
    const el = document.getElementById(id);
    if (!el) {
        throw new Error(`Element with id: ${id} not present in the html`);
    }
    return el;
}
