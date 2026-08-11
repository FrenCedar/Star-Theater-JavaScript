// RGB values: 0-100 (NOT 0-255)

// ===== CONFIGURATION =====
var TOTAL_SEGMENTS = 128;  // Accurate number of segments, tested and working. (no touchy touchy)

// ===== BASIC FUNCTIONS =====

// Set a single segment to RGB color (instant)
function setSegment(index, r, g, b) {
    Ds.SendStringCommand("coveLights segment " + index + " " + r + " " + g + " " + b);
}

// Set a single segment with fade
function setSegmentFade(index, r, g, b, durationSec) {
    Ds.SendStringCommand("coveLights segment " + index + " " + r + " " + g + " " + b + " duration " + durationSec);
}

// Set all segments to the same color (instant)
function setAll(r, g, b) {
    for (var i = 0; i < TOTAL_SEGMENTS; i++) {
        setSegment(i, r, g, b);
    }
}

// Set all segments with fade
function setAllFade(r, g, b, durationSec) {
    for (var i = 0; i < TOTAL_SEGMENTS; i++) {
        setSegmentFade(i, r, g, b, durationSec);
    }
    // Wait for fade to complete
    Ds.Wait(durationSec);
}

// Turn off all segments
function allOff() {
    setAll(0, 0, 0);
}

// Fade all to off using hardware
function fadeToOff(durationSec) {
    setAllFade(0, 0, 0, durationSec);
}

// Set a range of segments
function setRange(startIndex, endIndex, r, g, b) {
    for (var i = startIndex; i <= endIndex; i++) {
        setSegment(i, r, g, b);
    }
}

// Set a range with fade
function setRangeFade(startIndex, endIndex, r, g, b, durationSec) {
    for (var i = startIndex; i <= endIndex; i++) {
        setSegmentFade(i, r, g, b, durationSec);
    }
    Ds.Wait(durationSec);
}

function fadeAll(toR, toG, toB, durationSec) {
    for (var i = 0; i < TOTAL_SEGMENTS; i++) {
        Ds.SendStringCommand("coveLights segment " + i + " " + toR + " " + toG + " " + toB + " duration " + durationSec);
    }
    Ds.Wait(durationSec);
}

// Fade to a color (from current state)
function fadeTo(toR, toG, toB, durationSec) {
    fadeAll(toR, toG, toB, durationSec);
}

// Fade from off to a color
function fadeFromOff(toR, toG, toB, durationSec) {
    setAll(0, 0, 0);
    fadeAll(toR, toG, toB, durationSec);
}

// ===== ZONE FUNCTIONS =====

var zones = {
    front: {start: 0, end: Math.floor(TOTAL_SEGMENTS * 0.25) - 1},
    right: {start: Math.floor(TOTAL_SEGMENTS * 0.25), end: Math.floor(TOTAL_SEGMENTS * 0.5) - 1},
    back: {start: Math.floor(TOTAL_SEGMENTS * 0.5), end: Math.floor(TOTAL_SEGMENTS * 0.75) - 1},
    left: {start: Math.floor(TOTAL_SEGMENTS * 0.75), end: TOTAL_SEGMENTS - 1}
};

// Set a zone (instant)
function setZone(zoneName, r, g, b) {
    if (zones[zoneName]) {
        setRange(zones[zoneName].start, zones[zoneName].end, r, g, b);
    } else {
        Ds.SendMessageError("Unknown zone: " + zoneName);
    }
}

// Fade a zone
function fadeZone(zoneName, r, g, b, durationSec) {
    if (!zones[zoneName]) {
        Ds.SendMessageError("Unknown zone: " + zoneName);
        return;
    }
    
    var zone = zones[zoneName];
    for (var i = zone.start; i <= zone.end; i++) {
        setSegmentFade(i, r, g, b, durationSec);
    }
    Ds.Wait(durationSec);
}

// ===== ANIMATION FUNCTIONS =====

