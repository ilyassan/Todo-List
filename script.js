const searchInput = document.getElementById("search");
const prioritySelect = document.getElementById("priority");

loadTasksFromLocalStorage();
updateListsTasksCount();

searchInput.addEventListener("keyup", () => filterTasks());

prioritySelect.querySelectorAll(".dropdown-menu button").forEach(function(option) {
    option.addEventListener("click", () => filterTasks(option.textContent));
})

document.querySelectorAll(".order-by-date").forEach(function(btn) {
    let list = btn.parentElement.parentElement;
    sortListByDate(list, btn.getAttribute("data-order"));

    btn.addEventListener("click", function() {
        let newOrder = btn.getAttribute("data-order") == "asc" ? "desc" : "asc";
        sortListByDate(list, newOrder);
        btn.setAttribute("data-order", newOrder);

        let icon = list.querySelector(".order-by-date i");
        icon.classList.toggle("fa-arrow-up-wide-short");
        icon.classList.toggle("fa-arrow-down-wide-short");
    });
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

    let list = task.parentElement.parentElement;
    sortListByDate(list, list.querySelector(".order-by-date").getAttribute("data-order"));
}

function getHtmlTaskElement(data) {
    let colors = {
        P1: "danger",
        P2: "secondary",
        P3: "info",
    };

    let priorityColor = colors[data.priority];

    return `<div
                id="${data.id}"
                data-start-date="${data.startDate}"
                data-due-date="${data.dueDate}"
                data-priority="${data.priority}"
                data-state="${data.state}"
                data-description="${data.description}"
                class="task border-${priorityColor}"
            >
                <h6 class="title-link font-weight-light mb-3">${data.title}</h6>
                <div class="labels d-flex justify-content-between">
                    <div class="d-flex gap-3 align-items-center">
                        <span style="font-size: .75rem; width: 1.5rem; height: 1.5rem;" class="d-flex justify-content-center align-items-center text-white bg-${priorityColor} rounded-circle">${data.priority}</span>
                        <span class="text-muted">${data.dueDate}</span>
                    </div>
                    <div class="d-flex gap-4 align-items-center">
                        <span role="button" class="edit-btn text-warning py-0"><i class="fa-solid fa-pen-to-square"></i></span>
                        <span role="button" class="delete-btn text-danger py-0"><i class="fa-solid fa-trash"></i></span>
                    </div>
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

function sortListByDate(list, order) {
    const tasks = Array.from(list.querySelectorAll(".task"));

    for (let i = 0; i < tasks.length - 1; i++) {
        for (let j = 0; j < tasks.length - i - 1; j++) {
            const dateA = new Date(tasks[j].getAttribute("data-due-date"));
            const dateB = new Date(tasks[j + 1].getAttribute("data-due-date"));
            const shouldSwap = order === "asc" ? dateA > dateB : dateA < dateB;

            if (shouldSwap) {
                [tasks[j], tasks[j + 1]] = [tasks[j + 1], tasks[j]];
            }
        }
    }

    tasks.forEach(task => list.insertBefore(task, null)); // Moves each element to its new position
}