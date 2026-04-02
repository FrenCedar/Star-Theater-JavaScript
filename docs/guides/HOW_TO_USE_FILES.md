# How to Use Multiple JavaScript Files in Digistar

## ⚠️ IMPORTANT: Digistar Runs Complete Scripts Only

You can only **run complete .js files** in Digistar, not execute individual commands.

Example:
- ✅ **Works**: Running `my_show.js` (complete script)
- ❌ **Doesn't work**: Loading library, then typing commands interactively

## ✅ OPTION 1: Self-Contained Show Files (RECOMMENDED)

Each show is a complete script with all functions included.

### Structure:
```javascript
// my_show.js

// === FUNCTIONS (at top) ===
var TOTAL_SEGMENTS = 110;

function setAll(r, g, b) {
    for (var i = 0; i < TOTAL_SEGMENTS; i++) {
        Ds.sendStringCommand("coveLights segment " + i + " " + r + " " + g + " " + b);
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

// === SHOW SCRIPT (runs when file is executed) ===
Ds.SendMessageStatus("Starting my show...");

setAll(0, 0, 0);
Ds.Wait(1000);

fadeAll(0, 0, 0, 100, 0, 0, 2000, 50);  // Fade to red
Ds.Wait(2000);

fadeAll(100, 0, 0, 0, 0, 0, 2000, 50);  // Fade to black

Ds.SendMessageStatus("Show complete!");
```

**Just run**: `my_show.js`

**Pros:**
- ✅ Completely self-contained
- ✅ No dependencies
- ✅ Easy to share
- ✅ Works immediately

**Cons:**
- ❌ Duplicate functions in each show
- ❌ Larger files

---

## OPTION 2: Load Files Sequentially

Load multiple files in the correct order using Digistar's script loading mechanism.

### Method A: Using Digistar Script Commands

If Digistar supports script loading:
```javascript
// In your main script:
Ds.LoadScript("lighting_control.js");
// Now all functions from lighting_control.js are available
fadeFromOff(20, 40, 80, 2000, 50);
```

### Method B: Using `.ds` Script Files

Create a `.ds` script that loads your JS files:
```
# main_show.ds
0:00 javascript "lighting_control.js"
0:01 javascript "my_show.js"
```

### Load Order:
1. **First**: `lighting_control.js` (core functions)
2. **Then**: Your show script that uses those functions

---

## OPTION 3: Copy-Paste Functions

For quick one-off shows:

```javascript
// At the top of your show script, copy these functions:

function setSegment(index, r, g, b) {
    Ds.sendStringCommand("coveLights segment " + index + " " + r + " " + g + " " + b);
}

function setAll(r, g, b) {
    for (var i = 0; i < 110; i++) {
        setSegment(i, r, g, b);
    }
}

// ... then your show code:
setAll(100, 0, 0);
Ds.Wait(1000);
setAll(0, 0, 0);
```

**Pros:**
- ✅ Self-contained
- ✅ No dependencies

**Cons:**
- ❌ Duplicate code
- ❌ Hard to maintain

---

## OPTION 4: Create Show-Specific Files

Create files for each show that include everything needed:

```javascript
// basketball_show.js

// === FUNCTIONS (copied from lighting_control.js) ===
function setSegment(index, r, g, b) {
    Ds.sendStringCommand("coveLights segment " + index + " " + r + " " + g + " " + b);
}

function setAll(r, g, b) {
    for (var i = 0; i < 110; i++) {
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

// === SHOW SEQUENCE ===
Ds.SendMessageStatus("Starting basketball show...");

// MSU colors alternating
for (var i = 0; i < 5; i++) {
    setAll(0, 20, 63);  // Blue
    Ds.Wait(200);
    setAll(100, 78, 17); // Gold
    Ds.Wait(200);
}

fadeAll(100, 78, 17, 0, 0, 0, 2000, 50);
Ds.SendMessageStatus("Basketball show complete!");
```

---

## OPTION 5: Build/Concatenate Files (ADVANCED)

Use a script to combine files into one:

### Python Script to Combine Files:

```python
# build_lighting.py
def combine_files(output_file):
    files = [
        'lighting_control.js',
        'my_show.js'
    ]
    
    with open(output_file, 'w') as outfile:
        for fname in files:
            with open(fname) as infile:
                outfile.write(f"\n// ===== {fname} =====\n")
                outfile.write(infile.read())
                outfile.write("\n")

combine_files('combined_show.js')
```

Run: `python build_lighting.py`

Then load `combined_show.js` in Digistar

---

## 📁 Recommended File Structure

```
digistar_js_project/
├── lighting_master.js          ← Use this for most cases
├── lighting_control.js         ← Core library (if loading separately)
├── segment_diagnostic.js       ← Diagnostic tool (standalone)
│
├── shows/                      ← Your show scripts
│   ├── basketball_show.js
│   ├── christmas_show.js
│   └── star_talk_intro.js
│
└── templates/                  ← Templates for new shows
    └── show_template.js
```

---

## 🎯 What We Recommend

### For Testing/Development:
**Use `lighting_master.js`** - Load once, test everything

### For Production Shows:
**Option 4** - Create self-contained show files that include needed functions

### For Quick Tests:
**Option 3** - Copy-paste just the functions you need

---

## 📝 Example: Creating a New Show

### Using Master File:

```javascript
// Load lighting_master.js first in Digistar
// Then run this:

Ds.SendMessageStatus("Starting my show...");

// Pre-show
scenePreShow();
Ds.Wait(5000);

// Intro
chase(100, 0, 0, 5, 50, 2);

// Main show
setAll(20, 20, 60);
// ... show content ...

// End
sceneEndShow();

Ds.SendMessageStatus("Show complete!");
```

### Self-Contained:

```javascript
// my_complete_show.js
// Includes all needed functions at the top

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

// === SHOW STARTS HERE ===

Ds.SendMessageStatus("Starting my show...");

setAll(0, 0, 0);
Ds.Wait(1000);

fadeAll(0, 0, 0, 100, 0, 0, 2000, 50);
Ds.Wait(2000);

fadeAll(100, 0, 0, 0, 0, 0, 2000, 50);

Ds.SendMessageStatus("Show complete!");
```

---

## 🔧 Checking What's Available

If you're not sure what functions are loaded:

```javascript
// Check if a function exists
if (typeof fadeFromOff === 'function') {
    Ds.SendMessageStatus("fadeFromOff is available!");
} else {
    Ds.SendMessageError("fadeFromOff not loaded!");
}

// List all custom functions
Ds.SendMessageStatus("Available functions: setSegment, setAll, fadeAll, chase, wave, pulse, rainbow, sparkle");
```

---

## ⚠️ Important Notes

1. **Global Scope**: All functions and variables are global in Digistar
2. **Name Conflicts**: Don't use the same function names in multiple files
3. **Load Order Matters**: Load base functions before using them
4. **No Modules**: Can't use `import`, `export`, or `require()`
5. **Persistence**: Functions stay loaded until Digistar restarts

---

## 🎬 Quick Start Guide

**For your first show:**

1. Load `lighting_master.js` in Digistar
2. Create a new script file
3. Use the functions:

```javascript
// Your show script
log("Starting my first light show!");

fadeFromOff(100, 0, 0, 2000, 50);  // Fade to red
Ds.Wait(2000);

chase(0, 100, 0, 5, 50, 3);        // Green chase

rainbow(500, 2);                    // Rainbow cycle

fadeToOff(2000, 50);                // Fade to off

log("Show complete!");
```

That's it! 🎆
