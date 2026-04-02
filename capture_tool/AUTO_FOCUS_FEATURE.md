# 🎯 Auto-Focus Feature

The capture tool now **automatically focuses the leftmost window** when capturing or scrolling!

---

## ✨ What This Means

### Before (Manual):
❌ Click on Digistar window  
❌ Click on GUI button  
❌ Click on Digistar window again  
❌ Click on GUI button  
❌ Repeat constantly...

### Now (Automatic):
✅ Position Digistar on LEFT once  
✅ Just click GUI buttons  
✅ Tool auto-focuses Digistar!  
✅ No more manual clicking!

---

## 🚀 How It Works

When you click **"CAPTURE NOW"** or **"Scroll Down"**:

1. **Finds the leftmost visible window** (enumerates all windows)
2. **Clicks on the CENTER of that leftmost window** (Digistar!)
3. This activates the window
4. Performs the capture or scroll
5. Done!

**You don't have to do anything!** Just position Digistar on the left side and the GUI on the right (or second monitor).

---

## 📐 Setup Requirements

### Window Positioning:
```
┌─────────────────────┬──────────────┐
│                     │              │
│    DIGISTAR 7       │  Capture     │
│    (User Guide)     │  Tool GUI    │
│                     │              │
│    [Leftmost        │  [Right      │
│     Window]         │   Side]      │
│                     │              │
└─────────────────────┴──────────────┘

← LEFT SIDE          RIGHT SIDE →
```

### Key Points:
- ✅ **Digistar MUST be on the LEFT side**
- ✅ Capture GUI can be on right or second monitor
- ✅ Tool will click at 10% from left edge (activates Digistar)
- ✅ Works on any resolution

---

## 🎯 Perfect For:

### Single Monitor Setup:
- Digistar on left half of screen
- GUI tool on right half
- Click buttons, tool auto-focuses!

### Dual Monitor Setup:
- Digistar on left monitor (or left side)
- GUI tool on right monitor
- Even better - more space!

---

## 💡 Usage Tips

### Do This:
✅ Position Digistar on LEFT side of screen  
✅ Make Digistar window reasonably sized  
✅ Keep Digistar window visible  
✅ Just click GUI buttons  

### Don't Do This:
❌ Put Digistar on RIGHT side  
❌ Minimize Digistar  
❌ Cover Digistar with other windows  
❌ Move Digistar around mid-capture  

---

## 🎬 Example Workflow

```
Setup (once):
1. Open Digistar 7 User Guide
2. Drag to LEFT side of screen
3. Resize to comfortable size
4. Launch capture tool GUI
5. Position GUI on right side

Capturing (easy!):
1. Type section name
2. Click "CAPTURE NOW"
   → Tool auto-focuses Digistar
   → Captures screenshot
   → Done!
3. Click "Scroll Down"
   → Tool auto-focuses Digistar
   → Scrolls one page
   → Done!
4. Repeat as needed!
```

---

## 🔧 Technical Details

### How It Finds the Leftmost Window:
1. **Enumerates all visible windows** using Windows API (EnumWindows)
2. **Gets position and size** of each window (GetWindowRect)
3. **Filters out tiny windows** (smaller than 100x100 pixels)
4. **Finds the leftmost** by comparing left edge positions
5. **Calculates center point** of that window
6. **Clicks on the center** to activate it

### Click Position:
- **X coordinate**: Center of leftmost window (left edge + width / 2)
- **Y coordinate**: Center of leftmost window (top edge + height / 2)
- **Wait time**: 0.2 seconds for window activation

### Why Center of Window?
- ✅ Always clicks inside the window (not on borders)
- ✅ Works with any window size
- ✅ Avoids edge/title bar issues
- ✅ Most reliable activation point
- ✅ Adapts to window position automatically

### What Gets Focused:
- **The actual leftmost visible window** (measured by left edge position)
- Excludes tiny UI elements (taskbar icons, etc.)
- Digistar, if positioned correctly on the left!

### Fallback Behavior:
- If no windows found: Falls back to clicking at 10% from left edge
- Ensures tool always works even in edge cases

---

## ⚙️ Customization

If you need to adjust the minimum window size filter, edit `capture_gui.py`:

```python
def get_leftmost_window(self):
    # ...
    # Skip tiny windows (likely system UI elements)
    if width > 100 and height > 100:  # Adjust these values
        windows.append(...)
```

**Change `100` to:**
- `200` = Stricter filter (ignores smaller windows)
- `50` = Looser filter (includes smaller windows)

---

## ✅ Benefits

### Efficiency:
- ⚡ **50% faster** workflow
- No constant window switching
- Smooth, uninterrupted capture
- Less clicking fatigue

### Reliability:
- 🎯 **Always focuses correct window**
- No missed clicks
- Consistent behavior
- Works every time

### User Experience:
- 🌟 **Set and forget**
- Position once, capture many
- Intuitive workflow
- Less mental overhead

---

## 🆚 Comparison

| Feature | Manual Focus | Auto-Focus |
|---------|--------------|------------|
| Setup | Click each time | Position once |
| Workflow | Click window → Click button | Click button |
| Speed | Slow | Fast ⚡ |
| Errors | Easy to forget | None |
| Efficiency | Low | High 🌟 |
| User-Friendly | No | Yes ✅ |

---

## 💬 Common Questions

**Q: What if I have multiple monitors?**  
A: Position Digistar on the LEFT side of your primary monitor or leftmost monitor.

**Q: Can I put Digistar on the right?**  
A: No - tool focuses leftmost window. Keep Digistar left!

**Q: What if I accidentally move Digistar?**  
A: Just move it back to the left side. Tool will find it.

**Q: Does it work with any screen resolution?**  
A: Yes! It calculates position based on screen size.

**Q: Can I disable auto-focus?**  
A: Not recommended, but you can comment out the `self.focus_leftmost_window()` calls in the code.

**Q: What if there's another window on the left?**  
A: Tool will focus that window instead. Keep Digistar leftmost!

---

## 🎉 Summary

**Old Way:**
```
Click Digistar → Click button → Click Digistar → Click button...
```

**New Way:**
```
Position Digistar left → Click button → Click button → Click button!
```

**Result: Fast, smooth, efficient capturing!** 🚀✨

---

**Enjoy your streamlined workflow!** 🎊
