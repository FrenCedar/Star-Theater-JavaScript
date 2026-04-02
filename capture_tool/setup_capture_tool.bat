@echo off
echo ========================================
echo Digistar Guide Capture Tool - Setup
echo ========================================
echo.

echo Installing required Python packages...
echo.

pip install pyautogui pillow

echo.
echo ========================================
echo Installation Complete!
echo ========================================
echo.
echo To start capturing:
echo   GUI Version (RECOMMENDED): start_capture_gui.bat
echo   OR: python capture_gui.py
echo.
echo Press any key to exit...
pause > nul
