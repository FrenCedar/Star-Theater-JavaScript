#!/usr/bin/env python3
"""
High-Resolution Image to Color-Accurate ASCII Art Converter

Converts images to ASCII art while preserving colors.
Outputs as PNG images with rendered ASCII characters for use as Digistar textures.
"""

import os
import sys
from PIL import Image, ImageDraw, ImageFont
import argparse
import numpy as np


class ASCIIConverter:
    """Convert images to color-accurate ASCII art"""
    
    # ASCII characters from darkest to brightest (density-based)
    ASCII_CHARS_DETAILED = " .'`^\",:;Il!i><~+_-?][}{1)(|\\/tfjrxnuvczXYUJCLQ0OZmwqpdbkhao*#MW&8%B@$"
    ASCII_CHARS_SIMPLE = " .:-=+*#%@"
    ASCII_CHARS_BLOCKS = " ░▒▓█"
    
    def __init__(self, char_width=8, char_height=16, font_path=None, charset='detailed'):
        """
        Initialize converter
        
        Args:
            char_width: Width of each ASCII character in output
            char_height: Height of each ASCII character in output
            font_path: Path to monospace font file (TTF). If None, uses default.
            charset: 'detailed', 'simple', or 'blocks'
        """
        self.char_width = char_width
        self.char_height = char_height
        
        # Select character set
        if charset == 'simple':
            self.ascii_chars = self.ASCII_CHARS_SIMPLE
        elif charset == 'blocks':
            self.ascii_chars = self.ASCII_CHARS_BLOCKS
        else:
            self.ascii_chars = self.ASCII_CHARS_DETAILED
        
        # Load font
        try:
            if font_path and os.path.exists(font_path):
                self.font = ImageFont.truetype(font_path, char_height - 2)
            else:
                # Try common monospace fonts
                for font_name in ['consola.ttf', 'cour.ttf', 'DejaVuSansMono.ttf']:
                    try:
                        self.font = ImageFont.truetype(font_name, char_height - 2)
                        break
                    except:
                        continue
                else:
                    # Fallback to default
                    self.font = ImageFont.load_default()
                    print("Warning: Using default font. For better results, specify a monospace TTF font.")
        except Exception as e:
            print(f"Font loading error: {e}. Using default font.")
            self.font = ImageFont.load_default()
    
    def get_brightness(self, rgb):
        """Calculate brightness of RGB color (0-255)"""
        # Use luminance formula for perceptual brightness
        r, g, b = rgb
        return 0.299 * r + 0.587 * g + 0.114 * b
    
    def pixel_to_ascii(self, brightness):
        """Convert brightness value to ASCII character"""
        # Map brightness (0-255) to character index
        char_index = int((brightness / 255) * (len(self.ascii_chars) - 1))
        return self.ascii_chars[char_index]
    
    def convert_image_to_ascii_data(self, image, scale_factor=1.0):
        """
        Convert image to ASCII character data with colors
        
        Args:
            image: PIL Image object
            scale_factor: Resize factor (1.0 = same size, 0.5 = half size)
            
        Returns:
            tuple: (ascii_array, color_array, width, height)
        """
        # Resize image if needed
        if scale_factor != 1.0:
            new_width = int(image.width * scale_factor)
            new_height = int(image.height * scale_factor)
            image = image.resize((new_width, new_height), Image.Resampling.LANCZOS)
        
        # Calculate ASCII grid dimensions
        ascii_width = image.width
        ascii_height = image.height
        
        # Convert image to RGB if needed
        if image.mode != 'RGB':
            image = image.convert('RGB')
        
        # Get pixel data
        pixels = np.array(image)
        
        # Create ASCII and color arrays
        ascii_array = []
        color_array = []
        
        for y in range(ascii_height):
            row_chars = []
            row_colors = []
            for x in range(ascii_width):
                # Get pixel color
                r, g, b = pixels[y, x]
                
                # Calculate brightness and get ASCII char
                brightness = self.get_brightness((r, g, b))
                char = self.pixel_to_ascii(brightness)
                
                row_chars.append(char)
                row_colors.append((r, g, b))
            
            ascii_array.append(row_chars)
            color_array.append(row_colors)
        
        return ascii_array, color_array, ascii_width, ascii_height
    
    def render_ascii_to_image(self, ascii_array, color_array, bg_color=(0, 0, 0)):
        """
        Render ASCII art to PNG image
        
        Args:
            ascii_array: 2D array of ASCII characters
            color_array: 2D array of RGB colors
            bg_color: Background color RGB tuple
            
        Returns:
            PIL Image object
        """
        height = len(ascii_array)
        width = len(ascii_array[0]) if height > 0 else 0
        
        # Create output image
        output_width = width * self.char_width
        output_height = height * self.char_height
        output_image = Image.new('RGB', (output_width, output_height), bg_color)
        draw = ImageDraw.Draw(output_image)
        
        # Draw each character
        for y in range(height):
            for x in range(width):
                char = ascii_array[y][x]
                color = color_array[y][x]
                
                # Position for this character
                char_x = x * self.char_width
                char_y = y * self.char_height
                
                # Draw character with color
                draw.text((char_x, char_y), char, fill=color, font=self.font)
        
        return output_image
    
    def save_as_text(self, ascii_array, color_array, output_path):
        """Save ASCII art as colored text file (ANSI colors)"""
        with open(output_path, 'w', encoding='utf-8') as f:
            for y, row in enumerate(ascii_array):
                for x, char in enumerate(row):
                    r, g, b = color_array[y][x]
                    # ANSI 24-bit color escape sequence
                    f.write(f'\033[38;2;{r};{g};{b}m{char}\033[0m')
                f.write('\n')
    
    def save_as_html(self, ascii_array, color_array, output_path, bg_color=(0, 0, 0)):
        """Save ASCII art as HTML file with inline styles"""
        with open(output_path, 'w', encoding='utf-8') as f:
            f.write('<!DOCTYPE html>\n<html>\n<head>\n')
            f.write('<meta charset="UTF-8">\n')
            f.write('<style>\n')
            f.write('body { margin: 0; padding: 20px; ')
            f.write(f'background-color: rgb{bg_color}; ')
            f.write('font-family: "Courier New", Courier, monospace; ')
            f.write('font-size: 12px; line-height: 1.0; ')
            f.write('white-space: pre; }\n')
            f.write('</style>\n</head>\n<body>\n')
            
            for y, row in enumerate(ascii_array):
                for x, char in enumerate(row):
                    r, g, b = color_array[y][x]
                    if char == ' ':
                        f.write(' ')
                    else:
                        f.write(f'<span style="color:rgb({r},{g},{b})">{char}</span>')
                f.write('\n')
            
            f.write('</body>\n</html>')
    
    def convert_image_file(self, input_path, output_path, scale_factor=1.0, 
                          output_format='png', bg_color=(0, 0, 0)):
        """
        Convert image file to ASCII art
        
        Args:
            input_path: Path to input image
            output_path: Path for output file
            scale_factor: Resize factor for ASCII grid
            output_format: 'png', 'text', or 'html'
            bg_color: Background color for image output
        """
        print(f"Loading image: {input_path}")
        image = Image.open(input_path)
        
        print(f"Original size: {image.width}x{image.height}")
        print("Converting to ASCII...")
        
        ascii_array, color_array, width, height = self.convert_image_to_ascii_data(
            image, scale_factor
        )
        
        print(f"ASCII grid size: {width}x{height} characters")
        
        if output_format == 'png':
            print("Rendering to PNG...")
            output_image = self.render_ascii_to_image(ascii_array, color_array, bg_color)
            output_image.save(output_path)
            print(f"Saved PNG: {output_path}")
            print(f"Output size: {output_image.width}x{output_image.height}")
            
        elif output_format == 'html':
            print("Saving as HTML...")
            self.save_as_html(ascii_array, color_array, output_path, bg_color)
            print(f"Saved HTML: {output_path}")
            
        elif output_format == 'text':
            print("Saving as text...")
            self.save_as_text(ascii_array, color_array, output_path)
            print(f"Saved text: {output_path}")


