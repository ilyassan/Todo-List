function main() {
    let startDateMenu = document.querySelector("#start-date-menu .dropdown-menu");
    let dueDateMenu = document.querySelector("#due-date-menu .dropdown-menu");

    fillInputsWithDates();

    const form = document.querySelector("form");
    const emptyForm = form.cloneNode(true);

    form.addEventListener("submit", onSubmit)


    function onSubmit (event){
        event.preventDefault();
        
        let data = getTaskData();

        if (validatedData(data)) {
            addTask(data);
        }
        return;
    }



    function getTaskData() {
        let data = {
            title: document.getElementById("title").value,
            description: document.getElementById("description").value,
            startDate: getValueFromMenu("start-date-menu")?.textContent,
            dueDate: getValueFromMenu("due-date-menu")?.textContent,
            priority: getValueFromMenu("priority-menu")?.textContent,
            state: getValueFromMenu("state-menu")?.getAttribute("value"),
        }
        function getValueFromMenu (id){
            let element = document.querySelector(`#${id} .dropdown-toggle`);
            return element.hasAttribute("value") ? element : null;
        }

        return data;
    }

    function validatedData(data) {
        for (let key of Object.keys(data)) {
            if(! data[key]){
                document.querySelector("#alert").classList.remove("d-none");

                document.querySelector("input").addEventListener("focus", hideAlert)
                document.querySelector("textarea").addEventListener("focus", hideAlert)
                document.querySelectorAll(".dropdown-toggle").forEach(function(ele){
                    ele.addEventListener("click", hideAlert)
                })

                function hideAlert() {
                    document.querySelector("#alert").classList.add("d-none");
                }

                return false;
            }
        }

        return true;
    }

    function addTask(data) {
        createTask(data);
        form.replaceWith(emptyForm); // Close PopUp
        if (! emptyForm.parentElement.hasAttribute("multiple")) {
            emptyForm.parentElement.classList.add("d-none");
        }
        main();
    }

    function fillInputsWithDates() {
        // Get the current time
        let currentDate = new Date();

        // Generates the dates items
        generateDates(startDateMenu, currentDate)
        generateDates(dueDateMenu, currentDate)

        // Regenerate the dates of due menu based on the selected start date
        document.querySelector("#due-date-menu .dropdown-toggle").addEventListener("click", function (event){
            let startMenuIndex = document.querySelector("#start-date-menu .dropdown-toggle").getAttribute("value");
            if(startMenuIndex === null) return;
            dueDateMenu.innerHTML = "";
            generateDates(dueDateMenu, currentDate, parseInt(startMenuIndex));
        })

        // Regenerate the dates of due menu based on the selected start date
        document.querySelectorAll("#start-date-menu .dropdown-item").forEach(function (item){
            item.addEventListener("click", function (event){
                let dueMenuBtn = document.querySelector("#due-date-menu .dropdown-toggle");
                let startMenuIndex = document.querySelector("#start-date-menu .dropdown-toggle").getAttribute("value");
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
}

main();