# Digistar Cove Lighting Control System

Hardware-accelerated lighting control for the Digistar planetarium cove lights using the native `duration` parameter for all fades.

## ⚠️ IMPORTANT: RGB Range is 0-100 (NOT 0-255)

All RGB values in these scripts use 0-100 range, not the typical 0-255.

## Files

- **lighting_control_v2.js** - Main library with all hardware-accelerated functions
- **Segment.js** - Basic segment control utility

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

### Hardware Fades

All fades use the native `duration` parameter — the hardware handles smooth interpolation.

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

### Zone Control

Zones divide the 128 segments into 4 regions:
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

### Preset Scenes

```javascript
scenePreShow();      // Soft blue ambiance (fade in)
sceneEndShow();      // Fade to off
sceneMSU();          // MSU blue and gold (instant)
sceneEmergency();    // Bright white (instant)
sceneCinematic();    // Very dim blue (fade in)
```

## Function Reference

### Basic Functions
- `setSegment(index, r, g, b)` - Set single segment instantly
- `setAll(r, g, b)` - Set all segments instantly
- `allOff()` - Turn off all lights instantly
- `setRange(start, end, r, g, b)` - Set range of segments instantly

### Hardware Fade Functions
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
- `chaseFade(r, g, b, segmentSize, stepDuration, loops)` - Chase with hardware fades
- `pulse(r, g, b, durationSec, loops)` - Breathing pulse (hardware fades)
- `rainbow(fadeDuration, loops)` - Rainbow color cycle (hardware fades)

### Preset Scenes
- `scenePreShow()` - Soft blue fade in
- `sceneEndShow()` - Fade to off
- `sceneMSU()` - MSU school colors
- `sceneEmergency()` - Bright white
- `sceneCinematic()` - Very dim blue fade in

### Utility Functions
- `wait(seconds)` - Wait/delay
- `log(message)` - Log status message
- `setTotalSegments(count)` - Update segment count and recalculate zones

## Example Show Sequence

```javascript
function myShow() {
    log("Starting show...");

    // Pre-show ambiance (soft blue, 3 second fade in)
    fadeFromOff(20, 40, 80, 3);
    wait(5);

    // Dim for show start
    fadeToOff(2);
    wait(1);

    // Very dim ambient during show
    fadeFromOff(10, 10, 30, 1);

    // End of show - fade up to bright
    fadeAll(80, 80, 100, 2);

    log("Show complete!");
}
```

## Best Practices

**Always use the `duration` parameter for fades** — never step-loop in JavaScript.

```javascript
// ✅ CORRECT — hardware fade
fadeAll(100, 0, 0, 3);

// ✅ CORRECT — instant color change
setAll(100, 0, 0);
```

**Remember to wait for the fade to complete** before running the next command:

```javascript
// ✅ GOOD
fadeAll(100, 0, 0, 3);
// fadeAll() already calls Ds.Wait() internally — next line runs after fade

// ⚠️ RAW COMMANDS — you must wait manually
for (var i = 0; i < TOTAL_SEGMENTS; i++) {
    Ds.SendStringCommand("coveLights segment " + i + " 100 0 0 duration 3");
}
Ds.Wait(3);  // Don't forget this!
```

**Set a known starting state before fading:**

```javascript
// ✅ Predictable — starts from known off state
setAll(0, 0, 0);
fadeAll(100, 0, 0, 3);

// ⚠️ Fades from whatever the current state is
fadeAll(100, 0, 0, 3);
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
setAll(0, 20, 63);     // MSU Blue
setAll(100, 78, 17);   // MSU Gold
```

## Troubleshooting

**Lights not changing?**
- Verify Digistar command syntax: `coveLights segment [index] [r] [g] [b]`
- Check segment index is within range (default 0-127)

**Fade too slow/fast?**
- Adjust the `durationSec` parameter

**Lights mid-fade when next command runs?**
- Make sure `Ds.Wait(durationSec)` is called after raw commands
- If using library functions like `fadeAll()`, the wait is handled automatically
