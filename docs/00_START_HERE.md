# Start Here

This is the entry point for learning the Digistar 7 JavaScript system used in this project. Read this file first.

## Quick Start

### Available Example Scripts

Ready-to-run cove light files in the project, in the order you should try them:

```
cove-lights/01_learn/01_simple_test.js       - Basic RGB color test
cove-lights/01_learn/02_fade_demo.js         - Fade effect demonstration
cove-lights/01_learn/03_preshow_ambiance.js  - Pre-show ambient lighting
cove-lights/01_learn/04_lights_off.js        - Fade to off
cove-lights/04_utilities/segment_diagnostic.js - Test individual segments
```

### Creating Custom Scripts

1. Copy `cove-lights/03_templates/show_template.js` as a starting point
2. Modify the script sequence
3. Save and run in Digistar

**Example modification:**
```javascript
Ds.SendMessage(0, "Starting custom show");

// Custom sequence
setAll(100, 0, 0);  // Red
Ds.Wait(1);

setAll(0, 100, 0);  // Green
Ds.Wait(1);

Ds.SendMessage(0, "Show complete");
```

## Basic Script Template

Minimal self-contained script:

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

// Fade function using duration parameter
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

## Script Execution Model

Digistar runs complete JavaScript files only. Interactive command execution is not supported.

### Self-Contained Scripts (Recommended)

Include all required functions within each script file.

**Advantages:**
- Self-contained, no dependencies
- Portable and easy to share
- No load order issues

**Disadvantages:**
- Function duplication across files
- Changes require updating multiple files

**When to use:** For shows, demos, and standalone scripts

### Example Structure
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

## Reference Files

Examine existing scripts for implementation patterns:

- **`cove-lights/02_library/lighting_control_v2.js`** - Main library with all lighting functions
- **`cove-lights/01_learn/01_simple_test.js`** - Basic color commands
- **`cove-lights/01_learn/02_fade_demo.js`** - Fade effect examples
- **`cove-lights/01_learn/03_preshow_ambiance.js`** - Ambient lighting example
- **`cove-lights/01_learn/04_lights_off.js`** - Clean fade to off sequence
- **`cove-lights/03_templates/show_template.js`** - Complete show template

## Color Reference

RGB values use **0-100 range** (not 0-255):

```javascript
setAll(100, 0, 0);      // Red
setAll(0, 100, 0);      // Green  
setAll(0, 0, 100);      // Blue
setAll(100, 100, 100);  // White
setAll(0, 0, 0);        // Off

// Custom colors
setAll(20, 40, 80);     // Soft blue (pre-show)
setAll(8, 8, 25);       // Dim blue (cinematic)
setAll(0, 20, 63);      // MSU Blue
setAll(100, 78, 17);    // MSU Gold
```

## Important Notes

### Timing
All timing functions use **seconds** (not milliseconds):

```javascript
Ds.Wait(2);      // Waits 2 seconds
Ds.Wait(0.5);    // Waits 0.5 seconds
Ds.Wait(60);     // Waits 1 minute
```

### Fade Effects
Always use the `duration` parameter for smooth fading:

```javascript
// Smooth fade using duration parameter
Ds.SendStringCommand("coveLights segment 0 100 0 0 duration 3");
```

### API Capitalization
Use PascalCase for API functions:

```javascript
// Correct
Ds.SendStringCommand("command");
Ds.SendMessageStatus("message");

// Wrong
Ds.sendStringCommand("command");
Ds.sendMessageStatus("message");
```

### Segments
Total available segments: **128** (indices 0-127)

## Development Tips

1. **Start simple** - Use example scripts as templates
2. **Test incrementally** - Test each change in Digistar
3. **Use logging** - Add `Ds.SendMessage(0, "Step X")` to track execution
4. **Self-contained** - Include all functions in each script
5. **Hardware fades** - Always use `duration` parameter for smooth fades
6. **Timing in seconds** - Never use milliseconds

## JavaScript Limitations

- No ES6 modules (`import`/`export`)
- All functions and variables are global scope
- Must include all required functions within each script file
- Cannot load external libraries
- No interactive command execution

## Best Practices

**Script structure:**
```javascript
// 1. Configuration variables
var TOTAL_SEGMENTS = 128;

// 2. Helper functions
function setSegment(...) { }
function setAll(...) { }
function fadeAll(...) { }

// 3. Main sequence
Ds.SendMessage(0, "Starting");
// Your code here
Ds.SendMessage(0, "Complete");
```

**Error handling:**
```javascript
try {
    // Your code
    Ds.SendMessage(0, "Success");
} catch (error) {
    Ds.SendMessageError("Error: " + error.message);
}
```

**Logging:**
```javascript
Ds.SendMessage(0, "Info message");     // Status
Ds.SendMessage(1, "Warning message");  // Warning
Ds.SendMessage(2, "Error message");    // Error
```

## Further Reading

- **`docs/01_lighting_guide.md`** - Lighting system details and fade effects guide
- **`docs/reference/`** - Complete Digistar 7 API reference
- **`CONTRIBUTING.md`** - Code style and development standards
