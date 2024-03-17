/**
 * Event handler for the draggable task when the drag starts.
 * 
 * @param {DragEvent} event - The drag event.
 * @param {string} taskID - The ID of the task being dragged.
 */
function draggableBegin(event, taskID) {
    currentDraggableTaskID = taskID;
    addClass('minitask_' + taskID, 'task_draggable');
}


/**
 * Event handler for the draggable task when the drag ends.
 * 
 * @param {DragEvent} event - The drag event.
 * @param {string} taskID - The ID of the task being dragged.
 */
function draggableEnd(event, taskID) {
    event.preventDefault();
    removeClass('minitask_' + taskID, 'task_draggable');
    const hightlightedRow = document.querySelector('.row_draggable');
    if (hightlightedRow) removeClass(hightlightedRow, 'row_draggable');
    setNewStatus(taskID, getRowIDFromMousePosition(event.clientX, event.clientY));
}


/**
 * Event handler for the dragover event. to chenge the cursor.
 * 
 * @param {DragEvent} event - The drag event.
 */
function dragOver(event) {
    event.preventDefault();
}


/**
 * Gets the ID of the row based on the mouse position.
 * 
 * @param {number} posX - The X coordinate of the mouse position.
 * @param {number} posY - The Y coordinate of the mouse position.
 * @returns {string} - The ID of the row.
 */
function getRowIDFromMousePosition(posX, posY) {
    const isBetween = (num1, value, num2) => num1 < value && value < num2;
    for (let index = 0; index < rowIdName.length; index++) {
        const element = getElement('taskrow_' + rowIdName[index].id);
        const rect = element.getBoundingClientRect();
        if (isBetween(rect.left, posX, rect.right) && isBetween(rect.top, posY, rect.bottom))
            return rowIdName[index].id;
    }
    return '';
}


/**
 * Event handler for the draggable task when it enters a row.
 * 
 * @param {DragEvent} event - The drag event.
 * @param {string} rowID - The ID of the row.
 */
function draggableEnter(event, rowID) {
    event.preventDefault();
    addClass('taskrow_' + rowID, 'row_draggable');
    currentDragHighlightID = event.target.id;
}


/**
 * Event handler for the draggable task when it leaves a row.
 * 
 * @param {DragEvent} event - The drag event.
 * @param {string} rowID - The ID of the row.
 */
function draggableLeave(event, rowID) {
    event.preventDefault();
    if (currentDragHighlightID === event.target.id) {
        removeClass('taskrow_' + rowID, 'row_draggable');
        currentDragHighlightID = '';
    }
}


