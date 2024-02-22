async function initSummarySite(){
    await initJoin();
    getAmounts();
    getUserName();
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