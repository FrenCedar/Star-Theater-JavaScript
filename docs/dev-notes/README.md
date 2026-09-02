# Development Notes

Technical notes and implementation details for Digistar JavaScript project.

## Segment Configuration

Current segment configuration and historical troubleshooting notes.

### Current Setup

Scripts use `TOTAL_SEGMENTS = 128` constant (segments 0-127).

**Zone mapping:**
- Front: segments 0-31
- Right: segments 32-63
- Back: segments 64-95
- Left: segments 96-127

### Diagnostic Tool

Use `cove-lights/04_utilities/segment_diagnostic.js` to test individual segments and verify functionality.

**Quick tests:**
```javascript
quickTest();         // Test key segments (0, 50, 100, 110, 120, 127)
findCutoffPoint();   // Find exact cutoff point
testBoundary();      // Test boundary area
```

### Historical Troubleshooting

**Possible causes of segment issues:**

1. **Hardware Issues**
   - Physical segment disconnection
   - Cable problems between controller and segments
   - Power supply limitations
   - Dead LED segments

2. **Configuration Limits**
   - System configured for fewer segments
   - Firmware limitations
   - License restrictions

3. **Addressing Issues**
   - Command syntax differences for higher segments
   - Index offset problems
   - Zero-based vs one-based indexing

**Diagnostic steps:**

1. Run diagnostics with `segment_diagnostic.js`
2. Observe and note which segments respond
3. Check physical hardware and cable connections
4. Review Digistar 7 system settings for segment configuration

## Constellation Finder Improvements

Comparison between original and improved constellation finder implementations.

### Key Improvements

**1. Uses Native Digistar Capabilities**

Original approach (❌):
- Manually calculated astronomical positions in JavaScript
- Reimplemented celestial mechanics formulas
- Calculated Local Sidereal Time, Hour Angles, Alt/Az transformations
- 600+ lines of complex astronomical math

Improved approach (✓):
- Uses Digistar's built-in constellation objects
- Queries actual Digistar scene objects
- Uses native `Ds.GetObjPositionInDome()` for dome positions
- Leverages Digistar's CELESTIAL coordinate mode

```javascript
// Improved: Use Digistar's native functions
const pos = Ds.GetObjectAttr(objectName, "position", "CELESTIAL");
const domePos = Ds.GetObjPositionInDome(objectName);
```

**Benefit:** More accurate, faster, uses actual Digistar scene objects

**2. Visual Feedback**

Original (❌):
- Text-only console output
- No visual representation
- Difficult to verify results

Improved (✓):
- Creates visual markers in dome at constellation positions
- Real-time visual confirmation
- Easy verification of calculations

**3. Better Performance**

Original:
- Complex astronomical calculations
- Slower execution
- More code to maintain

Improved:
- Leverages optimized Digistar engine
- Faster execution
- Cleaner, more maintainable code

**4. More Accurate**

Uses Digistar's actual astronomical calculations and object database rather than reimplementing celestial mechanics.

### Implementation Files

- **`cove-lights/04_utilities/constellation_finder.js`** - Original implementation (reference)
- **`cove-lights/04_utilities/constellation_finder_improved.js`** - Improved version (recommended)

### Usage Example

```javascript
// Query visible constellations
var constellations = findVisibleConstellations();

// Process results
for (var i = 0; i < constellations.length; i++) {
    Ds.SendMessage(0, constellations[i].name + " is visible");
}
```

## Fade Implementation

All scripts use the `duration` parameter for smooth color transitions.

### Benefits

- 99.5% fewer commands (128 vs 25,600)
- Hardware-calculated interpolation
- No JavaScript processing overhead
- Consistent smooth fading
- Optimal performance

### Implementation

Scripts using fade effects:
- `cove-lights/02_library/lighting_control_v2.js`
- `cove-lights/01_learn/02_fade_demo.js`
- `cove-lights/01_learn/01_simple_test.js`
- `cove-lights/01_learn/03_preshow_ambiance.js`
- `cove-lights/01_learn/04_lights_off.js`
- `cove-lights/04_utilities/segment_diagnostic.js`

### Example

```javascript
// Fade all segments using duration parameter
function fadeAll(toR, toG, toB, durationSec) {
    for (var i = 0; i < TOTAL_SEGMENTS; i++) {
        Ds.SendStringCommand("coveLights segment " + i + " " + toR + " " + toG + " " + toB + " duration " + durationSec);
    }
    Ds.Wait(durationSec);
}
```

See `docs/01_lighting_guide.md` for complete fade effects documentation.

## Development Standards

See `CONTRIBUTING.md` for code style guidelines and development workflow.

**Key standards:**
- Use the `duration` parameter for smooth fading
- All timing in **seconds** (not milliseconds)
- Use `Ds.SendStringCommand` (PascalCase)
- RGB values are **0-100** (not 0-255)
- Total segments: **128** (indices 0-127)
