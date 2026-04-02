# 📸 Digistar 7 User Guide Capture Tool

Tools to help you capture and extract content from the Digistar 7 application window.

---

## 🚀 Quick Start (3 Steps!) - GUI VERSION ⭐

### 1. Install Requirements
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
1. Type section name in the GUI
2. Click on Digistar window
3. Click **"CAPTURE NOW"** button
4. Repeat!

**Done!** Screenshots saved in `digistar_screenshots/`

---

## 🎨 Why Use the GUI Version?

- ✅ **Easy to use** - Just click buttons!
- ✅ **Visual feedback** - See exactly what's happening
- ✅ **Auto-capture** - Automatically scroll and capture long sections
- ✅ **Built-in log** - Track all captures in real-time
- ✅ **No hotkeys** - No keys to remember
- ✅ **No permission issues** - Works on all Windows systems

**The GUI tool is RECOMMENDED for most users!** 🎉

---

## 📁 Files Included

### Main Tools

| File | Description | Use Case |
|------|-------------|----------|
| **capture_gui.py** | ⭐⭐⭐ GUI tool | **BEST CHOICE** - Easy buttons, auto-capture |
| **start_capture_gui.bat** | Launcher for GUI | Double-click to start GUI |
| **capture_screenshots_simple.py** | Hotkey-based tool | Alternative if you prefer F9/F10 keys |
| **capture_digistar_guide.py** | Advanced tool with OCR | Need text extraction |

### Documentation

| File | Purpose |
|------|---------|
| **GUI_CAPTURE_README.md** | ⭐ Complete GUI tool guide |
| **CAPTURE_GUIDE_INSTRUCTIONS.md** | Full instructions (all tools) |
| **CAPTURE_TOOL_README.md** | This file - quick overview |

### Setup Files

| File | Purpose |
|------|---------|
| `setup_capture_tool.bat` | Quick install script |
| `requirements_simple.txt` | Python packages (simple) |
| `requirements_capture.txt` | Python packages (advanced) |

---

## 🎯 Which Tool Should I Use?

### Use **capture_screenshots_simple.py** if:
- ✅ You just want screenshots
- ✅ You'll manually copy text
- ✅ You want the easiest option
- ✅ You don't want to install Tesseract

### Use **capture_digistar_guide.py** if:
- ✅ You want automatic text extraction
- ✅ You have time to set up Tesseract OCR
- ✅ You want a combined text document
- ✅ The guide has lots of text

**Recommendation: Start with simple tool!** 📸

---

## ⌨️ Hotkeys

| Key | Action |
|-----|--------|
| **F9** | Capture screenshot |
| **F10** | Scroll down |
| **F11** | Change section name |
| **ESC** | Exit |

---

## 📋 Typical Workflow

```
1. Open Digistar 7 User Guide
2. Run: python capture_screenshots_simple.py
3. For each section:
   - Open dropdown in Digistar
   - Press F11, name it (e.g., "introduction")
   - Press F9 to capture
   - Press F10 if you need to scroll
   - Press F9 again for more content
4. Press ESC when finished
5. Find screenshots in digistar_screenshots/
```

---

## 🎨 Example Output

```
digistar_screenshots/
├── 001_introduction_20241206_120000.png
├── 002_introduction_20241206_120005.png
├── 003_getting_started_20241206_120015.png
├── 004_getting_started_20241206_120020.png
├── 005_controls_20241206_120030.png
└── ...
```

**Result:** All your guide sections captured as PNG images! 🎉

---

## 💡 Tips

### Best Practices
1. **Name sections clearly** - Use descriptive names like `api_reference` not `page1`
2. **Overlap content** - Capture slightly overlapping content when scrolling
3. **Review as you go** - Check screenshots look good before moving on
4. **Organize after** - Rename files to be more descriptive if needed

### Window Setup
- Maximize the Digistar content area
- Keep window position consistent
- Make sure text is readable

### If Something Goes Wrong
- Press ESC to stop
- Your captures are saved!
- Just run the tool again to continue

---

## 🔧 Troubleshooting

### Tool won't start
```powershell
# Install requirements
pip install pyautogui pillow keyboard
```

### Hotkeys not working
- Make sure Digistar window is active (click on it)
- Try running PowerShell as Administrator
- Check keyboard package is installed

### Screenshots are blank
- Click on Digistar window before pressing F9
- Make sure window isn't minimized
- Try repositioning the window

---

## 📚 Documentation

**Quick reference:** This file
**Full guide:** `CAPTURE_GUIDE_INSTRUCTIONS.md`
**Need help?** Check the full guide for detailed troubleshooting

---

## 🆕 Advanced Features

### OCR Text Extraction
Want automatic text extraction? Use the advanced tool:

1. Install Tesseract OCR: https://github.com/UB-Mannheim/tesseract/wiki
2. Install Python packages: `pip install -r requirements_capture.txt`
3. Run: `python capture_digistar_guide.py`

This will:
- ✅ Capture screenshots
- ✅ Extract text using OCR
- ✅ Create individual text files
- ✅ Combine into master document

---

## ⚡ Command Reference

### Setup
```powershell
# Quick setup
setup_capture_tool.bat

# Manual setup
pip install -r requirements_simple.txt
```

### Run Simple Tool
```powershell
python capture_screenshots_simple.py
```

### Run Advanced Tool (OCR)
```powershell
pip install -r requirements_capture.txt
python capture_digistar_guide.py
```

---

## ✅ Success Checklist

Setup:
- [ ] Python installed
- [ ] Packages installed (`setup_capture_tool.bat`)
- [ ] Capture tool runs without errors

Capturing:
- [ ] Digistar window open and visible
- [ ] Named each section clearly
- [ ] Captured all visible content
- [ ] Scrolled and captured long sections
- [ ] Reviewed screenshots look good

Completion:
- [ ] All sections captured
- [ ] Screenshots saved in folder
- [ ] Files organized/renamed if needed
- [ ] Created backup of captures

---

## 🎯 Summary

**Easiest Method:**
```
1. setup_capture_tool.bat
2. python capture_screenshots_simple.py
3. Press F9 to capture, F10 to scroll
4. Done!
```

**Output:** Numbered PNG screenshots of entire guide

**Time Required:** ~10-20 minutes depending on guide size

**Difficulty:** Easy! Just clicking dropdowns and pressing F9

---

## 🆘 Need More Help?

1. Read `CAPTURE_GUIDE_INSTRUCTIONS.md` for detailed guide
2. Check troubleshooting section above
3. Try the simple tool first before advanced features
4. Manual alternative: Use Windows Snipping Tool (`Win + Shift + S`)

---

**Ready to capture? Run the tool and press F9!** 📸✨
