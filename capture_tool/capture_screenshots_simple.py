"""
Simple Screenshot Capture Tool for Digistar 7 Guide
No OCR - just captures screenshots with hotkeys
"""

import pyautogui
from PIL import Image
import time
import os
from datetime import datetime
import keyboard

# Configuration
OUTPUT_DIR = "digistar_screenshots"
os.makedirs(OUTPUT_DIR, exist_ok=True)

capture_count = 0

def capture_screenshot(name="capture"):
    """Take a screenshot and save it"""
    global capture_count
    capture_count += 1
    
    timestamp = datetime.now().strftime("%Y%m%d_%H%M%S")
    filename = f"{capture_count:03d}_{name}_{timestamp}.png"
    filepath = os.path.join(OUTPUT_DIR, filename)
    
    print(f"📸 Capturing: {filename}")
    screenshot = pyautogui.screenshot()
    screenshot.save(filepath)
    print(f"   ✅ Saved!")
    
    return filepath

def scroll_down():
    """Scroll down on the page"""
    pyautogui.press('pagedown')  # Scroll one full page
    print("📜 Scrolled down one page")
    time.sleep(0.3)

def main():
    print("\n" + "="*60)
    print("📸 SIMPLE SCREENSHOT CAPTURE TOOL")
    print("="*60)
    print("\n🎮 CONTROLS:")
    print("  F9  - Take screenshot")
    print("  F10 - Scroll down")
    print("  F11 - Change section name")
    print("  ESC - Exit and finish")
    print("\n" + "="*60)
    print("\n📋 INSTRUCTIONS:")
    print("1. Click on the Digistar window")
    print("2. Press F11 to set a section name")
    print("3. Press F9 to capture")
    print("4. Press F10 to scroll down if needed")
    print("5. Open next dropdown/section")
    print("6. Repeat steps 2-5")
    print("7. Press ESC when done")
    print("\n⏳ Ready! Waiting for hotkey press...\n")
    
    section_name = "page"
    
    try:
        while True:
            if keyboard.is_pressed('f9'):
                capture_screenshot(section_name)
                time.sleep(0.5)  # Debounce
                
            elif keyboard.is_pressed('f10'):
                scroll_down()
                time.sleep(0.5)
                
            elif keyboard.is_pressed('f11'):
                print("\n" + "-"*60)
                section_name = input("📝 Enter section/page name: ").strip()
                if not section_name:
                    section_name = "page"
                print(f"✅ Section name: '{section_name}'")
                print("⏳ Continue capturing...\n")
                time.sleep(0.5)
                
            elif keyboard.is_pressed('esc'):
                print("\n" + "="*60)
                print("🏁 CAPTURE COMPLETE!")
                print("="*60)
                break
            
            time.sleep(0.1)
        
    except KeyboardInterrupt:
        print("\n⚠️  Interrupted!")
    
    # Summary
    print(f"\n📊 SUMMARY:")
    print(f"   Total screenshots: {capture_count}")
    print(f"   Saved in: {os.path.abspath(OUTPUT_DIR)}")
    print("\n💡 TIP: Open the folder and review all screenshots")
    print("   You can manually copy text or use them as reference!")

if __name__ == "__main__":
    main()
