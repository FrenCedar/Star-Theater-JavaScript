# Segment Limitation Notes

Historical notes on segment count configuration.

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

## Current Configuration

Scripts use `TOTAL_SEGMENTS = 128` constant.

Zone mapping (0-127):
- Front: segments 0-31
- Right: segments 32-63
- Back: segments 64-95
- Left: segments 96-127

## Diagnostic Tool

Use `utilities/segment_diagnostic.js` to test individual segments and verify functionality.
