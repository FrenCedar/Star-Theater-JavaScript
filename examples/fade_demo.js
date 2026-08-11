// Fade Test - HARDWARE FADE VERSION
// Uses native "duration" parameter for buttery smooth fades!
// Much more efficient - let the hardware do the work!

var TOTAL_SEGMENTS = 128;

// === FUNCTIONS ===

function setSegment(index, r, g, b) {
    Ds.SendStringCommand("coveLights segment " + index + " " + r + " " + g + " " + b);
}

function setSegmentWithDuration(index, r, g, b, durationSec) {
    Ds.SendStringCommand("coveLights segment " + index + " " + r + " " + g + " " + b + " duration " + durationSec);
}

function setAll(r, g, b) {
    for (var i = 0; i < TOTAL_SEGMENTS; i++) {
        setSegment(i, r, g, b);
    }
}


// Hardware-accelerated fad
function fadeAllHardware(toR, toG, toB, durationSec) {

    for (var i = 0; i < TOTAL_SEGMENTS; i++) {
        Ds.SendStringCommand("coveLights segment " + i + " " + toR + " " + toG + " " + toB + " duration " + durationSec);
    }
    
    // Wait for the fade to complete
    Ds.Wait(durationSec);
}

// === TEST SEQUENCE ===

Ds.SendMessageStatus("Starting HARDWARE fade test...");
Ds.SendMessageStatus("Using native duration parameter!");

// Start from off
setAll(0, 0, 0);
Ds.Wait(1);

// Fade to red using HARDWARE
Ds.SendMessageStatus("Fading to red (10 seconds)...");
fadeAllHardware(100, 0, 0, 10);
Ds.SendMessageStatus("Red fade complete!");
Ds.Wait(1);

// Fade to blue using HARDWARE
Ds.SendMessageStatus("Fading to blue (10 seconds)...");
fadeAllHardware(0, 0, 100, 10);
Ds.SendMessageStatus("Blue fade complete!");
Ds.Wait(1);

// Fade to green using HARDWARE
Ds.SendMessageStatus("Fading to green (10 seconds)...");
fadeAllHardware(0, 100, 0, 10);
Ds.SendMessageStatus("Green fade complete!");
Ds.Wait(1);

// Fade to off using HARDWARE
Ds.SendMessageStatus("Fading to off (10 seconds)...");
fadeAllHardware(0, 0, 0, 10);
Ds.SendMessageStatus("Off fade complete!");
