# Digistar 7 Complete Scripting Reference

**Comprehensive guide to Digistar 7 JavaScript scripting for planetarium control**

---

## Table of Contents

1. [System Overview](#system-overview)
2. [Core Concepts](#core-concepts)
3. [Attribute Types](#attribute-types)
4. [Object Management](#object-management)
5. [Scene Control](#scene-control)
6. [Position & Coordinates](#position--coordinates)
7. [Animation & Controllers](#animation--controllers)
8. [Debugging](#debugging)
9. [File & Directory Operations](#file--directory-operations)
10. [Communication](#communication)
11. [System Commands](#system-commands)
12. [Complete Function Reference](#complete-function-reference)
13. [Code Examples](#code-examples)
14. [Best Practices](#best-practices)

---

## System Overview

### Script Execution

**Running Scripts:**
```javascript
// Command line
js.play [scriptPath]

// Programmatically
Ds.SetObjectAttr("script", "execute", "path/to/script.js");
```

**Script Control:**
```javascript
js.pause [script]   // Pause execution
js.resume [script]  // Resume paused script
js.stop [script]    // Stop script
```

### Script Types

Scripts are created as objects with different persistence:
- **permanent**: Survives Fade/Stop/Reset
- **transient**: Removed on Fade/Stop/Reset (default)
- **temporary**: Removed when script finishes

---

## Core Concepts

### Angles: Degrees vs Radians

**Critical:** JavaScript uses **radians**, but Digistar commands often use **degrees**.

```javascript
// Convert degrees to radians
var radians = degrees * (Math.PI / 180.0);

// Convert radians to degrees
var degrees = radians * (180.0 / Math.PI);

// Example
var angle_deg = 45;
var angle_rad = angle_deg * (Math.PI / 180.0);  // 0.7854 radians
```

### Position Modes

Valid position modes (can be abbreviated to 3 characters):

- **CARTESIAN** (CAR): Standard XYZ coordinates
- **SPHERICAL** (SPH): Azimuth, Elevation, Radius
- **CELESTIAL** (CEL): Right Ascension, Declination, Distance
- **RELATIVE** (REL): Relative to another object
- **ORBIT** (ORB): Orbital parameters
- **GALACTIC** (GAL): Galactic coordinates
- **ELLIPTIC** (ELL): Elliptic coordinates

### Distance Units

Available units for position attributes:

- **METER** (M)
- **KILOMETER** (KM)
- **AU** - Astronomical Unit
- **PARSEC** (PC)
- **LIGHT_YEAR** (LY)
- **MEGA_PARSEC** (MPC)
- **EARTH_RADIUS** (RE)
- **SUN_RADIUS** (RSUN)

### Quote Characters and Paths

```javascript
// Single or double quotes both work
var path1 = 'C:\\Content\\Scripts\\show.js';
var path2 = "C:\\Content\\Scripts\\show.js";

// Use double backslash for Windows paths
var correctPath = "C:\\Content\\Media\\image.png";

// Single backslash will cause errors
// var wrongPath = "C:\Content\Media\image.png";  // DON'T DO THIS
```

---

## Attribute Types

All attribute get/set operations follow this pattern:
```javascript
// Get attribute
var value = Ds.GetObjectAttr(objectName, attributeName);

// Set attribute
Ds.SetObjectAttr(objectName, attributeName, value);

// Set with controller (animated)
Ds.SetObjectAttr(objectName, attributeName, value, controller);
```

### Boolean (SDSBoolAttr)

```javascript
// Get
var visible = Ds.GetObjectAttr("myObject", "visible");

// Set
Ds.SetObjectAttr("myObject", "visible", true);
Ds.SetObjectAttr("myObject", "visible", false);
```

**Value:** Boolean (true/false or non-zero/zero)

### 2-Dimensional Boolean (SDSBool2Attr)

```javascript
var value = {x: true, y: false};
Ds.SetObjectAttr("myObject", "attribute", value);
```

**Value:** Object with `.x` and `.y` boolean components

### 3-Dimensional Boolean (SDSBool3Attr)

```javascript
var value = {x: true, y: false, z: true};
Ds.SetObjectAttr("myObject", "attribute", value);
```

**Value:** Object with `.x`, `.y`, and `.z` boolean components

### Integers

**Types:** SDSInt16Attr, SDSInt32Attr, SDSUInt8Attr, SDSUInt32Attr

```javascript
// Signed 32-bit integer
Ds.SetObjectAttr("myObject", "count", 42);

// Unsigned 8-bit integer (0-255)
Ds.SetObjectAttr("myObject", "brightness", 255);
```

**Value:** Signed or unsigned integers (8-bit, 16-bit, or 32-bit)

### Floating Point

**Types:** SDSFloatAttr, SDSDoubleAttr

```javascript
// Single precision float
Ds.SetObjectAttr("myObject", "scale", 1.5);

// Double precision
Ds.SetObjectAttr("myObject", "distance", 1.234567890123);
```

### Angle (SDSAngleAttr)

```javascript
// Angle in RADIANS
var angle = 45 * (Math.PI / 180);  // Convert 45° to radians
Ds.SetObjectAttr("myObject", "rotation", angle);
```

**Value:** Double representing angle in **radians**

### Hour Angle (SDSHourAngleAttr)

```javascript
var hourAngle = 6.5;  // 6.5 hours
Ds.SetObjectAttr("telescope", "hourAngle", hourAngle);
```

**Value:** Double representing hour angle

### 2-Dimensional Integer Vector (SDSIVector2Attr)

```javascript
var position = {x: 100, y: 200};
Ds.SetObjectAttr("sprite", "position", position);

// Get
var pos = Ds.GetObjectAttr("sprite", "position");
print("X: " + pos.x + ", Y: " + pos.y);
```

**Value:** Object with `.x` and `.y` (signed 32-bit integers)

### 2-Dimensional Float Vector (SDSFVector2Attr)

```javascript
var offset = {x: 1.5, y: 2.7};
Ds.SetObjectAttr("myObject", "offset", offset);
```

**Value:** Object with `.x` and `.y` (single-precision floats)

### 2-Dimensional Double Vector (SDSDVector2Attr)

```javascript
var coords = {x: 123.456789, y: 987.654321};
Ds.SetObjectAttr("myObject", "coordinates", coords);
```

**Value:** Object with `.x` and `.y` (double-precision)

### 2-Dimensional Distance Vector (SDSDistance2Attr)

```javascript
// Get with units
var distance = Ds.GetObjectAttr("myObject", "offset", "AU");
print("X: " + distance.x + ", Y: " + distance.y + ", Units: " + distance.units);

// Set
var value = {x: 5.0, y: 10.0, units: "AU"};
Ds.SetObjectAttr("myObject", "offset", value);
```

**Value:** Object with `.x`, `.y`, and `.units`

### 3-Dimensional Integer Vector (SDSIVector3Attr)

```javascript
var position = {x: 100, y: 200, z: 300};
Ds.SetObjectAttr("myObject", "gridPosition", position);
```

**Value:** Object with `.x`, `.y`, `.z` (signed 32-bit integers)

### 3-Dimensional Float Vector (SDSFVector3Attr)

```javascript
var velocity = {x: 1.5, y: 2.0, z: -0.5};
Ds.SetObjectAttr("particle", "velocity", velocity);
```

**Value:** Object with `.x`, `.y`, `.z` (single-precision floats)

### 3-Dimensional Double Vector (SDSDVector3Attr)

```javascript
var direction = {x: 0.707, y: 0.707, z: 0.0};
Ds.SetObjectAttr("myObject", "direction", direction);
```

**Value:** Object with `.x`, `.y`, `.z` (double-precision)

### 4-Dimensional Double Vector (SDSDVector4Attr)

```javascript
var quaternion = {x: 0.0, y: 0.0, z: 0.0, w: 1.0};
Ds.SetObjectAttr("myObject", "orientation", quaternion);
```

**Value:** Object with `.x`, `.y`, `.z`, `.w` (double-precision)

### Text String (SDSStringAttr)

```javascript
// Set
Ds.SetObjectAttr("label", "text", "Hello Digistar!");

// Get
var text = Ds.GetObjectAttr("label", "text");
print(text);
```

**Value:** Text string

### Command String (SDSCommandStringAttr)

```javascript
// Get
var cmd = Ds.GetObjectAttr("myObject", "command");
print("Command: " + cmd.command);
print("Directory: " + cmd.directory);

// Set with string
Ds.SetObjectAttr("myObject", "command", "myCommand.bat");

// Set with object
var cmdObj = {
    command: "myScript.js",
    directory: "C:\\Content\\Scripts"
};
Ds.SetObjectAttr("myObject", "command", cmdObj);
```

**Get returns:** Object with `.command` and `.directory`
**Set accepts:** String or object `{command: "...", directory: "..."}`

### Path Names

**Types:** SDSTextureNameAttr, SDSTerrainNameAttr, SDSScriptPathnameAttr, SDSAudioPathnameAttr, etc.

```javascript
// Set texture
Ds.SetObjectAttr("planet", "texture", "$Content/Textures/earth.jpg");

// Set audio
Ds.SetObjectAttr("sound", "audioFile", "C:\\Content\\Audio\\music.wav");

// Set script
Ds.SetObjectAttr("myObject", "script", "$Content/Scripts/automation.js");
```

**Value:** String containing file path (can use $Content variable)

### JavaScript Path Name (SDSJSPathnameAttr)

```javascript
// Get
var jsPath = Ds.GetObjectAttr("myObject", "jsPathname");
print("Path: " + jsPath.path);
print("Parameters: " + jsPath.parameters);
print("Permanent: " + jsPath.permanent);

// Set
var scriptPath = {
    path: "$Content/Scripts/show.js",
    parameters: "myFunction(42, 'test')",
    permanent: false  // Script stops on Fade/Stop/Reset
};
Ds.SetObjectAttr("myObject", "jsPathname", scriptPath);
```

**Value:** Object with:
- `.path`: String with file path
- `.parameters`: String with optional function call/parameters
- `.permanent`: Boolean flag (script continues after Fade/Stop/Reset)

### Position (SDSPositionAttr)

```javascript
// Get with mode
var pos = Ds.GetObjectAttr("eye", "position", "SPHERICAL");
print("Az: " + pos.x + ", El: " + pos.y + ", R: " + pos.z);
print("Mode: " + pos.mode + ", Units: " + pos.units);

// Set Cartesian (default mode/units)
var posValue = {x: 0.0, y: 0.0, z: 58.0};
Ds.SetObjectAttr("eye", "position", posValue);

// Set Spherical with explicit mode/units
var posValue = {
    x: 0.0,
    y: 10.0 * Math.PI/180.0,  // 10 degrees elevation in radians
    z: 58.0,
    mode: "Spherical",
    units: "rsun"
};
Ds.SetObjectAttr("eye", "position", posValue);

// Set with controller (animated movement)
var newPos = {x: 100.0, y: 50.0, z: 0.0};
Ds.SetObjectAttr("eye", "position", newPos, {time: 5.0});
```

**Value:** Object with `.x`, `.y`, `.z` and optionally `.mode` and `.units`

**Note:** `mode` and `units` can be omitted when they are CARTESIAN and METERS

### Color (SDSColorAttr)

```javascript
// RGB (0-255)
var red = {r: 255, g: 0, b: 0};
Ds.SetObjectAttr("light", "color", red);

// RGBA with alpha (transparency)
var translucentBlue = {r: 0, g: 0, b: 255, a: 128};
Ds.SetObjectAttr("overlay", "color", translucentBlue);

// Get
var color = Ds.GetObjectAttr("light", "color");
print("R: " + color.r + ", G: " + color.g + ", B: " + color.b);
```

**Value:** Object with `.r`, `.g`, `.b` and optionally `.a` (alpha)
**Range:** 0-255 for each component

### Date/Time (SDSDateTimeAttr)

```javascript
// Set using Julian Date
var jd = 2451545.0;  // J2000.0
Ds.SetObjectAttr("simulation", "date", jd);

// Get
var currentDate = Ds.GetObjectAttr("simulation", "date");
print("Julian Date: " + currentDate);

// Using JavaScript Date object extensions
var now = new Date();
var julianDate = now.getJulian();
Ds.SetObjectAttr("simulation", "date", julianDate);
```

**Value:** Double representing Julian Date

### Enumeration (SDSEnumerationAttr)

```javascript
// Set by index
Ds.SetObjectAttr("myObject", "renderMode", 2);

// Get
var mode = Ds.GetObjectAttr("myObject", "renderMode");
print("Current mode index: " + mode);
```

**Value:** Integer representing enumeration index

### Timecode (SDSTimecodeAttr)

```javascript
// Get
var tc = Ds.GetObjectAttr("timecode", "value");
print("Text: " + tc.text);      // "01:23:45:12"
print("Frame: " + tc.frame);    // Frame number
print("Rate: " + tc.rate);      // Frames per second
print("Mode: " + tc.mode);      // Timecode mode enum

// Set
var tcValue = {
    text: "00:05:30:00",
    frame: 8250,
    rate: 30,
    mode: 0
};
Ds.SetObjectAttr("timecode", "value", tcValue);
```

**Value:** Object with `.text` (string), `.frame` (int), `.rate` (int), `.mode` (enum)

### Color Transfer (SDSColorTransferAttr)

Used to define piecewise color transfer functions for color correction/grading.

```javascript
var colorTransfer = {
    inRed: [0.0, 0.5, 1.0],
    inGreen: [0.0, 0.5, 1.0],
    inBlue: [0.0, 0.5, 1.0],
    outRed: [0.0, 0.6, 1.0],
    outGreen: [0.0, 0.4, 1.0],
    outBlue: [0.0, 0.7, 1.0],
    outAlpha: [1.0, 1.0, 1.0],
    inInclusive: true,
    outInclusive: true
};
Ds.SetObjectAttr("colorGrading", "transfer", colorTransfer);
```

**Value:** Object with arrays for input/output color channels and inclusivity flags

---

## Object Management

### Creating Objects

```javascript
// Create permanent object
Ds.CreateObject("myLight", "Light", "permanent");

// Create transient object (default - removed on Fade/Stop/Reset)
Ds.CreateObject("tempMarker", "Marker", "transient");

// Create temporary object (removed when script finishes)
Ds.CreateObject("scriptData", "DataObject", "temporary");
```

**Syntax:** `Ds.CreateObject(name, className, type)`

**Types:**
- `"permanent"`: Survives Fade/Stop/Reset
- `"transient"`: Removed on Fade/Stop/Reset (default)
- `"temporary"`: Removed when script finishes

### Deleting Objects

```javascript
Ds.DeleteObject("myLight");
```

### Getting Object Information

```javascript
// Get object ID
var id = Ds.GetObjectID("myObject");
print("Object ID: " + id);

// Get child objects
var children = Ds.GetObjectChildNames("parentObject");
for (var i = 0; i < children.length; i++) {
    print("Child: " + children[i]);
}

// Check if object exists (ID returns 0 if not found)
if (Ds.GetObjectID("myObject") !== 0) {
    print("Object exists");
}
```

### Class Information

```javascript
// Get class ID
var classId = Ds.GetClassID("Light");
print("Light class ID: " + classId);

// Get all attributes for a class
var attrs = Ds.GetClassAttributeNames("Light");
for (var i = 0; i < attrs.length; i++) {
    print("Attribute: " + attrs[i]);
}

// Get default value for an attribute
var defaultColor = Ds.GetClassAttributeDefault("Light", "color");
print("Default light color: R=" + defaultColor.r + " G=" + defaultColor.g + " B=" + defaultColor.b);
```

### Getting and Setting Attributes

```javascript
// Get attribute
var intensity = Ds.GetObjectAttr("myLight", "intensity");

// Set attribute
Ds.SetObjectAttr("myLight", "intensity", 100.0);

// Set with animation controller
Ds.SetObjectAttr("myLight", "intensity", 50.0, {time: 3.0});

// Reset attribute to default value
Ds.ResetObjectAttr("myLight", "intensity");
```

### Attribute References (Performance Optimization)

Use references when getting/setting attributes in loops:

```javascript
// Get reference once
var intensityRef = Ds.GetObjectAttributeRef("myLight", "intensity");

// Use in loop (faster than repeated GetObjectAttr calls)
for (var i = 0; i < 1000; i++) {
    var value = Ds.GetObjectAttr(intensityRef);
    // Process value...
    Ds.SetObjectAttr(intensityRef, value + 1);
}
```

### Event Processing

Trigger events when attributes change:

```javascript
// Set up event trigger
Ds.SetObjectEvent("myLight", "intensity");

// Now when intensity changes, an event is generated
// (Can be caught by external systems)
```

### Callbacks

Execute JavaScript functions when attributes or commands change:

```javascript
// Callback when attribute changes
function onIntensityChange(object, attribute, value) {
    print(object + "." + attribute + " changed to " + value);
}
Ds.AddObjectAttributeCallback("myLight", "intensity", onIntensityChange);

// Callback when command is executed
function onCommandExecute(object, command) {
    print("Command executed: " + command + " on " + object);
}
Ds.AddObjectCommandCallback("myObject", "myCommand", onCommandExecute);
```

---

## Scene Control

### Adding/Removing Objects from Scene

```javascript
// Add object to scene (makes it render)
Ds.SceneAddObject("myPlanet");

// Add with ordering (before or after another object)
Ds.SceneAddObject("moon", "myPlanet", null);  // Add before myPlanet
Ds.SceneAddObject("ring", null, "myPlanet");  // Add after myPlanet

// Remove from scene (stops rendering, but object still exists)
Ds.SceneRemoveObject("myPlanet");
```

### Setting Simulation Date

```javascript
// Set using Julian Date
Ds.SceneSetDate(2451545.0);  // J2000.0

// Set using JavaScript Date
var date = new Date();
Ds.SceneSetDate(date.getJulian());

// Set specific date
var specificDate = new Date(2024, 0, 1);  // Jan 1, 2024
Ds.SceneSetDate(specificDate.getJulian());
```

---

## Position & Coordinates

### Dome Coordinate Conversion

```javascript
// Convert Azimuth/Elevation to Cartesian
var cart = Ds.DomeToCartesian(180.0, 45.0, 1.0);
print("X: " + cart.x + ", Y: " + cart.y + ", Z: " + cart.z);

// Convert Cartesian to Azimuth/Elevation
var dome = Ds.CartesianToDome(0.707, 0.707, 0.0);
print("Azimuth: " + dome.azimuth + ", Elevation: " + dome.elevation);

// Get dome position of an object
var objDomePos = Ds.GetObjPositionInDome("myObject");
print("Object at Az: " + objDomePos.azimuth + ", El: " + objDomePos.elevation);
```

### Position Examples

```javascript
// Cartesian position (default)
var cartPos = {x: 100.0, y: 0.0, z: 50.0};
Ds.SetObjectAttr("eye", "position", cartPos);

// Spherical position (Azimuth, Elevation, Radius)
var sphPos = {
    x: 0.0,                      // Azimuth (radians)
    y: 45 * Math.PI/180,         // Elevation (radians)
    z: 100.0,                    // Radius
    mode: "Spherical",
    units: "meter"
};
Ds.SetObjectAttr("eye", "position", sphPos);

// Celestial position (RA, Dec, Distance)
var celPos = {
    x: 6.75,                     // Right Ascension (hours)
    y: -16.7 * Math.PI/180,      // Declination (radians)
    z: 8.6,                      // Distance
    mode: "Celestial",
    units: "light_year"
};
Ds.SetObjectAttr("star", "position", celPos);
```

---

## Animation & Controllers

### Controller Basics

Controllers animate attribute changes over time instead of setting them instantly.

```javascript
// Basic controller: fade intensity over 5 seconds
Ds.SetObjectAttr("light", "intensity", 100.0, {time: 5.0});

// Controller with easing
Ds.SetObjectAttr("light", "intensity", 0.0, {
    time: 3.0,
    func: "EaseOut"
});

// Controller with ramp time
Ds.SetObjectAttr("eye", "position", newPos, {
    time: 10.0,
    ramp: 2.0  // 2 sec ramp up/down
});
```

### Controller Parameters

```javascript
var controller = {
    time: 5.0,           // Total time in seconds
    ramp: 0.0,           // Time to ramp up/down
    rate: 0.0,           // Rate parameter (advanced)
    func: "Linear",      // Function type
    stop: true,          // Stop controller at end
    relative: false      // Relative to current value
};

Ds.SetObjectAttr("object", "attribute", targetValue, controller);
```

**Function types:**
- `"Linear"` (default)
- `"EaseIn"`
- `"EaseOut"`
- `"EaseInOut"`

### Helper Controller Functions

```javascript
// Run attribute to value over time
Ds.ObjectRunTo("myObject", "rotation", 6.28, 10.0);  // Rotate 360° in 10 sec

// Move object to target position
Ds.ObjectMoveTo("spacecraft", "earth", {
    time: 30.0,
    distance: 10000.0,
    units: "km"
});

// Make object face target
Ds.ObjectFace("spacecraft", "earth", 0.0, 5.0);  // Face earth in 5 seconds

// Orbit around target
Ds.ObjectOrbit("moon", "earth", {
    distance: 384400.0,
    units: "km",
    period: 86400.0,  // 24 hours
    inclination: 5.0 * Math.PI/180
});

// Stop all controllers on object
Ds.ObjectStop("myObject");
```

---

## Debugging

### Visual Debugging in Script Editor

**Setting Breakpoints:**
1. Click in the empty space left of line numbers
2. Red dot appears indicating breakpoint

**Toolbar Actions:**
- ▶ **Play Script**: Run script
- ⏸ **Toggle Breakpoint**: Add/remove breakpoint at current line
- ⏭ **Step to Next Line**: Execute one line
- ⏩ **Execute to Next Breakpoint**: Run until breakpoint
- ⏹ **Stop Script**: Terminate script

### Verbose Logging

```javascript
// Enable verbose output for debugging
Ds.SetObjectAttr("script", "verbose", true);

// This prints extensive information to console
// including attribute changes, function calls, etc.

// Disable when done
Ds.SetObjectAttr("script", "verbose", false);
```

### Command-Line Debugging

```javascript
// Set breakpoint
js.b myScript.js:42

// Single-step to next line
js.s

// Continue execution (run to next breakpoint)
js.c

// Remove breakpoint by ID
js.rb 1

// List all breakpoints
js.lb

// Clear all breakpoints
js.cb

// Evaluate expression
js.expr myVariable + 10

// Display variable value
js.var myVariable

// Quit debugging
js.q
```

### Debugging Techniques

```javascript
// Print to console
print("Debug: value = " + myVariable);

// Print object properties
var obj = Ds.GetObjectAttr("myObject", "position");
print("Position: " + JSON.stringify(obj));

// Log to Digistar message system
Ds.SendMessage(0, "Debug message");  // Level 0 = info

// Check object exists before using
if (Ds.GetObjectID("myObject") === 0) {
    print("ERROR: myObject not found!");
    return;
}

// Try-catch for error handling
try {
    Ds.SetObjectAttr("myObject", "intensity", 100);
} catch (e) {
    print("ERROR: " + e);
}
```

---

## File & Directory Operations

### Directory Operations

```javascript
// Search for files
var files = Ds.DirectorySearch("C:\\Content\\Textures", "*.jpg", true);
for (var i = 0; i < files.length; i++) {
    print("Found: " + files[i]);
}

// Check if file exists
if (Ds.FileExists("C:\\Content\\Scripts\\show.js")) {
    print("File exists");
}

// Create directory
Ds.CreateDirectory("C:\\Content\\MyShows");

// Delete directory
Ds.DeleteDirectory("C:\\Content\\TempData");
```

### File I/O

```javascript
// Read file (returns array of lines)
var lines = Ds.FileRead("C:\\Content\\Data\\config.txt");
for (var i = 0; i < lines.length; i++) {
    print("Line " + i + ": " + lines[i]);
}

// Write file
var data = ["Line 1", "Line 2", "Line 3"];
Ds.FileWrite("C:\\Content\\output.txt", data);

// Copy file
Ds.FileCopy("C:\\Content\\original.txt", "C:\\Content\\backup.txt");

// Get file size
var size = Ds.FileGetSize("C:\\Content\\large_file.dat");
print("File size: " + size + " bytes");

// Get file modification time
var modTime = Ds.FileGetTime("C:\\Content\\script.js");
print("Last modified: " + modTime);
```

### Download Files

```javascript
// Download file from URL
Ds.FileDownload("https://example.com/data.json", "C:\\Content\\downloaded.json");
```

### Resolve Paths

```javascript
// Resolve $Content and other variables to full paths
var fullPath = Ds.ResolvePath("$Content/Scripts/show.js");
print("Full path: " + fullPath);
// Output: "C:\DigistarContent\Scripts\show.js" (or similar)
```

---

## Communication

### Serial Communication

```javascript
// Open serial port
var serial = new Serial(
    "COM3",     // Port
    9600,       // Baud rate
    "N",        // Parity (N/E/O)
    8,          // Data bits
    1,          // Stop bits
    "None"      // Flow control (None/Hardware/Software)
);

// Check if open
if (serial.isOpen()) {
    print("Serial port opened");
    
    // Write data
    serial.write("Hello Device\r\n");
    
    // Read data
    var response = serial.read();
    print("Received: " + response);
    
    // Close when done
    serial.close();
}
```

### Socket Communication (TCP/UDP)

```javascript
// Create TCP socket
var socket = new Socket("192.168.1.100", 8080, "TCP");

// Connect to server
if (socket.connect()) {
    print("Connected to server");
    
    // Send data
    socket.send("GET /data HTTP/1.1\r\n\r\n");
    
    // Read response
    var response = socket.read();
    print("Response: " + response);
}

// UDP socket
var udpSocket = new Socket("192.168.1.255", 9000, "UDP");
udpSocket.send("Broadcast message");

// Server mode (listen for connections)
var server = new Socket("0.0.0.0", 8080, "TCP");
server.listen();
// When client connects, server.read() will receive data
```

### MIDI

```javascript
// Get available MIDI devices
var devices = Midi.getDevices();
for (var i = 0; i < devices.length; i++) {
    print("MIDI device: " + devices[i]);
}

// Open MIDI device
var midi = new Midi("USB MIDI Device");

// Send MIDI message (3 bytes)
midi.write([0x90, 0x3C, 0x7F]);  // Note On, Middle C, Full velocity

// Read MIDI message
var message = midi.read();
if (message) {
    print("MIDI: " + message[0] + " " + message[1] + " " + message[2]);
}
```

### Timecode

```javascript
// Create timecode interface
var tc = new Timecode("LTC", 30);  // Linear Timecode, 30 fps

// Send timecode
tc.send(3600.0);  // Start sending from 1 hour

// Listen for incoming timecode
tc.listen();

// Wait for specific timecode
tc.waitFor(7200.0);  // Pause script until 2 hours received
print("Timecode reached!");
```

---

## System Commands

### Execute System Commands

```javascript
// Run Windows command
Ds.SystemCommand("notepad.exe C:\\Content\\notes.txt");

// Run batch file
Ds.SystemCommand("C:\\Content\\Scripts\\setup.bat");

// Run with parameters
Ds.SystemCommand("ffmpeg -i input.mp4 -o output.avi");
```

### External Processes

```javascript
// Start external process
var process = new Process(
    "C:\\Tools\\processor.exe",
    ["--input", "data.txt", "--output", "result.txt"]
);

// Execute
process.execute();

// Check if running
if (process.isRunning()) {
    print("Process is running");
}

// Read stdout
var output = process.read();
print("Process output: " + output);

// Write to stdin
process.write("input data\n");

// Wait for process to finish
while (process.isRunning()) {
    Ds.Sleep(0.1);
}
```

### System Information

```javascript
// Get system memory info
var memInfo = Ds.SystemMemory();
print("Total Memory: " + memInfo.total + " bytes");
print("Available Memory: " + memInfo.available + " bytes");
print("Used Memory: " + memInfo.used + " bytes");
print("Usage: " + (memInfo.used / memInfo.total * 100).toFixed(1) + "%");
```

### Popup Messages

```javascript
// Simple OK message
VirtualUI.PopupMessage(
    "Show is about to start!",  // Message text
    "Notification",              // Caption/title
    0,                           // Type: 0=OK, 1=OK/Cancel, 2=Yes/No, etc.
    1                            // Icon: 0=None, 1=Info, 2=Warning, 3=Error
);

// Yes/No dialog
var result = VirtualUI.PopupMessage(
    "Do you want to continue?",
    "Confirm",
    2,  // Yes/No buttons
    2   // Warning icon
);

if (result === 1) {  // 1 = Yes
    print("User clicked Yes");
} else {
    print("User clicked No");
}
```

### Messaging

```javascript
// Send message to Digistar log/console
Ds.SendMessage(0, "Info message");     // Level 0 = Info
Ds.SendMessage(1, "Warning message");  // Level 1 = Warning
Ds.SendMessage(2, "Error message");    // Level 2 = Error

// Send message to target system
Ds.SendMessage("NetworkNode", "StartShow");
```

### Wait and Sleep

```javascript
// Wait (suspends JavaScript processing completely)
Ds.Wait(5.0);  // Wait 5 seconds

// Sleep (pauses script thread, but Digistar continues)
Ds.Sleep(2.0);  // Sleep 2 seconds
// Use Sleep in loops to prevent blocking
```

### System Reset

```javascript
// CAUTION: Resets the entire Digistar system
Ds.Reset();
```

### QR Code Generation

```javascript
// Generate QR code image
Ds.CreateQRCode(
    "https://example.com",                    // Text to encode
    "C:\\Content\\Images\\qrcode.png",       // Output file
    false,                                    // Invert colors
    4,                                        // Border size
    10                                        // Scale/size
);
```

---

## Complete Function Reference

### Date Functions (JavaScript Date Extensions)

```javascript
var date = new Date();

// Get/Set Julian Date
var jd = date.getJulian();
date.setJulian(2451545.0);  // Set to J2000.0

// Get Modified Julian Date
var mjd = date.getModifiedJulian();

// Format date string
var formatted = date.format("%Y-%m-%d %H:%M:%S");
// Format codes: %Y=year, %m=month, %d=day, %H=hour, %M=minute, %S=second
```

### Object Functions (Summary)

```javascript
// Creation/Deletion
Ds.CreateObject(name, className, type);
Ds.DeleteObject(name);

// Information
Ds.GetObjectID(name);
Ds.GetObjectChildNames(object);

// Attributes
Ds.GetObjectAttr(object, attribute);
Ds.SetObjectAttr(object, attribute, value, controller);
Ds.ResetObjectAttr(object, attribute);
Ds.GetObjectAttributeRef(object, attribute);

// Events/Callbacks
Ds.SetObjectEvent(object, attribute);
Ds.AddObjectAttributeCallback(object, attribute, func);
Ds.AddObjectCommandCallback(object, command, func);

// Controllers
Ds.ObjectRunTo(object, attribute, value, time);
Ds.ObjectMoveTo(object, target, options);
Ds.ObjectFace(object, target, roll, time);
Ds.ObjectOrbit(object, target, options);
Ds.ObjectStop(object);
```

### Class Functions

```javascript
Ds.GetClassID(name);
Ds.GetClassAttributeNames(className);
Ds.GetClassAttributeDefault(className, attribute);
```

### Scene Functions

```javascript
Ds.SceneAddObject(object, before, after);
Ds.SceneRemoveObject(object);
Ds.SceneSetDate(julianDate);
```

### Coordinate Functions

```javascript
Ds.DomeToCartesian(azimuth, elevation, radius);
Ds.CartesianToDome(x, y, z);
Ds.GetObjPositionInDome(object);
```

### File Functions

```javascript
Ds.DirectorySearch(path, pattern, recursive);
Ds.FileExists(path);
Ds.CreateDirectory(path);
Ds.DeleteDirectory(path);
Ds.FileRead(path);
Ds.FileWrite(path, data);
Ds.FileCopy(source, dest);
Ds.FileDownload(url, file);
Ds.FileGetSize(path);
Ds.FileGetTime(path);
```

### System Functions

```javascript
Ds.SystemCommand(cmd);
Ds.SystemMemory();
Ds.ResolvePath(path);
Ds.Reset();
Ds.Wait(seconds);
Ds.Sleep(seconds);
Ds.SendMessage(level, message);
Ds.CreateQRCode(text, file, invert, border, scale);
VirtualUI.PopupMessage(text, caption, type, icon);
```

### Script Control

```javascript
// Command line
js.play [script]
js.pause [script]
js.resume [script]
js.stop [script]

// Programmatic
Ds.SetObjectAttr("script", "execute", scriptPath);
```

---

## Code Examples

### Example 1: Animated Light Fade

```javascript
// Fade light from 0 to 100 over 5 seconds
Ds.SetObjectAttr("houseLight", "intensity", 100.0, {time: 5.0, func: "EaseOut"});

// Wait for fade to complete
Ds.Sleep(5.0);

// Fade back down
Ds.SetObjectAttr("houseLight", "intensity", 0.0, {time: 3.0, func: "EaseIn"});
```

### Example 2: Position Eye at Planet

```javascript
// Get planet position
var planetPos = Ds.GetObjectAttr("mars", "position");

// Set eye position near planet
var eyePos = {
    x: planetPos.x + 1000.0,  // 1000 units away
    y: planetPos.y,
    z: planetPos.z,
    mode: planetPos.mode,
    units: planetPos.units
};

Ds.SetObjectAttr("eye", "position", eyePos, {time: 10.0});
```

### Example 3: Load and Display Images

```javascript
// Create image objects
for (var i = 1; i <= 10; i++) {
    var name = "slide" + i;
    Ds.CreateObject(name, "Image", "transient");
    
    var imagePath = "$Content/Shows/MyShow/slide" + i + ".jpg";
    Ds.SetObjectAttr(name, "texture", imagePath);
    Ds.SetObjectAttr(name, "intensity", 0.0);  // Start invisible
    
    Ds.SceneAddObject(name);
}

// Show slides with fade
for (var i = 1; i <= 10; i++) {
    var name = "slide" + i;
    
    // Fade in
    Ds.SetObjectAttr(name, "intensity", 100.0, {time: 2.0});
    Ds.Sleep(8.0);  // Display for 8 seconds
    
    // Fade out
    Ds.SetObjectAttr(name, "intensity", 0.0, {time: 2.0});
    Ds.Sleep(2.0);
}
```

### Example 4: Pulsing Effect

```javascript
function pulse(objectName, minValue, maxValue, duration) {
    // Fade from min to max
    Ds.SetObjectAttr(objectName, "intensity", maxValue, {time: duration/2, func: "EaseInOut"});
    Ds.Sleep(duration/2);
    
    // Fade from max to min
    Ds.SetObjectAttr(objectName, "intensity", minValue, {time: duration/2, func: "EaseInOut"});
    Ds.Sleep(duration/2);
}

// Pulse 5 times
for (var i = 0; i < 5; i++) {
    pulse("myLight", 20.0, 100.0, 2.0);
}
```

### Example 5: Color Cycling

```javascript
var colors = [
    {r: 255, g: 0, b: 0},     // Red
    {r: 255, g: 127, b: 0},   // Orange
    {r: 255, g: 255, b: 0},   // Yellow
    {r: 0, g: 255, b: 0},     // Green
    {r: 0, g: 0, b: 255},     // Blue
    {r: 127, g: 0, b: 255}    // Purple
];

// Cycle through colors
for (var i = 0; i < colors.length; i++) {
    Ds.SetObjectAttr("rgbLight", "color", colors[i], {time: 1.0});
    Ds.Sleep(2.0);
}
```

### Example 6: File-Based Configuration

```javascript
// Read configuration from file
var configLines = Ds.FileRead("$Content/Shows/config.txt");

var config = {};
for (var i = 0; i < configLines.length; i++) {
    var line = configLines[i].trim();
    if (line.length === 0 || line[0] === '#') continue;  // Skip empty/comments
    
    var parts = line.split('=');
    if (parts.length === 2) {
        config[parts[0].trim()] = parts[1].trim();
    }
}

// Use configuration
print("Show Name: " + config["showName"]);
print("Duration: " + config["duration"]);
```

### Example 7: Interactive Callback

```javascript
var clickCount = 0;

function onButtonClick(object, attribute, value) {
    if (value === true) {  // Button pressed
        clickCount++;
        print("Button clicked " + clickCount + " times");
        
        // Flash light on each click
        Ds.SetObjectAttr("indicatorLight", "intensity", 100.0);
        Ds.Sleep(0.1);
        Ds.SetObjectAttr("indicatorLight", "intensity", 0.0);
    }
}

// Add callback to button
Ds.AddObjectAttributeCallback("myButton", "pressed", onButtonClick);

// Let it run
print("Click the button! Script will run for 60 seconds...");
Ds.Sleep(60.0);
```

### Example 8: Network Data Display

```javascript
// Connect to data server
var socket = new Socket("192.168.1.50", 8000, "TCP");

if (socket.connect()) {
    // Request data
    socket.send("GET_TEMPERATURE\n");
    
    // Receive response
    var response = socket.read();
    var temp = parseFloat(response);
    
    // Display temperature
    Ds.SetObjectAttr("tempLabel", "text", "Temperature: " + temp.toFixed(1) + "°C");
    
    // Color code based on value
    if (temp < 20) {
        Ds.SetObjectAttr("tempLabel", "color", {r: 0, g: 0, b: 255});  // Cold = Blue
    } else if (temp > 30) {
        Ds.SetObjectAttr("tempLabel", "color", {r: 255, g: 0, b: 0});  // Hot = Red
    } else {
        Ds.SetObjectAttr("tempLabel", "color", {r: 0, g: 255, b: 0});  // Normal = Green
    }
}
```

### Example 9: Automated Tour

```javascript
var locations = [
    {name: "Mercury", distance: 10000, time: 5},
    {name: "Venus", distance: 15000, time: 5},
    {name: "Earth", distance: 20000, time: 8},
    {name: "Mars", distance: 15000, time: 5}
];

for (var i = 0; i < locations.length; i++) {
    var loc = locations[i];
    
    print("Visiting " + loc.name + "...");
    
    // Move to planet
    Ds.ObjectMoveTo("eye", loc.name, {
        distance: loc.distance,
        units: "km",
        time: 3.0
    });
    
    // Face planet
    Ds.ObjectFace("eye", loc.name, 0.0, 2.0);
    
    // Wait at location
    Ds.Sleep(loc.time);
}

print("Tour complete!");
```

### Example 10: MIDI-Controlled Lights

```javascript
var midi = new Midi("USB MIDI Controller");

print("Listening for MIDI control changes...");

while (true) {
    var msg = midi.read();
    
    if (msg && msg.length >= 3) {
        var status = msg[0];
        var controller = msg[1];
        var value = msg[2];
        
        // Check if Control Change message (0xB0)
        if ((status & 0xF0) === 0xB0) {
            // Map controller 1 to light intensity (0-127 -> 0-100)
            if (controller === 1) {
                var intensity = (value / 127.0) * 100.0;
                Ds.SetObjectAttr("controlledLight", "intensity", intensity);
            }
            
            // Map controller 2 to color (0-127 -> 0-255)
            if (controller === 2) {
                var colorVal = (value / 127.0) * 255.0;
                Ds.SetObjectAttr("controlledLight", "color", {r: colorVal, g: 0, b: 0});
            }
        }
    }
    
    Ds.Sleep(0.01);  // Small delay to prevent CPU overload
}
```

---

## Best Practices

### 1. Always Check Object Existence

```javascript
// Good
if (Ds.GetObjectID("myObject") !== 0) {
    Ds.SetObjectAttr("myObject", "intensity", 100);
} else {
    print("ERROR: myObject not found");
}

// Bad - will crash if object doesn't exist
Ds.SetObjectAttr("myObject", "intensity", 100);
```

### 2. Use Controllers for Smooth Animations

```javascript
// Good - smooth animation
Ds.SetObjectAttr("light", "intensity", 100.0, {time: 3.0, func: "EaseOut"});

// Bad - instant change (jarring)
Ds.SetObjectAttr("light", "intensity", 100.0);
```

### 3. Use Sleep Not Wait in Loops

```javascript
// Good - allows Digistar to continue
while (running) {
    // Do work
    Ds.Sleep(0.1);
}

// Bad - blocks everything
while (running) {
    // Do work
    Ds.Wait(0.1);  // Freezes Digistar!
}
```

### 4. Clean Up Transient Objects

```javascript
// Create objects as transient so they auto-cleanup
Ds.CreateObject("tempMarker", "Marker", "transient");

// Or manually delete when done
Ds.DeleteObject("tempMarker");
```

### 5. Use Attribute References in Loops

```javascript
// Good - get reference once
var ref = Ds.GetObjectAttributeRef("light", "intensity");
for (var i = 0; i < 1000; i++) {
    Ds.SetObjectAttr(ref, i / 10.0);
}

// Bad - repeated string lookups (slow)
for (var i = 0; i < 1000; i++) {
    Ds.SetObjectAttr("light", "intensity", i / 10.0);
}
```

### 6. Handle Errors Gracefully

```javascript
try {
    Ds.SetObjectAttr("myObject", "position", newPos);
} catch (e) {
    print("ERROR setting position: " + e);
    Ds.SendMessage(2, "Position error: " + e);  // Log as error
}
```

### 7. Use Descriptive Names

```javascript
// Good
var fadeTime = 5.0;
var maxIntensity = 100.0;
Ds.SetObjectAttr("houselights", "intensity", maxIntensity, {time: fadeTime});

// Bad
var t = 5.0;
var i = 100.0;
Ds.SetObjectAttr("hl", "int", i, {time: t});
```

### 8. Comment Complex Logic

```javascript
// Calculate dome position for visitor location
// Converts lat/lon to az/el, accounting for dome tilt
var domeAz = visitorLon + domeTilt;
var domeEl = 90.0 - visitorLat;  // Zenith = 90°

// Convert to radians for Digistar
domeAz = domeAz * Math.PI / 180.0;
domeEl = domeEl * Math.PI / 180.0;
```

### 9. Organize with Functions

```javascript
function fadeLight(name, target, duration) {
    if (Ds.GetObjectID(name) === 0) {
        print("ERROR: Light " + name + " not found");
        return false;
    }
    
    Ds.SetObjectAttr(name, "intensity", target, {
        time: duration,
        func: "EaseInOut"
    });
    return true;
}

// Use throughout script
fadeLight("house", 100.0, 3.0);
fadeLight("cove", 75.0, 5.0);
```

### 10. Log Important Events

```javascript
// Start of show
Ds.SendMessage(0, "Show 'Night Sky' started");

// Key moments
Ds.SendMessage(0, "Transitioning to Mars segment");

// Errors
Ds.SendMessage(2, "ERROR: Failed to load texture: " + texturePath);

// End
Ds.SendMessage(0, "Show 'Night Sky' completed successfully");
```

---

## Quick Reference Card

### Most Common Commands

```javascript
// Get/Set Attributes
var value = Ds.GetObjectAttr(object, attribute);
Ds.SetObjectAttr(object, attribute, value);
Ds.SetObjectAttr(object, attribute, value, {time: seconds});

// Create/Delete Objects
Ds.CreateObject(name, class, "transient");
Ds.DeleteObject(name);

// Scene Control
Ds.SceneAddObject(object);
Ds.SceneRemoveObject(object);

// Timing
Ds.Sleep(seconds);  // Pause script (Digistar continues)
Ds.Wait(seconds);   // Suspend everything

// Position (Cartesian)
var pos = {x: 0, y: 0, z: 100};
Ds.SetObjectAttr("eye", "position", pos);

// Color
var color = {r: 255, g: 0, b: 0};  // Red
Ds.SetObjectAttr("light", "color", color);

// Debugging
print("Debug message");
Ds.SetObjectAttr("script", "verbose", true);
```

### Angle Conversion

```javascript
var radians = degrees * (Math.PI / 180);
var degrees = radians * (180 / Math.PI);
```

### Controller Pattern

```javascript
Ds.SetObjectAttr(object, attribute, targetValue, {
    time: 5.0,
    func: "EaseInOut",
    ramp: 1.0
});
```

---

## Additional Resources

### Internal Documentation
- Check Digistar's built-in help system
- Use `Ds.GetClassAttributeNames(class)` to explore available attributes
- Enable verbose mode for detailed execution logs

### Community
- Consult with other Digistar operators
- Share scripts and techniques
- Document your solutions for future reference

### Support
- Contact E&S (Evans & Sutherland) technical support
- Check for system updates and new features
- Review release notes for API changes

---

**Document Version:** 1.0  
**Last Updated:** December 2024  
**System:** Digistar 7  
**Source:** User's Guide Scripting Reference (Extracted)

---

**END OF REFERENCE DOCUMENT**
