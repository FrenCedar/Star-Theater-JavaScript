# Easiest Workflow for Digistar Lighting

## ⚡ Super Simple Method (No Python Needed!)

### Step 1: Use the Ready-Made Examples

These files are **complete** and ready to run in Digistar:

```
examples/simple_test.js         - Test RGB colors (red, green, blue)
examples/fade_test.js           - Smooth color transitions
examples/preshow_ambiance.js    - Pre-show soft blue lighting
examples/lights_off.js          - Fade lights to off
segment_diagnostic.js           - Test which segments work
```

**Just run any of these in Digistar - they work immediately!**

---

### Step 2: Create Your Own Show by Copying

1. **Copy an example file**
   ```
   Copy: examples/fade_test.js
   To: my_custom_show.js
   ```

2. **Open `my_custom_show.js` in a text editor**

3. **Find the "TEST SEQUENCE" section** (near the bottom)

4. **Modify it** to do what you want:
   ```javascript
   // === TEST SEQUENCE ===
   
   Ds.SendMessageStatus("Starting MY custom show...");
   
   // Your custom sequence here:
   setAll(100, 0, 0);     // Red
   Ds.Wait(1000);
   
   setAll(0, 100, 0);     // Green
   Ds.Wait(1000);
   
   fadeAll(0, 100, 0, 0, 0, 100, 2000, 50);  // Fade green to blue
   
   Ds.SendMessageStatus("My show complete!");
   ```

5. **Save the file**

6. **Run it in Digistar!**

---

## 📋 Copy-Paste Functions

If you want to create a show from scratch, copy these core functions to the top of your file:

### Minimal Function Set (Copy these to your file):

```javascript
// === CONFIGURATION ===
var TOTAL_SEGMENTS = 110;

// === BASIC FUNCTIONS ===

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

// === YOUR SHOW CODE BELOW ===

Ds.SendMessageStatus("Starting show...");

setAll(100, 0, 0);  // Red
Ds.Wait(2000);

fadeAll(100, 0, 0, 0, 0, 0, 2000, 50);  // Fade to black

Ds.SendMessageStatus("Show complete!");
```

Save this as `my_show.js` and run it!

---

## 🎨 More Functions (Optional - Copy if needed)

### Zones
```javascript
var zones = {
    front: {start: 0, end: 27},
    right: {start: 28, end: 54},
    back: {start: 55, end: 82},
    left: {start: 83, end: 109}
};

function setZone(zoneName, r, g, b) {
    var zone = zones[zoneName];
    for (var i = zone.start; i <= zone.end; i++) {
        setSegment(i, r, g, b);
    }
}
```

### Chase Effect
```javascript
function chase(r, g, b, segmentSize, delayMs, loops) {
    loops = loops || 1;
    segmentSize = segmentSize || 5;
    
    for (var loop = 0; loop < loops; loop++) {
        for (var pos = 0; pos < TOTAL_SEGMENTS; pos++) {
            setAll(0, 0, 0);  // Turn all off
            
            for (var i = 0; i < segmentSize; i++) {
                var index = (pos + i) % TOTAL_SEGMENTS;
                setSegment(index, r, g, b);
            }
            
            Ds.Wait(delayMs);
        }
    }
}
```

### Rainbow
```javascript
function rainbow(delayMs, loops) {
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
            setAll(colors[c][0], colors[c][1], colors[c][2]);
            Ds.Wait(delayMs);
        }
    }
}
```

---

## 📂 Where to Put Your Files

### Option 1: In the Digistar Scripts Folder
Put your `.js` files wherever Digistar looks for scripts (check your Digistar manual)

### Option 2: On Desktop (Easy Access)
Keep them on your desktop or in a folder like:
```
C:\Users\Nathan\DigistarShows\
```

Then browse to them when running scripts in Digistar.

---

## 🎯 Example: Creating a Basketball Show

1. **Create new file**: `basketball_show.js`

2. **Copy minimal functions** (from above)

3. **Add your sequence**:
```javascript
// === BASKETBALL SHOW ===

Ds.SendMessageStatus("Starting basketball show...");

// MSU colors alternating
for (var i = 0; i < 5; i++) {
    setAll(0, 20, 63);   // MSU Blue
    Ds.Wait(200);
    setAll(100, 78, 17); // MSU Gold
    Ds.Wait(200);
}

// Fade to off
fadeAll(100, 78, 17, 0, 0, 0, 2000, 50);

Ds.SendMessageStatus("Basketball show complete!");
```

4. **Save and run in Digistar!**

---

## 🔧 Testing Your Show

1. **Start with a simple test**:
   ```javascript
   setAll(100, 0, 0);  // All red
   Ds.Wait(2000);      // Wait 2 seconds
   setAll(0, 0, 0);    // All off
   ```

2. **If that works, add more complexity**

3. **Save often and test in small chunks**

---

## ⚠️ Remember

- **RGB is 0-100** (not 0-255)
- **Only 110 segments work** (not 128)
- **Each file must be complete** - include functions at the top
- **Test on a few segments first** if you're not sure

---

## 💡 Quick Reference

```javascript
// Colors (RGB 0-100)
setAll(100, 0, 0);      // Red
setAll(0, 100, 0);      // Green  
setAll(0, 0, 100);      // Blue
setAll(100, 100, 100);  // White
setAll(0, 0, 0);        // Off

// Fade
fadeAll(100, 0, 0, 0, 0, 100, 2000, 50);  // Red to blue, 2 seconds

// Wait
Ds.Wait(1000);  // Wait 1 second (1000 milliseconds)

// Message
Ds.SendMessageStatus("Hello!");
```

---

## 🎬 That's It!

No Python needed. No build tools. Just copy, edit, and run! 🎆
