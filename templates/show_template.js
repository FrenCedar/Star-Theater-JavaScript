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
// Copy these functions if not using lighting_master.js:

var TOTAL_SEGMENTS = 110;

function setSegment(index, r, g, b) {
    Ds.sendStringCommand("coveLights segment " + index + " " + r + " " + g + " " + b);
}

function setAll(r, g, b) {
    for (var i = 0; i < TOTAL_SEGMENTS; i++) {
        setSegment(i, r, g, b);
    }
}

function fadeAll(fromR, fromG, fromB, toR, toG, toB, durationMs, steps) {
    steps = steps || 50;
    var delayMs = durationMs / steps;
    
    for (var step = 0; step <= steps; step++) {
        var progress = step / steps;
        var r = Math.round(fromR + (toR - fromR) * progress);
        var g = Math.round(fromG + (toG - fromG) * progress);
        var b = Math.round(fromB + (toB - fromB) * progress);
        
        setAll(r, g, b);
        
        if (step < steps) {
            Ds.Wait(delayMs);
        }
    }
}

function fadeFromOff(toR, toG, toB, durationMs, steps) {
    fadeAll(0, 0, 0, toR, toG, toB, durationMs, steps);
}

function fadeToOff(durationMs, steps) {
    fadeAll(100, 100, 100, 0, 0, 0, durationMs, steps);
}
*/

// ===== SHOW CONFIGURATION =====

var config = {
    preShowDuration: 5000,      // Time for pre-show ambiance (ms)
    introDuration: 3000,        // Intro effect duration (ms)
    outroDuration: 3000,        // Outro effect duration (ms)
    
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
        2000,
        50
    );
    
    Ds.Wait(config.preShowDuration);
}

function intro() {
    Ds.SendMessageStatus("[" + SHOW_NAME + "] Intro starting...");
    
    // Fade to black
    fadeToOff(1000, 30);
    Ds.Wait(500);
    
    // Your intro effect here
    fadeFromOff(
        config.mainColor.r,
        config.mainColor.g,
        config.mainColor.b,
        config.introDuration,
        50
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
    
    // Fade up from dim
    fadeAll(
        10, 10, 30,
        config.endColor.r,
        config.endColor.g,
        config.endColor.b,
        config.outroDuration,
        50
    );
    
    Ds.Wait(2000);
    
    // Fade to off
    fadeToOff(2000, 50);
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
