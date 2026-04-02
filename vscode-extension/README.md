# Digistar 7 Scripting Extension for VS Code

<p align="center">
  <strong>Complete language support for Digistar 7 JavaScript API</strong>
</p>

Write Digistar planetarium scripts with IntelliSense, snippets, syntax highlighting, and error detection!

---

## ✨ **Features**

### 🎯 **IntelliSense & Autocomplete**
- Full Digistar API function signatures
- Parameter hints and documentation
- Type definitions for all API calls
- Autocomplete for `Ds.` namespace

### 📝 **50+ Code Snippets**
- Common patterns and templates
- Object creation and manipulation
- Animation controllers
- File operations
- Cove light controls
- **Web API / Remote Control**
- HTML control interface templates
- Error handling

### 🎨 **Syntax Highlighting**
- Digistar-specific keywords
- API functions highlighted
- Coordinate modes and units
- Path variables (`$Content`, `$System`)

### ⚠️ **Error Detection**
- Warns about `os.` vs `Ds.` mistakes
- Detects degrees instead of radians
- Common API misuse warnings

---

## 🚀 **Installation**

### **Method 1: Install from VSIX (Recommended)**

1. **Package the extension:**
   ```bash
   cd vscode-extension
   npm install
   npm install -g @vscode/vsce
   vsce package
   ```
   This creates `digistar7-scripting-1.0.0.vsix`

2. **Install in VS Code:**
   - Open VS Code
   - Press `Ctrl+Shift+P` (or `Cmd+Shift+P` on Mac)
   - Type "Install from VSIX"
   - Select the `.vsix` file

### **Method 2: Development Mode**

1. **Clone/copy the extension folder:**
   ```bash
   cd vscode-extension
   npm install
   ```

2. **Open in VS Code:**
   ```bash
   code .
   ```

3. **Press F5** to launch Extension Development Host

---

## 📚 **Usage**

### **Using IntelliSense**

Just type `Ds.` and you'll see all available functions:

```javascript
Ds.SendMessage(0, "Hello Digistar!");
Ds.SetObjectAttr("mars", "intensity", 100);
```

### **Using Snippets**

Type a snippet prefix and press `Tab`:

| Prefix | Description | Output |
|--------|-------------|--------|
| `dsmsg` | Info message | `Ds.SendMessage(0, "message");` |
| `dssetctrl` | Set attr with animation | Full controller syntax |
| `dsobject` | Create & configure object | Complete object setup |
| `dscove` | Cove light segment | Hardware fade command |
| `dstemplate` | Full script template | Complete script structure |

**Example:**

1. Type `dstemplate`
2. Press `Tab`
3. Fill in the blanks!

```javascript
/**
 * My Script
 * Description here
 * 
 * Author: Your Name
 * Date: 2024-12-07
 */

// Configuration
const CONFIG = {
    option: value
};

// Main function
function main() {
    try {
        Ds.SendMessage(0, "Starting My Script...");
        
        // Your code here
        
        Ds.SendMessage(0, "My Script completed successfully");
    } catch (error) {
        Ds.SendMessage(2, `Error in My Script: ${error}`);
        Ds.SendMessage(2, `Stack: ${error.stack}`);
    }
}

// Execute
main();
```

---

## 📖 **Snippet Reference**

### **Messaging**
- `dsmsg` - Info message
- `dswarn` - Warning message
- `dserr` - Error message

### **Objects**
- `dscreate` - Create object
- `dsdelete` - Delete object
- `dsgetattr` - Get attribute
- `dssetattr` - Set attribute (instant)
- `dssetctrl` - Set attribute with controller
- `dsobject` - Create and configure object

### **Scene**
- `dsadd` - Add to scene
- `dsremove` - Remove from scene
- `dsdomepos` - Get dome position

### **Animation**
- `dsfadein` - Fade in animation
- `dsfadeout` - Fade out animation
- `dspulse` - Pulse loop
- `dsloop` - Animation loop with frame counter

### **Files**
- `dsread` - Read file
- `dswrite` - Write file
- `dsresolve` - Resolve path

### **Cove Lights**
- `dscove` - Set segment with hardware fade
- `dscoveall` - Set all segments
- `dscovefade` - Fade effect function

