// Smooth Fade Test - HSV Waypoint Fade
//
// Fixes the perceptual "pop" seen when hardware-fading between two colors
// where multiple RGB channels move in opposite directions at once
// (e.g. rgb(100,0,0) -> rgb(20,80,0): R falls while G rises).
//
// Root cause: "coveLights segment ... duration" interpolates R/G/B
// linearly and independently. That's mathematically smooth, but human
// color perception is not linear, so the fade appears to snap through
// a hue shift partway through.
//
// Fix: instead of one straight-line RGB fade from A -> B, compute a few
// intermediate colors along an HSV-interpolated path (which keeps hue
// changes perceptually even) and chain them as short hardware sub-fades.
//
// Note: Self-contained for standalone testing.
// For larger projects, use 02_library/lighting_control_v2.js.

var TOTAL_SEGMENTS = 128;

// === BASIC FUNCTIONS ===

function setSegment(index, r, g, b) {
    Ds.SendStringCommand("coveLights segment " + index + " " + r + " " + g + " " + b);
}

function setAll(r, g, b) {
    for (var i = 0; i < TOTAL_SEGMENTS; i++) {
        setSegment(i, r, g, b);
    }
}

// Straight-line RGB hardware fade (the "before" behavior, for comparison)
function fadeAll(toR, toG, toB, durationSec) {
    for (var i = 0; i < TOTAL_SEGMENTS; i++) {
        Ds.SendStringCommand("coveLights segment " + i + " " + toR + " " + toG + " " + toB + " duration " + durationSec);
    }
    Ds.Wait(durationSec);
}

// === COLOR SPACE CONVERSION (RGB 0-100 <-> HSV) ===

// r,g,b in 0-100. Returns {h: 0-360, s: 0-100, v: 0-100}
function rgbToHsv(r, g, b) {
    var rn = r / 100, gn = g / 100, bn = b / 100;
    var max = Math.max(rn, gn, bn);
    var min = Math.min(rn, gn, bn);
    var delta = max - min;

    var h = 0;
    if (delta !== 0) {
        if (max === rn) {
            h = 60 * (((gn - bn) / delta) % 6);
        } else if (max === gn) {
            h = 60 * (((bn - rn) / delta) + 2);
        } else {
            h = 60 * (((rn - gn) / delta) + 4);
        }
    }
    if (h < 0) h += 360;

    var s = (max === 0) ? 0 : (delta / max) * 100;
    var v = max * 100;

    return {h: h, s: s, v: v};
}

// h: 0-360, s/v: 0-100. Returns {r, g, b} in 0-100
function hsvToRgb(h, s, v) {
    var sn = s / 100, vn = v / 100;
    var c = vn * sn;
    var hp = h / 60;
    var x = c * (1 - Math.abs((hp % 2) - 1));
    var m = vn - c;

    var rn = 0, gn = 0, bn = 0;
    if (hp >= 0 && hp < 1)      { rn = c; gn = x; bn = 0; }
    else if (hp >= 1 && hp < 2) { rn = x; gn = c; bn = 0; }
    else if (hp >= 2 && hp < 3) { rn = 0; gn = c; bn = x; }
    else if (hp >= 3 && hp < 4) { rn = 0; gn = x; bn = c; }
    else if (hp >= 4 && hp < 5) { rn = x; gn = 0; bn = c; }
    else                        { rn = c; gn = 0; bn = x; }

    return {
        r: Math.round((rn + m) * 100),
        g: Math.round((gn + m) * 100),
        b: Math.round((bn + m) * 100)
    };
}

// Shortest-path hue interpolation (handles wraparound at 0/360)
function lerpHue(h1, h2, t) {
    var diff = h2 - h1;
    if (diff > 180) diff -= 360;
    if (diff < -180) diff += 360;
    var h = h1 + diff * t;
    if (h < 0) h += 360;
    if (h >= 360) h -= 360;
    return h;
}

function lerp(a, b, t) {
    return a + (b - a) * t;
}

// === SMOOTH FADE (HSV WAYPOINTS) ===

// Fades all segments from the current color to a target color by chaining
// several hardware sub-fades through HSV-interpolated waypoints, instead
// of one straight-line RGB fade. This avoids the perceptual "pop" that
// happens when multiple channels move in opposite directions at once.
//
// fromR/fromG/fromB: color the lights are currently at (script must track this,
//                     since Digistar doesn't expose a "read current color" API)
// toR/toG/toB: target color
// durationSec: total fade duration across all waypoints
// steps: number of waypoints/sub-fades (4-8 is usually enough, more = smoother
//        but more commands sent)
function fadeAllSmooth(fromR, fromG, fromB, toR, toG, toB, durationSec, steps) {
    steps = steps || 6;

    var fromHsv = rgbToHsv(fromR, fromG, fromB);
    var toHsv = rgbToHsv(toR, toG, toB);
    var stepDuration = durationSec / steps;

    for (var step = 1; step <= steps; step++) {
        var t = step / steps;

        var h = lerpHue(fromHsv.h, toHsv.h, t);
        var s = lerp(fromHsv.s, toHsv.s, t);
        var v = lerp(fromHsv.v, toHsv.v, t);

        var rgb = hsvToRgb(h, s, v);

        for (var i = 0; i < TOTAL_SEGMENTS; i++) {
            Ds.SendStringCommand("coveLights segment " + i + " " + rgb.r + " " + rgb.g + " " + rgb.b + " duration " + stepDuration);
        }
        Ds.Wait(stepDuration);
    }
}

function log(message) {
    Ds.SendMessageStatus("[Lighting V2] - " + message);
}

// === TEST SEQUENCE ===
// Compares the straight-line RGB fade (visible pop) against the HSV
// waypoint fade (should look smooth) for the same color transition.

log("Starting smooth fade test...");

// Start from solid red
setAll(100, 0, 0);
Ds.Wait(2);

// "Before": straight-line RGB fade, R falls while G rises -> visible pop
log("Straight-line RGB fade: red -> olive (100,0,0 -> 20,80,0)...");
fadeAll(20, 80, 0, 4);
Ds.Wait(2);

// Reset to solid red for a fair comparison
setAll(100, 0, 0);
Ds.Wait(2);

// "After": HSV waypoint fade for the same transition -> should look smooth
log("HSV waypoint fade: red -> olive (100,0,0 -> 20,80,0)...");
fadeAllSmooth(100, 0, 0, 20, 80, 0, 4, 6);

log("Smooth fade test complete!");
