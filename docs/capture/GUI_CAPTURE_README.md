# 📸 Digistar Capture Tool - GUI Version

Easy-to-use GUI tool for capturing screenshots from Digistar 7!

---

## 🚀 Quick Start (3 Easy Steps!)

### 1. Install (One-Time Setup)
Double-click: **`setup_capture_tool.bat`**

Or manually:
```powershell
pip install pyautogui pillow
```

### 2. Launch GUI
Double-click: **`start_capture_gui.bat`**

Or manually:
```powershell
python capture_gui.py
```

### 3. Use It!
1. Type section name (e.g., "introduction")
2. Click on Digistar window
3. Click **"CAPTURE NOW"** button
4. Repeat for all sections!

**Done! Screenshots save automatically to `digistar_screenshots/`** ✨

---

## 🎨 GUI Features

### 📝 Section Name
- Enter descriptive names for each section
- Auto-updates before each capture
- Examples: `introduction`, `getting_started`, `api_reference`

### 🎮 Capture Controls

**📸 CAPTURE NOW** (Big Green Button)
- Takes screenshot of entire screen
- Hides GUI window during capture
- Saves with section name + timestamp

**📜 Scroll Down**
- Scrolls down 500 pixels
- Use when content extends below screen

**📜📸 Scroll & Capture**
- Scrolls down, then captures
- One-click combo action!

### 🤖 Auto Capture
- **Number of scrolls**: How many times to scroll (1-50)
- **Delay (sec)**: Wait time between actions (0.5-5.0s)
- **Start Auto Capture**: Captures initial view, then scrolls and captures automatically
- **Stop Auto Capture**: Cancel ongoing auto-capture

Perfect for long documents!

### 📊 Status Section
- **Captures**: Total screenshots taken
- **Current**: Current section name
- **Log**: Real-time activity feed
- **Open Folder**: Quick access to screenshots

---

## 📋 Typical Workflow

```
1. Launch: start_capture_gui.bat
2. GUI window opens

For each Digistar section:
3. Type section name: "introduction"
4. Click "Set Name" (or it sets automatically)
5. Click on Digistar window
6. Click "CAPTURE NOW" 
7. If more content below:
   - Click "Scroll Down"
   - Click "CAPTURE NOW" again
   OR use "Scroll & Capture" button

8. Open next dropdown/section
9. Repeat steps 3-7

10. Click "Open Output Folder" to review
11. Done!
```

---

## 🎯 Auto Capture Example

**For long sections with lots of scrolling:**

1. Open Digistar section
2. Type section name: `api_reference`
3. Set "Number of scrolls": `10`
4. Set "Delay": `1.5` seconds
5. Click "Start Auto Capture"
6. ☕ Wait while it captures automatically!
7. Review results in log

**What it does:**
- Captures current view
- Scrolls down
- Waits 1.5 seconds
- Captures again
- Repeats 10 times
- Stops automatically

---

## 🎨 GUI Layout

```
┌─────────────────────────────────────┐
│     Digistar Guide Capture          │
│   Capture screenshots from D7       │
├─────────────────────────────────────┤
│ 📝 Section Name                     │
│ [introduction        ] [Set Name]   │
├─────────────────────────────────────┤
│ 🎮 Capture Controls                 │
│                                     │
│        📸 CAPTURE NOW               │
│                                     │
│ [📜 Scroll Down] [📜📸 Scroll &Cap] │
├─────────────────────────────────────┤
│ 🤖 Auto Capture                     │
│ Scrolls: [5] Delay: [1.0] sec      │
│ [▶️ Start Auto Capture]             │
├─────────────────────────────────────┤
│ 📊 Status                           │
│ Captures: 0  Current: page          │
│                                     │
│ Log:                                │
│ ┌─────────────────────────────────┐ │
│ │ [12:30] Welcome! Ready...       │ │
│ │ [12:31] ✓ Section: intro       │ │
│ │ [12:31] 📸 Capturing...         │ │
│ │ [12:31]    ✅ Saved!            │ │
│ └─────────────────────────────────┘ │
│                                     │
│ [📁 Open Output Folder]             │
└─────────────────────────────────────┘
```

---

## 💡 Tips & Tricks

### Best Practices
1. **Name sections clearly** - Use descriptive names
2. **Click Digistar first** - Make sure Digistar is the active window
3. **Review as you go** - Check log for success messages
4. **Use auto-capture** - Great for long documents
5. **Open folder often** - Verify screenshots look good

### Window Positioning
- Position GUI on second monitor (if available)
- Or position GUI to side of Digistar window
- GUI hides automatically during capture

### Section Naming Ideas
- `01_introduction`
- `02_getting_started`
- `03_controls_overview`
- `04_api_reference_page1`
- `04_api_reference_page2`
- `05_troubleshooting`

### Scrolling Strategy
- Start at top of section
- Capture, then scroll down
- Capture again with slight overlap
- Better to capture too much than miss content

---

## 📸 Output

### File Format
```
digistar_screenshots/
├── 001_introduction_20241206_130000.png
├── 002_introduction_20241206_130010.png
├── 003_getting_started_20241206_130025.png
└── ...
```

### Filename Structure
```
[number]_[section_name]_[timestamp].png
   │          │              │
   │          │              └── YYYYMMDD_HHMMSS
   │          └── Your custom name
   └── Sequential number (auto)
```

