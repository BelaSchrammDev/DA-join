let mobileIntro = true;
let sortedTasks = [];
const LAST_PAGE = document.referrer;


/**
 * Initializes the summary site by executing several asynchronous tasks sequentially.
 * - Initializes the join functionality.
 * - Checks and proves the last page for introduction.
 * - Loads the information about whether the introduction has been seen.
 * - Displays a mobile welcome message if applicable.
 * - Retrieves the amounts data.
 * - Retrieves the user name.
 * - Adjusts classes based on the width of the viewport.
 * 
 * @returns {Promise<void>} A Promise that resolves when all tasks are completed.
 */
async function initSummarySite() {
    await initJoin();
    await proofLastPageForIntro();
    loadIntroSeen();
    mobileWelcomeMsg();
    getAmounts();
    getUserName();
    changeClassesOnWidth();
}


/**
 * Retrieves various amounts related to tasks and deadlines.
 * Calls several functions to calculate and retrieve different counts.
 */
function getAmounts() {
    getToDoAmount();
    getDoneAmount();
    getUrgentAmount();
    nextDeadline();
    getTaskAmount();
    getInProgressAmount();
    getFeedbackAmount();
}


/**
* Checks if the last page visited is one of the specified pages.
* If it is, sets mobileIntro to false.
*/
function proofLastPageForIntro() {
    if (LAST_PAGE === 'https://join-41.developerakademie.net/addtask.html' || LAST_PAGE === 'https://join-41.developerakademie.net/board.html' || LAST_PAGE === 'https://join-41.developerakademie.net/contacts.html' || LAST_PAGE === 'https://join-41.developerakademie.net/privacy_policy.html' || LAST_PAGE === 'https://join-41.developerakademie.net/legal_notice.html') {
        mobileIntro = false;
    }
}


/**
* Saves the mobile intro seen status to the session storage.
* Converts the mobileIntro object to a JSON string.
* @param {object} mobileIntro The mobile intro object containing the seen status.
* @return {void}
*/
function saveIntroSeen() {
    let introSeen = JSON.stringify(mobileIntro);
    sessionStorage.setItem('intro', introSeen);
}


/**
* Loads the intro seen status from the session storage.
*/
function loadIntroSeen() {
    let introSeen = sessionStorage.getItem('intro');
    if (introSeen) {
        mobileIntro = JSON.parse(introSeen);
    }
}


/**
* Gets the amount of to-do tasks and updates the specified card with the amount.
*/
function getToDoAmount() {
    let card = document.getElementById('toDoAmount');
    let amount = sessionTasks.filter(sessionTasks => sessionTasks.status === 'todo').length;
    card.innerHTML = amount;
}


/**
* Updates the 'doneAmount' card with the number of tasks with status 'done'.
*/
function getDoneAmount() {
    let card = document.getElementById('doneAmount');
    let amount = sessionTasks.filter(sessionTasks => sessionTasks.status === 'done').length;
    card.innerHTML = amount;
}


/**
* Updates the 'urgentAmount' card with the number of tasks with priority 'urgent' and status not equal to 'done'.
*/
function getUrgentAmount() {
    let card = document.getElementById('urgentAmount');
    let amount = sessionTasks.filter(sessionTasks => sessionTasks.priority === 'urgent').length;
    card.innerHTML = amount;
}


/**
 * Retrieves and displays the next urgent deadline among session tasks.
 * @async
 * @function nextDeadline
 * @returns {void}
 */
async function nextDeadline() {
    sortedTasks = [];
    let card = document.getElementById('nextDeadline');
    for (let i = 0; i < sessionTasks.length; i++) {
        let priority = sessionTasks[i].priority;
        let status = sessionTasks[i].status;
        if (priority === 'urgent' && status != 'done') {
            sortedTasks.push(sessionTasks[i]);
        }
    }
    sortTasks(card);
}


/**
 * Sorts tasks on a card by their date and updates the card content with the earliest task's date.
 * @param {HTMLElement} card - The HTML element representing the card containing tasks.
 */
function sortTasks(card) {
    if (sortedTasks.length) {
        sortedTasks.sort(function (a, b) {
            let oldest = new Date(a.date)
            let latest = new Date(b.date)
            return oldest - latest;
        });
        let date = new Date(sortedTasks[0].date).toLocaleString('en-us', { month: 'long', day: 'numeric', year: 'numeric' });
        card.innerHTML = date;
    }
}


