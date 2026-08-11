# Digistar Cove Lighting Control

Lighting control system for Digistar 7 using the `duration` parameter for smooth color transitions.

## RGB Range

All RGB values use **0-100 range** (not 0-255).

## Available Files

- `core_lighting/lighting_control_v2.js` - Main lighting library with all functions
- `utilities/Segment.js` - Basic segment control reference

## Quick Start

### Basic Control

```javascript
// Turn all lights red
setAll(100, 0, 0);

// Turn off all lights
allOff();

// Set lights 0-20 to blue
setRange(0, 20, 0, 0, 100);

// Set single light to green
setSegment(50, 0, 100, 0);
```

### Fade Effects

All fades use the `duration` parameter for smooth color transitions.

```javascript
// Fade all lights to blue over 3 seconds
fadeAll(0, 0, 100, 3);

// Fade from off to white over 2 seconds
fadeFromOff(100, 100, 100, 2);

// Fade to black over 2 seconds
fadeToOff(2);

// Fade a specific segment to green over 1 second
setSegmentFade(10, 0, 100, 0, 1);
```

## Fade Effects Guide

### Command Format

**Instant (No Fade):**
```javascript
Ds.SendStringCommand("coveLights segment 0 100 0 0");
// Instantly sets segment 0 to red
```

**With Duration Parameter:**
```javascript
Ds.SendStringCommand("coveLights segment 0 100 0 0 duration 3");
// Fades segment 0 to red over 3 seconds
```

### Benefits of Using Duration Parameter

**Benefits:**
- Minimal command count (one per segment = 128 commands total)
- Hardware-calculated interpolation
- Smooth hardware-timed fading
- 99.5% fewer commands vs software fading (128 vs 25,600)
- Minimal script processing overhead
- Perfect smoothness, no visible stepping

**Performance:**

| Method | Commands | Processing | Smoothness |
|--------|----------|------------|------------|
| Hardware | 128 | Minimal | Optimal |

### Implementation

```javascript
var TOTAL_SEGMENTS = 128;

function fadeAll(toR, toG, toB, durationSec) {
    for (var i = 0; i < TOTAL_SEGMENTS; i++) {
        Ds.SendStringCommand("coveLights segment " + i + " " + toR + " " + toG + " " + toB + " duration " + durationSec);
    }
    Ds.Wait(durationSec);
}
```

### Usage Examples

**Example 1: Fade to Red**
```javascript
fadeAll(100, 0, 0, 3);
```

**Example 2: Ambient Fade In**
```javascript
for (var i = 0; i < 128; i++) {
    Ds.SendStringCommand("coveLights segment " + i + " 8 8 25 duration 3");
}
Ds.Wait(3);
```

**Example 3: Zone Fade**
```javascript
// Fade front zone to red over 2 seconds
for (var i = 0; i <= 31; i++) {  // Front zone: 0-31
    Ds.SendStringCommand("coveLights segment " + i + " 100 0 0 duration 2");
}
Ds.Wait(2);
```

**Example 4: Wave Effect**
```javascript
for (var i = 0; i < 128; i++) {
    Ds.SendStringCommand("coveLights segment " + i + " 100 0 0 duration 2");
    Ds.Wait(0.05);
}
Ds.Wait(2);
```

## Zone Control

Zones divide segments into regions:
- **front**: segments 0-31
- **right**: segments 32-63
- **back**: segments 64-95
- **left**: segments 96-127

```javascript
// Set front zone to red (instant)
setZone("front", 100, 0, 0);

// Fade left zone to yellow over 2 seconds
fadeZone("left", 100, 100, 0, 2);
```

## Function Reference

### Basic Functions
- `setSegment(index, r, g, b)` - Set single segment instantly
- `setAll(r, g, b)` - Set all segments instantly
- `allOff()` - Turn off all lights instantly
- `setRange(start, end, r, g, b)` - Set range of segments instantly

### Fade Functions
- `setSegmentFade(index, r, g, b, durationSec)` - Fade single segment
- `setAllFade(r, g, b, durationSec)` - Fade all segments
- `fadeAll(toR, toG, toB, durationSec)` - Fade all to color
- `fadeTo(toR, toG, toB, durationSec)` - Fade from current state to color
- `fadeFromOff(toR, toG, toB, durationSec)` - Fade from black to color
- `fadeToOff(durationSec)` - Fade to black

### Zone Functions
- `setZone(zoneName, r, g, b)` - Set zone to color instantly
- `fadeZone(zoneName, r, g, b, durationSec)` - Fade zone to color

