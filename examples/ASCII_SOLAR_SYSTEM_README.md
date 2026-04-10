# ASCII Solar System Script

Creates a realistic, rotating solar system visualization using ASCII art textures on the Digistar dome.

## Features

- **9 celestial bodies**: Sun + 8 planets with realistic relative sizes and distances
- **ASCII art textures**: Uses custom-converted planet textures
- **Realistic rotation**: Each planet rotates at its proper rate
- **Orbital rings**: Optional orbit visualization
- **Planet labels**: Named labels positioned below each planet
- **Smooth animations**: Fade-in sequence for dramatic reveal
- **Self-illuminated Sun**: Glowing central star

## Requirements

### 1. ASCII Planet Textures

You must generate ASCII textures for all planets using the ASCII converter:

**Required texture files** (in `$Content\User\Textures\ASCII_Planets\`):
- `ascii_sun.png`
- `ascii_mercury.png`
- `ascii_venus.png`
- `ascii_earth.png`
- `ascii_mars.png`
- `ascii_jupiter.png`
- `ascii_saturn.png`
- `ascii_uranus.png`
- `ascii_neptune.png`

### 2. Generate Textures

Use the ASCII converter GUI:

```bash
cd ascii_converter
python ascii_converter_gui.py
```

**Recommended settings for each planet:**
- **Scale Factor**: 0.5 (for performance)
- **Character Set**: Blocks (Braille) for smooth gradients
- **Color Boost**: 1.2-1.5 (for vibrant colors)
- **Character Density**: ☑ Invert for dark backgrounds
- **Solid Block Background**: ☑ Enabled (for full color coverage)

**Suggested source images:**
- Download from [NASA Solar System Textures](https://www.solarsystemscope.com/textures/)
- Or search for "planet texture 4k" to find high-quality images

### 3. Deploy Textures

Copy generated PNG files to:
```
$Content\User\Textures\ASCII_Planets\
```

## Usage

### Run the Script

```javascript
js.play $Content\User\Scripts\ascii_solar_system.js
```

The script will:
1. Create the solar system scene
2. Load all planet textures
3. Position planets at scaled distances
4. Fade in with animation sequence
5. Start planetary rotations
6. Display title and labels

### Stop the Script

```javascript
js.stop ascii_solar_system
```

This triggers the cleanup function that fades out and removes all objects.

## Configuration

Edit the `CONFIG` object at the top of the script to customize:

### Distance and Size

```javascript
distanceScale: 20,    // 1 AU = 20 dome units
sizeScale: 3,         // Planet size multiplier
```

**Notes:**
- Real solar system scale would be too large for dome
- Distances are compressed for visibility
- Sizes are exaggerated for visual impact

### Visual Options

```javascript
showOrbits: true,              // Display orbital rings
orbitColor: [30, 30, 30],      // Dim gray orbits

showLabels: true,              // Show planet names
labelDistance: 5               // Units below planet
```

### Rotation Speed

```javascript
rotationSpeed: 10    // Global rotation multiplier
```

Increase for faster rotation, decrease for slower.

## Planet Data

Each planet has configurable properties:

```javascript
Earth: {
    texture: "ascii_earth.png",    // Texture filename
    distance: 1.0,                 // AU from Sun
    radius: 1.0,                   // Relative to Earth
    color: [70, 90, 100],          // RGB tint (0-100)
    rotation: 15                   // Degrees per second
}
```

**Modify values to:**
- Change planet positions
- Adjust relative sizes
- Alter rotation speeds
- Tweak color tints

## Camera Control

Default camera position provides good overview:

```javascript
position: [0, 50, -100]    // Above and behind
attitude: [0, -20, 0]      // Looking down
```

**To change the view**, edit these lines:

```javascript
Ds.SetObjectAttr("asciiCamera", "position", [x, y, z]);
Ds.SetObjectAttr("asciiCamera", "attitude", [h, p, r]);
```

## Animation Sequence

The script includes a timed fade-in sequence:

1. **Title** (2 seconds)
2. **Sun** (3 seconds) 
3. **Inner planets** (2 seconds) - Mercury, Venus, Earth, Mars
4. **Outer planets** (3 seconds) - Jupiter, Saturn, Uranus, Neptune
5. **Title dims** (2 seconds)
6. **Hold** (1 hour or until stopped)

### Customize Animation

Edit the animation section to change timing:

```javascript
Ds.SetObjectAttr("asciiSun", "intensity", 100, 3);  // Last param is duration
Ds.Wait(2);  // Pause between steps
```

## Troubleshooting

### "Texture not found" errors

**Solution:** Ensure all texture files exist:
```
$Content\User\Textures\ASCII_Planets\ascii_[planet].png
```

Check exact filenames match the script.

### Planets don't appear

**Causes:**
- Textures missing
- Intensity set to 0
- Objects outside camera view

**Debug:**
```javascript
Ds.SendMessageStatus("Check: " + Ds.GetObjectAttr("asciiEarth", "intensity"));
```

### Rotations not working

**Check:**
```javascript
Ds.GetObjectAttr("asciiEarth", "attitudeRate");
// Should return: [0, 15, 0]
```

### Performance issues

**Solutions:**
- Reduce `sizeScale` (smaller planets = better performance)
- Use lower-resolution textures
- Disable orbits: `showOrbits: false`
- Reduce `distanceScale` (brings planets closer together)

## Advanced Customization

### Add Moons

```javascript
// Create Earth's Moon
Ds.CreateObject("asciiMoon", "solidModelClass", "temporary");
Ds.SetObjectAttr("asciiMoon", "model", "$Software\\Models\\Primitives\\sphere.x");
Ds.SetObjectAttr("asciiMoon", "modelTexture", CONFIG.texturePath + "ascii_moon.png");
Ds.SetObjectAttr("asciiMoon", "scale", [0.7, 0.7, 0.7]);
Ds.SetObjectAttr("asciiMoon", "position", [24, 0, 0]);  // Offset from Earth
Ds.AddObjectChild("asciiEarth", "asciiMoon");  // Parent to Earth
Ds.SendStringCommand("asciiSolarSystem add asciiMoon fixed");
```

### Orbital Motion

To make planets orbit (not just rotate):

```javascript
// Add orbital motion controller
Ds.CreateObject("earthOrbit", "orbiterClass", "temporary");
Ds.SetObjectAttr("earthOrbit", "orbitRate", 0.1);  // Degrees per second
Ds.SetObjectAttr("earthOrbit", "orbitRadius", 20);  // Distance from Sun
Ds.AddObjectChild("earthOrbit", "asciiEarth");
```

### Different Viewing Angles

**Top-down view:**
```javascript
Ds.SetObjectAttr("asciiCamera", "position", [0, 200, 0]);
Ds.SetObjectAttr("asciiCamera", "attitude", [0, -90, 0]);
```

**Close-up on inner planets:**
```javascript
Ds.SetObjectAttr("asciiCamera", "position", [0, 30, -40]);
Ds.SetObjectAttr("asciiCamera", "attitude", [0, -25, 0]);
```

## Integration with Shows

### Pre-show Display

```javascript
// In your main show script:
js.play $Content\User\Scripts\ascii_solar_system.js

// Wait for audience to settle
Ds.Wait(300);  // 5 minutes

// Stop solar system, start show
js.stop ascii_solar_system
Ds.Wait(3);  // Wait for cleanup
// ... begin main show ...
```

### Intermission

```javascript
// During break
js.play $Content\User\Scripts\ascii_solar_system.js
Ds.Wait(600);  // 10 minutes
js.stop ascii_solar_system
```

## Performance Notes

- **Object count**: 27-54 objects (9 planets × 1-6 objects each)
- **Texture memory**: ~50-200 MB depending on resolution
- **CPU load**: Minimal (hardware rotations)
- **Recommended for**: Pre-show, intermissions, standalone displays

## File Locations

```
digistar_js_project/
├── examples/
│   ├── ascii_solar_system.js          ← Main script
│   └── ASCII_SOLAR_SYSTEM_README.md   ← This file
└── ascii_converter/
    ├── ascii_converter_gui.py         ← Texture generator
    └── digistar_ascii_solar_system.ds ← Old .ds version (deprecated)
```

## Credits

Script uses Digistar 7 native features:
- `solidModelClass` for sphere models
- `textClass` for labels
- `circleClass` for orbits
- `sceneClass` for organization
- Hardware-accelerated rotations via `attitudeRate`
