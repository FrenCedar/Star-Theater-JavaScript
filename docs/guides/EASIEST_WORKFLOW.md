# Digistar Lighting Workflow

## Quick Start

### Available Example Scripts

Ready-to-run example files:

```
examples/simple_test.js         - Basic RGB color test
examples/fade_test_hardware.js  - Hardware fade demonstration
examples/preshow_ambiance.js    - Pre-show ambient lighting
examples/lights_off.js          - Fade to off
utilities/segment_diagnostic.js - Test individual segments
```

### Creating Custom Scripts

1. Copy an example file as a starting point
2. Modify the script sequence to match your requirements
3. Save and run in Digistar

Example modification:
```javascript
Ds.SendMessage(0, "Starting custom show");

// Custom sequence
setAll(100, 0, 0);  // Red
Ds.Wait(1);

setAll(0, 100, 0);  // Green
Ds.Wait(1);

Ds.SendMessage(0, "Show complete");
```

## Basic Template

Minimal script template:

```javascript
var TOTAL_SEGMENTS = 128;

function setSegment(index, r, g, b) {
    Ds.SendStringCommand("coveLights segment " + index + " " + r + " " + g + " " + b);
}

function setAll(r, g, b) {
    for (var i = 0; i < TOTAL_SEGMENTS; i++) {
        setSegment(i, r, g, b);
    }
}

// Hardware fade function
function fadeAll(toR, toG, toB, durationSec) {
    for (var i = 0; i < TOTAL_SEGMENTS; i++) {
        Ds.SendStringCommand("coveLights segment " + i + " " + toR + " " + toG + " " + toB + " duration " + durationSec);
    }
    Ds.Wait(durationSec);
}

// Your show sequence
Ds.SendMessage(0, "Starting show");

setAll(100, 0, 0);  // Red
Ds.Wait(2);

fadeAll(0, 0, 0, 2);  // Fade to off over 2 seconds

Ds.SendMessage(0, "Show complete");
```

## Color Reference

RGB values use 0-100 range:

```javascript
setAll(100, 0, 0);      // Red
setAll(0, 100, 0);      // Green  
setAll(0, 0, 100);      // Blue
setAll(100, 100, 100);  // White
setAll(0, 0, 0);        // Off
```
