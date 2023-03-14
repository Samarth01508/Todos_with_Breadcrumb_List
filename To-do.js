const tasksList = {};
let cur_id;
let cur_path = document.createElement("span");
cur_path.setAttribute("class", "breadcrumb");

function initApp() {
  let home_obj = createTaskObject("Home", 0);
  tasksList[home_obj.id] = home_obj;

  cur_id = home_obj.id;
  generateBreadcrumb(home_obj.id);

  let to_do = document.getElementById("To-do-list");

  let task_input_element = document.createElement("input");
  task_input_element.setAttribute("id", "task-input");
  task_input_element.setAttribute("placeholder", "Enter your task");

  let addTaskButton = document.createElement("button");
  addTaskButton.setAttribute("id", "addTask-button");
  addTaskButton.innerHTML = "Add Task";

  let taskDivsContainer=document.createElement("div");
  taskDivsContainer.setAttribute("id","task-div-container");

  let incompleteTaskList = createStatusdiv("Incomplete");
  let completedTaskList = createStatusdiv("Completed");

  taskDivsContainer.appendChild(incompleteTaskList);
  taskDivsContainer.appendChild(completedTaskList);

  to_do.appendChild(cur_path);
  to_do.appendChild(task_input_element);
  to_do.appendChild(addTaskButton);
  to_do.appendChild(taskDivsContainer);

  addTaskEventListener(home_obj);
}

function createStatusdiv(status) {
  let statusDiv = document.createElement("div");
  statusDiv.setAttribute("id", `${status}-task-list`);
  let statusHeading = document.createElement("h3");
  statusHeading.innerText = `${status}-Tasks:`;
  statusDiv.appendChild(statusHeading);

  return statusDiv;
}

function addTaskEventListener() {
  let addTaskButton = document.getElementById("addTask-button");

  addTaskButton.addEventListener("click", function () {
    let task_input_element = document.getElementById("task-input");
    let taskName = task_input_element.value;

    if (!task_input_element.value) {
      alert("Enter any task");
      return;
    } else {
      let taskObject = createTaskObject(taskName, cur_id);
      markTaskIncomplete(taskObject);
      tasksList[taskObject.id] = taskObject;
      task_input_element.value = "";
    }
  });
}

function createTaskObject(taskName, pID) {
  return {
    taskName: taskName,
    incompleteSubTasks: [],
    completedSubTasks: [],
    id: Date.now(),
    parent_id: pID,
  };
}

function markTaskIncomplete(taskObject) {
  let pID = taskObject.parent_id;
  let pTask = tasksList[pID];
  let ind = -1;

  ind = pTask.completedSubTasks.indexOf(taskObject);
  if (ind > -1) pTask.completedSubTasks.splice(ind, 1);
  ind = pTask.incompleteSubTasks.indexOf(taskObject);
  if (ind < 0) pTask.incompleteSubTasks.push(taskObject);

  let taskElement = createTaskElement(taskObject, "Complete");
  let incompleteTaskList = document.getElementById("Incomplete-task-list");
  incompleteTaskList.appendChild(taskElement);

  addSubtasks();

  return;
}

function markTaskComplete(taskObject) {
  let pID = taskObject.parent_id;
  let pTask = tasksList[pID];
  let ind = -1;

  ind = pTask.incompleteSubTasks.indexOf(taskObject);
  if (ind > -1) pTask.incompleteSubTasks.splice(ind, 1);
  ind = pTask.completedSubTasks.indexOf(taskObject);
  if (ind < 0) pTask.completedSubTasks.push(taskObject);

  let taskElement = createTaskElement(taskObject, "Incomplete");
  let completedTaskList = document.getElementById("Completed-task-list");
  completedTaskList.appendChild(taskElement);

  addSubtasks();

  return;
}

function createTaskElement(taskObject, status) {
  let taskElement = document.createElement("li");
  taskElement.setAttribute("id", taskObject.id);

  let addSubtaskBtn = createAddSubtaskBtn();
  let taskNameElement = createNameElement(taskObject);
  let removeButton = createRemoveButton(status, taskObject, taskElement);
  let statusButton = createStatusButton(status, taskObject, taskElement);

  taskElement.appendChild(addSubtaskBtn);
  taskElement.appendChild(taskNameElement);
  taskElement.appendChild(removeButton);
  taskElement.appendChild(statusButton);

  return taskElement;
}

function createAddSubtaskBtn() {
  let addSubtaskBtn = document.createElement("button");
  addSubtaskBtn.setAttribute("class", "add-subtask-btn");
  addSubtaskBtn.innerHTML = "+";

  return addSubtaskBtn;
}

function createNameElement(taskObject) {
  let spanElement = document.createElement("span");
  spanElement.setAttribute("class", "task-name-span");
  createEditSpan(taskObject, spanElement);
  return spanElement;
}

function createEditSpan(taskObject, spanElement) {
  let taskLabelElement = document.createElement("label");
  taskLabelElement.innerHTML = `${taskObject.taskName}`;
  taskLabelElement.setAttribute("class", "task-name-label");
  let editButton = document.createElement("button");
  editButton.innerHTML = "Edit";
  editButton.setAttribute("class", "edit-btn");
  spanElement.appendChild(taskLabelElement);
  spanElement.appendChild(editButton);

  addEditEvent(taskObject, spanElement, editButton, taskLabelElement);
}

