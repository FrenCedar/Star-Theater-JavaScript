// Simple Lighting Test - Complete Self-Contained Script
// Just run this file in Digistar!

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

// === TEST SEQUENCE ===

Ds.SendMessageStatus("Starting simple lighting test...");

// Red
Ds.SendMessageStatus("Testing RED...");
setAll(100, 0, 0);
Ds.Wait(2);

// Green
Ds.SendMessageStatus("Testing GREEN...");
setAll(0, 100, 0);
Ds.Wait(2);

// Blue
Ds.SendMessageStatus("Testing BLUE...");
setAll(0, 0, 100);
Ds.Wait(2);

// Off
Ds.SendMessageStatus("Turning off...");
setAll(0, 0, 0);

Ds.SendMessageStatus("Simple test complete!");