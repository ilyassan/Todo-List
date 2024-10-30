let popup = document.getElementById("create-task-popup");
let formsContainer = document.getElementById("forms");
let newFormBtn = document.getElementById("addFormBtn");
let removeFormBtn = document.getElementById("removeFormBtn");
let saveBtn = document.getElementById("saveBtn");
let alert = document.getElementById("alert");
let addSingleTaskBtn = document.getElementById("add-task");
let addMultipleTasksBtn = document.getElementById("add-multiple-tasks");

addSingleTaskBtn.addEventListener("click", () => openPopup(true));
addMultipleTasksBtn.addEventListener("click", () => openPopup(false));

function openPopup (isSingle) {
    formPopup.classList.remove("d-none");
    let controllMultiple = document.getElementById("multiple-controll");

    if(isSingle){ // If user will add only 1 task.
        // Remove the add new form and remove form buttons.
        controllMultiple.classList.add("d-none");

        // If there is duplicate forms remove them and let only 1.
        let forms = formsContainer.children;
        while (forms.length > 1) {
            formsContainer.removeChild(forms[1]);
        }
    }else {
        controllMultiple.classList.remove("d-none");
    }
}

popup.addEventListener("click", function(event) {
    let closeBtn = document.querySelector("#closeIcon span");

    if (event.target == popup || event.target == closeBtn) {
        formPopup.classList.add("d-none");
        hideAlert();
        document.getElementById("multiple-controll").classList.remove("d-none");
    }
});

const form = popup.querySelector("form");
applyFormEvents(form);
const emptyForm = form.cloneNode(true);

newFormBtn.addEventListener("click", createNewForm)
removeFormBtn.addEventListener("click", removeForm)
saveBtn.addEventListener("click", submit)


function removeForm() {
    let forms = formsContainer.children;

    if (forms.length == 1) return;
    
    forms[forms.length - 1].remove();
    hideAlert();
}

function createNewForm() {
    let emptyFormCopy = emptyForm.cloneNode(true);
    emptyFormCopy.classList.add("border-top", "border-dark", "pt-3")
    formsContainer.appendChild(emptyFormCopy);
    applyFormEvents(emptyFormCopy);
}

function submit (){
    let forms = formsContainer.querySelectorAll("form");
    
    let formsData  = [];
    for (let form of forms) {
        formsData.push(getTaskData(form));
    }

    for (let data of formsData) {
        if (! validatedData(data)) return;
    }

    for (let data of formsData) {
        addTask(data);
    }
}

function getTaskData(form) {
    let data = {
        title: form.querySelector(".title").value,
        description: form.querySelector(".description").value,
        startDate: form.querySelector(".start-date-menu").value,
        dueDate: form.querySelector(".due-date-menu").value,
        priority: getValueFromMenu("priority-menu")?.textContent,
        state: getValueFromMenu("state-menu")?.getAttribute("value"),
    }
    function getValueFromMenu (className){
        let element = form.querySelector(`.${className} .dropdown-toggle`);
        return element.hasAttribute("value") ? element : null;
    }

    return data;
}

function validatedData(data) {
    for (let value of Object.values(data)) {
        if(! value){
            showAlert();

            document.querySelectorAll("input").forEach(function(input){
                input.addEventListener("focus", hideAlert)
            })
            document.querySelector("textarea").addEventListener("focus", hideAlert)
            document.querySelectorAll(".dropdown-toggle").forEach(function(ele){
                ele.addEventListener("click", hideAlert)
            })

            return false;
        }
    }

    return true;
}

function addTask(data) {
    createTask(data);
    let formClone = emptyForm.cloneNode(true);
    formsContainer.replaceChildren(formClone);
    applyFormEvents(formClone);
    popup.classList.add("d-none");
}

function applyFormEvents(form) {
    let startDateInput = form.querySelector(".start-date-menu");
    let dueDateInput = form.querySelector(".due-date-menu");

    startDateInput.addEventListener("change", function() {
        dueDateInput.min = startDateInput.value;
        
        if (dueDateInput.value && (new Date(startDateInput.value) > new Date(dueDateInput.value))) {
            dueDateInput.value = "";
        }
    })

    // Show the selected option (priority, state) on the select button
    document.querySelectorAll(".dropdown-item").forEach(function (item) {
        item.addEventListener('click', function(event) {
            event.preventDefault();
            let selectedItem = event.target;
            let selectBtn = event.target.parentElement.parentElement.querySelector(".dropdown-toggle");
            selectBtn.textContent = selectedItem.textContent;
            selectBtn.setAttribute("value", selectedItem.getAttribute("value"));
        });
    })
}

function showAlert() {
    alert.classList.remove("d-none");
}
function hideAlert() {
    alert.classList.add("d-none");
}