### Animation Functions
- `chase(r, g, b, segmentSize, delaySec, loops)` - Moving light chase
- `chaseFade(r, g, b, segmentSize, stepDuration, loops)` - Chase with fading transitions
- `pulse(r, g, b, durationSec, loops)` - Breathing pulse with smooth fading
- `rainbow(fadeDuration, loops)` - Rainbow color cycle with smooth transitions

### Preset Scenes
- `scenePreShow()` - Soft blue fade in
- `sceneEndShow()` - Fade to off
- `sceneMSU()` - MSU school colors (blue and gold)
- `sceneEmergency()` - Bright white
- `sceneCinematic()` - Very dim blue fade in

### Utility Functions
- `wait(seconds)` - Wait/delay
- `log(message)` - Log status message
- `setTotalSegments(count)` - Update segment count and recalculate zones

## Complete Function Library

```javascript
var TOTAL_SEGMENTS = 128;

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

function fadeZone(startSeg, endSeg, toR, toG, toB, durationSec) {
    for (var i = startSeg; i <= endSeg; i++) {
        Ds.SendStringCommand("coveLights segment " + i + " " + toR + " " + toG + " " + toB + " duration " + durationSec);
    }
    Ds.Wait(durationSec);
}
```

## Example Show Sequence

```javascript
function myShow() {
    Ds.SendMessage(0, "Starting show...");

    // Pre-show ambiance (soft blue, 3 second fade in)
    fadeFromOff(20, 40, 80, 3);
    Ds.Wait(5);

    // Dim for show start
    fadeToOff(2);
    Ds.Wait(1);

    // Very dim ambient during show
    fadeFromOff(10, 10, 30, 1);

    // End of show - fade up to bright
    fadeAll(80, 80, 100, 2);

    Ds.SendMessage(0, "Show complete!");
}
```

## Best Practices

### 1. Always Use Duration Parameter
```javascript
fadeAll(100, 0, 0, 3);  // Hardware fade - recommended
setAll(100, 0, 0);      // Instant change
```

### 2. Set Known Initial State
```javascript
setAll(0, 0, 0);        // Set starting state
fadeAll(100, 0, 0, 3);  // Then fade
```

### 3. Wait for Fade Completion
```javascript
for (var i = 0; i < TOTAL_SEGMENTS; i++) {
    Ds.SendStringCommand("coveLights segment " + i + " 100 0 0 duration 3");
}
Ds.Wait(3);  // Always wait for fade to complete
```

### 4. Use Constants
```javascript
var FADE_DURATION = 3;
var TOTAL_SEGMENTS = 128;

function fadeAll(r, g, b) {
    for (var i = 0; i < TOTAL_SEGMENTS; i++) {
        Ds.SendStringCommand("coveLights segment " + i + " " + r + " " + g + " " + b + " duration " + FADE_DURATION);
    }
    Ds.Wait(FADE_DURATION);
}
```

## Color Reference

### Common Colors (0-100 RGB)
```javascript
setAll(100, 0, 0);     // Red
setAll(0, 100, 0);     // Green
setAll(0, 0, 100);     // Blue
setAll(100, 100, 0);   // Yellow
setAll(0, 100, 100);   // Cyan
setAll(100, 0, 100);   // Magenta
setAll(100, 100, 100); // White
setAll(100, 50, 0);    // Orange
setAll(50, 0, 50);     // Purple
```

### Custom/Ambient Colors
```javascript
setAll(20, 40, 80);    // Soft blue (pre-show)
setAll(8, 8, 25);      // Dim blue (cinematic)
setAll(10, 10, 30);    // Very dim ambient
```

### MSU Colors
```javascript
setAll(0, 20, 63);     // MSU Blue
setAll(100, 78, 17);   // MSU Gold
```

## Troubleshooting

**Command syntax:**
```
coveLights segment [index] [r] [g] [b]
coveLights segment [index] [r] [g] [b] duration [seconds]
```

**Segment index range:** 0-127 (total 128 segments)

**Adjust fade speed:** Change `durationSec` parameter (in seconds)

**Ensure completion:** Always call `Ds.Wait(durationSec)` after fade commands

**RGB range:** 0-100 (not 0-255)

## Reference Files

- `core_lighting/lighting_control_v2.js` - Complete implementation
- `examples/fade_demo.js` - Hardware fade demonstrations
- `examples/simple_test.js` - Basic color tests
- `examples/preshow_ambiance.js` - Pre-show lighting example
- `examples/lights_off.js` - Fade to off sequence
