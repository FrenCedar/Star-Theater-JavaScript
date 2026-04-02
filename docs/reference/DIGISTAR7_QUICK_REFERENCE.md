# Digistar 7 Quick Reference

**One-page cheat sheet for common Digistar 7 scripting patterns**

---

## Attribute Access

```javascript
// Get attribute
var value = Ds.GetObjectAttr("objectName", "attributeName");

// Set attribute (instant)
Ds.SetObjectAttr("objectName", "attributeName", value);

// Set attribute (animated over time)
Ds.SetObjectAttr("objectName", "attributeName", value, {time: 5.0});
```

---

## Common Objects & Attributes

| Object | Attribute | Type | Example Value |
|--------|-----------|------|---------------|
| `"eye"` | `"position"` | Position | `{x: 0, y: 0, z: 100}` |
| `"Scene"` | `"intensity"` | Float | `100.0` (0-100) |
| Any light | `"intensity"` | Float | `75.0` (0-100) |
| Any light | `"color"` | Color | `{r: 255, g: 0, b: 0}` |
| Any object | `"visible"` | Boolean | `true` / `false` |

---

## Position

```javascript
// Cartesian (default)
var pos = {x: 100.0, y: 0.0, z: 50.0};

// Spherical (Azimuth, Elevation, Radius)
var pos = {
    x: 0.0,                    // Azimuth (radians)
    y: 45 * Math.PI/180,       // Elevation (radians)  
    z: 100.0,                  // Radius
    mode: "Spherical",
    units: "meter"
};

// Celestial (RA, Dec, Distance)
var pos = {
    x: 6.75,                   // RA (hours)
    y: -16.7 * Math.PI/180,    // Dec (radians)
    z: 8.6,                    // Distance
    mode: "Celestial",
    units: "light_year"
};

Ds.SetObjectAttr("eye", "position", pos);
```

---

## Color

```javascript
// RGB (0-255)
var red = {r: 255, g: 0, b: 0};
var green = {r: 0, g: 255, b: 0};
var blue = {r: 0, g: 0, b: 255};
var white = {r: 255, g: 255, b: 255};
var black = {r: 0, g: 0, b: 0};

// RGBA with transparency
var translucentRed = {r: 255, g: 0, b: 0, a: 128};

Ds.SetObjectAttr("light", "color", red);
```

---

## Animation Controllers

```javascript
// Basic fade (5 seconds)
Ds.SetObjectAttr("light", "intensity", 100.0, {time: 5.0});

// With easing
Ds.SetObjectAttr("light", "intensity", 0.0, {
    time: 3.0,
    func: "EaseOut"
});

// Easing functions:
// "Linear", "EaseIn", "EaseOut", "EaseInOut"

// With ramp up/down
Ds.SetObjectAttr("eye", "position", newPos, {
    time: 10.0,
    ramp: 2.0
});
```

---

## Object Management

```javascript
// Create object
Ds.CreateObject("myLight", "Light", "transient");
// Types: "permanent", "transient", "temporary"

// Delete object
Ds.DeleteObject("myLight");

// Check if exists (returns 0 if not found)
if (Ds.GetObjectID("myLight") !== 0) {
    // Object exists
}

// Add to scene (make visible)
Ds.SceneAddObject("myLight");

// Remove from scene
Ds.SceneRemoveObject("myLight");
```

---

## Timing

```javascript
// Sleep (script pauses, Digistar continues)
Ds.Sleep(5.0);  // Sleep 5 seconds

// Wait (everything stops - use sparingly!)
Ds.Wait(5.0);   // Wait 5 seconds
```

---

## Angles

```javascript
// Digistar uses RADIANS, not degrees!

// Degrees to radians
var radians = degrees * (Math.PI / 180.0);

// Radians to degrees
var degrees = radians * (180.0 / Math.PI);

// Common angles
var deg_0   = 0.0;
var deg_45  = Math.PI / 4;      // 0.7854
var deg_90  = Math.PI / 2;      // 1.5708
var deg_180 = Math.PI;          // 3.1416
var deg_270 = 3 * Math.PI / 2;  // 4.7124
var deg_360 = 2 * Math.PI;      // 6.2832
```

---

## Debugging

```javascript
// Print to console
print("Debug: value = " + myVariable);

// Enable verbose logging
Ds.SetObjectAttr("script", "verbose", true);

// Log message
Ds.SendMessage(0, "Info message");    // Level 0 = Info
Ds.SendMessage(1, "Warning message"); // Level 1 = Warning
Ds.SendMessage(2, "Error message");   // Level 2 = Error

// Check object exists
if (Ds.GetObjectID("myObject") === 0) {
    print("ERROR: Object not found");
}
```

---

## File Operations

