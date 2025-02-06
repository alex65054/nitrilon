function switchViews(creation) {
    const view = document.getElementById("object-view-container");
    const create = document.getElementById("object-create-container");
    
    if (creation) document.getElementById("create-status-text").innerHTML = "";
    view.style.display = creation ? "none" : "flex";
    create.style.display = !creation ? "none" : "flex";
}

function prepareCreateObject() {
    const url = new URL(window.location.href);
    url.searchParams.set("id", 0)
    if (url != window.location.href) history.pushState({}, "", url);

    switchViews(true);
}

async function selectObject(element) {
    toggleEdit(false);
    var id = element.getAttribute("for").substring(22);

    const url = new URL(window.location.href);
    url.searchParams.set("id", id)
    if (url != window.location.href) history.pushState({}, "", url);
    
    updateObjectView(id);
}