**Each file includes:**
- Sequential numbering (maintains order)
- Your section name (for organization)
- Timestamp (tracks when captured)
- PNG format (high quality, lossless)

---

## 🔧 Troubleshooting

### GUI won't start
```powershell
# Reinstall packages
pip install --upgrade pyautogui pillow

# Or use setup script
setup_capture_tool.bat
```

### Screenshots are blank/wrong
- **Click on Digistar window** before capturing
- Wait 0.5s after clicking before capture
- Make sure Digistar isn't minimized
- Try repositioning windows

### GUI is on top of Digistar
- Move GUI window to side or second monitor
- GUI auto-hides during capture anyway!

### Auto-capture too fast/slow
- Adjust "Delay" value
- Increase for slower capture
- Decrease for faster capture
- 1.0-2.0 seconds usually works well

### Scroll amount wrong
- Edit `capture_gui.py` line with `pyautogui.scroll(-500)`
- Change `-500` to larger (scroll more) or smaller (scroll less)
- Negative number = scroll down
- Positive number = scroll up

---

## 🆚 Comparison: GUI vs Hotkey Tools

### GUI Tool (capture_gui.py) ⭐ RECOMMENDED
- ✅ Easy to use - just click buttons
- ✅ Visual feedback - see what's happening
- ✅ No hotkeys to remember
- ✅ Works on all Windows systems
- ✅ Auto-capture feature
- ✅ Built-in log viewer
- ✅ No permissions issues

### Hotkey Tool (capture_screenshots_simple.py)
- ✅ Keyboard-based (F9, F10, F11)
- ✅ Minimal interface
- ❌ Requires keyboard library
- ❌ May have permission issues
- ❌ Need to remember hotkeys

**Verdict: Use GUI tool!** 🎉

---

## ⚡ Quick Reference

### Essential Commands
```powershell
# Setup (once)
setup_capture_tool.bat

# Start GUI
start_capture_gui.bat

# Or directly
python capture_gui.py
```

### Button Quick Guide
- **CAPTURE NOW** = Take screenshot
- **Scroll Down** = Scroll page
- **Scroll & Capture** = Scroll then capture
- **Start Auto** = Automatic capture sequence
- **Open Folder** = View screenshots

### Workflow Summary
```
1. Type section name
2. Click Digistar
3. Click CAPTURE NOW
4. Scroll if needed
5. Repeat!
```

---

## 🎓 Advanced Usage

### Capturing Multiple Pages
For a section with 5 pages:
1. Name: `api_reference_page1`
2. Capture
3. Scroll down
4. Capture
5. Click next page in Digistar
6. Name: `api_reference_page2`
7. Repeat

### Using Auto-Capture Effectively
- **Short sections** (2-3 scrolls): Manual capture
- **Medium sections** (5-10 scrolls): Auto-capture
- **Long sections** (10+ scrolls): Auto-capture with longer delay

### Batch Processing
Capture multiple sections quickly:
1. Set all sections to auto-capture
2. Queue them up
3. Let it run!
4. Review all at once

### Quality Control
- Check first few captures immediately
- Adjust scroll amount if needed
- Verify all text is readable
- Recapture if necessary

---

## 🌟 Advantages of This Tool

### vs Manual Screenshots
- ✅ Consistent numbering
- ✅ Organized by section
- ✅ Timestamped
- ✅ Faster workflow
- ✅ Auto-scroll feature

### vs Screen Recording
- ✅ Individual images
- ✅ Easier to organize
- ✅ Better for reference
- ✅ Smaller file sizes
- ✅ Can edit/annotate easily

### vs Print Screen
- ✅ Automatic saving
- ✅ Sequential naming
- ✅ No manual paste/save
- ✅ Built-in logging
- ✅ Can review progress

---

## 📚 After Capturing

### Review Captures
1. Click "Open Output Folder"
2. Browse through screenshots
3. Check for gaps or issues
4. Recapture if needed

### Organize Files
- Rename for clarity if desired
- Create subfolders by chapter
- Delete duplicates
- Keep originals as backup

### Create Documentation
1. Open Word/Google Docs
2. Insert screenshots in order
3. Add captions/headings
4. Annotate important sections
5. Export as PDF

### Share/Backup
- Copy folder to cloud storage
- Create ZIP archive
- Share with team
- Keep multiple backups

---

## ✅ Success Checklist

**Before Starting:**
- [ ] Python installed
- [ ] Packages installed (run setup_capture_tool.bat)
- [ ] GUI launches without errors
- [ ] Digistar 7 is open and accessible

**During Capture:**
- [ ] Section names are descriptive
- [ ] Digistar window active before each capture
- [ ] All visible content captured
- [ ] Scrolled through long sections
- [ ] Checked log for success messages

**After Capture:**
- [ ] Opened output folder
- [ ] Reviewed all screenshots
- [ ] No missing sections
- [ ] Quality is acceptable
- [ ] Created backup

---

## 🎉 You're Ready!

**To start capturing:**
```
1. Double-click: start_capture_gui.bat
2. Click buttons to capture!
3. That's it! 🎊
```

**Output location:**
```
digistar_screenshots/
```

**Need help?**
- Check the log window in GUI
- Review this README
- Try recapturing problematic sections

---

**Happy capturing! 📸✨**
