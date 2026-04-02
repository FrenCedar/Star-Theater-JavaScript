# 📸 Digistar Guide Capture Tool

**Self-contained GUI tool for capturing screenshots from Digistar 7!**

All necessary files are in this folder. Everything you need is right here! ✨

---

## 🚀 Quick Start (2 Steps!)

### 1️⃣ Setup (First Time Only)
Double-click: **`setup_capture_tool.bat`**

This installs the required Python packages.

### 2️⃣ Launch and Use
Double-click: **`start_capture_gui.bat`**

A GUI window opens with buttons to:
- Capture screenshots
- Scroll pages
- Auto-capture long sections
- View output folder

**That's it!** 🎉

---

## 📁 What's in This Folder

| File | Purpose |
|------|---------|
| **setup_capture_tool.bat** | ⚙️ First-time setup (installs packages) |
| **start_capture_gui.bat** | 🚀 Launch the GUI tool |
| **capture_gui.py** | 🎨 The main GUI application |
| **requirements_gui.txt** | 📦 Python package list |
| **GUI_CAPTURE_README.md** | 📚 Complete user guide |
| **CAPTURE_TOOL_README.md** | 📖 Quick reference guide |
| **README.md** | 📄 This file! |

---

## 🎯 How to Use

### First Time:
1. Run `setup_capture_tool.bat` (installs Python packages)
2. Run `start_capture_gui.bat` (opens GUI)
3. **Position Digistar window on LEFT side of screen**
4. Position GUI tool on right side (or second monitor)
5. Type a section name (e.g., "introduction")
6. Click **"CAPTURE NOW"** button (auto-focuses leftmost window!)
7. Screenshot saved! ✅

**💡 Tip:** Tool automatically finds and focuses the leftmost window (clicks its center) - no manual clicking needed!

### Every Time After:
1. Run `start_capture_gui.bat`
2. Capture sections as needed
3. Done!

---

## 🎨 GUI Features

The GUI has:
- **📝 Section Name** field - Name what you're capturing
- **📸 CAPTURE NOW** button - Big green button to take screenshot
- **📜 Scroll Down** - Scroll the active window
- **📜📸 Scroll & Capture** - Scroll then capture in one click
- **🤖 Auto Capture** - Automatically scroll and capture multiple times
- **📊 Status Log** - See everything that's happening
- **📁 Open Folder** - Quick access to screenshots

---

## 📸 Output

Screenshots save to:
```
../digistar_screenshots/
```

(One folder up from this capture_tool folder)

Files are named:
```
001_introduction_20241206_130000.png
002_introduction_20241206_130005.png
003_getting_started_20241206_130015.png
...
```

**Format:** `[number]_[section_name]_[timestamp].png`

---

## 💡 Typical Workflow

```
1. Open Digistar 7 User Guide
2. Position Digistar window on LEFT side of screen
3. Double-click: start_capture_gui.bat
4. Position GUI on right side (or second monitor)

For each section:
5. Type section name: "controls_overview"
6. Click "CAPTURE NOW" (auto-focuses leftmost window!)
7. If more content, click "Scroll Down" then "CAPTURE NOW" again
8. Open next section, repeat

9. Click "Open Output Folder" to review
10. Done! 🎉
```

**🎯 Remember: Keep Digistar on the LEFT!**

---

## 🤖 Auto-Capture Feature

For long sections with lots of scrolling:

1. Enter section name
2. Set "Number of scrolls": 10
3. Set "Delay": 1.5 seconds
4. Click "Start Auto Capture"
5. ☕ Wait while it captures automatically
6. Done!

Perfect for multi-page sections!

---

## 📚 Documentation

- **Quick Start:** This file (README.md)
- **Complete GUI Guide:** GUI_CAPTURE_README.md
- **Full Instructions:** CAPTURE_TOOL_README.md

Start with this README, then check GUI_CAPTURE_README.md for detailed info!

---

## ❓ Troubleshooting

### "Python not found"
Install Python from python.org first, then run setup again.

### "Module not found"
Run `setup_capture_tool.bat` to install packages.

### Screenshots are blank
- Click on Digistar window before clicking CAPTURE NOW
- Make sure Digistar isn't minimized

### GUI won't start
```powershell
# Try manual install
pip install pyautogui pillow
python capture_gui.py
```

---

## ✅ Requirements

- **Python 3.x** (you already have this)
- **pyautogui** (auto-installed by setup)
- **Pillow** (auto-installed by setup)

That's it! No complex dependencies! 🎉

---

## 🎉 You're Ready!

Everything you need is in this folder:

```
1. setup_capture_tool.bat   (first time only)
2. start_capture_gui.bat    (every time)
3. Use the GUI buttons
4. Profit! 💰
```

**Simple, self-contained, ready to go!** ✨

---

## 📖 Need More Help?

1. **Basic help:** This README
2. **GUI details:** GUI_CAPTURE_README.md
3. **Full guide:** CAPTURE_TOOL_README.md

Or just start using it - it's pretty intuitive! 😊

---

**Happy capturing! 📸✨**

Made for MSU Digistar 7 projects