def main():
    parser = argparse.ArgumentParser(
        description='Convert images to high-resolution color-accurate ASCII art'
    )
    parser.add_argument('input', help='Input image file path')
    parser.add_argument('-o', '--output', help='Output file path (auto-determined if not specified)')
    parser.add_argument('-s', '--scale', type=float, default=1.0,
                       help='Scale factor for ASCII grid (default: 1.0)')
    parser.add_argument('-f', '--format', choices=['png', 'html', 'text'], default='png',
                       help='Output format (default: png)')
    parser.add_argument('--charset', choices=['detailed', 'simple', 'blocks'], default='detailed',
                       help='ASCII character set (default: detailed)')
    parser.add_argument('--char-width', type=int, default=8,
                       help='Character width in pixels for PNG output (default: 8)')
    parser.add_argument('--char-height', type=int, default=16,
                       help='Character height in pixels for PNG output (default: 16)')
    parser.add_argument('--font', help='Path to monospace TTF font file')
    parser.add_argument('--bg-color', default='0,0,0',
                       help='Background color as R,G,B (default: 0,0,0)')
    
    args = parser.parse_args()
    
    # Parse background color
    try:
        bg_r, bg_g, bg_b = map(int, args.bg_color.split(','))
        bg_color = (bg_r, bg_g, bg_b)
    except:
        print("Invalid background color format. Using black (0,0,0)")
        bg_color = (0, 0, 0)
    
    # Determine output path
    if args.output:
        output_path = args.output
    else:
        base_name = os.path.splitext(args.input)[0]
        ext = {'png': '.png', 'html': '.html', 'text': '.txt'}[args.format]
        output_path = f"{base_name}_ascii{ext}"
    
    # Create converter
    converter = ASCIIConverter(
        char_width=args.char_width,
        char_height=args.char_height,
        font_path=args.font,
        charset=args.charset
    )
    
    # Convert
    try:
        converter.convert_image_file(
            args.input,
            output_path,
            scale_factor=args.scale,
            output_format=args.format,
            bg_color=bg_color
        )
        print("\nConversion complete!")
    except Exception as e:
        print(f"\nError: {e}")
        import traceback
        traceback.print_exc()
        sys.exit(1)


if __name__ == '__main__':
    main()
