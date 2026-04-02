# Segment Limitation Issue

## Problem
Segments above ~110 don't respond to commands, even though the system reports 128 total segments.

## Possible Causes

### 1. **Hardware Issue** (Most Likely)
- Physical segments 110-127 may be disconnected
- Cable issue between controller and segments
- Power supply limitation
- Dead LED segments

### 2. **Configuration Limit**
- System configured for fewer segments
- Firmware limitation
- License restriction

### 3. **Addressing Issue**
- Different command syntax for higher segments
- Index offset problem
- Zero-based vs one-based indexing

## Diagnostic Steps

### Step 1: Run Diagnostics
```javascript
// Load segment_diagnostic.js in Digistar

// Quick test key segments
quickTest();

// Find exact cutoff point
findCutoffPoint();

// Test boundary area
testBoundary();
```

### Step 2: Observe Results
Note which segments respond:
- Last working segment: _____
- First non-working segment: _____
- Pattern of failures: _____

### Step 3: Check Physical Hardware
1. Inspect cove light installation
2. Check cable connections at segment ~110
3. Look for visible damage
4. Check power supply specs

### Step 4: Check System Configuration
Look in Digistar system settings for:
- Maximum segment count
- Hardware configuration
- License limitations

## Solutions Implemented

### 1. Updated All Lighting Scripts
All scripts now use `TOTAL_SEGMENTS` variable (set to 110):
- `lighting_control.js`
- `dynamic_lighting.js`
- Zones auto-calculate based on available segments

### 2. Change Segment Count
After diagnostics, update the count:
```javascript
// In lighting_control.js or dynamic_lighting.js
setTotalSegments(105);  // or whatever your actual count is
```

### 3. Zone Mapping
Zones now automatically adjust:
- **Front**: 0 to 25% of total
- **Right**: 25% to 50% of total
- **Back**: 50% to 75% of total  
- **Left**: 75% to 100% of total

Example with 110 segments:
- Front: 0-27
- Right: 28-54
- Back: 55-82
- Left: 83-109

## Testing After Changes

```javascript
// Test new configuration
printSegmentConfig();

// Test all zones
setZone("front", 100, 0, 0);   // Red
wait(1000);
setZone("right", 0, 100, 0);   // Green
wait(1000);
setZone("back", 0, 0, 100);    // Blue
wait(1000);
setZone("left", 100, 100, 0);  // Yellow
wait(1000);
allOff();
```

## Contact Support

If hardware issue, contact:
- **Cove Light Manufacturer**: _____________________
- **Installation Company**: _______________________
- **MSU Facilities**: 606-783-2066

Provide:
- Exact segment count that works: _____
- Error messages (if any): _____
- Photos of hardware installation
- Results from `segment_diagnostic.js`

## Workarounds

### Option 1: Accept Limitation
- Set `TOTAL_SEGMENTS = 110` (already done)
- All effects work, just with fewer segments

### Option 2: Remap Zones
If segments 110-127 work but others don't, you can manually remap:
```javascript
// Custom zone mapping
var zones = {
    front: {start: 0, end: 20},
    right: {start: 21, end: 50},
    back: {start: 51, end: 80},
    left: {start: 110, end: 127}  // Use the high segments
};
```

### Option 3: Skip Failed Segments
Create a function that skips dead segments:
```javascript
var deadSegments = [45, 67, 89, 110-127];  // List dead segments

function setSegmentSafe(index, r, g, b) {
    if (deadSegments.indexOf(index) === -1) {
        setSegment(index, r, g, b);
    }
}
```

## Next Steps

1. ✅ Run `quickTest()` from `segment_diagnostic.js`
2. ⬜ Document exact segment count that works
3. ⬜ Update `TOTAL_SEGMENTS` to actual count
4. ⬜ Contact facilities/manufacturer if hardware issue
5. ⬜ Test all lighting effects with new configuration

## Notes

**Current Setting**: `TOTAL_SEGMENTS = 110`

**Actual Working Count**: _____ (update after testing)

**Hardware Issue Found**: Yes / No (circle one)

**Date Tested**: _____________

**Tested By**: _____________
