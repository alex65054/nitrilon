const urlMembers = "https://localhost:7160/api/Event";
var selectedEvent;
var memberList;

async function onLoad() {
    await updateMemberList("");

    stateChanged();
}


async function updateObjectView(id) {

}

async function updateMemberList(search) {
    var response;
    if (search.length == 0) response = await fetch(urlMembers + "/limit/25");
    else response = await fetch(urlMembers + "/limit/25/" + search);
    var data = await response.json();

    if (!response.ok) return;

    eventList = [];

    document.getElementById("object-explorer").innerHTML = "";

    data.forEach(thing => {
        let newThing;
        eventList.push(newThing = new EventListObject(thing.id, thing.name, thing.time, thing.location, thing.description));
        newThing.createElement();
    });

}

class EventListObject {
    constructor(id, firstName, lastName, dateJoined, ) {
        this.id = id;
        this.firstName = firstNAme;
        this.lastName = lastName;
        this.date = new Date(date);
        this.location = location;
        this.description = description;
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
        var p_Location = document.createElement("p");

        h6_Name.innerHTML = this.firstName + " " + lastName;
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