/**
* Retrieves the task amount and updates the UI element with the result.
*/
function getTaskAmount() {
    let card = document.getElementById('taskAmount');
    let amount = sessionTasks.length;
    card.innerHTML = amount;
}


/**
* Retrieves the amount of tasks in progress and updates the UI element with the result.
*/
function getInProgressAmount() {
    let card = document.getElementById('inProgressAmount');
    let amount = sessionTasks.filter(sessionTasks => sessionTasks.status === 'inprogress').length;
    card.innerHTML = amount;
}


/**
* Retrieves the amount of tasks awaiting feedback and updates the UI element with the result.
*/
function getFeedbackAmount() {
    let card = document.getElementById('feedbackAmount');
    let amount = sessionTasks.filter(sessionTasks => sessionTasks.status === 'awaitfeedback').length;
    card.innerHTML = amount;
}


/**
* Retrieves the user's name and updates the UI element with the result. 
* Also updates the welcome message based on the user's name.
*/
function getUserName() {
    let container = document.getElementById('userName');
    let welcomeMsg = document.getElementById('mobileUserWelcomeMsg');
    let name = currentuser.name;
    container.innerHTML = name;
    if (name == 'Guest') {
        welcomeMsg.innerHTML = 'Good morning!';
        return
    }
    welcomeMsg.innerHTML = /*html*/`
    Good morning,<br>
    <span>${name}</span>
    `;
}


window.addEventListener("resize", changeClassesOnWidth);


/**
* Function to change classes based on window width.
* Gets the elements and changes their classes accordingly.
*/
function changeClassesOnWidth() {
    let right = document.getElementById('toTheRight');
    let left = document.getElementById('toTheLeft');
    let bottom = document.getElementById('toTheBottom');
    let middel = document.getElementById('toTheMiddel');
    let rightSmall = document.getElementById('toTheRightSmall');
    let leftSmall = document.getElementById('toTheLeftSmall');
    turnOnMobileSummary(right, left, bottom, middel, rightSmall, leftSmall);
    turnOnDesktopSummary(right, left, bottom, middel, rightSmall, leftSmall);
}


/**
 * Turns on the desktop summary layout.
 * Applies CSS classes to elements based on window width condition.
 */
function turnOnDesktopSummary(right, left, bottom, middel, rightSmall, leftSmall) {
    if (window.innerWidth > 600) {
        right.classList.add('hover-to-the-right');
        right.classList.remove('active-to-the-right');
        left.classList.add('hover-to-the-left');
        left.classList.remove('active-to-the-left');
        bottom.classList.add('hover-to-the-bottom-right');
        bottom.classList.remove('active-to-the-bottom-right');
        middel.classList.add('hover-to-the-middel');
        middel.classList.remove('active-to-the-middel');
        rightSmall.classList.add('hover-to-the-right-small');
        rightSmall.classList.remove('active-to-the-right-small');
        leftSmall.classList.add('hover-to-the-left-small');
        leftSmall.classList.remove('active-to-the-left-small');
    }
}


/**
 * Turns on the mobile summary layout.
 * Applies CSS classes to elements based on window width condition.
 */
function turnOnMobileSummary(right, left, bottom, middel, rightSmall, leftSmall) {
    if (window.innerWidth < 601) {
        right.classList.remove('hover-to-the-right');
        right.classList.add('active-to-the-right');
        left.classList.remove('hover-to-the-left');
        left.classList.add('active-to-the-left');
        bottom.classList.remove('hover-to-the-bottom-right');
        bottom.classList.add('active-to-the-bottom-right');
        middel.classList.remove('hover-to-the-middel');
        middel.classList.add('active-to-the-middel');
        rightSmall.classList.remove('hover-to-the-right-small');
        rightSmall.classList.add('active-to-the-right-small');
        leftSmall.classList.remove('hover-to-the-left-small');
        leftSmall.classList.add('active-to-the-left-small');
    }
}


/**
* Displays the welcome message for mobile users and handles the hiding logic.
*/
function mobileWelcomeMsg() {
    let welcome = document.getElementById('welcomeContainerMobile');
    let msg = document.querySelector('.welcome-message-mobile');
    if (mobileIntro) {
        if (window.innerWidth < 846) {
            msg.style.display = 'block';
            setTimeout(() => { welcome.style.filter = 'opacity(0)' }, 1500);
            setTimeout(() => { welcome.style.display = 'none' }, 4000);
            mobileIntro = false;
            saveIntroSeen();
        }
    } else {
        welcome.style.display = 'none';
    }
    if (window.innerWidth > 845) {
        welcome.style.display = 'none';
    }
}