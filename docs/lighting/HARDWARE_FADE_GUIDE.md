# Hardware Fade Guide - Native Duration Parameter

## 🎯 Game Changer Discovery!

The `coveLights segment` command supports a native `duration` parameter that tells the **hardware** to smoothly fade to the target color!

## Command Format

### Instant (No Fade)
```javascript
Ds.SendStringCommand("coveLights segment 0 100 0 0");
// Instantly sets segment 0 to red (100, 0, 0)
```

### With Hardware Fade
```javascript
Ds.SendStringCommand("coveLights segment 0 100 0 0 duration 3");
// Hardware fades segment 0 to red over 3 seconds
```

## Why Hardware Fades

### Hardware Fade
```javascript
function fadeAll(toR, toG, toB, durationSec) {
    for (var i = 0; i < TOTAL_SEGMENTS; i++) {
        Ds.SendStringCommand("coveLights segment " + i + " " + toR + " " + toG + " " + toB + " duration " + durationSec);
    }
    Ds.Wait(durationSec);
    // Only 110 commands!
    // Hardware handles the smooth fade
    // Perfectly smooth, no stepping
}
```

**Benefits:**
- ✅ Only 110 commands (one per segment)
- ✅ Hardware calculates the fade
- ✅ Perfectly smooth (hardware-timed)
- ✅ 99.5% fewer commands!
- ✅ Script just waits, minimal processing

## Performance

| Method | Commands | Processing | Smoothness |
|--------|----------|------------|------------|
| **Hardware** | **110** | **Minimal** | **Perfect** ⭐⭐⭐⭐⭐ |

## Usage Examples

### Example 1: Fade to Red
```javascript
function fadeAll(toR, toG, toB, durationSec) {
    for (var i = 0; i < 110; i++) {
        Ds.SendStringCommand("coveLights segment " + i + " " + toR + " " + toG + " " + toB + " duration " + durationSec);
    }
    Ds.Wait(durationSec);
}
fadeAll(100, 0, 0, 3);
```

### Example 2: Cinematic Fade In
```javascript
// Set all segments to fade to dim blue over 3 seconds
for (var i = 0; i < 110; i++) {
    Ds.SendStringCommand("coveLights segment " + i + " 8 8 25 duration 3");
}
Ds.Wait(3);  // Wait for fade to complete
```

### Example 3: Zone Fade
```javascript
// Fade front zone to red over 2 seconds
for (var i = 0; i <= 27; i++) {  // Front zone: 0-27
    Ds.SendStringCommand("coveLights segment " + i + " 100 0 0 duration 2");
}
Ds.Wait(2);
```

### Example 4: Different Durations Per Segment
```javascript
// Create a wave effect - each segment starts fading at different time
for (var i = 0; i < 110; i++) {
    Ds.SendStringCommand("coveLights segment " + i + " 100 0 0 duration 2");
    Ds.Wait(0.05);  // Start next segment 50ms later
}
Ds.Wait(2);  // Wait for last segment to finish
```

## Updated Function Library

### Basic Hardware Fade Functions

```javascript
// Fade all segments to a color
function fadeAll(toR, toG, toB, durationSec) {
    for (var i = 0; i < 110; i++) {
        Ds.SendStringCommand("coveLights segment " + i + " " + toR + " " + toG + " " + toB + " duration " + durationSec);
    }
    Ds.Wait(durationSec);
}

// Fade from off to a color
function fadeFromOff(toR, toG, toB, durationSec) {
    // Instantly set to off first
    for (var i = 0; i < 110; i++) {
        Ds.SendStringCommand("coveLights segment " + i + " 0 0 0");
    }
    // Then hardware fade to color
    fadeAll(toR, toG, toB, durationSec);
}

// Fade to off
function fadeToOff(durationSec) {
    fadeAll(0, 0, 0, durationSec);
}

// Fade from one color to another
function fadeFromTo(fromR, fromG, fromB, toR, toG, toB, durationSec) {
    // Instantly set to start color
    for (var i = 0; i < 110; i++) {
        Ds.SendStringCommand("coveLights segment " + i + " " + fromR + " " + fromG + " " + fromB);
    }
    // Hardware fade to end color
    fadeAll(toR, toG, toB, durationSec);
}

// Fade a specific zone
function fadeZone(startSeg, endSeg, toR, toG, toB, durationSec) {
    for (var i = startSeg; i <= endSeg; i++) {
        Ds.SendStringCommand("coveLights segment " + i + " " + toR + " " + toG + " " + toB + " duration " + durationSec);
    }
    Ds.Wait(durationSec);
}
```

## Test File

```
examples/fade_test_hardware.js  - Hardware fade demo
```

## Best Practices

### 1. Always Use the Duration Parameter for Fades
```javascript
// ✅ CORRECT
fadeAll(100, 0, 0, 3);
```

### 2. Set Initial State Before Hardware Fade
```javascript
// ✅ GOOD - Predictable start
setAll(0, 0, 0);  // Instant
fadeAll(100, 0, 0, 3);  // Hardware fade

// ⚠️ OKAY - Fades from current state
fadeAll(100, 0, 0, 3);  // But what was the current state?
```

### 3. Remember to Wait for Completion
```javascript
// ✅ GOOD
for (var i = 0; i < 110; i++) {
    Ds.SendStringCommand("coveLights segment " + i + " 100 0 0 duration 3");
}
Ds.Wait(3);  // Wait for fade to complete

// ❌ BAD - Commands sent but script continues immediately
for (var i = 0; i < 110; i++) {
    Ds.SendStringCommand("coveLights segment " + i + " 100 0 0 duration 3");
}
// Script continues while lights are still fading!
```

### 4. Use Variables for Easy Adjustment
```javascript
var FADE_DURATION = 3;

function fadeAll(r, g, b) {
    for (var i = 0; i < 110; i++) {
        Ds.SendStringCommand("coveLights segment " + i + " " + r + " " + g + " " + b + " duration " + FADE_DURATION);
    }
    Ds.Wait(FADE_DURATION);
}
```

## Summary

Use the `duration` parameter on every fade — one command per segment, hardware handles the rest.

```javascript
// One command per segment, hardware interpolates smoothly
Ds.SendStringCommand("coveLights segment 0 100 0 0 duration 10");
```

## Files

- `lighting_control_v2.js` - Main library with hardware fades
- `examples/fade_test_hardware.js` - Hardware fade demo
