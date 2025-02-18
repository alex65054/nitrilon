const urlCampaign = "https://localhost:7160/api/Campaign";
const urlMember = "https://localhost:7160/api/Member";
var selectedObject;
var activeSearch = "";

async function initialize() {

}

async function isValidObject(id) {
    return await checkValidity(id, urlCampaign);
}

async function updateObjectView(id) {
    switchViews(false);
    selectedObject = id;
    // const responseMember = await fetch(urlMember + "/" + id);
    // const responseContactInfo = await fetch(urlContactInfo + "/" + id);

    // const jsonMember = await responseMember.json();

    // document.getElementById("object-view-first-name").value = jsonMember.firstName;
    // document.getElementById("object-view-last-name").value = jsonMember.lastName;
    // document.getElementById("object-view-date-joined").value = new Date(jsonMember.dateJoined).toISOString().split("T")[0];
    // document.getElementById("object-view-membership-type").value = jsonMember.membershipTypeId;

    // var email = "";
    // var phoneNumber = "";
    // if (responseContactInfo.ok) {
    //     const jsonContactInfo = await responseContactInfo.json();

    //     email = jsonContactInfo.email;
    //     phoneNumber = jsonContactInfo.phoneNumber;
    // }
    // document.getElementById("object-view-email").value = email;
    // document.getElementById("object-view-phone-number").value = phoneNumber;
}

function toggleEdit(checked) {
    
}

async function updateObjectList(search) {
    var response;
    if (search.length == 0) response = await fetch(urlCampaign + "/limit/25");
    else response = await fetch(urlCampaign + "/limit/25/" + search);
    var data = await response.json();

    if (!response.ok) return;

    document.getElementById("object-explorer").innerHTML = "";

    data.forEach(thing => {
        createElementInObjectList(thing.id, thing.name, thing.dateCreated, thing.gameMaster);
    });
}

async function attemptCreateObject(element) {
    var formData = new FormData(element);

    const result = await fetch(urlCampaign, {
        method: 'POST',
        headers: {
            'Access-Control-Allow-Origin': "*",
            'Content-Type': "application/json"
        },
        body: JSON.stringify({
            name: formData.get("name"),
            description: formData.get("description"),
            gameMaster: formData.get("gameMaster")
        }),
        mode: 'cors',
        signal: AbortSignal.timeout(2000)
    }).catch(error => {
        console.log("Error: " + error);
        return false;
    });

    if (result.ok) {
        document.getElementById("create-status-text").innerHTML = "Success!";
        element.reset();
        updateEventList(activeSearch);
        return true;
    }
    else document.getElementById("create-status-text").innerHTML = "Error."
    return false;
}