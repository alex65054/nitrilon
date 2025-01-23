const urlEventRating = "https://localhost:7160/api/EventRating";
const urlEvent = "https://localhost:7160/api/Event";
var eventId;

async function onLoad() {
    console.log("Connecting to API...");
    const urlParams = new URLSearchParams(window.location.search);
    let id = urlParams.get("eventId");
    let darkMode = urlParams.get("darkMode");
    if (darkMode != null) document.getElementById("dark-mode-switch").checked = true;
    else document.getElementById("dark-mode-switch").checked = false;

    const valid = await isValidEvent(id);

    if (!valid) {
        showMessage(false, "Invalid event.", false);
        console.log("Event ID is invalid.");
    }
    else {
        eventId = id;
        console.log("Connected to API and validated Event ID.");
    }
}

async function clickedFeedback(rating, element) {
    element.style.scale = 1.1;

    const success = await attemptFeedback(rating, eventId);

    showMessage(success, success ? "Tak!" : "Fejl.", true);
    
    setTimeout(function() {
        element.style.scale = 1;
    }, 500);
}

function showMessage(success, message, disappear) {
    setMessage(success, message);

    let feedbackContainer = document.getElementById("feedback-response-container");

    feedbackContainer.style.animation = "fadeIn 250ms";
    feedbackContainer.style.visibility = "visible";

    if (disappear)
    {
        let progressBar = document.getElementById("feedback-progress-bar");
        progressBar.style.animation = "progressBar 2s";

        setTimeout(function() {
            feedbackContainer.style.animation = "fadeOut 250ms";
        }, 2000);

        setTimeout(function() {
            feedbackContainer.style.visibility = "hidden";
            progressBar.style.animation = "none";
        }, 2250);
    }
}

async function attemptFeedback(rating, eventId) {
    const result = await fetch(urlEventRating, {
        method: 'POST',
        headers: {
            'Access-Control-Allow-Origin': "*",
            'Content-Type': "application/json"
        },
        body: JSON.stringify({
            eventId: eventId,
            rating: rating
        }),
        mode: 'cors',
        signal: AbortSignal.timeout(2000)
    }).catch(error => {
        console.log("Error: " + error);
        return false;
    });

    if (result.ok) {
        return true;
    } else {
        return false;
    }
}

function setMessage(isSuccessful, message) {
    let cross = document.getElementById("feedback-failure");
    let check = document.getElementById("feedback-success");
    let messageElement = document.getElementById("feedback-response");
    
    messageElement.innerHTML = message;
    isSuccessful ? check.style.display = "block" : check.style.display = "none";
    isSuccessful ? cross.style.display = "none" : cross.style.display = "block";
}

async function isValidEvent(eventId) {
    if (eventId > 0) {
        const result = await fetch(urlEvent + "/" + eventId, {
            signal: AbortSignal.timeout(2000)
        }).catch((error) => {
            console.log("Error: " + error);
            return false;
        });
        if (result.ok) return true;
    }
    else return false;
}