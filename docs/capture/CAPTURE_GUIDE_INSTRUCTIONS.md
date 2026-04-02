# Digistar 7 User Guide Capture Instructions

## 📚 Purpose
Capture the Digistar 7 user guide from the application window by taking screenshots and extracting text using OCR.

---

## 🚀 Quick Start (Easiest Method)

### Option 1: Simple Screenshot Tool (RECOMMENDED)
**No dependencies to install! Uses only basic Python libraries.**

```powershell
python capture_screenshots_simple.py
```

**Then:**
1. Click on Digistar window
2. Press **F11** to name the section (e.g., "chapter_1")
3. Press **F9** to capture screenshot
4. Press **F10** to scroll down if needed
5. Repeat for all sections
6. Press **ESC** when done

Screenshots saved in `digistar_screenshots/`

---

## 🎯 Option 2: Advanced Tool (OCR + Screenshots)

### Step 1: Install Requirements

First, install Tesseract OCR:
1. Download from: https://github.com/UB-Mannheim/tesseract/wiki
2. Install to default location: `C:\Program Files\Tesseract-OCR`
3. Add to PATH or set in script

Then install Python packages:
```powershell
pip install -r requirements_capture.txt
```

### Step 2: Run the Tool

```powershell
python capture_digistar_guide.py
```

### Step 3: Choose Mode

**Manual Mode (Recommended):**
- You control when to capture
- Press F9 to capture current view
- Press F10 to scroll and capture
- Press F11 to change section name
- Press ESC to finish

**Auto Mode:**
- Automatically scrolls and captures
- Good for long continuous documents
- Less control but faster

---

## 📋 Workflow for Capturing Full Guide

### Preparation
1. Open Digistar 7
2. Navigate to the User Guide section
3. Resize window to show maximum content
4. Position window in a comfortable spot

### Capture Process

**For each section/dropdown:**

1. **Open the section** in Digistar
   - Click the dropdown
   - Expand the content you want to capture

2. **Set section name** (F11)
   - Enter a descriptive name like:
     - `introduction`
     - `chapter_1_getting_started`
     - `controls_overview`
     - `api_reference`

3. **Capture the view** (F9)
   - Takes screenshot
   - Extracts text (if using advanced tool)

4. **Scroll if needed** (F10)
   - If content extends below the visible area
   - Press F10 to scroll down and capture more
   - Repeat until you've captured the entire section

5. **Move to next section**
   - Close current dropdown
   - Open next dropdown
   - Go back to step 2

### Finishing Up
- Press **ESC** when all sections are captured
- Review the output folder
- Combine files if needed

---

## 📁 Output Structure

### Simple Tool Output:
```
digistar_screenshots/
├── 001_introduction_20241206_143022.png
├── 002_introduction_20241206_143025.png
├── 003_chapter_1_20241206_143030.png
└── ...
```

### Advanced Tool Output:
```
digistar_guide_capture/
├── screenshots/
│   ├── 001_introduction_01_20241206_143022.png
│   ├── 002_introduction_02_20241206_143025.png
│   └── ...
├── text/
│   ├── 001_introduction_01_20241206_143022.txt
│   ├── 002_introduction_02_20241206_143025.txt
│   └── ...
└── complete_guide.txt (combined text)
```

---

## ⌨️ Hotkey Reference

| Key | Action | Description |
|-----|--------|-------------|
| **F9** | Capture | Take screenshot of current view |
| **F10** | Scroll & Capture | Scroll down, then capture |
| **F11** | Set Name | Change the section name for next captures |
| **ESC** | Exit | Stop capturing and finish |

---

## 💡 Tips for Best Results

### 1. Window Setup
- **Maximize content area** - resize Digistar window to show more content
- **Minimize clutter** - hide unnecessary UI elements if possible
- **Consistent position** - keep window in same place for all captures

### 2. Naming Sections
Use clear, descriptive names:
- ✅ Good: `controls_overview`, `api_functions`, `troubleshooting`
- ❌ Bad: `section1`, `page`, `stuff`

### 3. Scrolling Strategy
- **Overlap captures** - scroll so you capture some overlapping content
- **Check bottom of window** - make sure you got all text before moving on
- **Multiple passes** - better to capture too much than miss something

### 4. OCR Quality (Advanced Tool)
- **Clear text** - ensure text is crisp and readable in Digistar
- **Good contrast** - dark text on light background works best
- **Font size** - larger fonts = better OCR accuracy
- **Manual review** - always review OCR output for errors