### **Web API (Remote Control)**
- `dswebcmd` - Send command with callback
- `dswebcmds` - Send command (simple, no callback)
- `dswebcreate` - Create object via Web API
- `dswebscene` - Add object to scene via Web API
- `dswebdir` - Browse directory via Web API
- `dswebget` - Get attribute as command string
- `dswebset` - Set attribute part with duration
- `dswebhtml` - HTML control panel template
- `dswebbtn` - Web control button function
- `dswebtoggle` - Create toggle button
- `dswebstart` - Start updates from host

### **Utilities**
- `dssleep` - Sleep/pause
- `dswait` - Wait without blocking
- `dsrad` - Convert degrees to radians
- `dsdeg` - Convert radians to degrees
- `dstry` - Try-catch with error logging
- `dstemplate` - Full script template

---

## 🎯 **API Quick Reference**

### **Core Functions**

```javascript
// Messaging
Ds.SendMessage(level, message)  // 0=Info, 1=Warning, 2=Error

// Timing
Ds.Sleep(seconds)  // Blocks Digistar
Ds.Wait(seconds)   // Non-blocking

// Objects
Ds.CreateObject(name, class, type)
Ds.DeleteObject(name)
Ds.GetObjectID(name)  // Returns 0 if not found

// Attributes
Ds.GetObjectAttr(object, attribute, mode?)
Ds.SetObjectAttr(object, attribute, value, controller?)

// Scene
Ds.SceneAddObject(object)
Ds.SceneRemoveObject(object)
Ds.GetObjPositionInDome(object)

// Files
Ds.FileRead(path)
Ds.FileWrite(path, lines)
Ds.ResolvePath(path)

// System
Ds.SystemCommand(command)
```

### **Animation Controllers**

```javascript
// Fade over time
Ds.SetObjectAttr("object", "intensity", 100, {
    time: 5.0,
    func: "EaseInOut"  // Linear, EaseIn, EaseOut, EaseInOut
});
```

### **Position Modes**

```javascript
// Cartesian
{x: 0, y: 0, z: 0, mode: "Cartesian", units: "meter"}

// Spherical (Az/El/Radius)
{x: 0, y: 0, z: 1.0, mode: "Spherical", units: "meter"}

// Celestial (RA/Dec/Distance) - IN RADIANS!
{x: 1.5*Math.PI, y: 0.5, z: 10, mode: "Celestial", units: "AU"}
```

### **Cove Lights**

```javascript
// Set segment with hardware fade
Ds.SendStringCommand(`coveLights segment 0 255 0 0 duration 2.0`);

// All segments
for (let seg = 0; seg < 128; seg++) {
    Ds.SendStringCommand(`coveLights segment ${seg} 255 0 0 duration 2.0`);
}
```

---

## ⚠️ **Common Mistakes (Auto-Detected)**

### **1. Using `os.` instead of `Ds.`**

❌ **Wrong:**
```javascript
os.SendMessage(0, "Hello");  // ERROR!
os.Sleep(2.0);               // ERROR!
```

✅ **Correct:**
```javascript
Ds.SendMessage(0, "Hello");
Ds.Sleep(2.0);
```

The extension will show an **error** if you use `os.` for Digistar functions.

### **2. Using Degrees Instead of Radians**

❌ **Wrong:**
```javascript
{x: 45, y: 30, z: 1.0, mode: "Spherical"}  // WARNING!
```

✅ **Correct:**
```javascript
{
    x: 45 * Math.PI / 180,  // Convert to radians
    y: 30 * Math.PI / 180,
    z: 1.0,
    mode: "Spherical"
}
```

The extension will show a **warning** for suspiciously large angle values.

---

## 🎨 **File Types**

The extension recognizes these file extensions as Digistar scripts:
- `.ds.js` - Digistar JavaScript (recommended)
- `.digistar.js` - Alternative
- `.js` - Regular JavaScript (Digistar snippets still work)

**Recommendation:** Use `.ds.js` for Digistar-specific scripts to get full language support.

---

## 📂 **Project Setup**

### **Add Type Definitions to Your Project**

Copy the type definitions to enable IntelliSense in any Digistar project:

1. **Copy typings file:**
   ```bash
   cp vscode-extension/typings/digistar.d.ts your-project/
   ```

