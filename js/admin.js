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
    map:     "map"
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
    return field ? field.value.trim() : "";
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

// Clicking the link box selects it, handy on phones
urlInput.addEventListener("focus", function () {
    urlInput.select();
});