---

## 🔧 Troubleshooting

### "Module not found" Error
```powershell
# Install missing packages
pip install pyautogui pillow keyboard
```

### "Tesseract not found" Error
Option 1: Install Tesseract OCR (see Step 1 above)

Option 2: Use simple tool instead:
```powershell
python capture_screenshots_simple.py
```

### Hotkeys Not Working
- Make sure Python script is running
- Click on Digistar window to give it focus
- Try running PowerShell/Command Prompt as Administrator

### Screenshots Are Blank
- Click on Digistar window before pressing F9
- Make sure window isn't minimized
- Try different screen position

### OCR Text is Garbled
- Increase font size in Digistar if possible
- Use higher resolution display
- Manually transcribe from screenshots instead

---

## 📝 After Capturing

### Review Captures
1. Open the output folder
2. Review screenshots for completeness
3. Check for any missing sections

### Organize Files
Rename files if needed to be more descriptive:
```
001_intro_page1.png → Introduction_Page_1.png
```

### Extract Additional Text (Manual)
If OCR missed text:
1. Open screenshot in image viewer
2. Manually type or copy text
3. Add to a document

### Create Master Document
Combine all content into one document:
1. Open Word/Google Docs
2. Insert screenshots in order
3. Copy extracted text below each image
4. Add headings and organization
5. Save as PDF

---

## 🎨 Alternative Methods

### Method 1: Windows Snipping Tool
- Press `Win + Shift + S`
- Manually capture regions
- Save each screenshot
- No Python needed!

### Method 2: Screen Recording
- Use OBS Studio or Windows Game Bar
- Record entire capture session
- Extract frames later
- Good for very long documents

### Method 3: PDF Print
- Check if Digistar has "Print to PDF" option
- May capture the guide directly
- Much easier if available!

---

## ⚡ Quick Commands Reference

### Start Simple Tool
```powershell
cd C:\Users\Nathan\CascadeProjects\digistar_js_project
python capture_screenshots_simple.py
```

### Start Advanced Tool
```powershell
cd C:\Users\Nathan\CascadeProjects\digistar_js_project
python capture_digistar_guide.py
```

### Install Requirements
```powershell
pip install pyautogui pillow keyboard pytesseract
```

---

## 🆘 Need Help?

### Common Issues

**Q: Can I pause and resume later?**
A: Yes! Each time you run the script, it creates new numbered files. Just continue where you left off.

**Q: How do I know if I captured everything?**
A: Review the screenshots folder and check against the Digistar guide structure.

**Q: The text extraction is terrible!**
A: Use the simple screenshot tool instead and manually transcribe important sections.

**Q: Can I capture just one section?**
A: Yes! Run the tool, capture that section, press ESC when done.

---

## 📊 Example Workflow

Here's a complete example:

```
1. Open Digistar 7 User Guide
2. Start capture tool:
   > python capture_screenshots_simple.py

3. First section:
   - Open "Introduction" dropdown
   - Press F11, enter "introduction"
   - Press F9 (capture)
   - Press F10 (scroll down)
   - Press F9 (capture more)

4. Second section:
   - Open "Getting Started" dropdown
   - Press F11, enter "getting_started"
   - Press F9 (capture)
   - No scroll needed, move on

5. Continue for all sections...

6. Press ESC when done

7. Review output:
   - Open digistar_screenshots folder
   - Check all images
   - Create master document
```

---

## ✅ Checklist

Before starting:
- [ ] Digistar 7 is open
- [ ] User Guide section is accessible
- [ ] Python is installed
- [ ] Capture script is ready
- [ ] Output folder location is known

During capture:
- [ ] Name each section clearly
- [ ] Capture entire visible content
- [ ] Scroll and capture if needed
- [ ] Verify each screenshot looks good

After capture:
- [ ] Review all screenshots
- [ ] Check for missing sections
- [ ] Organize files
- [ ] Create master document
- [ ] Backup captures

---

## 🎯 Summary

**Easiest approach:**
1. Use `capture_screenshots_simple.py`
2. Click sections manually
3. Press F9 to capture
4. Review screenshots
5. Done!

**No Python? Use:**
- Windows Snipping Tool (`Win + Shift + S`)
- Manually capture each section

**Need text extraction?**
- Use `capture_digistar_guide.py`
- Requires Tesseract OCR
- Automatically extracts text

---

Good luck capturing the guide! 🚀
