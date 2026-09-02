// ============================================
// SHOW TEMPLATE
// Copy this file and modify for your show
// ============================================

// Show name and description
var SHOW_NAME = "My Show Name";
var SHOW_DESCRIPTION = "Description of what this show does";

// ===== LOAD LIGHTING FUNCTIONS =====
// Option 1: Assume lighting_master.js is already loaded
// Option 2: Copy functions below (uncomment if needed)

/*
// Copy these functions if not using lighting library:

var TOTAL_SEGMENTS = 128;

function setSegment(index, r, g, b) {
    Ds.SendStringCommand("coveLights segment " + index + " " + r + " " + g + " " + b);
}

function setAll(r, g, b) {
    for (var i = 0; i < TOTAL_SEGMENTS; i++) {
        setSegment(i, r, g, b);
    }
}

// Fade all segments to a color using duration parameter
function fadeAll(toR, toG, toB, durationSec) {
    for (var i = 0; i < TOTAL_SEGMENTS; i++) {
        Ds.SendStringCommand("coveLights segment " + i + " " + toR + " " + toG + " " + toB + " duration " + durationSec);
    }
    Ds.Wait(durationSec);
}

function fadeFromOff(toR, toG, toB, durationSec) {
    for (var i = 0; i < TOTAL_SEGMENTS; i++) {
        Ds.SendStringCommand("coveLights segment " + i + " 0 0 0");
    }
    fadeAll(toR, toG, toB, durationSec);
}

function fadeToOff(durationSec) {
    fadeAll(0, 0, 0, durationSec);
}
*/

// ===== SHOW CONFIGURATION =====

var config = {
    preShowDuration: 5,         // Time for pre-show ambiance (seconds)
    introDuration: 3,           // Intro effect duration (seconds)
    outroDuration: 3,           // Outro effect duration (seconds)
    
    // Colors (RGB 0-100)
    preShowColor: {r: 20, g: 40, b: 80},
    mainColor: {r: 100, g: 0, b: 0},
    endColor: {r: 80, g: 60, b: 40}
};

// ===== HELPER FUNCTIONS (Specific to this show) =====

function preShow() {
    Ds.SendMessageStatus("[" + SHOW_NAME + "] Pre-show starting...");
    
    fadeFromOff(
        config.preShowColor.r,
        config.preShowColor.g,
        config.preShowColor.b,
        2
    );
    
    Ds.Wait(config.preShowDuration);
}

function intro() {
    Ds.SendMessageStatus("[" + SHOW_NAME + "] Intro starting...");
    
    // Fade to black
    fadeToOff(1);
    Ds.Wait(0.5);
    
    // Your intro effect here
    fadeFromOff(
        config.mainColor.r,
        config.mainColor.g,
        config.mainColor.b,
        config.introDuration
    );
}

function mainShow() {
    Ds.SendMessageStatus("[" + SHOW_NAME + "] Main show running...");
    
    // Your main show lighting here
    // This runs during the actual show content
    
    // Example: Dim ambient lighting
    setAll(10, 10, 30);
    
    // Wait for show duration (or remove this if triggered by show end)
    // Ds.Wait(60000);  // 60 seconds
}

function outro() {
    Ds.SendMessageStatus("[" + SHOW_NAME + "] Outro starting...");
    
    // Set initial state then fade to end color
    setAll(10, 10, 30);
    fadeAll(
        config.endColor.r,
        config.endColor.g,
        config.endColor.b,
        config.outroDuration
    );
    
    Ds.Wait(2);
    
    // Fade to off
    fadeToOff(2);
}

function cleanup() {
    Ds.SendMessageStatus("[" + SHOW_NAME + "] Cleaning up...");
    
    // Make sure lights are off
    setAll(0, 0, 0);
}

// ===== MAIN SHOW SEQUENCE =====

function runShow() {
    try {
        Ds.SendMessageStatus("==================================");
        Ds.SendMessageStatus("Starting: " + SHOW_NAME);
        Ds.SendMessageStatus("Description: " + SHOW_DESCRIPTION);
        Ds.SendMessageStatus("==================================");
        
        // Run show sequence
        preShow();
        intro();
        mainShow();
        outro();
        cleanup();
        
        Ds.SendMessageStatus("==================================");
        Ds.SendMessageStatus(SHOW_NAME + " complete!");
        Ds.SendMessageStatus("==================================");
        
    } catch (error) {
        Ds.SendMessageError("Error in " + SHOW_NAME + ": " + error.message);
        cleanup();
    }
}

// ===== AUTO-RUN (comment out if you want to call runShow() manually) =====

runShow();
