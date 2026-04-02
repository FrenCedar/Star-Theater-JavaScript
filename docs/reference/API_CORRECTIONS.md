# ⚠️ IMPORTANT API CORRECTIONS

## Critical Fixes Applied

### 1. **Ds.Wait Uses SECONDS, Not Milliseconds!**

**Wrong:**
```javascript
Ds.Wait(2000);  // ❌ This waits 2000 SECONDS (33 minutes!)
```

**Correct:**
```javascript
Ds.Wait(2);  // ✅ This waits 2 SECONDS
```

### 2. **Ds.SendStringCommand (Capital S)**

**Wrong:**
```javascript
Ds.sendStringCommand("coveLights segment 0 100 0 0");  // ❌ Lowercase 's'
```

**Correct:**
```javascript
Ds.SendStringCommand("coveLights segment 0 100 0 0");  // ✅ Capital 'S'
```

## All Corrected Files

✅ **lighting_control.js** - Fixed  
✅ **cinematic_mode.js** - Fixed  
✅ **cinematic_mode_continuous.js** - Fixed  
✅ **examples/simple_test.js** - Fixed  
✅ **examples/fade_test.js** - Fixed  
✅ **examples/preshow_ambiance.js** - Fixed  
✅ **examples/lights_off.js** - Fixed  

⚠️ **lighting_master.js** - Needs update  
⚠️ **cinematic_presets.js** - Needs update  
⚠️ **segment_diagnostic.js** - Needs update  

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
