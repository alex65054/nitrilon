const urlMember = "https://localhost:7160/api/Member";
const urlMembershipType = "https://localhost:7160/api/MembershipType";
const urlContactInfo = "https://localhost:7160/api/ContactInfo";
var membershipTypes;
var selectedObject;
var memberList;
var activeSearch = "";

async function onLoad() {
    resetCreationDate()
    await updateMembershipDropdown();
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

async function updateMembershipDropdown() {
    membershipTypes = new Map();

    var response = await fetch(urlMembershipType);
    var data = await response.json();

    if (!response.ok) return;

    membershipTypeList = [];

    var selectors = ["creation-membership-type", "object-view-membership-type"]

    selectors.forEach(selectorId => {
        let selector = document.getElementById(selectorId);
        selector.innerHTML = "";

        data.forEach(thing => {
            let element = document.createElement("option");
            element.setAttribute("value", thing.id);
            element.innerHTML = thing.name;
            selector.appendChild(element);
    
            membershipTypes.set(thing.id, thing.name);
        });
    });
}


async function updateObjectView(id) {
    switchViews(false);
    selectedObject = id;
    const responseMember = await fetch(urlMember + "/" + id);
    const responseContactInfo = await fetch(urlContactInfo + "/" + id);

    const jsonMember = await responseMember.json();

    document.getElementById("object-view-first-name").value = jsonMember.firstName;
    document.getElementById("object-view-last-name").value = jsonMember.lastName;
    document.getElementById("object-view-date-joined").value = new Date(jsonMember.dateJoined).toISOString().split("T")[0];
    document.getElementById("object-view-membership-type").value = jsonMember.membershipTypeId;

    var email = "";
    var phoneNumber = "";
    if (responseContactInfo.ok) {
        const jsonContactInfo = await responseContactInfo.json();

        email = jsonContactInfo.email;
        phoneNumber = jsonContactInfo.phoneNumber;
    }
    document.getElementById("object-view-email").value = email;
    document.getElementById("object-view-phone-number").value = phoneNumber;
    

}

async function updateObjectList(search) {
    var response;
    if (search.length == 0) response = await fetch(urlMember + "/limit/25");
    else response = await fetch(urlMember + "/limit/25/" + search);
    var data = await response.json();

    if (!response.ok) return;

    eventList = [];

    document.getElementById("object-explorer").innerHTML = "";

    data.forEach(thing => {
        let newThing;
        eventList.push(newThing = new ObjectListElement(thing.id, thing.firstName, thing.lastName, thing.dateJoined, thing.membershipTypeId));
        newThing.createElement();
    });
}

function trySearch(element) {
    if (event.key === "Enter") {
        activeSearch = element.value;
        updateObjectList(activeSearch);
    } 
}

class ObjectListElement {
    constructor(id, firstName, lastName, dateJoined, membershipTypeId) {
        this.id = id;
        this.firstName = firstName;
        this.lastName = lastName;
        this.date = new Date(dateJoined);
        this.membershipTypeId = membershipTypeId;
    }

    createElement() {
        var outer = document.getElementById("object-explorer");

        var input = document.createElement("input");
        input.type = "radio";
        input.name = "selected-object";
        input.id = "object-selector-label-" + this.id;

        outer.appendChild(input);

        var element = document.createElement("label");

        element.setAttribute("for", input.id);

        var div = document.createElement("div");
        var h6_Name = document.createElement("h6");
        var p_Date = document.createElement("p");
        var p_LowerText = document.createElement("p");

        h6_Name.innerHTML = this.firstName + " " + this.lastName;
        p_Date.innerHTML = this.date.getFullYear() + "/" + (this.date.getMonth()+1) + "/" + this.date.getDate();
        p_LowerText.innerHTML = membershipTypes.get(this.membershipTypeId);

        div.appendChild(h6_Name);
        div.appendChild(p_Date);

        element.appendChild(div);
        element.appendChild(p_LowerText);

        element.setAttribute("onclick", "selectObject(this)");

        outer.appendChild(element);
    }
}

function toggleEdit(checked) {
    if (!checked) {
        document.getElementById("edit-switch").checked = false;
        document.getElementById("edit-status-text").innerHTML = "";
    }

    setEnabled("object-view-first-name", checked);
    setEnabled("object-view-last-name", checked);
    setEnabled("object-view-date-joined", checked);
    setEnabled("object-view-membership-type", checked);
    setEnabled("object-view-email", checked);
    setEnabled("object-view-phone-number", checked);
}

function setEnabled(id, enabled) {
    enabled ? document.getElementById(id).removeAttribute("disabled") : document.getElementById(id).setAttribute("disabled", true);
}

async function isValidObject(id) {
    if (id > 0) {
        const result = await fetch(urlMember + "/" + id, {
            signal: AbortSignal.timeout(2000)
        }).catch((error) => {
            console.log("Error: " + error);
            return false;
        });
        if (result.ok) return true;
    }
    return false;
}

async function attemptCreateObject(element) {
    await attemptAlterObject(element, "POST", null, true) ? document.getElementById("create-status-text").innerHTML = "Success!" : document.getElementById("create-status-text").innerHTML = "Error.";
}

async function attemptEditObject(element) {
    var success = await attemptAlterObject(element, "PUT", selectedObject, false);
    success ? document.getElementById("edit-status-text").innerHTML = "Success!" : document.getElementById("edit-status-text").innerHTML = "Error.";
    if (success) {
        toggleEdit(false);
        updateObjectView(selectedObject);
    }
    else document.getElementById("edit-status-text").innerHTML = "Error.";
}

async function attemptAlterObject(element, method, id, reset) {
    var formData = new FormData(element);

    const memberResult = await fetch(urlMember, {
        method: method,
        headers: {
            'Access-Control-Allow-Origin': "*",
            'Content-Type': "application/json"
        },
        body: JSON.stringify({
            firstName: formData.get("first-name"),
            lastName: formData.get("last-name"),
            dateJoined: formData.get("date-joined") + "T12:00",
            membershipTypeId: formData.get("membership-type"),
            id: id
        }),
        mode: 'cors',
        signal: AbortSignal.timeout(2000)
    }).catch(error => {
        console.log("Error: " + error);
        return false;
    });

    if (memberResult.ok) {
        let json = await memberResult.json();

        const contactInfoResult = await fetch(urlContactInfo, {
            method: method,
            headers: {
                'Access-Control-Allow-Origin': "*",
                'Content-Type': "application/json"
            },
            body: JSON.stringify({
                memberId: json.id,
                email: formData.get("email"),
                phoneNumber: formData.get("phone-number"),
            }),
            mode: 'cors',
            signal: AbortSignal.timeout(2000)
        }).catch(error => {
            console.log("Error: " + error);
            return false;
        });

        if (contactInfoResult.ok) {
            if (reset) {
                element.reset();
                resetCreationDate()
                updateObjectList(activeSearch);
            }

            return true;
        } else return false;
    }
}

function trySearch(element) {
    if (event.key === "Enter") {
        activeSearch = element.value;
        updateObjectList(activeSearch);
    } 
}

function resetCreationDate() {
    document.getElementById("creation-date-joined").setAttribute("value", new Date().toISOString().split("T")[0]);
}