function addEditEvent(taskObject, spanElement, editBtn, taskLabelElement) {
  editBtn.addEventListener("click", () => {
    taskLabelElement.remove();
    editBtn.remove();
    createSaveSpan(taskObject, spanElement);
  });
}

function createSaveSpan(taskObject, spanElement) {
  let inputElement = document.createElement("input");
  inputElement.value = taskObject.taskName;
  let saveBtn = document.createElement("button");
  saveBtn.innerHTML = "Save";
  saveBtn.setAttribute("class", "save-btn");
  spanElement.appendChild(inputElement);
  spanElement.appendChild(saveBtn);
  inputElement.focus();
  addSaveEvent(taskObject, spanElement, saveBtn, inputElement);
}

function addSaveEvent(taskObject, spanElement, saveBtn, inputElement) {
  inputElement.addEventListener("blur", () => {
    taskObject.taskName = inputElement.value;
    inputElement.remove();
    saveBtn.remove();
    createEditSpan(taskObject, spanElement);
  });
}

function createRemoveButton(status, taskObject, taskElement) {
  let removeButton = document.createElement("button");
  removeButton.setAttribute("class", "remove-btn");
  removeButton.innerHTML = "Remove";
  removeEventListener(taskObject, taskElement, status, removeButton);
  return removeButton;
}

function removeEventListener(taskObject, taskElement, status, removeButton) {
  removeButton.addEventListener("click", function () {
    removeTask(taskObject, status);
    taskElement.remove();
  });
}

function removeTask(taskObject, status) {
  // for (let task in taskObject.completedSubTasks) {
  //   removeTask(task, "Complete");
  // }
  // for (let task in taskObject.incompleteSubTasks) {
  //   removeTask(task, "Incomplete");
  // }
  let pID = taskObject.parent_id;
  if (status == "Complete") {
    let pTask = tasksList[pID];
    let ind = pTask.incompleteSubTasks.indexOf(taskObject);
    pTask.incompleteSubTasks.splice(ind, 1);
  } else if (status == "Incomplete") {
    let pTask = tasksList[pID];
    let ind = pTask.completedSubTasks.indexOf(taskObject);
    pTask.completedSubTasks.splice(ind, 1);
  }
  let tID = taskObject.id;
  delete tasksList[`${tID}`];
}

function createStatusButton(status, taskObject, taskElement) {
  let statusButton = document.createElement("button");
  statusButton.innerHTML = status;
  statusButton.setAttribute("class", `${status}-btn`);

  statusButton.addEventListener("click", function () {
    if (status == "Incomplete") markTaskIncomplete(taskObject);
    else if (status == "Complete") markTaskComplete(taskObject);
    taskElement.remove();
  });

  return statusButton;
}

function addSubtasks() {
  const addSubtaskBtns = document.querySelectorAll(".add-subtask-btn");
  addSubtaskBtns.forEach((addSubtaskBtn) => {
    addSubtaskBtn.addEventListener("click", () => {
      let curTaskId = addSubtaskBtn.parentElement.id;
      let curTask = tasksList[curTaskId];
      deleteBreadcrumb();
      generateBreadcrumb(curTask.id);
      refreshDom(curTask);
    });
  });
}

function fillDiv(taskDiv, subtaskList, status) {
  let statusHeading = document.createElement("h3");
  statusHeading.innerText = `${status}-Tasks:`;
  taskDiv.appendChild(statusHeading);
  subtaskList.forEach((subtask) => {
    if (status == "Incomplete") {
      markTaskIncomplete(subtask);
    } else {
      markTaskComplete(subtask);
    }
  });
}

function emptyDiv(taskDiv) {
  while (taskDiv.firstChild) {
    taskDiv.removeChild(taskDiv.firstChild);
  }
}

function deleteBreadcrumb() {
  while (cur_path.firstChild) {
    cur_path.removeChild(cur_path.firstChild);
  }
}

function generateBreadcrumb(taskID) {
  let taskObject = tasksList[taskID];
  let breadcrumb = document.createElement("label");
  breadcrumb.setAttribute("class","breadcrumb-label")
  if (taskObject.parent_id == 0) {
    breadcrumb.innerText = `${taskObject.taskName}`;
    cur_path.appendChild(breadcrumb);
  } else {
    generateBreadcrumb(taskObject.parent_id);
    breadcrumb.innerText = `/${taskObject.taskName}`;
    cur_path.appendChild(breadcrumb);
  }
  addBreadcrumbEvent(taskObject, breadcrumb);
  return;
}

function addBreadcrumbEvent(taskObject, breadcrumb) {
  breadcrumb.addEventListener("click", () => {
    deleteBreadcrumb();
    generateBreadcrumb(taskObject.id);
    refreshDom(taskObject);
  });
}

function refreshDom(taskObject) {
  cur_id = taskObject.id;
  let curTask = taskObject;
  let incompleteDiv = document.getElementById("Incomplete-task-list");
  let completedDiv = document.getElementById("Completed-task-list");
  emptyDiv(incompleteDiv);
  emptyDiv(completedDiv);
  fillDiv(incompleteDiv, curTask.incompleteSubTasks, "Incomplete");
  fillDiv(completedDiv, curTask.completedSubTasks, "Complete");
}

initApp();