```javascript
// Check if file exists
if (Ds.FileExists("C:\\Content\\file.txt")) {
    // File exists
}

// Read file (returns array of lines)
var lines = Ds.FileRead("C:\\Content\\data.txt");

// Write file
var data = ["Line 1", "Line 2"];
Ds.FileWrite("C:\\Content\\output.txt", data);

// Resolve paths
var fullPath = Ds.ResolvePath("$Content/Scripts/show.js");
```

---

## Common Patterns

### Fade Light In/Out
```javascript
// Fade in (5 seconds)
Ds.SetObjectAttr("light", "intensity", 100.0, {time: 5.0, func: "EaseOut"});
Ds.Sleep(5.0);

// Fade out (3 seconds)
Ds.SetObjectAttr("light", "intensity", 0.0, {time: 3.0, func: "EaseIn"});
Ds.Sleep(3.0);
```

### Pulse Effect
```javascript
function pulse(light, min, max, duration) {
    Ds.SetObjectAttr(light, "intensity", max, {time: duration/2});
    Ds.Sleep(duration/2);
    Ds.SetObjectAttr(light, "intensity", min, {time: duration/2});
    Ds.Sleep(duration/2);
}

pulse("myLight", 20, 100, 2.0);
```

### Color Cycle
```javascript
var colors = [
    {r: 255, g: 0, b: 0},    // Red
    {r: 0, g: 255, b: 0},    // Green
    {r: 0, g: 0, b: 255}     // Blue
];

for (var i = 0; i < colors.length; i++) {
    Ds.SetObjectAttr("light", "color", colors[i], {time: 1.0});
    Ds.Sleep(2.0);
}
```

### Safe Attribute Set
```javascript
function setAttrSafe(object, attr, value) {
    if (Ds.GetObjectID(object) === 0) {
        print("ERROR: " + object + " not found");
        return false;
    }
    Ds.SetObjectAttr(object, attr, value);
    return true;
}
```

### Wait for Controller to Finish
```javascript
// Start animation
var duration = 10.0;
Ds.SetObjectAttr("eye", "position", targetPos, {time: duration});

// Wait for completion
Ds.Sleep(duration);
```

---

## Script Control

```javascript
// Run script
js.play myScript.js

// Pause
js.pause myScript.js

// Resume
js.resume myScript.js

// Stop
js.stop myScript.js
```

---

## Path Syntax

```javascript
// Use double backslash for Windows paths
"C:\\Content\\Scripts\\show.js"

// Or use $Content variable
"$Content/Scripts/show.js"

// Resolve to full path
var fullPath = Ds.ResolvePath("$Content/Scripts/show.js");
```

---

## Error Handling

```javascript
try {
    Ds.SetObjectAttr("myObject", "intensity", 100);
} catch (e) {
    print("ERROR: " + e);
    Ds.SendMessage(2, "Error: " + e);
}
```

---

## Units Reference

### Position Modes
- `CARTESIAN` (CAR) - X, Y, Z
- `SPHERICAL` (SPH) - Az, El, R
- `CELESTIAL` (CEL) - RA, Dec, Dist
- `RELATIVE` (REL) - Relative to object
- `ORBIT` (ORB) - Orbital elements
- `GALACTIC` (GAL) - Galactic coords
- `ELLIPTIC` (ELL) - Elliptic coords

### Distance Units
- `METER` (M)
- `KILOMETER` (KM)
- `AU` - Astronomical Unit
- `PARSEC` (PC)
- `LIGHT_YEAR` (LY)
- `MEGA_PARSEC` (MPC)
- `EARTH_RADIUS` (RE)
- `SUN_RADIUS` (RSUN)

---

## Most Used Functions

```javascript
// Attributes
Ds.GetObjectAttr(object, attribute)
Ds.SetObjectAttr(object, attribute, value)
Ds.SetObjectAttr(object, attribute, value, controller)

// Objects
Ds.CreateObject(name, class, type)
Ds.DeleteObject(name)
Ds.GetObjectID(name)

// Scene
Ds.SceneAddObject(object)
Ds.SceneRemoveObject(object)

// Time
Ds.Sleep(seconds)
Ds.Wait(seconds)

// Output
print(text)
Ds.SendMessage(level, message)

// Files
Ds.FileExists(path)
Ds.FileRead(path)
Ds.FileWrite(path, data)
```

---

## Remember!

1. ✅ **Angles in RADIANS** (not degrees)
2. ✅ **Check object exists** before using
3. ✅ **Use Ds.Sleep()** not Ds.Wait() in loops
4. ✅ **Controllers for smooth animations**
5. ✅ **Double backslash** in Windows paths
6. ✅ **Colors 0-255** for RGB
7. ✅ **Intensity 0-100** for lights
8. ✅ **Create objects as "transient"** for auto-cleanup

---

**For complete reference, see:** `DIGISTAR7_COMPLETE_REFERENCE.md`
