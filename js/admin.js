// =========================================================
// LITTLE INVITES — ADMIN STUDIO
// Builds a personalized link to index.html and lets you
// copy it or preview it.
// =========================================================

// URL parameter names sent to index.html.
// These MUST match what js/main.js reads from the URL.
// If your main.js uses different names, change only the
// values on the right (e.g. guest: "name").
const PARAM_NAMES = {
    guest:   "guest",
    title:   "title",
    date:    "date",
    venue:   "venue",
    message: "message",
    map:     "map",
    phone:   "phone"   // host WhatsApp number, used by js/rsvp.js
};

const form         = document.getElementById("inviteForm");
const generatedBox = document.getElementById("generated");
const urlInput     = document.getElementById("generatedUrl");
const copyButton   = document.getElementById("copyButton");
const copyStatus   = document.getElementById("copyStatus");
const previewLink  = document.getElementById("previewLink");

let statusTimer = null;

function getValue(id) {
    const field = document.getElementById(id);
    if (!field) return "";
    const value = field.value.trim();

    // WhatsApp numbers: keep digits only, drop a leading 00
    if (id === "phone") {
        return value.replace(/\D/g, "").replace(/^00/, "");
    }
    return value;
}

function buildInvitationUrl() {
    // index.html sits next to admin.html, so this works on
    // Live Server and on GitHub Pages (including sub-folders).
    const url = new URL("index.html", window.location.href);

    Object.keys(PARAM_NAMES).forEach(function (id) {
        const value = getValue(id);
        if (value !== "") {
            url.searchParams.set(PARAM_NAMES[id], value);
        }
    });

    return url.toString();
}

function showStatus(text) {
    copyStatus.textContent = text;
    clearTimeout(statusTimer);
    statusTimer = setTimeout(function () {
        copyStatus.textContent = "";
    }, 2500);
}

form.addEventListener("submit", function (event) {
    event.preventDefault();

    const phoneField = document.getElementById("phone");
    const phoneDigits = getValue("phone");
    if (phoneDigits.length < 8 || phoneDigits.length > 15) {
        phoneField.setCustomValidity("Please enter the number with country code, digits only.");
        phoneField.reportValidity();
        return;
    }
    phoneField.setCustomValidity("");

    const finalUrl = buildInvitationUrl();

    urlInput.value = finalUrl;
    previewLink.href = finalUrl;
    copyStatus.textContent = "";
    generatedBox.classList.remove("hidden");

    generatedBox.scrollIntoView({ behavior: "smooth", block: "nearest" });
});

copyButton.addEventListener("click", async function () {
    const text = urlInput.value;
    if (!text) return;

    try {
        await navigator.clipboard.writeText(text);
        showStatus("Link copied ✓");
    } catch (error) {
        // Fallback for browsers/contexts without the Clipboard API
        urlInput.focus();
        urlInput.select();
        urlInput.setSelectionRange(0, text.length);
        try {
            document.execCommand("copy");
            showStatus("Link copied ✓");
        } catch (err) {
            showStatus("Press Ctrl+C to copy");
        }
    }
});

// Clear any validation message as soon as the host edits the number
document.getElementById("phone").addEventListener("input", function (e) {
    e.target.setCustomValidity("");
});

// Clicking the link box selects it, handy on phones
urlInput.addEventListener("focus", function () {
    urlInput.select();
});
