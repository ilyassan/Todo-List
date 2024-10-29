let popup = document.getElementById("create-task-popup");
let formsContainer = document.getElementById("forms");
let newFormBtn = document.getElementById("addFormBtn");
let removeFormBtn = document.getElementById("removeFormBtn");
let saveBtn = document.getElementById("saveBtn");
let alert = document.getElementById("alert");


popup.addEventListener("click", function(event) {
    let closeBtn = document.querySelector("#closeIcon span");

    if (event.target == popup || event.target == closeBtn) {
        formPopup.classList.add("d-none");
        alert.classList.add("d-none");
        document.getElementById("multiple-controll").classList.remove("d-none");
    }
});


const form = popup.querySelector("form");
fillInputsWithDates(form);
const emptyForm = form.cloneNode(true);

newFormBtn.addEventListener("click", createNewForm)
removeFormBtn.addEventListener("click", removeForm)
saveBtn.addEventListener("click", submit)


function removeForm() {
    let forms = formsContainer.children;

    if (forms.length == 1) return;
    
    forms[forms.length - 1].remove();
}

function createNewForm() {
    let emptyFormCopy = emptyForm.cloneNode(true);
    emptyFormCopy.classList.add("border-top", "border-dark", "pt-3")
    formsContainer.appendChild(emptyFormCopy);
    fillInputsWithDates(emptyFormCopy);
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
        startDate: getValueFromMenu("start-date-menu")?.textContent,
        dueDate: getValueFromMenu("due-date-menu")?.textContent,
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
            alert.classList.remove("d-none");

            document.querySelector("input").addEventListener("focus", hideAlert)
            document.querySelector("textarea").addEventListener("focus", hideAlert)
            document.querySelectorAll(".dropdown-toggle").forEach(function(ele){
                ele.addEventListener("click", hideAlert)
            })

            function hideAlert() {
                alert.classList.add("d-none");
            }

            return false;
        }
    }

    return true;
}

function addTask(data) {
    createTask(data);
    let formClone = emptyForm.cloneNode(true);
    formsContainer.replaceChildren(formClone);
    fillInputsWithDates(formClone);
    popup.classList.add("d-none");
}

function fillInputsWithDates(form) {
    let startDateMenu = form.querySelector(".start-date-menu .dropdown-menu");
    let dueDateMenu = form.querySelector(".due-date-menu .dropdown-menu");

    // Get the current time
    let currentDate = new Date();

    // Generates the dates items
    generateDates(startDateMenu, currentDate)
    generateDates(dueDateMenu, currentDate)

    // Regenerate the dates of due menu based on the selected start date
    form.querySelector(".due-date-menu .dropdown-toggle").addEventListener("click", function (){
        let startMenuIndex = form.querySelector(".start-date-menu .dropdown-toggle").getAttribute("value");
        if(startMenuIndex === null) return;
        dueDateMenu.innerHTML = "";
        generateDates(dueDateMenu, currentDate, parseInt(startMenuIndex));
    })

    // Regenerate the dates of due menu based on the selected start date
    form.querySelectorAll(".start-date-menu .dropdown-item").forEach(function (item){
        item.addEventListener("click", function (){
            let dueMenuBtn = form.querySelector(".due-date-menu .dropdown-toggle");
            let startMenuIndex = form.querySelector(".start-date-menu .dropdown-toggle").getAttribute("value");
            let dueMenuIndex = dueMenuBtn.getAttribute("value");
            
            if(dueMenuIndex === null || startMenuIndex === null || startMenuIndex  <= dueMenuIndex) return;


            dueMenuBtn.textContent = "Due Date";
            dueMenuBtn.removeAttribute("value");
        })
    })

    // Generate the date items in the menu
    function generateDates(dateMenu, currentDate, skip = 0) {
        for (let i = 0 + skip; i < 100; i++) {
            let date = new Date(currentDate);
            date.setDate(date.getDate() + i);
            date = date.toLocaleDateString('en-US', 
                { month: 'short', day: 'numeric', year: 'numeric', timeZone: 'Africa/Casablanca' }
            );

            let item = document.createElement('button');
            item.setAttribute("value", i);
            item.classList.add("dropdown-item");
            item.textContent = date;

            dateMenu.append(item);
        }

        document.querySelectorAll(".dropdown-item").forEach(function (item) {
            item.addEventListener('click', markMenuOptionAsSelected);
        })
    }
    
    // Show the selected date on the select button
    function markMenuOptionAsSelected (event) {
        event.preventDefault();
        let selectedItem = event.target;
        let selectBtn = getSelectBtnFromItemMenu(event);
        selectBtn.textContent = selectedItem.textContent;
        selectBtn.setAttribute("value", selectedItem.getAttribute("value"))
    }
    function getSelectBtnFromItemMenu (event) {
        return event.target.parentElement.parentElement.querySelector(".dropdown-toggle");
    }
}