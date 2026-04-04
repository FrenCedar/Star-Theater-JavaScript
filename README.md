# Digistar JavaScript Project

This project contains JavaScript scripts and tools for the Digistar 7 planetarium system at MSU Space Science Center.

## Overview

This repository provides scripts for controlling cove lighting, managing shows, and interfacing with the Digistar system through local JavaScript execution.

## Project Structure

```
digistar_js_project/
├── core_lighting/          Main lighting control library
├── examples/               Example scripts demonstrating basic functionality
├── templates/              Template files for creating new shows
├── utilities/              Diagnostic and utility scripts
├── docs/                   Documentation organized by category
├── vscode-extension/       VS Code extension for Digistar scripting
├── ascii_converter/        ASCII art texture converter for planets
└── capture_tool/           Screenshot capture utility
```

### Core Directories

**core_lighting/** - Lighting control library using hardware-accelerated fading
- `lighting_control_v2.js` - Main lighting control library

**examples/** - Example scripts for testing and reference
- `simple_test.js` - Basic RGB color test
- `fade_demo.js` - Hardware fade demonstration
- `preshow_ambiance.js` - Pre-show ambient lighting
- `lights_off.js` - Smooth fade to off

**templates/** - Starting templates for new projects
- `show_template.js` - Base template for creating show scripts

**utilities/** - Tools for diagnostics and system exploration
- `segment_diagnostic.js` - Test individual cove light segments
- `api_discovery.js` - Discover available Digistar API functions
- `constellation_finder.js` - Calculate visible constellations
- `constellation_finder_improved.js` - Enhanced constellation calculator
- `projector_monitor.js` - Monitor projector status
- `Segment.js` - Legacy segment control reference

**vscode-extension/** - VS Code extension with IntelliSense and snippets
- Complete Digistar 7 API type definitions
- 50+ code snippets for Digistar scripting
- Syntax highlighting and error detection
- Packaged extension ready for installation

**ascii_converter/** - ASCII art texture converter
- `ascii_converter_gui.py` - GUI application for converting images to ASCII art
- `image_to_ascii.py` - Command-line conversion tool
- Creates color-accurate ASCII textures for Digistar planets
- Supports Braille characters, multiple character sets, and block rendering modes

**capture_tool/** - Screenshot capture utility
- `start_capture_gui.bat` - Launch GUI application
- `capture_gui.py` - GUI-based screenshot capture
- `build_show.py` - Build tool for assembling show scripts

## Documentation

Documentation is organized into the following categories under `docs/`:

**reference/** - API and system references
- `DIGISTAR7_COMPLETE_REFERENCE.md` - Comprehensive Digistar 7 scripting guide
- `DIGISTAR7_QUICK_REFERENCE.md` - Quick reference card
- `API_CORRECTIONS.md` - Important API usage corrections
- `digistar_manual.txt` - Official Digistar manual

**guides/** - Development guides and workflows
- `README.md` - Script development guide, workflow, and file usage patterns

**lighting/** - Lighting system documentation
- `README.md` - Complete lighting control guide including hardware fades

**capture/** - Screenshot tool documentation
- `README.md` - Complete capture tool guide (GUI and hotkey versions)

**dev-notes/** - Development notes and technical details
- `README.md` - Segment configuration, constellation finder improvements, hardware fade notes
- `CONSTELLATION_FINDER_IMPROVEMENTS.md` - Detailed constellation finder comparison

## Hardware-Accelerated Fading

The Digistar `coveLights segment` command includes a native `duration` parameter that enables hardware-accelerated smooth fading:

```javascript
Ds.SendStringCommand("coveLights segment 0 100 0 0 duration 3");
```

This approach reduces command overhead by 99.5% compared to software-based fading implementations (128 commands vs 25,600). All current scripts utilize this hardware fade capability for optimal performance.

Refer to `docs/lighting/README.md` for implementation details.

## Digistar API Reference

### Core Functions

```javascript
Ds.SendMessageStatus(message)        // Output status messages
Ds.SendMessageError(error)           // Output error messages
Ds.FileWrite(path, mode, content)    // Write to files
Ds.SendStringCommand(command)        // Send Digistar script commands
Ds.Wait(seconds)                     // Pause execution (seconds, not milliseconds)
Ds.Sleep(seconds)                    // Alternative pause function (seconds)
```

### Important Notes

**Timing Parameters:** All timing functions (`Ds.Wait`, `Ds.Sleep`) use seconds, not milliseconds.

```javascript
Ds.Wait(2);      // Waits 2 seconds
Ds.Wait(0.5);    // Waits 0.5 seconds
Ds.Wait(60);     // Waits 1 minute
```

Refer to `docs/reference/API_CORRECTIONS.md` for complete API usage details.
