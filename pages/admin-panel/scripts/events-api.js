const urlEventRating = "https://localhost:7160/api/EventRating";
const urlEvent = "https://localhost:7160/api/Event";
var selectedEvent;
var activeSearch = "";

async function initialize() {

}

async function isValidObject(id) {
    return await checkValidity(id, urlEvent);
}

async function updateObjectView(eventId) {
    switchViews(false);
    var responses = [];
    var total = 0;
    var overall = 0;

    for (var i = 1; i < 4; i++) {
        const response = await fetch(urlEventRating + "/GetRatingsFromEvent/" + eventId + "/" + i);
        const json = await response.json();
        const length = json.length;
        total += length;
        overall += ((i-1)*length)*50;

        responses.push(json);
        document.getElementById("feedback-individual-display-amount-" + i).innerHTML = length;
    }
    
    for (var i = 1; i < responses.length+1; i++) {
        document.getElementById("feedback-individual-display-percentage-" + i).innerHTML = ((responses[i-1].length/total)*100).toFixed(0) + "%";
    }

    overall = (overall/total).toFixed(0);

    const overallDisplayElement = document.getElementById("overall-rating-display");
    overallDisplayElement.innerHTML = overall;
    if (overall > 75) {
        overallDisplayElement.setAttribute("class", "color-green");
    } else if (overall > 40) {
        overallDisplayElement.setAttribute("class", "color-yellow");
    } else {
        overallDisplayElement.setAttribute("class", "color-red");
    }
}

async function updateObjectList(search) {
    var response;
    if (search.length == 0) response = await fetch(urlEvent + "/limit/25");
    else response = await fetch(urlEvent + "/limit/25/" + search);
    var data = await response.json();

    if (!response.ok) return;

    document.getElementById("object-explorer").innerHTML = "";

    data.forEach(thing => {
        createElementInObjectList(thing.id, thing.name, thing.time, thing.location);
    });
}

async function attemptCreateObject(element) {
    var formData = new FormData(element);

    const result = await fetch(urlEvent, {
        method: 'POST',
        headers: {
            'Access-Control-Allow-Origin': "*",
            'Content-Type': "application/json"
        },
        body: JSON.stringify({
            name: formData.get("name"),
            description: formData.get("description"),
            location: formData.get("location"),
            time: (formData.get("date") + "T" + formData.get("time"))
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
        updateObjectList(activeSearch);
        return true;
    }
    else document.getElementById("create-status-text").innerHTML = "Error."
    return false;
}

function toggleEdit(checked) {
    
}