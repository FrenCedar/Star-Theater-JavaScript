# 🚀 Quick Installation Guide - Digistar 7 VS Code Extension

Get up and running with Digistar 7 scripting in VS Code in under 5 minutes!

---

## 📋 **Prerequisites**

- **VS Code** installed (download from https://code.visualstudio.com/)
- **Node.js** (optional, only needed to build from source)

---

## ⚡ **Quick Install (3 Steps)**

### **Step 1: Package the Extension**

Open PowerShell/Terminal in the `vscode-extension` folder:

```powershell
cd C:\Users\Nathan\CascadeProjects\digistar_js_project\vscode-extension

# Install dependencies
npm install

# Install packaging tool
npm install -g @vscode/vsce

# Package the extension
vsce package
```

This creates `digistar7-scripting-1.0.0.vsix`

### **Step 2: Install in VS Code**

1. Open VS Code
2. Press `Ctrl+Shift+P` (Windows) or `Cmd+Shift+P` (Mac)
3. Type: **"Extensions: Install from VSIX"**
4. Select `digistar7-scripting-1.0.0.vsix`
5. Click **"Reload"** when prompted

### **Step 3: Verify Installation**

1. Create a new file: `test.ds.js`
2. Type: `Ds.`
3. You should see IntelliSense with Digistar functions! ✨

---

## 🎯 **Verify It's Working**

### **Test 1: IntelliSense**
```javascript
Ds.  // <- Type this and wait for suggestions
```
You should see: SendMessage, Sleep, Wait, CreateObject, etc.

### **Test 2: Snippets**
```javascript
dsmsg  // <- Type this and press Tab
```
Should expand to: `Ds.SendMessage(0, "message");`

### **Test 3: Error Detection**
```javascript
os.SendMessage(0, "test");  // <- Should show ERROR
```
Extension should underline this and suggest using `Ds.` instead.

---

## 🛠️ **Troubleshooting**

### **Extension Not Showing Up?**

Check Extensions panel:
1. Press `Ctrl+Shift+X`
2. Search for "Digistar"
3. Should see "Digistar 7 Scripting"

### **IntelliSense Not Working?**

1. Check file extension is `.js` or `.ds.js`
2. Look at bottom-right status bar - should say "JavaScript"
3. Try reloading VS Code: `Ctrl+R`

### **Snippets Not Appearing?**

1. Start typing a prefix (e.g., `dsmsg`)
2. Wait a moment for suggestions
3. Press `Tab` to expand
4. If still not working, check language mode in status bar

### **npm install Fails?**

Make sure Node.js is installed:
```powershell
node --version  # Should show v16.x or higher
npm --version   # Should show v8.x or higher
```

Download from: https://nodejs.org/

### **vsce Command Not Found?**

Install globally:
```powershell
npm install -g @vscode/vsce
```

---

## 📦 **Alternative: Development Mode**

Skip packaging and run in development mode:

1. **Open extension folder in VS Code:**
   ```powershell
   cd vscode-extension
   code .
   ```

2. **Install dependencies:**
   ```powershell
   npm install
   ```

3. **Press F5** - Opens new VS Code window with extension loaded

4. **Test in the new window** - Create a `.ds.js` file and try it out!

---

## 🎨 **Recommended VS Code Settings**

Add to your `.vscode/settings.json`:

```json
{
  "files.associations": {
    "*.ds.js": "javascript",
    "*.digistar.js": "javascript"
  },
  "editor.quickSuggestions": {
    "other": true,
    "comments": false,
    "strings": true
  },
  "editor.suggest.snippetsPreventQuickSuggestions": false,
  "files.autoSave": "afterDelay"
}
```

---

## 📚 **Next Steps**

1. **Try the snippets** - Type `dstemplate` for a full script structure
2. **Read the docs** - Check `docs/DIGISTAR7_COMPLETE_REFERENCE.md`
3. **Copy type definitions** - Copy `typings/digistar.d.ts` to your projects
4. **Start coding!** - Create your first Digistar 7 script

---

## 🎓 **Learning Path**

### **Beginner**
1. Create a file: `hello.ds.js`
2. Use snippet: `dstemplate` + Tab
3. Fill in the blanks
4. Run in Digistar 7!

### **Intermediate**
1. Use `dsobject` snippet to create objects
2. Try `dsfadein` for animations
3. Experiment with `dscove` for lights
4. Check examples in `examples/` folder

### **Advanced**
1. Reference `digistar.d.ts` in your projects
2. Create custom snippets
3. Build complex shows with full IntelliSense
4. Share your scripts!

---

## 📞 **Support**

### **Common Issues**

| Problem | Solution |
|---------|----------|
| No IntelliSense | Check file is `.js` or `.ds.js` |
| Snippets don't work | Type full prefix + Tab |
| Extension not found | Reinstall from VSIX |
| TypeScript errors | Run `npm install` |
| vsce not found | Run `npm install -g @vscode/vsce` |

### **Still Having Issues?**

1. Reload VS Code: `Ctrl+R`
2. Restart VS Code completely
3. Check Output panel: `View > Output > Digistar 7 Scripting`
4. Reinstall extension

---

## 🌟 **Quick Tips**

- **Use `.ds.js` extension** for Digistar scripts
- **Type prefix + Tab** to expand snippets
- **Press Ctrl+Space** to manually trigger IntelliSense
- **Hover over functions** to see documentation
- **Enable auto-save** for convenience

---

## 🎉 **You're Ready!**

Start writing Digistar 7 scripts with professional tooling:

✅ IntelliSense autocomplete  
✅ 40+ code snippets  
✅ Syntax highlighting  
✅ Error detection  
✅ Type definitions  

**Happy scripting!** 🚀✨

---

## 📋 **Installation Checklist**

- [ ] Node.js installed
- [ ] VS Code installed
- [ ] Ran `npm install` in extension folder
- [ ] Installed `@vscode/vsce` globally
- [ ] Ran `vsce package`
- [ ] Installed VSIX in VS Code
- [ ] Reloaded VS Code
- [ ] Created test `.ds.js` file
- [ ] Tested IntelliSense (type `Ds.`)
- [ ] Tested snippet (type `dsmsg` + Tab)
- [ ] Ready to code! 🎯
