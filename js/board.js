function debug_view_taskbigcard() {
    document.getElementById('board_overlay').style = "z-index: 10;";
    document.getElementById('task_big').style = 'margin-left: unset';
}

function debug_hide_taskbigcard(){
    document.getElementById('task_big').style = 'margin-left: 150vw';
    document.getElementById('board_overlay').style = "z-index: -1;";
}