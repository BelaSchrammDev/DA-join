async function initBoardSite() {
    await initJoin();
    // renderfunctions
}

function debug_view_taskbigcard() {
    let taskBigWidth = document.getElementById('task_big').clientWidth;
    document.getElementById('board_overlay').style = "z-index: 10;";
    document.getElementById('task_big').style = `right: calc(50% - ${taskBigWidth / 2}px);`;
}

function debug_hide_taskbigcard() {
    let taskBigWidth = document.getElementById('task_big').clientWidth;
    document.getElementById('task_big').style = `right: -${taskBigWidth}px;`;
    setTimeout(() => {
        document.getElementById('board_overlay').style = "z-index: -1;";
    }, 200);
}

