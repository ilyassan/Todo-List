const searchInput = document.getElementById("search");
const prioritySelect = document.getElementById("priority");
const notification = document.getElementById("success-notification");

loadTasksFromLocalStorage();
updateListsTasksCount();

searchInput.addEventListener("keyup", () => filterTasks());

prioritySelect.querySelectorAll(".dropdown-menu button").forEach(function(option) {
    option.addEventListener("click", () => filterTasks());
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
    listOfTasks.appendChild(task);

    taskEvents(data.id);

    if (! isFromLocalStorage) {
        storeTaskInLocalStorage(data);
        showNotification("Your task added successfully.")
    }
}

function deleteTask(taskId) {
    document.getElementById(taskId).remove();
    deleteTaskFromLocalStorage(taskId);
    updateListsTasksCount(); // Update the task count after deltete

    showNotification("Your task has been deleted successfully.");
}

function updateTask(data) {
    let task = document.getElementById(data.id);

    let newTask = getHtmlTaskElement(data);
    
    if (task.getAttribute("data-state") == data.state) {
        // Replace the old task with the newly created DOM element
        task.parentNode.replaceChild(newTask, task);
    }else {
        task.remove();
        let listOfTasks = document.querySelectorAll(".list")[data.state].querySelector(".tasks");
        listOfTasks.appendChild(newTask);
    }

    taskEvents(data.id);
    updateTaskInLocalStorage(data);
    showNotification("Your task has been updated successfully.");
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
    let task = document.querySelector(`#${taskId}`);

    // Events for task
    task.querySelector(`.delete-btn`).addEventListener("click", () => deleteTask(taskId));
    task.querySelector(`.title-link`).addEventListener("click", () => showTaskDetailsPopup(task));
    task.querySelector(`.edit-btn`).addEventListener("click", () => showTaskDetailsPopup(task));

    // Drag & Drop Logic
    task.addEventListener("dragstart", function(e) {
        e.dataTransfer.setData("text/plain", taskId);
    });

    const lists = document.querySelectorAll(".list");
    lists.forEach((list, i) => {
        list.addEventListener("dragover", function(e) {
            e.preventDefault();
        });
        list.addEventListener("drop", function(e) {
            e.preventDefault();
            const droppedTaskId = e.dataTransfer.getData("text/plain");
            let taskData = JSON.parse(localStorage.getItem("tasks")).find(task => task.id == droppedTaskId);
            if (taskData.state != i) {
                taskData.state = i;
                updateTask(taskData);
            }
        });
    });
    
    let list = task.parentElement.parentElement;
    sortListByDate(list, list.querySelector(".order-by-date").getAttribute("data-order"));

    filterTasks(); //  To hide the created task if didn't match the current filter search
}

function getHtmlTaskElement(data) {
    let colors = {
        P1: "danger",
        P2: "secondary",
        P3: "info",
    };

    let priorityColor = colors[data.priority];

    let task = `<div
                id="${data.id}"
                data-start-date="${data.startDate}"
                data-due-date="${data.dueDate}"
                data-priority="${data.priority}"
                data-state="${data.state}"
                data-description="${data.description}"
                class="task border-${priorityColor}"
                style="cursor:grab"
                draggable="true"
            >
                <h6 class="title-link font-weight-light mb-3 w-fit">${data.title}</h6>
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

    let tempDiv = document.createElement("div");
    tempDiv.innerHTML = task;

    return tempDiv.firstElementChild
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
function filterTasks(priority) {
    if (! priority) {
        priority = prioritySelect.querySelector(".dropdown-toggle").textContent.trim();
    }

    document.querySelectorAll(".task").forEach(function(task) {

        let title = task.querySelector("h6").textContent.toLowerCase();
        // Filter by priority || Filter by search
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
    
    tasks.forEach(task => list.querySelector(".tasks").insertBefore(task, null)); // Moves each element to its new position
}

function showNotification(message) {
    let showSeconds = 4;

    notification.setAttribute("data-message", message);
    notification.classList.add("showAlert");

    setTimeout(() => {
        notification.classList.remove("showAlert");
    }, 1000 * showSeconds);
}