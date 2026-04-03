# Digistar Capture Tool

Screenshot capture utility for Digistar application windows.

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

## Available Tools

- `capture_gui.py` - GUI-based capture tool
- `start_capture_gui.bat` - Windows launcher
- `capture_screenshots_simple.py` - Hotkey-based alternative
- `capture_digistar_guide.py` - OCR-enabled version

## Documentation

- `GUI_CAPTURE_README.md` - Complete GUI documentation
- `CAPTURE_GUIDE_INSTRUCTIONS.md` - Detailed instructions

## Workflow

1. Open Digistar 7 User Guide
2. Run capture tool
3. For each section:
   - Open dropdown in Digistar
   - Press F11 to name section
   - Press F9 to capture
   - Press F10 to scroll if needed
4. Press ESC when finished
5. Screenshots save to `digistar_screenshots/`

## Hotkeys

- F9: Capture screenshot
- F10: Scroll down
- F11: Set section name
- ESC: Exit

## Troubleshooting

Install dependencies if tool fails to start:
```powershell
pip install pyautogui pillow keyboard
```

Common issues:
- Ensure Digistar window is active before capturing
- Run PowerShell as Administrator if hotkeys fail
- Reposition window if screenshots are blank

## OCR Version

For text extraction use the OCR-enabled version:

1. Install Tesseract OCR
2. Install packages: `pip install -r requirements_capture.txt`
3. Run: `python capture_digistar_guide.py`
