#!/usr/bin/env python3
"""
ASCII Art Converter - GUI Version
High-resolution image to color-accurate ASCII art converter with tkinter interface
"""

import os
import sys
import tkinter as tk
from tkinter import ttk, filedialog, messagebox
from PIL import Image, ImageDraw, ImageFont, ImageTk
import numpy as np
import threading


class ASCIIConverter:
    """Convert images to color-accurate ASCII art"""
    
    ASCII_CHARS_DETAILED = " .'`^\",:;Il!i><~+_-?][}{1)(|\\/tfjrxnuvczXYUJCLQ0OZmwqpdbkhao*#MW&8%B@$"
    ASCII_CHARS_SIMPLE = " .:-=+*#%@"
    # Braille characters sorted by dot density (0 dots -> 8 dots)
    ASCII_CHARS_BLOCKS = " ⠀⠁⠂⠄⠈⠐⠠⡀⢀⠃⠅⠆⠉⠊⠌⠑⠒⠔⠘⠡⠢⠤⠨⠰⡁⡂⡄⡈⡐⡠⢁⢂⢄⢈⢐⢠⣀⠇⠋⠍⠎⠓⠕⠖⠙⠚⠜⠣⠥⠦⠩⠪⠬⠱⠲⠴⠸⡃⡅⡆⡉⡊⡌⡑⡒⡔⡘⡡⡢⡤⡨⡰⢃⢅⢆⢉⢊⢌⢑⢒⢔⢘⢡⢢⢤⢨⢰⣁⣂⣄⣈⣐⣠⠏⠗⠛⠝⠞⠟⠧⠫⠭⠮⠳⠵⠶⠹⠺⠼⡇⡋⡍⡎⡓⡕⡖⡙⡚⡜⡣⡥⡦⡩⡪⡬⡱⡲⡴⡸⢇⢋⢍⢎⢓⢕⢖⢙⢚⢜⢣⢥⢦⢩⢪⢬⢱⢲⢴⢸⣃⣅⣆⣉⣊⣌⣑⣒⣔⣘⣡⣢⣤⣨⣰⠿⡏⡗⡛⡝⡞⡟⡧⡫⡭⡮⡳⡵⡶⡹⡺⡼⢏⢗⢛⢝⢞⢟⢧⢫⢭⢮⢳⢵⢶⢹⢺⢼⣇⣋⣍⣎⣓⣕⣖⣙⣚⣜⣣⣥⣦⣩⣪⣬⣱⣲⣴⣸⡿⢟⢯⢷⢻⢽⢾⣏⣗⣛⣝⣞⣟⣧⣫⣭⣮⣳⣵⣶⣹⣺⣼⡟⡯⡷⡻⡽⡾⣟⣯⣷⣻⣽⣾⣿"
    
    def __init__(self, char_width=8, char_height=16, font_path=None, charset='detailed', color_boost=1.0, invert_chars=True, use_bg_char=True, block_background=False):
        self.char_width = char_width
        self.char_height = char_height
        self.color_boost = color_boost
        self.invert_chars = invert_chars
        self.use_bg_char = use_bg_char
        self.block_background = block_background
        
        if charset == 'simple':
            base_chars = self.ASCII_CHARS_SIMPLE
        elif charset == 'blocks':
            base_chars = self.ASCII_CHARS_BLOCKS
        else:
            base_chars = self.ASCII_CHARS_DETAILED
        
        # Reverse character order for dark backgrounds (darker = denser chars)
        self.ascii_chars = base_chars[::-1] if invert_chars else base_chars
        
        try:
            if font_path and os.path.exists(font_path):
                self.font = ImageFont.truetype(font_path, char_height - 2)
            else:
                for font_name in ['consola.ttf', 'cour.ttf', 'DejaVuSansMono.ttf']:
                    try:
                        self.font = ImageFont.truetype(font_name, char_height - 2)
                        break
                    except:
                        continue
                else:
                    self.font = ImageFont.load_default()
        except:
            self.font = ImageFont.load_default()
    
    def get_brightness(self, rgb):
        r, g, b = rgb
        return 0.299 * r + 0.587 * g + 0.114 * b
    
    def pixel_to_ascii(self, brightness):
        # Map brightness to character index
        char_index = int((brightness / 255) * (len(self.ascii_chars) - 1))
        char_index = max(0, min(len(self.ascii_chars) - 1, char_index))
        return self.ascii_chars[char_index]
    
    def boost_color(self, rgb):
        """Apply color boost to make colors more vivid"""
        if self.color_boost == 1.0:
            return rgb
        r, g, b = rgb
        r = min(255, int(r * self.color_boost))
        g = min(255, int(g * self.color_boost))
        b = min(255, int(b * self.color_boost))
        return (r, g, b)
    
    def convert_image_to_ascii_data(self, image, scale_factor=1.0, progress_callback=None):
        if scale_factor != 1.0:
            new_width = int(image.width * scale_factor)
            new_height = int(image.height * scale_factor)
            image = image.resize((new_width, new_height), Image.Resampling.LANCZOS)
        
        ascii_width = image.width
        ascii_height = image.height
        
        if image.mode != 'RGB':
            image = image.convert('RGB')
        
        pixels = np.array(image)
        ascii_array = []
        color_array = []
        
        for y in range(ascii_height):
            if progress_callback and y % 10 == 0:
                progress_callback(y / ascii_height)
            
            row_chars = []
            row_colors = []
            for x in range(ascii_width):
                r, g, b = pixels[y, x]
                brightness = self.get_brightness((r, g, b))
                char = self.pixel_to_ascii(brightness)
                row_chars.append(char)
                # Apply color boost and ensure RGB format
                boosted_color = self.boost_color((int(r), int(g), int(b)))
                row_colors.append(boosted_color)
            
            ascii_array.append(row_chars)
            color_array.append(row_colors)
        
        if progress_callback:
            progress_callback(1.0)
        
        return ascii_array, color_array, ascii_width, ascii_height
    
    def render_ascii_to_image(self, ascii_array, color_array, bg_color=(0, 0, 0), progress_callback=None):
        height = len(ascii_array)
        width = len(ascii_array[0]) if height > 0 else 0
        
        output_width = width * self.char_width
        output_height = height * self.char_height
        output_image = Image.new('RGB', (output_width, output_height), bg_color)
        draw = ImageDraw.Draw(output_image)
        
        # Get the lightest character for background layer
        bg_char = self.ascii_chars[0] if len(self.ascii_chars) > 0 else ' '
        
        for y in range(height):
            if progress_callback and y % 10 == 0:
                progress_callback(y / height)
            
            for x in range(width):
                char = ascii_array[y][x]
                color = color_array[y][x]
                char_x = x * self.char_width
                char_y = y * self.char_height
                
                # Ensure color is a proper RGB tuple
                if isinstance(color, (list, tuple)) and len(color) >= 3:
                    rgb_color = (int(color[0]), int(color[1]), int(color[2]))
                    
                    if self.block_background:
                        # SOLID BLOCK MODE: Full block background with detail overlay
                        # Draw solid block with full pixel color
                        draw.text((char_x, char_y), '█', fill=rgb_color, font=self.font)
                        
                        # Calculate highlight/shadow color for detail character
                        brightness = self.get_brightness(rgb_color)
                        
                        if brightness > 128:  # Bright areas - use darker detail (shadow)
                            detail_factor = 0.3  # 30% darker
                            detail_rgb = (
                                int(rgb_color[0] * detail_factor),
                                int(rgb_color[1] * detail_factor),
                                int(rgb_color[2] * detail_factor)
                            )
                        else:  # Dark areas - use lighter detail (highlight)
                            detail_factor = 2.5  # Much lighter
                            detail_rgb = (
                                min(255, int(rgb_color[0] * detail_factor)),
                                min(255, int(rgb_color[1] * detail_factor)),
                                min(255, int(rgb_color[2] * detail_factor))
                            )
                        
                        # Draw detail character on top
                        draw.text((char_x, char_y), char, fill=detail_rgb, font=self.font)
                        
                    elif self.use_bg_char and bg_char != ' ':
                        # ORIGINAL MODE: Dimmed background character
                        bg_intensity = 0.3  # 30% of original color
                        bg_rgb = (
                            int(rgb_color[0] * bg_intensity),
                            int(rgb_color[1] * bg_intensity),
                            int(rgb_color[2] * bg_intensity)
                        )
                        draw.text((char_x, char_y), bg_char, fill=bg_rgb, font=self.font)
                        
                        # Draw foreground character with full color
                        draw.text((char_x, char_y), char, fill=rgb_color, font=self.font)
                    else:
                        # SIMPLE MODE: Just the character
                        draw.text((char_x, char_y), char, fill=rgb_color, font=self.font)
                else:
                    draw.text((char_x, char_y), char, fill=color, font=self.font)
        
        if progress_callback:
            progress_callback(1.0)
        
        return output_image


