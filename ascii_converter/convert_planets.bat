@echo off
REM Batch script to convert planet textures to ASCII art
REM Place your planet texture images in the "input" folder
REM ASCII versions will be created in the "output" folder

echo ========================================
echo Planet Texture to ASCII Converter
echo ========================================
echo.

REM Create directories if they don't exist
if not exist "input" mkdir input
if not exist "output" mkdir output

echo Looking for images in input folder...
echo.

REM Check if Python is available
python --version >nul 2>&1
if errorlevel 1 (
    echo ERROR: Python not found. Please install Python 3.x
    pause
    exit /b 1
)

REM Check if PIL is installed
python -c "import PIL" >nul 2>&1
if errorlevel 1 (
    echo ERROR: Pillow (PIL) not installed
    echo Installing Pillow...
    pip install Pillow numpy
    echo.
)

REM Process all images in input folder
for %%f in (input\*.jpg input\*.png input\*.bmp) do (
    echo Converting: %%~nxf
    python image_to_ascii.py "%%f" -o "output\%%~nf_ascii.png" --scale 0.5 --charset detailed --char-width 8 --char-height 16
    echo.
)

echo ========================================
echo Conversion complete!
echo ASCII textures are in the "output" folder
echo ========================================
echo.
echo Copy these files to:
echo $Content\User\Textures\ASCII_Planets\
echo.
pause
