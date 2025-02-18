const urlMember = "https://localhost:7160/api/Member";
const urlMembershipType = "https://localhost:7160/api/MembershipType";
const urlContactInfo = "https://localhost:7160/api/ContactInfo";
var membershipTypes = [];
var selectedObject;
var activeSearch = "";


async function initialize() {
    resetCreationDate()
    await updateMembershipDropdown();
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

    document.getElementById("object-explorer").innerHTML = "";

    data.forEach(thing => {
        createElementInObjectList(thing.id, thing.firstName + " " + thing.lastName, thing.dateJoined, membershipTypes.get(this.membershipTypeId));
    });
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

async function isValidObject(id) {
    return await checkValidity(id, urlMember);
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

function resetCreationDate() {
    document.getElementById("creation-date-joined").setAttribute("value", new Date().toISOString().split("T")[0]);
}