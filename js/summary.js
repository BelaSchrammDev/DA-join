let mobileIntro = true;
let sortedTasks = [];

async function initSummarySite() {
    await initJoin();
    loadIntroSeen();
    mobileWelcomeMsg();
    getAmounts();
    getUserName();
    changeClassesOnWidth();
    // other render functions...
}


function getAmounts() {
    getToDoAmount();
    getDoneAmount();
    getUrgentAmount();
    nextDeadline();
    getTaskAmount();
    getInProgressAmount();
    getFeedbackAmount();
}

function saveIntroSeen() {
    let introSeen = JSON.stringify(mobileIntro);
    sessionStorage.setItem('intro', introSeen);
}

function loadIntroSeen() {
    let introSeen = sessionStorage.getItem('intro');
    if (introSeen) {
        mobileIntro = JSON.parse(introSeen);
    }
}


function getToDoAmount() {
    let card = document.getElementById('toDoAmount');
    let amount = sessionTasks.filter(sessionTasks => sessionTasks.status === 'todo').length;
    card.innerHTML = amount;
}


function getDoneAmount() {
    let card = document.getElementById('doneAmount');
    let amount = sessionTasks.filter(sessionTasks => sessionTasks.status === 'done').length;
    card.innerHTML = amount;
}


function getUrgentAmount() {
    let card = document.getElementById('urgentAmount');
    let amount = sessionTasks.filter(sessionTasks => sessionTasks.priority === 'urgent' && sessionTasks.status != 'done').length;
    card.innerHTML = amount;
}


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
    if (sortedTasks.length) {
        sortedTasks.sort(function (a, b) {
            let oldest = new Date(a.date)
            let latest = new Date(b.date)
            return oldest - latest;
        });
        let date = new Date(sortedTasks[0].date).toLocaleString('en-us',{month:'long', day:'numeric', year:'numeric'});
        console.log(date);
        card.innerHTML = date;
    }
}


function getTaskAmount() {
    let card = document.getElementById('taskAmount');
    let amount = sessionTasks.length;
    card.innerHTML = amount;
}


function getInProgressAmount() {
    let card = document.getElementById('inProgressAmount');
    let amount = sessionTasks.filter(sessionTasks => sessionTasks.status === 'inprogress').length;
    card.innerHTML = amount;
}


function getFeedbackAmount() {
    let card = document.getElementById('feedbackAmount');
    let amount = sessionTasks.filter(sessionTasks => sessionTasks.status === 'awaitfeedback').length;
    card.innerHTML = amount;
}


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

function changeClassesOnWidth() {
    let right = document.getElementById('toTheRight');
    let left = document.getElementById('toTheLeft');
    let bottom = document.getElementById('toTheBottom');
    let middel = document.getElementById('toTheMiddel');
    let rightSmall = document.getElementById('toTheRightSmall');
    let leftSmall = document.getElementById('toTheLeftSmall');
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