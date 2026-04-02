"""
Digistar 7 User Guide Capture Tool
Captures screenshots and extracts text from the Digistar application window
"""

import pyautogui
import pytesseract
from PIL import Image
import time
import os
from datetime import datetime
import keyboard

# Configuration
OUTPUT_DIR = "digistar_guide_capture"
SCREENSHOT_DIR = os.path.join(OUTPUT_DIR, "screenshots")
TEXT_DIR = os.path.join(OUTPUT_DIR, "text")
CAPTURE_DELAY = 0.5  # Seconds to wait after each action

# Create output directories
os.makedirs(SCREENSHOT_DIR, exist_ok=True)
os.makedirs(TEXT_DIR, exist_ok=True)

# Counter for captured pages
capture_count = 0

def capture_current_view(section_name="page"):
    """Capture screenshot and extract text from current view"""
    global capture_count
    capture_count += 1
    
    timestamp = datetime.now().strftime("%Y%m%d_%H%M%S")
    filename_base = f"{capture_count:03d}_{section_name}_{timestamp}"
    
    print(f"\n📸 Capturing: {filename_base}")
    
    # Take screenshot
    screenshot = pyautogui.screenshot()
    screenshot_path = os.path.join(SCREENSHOT_DIR, f"{filename_base}.png")
    screenshot.save(screenshot_path)
    print(f"   ✓ Screenshot saved: {screenshot_path}")
    
    # Extract text using OCR
    try:
        text = pytesseract.image_to_string(screenshot)
        text_path = os.path.join(TEXT_DIR, f"{filename_base}.txt")
        with open(text_path, 'w', encoding='utf-8') as f:
            f.write(text)
        print(f"   ✓ Text extracted: {text_path}")
        print(f"   ✓ Extracted {len(text)} characters")
    except Exception as e:
        print(f"   ⚠️  OCR Error: {e}")
    
    return screenshot_path, text_path

def scroll_and_capture(section_name="page", num_scrolls=3):
    """Scroll down and capture multiple times"""
    print(f"\n📜 Scrolling and capturing '{section_name}'...")
    
    # Capture initial view
    capture_current_view(f"{section_name}_01")
    time.sleep(CAPTURE_DELAY)
    
    # Scroll and capture
    for i in range(num_scrolls):
        print(f"\n   Scrolling down full page ({i+1}/{num_scrolls})...")
        pyautogui.press('pagedown')
        time.sleep(CAPTURE_DELAY)
        capture_current_view(f"{section_name}_{i+2:02d}")
    
    print(f"\n✅ Finished capturing '{section_name}'")

def capture_window_area(x, y, width, height, section_name="area"):
    """Capture a specific area of the screen"""
    global capture_count
    capture_count += 1
    
    timestamp = datetime.now().strftime("%Y%m%d_%H%M%S")
    filename_base = f"{capture_count:03d}_{section_name}_{timestamp}"
    
    print(f"\n📸 Capturing area: {filename_base}")
    
    # Take screenshot of specific region
    screenshot = pyautogui.screenshot(region=(x, y, width, height))
    screenshot_path = os.path.join(SCREENSHOT_DIR, f"{filename_base}.png")
    screenshot.save(screenshot_path)
    print(f"   ✓ Screenshot saved: {screenshot_path}")
    
    # Extract text
    try:
        text = pytesseract.image_to_string(screenshot)
        text_path = os.path.join(TEXT_DIR, f"{filename_base}.txt")
        with open(text_path, 'w', encoding='utf-8') as f:
            f.write(text)
        print(f"   ✓ Text extracted: {len(text)} characters")
    except Exception as e:
        print(f"   ⚠️  OCR Error: {e}")
    
    return screenshot_path

def manual_capture_mode():
    """Interactive mode - press hotkeys to capture"""
    print("\n" + "="*60)
    print("🎯 MANUAL CAPTURE MODE")
    print("="*60)
    print("\nHotkeys:")
    print("  F9  - Capture current view")
    print("  F10 - Scroll down and capture")
    print("  F11 - Capture with custom name")
    print("  ESC - Exit")
    print("\n📌 Instructions:")
    print("1. Click on the Digistar window to make it active")
    print("2. Open a dropdown or navigate to a section")
    print("3. Press F9 to capture")
    print("4. Press F10 to scroll down and capture more")
    print("5. Repeat for all sections")
    print("\n⏳ Waiting for hotkey press...")
    
    section_name = "section"
    
    while True:
        if keyboard.is_pressed('f9'):
            capture_current_view(section_name)
            time.sleep(0.5)  # Debounce
            
        elif keyboard.is_pressed('f10'):
            scroll_and_capture(section_name, num_scrolls=1)
            time.sleep(0.5)
            
        elif keyboard.is_pressed('f11'):
            section_name = input("\n📝 Enter section name: ").strip() or "section"
            print(f"✓ Section name set to: {section_name}")
            print("⏳ Continue capturing...")
            
        elif keyboard.is_pressed('esc'):
            print("\n👋 Exiting...")
            break
        
        time.sleep(0.1)

