# API Corrections

## Critical API Usage Notes

### 1. Timing Uses Seconds

The `Ds.Wait()` and `Ds.Sleep()` functions use seconds, not milliseconds.

**Incorrect:**
```javascript
Ds.Wait(2000);  // Waits 2000 seconds (33 minutes)
```

**Correct:**
```javascript
Ds.Wait(2);  // Waits 2 seconds
```

### 2. Command Case Sensitivity

API functions use PascalCase naming convention.

**Incorrect:**
```javascript
Ds.sendStringCommand("coveLights segment 0 100 0 0");
```

**Correct:**
```javascript
Ds.SendStringCommand("coveLights segment 0 100 0 0");
```

## Current Files

Scripts in this project use correct API conventions:
- `02_library/lighting_control_v2.js`
- `01_learn/01_simple_test.js`
- See `01_learn/02_fade_demo.js` for fade effect examples.
- `01_learn/04_lights_off.js`
- `04_utilities/segment_diagnostic.js`  

## Quick Reference

### Timing Examples

```javascript
// Correct timing
Ds.Wait(1);      // 1 second
Ds.Wait(0.5);    // Half second
Ds.Wait(2.5);    // 2.5 seconds
Ds.Wait(60);     // 1 minute
Ds.Wait(3600);   // 1 hour

// Fade over 3 seconds with 50 steps
fadeAll(0, 0, 0, 100, 0, 0, 3, 50);  // duration is in SECONDS
```

### Command Examples

```javascript
// Correct commands
Ds.SendStringCommand("coveLights segment 0 100 0 0");
Ds.SendMessageStatus("Status message");
Ds.SendMessageError("Error message");
```

## Migration Guide

If you have old scripts, replace:

1. **All Ds.Wait() calls:**
   - Find: `Ds.Wait(XXX)`
   - Check if XXX is in milliseconds
   - Divide by 1000: `Ds.Wait(XXX / 1000)` or `Ds.Wait(X)` where X = XXX/1000

2. **All sendStringCommand:**
   - Find: `Ds.sendStringCommand`
   - Replace: `Ds.SendStringCommand` (capital S)

3. **All function parameters:**
   - Find: `durationMs` or `delayMs`
   - Replace: `durationSec` or `delaySec`
   - Update calculations accordingly

## Example Conversion

**Before:**
```javascript
function fadeAll(fromR, fromG, fromB, toR, toG, toB, durationMs, steps) {
    var delayMs = durationMs / steps;
    for (var step = 0; step <= steps; step++) {
        // ... color calculation ...
        Ds.Wait(delayMs);
    }
}

// Usage
fadeAll(0, 0, 0, 100, 0, 0, 3000, 50);  // 3000ms = 3 seconds
```

**After:**
```javascript
function fadeAll(fromR, fromG, fromB, toR, toG, toB, durationSec, steps) {
    var delaySec = durationSec / steps;
    for (var step = 0; step <= steps; step++) {
        // ... color calculation ...
        Ds.Wait(delaySec);
    }
}

// Usage
fadeAll(0, 0, 0, 100, 0, 0, 3, 50);  // 3 seconds
```

## Testing Your Scripts

After fixing, test with short durations first:

```javascript
// Test with 1 second fades instead of 3
fadeAll(0, 0, 0, 100, 0, 0, 1, 50);

// Test with 0.1 second delays
Ds.Wait(0.1);
```

If timing feels right, then try longer durations!
