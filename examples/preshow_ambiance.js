// Pre-Show Ambiance Script
// Soft blue lighting for before a show starts
// Run this script, it will fade in and stay on

var TOTAL_SEGMENTS = 128;

// === FUNCTIONS ===

function setSegment(index, r, g, b) {
    Ds.SendStringCommand("coveLights segment " + index + " " + r + " " + g + " " + b);
}

function setAll(r, g, b) {
    for (var i = 0; i < TOTAL_SEGMENTS; i++) {
        setSegment(i, r, g, b);
    }
}

// Fade to a color over time
function fadeAll(toR, toG, toB, durationSec) {
    for (var i = 0; i < TOTAL_SEGMENTS; i++) {
        Ds.SendStringCommand("coveLights segment " + i + " " + toR + " " + toG + " " + toB + " duration " + durationSec);
    }
    Ds.Wait(durationSec);
}

// === PRE-SHOW SEQUENCE ===

Ds.SendMessageStatus("Starting pre-show ambiance...");

// Ensure starting from off
setAll(0, 0, 0);

// Fade to soft blue over 3 seconds
fadeAll(20, 40, 80, 3);

Ds.SendMessageStatus("Pre-show ambiance active (soft blue)");
Ds.SendMessageStatus("Lights will remain on until another script runs");
