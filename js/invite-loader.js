// =========================================================
// LITTLE INVITES — SHORT LINK LOADER (index.html)
// If the link looks like  index.html?i=john-k7m2x  this file
// loads that invitation from Firebase and fills in the page.
// Old long links (?guest=...&title=...) still work as before
// because this file does nothing when there is no ?i= code.
// =========================================================

(function () {
    "use strict";

    var code = new URLSearchParams(window.location.search).get("i");
    if (!code) return;                       // not a short link → main.js handles it

    code = code.toLowerCase().replace(/[^a-z0-9-]/g, "");

    var cfg = window.LI_FIREBASE;
    var configured = cfg && cfg.projectId && cfg.apiKey &&
                     cfg.projectId.indexOf("PASTE_") !== 0 &&
                     cfg.apiKey.indexOf("PASTE_") !== 0;

    function setText(id, text) {
        var el = document.getElementById(id);
        if (el && text) el.textContent = text;
    }

    function showNotFound(reason) {
        function apply() {
            setText("eventTitle", "Invitation not found");
            setText("guestName", "Guest");
            setText("message", reason);
            var date = document.getElementById("eventDate");
            var venue = document.getElementById("eventVenue");
            var actions = document.querySelector(".letter-actions");
            if (date) date.style.display = "none";
            if (venue) venue.style.display = "none";
            if (actions) actions.style.display = "none";
        }
        apply();
        window.addEventListener("load", apply);
    }

    if (!code || !configured) {
        showNotFound("This invitation link is not set up correctly. Please contact the host.");
        return;
    }

    var url = "https://firestore.googleapis.com/v1/projects/" + cfg.projectId +
              "/databases/(default)/documents/invites/" + code + "?key=" + cfg.apiKey;

    function readField(fields, name) {
        var f = fields && fields[name];
        return f && typeof f.stringValue === "string" ? f.stringValue : "";
    }

    function applyInvite(data) {
        setText("guestName", data.guest);
        setText("eventTitle", data.title);
        setText("message", data.message);
        setText("eventDate", data.date);
        setText("eventVenue", data.venue);

        var mapLink = document.getElementById("mapLink");
        if (mapLink && data.map) {
            mapLink.href = data.map;
            mapLink.classList.remove("hidden");
        }
        if (data.title) document.title = data.title + " | You're Invited";
    }

    fetch(url)
        .then(function (res) {
            if (res.status === 404) throw new Error("notfound");
            if (!res.ok) throw new Error("error");
            return res.json();
        })
        .then(function (doc) {
            var f = doc.fields || {};
            var data = {
                guest:   readField(f, "guest"),
                title:   readField(f, "title"),
                date:    readField(f, "date"),
                venue:   readField(f, "venue"),
                message: readField(f, "message"),
                map:     readField(f, "map"),
                phone:   readField(f, "phone")
            };

            window.LI_INVITE = data;          // rsvp.js reads the host number from here
            applyInvite(data);
            // main.js may fill defaults after the page loads → apply once more
            window.addEventListener("load", function () { applyInvite(data); });
        })
        .catch(function (err) {
            showNotFound(err.message === "notfound"
                ? "We couldn't find this invitation. Please check the link or contact the host."
                : "We couldn't load this invitation right now. Please try again in a moment.");
        });
})();
