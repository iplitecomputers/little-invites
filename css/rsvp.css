/* LITTLE INVITES — RSVP pop-up (used by js/rsvp.js) */

.rsvp-hidden { display: none !important; }
body.rsvp-lock { overflow: hidden; }

.rsvp-overlay {
    position: fixed;
    inset: 0;
    z-index: 9999;
    display: flex;
    align-items: center;
    justify-content: center;
    padding: 16px;
    background: rgba(59, 47, 42, 0.55);
    backdrop-filter: blur(3px);
}

.rsvp-card {
    position: relative;
    width: min(380px, 100%);
    padding: 34px 26px 26px;
    text-align: center;
    background: #fffaf4;
    border-radius: 24px;
    border-top: 6px solid transparent;
    border-image: linear-gradient(90deg,#008f7e,#ffd36b,#4a7fb0,#f48a8a,#e03a1e,#94b878) 1;
    box-shadow: 0 24px 60px rgba(60, 30, 10, 0.35);
    font-family: "Nunito", system-ui, sans-serif;
    color: #3b2f2a;
    animation: rsvp-pop 0.28s ease;
}

@keyframes rsvp-pop {
    from { opacity: 0; transform: translateY(14px) scale(0.97); }
    to   { opacity: 1; transform: none; }
}

.rsvp-card h3 {
    margin: 0 0 8px;
    font-family: "Fredoka", "Baloo 2", system-ui, sans-serif;
    font-weight: 600;
    font-size: 1.45rem;
}

.rsvp-card p { margin: 0 0 18px; color: #7a6a60; line-height: 1.5; }

.rsvp-close {
    position: absolute;
    top: 10px;
    right: 12px;
    width: 34px;
    height: 34px;
    border: 0;
    border-radius: 50%;
    background: transparent;
    font-size: 1.6rem;
    line-height: 1;
    color: #7a6a60;
    cursor: pointer;
}
.rsvp-close:hover { background: #f3e6d6; }

.rsvp-stepper {
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 18px;
    margin-bottom: 22px;
}

.rsvp-step {
    width: 46px;
    height: 46px;
    border-radius: 50%;
    border: 2px solid #ecdcc9;
    background: #fff;
    font-size: 1.5rem;
    color: #3b2f2a;
    cursor: pointer;
}
.rsvp-step:hover { border-color: #e9a63b; color: #cf8f22; }

.rsvp-count {
    min-width: 48px;
    font-family: "Fredoka", system-ui, sans-serif;
    font-size: 2.2rem;
    font-weight: 600;
}

.rsvp-send {
    width: 100%;
    padding: 14px 20px;
    border: 0;
    border-radius: 99px;
    font-family: "Fredoka", system-ui, sans-serif;
    font-size: 1.05rem;
    font-weight: 600;
    color: #fff;
    cursor: pointer;
    background: linear-gradient(180deg, #34c55f, #1fa14a);
    box-shadow: 0 8px 20px rgba(31, 161, 74, 0.35);
}
.rsvp-send-no   { background: linear-gradient(180deg, #8a99a8, #6a7a8a); box-shadow: 0 8px 20px rgba(80,95,110,0.3); }
.rsvp-send-done { background: linear-gradient(180deg, #f1b650, #cf8f22); box-shadow: 0 8px 20px rgba(207,143,34,0.35); }

.rsvp-again {
    margin-top: 12px;
    border: 0;
    background: none;
    font-family: "Fredoka", system-ui, sans-serif;
    color: #4a7fb0;
    text-decoration: underline;
    cursor: pointer;
}

.rsvp-send:focus-visible, .rsvp-step:focus-visible,
.rsvp-again:focus-visible, .rsvp-close:focus-visible {
    outline: 3px solid #4a7fb0;
    outline-offset: 2px;
}

@media (prefers-reduced-motion: reduce) { .rsvp-card { animation: none; } }
