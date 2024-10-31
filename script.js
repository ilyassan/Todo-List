let searchInput = document.getElementById("search");

let formPopup = document.getElementById("create-task-popup");

loadTasksFromLocalStorage();
updateListsTasksCount();


searchInput.onkeyup = function () {
    showOnlyfilteredTasks(); // Show only tasks that match the current filter search
    updateListsTasksCount(); // Update the lists tasks count based on the new filter
}

function createTask(data, isFromLocalStorage = false) {
    let colors = {
        P1: "danger",
        P2: "secondary",
        P3: "info",
    };
    
    if (! isFromLocalStorage) {

        let taskId = `task-${Date.now()}`
        data.id = taskId;
    }

    let task = `<div
                    id="${data.id}"
                    data-start-date="${data.startDate}"
                    data-due-date="${data.dueDate}"
                    data-priority="${data.priority}"
                    data-state="${data.state}"
                    data-description="${data.description}"
                    class="task border-${colors[data.priority]}"
                >
                    <h6 class="title-link font-weight-light mb-3">${data.title}</h6>
                    <div class="labels">
                        <button class="delete-btn btn btn-danger py-0">Delete</button>
                        <button class="edit-btn btn btn-warning py-0 text-white">Edit</button>
                    </div>
                </div>`

    let listOfTasks = document.querySelectorAll(".list")[data.state].querySelector(".tasks");
    listOfTasks.insertAdjacentHTML("beforeend", task);

    taskEvents(data.id);

    if (! isFromLocalStorage) {
        storeTaskInLocalStorage(data);
    }
}

function deleteTask(taskId) {
    document.getElementById(taskId).remove();
    deleteTaskFromLocalStorage(taskId);
    updateListsTasksCount(); // Update the task count after deltete
}

function updateTask(data) {
    let task = document.getElementById(data.id);

    let colors = {
        P1: "danger",
        P2: "secondary",
        P3: "info",
    };
    
    let tempDiv = document.createElement("div");
    tempDiv.innerHTML = `<div
                    id="${data.id}"
                    data-start-date="${data.startDate}"
                    data-due-date="${data.dueDate}"
                    data-priority="${data.priority}"
                    data-state="${data.state}"
                    data-description="${data.description}"
                    class="task border-${colors[data.priority]}"
                >
                    <h6 class="title-link font-weight-light mb-3">${data.title}</h6>
                    <div class="labels">
                        <button class="delete-btn btn btn-danger py-0">Delete</button>
                        <button class="edit-btn btn btn-warning py-0 text-white">Edit</button>
                    </div>
                </div>`;

    
    if (task.getAttribute("data-state") == data.state) {
        // Replace the old task with the newly created DOM element
        task.replaceWith(tempDiv.firstElementChild);
    }else {
        task.remove();
        let listOfTasks = document.querySelectorAll(".list")[data.state].querySelector(".tasks");
        listOfTasks.appendChild(tempDiv.firstElementChild);
    }

    taskEvents(data.id);
}

function loadTasksFromLocalStorage() {
    let tasks = JSON.parse(localStorage.getItem("tasks"));

    if(! tasks) return;

    for(let taskData of tasks) {
        createTask(taskData, true);
    }
}

function storeTaskInLocalStorage(data) {
    let tasks = JSON.parse(localStorage.getItem("tasks"));

    if (! tasks) {
        tasks = [];
    }

    tasks.push(data);

    localStorage.setItem("tasks", JSON.stringify(tasks));
}

function deleteTaskFromLocalStorage(taskId) {
    let tasks = JSON.parse(localStorage.getItem("tasks"));

    for(let i = 0; i < tasks.length ; i++) {
        if(tasks[i].id == taskId){
            tasks.splice(i, 1)
            break;
        }
    }
    
    localStorage.setItem("tasks", JSON.stringify(tasks));
}

function taskEvents(taskId) {
    showOnlyfilteredTasks(); //  To hide the created task if didn't match the current filter search
    let task = document.querySelector(`#${taskId}`);
    task.querySelector(`.delete-btn`).addEventListener("click", () => deleteTask(taskId));
    task.querySelector(`.title-link`).addEventListener("click", () => showTaskDetailsPopup(task));
    task.querySelector(`.edit-btn`).addEventListener("click", () => showTaskDetailsPopup(task));
    updateListsTasksCount();
}

function showOnlyfilteredTasks() {
    document.querySelectorAll(".task").forEach(function(task) {
        let title = task.querySelector("h6").textContent;

        if (title.search(searchInput.value) == -1) { // If didn't match
            task.classList.add("d-none");
            return;
        }
        task.classList.remove("d-none");
    })
}

function updateListsTasksCount () {
    document.querySelectorAll(".list").forEach( function (list) {
        let spanCount = list.querySelector(".count");
        spanCount.textContent = Array.from(list.querySelectorAll(".tasks .task"))
                                    .filter(task => !task.classList.contains("d-none"))
                                    .length;
    })
}