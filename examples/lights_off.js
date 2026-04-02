// Lights Off Script
// Fades lights to off smoothly
// Run this at the end of a show

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

// Hardware-accelerated fade
function fadeAll(toR, toG, toB, durationSec) {
    for (var i = 0; i < TOTAL_SEGMENTS; i++) {
        Ds.SendStringCommand("coveLights segment " + i + " " + toR + " " + toG + " " + toB + " duration " + durationSec);
    }
    Ds.Wait(durationSec);
}

// === FADE TO OFF ===

Ds.SendMessageStatus("Fading lights to off (hardware fade)...");

// Fade to off over 2 seconds using HARDWARE
fadeAll(0, 0, 0, 2);

Ds.SendMessageStatus("Lights off");
