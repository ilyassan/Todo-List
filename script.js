const searchInput = document.getElementById("search");
const prioritySelect = document.getElementById("priority");

loadTasksFromLocalStorage();
updateListsTasksCount();


searchInput.addEventListener("keyup", () => filterTasks());

prioritySelect.querySelectorAll(".dropdown-menu button").forEach(function(option) {
    option.addEventListener("click", () => filterTasks(option.textContent));
})

function createTask(data, isFromLocalStorage = false) {
    
    if (! isFromLocalStorage) {
        let taskId = `task-${Date.now()}`
        data.id = taskId;
    }

    let task = getHtmlTaskElement(data);

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

    let tempDiv = document.createElement("div");
    tempDiv.innerHTML = getHtmlTaskElement(data);

    
    if (task.getAttribute("data-state") == data.state) {
        // Replace the old task with the newly created DOM element
        task.replaceWith(tempDiv.firstElementChild);
    }else {
        task.remove();
        let listOfTasks = document.querySelectorAll(".list")[data.state].querySelector(".tasks");
        listOfTasks.appendChild(tempDiv.firstElementChild);
    }

    taskEvents(data.id);
    updateTaskInLocalStorage(data);
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

function updateTaskInLocalStorage(data) {
    let tasks = JSON.parse(localStorage.getItem("tasks"));

    for(let i = 0; i < tasks.length ; i++) {
        if(tasks[i].id == data.id){
            tasks[i] = data;
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

function getHtmlTaskElement(data) {
    let colors = {
        P1: "danger",
        P2: "secondary",
        P3: "info",
    };

    return `<div
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

// Filter by priority and search input
function filterTasks(priority = "All") {
    document.querySelectorAll(".task").forEach(function(task) {

        let title = task.querySelector("h6").textContent.toLowerCase();
        // Filtrer par priority || Filtrer par search
        if((priority == "All" || task.getAttribute("data-priority") == priority) && title.search(searchInput.value.toLowerCase()) != -1){
            task.classList.remove("d-none");
            return;
        }

        task.classList.add("d-none");
    })

    updateListsTasksCount(); // Update the lists tasks count based on the new filter
}