2. **Reference in your scripts:**
   ```javascript
   /// <reference path="./digistar.d.ts" />
   
   // Now you have full IntelliSense!
   Ds.SendMessage(0, "Hello!");
   ```

---

## 🛠️ **Development**

### **Building from Source**

```bash
# Install dependencies
cd vscode-extension
npm install

# Compile TypeScript
npm run compile

# Watch mode (auto-recompile)
npm run watch

# Package extension
vsce package
```

### **Testing**

1. Open `vscode-extension` folder in VS Code
2. Press `F5` to launch Extension Development Host
3. Test features in the new window

---

## 🔧 **Configuration**

Add to your `.vscode/settings.json`:

```json
{
    "files.associations": {
        "*.ds.js": "digistar-js",
        "*.digistar.js": "digistar-js"
    },
    "editor.quickSuggestions": {
        "other": true,
        "comments": false,
        "strings": true
    }
}
```

---

## 📋 **Keyboard Shortcuts**

- `Ctrl+Space` - Trigger IntelliSense
- `Ctrl+Shift+Space` - Parameter hints
- Type snippet prefix + `Tab` - Expand snippet
- `F12` - Go to definition (for your functions)
- `Ctrl+K Ctrl+I` - Show hover documentation

---

## 💡 **Tips & Best Practices**

### **1. Use Snippets for Speed**
Instead of typing full function signatures, use snippets:
- `dsmsg` → `Ds.SendMessage(0, "");`
- `dssetctrl` → Full controller syntax

### **2. Enable Auto-Save**
Add to settings.json:
```json
{
    "files.autoSave": "afterDelay",
    "files.autoSaveDelay": 1000
}
```

### **3. Use Type Definitions**
Include `digistar.d.ts` in your project for full IntelliSense support.

### **4. Organize with Regions**
```javascript
// #region Configuration
const CONFIG = { ... };
// #endregion

// #region Helper Functions
function helper() { ... }
// #endregion
```

### **5. Always Use Hardware Fades**
```javascript
// Use duration parameter for smooth hardware fades
Ds.SendStringCommand(`coveLights segment 0 255 0 0 duration 2.0`);
```

---

## 📦 **What's Included**

```
vscode-extension/
├── package.json                    # Extension manifest
├── tsconfig.json                   # TypeScript config
├── language-configuration.json     # Language settings
├── README.md                       # This file
├── src/
│   └── extension.ts               # Main extension code
├── typings/
│   └── digistar.d.ts              # Type definitions
├── snippets/
│   └── digistar-snippets.json     # 40+ code snippets
└── syntaxes/
    └── digistar-js.tmLanguage.json # Syntax highlighting
```

---

## 🐛 **Known Issues**

1. **TypeScript errors before npm install** - Run `npm install` to resolve
2. **IntelliSense not showing** - Make sure file is recognized as JavaScript
3. **Snippets not appearing** - Check language mode in status bar

---

## 🤝 **Contributing**

Want to add more snippets or improve the extension?

1. Edit `snippets/digistar-snippets.json` for new snippets
2. Edit `typings/digistar.d.ts` for API additions
3. Edit `src/extension.ts` for new features
4. Test with `F5` in VS Code
5. Submit your changes!

---

## 📄 **License**

MIT License - Feel free to use and modify!

---

## 🎓 **Learning Resources**

- **Digistar 7 Complete Reference:** `docs/DIGISTAR7_COMPLETE_REFERENCE.md`
- **Digistar 7 Quick Reference:** `docs/DIGISTAR7_QUICK_REFERENCE.md`
- **Example Scripts:** `examples/` folder
- **Cove Lighting Guide:** `cinematic_modes/` folder

---

## 🌟 **Features in Action**

### **IntelliSense**
Type `Ds.` and see all functions with documentation

### **Snippets**
Type `dstemplate` + Tab for instant script scaffolding

### **Error Detection**
Automatic warnings for common mistakes

### **Syntax Highlighting**
Digistar keywords and API calls beautifully colored

---

## 📞 **Support**

Having issues? Check:
1. Extension is installed: Check Extensions panel
2. File type is correct: Look at status bar (should say "JavaScript" or "Digistar JavaScript")
3. Dependencies installed: Run `npm install` in extension folder

---

**Happy Scripting! 🚀**

Transform your Digistar development workflow with professional tooling! ✨
