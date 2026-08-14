# Digistar JavaScript Project

This project contains JavaScript scripts and tools for the Digistar 7 planetarium system at MSU Space Science Center.

## Overview

This repository provides scripts for controlling cove lighting, managing shows, and interfacing with the Digistar 7 system through local JavaScript execution.

## New Here? Start With This Path

The folders are numbered in the order a first-time learner should go through them:

1. **Read `docs/00_START_HERE.md`** - core concepts, execution model, script anatomy
2. **Open `01_learn/`** - run these example scripts in order (01 → 04) to see cove lighting in action
3. **Read `docs/01_lighting_guide.md`** - the full lighting API (zones, fades, presets, animations)
4. **Use `02_library/lighting_control_v2.js`** - drop this into a real show instead of copy-pasting functions
5. **Copy `03_templates/show_template.js`** - starting point for your own show
6. **Browse `04_utilities/`** - diagnostic/exploration scripts, use as needed (not required reading)
7. **Reference `docs/reference/`** whenever you need exact API details

## Project Structure

```
digistar_js_project/
├── docs/                   Documentation, read 00_START_HERE.md first
├── 01_learn/               Example scripts, run in numeric order
├── 02_library/             Main lighting control library
├── 03_templates/           Template files for creating new shows
├── 04_utilities/           Diagnostic and utility scripts
└── vscode-extension/       VS Code extension for Digistar scripting
```

### Core Directories

**02_library/** - Main lighting control library
- `lighting_control_v2.js` - Complete lighting functions and effects

**01_learn/** - Example scripts for testing and reference, in learning order
- `01_simple_test.js` - Basic RGB color test
- `02_fade_demo.js` - Fade effect demonstration
- `03_preshow_ambiance.js` - Pre-show ambient lighting
- `04_lights_off.js` - Smooth fade to off

**03_templates/** - Starting templates for new projects
- `show_template.js` - Base template for creating show scripts

**04_utilities/** - Tools for diagnostics and system exploration
- `segment_diagnostic.js` - Test individual cove light segments
- `api_discovery.js` - Discover available Digistar 7 API functions
- `constellation_finder.js` - Calculate visible constellations
- `constellation_finder_improved.js` - Enhanced constellation calculator
- `Segment.js` - Legacy segment control reference

**vscode-extension/** - VS Code extension with IntelliSense and snippets
- Complete Digistar 7 API type definitions
- 50+ code snippets for Digistar scripting
- Syntax highlighting and error detection
- Packaged extension ready for installation

## Documentation

Documentation is organized into the following categories under `docs/`:

**00_START_HERE.md** - Script development guide, workflow, and file usage patterns (read this first)

**01_lighting_guide.md** - Complete lighting control guide and fade effects

**reference/** - API and system references
- `DIGISTAR7_COMPLETE_REFERENCE.md` - Comprehensive Digistar 7 scripting guide
- `DIGISTAR7_QUICK_REFERENCE.md` - Quick reference card (covers the general object-scripting API, see note below)
- `API_CORRECTIONS.md` - Important API usage corrections
- `digistar_manual.txt` - Official Digistar manual

**dev-notes/** - Development notes and technical details
- `README.md` - Segment configuration, constellation finder improvements, and fade implementation

### Two Different APIs - Don't Mix Them Up

This project uses **two separate Digistar 7 APIs** that are easy to confuse:

| | Cove Lighting API | General Object API |
|---|---|---|
| Used for | `coveLights segment` commands | Any scene object (`eye`, lights, etc.) |
| Command | `Ds.SendStringCommand("coveLights segment ...")` | `Ds.SetObjectAttr(object, attr, value)` |
| RGB range | **0-100** | **0-255** |
| Documented in | `docs/01_lighting_guide.md` | `docs/reference/DIGISTAR7_QUICK_REFERENCE.md` |

Everything in `01_learn/`, `02_library/`, and `03_templates/` uses the **Cove Lighting API (0-100 RGB)**. The Quick Reference card documents the separate, general-purpose object API used for camera/eye position, generic object attributes, etc.

## Fade Effects

The Digistar `coveLights segment` command includes a `duration` parameter for smooth color transitions:

```javascript
Ds.SendStringCommand("coveLights segment 0 100 0 0 duration 3");
```

This approach is efficient and provides smooth fading with minimal command overhead (128 commands per fade). All current scripts utilize the duration parameter for optimal performance.

Refer to `docs/lighting/README.md` for implementation details.

## Digistar 7 API Reference

### Core Functions

```javascript
Ds.SendMessageStatus(message)        // Output status messages
Ds.SendMessageError(error)           // Output error messages
Ds.FileWrite(path, mode, content)    // Write to files
Ds.SendStringCommand(command)        // Send Digistar 7 script commands
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
