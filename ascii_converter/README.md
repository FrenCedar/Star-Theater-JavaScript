# High-Resolution Image to ASCII Art Converter

Converts images to color-accurate ASCII art textures for use in Digistar 7.

## Features

- **High-resolution output**: Maintains image detail with per-pixel ASCII conversion
- **Color-accurate**: Preserves RGB colors from original image
- **Multiple output formats**:
  - PNG images (for Digistar textures)
  - HTML files (for preview/web display)
  - Text files with ANSI colors
- **Multiple character sets**:
  - Detailed (70 characters for maximum detail)
  - Simple (10 characters for cleaner look)
  - Blocks (Unicode block characters)
- **Customizable rendering**: Adjust character size, font, background color

## Installation

### Requirements

```bash
pip install Pillow numpy
```

## Usage

### Basic Usage

Convert an image to ASCII PNG:
```bash
python image_to_ascii.py input.jpg
```

This creates `input_ascii.png` with default settings.

### Advanced Options

**Custom output path:**
```bash
python image_to_ascii.py input.jpg -o output_ascii.png
```

**Scale the ASCII grid (smaller = faster, larger file size):**
```bash
python image_to_ascii.py input.jpg --scale 0.5
```
- `--scale 1.0`: Full resolution (1 ASCII char per pixel)
- `--scale 0.5`: Half resolution (good for very large images)
- `--scale 2.0`: Double resolution (not recommended for normal images)

**Output formats:**
```bash
# PNG image (for Digistar)
python image_to_ascii.py input.jpg -f png

# HTML file (for preview in browser)
python image_to_ascii.py input.jpg -f html

# Text file with ANSI colors (for terminal display)
python image_to_ascii.py input.jpg -f text
```

**Character sets:**
```bash
# Detailed (70 chars - maximum detail)
python image_to_ascii.py input.jpg --charset detailed

# Simple (10 chars - cleaner look)
python image_to_ascii.py input.jpg --charset simple

# Blocks (Unicode block chars - solid look)
python image_to_ascii.py input.jpg --charset blocks
```

**Custom character size (PNG output only):**
```bash
python image_to_ascii.py input.jpg --char-width 10 --char-height 20
```
- Larger values = bigger output image
- Recommended: 8x16 or 10x20 for sharp text

**Custom font (PNG output only):**
```bash
python image_to_ascii.py input.jpg --font "C:\Windows\Fonts\consola.ttf"
```
- Use monospace fonts only (Consolas, Courier New, etc.)

**Background color:**
```bash
python image_to_ascii.py input.jpg --bg-color 0,0,0     # Black
python image_to_ascii.py input.jpg --bg-color 255,255,255  # White
```

## Examples for Digistar Planets

### Sun Texture (2048x2048)
```bash
python image_to_ascii.py sun_texture.jpg -o ascii_sun.png --scale 0.5 --charset blocks --bg-color 0,0,0
```

### Earth Texture (4096x2048)
```bash
python image_to_ascii.py earth_texture.jpg -o ascii_earth.png --scale 0.5 --charset detailed --bg-color 0,0,0
```

### Jupiter Texture (High detail)
```bash
python image_to_ascii.py jupiter_texture.jpg -o ascii_jupiter.png --scale 0.3 --charset detailed --char-width 6 --char-height 12
```

### Mars Texture
```bash
python image_to_ascii.py mars_texture.jpg -o ascii_mars.png --scale 0.5 --charset simple --bg-color 10,0,0
```

## Performance Tips

1. **For very large images (>4K)**: Use `--scale 0.3` to `--scale 0.5`
2. **For planet textures**: Aim for 2048x1024 or 2048x2048 output
3. **Character size**: 8x16 gives good balance of detail and file size
4. **Preview first**: Generate HTML output to preview before creating large PNGs

## Workflow for Digistar

1. **Find/create planet texture** (NASA, space agencies, texture sites)
2. **Convert to ASCII**:
   ```bash
   python image_to_ascii.py earth.jpg -o ascii_earth.png --scale 0.5 --charset detailed
   ```
3. **Copy to Digistar content folder**:
   ```
   $Content\User\Textures\ASCII_Planets\ascii_earth.png
   ```
4. **Apply in Digistar script**:
   ```javascript
   Earth modelTexture $Content\User\Textures\ASCII_Planets\ascii_earth.png
   ```

## Character Set Reference

### Detailed (70 characters)
` .'^\`^\",:;Il!i><~+_-?][}{1)(|\\/tfjrxnuvczXYUJCLQ0OZmwqpdbkhao*#MW&8%B@$`
- Best for: Maximum detail, complex images
- Pros: Highest quality
- Cons: Can look busy

### Simple (10 characters)
` .:-=+*#%@`
- Best for: Clean, minimalist look
- Pros: Easy to read from distance
- Cons: Less detail

### Blocks (5 characters)
` ░▒▓█`
- Best for: Solid, "8-bit" aesthetic
- Pros: Bold, retro look
- Cons: Least detail

## Troubleshooting

**"PIL not found"**
```bash
pip install Pillow
```

**Font warnings**
- Install a monospace TTF font and specify with `--font`
- Or ignore - default font works but may look less sharp

**Output too large**
- Reduce `--scale` factor
- Reduce `--char-width` and `--char-height`

**Colors look wrong**
- Ensure input image is RGB
- Try different character sets
- Adjust background color

## Tips for Best Results

1. **High contrast images work best** - increase contrast before conversion
2. **Monochrome source images** can be tinted in Digistar using `color` attribute
3. **Test different character sets** - each gives different aesthetic
4. **Preview with HTML** before generating large PNGs
5. **Use power-of-2 dimensions** for Digistar textures (1024, 2048, 4096)
