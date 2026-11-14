// =========================================================
// LITTLE INVITES — RSVP via WhatsApp
// Handles "Accept invitation" and "Sorry, can't attend".
// Works alongside js/main.js (it reads the guest name and
// event title from the page, so it does not depend on how
// main.js reads the URL).
// The host's number comes from the ?phone= link parameter.
// =========================================================

(function () {
    "use strict";

    var yesBtn = document.getElementById("rsvpYes");
    var noBtn  = document.getElementById("rsvpNo");
    if (!yesBtn || !noBtn) return;

    var modal, state = { type: "yes", guests: 1 };

    // ---------- helpers ----------
    function getText(id, fallback) {
        var el = document.getElementById(id);
        var t = el ? el.textContent.trim() : "";
        return t || fallback;
    }

    function hostPhone() {
        // Short links: number comes from the saved invitation (invite-loader.js).
        // Old long links: number comes from ?phone= in the address.
        var raw = (window.LI_INVITE && window.LI_INVITE.phone) ||
                  new URLSearchParams(window.location.search).get("phone") || "";
        return raw.replace(/\D/g, "").replace(/^00/, "");
    }

    function buildMessage() {
        var guest = getText("guestName", "a guest");
        var title = getText("eventTitle", "your event");

        if (state.type === "yes") {
            return "Hello! This is " + guest + ". I'm happy to accept the invitation to \"" +
                   title + "\". Number of guests attending: " + state.guests + ". 🎉";
        }
        return "Hello! This is " + guest + ". Thank you so much for inviting me to \"" +
               title + "\". Unfortunately I can't attend. 💛";
    }

    // ---------- modal ----------
    function buildModal() {
        modal = document.createElement("div");
        modal.className = "rsvp-overlay rsvp-hidden";
        modal.innerHTML =
            '<div class="rsvp-card" role="dialog" aria-modal="true" aria-labelledby="rsvpTitle">' +
                '<button class="rsvp-close" type="button" aria-label="Close">×</button>' +
                '<div class="rsvp-body"></div>' +
            '</div>';
        document.body.appendChild(modal);

        modal.addEventListener("click", function (e) {
            if (e.target === modal || e.target.classList.contains("rsvp-close")) closeModal();
        });
        document.addEventListener("keydown", function (e) {
            if (e.key === "Escape" && !modal.classList.contains("rsvp-hidden")) closeModal();
        });
    }

    function body() { return modal.querySelector(".rsvp-body"); }

    function openModal() {
        modal.classList.remove("rsvp-hidden");
        document.body.classList.add("rsvp-lock");
        var focusable = modal.querySelector("button.rsvp-send, .rsvp-close");
        if (focusable) focusable.focus();
    }

    function closeModal() {
        modal.classList.add("rsvp-hidden");
        document.body.classList.remove("rsvp-lock");
    }

    function showChoice(type) {
        state.type = type;
        state.guests = 1;
        var guest = getText("guestName", "friend");
        var html;

        if (type === "yes") {
            html =
                '<h3 id="rsvpTitle">Wonderful, ' + escapeHtml(guest) + '! 🎉</h3>' +
                '<p>How many guests will attend (including you)?</p>' +
                '<div class="rsvp-stepper">' +
                    '<button type="button" class="rsvp-step" data-step="-1" aria-label="Fewer guests">−</button>' +
                    '<span class="rsvp-count" id="rsvpCount" aria-live="polite">1</span>' +
                    '<button type="button" class="rsvp-step" data-step="1" aria-label="More guests">+</button>' +
                '</div>' +
                '<button type="button" class="rsvp-send rsvp-send-yes">Send reply on WhatsApp</button>';
        } else {
            html =
                '<h3 id="rsvpTitle">We\'ll miss you 💛</h3>' +
                '<p>Let the host know you can\'t make it?</p>' +
                '<button type="button" class="rsvp-send rsvp-send-no">Send reply on WhatsApp</button>';
        }

        body().innerHTML = html;

        var steps = body().querySelectorAll(".rsvp-step");
        for (var i = 0; i < steps.length; i++) {
            steps[i].addEventListener("click", function (e) {
                var delta = parseInt(e.currentTarget.getAttribute("data-step"), 10);
                state.guests = Math.min(20, Math.max(1, state.guests + delta));
                document.getElementById("rsvpCount").textContent = state.guests;
            });
        }
        body().querySelector(".rsvp-send").addEventListener("click", sendReply);
        openModal();
    }

    function showThanks() {
        var yes = state.type === "yes";
        body().innerHTML =
            '<h3 id="rsvpTitle">' + (yes ? "Thank you! 🎉" : "Thank you for letting us know 💛") + '</h3>' +
            '<p>' + (yes
                ? "We can't wait to celebrate with you."
                : "You will be missed. Warm wishes to you.") + '</p>' +
            '<button type="button" class="rsvp-send rsvp-send-done">Close</button>' +
            '<button type="button" class="rsvp-again">Change my reply</button>';
        body().querySelector(".rsvp-send-done").addEventListener("click", closeModal);
        body().querySelector(".rsvp-again").addEventListener("click", function () {
            showChoice(yes ? "no" : "yes");
        });
    }

    function showNoHost() {
        body().innerHTML =
            '<h3 id="rsvpTitle">Reply not sent</h3>' +
            '<p>This invitation has no host WhatsApp number, so there is nowhere to send your reply. ' +
            'Please contact the host directly.</p>' +
            '<button type="button" class="rsvp-send rsvp-send-done">Close</button>';
        body().querySelector(".rsvp-send-done").addEventListener("click", closeModal);
    }

    function sendReply() {
        var phone = hostPhone();
        if (!phone) { showNoHost(); return; }

        var url = "https://wa.me/" + phone + "?text=" + encodeURIComponent(buildMessage());
        var opened = window.open(url, "_blank", "noopener");
        if (!opened) { window.location.href = url; return; }  // popup blocked → same tab
        showThanks();
    }

    function escapeHtml(str) {
        return String(str).replace(/[&<>"']/g, function (c) {
            return { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c];
        });
    }

    // ---------- wire up the two buttons ----------
    // main.js may have set these links to open email (mailto:) or another
    // page. We (1) reset them to harmless "#" links, and (2) catch the click
    // at the very top of the page (capture phase) so nothing else can run.
    function neutralize(btn) {
        btn.setAttribute("href", "#");
        btn.removeAttribute("target");
    }

    function catchClicks(e) {
        var type = null;
        if (e.target.closest("#rsvpYes")) type = "yes";
        else if (e.target.closest("#rsvpNo")) type = "no";
        if (!type) return;

        e.preventDefault();
        e.stopImmediatePropagation();
        showChoice(type);
    }

    buildModal();
    neutralize(yesBtn);
    neutralize(noBtn);
    // main.js may fill the links in after the page loads, so reset again
    window.addEventListener("load", function () { neutralize(yesBtn); neutralize(noBtn); });
    setTimeout(function () { neutralize(yesBtn); neutralize(noBtn); }, 500);

    document.addEventListener("click", catchClicks, true);
})();
