const taskDetailsPopup = document.getElementById("task-details");
const detailsForm = taskDetailsPopup.querySelector("form");
const detailsFormAlert = taskDetailsPopup.querySelector(".alert");

applyFormEvents(detailsForm);

detailsForm.onsubmit = function(event) {
    event.preventDefault();

    let data = getTaskData(detailsForm);
    data.id = detailsForm.querySelector("input.id").value; // Add the id task to the data

    if (! validatedEditedData(data)) return;

    editTask(data);
}

taskDetailsPopup.addEventListener("click", function(event) {
    if(event.target == taskDetailsPopup){
        hideTaskDetailsPopup();
    }
})

function hideTaskDetailsPopup() {
    detailsForm.classList.remove("show");
    setTimeout(() => {
        taskDetailsPopup.classList.add("d-none");
    }, 500);
}

function showTaskDetailsPopup(task) {
    let data = getDataFromTaskElement(task);
    
    detailsForm.querySelector(".id").value = data.id;
    detailsForm.querySelector(".title").value = data.title;
    detailsForm.querySelector(".description").value = data.description;
    detailsForm.querySelector(".start-date-menu").value = data.startDate;
    detailsForm.querySelector(".due-date-menu").min = data.startDate;
    detailsForm.querySelector(".due-date-menu").value = data.dueDate;
    detailsForm.querySelectorAll(".priority-menu .dropdown-item").forEach(function(item){
        if (item.textContent ==  data.priority) {
            let selectBtn = detailsForm.querySelector(".priority-menu .dropdown-toggle");
            selectBtn.textContent = item.textContent;
            selectBtn.setAttribute("value", item.getAttribute("value"));
        }
    })
    detailsForm.querySelectorAll(".state-menu .dropdown-item").forEach(function(item){
        if (item.getAttribute("value") ==  data.state) {
            let selectBtn = detailsForm.querySelector(".state-menu .dropdown-toggle");
            selectBtn.textContent = item.textContent;
            selectBtn.setAttribute("value", item.getAttribute("value"));
        }
    })

    showDetailsPopup();
}

function getDataFromTaskElement(task) {
    return {
        id: task.id,
        title: task.querySelector(".title-link").textContent,
        description: task.getAttribute("data-description"),
        startDate: task.getAttribute("data-start-date"),
        dueDate: task.getAttribute("data-due-date"),
        priority: task.getAttribute("data-priority"),
        state: task.getAttribute("data-state"),
    }
}

function showDetailsPopup() {
    taskDetailsPopup.classList.remove("d-none");
    
    setTimeout(() => {
        detailsForm.classList.add("show");
    }, 0);
}

function validatedEditedData(data) {
    for (let value of Object.values(data)) {
        if(! value){
            showDetailsAlert();

            document.querySelectorAll("input").forEach(function(input){
                input.addEventListener("focus", hideDetailsAlert)
            })
            document.querySelector("textarea").addEventListener("focus", hideDetailsAlert)
            document.querySelectorAll(".dropdown-toggle").forEach(function(ele){
                ele.addEventListener("click", hideDetailsAlert)
            })

            return false;
        }
    }

    return true;
}

function editTask(data) {
    updateTask(data);
    hideDetailsAlert();
    hideTaskDetailsPopup();
}

function showDetailsAlert() {
    detailsFormAlert.classList.remove("d-none");
}
function hideDetailsAlert() {
    detailsFormAlert.classList.add("d-none");
}