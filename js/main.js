
(() => {

    // Read personalized invitation details from the URL
    const params = new URLSearchParams(window.location.search);

    const get = (key, fallback) => {
        return params.get(key) || fallback;
    };

    const guest = get("guest", "Guest");

    const title = get(
        "title",
        "A Special Celebration"
    );

    const date = get(
        "date",
        "Date to be announced"
    );

    const venue = get(
        "venue",
        "Venue details to follow"
    );

    const message = get(
        "message",
        "It would mean so much to have you celebrate this special day with us."
    );


    // Display invitation information
    document.getElementById("guestName").textContent = guest;

    document.getElementById("eventTitle").textContent = title;

    document.getElementById("eventDate").textContent = date;

    document.getElementById("eventVenue").textContent = venue;

    document.getElementById("message").textContent = message;


    // Google Maps link
    const map = params.get("map");

    if (map) {

        try {

            const parsed = new URL(map);

            if (
                parsed.protocol === "https:" ||
                parsed.protocol === "http:"
            ) {

                const link = document.getElementById("mapLink");

                link.href = parsed.href;

                link.classList.remove("hidden");

            }

        } catch (error) {

            console.log("Invalid Google Maps link.");

        }

    }


    // Envelope animation
    const envelope = document.getElementById("envelope");

    const openButton = document.getElementById("openButton");

    const hint = document.getElementById("hint");


    // Function to open invitation
    const openInvitation = () => {

        envelope.classList.add("open");

        document.body.classList.add("is-open");

        openButton.classList.add("hidden");

        hint.textContent = "A special invitation, just for you.";

    };


    // Open using button
    openButton.addEventListener(
        "click",
        openInvitation
    );


    // Open using wax seal
    document.querySelector(".wax-seal").addEventListener(
        "click",
        openInvitation
    );


    // RSVP email links
    const subject = encodeURIComponent("RSVP: " + title);


    // Accept invitation
    document.getElementById("rsvpYes").href =
        "mailto:?subject=" +
        subject +
        "&body=" +
        encodeURIComponent(
            "I am happy to accept the invitation. - " + guest
        );


    // Decline invitation
    document.getElementById("rsvpNo").href =
        "mailto:?subject=" +
        subject +
        "&body=" +
        encodeURIComponent(
            "Thank you for the invitation. Unfortunately, I cannot attend. - " + guest
        );


})();
