async function initSummarySite(){
    await initJoin();
    getAmounts();
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
    let amount = defaultTasks.filter(defaultTasks => defaultTasks.status === 'todo').length;
    card.innerHTML = amount;
}


function getDoneAmount() {
    let card = document.getElementById('doneAmount');
    let amount = defaultTasks.filter(defaultTasks => defaultTasks.status === 'done').length;
    card.innerHTML = amount;
}


function getUrgentAmount() {
    let card = document.getElementById('urgentAmount');
    let amount = defaultTasks.filter(defaultTasks => defaultTasks.priority === 'urgent').length;
    card.innerHTML = amount;
}


function getTaskAmount() {
    let card = document.getElementById('taskAmount');
    let amount = defaultTasks.length;
    card.innerHTML = amount;
}


function getInProgressAmount() {
    let card = document.getElementById('inProgressAmount');
    let amount = defaultTasks.filter(defaultTasks => defaultTasks.status === 'inprogress').length;
    card.innerHTML = amount;
}


function getFeedbackAmount() {
    let card = document.getElementById('feedbackAmount');
    let amount = defaultTasks.filter(defaultTasks => defaultTasks.status === 'awaitfeedback').length;
    card.innerHTML = amount;
}