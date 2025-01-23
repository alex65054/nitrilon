const urlEventRating = "https://localhost:7160/api/EventRating";
const urlEvent = "https://localhost:7160/api/Event";
var selectedEvent;
var eventList;

class EventListObject {
    constructor(id, name, date, location, description) {
        this.id = id;
        this.name = name;
        this.date = new Date(date);
        this.location = location;
        this.description = description;
    }

    createElement() {
        var outer = document.getElementById("event-explorer");

        var input = document.createElement("input");
        input.type = "radio";
        input.name = "selected-event";
        input.id = "event-selector-label-" + this.id;

        outer.appendChild(input);

        var element = document.createElement("label");

        element.setAttribute("for", input.id);

        var div = document.createElement("div");
        var h6_Name = document.createElement("h6");
        var p_Date = document.createElement("p");
        var p_Location = document.createElement("p");

        h6_Name.innerHTML = this.name;
        p_Date.innerHTML = this.date.getFullYear() + "/" + this.date.getMonth() + "/" + this.date.getDay();
        p_Location.innerHTML = this.location;

        div.appendChild(h6_Name);
        div.appendChild(p_Date);

        element.appendChild(div);
        element.appendChild(p_Location);

        element.setAttribute("onclick", "selectEvent(this)");

        outer.appendChild(element);
    }
}

async function onLoad() {
    updateEventList();
}

function selectEvent(element) {
    var eventId = element.getAttribute("for").substring(21);
    
    updateFeedbackView(eventId)
}

async function updateFeedbackView(eventId) {
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
        console.log(responses[i-1].length + " / " + total);
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

async function updateEventList() {
    const response = await fetch(urlEvent);
    var data = await response.json();

    if (!response.ok) return;

    eventList = [];

    document.getElementById("event-explorer").innerHTML = "";

    data.forEach(thing => {
        let newThing;
        eventList.push(newThing = new EventListObject(thing.id, thing.name, thing.time, thing.location, thing.description));
        newThing.createElement();
    });
}