class ASCIIConverterGUI:
    def __init__(self, root):
        self.root = root
        self.root.title("ASCII Art Converter")
        self.root.geometry("900x700")
        
        self.input_image = None
        self.input_path = None
        self.preview_image = None
        self.ascii_data = None
        
        self.setup_ui()
    
    def setup_ui(self):
        # Main container
        main_frame = ttk.Frame(self.root, padding="10")
        main_frame.grid(row=0, column=0, sticky=(tk.W, tk.E, tk.N, tk.S))
        
        # Configure grid weights
        self.root.columnconfigure(0, weight=1)
        self.root.rowconfigure(0, weight=1)
        main_frame.columnconfigure(1, weight=1)
        main_frame.rowconfigure(5, weight=1)
        
        # Input file selection
        ttk.Label(main_frame, text="Input Image:").grid(row=0, column=0, sticky=tk.W, pady=5)
        self.input_label = ttk.Label(main_frame, text="No file selected", foreground="gray")
        self.input_label.grid(row=0, column=1, sticky=tk.W, padx=5)
        ttk.Button(main_frame, text="Browse...", command=self.browse_input).grid(row=0, column=2, padx=5)
        
        # Output file selection
        ttk.Label(main_frame, text="Output File:").grid(row=1, column=0, sticky=tk.W, pady=5)
        self.output_var = tk.StringVar()
        self.output_entry = ttk.Entry(main_frame, textvariable=self.output_var)
        self.output_entry.grid(row=1, column=1, sticky=(tk.W, tk.E), padx=5)
        ttk.Button(main_frame, text="Browse...", command=self.browse_output).grid(row=1, column=2, padx=5)
        
        # Settings frame
        settings_frame = ttk.LabelFrame(main_frame, text="Settings", padding="10")
        settings_frame.grid(row=2, column=0, columnspan=3, sticky=(tk.W, tk.E), pady=10)
        settings_frame.columnconfigure(1, weight=1)
        
        # Scale factor
        ttk.Label(settings_frame, text="Scale Factor:").grid(row=0, column=0, sticky=tk.W, pady=3)
        self.scale_var = tk.DoubleVar(value=0.5)
        scale_frame = ttk.Frame(settings_frame)
        scale_frame.grid(row=0, column=1, sticky=(tk.W, tk.E), padx=5)
        tk.Scale(scale_frame, from_=0.1, to=2.0, variable=self.scale_var, orient=tk.HORIZONTAL, resolution=0.1, showvalue=False).pack(side=tk.LEFT, fill=tk.X, expand=True)
        ttk.Label(scale_frame, textvariable=self.scale_var).pack(side=tk.LEFT, padx=5)
        
        # Character set
        ttk.Label(settings_frame, text="Character Set:").grid(row=1, column=0, sticky=tk.W, pady=3)
        self.charset_var = tk.StringVar(value="detailed")
        charset_frame = ttk.Frame(settings_frame)
        charset_frame.grid(row=1, column=1, sticky=tk.W, padx=5)
        ttk.Radiobutton(charset_frame, text="Detailed (70 chars)", variable=self.charset_var, value="detailed").pack(side=tk.LEFT, padx=5)
        ttk.Radiobutton(charset_frame, text="Simple (10 chars)", variable=self.charset_var, value="simple").pack(side=tk.LEFT, padx=5)
        ttk.Radiobutton(charset_frame, text="Blocks", variable=self.charset_var, value="blocks").pack(side=tk.LEFT, padx=5)
        
        # Character size
        ttk.Label(settings_frame, text="Character Width:").grid(row=2, column=0, sticky=tk.W, pady=3)
        self.char_width_var = tk.IntVar(value=8)
        ttk.Spinbox(settings_frame, from_=4, to=20, textvariable=self.char_width_var, width=10).grid(row=2, column=1, sticky=tk.W, padx=5)
        
        ttk.Label(settings_frame, text="Character Height:").grid(row=3, column=0, sticky=tk.W, pady=3)
        self.char_height_var = tk.IntVar(value=16)
        ttk.Spinbox(settings_frame, from_=8, to=40, textvariable=self.char_height_var, width=10).grid(row=3, column=1, sticky=tk.W, padx=5)
        
        # Invert characters option
        ttk.Label(settings_frame, text="Character Density:").grid(row=4, column=0, sticky=tk.W, pady=3)
        self.invert_chars_var = tk.BooleanVar(value=True)
        invert_frame = ttk.Frame(settings_frame)
        invert_frame.grid(row=4, column=1, sticky=tk.W, padx=5)
        ttk.Checkbutton(invert_frame, text="Invert for dark backgrounds (darker = denser chars)", variable=self.invert_chars_var).pack(side=tk.LEFT)
        
        # Background character layer option
        self.use_bg_char_var = tk.BooleanVar(value=True)
        ttk.Checkbutton(settings_frame, text="Use background character layer (prevents color muting)", variable=self.use_bg_char_var).grid(row=4, column=2, sticky=tk.W, padx=5)
        
        # Block background mode option
        self.block_bg_var = tk.BooleanVar(value=False)
        ttk.Checkbutton(settings_frame, text="Solid block background mode (█ + detail overlay)", variable=self.block_bg_var).grid(row=4, column=3, sticky=tk.W, padx=5)
        
        # Color boost
        ttk.Label(settings_frame, text="Color Boost:").grid(row=5, column=0, sticky=tk.W, pady=3)
        self.color_boost_var = tk.DoubleVar(value=1.2)
        boost_frame = ttk.Frame(settings_frame)
        boost_frame.grid(row=5, column=1, sticky=(tk.W, tk.E), padx=5)
        tk.Scale(boost_frame, from_=0.5, to=2.0, variable=self.color_boost_var, orient=tk.HORIZONTAL, resolution=0.1, showvalue=False).pack(side=tk.LEFT, fill=tk.X, expand=True)
        ttk.Label(boost_frame, textvariable=self.color_boost_var).pack(side=tk.LEFT, padx=5)
        ttk.Label(settings_frame, text="(Higher = more vivid colors)", font=('TkDefaultFont', 8), foreground='gray').grid(row=5, column=2, sticky=tk.W, padx=5)
        
        # Background color
        ttk.Label(settings_frame, text="Background Color:").grid(row=6, column=0, sticky=tk.W, pady=3)
        bg_frame = ttk.Frame(settings_frame)
        bg_frame.grid(row=6, column=1, sticky=tk.W, padx=5)
        self.bg_r_var = tk.IntVar(value=0)
        self.bg_g_var = tk.IntVar(value=0)
        self.bg_b_var = tk.IntVar(value=0)
        ttk.Label(bg_frame, text="R:").pack(side=tk.LEFT)
        ttk.Spinbox(bg_frame, from_=0, to=255, textvariable=self.bg_r_var, width=5).pack(side=tk.LEFT, padx=2)
        ttk.Label(bg_frame, text="G:").pack(side=tk.LEFT, padx=(10, 0))
        ttk.Spinbox(bg_frame, from_=0, to=255, textvariable=self.bg_g_var, width=5).pack(side=tk.LEFT, padx=2)
        ttk.Label(bg_frame, text="B:").pack(side=tk.LEFT, padx=(10, 0))
        ttk.Spinbox(bg_frame, from_=0, to=255, textvariable=self.bg_b_var, width=5).pack(side=tk.LEFT, padx=2)
        
        # Output format
        ttk.Label(settings_frame, text="Output Format:").grid(row=7, column=0, sticky=tk.W, pady=3)
        self.format_var = tk.StringVar(value="png")
        format_frame = ttk.Frame(settings_frame)
        format_frame.grid(row=7, column=1, sticky=tk.W, padx=5)
        ttk.Radiobutton(format_frame, text="PNG Image", variable=self.format_var, value="png").pack(side=tk.LEFT, padx=5)
        ttk.Radiobutton(format_frame, text="HTML File", variable=self.format_var, value="html").pack(side=tk.LEFT, padx=5)
        
        # Action buttons
        button_frame = ttk.Frame(main_frame)
        button_frame.grid(row=3, column=0, columnspan=3, pady=10)
        ttk.Button(button_frame, text="Generate Preview", command=self.generate_preview).pack(side=tk.LEFT, padx=5)
        ttk.Button(button_frame, text="Convert & Save", command=self.convert_and_save, style="Accent.TButton").pack(side=tk.LEFT, padx=5)
        
        # Progress bar
        self.progress_var = tk.DoubleVar()
        self.progress_bar = ttk.Progressbar(main_frame, variable=self.progress_var, maximum=100)
        self.progress_bar.grid(row=4, column=0, columnspan=3, sticky=(tk.W, tk.E), pady=5)
        
        # Preview area
        preview_frame = ttk.LabelFrame(main_frame, text="Preview", padding="5")
        preview_frame.grid(row=5, column=0, columnspan=3, sticky=(tk.W, tk.E, tk.N, tk.S), pady=5)
        preview_frame.columnconfigure(0, weight=1)
        preview_frame.rowconfigure(0, weight=1)
        
        # Canvas with scrollbars
        canvas_frame = ttk.Frame(preview_frame)
        canvas_frame.grid(row=0, column=0, sticky=(tk.W, tk.E, tk.N, tk.S))
        canvas_frame.columnconfigure(0, weight=1)
        canvas_frame.rowconfigure(0, weight=1)
        
        self.preview_canvas = tk.Canvas(canvas_frame, bg="black")
        self.preview_canvas.grid(row=0, column=0, sticky=(tk.W, tk.E, tk.N, tk.S))
        
        v_scroll = ttk.Scrollbar(canvas_frame, orient=tk.VERTICAL, command=self.preview_canvas.yview)
        v_scroll.grid(row=0, column=1, sticky=(tk.N, tk.S))
        h_scroll = ttk.Scrollbar(canvas_frame, orient=tk.HORIZONTAL, command=self.preview_canvas.xview)
        h_scroll.grid(row=1, column=0, sticky=(tk.W, tk.E))
        
        self.preview_canvas.configure(yscrollcommand=v_scroll.set, xscrollcommand=h_scroll.set)
        
        # Status bar
        self.status_var = tk.StringVar(value="Ready")
        status_bar = ttk.Label(main_frame, textvariable=self.status_var, relief=tk.SUNKEN, anchor=tk.W)
        status_bar.grid(row=6, column=0, columnspan=3, sticky=(tk.W, tk.E), pady=(5, 0))
    
    def browse_input(self):
        filename = filedialog.askopenfilename(
            title="Select Input Image",
            filetypes=[
                ("Image files", "*.jpg *.jpeg *.png *.bmp *.gif *.tiff"),
                ("All files", "*.*")
            ]
        )
        if filename:
            self.input_path = filename
            self.input_label.config(text=os.path.basename(filename), foreground="black")
            
            # Auto-fill output path
            if not self.output_var.get():
                base_name = os.path.splitext(filename)[0]
                self.output_var.set(f"{base_name}_ascii.png")
            
            # Load image
            try:
                self.input_image = Image.open(filename)
                self.status_var.set(f"Loaded: {self.input_image.width}x{self.input_image.height}")
            except Exception as e:
                messagebox.showerror("Error", f"Failed to load image: {e}")
    
    def browse_output(self):
        ext = "png" if self.format_var.get() == "png" else "html"
        filename = filedialog.asksaveasfilename(
            title="Save Output As",
            defaultextension=f".{ext}",
            filetypes=[
                (f"{ext.upper()} files", f"*.{ext}"),
                ("All files", "*.*")
            ]
        )
        if filename:
            self.output_var.set(filename)
    
    def update_progress(self, value):
        self.progress_var.set(value * 100)
        self.root.update_idletasks()
    
    def generate_preview(self):
        if not self.input_image:
            messagebox.showwarning("No Image", "Please select an input image first.")
            return
        
        self.status_var.set("Generating preview...")
        self.progress_var.set(0)
        
        def preview_thread():
            try:
                # Use smaller scale for preview
                preview_scale = min(0.1, self.scale_var.get())
                
                converter = ASCIIConverter(
                    char_width=4,
                    char_height=8,
                    charset=self.charset_var.get(),
                    color_boost=self.color_boost_var.get(),
                    invert_chars=self.invert_chars_var.get(),
                    use_bg_char=self.use_bg_char_var.get(),
                    block_background=self.block_bg_var.get()
                )
                
                ascii_array, color_array, width, height = converter.convert_image_to_ascii_data(
                    self.input_image,
                    scale_factor=preview_scale,
                    progress_callback=self.update_progress
                )
                
                self.status_var.set("Rendering preview...")
                self.progress_var.set(0)
                
                bg_color = (self.bg_r_var.get(), self.bg_g_var.get(), self.bg_b_var.get())
                preview_img = converter.render_ascii_to_image(
                    ascii_array,
                    color_array,
                    bg_color=bg_color,
                    progress_callback=self.update_progress
                )
                
                # Display in canvas
                self.preview_image = ImageTk.PhotoImage(preview_img)
                self.preview_canvas.delete("all")
                self.preview_canvas.create_image(0, 0, anchor=tk.NW, image=self.preview_image)
                self.preview_canvas.configure(scrollregion=self.preview_canvas.bbox("all"))
                
                self.status_var.set(f"Preview generated: {width}x{height} chars")
                self.progress_var.set(0)
                
            except Exception as e:
                messagebox.showerror("Error", f"Failed to generate preview: {e}")
                self.status_var.set("Preview failed")
                self.progress_var.set(0)
        
        thread = threading.Thread(target=preview_thread, daemon=True)
        thread.start()
    
    def convert_and_save(self):
        if not self.input_image:
            messagebox.showwarning("No Image", "Please select an input image first.")
            return
        
        output_path = self.output_var.get()
        if not output_path:
            messagebox.showwarning("No Output", "Please specify an output file path.")
            return
        
        self.status_var.set("Converting image...")
        self.progress_var.set(0)
        
        def convert_thread():
            try:
                converter = ASCIIConverter(
                    char_width=self.char_width_var.get(),
                    char_height=self.char_height_var.get(),
                    charset=self.charset_var.get(),
                    color_boost=self.color_boost_var.get(),
                    invert_chars=self.invert_chars_var.get(),
                    use_bg_char=self.use_bg_char_var.get(),
                    block_background=self.block_bg_var.get()
                )
                
                ascii_array, color_array, width, height = converter.convert_image_to_ascii_data(
                    self.input_image,
                    scale_factor=self.scale_var.get(),
                    progress_callback=self.update_progress
                )
                
                self.status_var.set("Rendering output...")
                self.progress_var.set(0)
                
                bg_color = (self.bg_r_var.get(), self.bg_g_var.get(), self.bg_b_var.get())
                
                if self.format_var.get() == "png":
                    output_img = converter.render_ascii_to_image(
                        ascii_array,
                        color_array,
                        bg_color=bg_color,
                        progress_callback=self.update_progress
                    )
                    output_img.save(output_path)
                    
                else:  # HTML
                    with open(output_path, 'w', encoding='utf-8') as f:
                        f.write('<!DOCTYPE html>\n<html>\n<head>\n<meta charset="UTF-8">\n<style>\n')
                        f.write('body { margin: 0; padding: 20px; ')
                        f.write(f'background-color: rgb{bg_color}; ')
                        f.write('font-family: "Courier New", Courier, monospace; ')
                        f.write('font-size: 12px; line-height: 1.0; white-space: pre; }\n')
                        f.write('</style>\n</head>\n<body>\n')
                        
                        for y, row in enumerate(ascii_array):
                            if y % 10 == 0:
                                self.update_progress(y / len(ascii_array))
                            for x, char in enumerate(row):
                                r, g, b = color_array[y][x]
                                if char == ' ':
                                    f.write(' ')
                                else:
                                    f.write(f'<span style="color:rgb({r},{g},{b})">{char}</span>')
                            f.write('\n')
                        
                        f.write('</body>\n</html>')
                
                self.status_var.set(f"Saved: {output_path}")
                self.progress_var.set(0)
                messagebox.showinfo("Success", f"ASCII art saved to:\n{output_path}")
                
            except Exception as e:
                messagebox.showerror("Error", f"Failed to convert: {e}")
                self.status_var.set("Conversion failed")
                self.progress_var.set(0)
        
        thread = threading.Thread(target=convert_thread, daemon=True)
        thread.start()


def main():
    root = tk.Tk()
    app = ASCIIConverterGUI(root)
    root.mainloop()


if __name__ == '__main__':
    main()
