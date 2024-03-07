async function initSummarySite(){
    await initJoin();
    getAmounts();
    getUserName();
    changeClassesOnWidth();
    // other render functions...
}


function getAmounts() {
    getToDoAmount();
    getDoneAmount();
    getUrgentAmount();
    getTaskAmount();
    getInProgressAmount();
    getFeedbackAmount();
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
    let amount = sessionTasks.filter(sessionTasks => sessionTasks.priority === 'urgent').length;
    card.innerHTML = amount;
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
    let name = currentuser.name;
    container.innerHTML = name;
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
    if (window.innerWidth < 846) {
        welcome.style.display = 'flex';
        setTimeout(() => {welcome.style.filter = 'opacity(0)'}, 1500);
        setTimeout(() => {welcome.style.display = 'none'}, 4000);
    }
    if (window.innerWidth > 845) {
        welcome.style.display = 'none';
    }
}