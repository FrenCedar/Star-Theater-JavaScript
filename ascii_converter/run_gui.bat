@echo off
REM Launch ASCII Converter GUI

echo Starting ASCII Art Converter GUI...
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
    echo Installing required packages...
    pip install Pillow numpy
    echo.
)

REM Run the GUI
python ascii_converter_gui.py

pause
