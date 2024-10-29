let addBtn = document.getElementById("add-task");
let formPopup = document.getElementById("create-task-popup");

addBtn.addEventListener("click", function () {
    formPopup.classList.remove("d-none");

    let closeBtn = document.getElementById("closeIcon");

    formPopup.addEventListener("click", function(event) {
        if (event.target == formPopup || event.target == closeBtn) {
            formPopup.classList.add("d-none");
        }
    })
})