def auto_scroll_capture(section_name="guide", total_scrolls=10, scroll_delay=1.0):
    """Automatically scroll through entire document and capture"""
    print("\n" + "="*60)
    print(f"🤖 AUTO SCROLL CAPTURE: {section_name}")
    print("="*60)
    print(f"\nWill capture {total_scrolls} scroll positions")
    print("Starting in 3 seconds - click on Digistar window now!")
    time.sleep(3)
    
    # Capture initial position
    capture_current_view(f"{section_name}_top")
    time.sleep(CAPTURE_DELAY)
    
    # Scroll to bottom and capture along the way
    for i in range(total_scrolls):
        print(f"\n📜 Scroll full page {i+1}/{total_scrolls}")
        pyautogui.press('pagedown')
        time.sleep(scroll_delay)
        capture_current_view(f"{section_name}_{i+1:03d}")
    
    print(f"\n✅ Auto-capture complete!")

def combine_text_files():
    """Combine all extracted text files into one master document"""
    print("\n📚 Combining all text files...")
    
    master_file = os.path.join(OUTPUT_DIR, "complete_guide.txt")
    text_files = sorted([f for f in os.listdir(TEXT_DIR) if f.endswith('.txt')])
    
    with open(master_file, 'w', encoding='utf-8') as master:
        master.write("="*80 + "\n")
        master.write("DIGISTAR 7 USER GUIDE - CAPTURED CONTENT\n")
        master.write(f"Captured: {datetime.now().strftime('%Y-%m-%d %H:%M:%S')}\n")
        master.write(f"Total pages: {len(text_files)}\n")
        master.write("="*80 + "\n\n")
        
        for i, text_file in enumerate(text_files, 1):
            master.write(f"\n{'='*80}\n")
            master.write(f"PAGE {i}: {text_file}\n")
            master.write(f"{'='*80}\n\n")
            
            text_path = os.path.join(TEXT_DIR, text_file)
            with open(text_path, 'r', encoding='utf-8') as f:
                master.write(f.read())
            master.write("\n\n")
    
    print(f"✅ Master document created: {master_file}")
    return master_file

def main():
    print("\n" + "="*60)
    print("🚀 DIGISTAR 7 USER GUIDE CAPTURE TOOL")
    print("="*60)
    
    print("\nSelect mode:")
    print("1. Manual capture (you control with hotkeys)")
    print("2. Auto-scroll capture (automatically scrolls)")
    print("3. Exit")
    
    choice = input("\nEnter choice (1-3): ").strip()
    
    if choice == "1":
        manual_capture_mode()
    elif choice == "2":
        section = input("Section name (default: guide): ").strip() or "guide"
        scrolls = input("Number of scrolls (default: 10): ").strip()
        scrolls = int(scrolls) if scrolls.isdigit() else 10
        auto_scroll_capture(section, total_scrolls=scrolls)
    else:
        print("👋 Goodbye!")
        return
    
    # Offer to combine text files
    if capture_count > 0:
        combine = input("\n📚 Combine all text files? (y/n): ").strip().lower()
        if combine == 'y':
            combine_text_files()
        
        print(f"\n✅ Capture complete!")
        print(f"📁 Output directory: {os.path.abspath(OUTPUT_DIR)}")
        print(f"📸 Screenshots: {capture_count}")
        print(f"📄 Text files: {len(os.listdir(TEXT_DIR))}")

if __name__ == "__main__":
    try:
        main()
    except KeyboardInterrupt:
        print("\n\n⚠️  Interrupted by user")
        if capture_count > 0:
            print(f"📁 Partial capture saved in: {os.path.abspath(OUTPUT_DIR)}")
    except Exception as e:
        print(f"\n❌ Error: {e}")
        import traceback
        traceback.print_exc()
