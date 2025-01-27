const urlEventRating = "https://localhost:7160/api/EventRating";
const urlEvent = "https://localhost:7160/api/Event";
var selectedEvent;
var memberList;

async function onLoad() {
    await updateMemberList("");

    const urlParams = new URLSearchParams(window.location.search);
    let id = urlParams.get("id");
    let darkMode = urlParams.get("darkMode");
    if (darkMode != null) document.getElementById("dark-mode-switch").checked = true;
    else document.getElementById("dark-mode-switch").checked = false;

    if (id != null && isValidMember(id)) {
        document.getElementById("object-selector-label-" + id);
        updateObjectView(id);
    }


}


async function updateObjectView(id) {

}

async function updateMemberList(search) {
    
}