// Chase effect
function chase(r, g, b, segmentSize, delaySec, loops) {
    loops = loops || 1;
    segmentSize = segmentSize || 5;
    
    for (var loop = 0; loop < loops; loop++) {
        for (var pos = 0; pos < TOTAL_SEGMENTS; pos++) {
            // Turn all off
            allOff();
            
            // Light up current segment group
            for (var i = 0; i < segmentSize; i++) {
                var index = (pos + i) % TOTAL_SEGMENTS;
                setSegment(index, r, g, b);
            }
            
            Ds.Wait(delaySec);
        }
    }
}

function chaseFade(r, g, b, segmentSize, stepDuration, loops) {
    loops = loops || 1;
    segmentSize = segmentSize || 5;
    
    for (var loop = 0; loop < loops; loop++) {
        for (var pos = 0; pos < TOTAL_SEGMENTS; pos++) {
            // Fade all to off
            fadeToOff(stepDuration);
            
            // Light up current segment group with fade
            for (var i = 0; i < segmentSize; i++) {
                var index = (pos + i) % TOTAL_SEGMENTS;
                setSegmentFade(index, r, g, b, stepDuration);
            }
            
            Ds.Wait(stepDuration);
        }
    }
}

// Pulse effect
function pulse(r, g, b, durationSec, loops) {
    loops = loops || 1;
    
    for (var loop = 0; loop < loops; loop++) {
        // Fade up
        fadeFromOff(r, g, b, durationSec / 2);
        
        // Fade down
        fadeToOff(durationSec / 2);
    }
}

function rainbow(fadeDuration, loops) {
    loops = loops || 1;
    var colors = [
        [100, 0, 0],     // Red
        [100, 50, 0],    // Orange
        [100, 100, 0],   // Yellow
        [0, 100, 0],     // Green
        [0, 0, 100],     // Blue
        [29, 0, 51],     // Indigo
        [58, 0, 83]      // Violet
    ];
    
    for (var loop = 0; loop < loops; loop++) {
        for (var c = 0; c < colors.length; c++) {
            fadeAll(colors[c][0], colors[c][1], colors[c][2], fadeDuration);
        }
    }
}

// ===== PRESET SCENES =====

// Pre-show ambiance (soft blue)
function scenePreShow() {
    fadeFromOff(20, 40, 80, 3);
}

// End of show
function sceneEndShow() {
    fadeToOff(3);
}

// MSU colors
function sceneMSU() {
    var midPoint = Math.floor(TOTAL_SEGMENTS / 2);
    setRange(0, midPoint - 1, 0, 20, 63);    // MSU Blue
    setRange(midPoint, TOTAL_SEGMENTS - 1, 100, 78, 17); // MSU Gold
}

// Emergency/bright white
function sceneEmergency() {
    setAll(100, 100, 100);
}

// Cinematic mode (very dim blue)
function sceneCinematic() {
    fadeFromOff(8, 8, 25, 3);
}

// ===== UTILITY FUNCTIONS =====

function wait(seconds) {
    Ds.Wait(seconds);
}

function log(message) {
    Ds.SendMessageStatus("[Lighting V2] " + message);
}

function setTotalSegments(count) {
    TOTAL_SEGMENTS = count;
    
    zones = {
        front: {start: 0, end: Math.floor(TOTAL_SEGMENTS * 0.25) - 1},
        right: {start: Math.floor(TOTAL_SEGMENTS * 0.25), end: Math.floor(TOTAL_SEGMENTS * 0.5) - 1},
        back: {start: Math.floor(TOTAL_SEGMENTS * 0.5), end: Math.floor(TOTAL_SEGMENTS * 0.75) - 1},
        left: {start: Math.floor(TOTAL_SEGMENTS * 0.75), end: TOTAL_SEGMENTS - 1}
    };
    
    log("Total segments set to " + TOTAL_SEGMENTS);
}

// ===== INITIALIZATION =====
log("Lighting V2 loaded - " + TOTAL_SEGMENTS + " segments");
