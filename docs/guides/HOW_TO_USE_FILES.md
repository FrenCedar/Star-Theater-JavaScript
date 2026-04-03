# Using Multiple JavaScript Files in Digistar

## Script Execution Model

Digistar runs complete JavaScript files only. Interactive command execution is not supported.

## Self-Contained Scripts (Recommended)

Include all required functions within each script file.

### Example Structure:
```javascript
// my_show.js

var TOTAL_SEGMENTS = 128;

function setAll(r, g, b) {
    for (var i = 0; i < TOTAL_SEGMENTS; i++) {
        Ds.SendStringCommand("coveLights segment " + i + " " + r + " " + g + " " + b);
    }
}

function fadeAll(toR, toG, toB, durationSec) {
    for (var i = 0; i < TOTAL_SEGMENTS; i++) {
        Ds.SendStringCommand("coveLights segment " + i + " " + toR + " " + toG + " " + toB + " duration " + durationSec);
    }
    Ds.Wait(durationSec);
}

// Show sequence
Ds.SendMessage(0, "Starting show");
setAll(0, 0, 0);
Ds.Wait(1);
fadeAll(100, 0, 0, 2);
Ds.SendMessage(0, "Show complete");
```

Advantages: Self-contained, no dependencies, portable
Disadvantages: Function duplication across files

## Template File

Use `templates/show_template.js` as a starting point for new shows.

## Reference Files

Examine existing scripts for implementation patterns:
- `core_lighting/lighting_control_v2.js` - Main library reference
- `examples/simple_test.js` - Basic usage
- `examples/fade_test_hardware.js` - Hardware fade patterns
- `examples/preshow_ambiance.js` - Ambient lighting
- `examples/lights_off.js` - Fade to off sequence

## Notes

- All functions and variables are global scope
- Digistar does not support ES6 modules (`import`/`export`)
- Include all required functions within each script file
