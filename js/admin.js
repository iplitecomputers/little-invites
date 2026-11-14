// =========================================================
// LITTLE INVITES — ADMIN STUDIO
// Saves the invitation to Firebase and gives you a SHORT link:
//   index.html?i=john-k7m2x
// If Firebase is not set up yet, it falls back to the old long
// link so the page keeps working.
// =========================================================

// Names used ONLY for the old long-link fallback.
const PARAM_NAMES = {
    guest:   "guest",
    title:   "title",
    date:    "date",
    venue:   "venue",
    message: "message",
    map:     "map",
    phone:   "phone"
};

const form         = document.getElementById("inviteForm");
const generatedBox = document.getElementById("generated");
const urlInput     = document.getElementById("generatedUrl");
const copyButton   = document.getElementById("copyButton");
const copyStatus   = document.getElementById("copyStatus");
const previewLink  = document.getElementById("previewLink");
const submitButton = form.querySelector('button[type="submit"]');
const noteText     = generatedBox.querySelector(".generated-note");

let statusTimer = null;

// ---------- helpers ----------
function getValue(id) {
    const field = document.getElementById(id);
    if (!field) return "";
    const value = field.value.trim();

    // WhatsApp numbers: digits only, drop a leading 00
    if (id === "phone") {
        return value.replace(/\D/g, "").replace(/^00/, "");
    }
    return value;
}

function firebaseReady() {
    const cfg = window.LI_FIREBASE;
    return !!(cfg && cfg.projectId && cfg.apiKey &&
              cfg.projectId.indexOf("PASTE_") !== 0 &&
              cfg.apiKey.indexOf("PASTE_") !== 0);
}

// "John Smith" → "johnsmith" (letters/numbers only, max 14)
function slugify(text) {
    return text.toLowerCase().replace(/[^a-z0-9]/g, "").slice(0, 14);
}

// Random 5 characters, no look-alike letters (0/o, 1/l/i)
function randomPart(length) {
    const alphabet = "abcdefghjkmnpqrstuvwxyz23456789";
    const bytes = new Uint8Array(length);
    crypto.getRandomValues(bytes);
    let out = "";
    for (let i = 0; i < length; i++) {
        out += alphabet[bytes[i] % alphabet.length];
    }
    return out;
}

function makeCode(guestName) {
    const slug = slugify(guestName) || "guest";
    return slug + "-" + randomPart(5);
}

function indexUrl() {
    // index.html sits next to admin.html (Live Server + GitHub Pages)
    return new URL("index.html", window.location.href);
}

function showStatus(text) {
    copyStatus.textContent = text;
    clearTimeout(statusTimer);
    statusTimer = setTimeout(function () { copyStatus.textContent = ""; }, 2500);
}

// ---------- old long link (fallback only) ----------
function buildLongUrl() {
    const url = indexUrl();
    Object.keys(PARAM_NAMES).forEach(function (id) {
        const value = getValue(id);
        if (value !== "") url.searchParams.set(PARAM_NAMES[id], value);
    });
    return url.toString();
}

// ---------- save to Firebase (Firestore REST) ----------
function toFields(data) {
    const fields = {};
    Object.keys(data).forEach(function (key) {
        fields[key] = { stringValue: String(data[key]) };
    });
    return { fields: fields };
}

async function saveInvite(data) {
    const cfg = window.LI_FIREBASE;

    for (let attempt = 0; attempt < 4; attempt++) {
        const code = makeCode(data.guest);
        const endpoint =
            "https://firestore.googleapis.com/v1/projects/" + cfg.projectId +
            "/databases/(default)/documents/invites?documentId=" + code +
            "&key=" + cfg.apiKey;

        const res = await fetch(endpoint, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(toFields(data))
        });

        if (res.ok) return code;
        if (res.status === 409) continue;      // code already used → try another

        let detail = "";
        try { detail = (await res.json()).error.message; } catch (e) {}
        throw new Error("Save failed (" + res.status + ") " + detail);
    }
    throw new Error("Could not create a unique code. Please try again.");
}

// ---------- form ----------
form.addEventListener("submit", async function (event) {
    event.preventDefault();

    const phoneField = document.getElementById("phone");
    const phoneDigits = getValue("phone");
    if (phoneDigits.length < 8 || phoneDigits.length > 15) {
        phoneField.setCustomValidity("Please enter the number with country code, digits only.");
        phoneField.reportValidity();
        return;
    }
    phoneField.setCustomValidity("");

    let finalUrl;

    if (firebaseReady()) {
        const data = {
            guest:     getValue("guest"),
            title:     getValue("title"),
            date:      getValue("date"),
            venue:     getValue("venue"),
            message:   getValue("message"),
            map:       getValue("map"),
            phone:     phoneDigits,
            createdAt: new Date().toISOString()
        };

        submitButton.disabled = true;
        const originalLabel = submitButton.textContent;
        submitButton.textContent = "Creating your link…";

        try {
            const code = await saveInvite(data);
            const url = indexUrl();
            url.searchParams.set("i", code);
            finalUrl = url.toString();
            noteText.textContent =
                "Short link ready. Send it to your guest; the details are stored safely online.";
        } catch (error) {
            console.error(error);
            alert("Sorry, the short link could not be created.\n\n" + error.message +
                  "\n\nCheck js/firebase-config.js and your Firebase rules.");
            return;
        } finally {
            submitButton.disabled = false;
            submitButton.textContent = originalLabel;
        }
    } else {
        // Firebase not set up yet → old long link
        finalUrl = buildLongUrl();
        noteText.textContent =
            "Firebase is not set up yet, so this is the long link. Add your Firebase " +
            "details in js/firebase-config.js to get short links.";
    }

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

document.getElementById("phone").addEventListener("input", function (e) {
    e.target.setCustomValidity("");
});

urlInput.addEventListener("focus", function () { urlInput.select(); });
