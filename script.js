let addSingleTaskBtn = document.getElementById("add-task");
let addMultipleTasksBtn = document.getElementById("add-multiple-tasks");

let formPopup = document.getElementById("create-task-popup");

updateListsTasksCount();

addSingleTaskBtn.addEventListener("click", () => openAndClosePopup(false))
addMultipleTasksBtn.addEventListener("click", () => openAndClosePopup(true))

function openAndClosePopup (isMultiple) {
    formPopup.classList.remove("d-none");
    if (isMultiple) {
        formPopup.setAttribute("multiple", true);
    }

    formPopup.addEventListener("click", function(event) {
        let closeBtn = document.querySelector("#closeIcon span");

        if (event.target == formPopup || event.target == closeBtn) {
            formPopup.classList.add("d-none");
            document.getElementById("alert").classList.add("d-none");
            if (isMultiple) {
                formPopup.removeAttribute("multiple");
            }
        }
    })
}

function createTask(data) {
    let colors = {
        P1: "danger",
        P2: "secondary",
        P3: "info",
    };
    let task = `<div
                    data-start-date="${data.startDate}"
                    data-due-date="${data.dueDate}"
                    data-priority="${data.priority}"
                    data-state="${data.state}"
                    data-description="${data.description}"
                    class="task border-${colors[data.priority]}"
                >
                    <h6 class="font-weight-light mb-3">${data.title}</h6>
                    <div class="labels">
                        <button class="btn btn-danger py-0">Delete</button>
                        <button class="btn btn-warning py-0 text-white">Edit</button>
                    </div>
                </div>
                `
    let listOfTasks = document.querySelectorAll(".list")[data.state].querySelector(".tasks");

    listOfTasks.innerHTML += task;
    updateListsTasksCount();
}

function updateListsTasksCount () {
    document.querySelectorAll(".list").forEach( function (list) {
        let spanCount = list.querySelector(".count");
        spanCount.textContent = list.querySelectorAll(".tasks .task").length;
    })
}