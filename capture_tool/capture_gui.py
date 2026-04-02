"""
Digistar 7 User Guide Capture Tool - GUI Version
Easy-to-use GUI with buttons for capturing screenshots
"""

import tkinter as tk
from tkinter import ttk, scrolledtext, messagebox
import pyautogui
from PIL import Image, ImageTk
import os
from datetime import datetime
import threading
import time
import ctypes
from ctypes import wintypes

class DigistarCaptureGUI:
    def __init__(self, root):
        self.root = root
        self.root.title("Digistar Guide Capture Tool")
        self.root.geometry("500x700")
        
        # Configuration
        self.output_dir = "digistar_screenshots"
        os.makedirs(self.output_dir, exist_ok=True)
        
        self.capture_count = 0
        self.section_name = "page"
        self.auto_capturing = False
        
        self.setup_ui()
        
    def setup_ui(self):
        """Create the GUI interface"""
        
        # Title
        title_frame = tk.Frame(self.root, bg="#2c3e50", pady=15)
        title_frame.pack(fill=tk.X)
        
        title_label = tk.Label(
            title_frame,
            text="📸 Digistar Guide Capture",
            font=("Arial", 18, "bold"),
            bg="#2c3e50",
            fg="white"
        )
        title_label.pack()
        
        subtitle_label = tk.Label(
            title_frame,
            text="Capture screenshots from Digistar 7",
            font=("Arial", 10),
            bg="#2c3e50",
            fg="#ecf0f1"
        )
        subtitle_label.pack()
        
        # Main container
        main_frame = tk.Frame(self.root, padx=20, pady=20)
        main_frame.pack(fill=tk.BOTH, expand=True)
        
        # Section Name Input
        section_frame = tk.LabelFrame(main_frame, text="📝 Section Name", font=("Arial", 10, "bold"), padx=10, pady=10)
        section_frame.pack(fill=tk.X, pady=(0, 15))
        
        self.section_entry = tk.Entry(section_frame, font=("Arial", 12), width=30)
        self.section_entry.insert(0, self.section_name)
        self.section_entry.pack(side=tk.LEFT, padx=(0, 10), fill=tk.X, expand=True)
        
        set_btn = tk.Button(
            section_frame,
            text="Set Name",
            command=self.set_section_name,
            bg="#3498db",
            fg="white",
            font=("Arial", 10, "bold"),
            padx=15
        )
        set_btn.pack(side=tk.LEFT)
        
        # Capture Buttons
        button_frame = tk.LabelFrame(main_frame, text="🎮 Capture Controls", font=("Arial", 10, "bold"), padx=10, pady=10)
        button_frame.pack(fill=tk.X, pady=(0, 15))
        
        # Big capture button
        self.capture_btn = tk.Button(
            button_frame,
            text="📸 CAPTURE NOW",
            command=self.capture_screenshot,
            bg="#27ae60",
            fg="white",
            font=("Arial", 14, "bold"),
            height=2,
            cursor="hand2"
        )
        self.capture_btn.pack(fill=tk.X, pady=(0, 10))
        
        # Secondary buttons row
        btn_row = tk.Frame(button_frame)
        btn_row.pack(fill=tk.X)
        
        scroll_btn = tk.Button(
            btn_row,
            text="📜 Scroll Down",
            command=self.scroll_down,
            bg="#e67e22",
            fg="white",
            font=("Arial", 10, "bold"),
            pady=8
        )
        scroll_btn.pack(side=tk.LEFT, fill=tk.X, expand=True, padx=(0, 5))
        
        scroll_capture_btn = tk.Button(
            btn_row,
            text="📜📸 Scroll & Capture",
            command=self.scroll_and_capture,
            bg="#9b59b6",
            fg="white",
            font=("Arial", 10, "bold"),
            pady=8
        )
        scroll_capture_btn.pack(side=tk.LEFT, fill=tk.X, expand=True, padx=(5, 0))
        
        # Auto Capture Section
        auto_frame = tk.LabelFrame(main_frame, text="🤖 Auto Capture", font=("Arial", 10, "bold"), padx=10, pady=10)
        auto_frame.pack(fill=tk.X, pady=(0, 15))
        
        auto_settings = tk.Frame(auto_frame)
        auto_settings.pack(fill=tk.X, pady=(0, 10))
        
        tk.Label(auto_settings, text="Number of scrolls:", font=("Arial", 9)).pack(side=tk.LEFT)
        self.scroll_count_var = tk.StringVar(value="5")
        scroll_spinbox = tk.Spinbox(
            auto_settings,
            from_=1,
            to=50,
            textvariable=self.scroll_count_var,
            width=5,
            font=("Arial", 10)
        )
        scroll_spinbox.pack(side=tk.LEFT, padx=10)
        
        tk.Label(auto_settings, text="Delay (sec):", font=("Arial", 9)).pack(side=tk.LEFT, padx=(20, 0))
        self.delay_var = tk.StringVar(value="1.0")
        delay_spinbox = tk.Spinbox(
            auto_settings,
            from_=0.5,
            to=5.0,
            increment=0.5,
            textvariable=self.delay_var,
            width=5,
            font=("Arial", 10)
        )
        delay_spinbox.pack(side=tk.LEFT, padx=10)
        
        self.auto_btn = tk.Button(
            auto_frame,
            text="▶️ Start Auto Capture",
            command=self.toggle_auto_capture,
            bg="#16a085",
            fg="white",
            font=("Arial", 10, "bold"),
            pady=8
        )
        self.auto_btn.pack(fill=tk.X)
        
        # Status Section
        status_frame = tk.LabelFrame(main_frame, text="📊 Status", font=("Arial", 10, "bold"), padx=10, pady=10)
        status_frame.pack(fill=tk.BOTH, expand=True)
        
        # Stats
        stats_frame = tk.Frame(status_frame)
        stats_frame.pack(fill=tk.X, pady=(0, 10))
        
        self.count_label = tk.Label(
            stats_frame,
            text="Captures: 0",
            font=("Arial", 11, "bold"),
            bg="#ecf0f1",
            padx=10,
            pady=5
        )
        self.count_label.pack(side=tk.LEFT, padx=(0, 10))
        
        self.section_label = tk.Label(
            stats_frame,
            text="Current: page",
            font=("Arial", 11),
            bg="#ecf0f1",
            padx=10,
            pady=5
        )
        self.section_label.pack(side=tk.LEFT, fill=tk.X, expand=True)
        
        # Log output
        tk.Label(status_frame, text="Log:", font=("Arial", 9, "bold")).pack(anchor=tk.W)
        self.log_text = scrolledtext.ScrolledText(
            status_frame,
            height=10,
            font=("Courier", 9),
            bg="#2c3e50",
            fg="#ecf0f1",
            wrap=tk.WORD
        )
        self.log_text.pack(fill=tk.BOTH, expand=True, pady=(5, 10))
        
        # Open folder button
        open_folder_btn = tk.Button(
            status_frame,
            text="📁 Open Output Folder",
            command=self.open_output_folder,
            bg="#34495e",
            fg="white",
            font=("Arial", 9, "bold"),
            pady=5
        )
        open_folder_btn.pack(fill=tk.X)
        
        # Initial log message
        self.log("Welcome! Ready to capture screenshots.")
        self.log(f"Output folder: {os.path.abspath(self.output_dir)}")
        self.log("\n💡 Instructions:")
        self.log("1. Enter a section name")
        self.log("2. Click on Digistar window")
        self.log("3. Click 'CAPTURE NOW' button")
        self.log("4. Repeat for all sections!\n")
        
    def log(self, message):
        """Add message to log"""
        timestamp = datetime.now().strftime("%H:%M:%S")
        self.log_text.insert(tk.END, f"[{timestamp}] {message}\n")
        self.log_text.see(tk.END)
        self.root.update()
        
    def set_section_name(self):
        """Update the current section name"""
        self.section_name = self.section_entry.get().strip() or "page"
        self.section_label.config(text=f"Current: {self.section_name}")
        self.log(f"✓ Section name set to: '{self.section_name}'")
        
    def capture_screenshot(self):
        """Capture a screenshot"""
        self.set_section_name()  # Always update name before capture
        
        self.capture_count += 1
        timestamp = datetime.now().strftime("%Y%m%d_%H%M%S")
        filename = f"{self.capture_count:03d}_{self.section_name}_{timestamp}.png"
        filepath = os.path.join(self.output_dir, filename)
        
        self.log(f"📸 Capturing: {filename}")
        
        # Focus leftmost window before capture (tool stays visible)
        self.focus_leftmost_window()
        time.sleep(0.1)
        
        try:
            screenshot = pyautogui.screenshot()
            screenshot.save(filepath)
            self.log(f"   ✅ Saved successfully!")
            self.count_label.config(text=f"Captures: {self.capture_count}")
        except Exception as e:
            self.log(f"   ❌ Error: {e}")
            
    def get_leftmost_window(self):
        """Find the leftmost visible window and return its center coordinates"""
        user32 = ctypes.windll.user32
        
        windows = []
        
        def enum_window_callback(hwnd, _):
            if user32.IsWindowVisible(hwnd):
                # Get window rect
                rect = wintypes.RECT()
                user32.GetWindowRect(hwnd, ctypes.byref(rect))
                
                # Skip tiny windows (likely system UI elements)
                width = rect.right - rect.left
                height = rect.bottom - rect.top
                if width > 100 and height > 100:
                    windows.append({
                        'hwnd': hwnd,
                        'left': rect.left,
                        'top': rect.top,
                        'right': rect.right,
                        'bottom': rect.bottom,
                        'width': width,
                        'height': height
                    })
            return True
        
        # Enumerate all windows
        EnumWindowsProc = ctypes.WINFUNCTYPE(ctypes.c_bool, ctypes.c_void_p, ctypes.c_void_p)
        user32.EnumWindows(EnumWindowsProc(enum_window_callback), 0)
        
        if not windows:
            # Fallback to fixed position if no windows found
            screen_width, screen_height = pyautogui.size()
            return (int(screen_width * 0.1), int(screen_height * 0.5))
        
        # Find leftmost window
        leftmost = min(windows, key=lambda w: w['left'])
        
        # Calculate center of leftmost window
        center_x = leftmost['left'] + (leftmost['width'] // 2)
        center_y = leftmost['top'] + (leftmost['height'] // 2)
        
        return (center_x, center_y)
    
    def focus_leftmost_window(self):
        """Click on the center of the leftmost window to activate it"""
        click_x, click_y = self.get_leftmost_window()
        pyautogui.click(click_x, click_y)
        time.sleep(0.2)  # Wait for window to activate
        
    def scroll_down(self):
        """Scroll down on the page - focuses leftmost window first"""
        self.log("📜 Focusing leftmost window and scrolling down...")
        self.focus_leftmost_window()
        time.sleep(0.1)
        pyautogui.press('pagedown')
        time.sleep(0.3)
        self.log("   ✓ Scrolled one page down")
        
    def scroll_and_capture(self):
        """Scroll down and then capture"""
        self.scroll_down()
        time.sleep(0.5)
        self.capture_screenshot()
        
    def toggle_auto_capture(self):
        """Start or stop auto capture"""
        if not self.auto_capturing:
            self.start_auto_capture()
        else:
            self.stop_auto_capture()
            
    def start_auto_capture(self):
        """Start automatic capture sequence"""
        self.auto_capturing = True
        self.auto_btn.config(text="⏸️ Stop Auto Capture", bg="#e74c3c")
        
        try:
            scroll_count = int(self.scroll_count_var.get())
            delay = float(self.delay_var.get())
        except:
            messagebox.showerror("Error", "Invalid scroll count or delay value")
            self.stop_auto_capture()
            return
            
        self.log(f"\n🤖 Starting auto capture: {scroll_count} scrolls, {delay}s delay")
        
        def auto_capture_thread():
            # Initial capture
            self.root.after(0, self.capture_screenshot)
            time.sleep(delay)
            
            # Scroll and capture
            for i in range(scroll_count):
                if not self.auto_capturing:
                    break
                    
                self.root.after(0, lambda i=i: self.log(f"   Auto scroll {i+1}/{scroll_count}"))
                self.root.after(0, self.scroll_down)
                time.sleep(delay)
                self.root.after(0, self.capture_screenshot)
                time.sleep(delay)
            
            self.root.after(0, self.stop_auto_capture)
            self.root.after(0, lambda: self.log("✅ Auto capture complete!"))
        
        thread = threading.Thread(target=auto_capture_thread, daemon=True)
        thread.start()
        
    def stop_auto_capture(self):
        """Stop auto capture"""
        self.auto_capturing = False
        self.auto_btn.config(text="▶️ Start Auto Capture", bg="#16a085")
        
    def open_output_folder(self):
        """Open the output folder in file explorer"""
        import subprocess
        folder_path = os.path.abspath(self.output_dir)
        subprocess.Popen(f'explorer "{folder_path}"')
        self.log(f"📁 Opened folder: {folder_path}")

def main():
    root = tk.Tk()
    app = DigistarCaptureGUI(root)
    
    # Center window
    root.update_idletasks()
    width = root.winfo_width()
    height = root.winfo_height()
    x = (root.winfo_screenwidth() // 2) - (width // 2)
    y = (root.winfo_screenheight() // 2) - (height // 2)
    root.geometry(f'{width}x{height}+{x}+{y}')
    
    root.mainloop()

if __name__ == "__main__":
    main()
