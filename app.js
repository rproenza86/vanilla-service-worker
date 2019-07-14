if ('serviceWorker' in navigator) {
    navigator.serviceWorker.register("serviceworker.js");
    navigator.serviceWorker.addEventListener("message", event => {
        switch (event.data.action) {
            case "resources-updated":
                alert("The app is ready for an update. Please reload");
                break;
        }
    });
}

/**
 * This is another way to get the SW registration.
 *
 * On this use case we could claim the old SW client to be controlled by the new one notifying the
 * user or handling silently.
 */
if ('serviceWorker' in navigator) {
    navigator.serviceWorker.getRegistration()
        .then(registration => {
            registration.addEventListener("updatefound", event => {
                const swInstalling = registration.installing;
                swInstalling.addEventListener("statechange", () => {
                    if (swInstalling.state == 'installed') {
                        document.querySelector("output").innerHTML =
                            "A new Service Worker is installed and waiting";
                    } else {
                        document.querySelector("output").innerHTML =
                            "A new Service Worker is now controlling the page";
                    }
                });
            });
        })
        .catch(error => {

        });
}
// Unregister SW
function unregister() {
    navigator.serviceWorker.getRegistration()
        .then(registration => {
            registration.unregister();
        });
}



function sendMessageToSW(message) {
    if (navigator.serviceWorker.controller) {
        navigator.serviceWorker.controller.postMessage(message);
    } else {
        console.log("There is no SW controlling this page");
    }
}

function update() {
    sendMessageToSW({
        action: "update-resources"
    });
}


function vote(tourId) {
    if ('SyncManager' in window) {
        // We will use Background Sync
        navigator.serviceWorker.getRegistration()
            .then(registration => {
                registration.sync.register(`vote-${tourId}`);
            });
    } else {
        fetch(`/vote.json?id=${tourId}`)
            .then(r => r.json())
            .then(voted => {
                console.log('voted!')
            });
    }
}