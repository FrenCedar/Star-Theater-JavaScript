# Digistar Capture Tool - GUI Version

GUI-based screenshot capture utility for Digistar 7.

## Quick Start

### Installation
```powershell
pip install pyautogui pillow
```

### Launch
```powershell
python capture_gui.py
```

### Usage
1. Enter section name
2. Focus Digistar window
3. Click "CAPTURE NOW"
4. Screenshots save to `digistar_screenshots/`

## Features

### Capture Controls
- CAPTURE NOW: Screenshot entire screen
- Scroll Down: Scroll 500 pixels
- Scroll & Capture: Combined action

### Auto Capture
- Configure scroll count (1-50)
- Set delay between actions (0.5-5.0s)
- Automated capture for long documents

### Status
- Total captures count
- Current section name
- Activity log
- Quick folder access

## Workflow

1. Launch capture GUI
2. Enter section name
3. Focus Digistar window
4. Click "CAPTURE NOW"
5. For long sections:
   - Click "Scroll Down" then "CAPTURE NOW"
   - Or use "Scroll & Capture" button
6. Repeat for each section
7. Review screenshots in output folder

## Auto Capture Usage

For long sections with multiple pages:

1. Open Digistar section
2. Enter section name
3. Set number of scrolls (e.g., 10)
4. Set delay between captures (e.g., 1.5 seconds)
5. Click "Start Auto Capture"
6. Tool automatically scrolls and captures

Process:
- Captures current view
- Scrolls down
- Waits 1.5 seconds
- Captures again
- Repeats 10 times
- Stops automatically

## Output Format

Screenshots save to `digistar_screenshots/` with naming format:
```
[number]_[section_name]_[timestamp].png
```

Example:
```
001_introduction_20241206_130000.png
002_getting_started_20241206_130025.png
```

## Troubleshooting

Install or update dependencies:
```powershell
pip install --upgrade pyautogui pillow
```

Common issues:
- Ensure Digistar window is focused before capture
- Position GUI window to avoid overlap
- Adjust delay value if auto-capture is too fast/slow
- Modify scroll amount in `capture_gui.py` if needed

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
