// 
// Loading and handling
// 

async function onLoad() {
    initialize();
    await updateObjectList("");

    stateChanged();
}

async function stateChanged() {
    const urlParams = new URLSearchParams(window.location.search);

    let darkMode = urlParams.get("darkMode");
    if (darkMode != null) document.getElementById("dark-mode-switch").checked = true;
    else document.getElementById("dark-mode-switch").checked = false;

    let id = urlParams.get("id");
    if (id != null) {
        if (await isValidObject(id)) {
            document.getElementById("object-selector-label-" + id).checked = true;
            updateObjectView(id);
        }
        else {
            document.getElementById("add-object-input").checked = true;
            prepareCreateObject();
        }
    }
}



// 
// General tools
// 

function trySearch(element) {
    if (event.key === "Enter") {
        activeSearch = element.value;
        updateObjectList(activeSearch);
    } 
}

async function checkValidity(id, url) {
    if (id > 0) {
        const result = await fetch(url + "/" + id, {
            signal: AbortSignal.timeout(2000)
        }).catch((error) => {
            console.log("Error: " + error);
            return false;
        });
        if (result.ok) return true;
    }
    return false;
}



// 
// Creation, selection and editing
// 

function prepareCreateObject() {
    const url = new URL(window.location.href);
    url.searchParams.set("id", 0)
    if (url != window.location.href) history.pushState({}, "", url);

    switchViews(true);
}

function switchViews(creation) {
    const view = document.getElementById("object-view-container");
    const create = document.getElementById("object-create-container");
    
    if (creation) document.getElementById("create-status-text").innerHTML = "";
    view.style.display = creation ? "none" : "flex";
    create.style.display = !creation ? "none" : "flex";
}

async function selectObject(element) {
    toggleEdit(false);
    var id = element.getAttribute("for").substring(22);

    const url = new URL(window.location.href);
    url.searchParams.set("id", id)
    if (url != window.location.href) history.pushState({}, "", url);
    
    updateObjectView(id);
}

function setEnabled(id, enabled) {
    enabled ? document.getElementById(id).removeAttribute("disabled") : document.getElementById(id).setAttribute("disabled", true);
}



// 
// Creating elements in the object list
// 


function createElementInObjectList(id, mainTitle, secondaryTitle, description) {
    let date = new Date(secondaryTitle);
    var outer = document.getElementById("object-explorer");

    var input = document.createElement("input");
    input.type = "radio";
    input.name = "selected-object";
    input.id = "object-selector-label-" + id;

    outer.appendChild(input);

    var element = document.createElement("label");

    element.setAttribute("for", input.id);

    var div = document.createElement("div");
    var h6_Title = document.createElement("h6");
    var p_SecondaryTitle = document.createElement("p");
    var p_LowerText = document.createElement("p");

    h6_Title.innerHTML = mainTitle;
    p_SecondaryTitle.innerHTML = date.getFullYear() + "/" + (date.getMonth()+1) + "/" + date.getDate();
    p_LowerText.innerHTML = description;

    div.appendChild(h6_Title);
    div.appendChild(p_SecondaryTitle);

    element.appendChild(div);
    element.appendChild(p_LowerText);

    element.setAttribute("onclick", "selectObject(this)");

    outer.appendChild(element);
}