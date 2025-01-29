function switchViews(creation) {
    const view = document.getElementById("object-view-container");
    const create = document.getElementById("object-create-container");
    
    if (creation) document.getElementById("form-status-text").innerHTML = "";
    view.style.display = creation ? "none" : "flex";
    create.style.display = !creation ? "none" : "flex";
}

function prepareCreateEvent() {
    const url = new URL(window.location.href);
    url.searchParams.set("id", 0)
    if (url != window.location.href) history.pushState({}, "", url);

    switchViews(true);
}

async function stateChanged() {
    const urlParams = new URLSearchParams(window.location.search);

    let darkMode = urlParams.get("darkMode");
    if (darkMode != null) document.getElementById("dark-mode-switch").checked = true;
    else document.getElementById("dark-mode-switch").checked = false;

    let id = urlParams.get("id");
    if (id != null) {
        if (await isValidEvent(id)) {
            document.getElementById("object-selector-label-" + id).checked = true;
            updateFeedbackView(id);
        }
        else {
            document.getElementById("add-object-input").checked = true;
            prepareCreateEvent();
        }
    }
}