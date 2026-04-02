# Cinematic Mode Scripts

Subtle ambient lighting perfect for movies and shows.

## 🎬 Quick Start

### Option 1: Timed Duration (Recommended)
```
Run: cinematic_mode.js
```
- Fades in over 3 seconds
- Stays on for 60 minutes (configurable)
- Fades out automatically

**To change duration:**
Edit line 9 in the file:
```javascript
var DURATION_MINUTES = 60;  // Change this number
```

### Option 2: Continuous (Until Turned Off)
```
Run: cinematic_mode_continuous.js
```
- Fades in over 3 seconds
- Stays on indefinitely
- Turn off by running `lights_off.js`

### Option 3: Multiple Presets
```
Run: cinematic_presets.js
```
- Choose from 5 different color presets
- Edit the file to uncomment your favorite

## 🎨 Available Presets

### Subtle (Default) ⭐
**RGB: (8, 8, 25)** - Very dim blue
- Best for most movies
- Not distracting
- Perfect for planetarium shows

### Warm
**RGB: (20, 12, 8)** - Dim warm amber
- Good for cozy/intimate scenes
- Comfortable feeling
- Nice for documentaries

### Cool
**RGB: (8, 15, 20)** - Dim cyan
- Good for sci-fi/tech content
- Modern feel
- Great for space shows

### Minimal
**RGB: (3, 3, 10)** - Almost black
- Barely visible
- Maximum immersion
- For critical viewing

### Theater
**RGB: (15, 3, 3)** - Dim red
- Traditional theater style
- Classic cinema look
- Emergency exit light feel

## 📝 How to Customize

### Change the Color

Edit the `AMBIENT_COLOR` line:
```javascript
var AMBIENT_COLOR = {r: 8, g: 8, b: 25};
```

**Examples:**
```javascript
// Darker blue
var AMBIENT_COLOR = {r: 5, g: 5, b: 15};

// Purple
var AMBIENT_COLOR = {r: 15, g: 8, b: 20};

// Soft white
var AMBIENT_COLOR = {r: 10, g: 10, b: 10};
```

### Change the Duration

Edit the `DURATION_MINUTES` line:
```javascript
var DURATION_MINUTES = 60;  // 60 minutes
```

**Examples:**
```javascript
var DURATION_MINUTES = 30;   // 30 minutes
var DURATION_MINUTES = 90;   // 1.5 hours
var DURATION_MINUTES = 120;  // 2 hours
```

### Change Fade Speed

Edit the fade duration (3000 = 3 seconds):
```javascript
fadeAll(0, 0, 0, AMBIENT_COLOR.r, AMBIENT_COLOR.g, AMBIENT_COLOR.b, 3000, 50);
//                                                                    ^^^^
//                                                                    Change this
```

**Examples:**
```javascript
2000  // 2 seconds (faster)
5000  // 5 seconds (slower, smoother)
1000  // 1 second (instant-ish)
```

## 🎯 Typical Usage

### For a Movie Show
1. Start movie in Digistar
2. Run `cinematic_mode.js` (set to movie length)
3. Movie plays with subtle ambient lighting
4. Lights automatically fade out when done

### For Live Presentation
1. Run `cinematic_mode_continuous.js` before show starts
2. Present your content
3. Run `lights_off.js` when done

### For Testing
1. Edit duration to 1 minute: `var DURATION_MINUTES = 1;`
2. Test different colors
3. Pick your favorite
4. Set back to actual duration

## 💡 Tips

- **Start subtle**: Too bright is distracting
- **Blue works best**: Doesn't affect color perception of dome
- **Test first**: Run 1-minute test before a real show
- **Have backup**: Keep `lights_off.js` ready to run
- **Match content**: Warm for cozy shows, cool for sci-fi

## ⚠️ Important Notes

- RGB values are **0-100** (not 0-255)
- Only **110 segments** work (not 128)
- Script blocks Digistar while running (normal)
- Cannot stop mid-script (must wait for duration or restart Digistar)

## 🔧 Troubleshooting

**Lights too bright?**
- Reduce RGB values (try half of current)
- Example: `{r: 4, g: 4, b: 12}` instead of `{r: 8, g: 8, b: 25}`

**Lights too dim?**
- Increase RGB values slightly
- Don't go above 20-30 for cinematic mode

**Wrong duration?**
- Edit `DURATION_MINUTES` value
- Remember: changes take effect next time you run the script

**Need to stop early?**
- Run `lights_off.js` (won't stop current script but will turn lights off)
- Or restart Digistar if urgent

**Lights won't turn off?**
- Run `lights_off.js`
- Or run any script that ends with lights off

## 📂 Files Summary

```
cinematic_mode.js           - Timed duration (60 min default)
cinematic_mode_continuous.js - Stays on indefinitely  
cinematic_presets.js        - Multiple color options
lights_off.js              - Turn off lights (in examples folder)
```

## 🎬 Real-World Examples

### Planetarium Show (45 minutes)
```javascript
var DURATION_MINUTES = 45;
var AMBIENT_COLOR = {r: 8, g: 8, b: 25};  // Subtle blue
```

### Laser Show (30 minutes)
```javascript
var DURATION_MINUTES = 30;
var AMBIENT_COLOR = {r: 3, g: 3, b: 10};  // Minimal
```

### Documentary (1.5 hours)
```javascript
var DURATION_MINUTES = 90;
var AMBIENT_COLOR = {r: 20, g: 12, b: 8};  // Warm
```

### Live Star Talk (60 minutes)
```javascript
// Use continuous mode
// Run: cinematic_mode_continuous.js
var AMBIENT_COLOR = {r: 8, g: 8, b: 25};
```

That's it! Enjoy your cinematic lighting! 🎆
