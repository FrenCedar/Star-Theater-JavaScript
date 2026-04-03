# Hardware Fade Update Summary

Documentation of hardware fade implementation in project scripts.

## Hardware Fade Benefits

- 99.5% fewer commands (128 vs 25,600)
- Hardware-calculated interpolation
- No JavaScript processing overhead
- Consistent smooth fading

## Current Implementation

Existing files using hardware fades:
- `core_lighting/lighting_control_v2.js`
- `examples/fade_test_hardware.js`
- `examples/simple_test.js`
- `examples/preshow_ambiance.js`
- `examples/lights_off.js`
- `utilities/segment_diagnostic.js`

## Implementation Comparison

Software fade (deprecated):
```javascript
fadeAll(0, 0, 0, 100, 0, 0, 10, 200);
// 25,600 commands for 200 steps across 128 segments
```

Hardware fade (current):
```javascript
fadeAll(100, 0, 0, 10);
// 128 commands, hardware interpolates
```

## Function Signatures

Hardware fade functions:
```javascript
fadeAll(toR, toG, toB, durationSec);
fadeFromOff(toR, toG, toB, durationSec);
fadeToOff(durationSec);
fadeZone(zoneName, toR, toG, toB, durationSec);
```

## Reference

See `docs/lighting/HARDWARE_FADE_GUIDE.md` for implementation details and best practices.
