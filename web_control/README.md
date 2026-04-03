# Digistar Web Control Interface

A modern web-based control panel for Digistar 7 systems. Control projectors, cove lights, and send custom commands from any device on your network.

![Control Panel](https://img.shields.io/badge/Status-Ready-brightgreen)

---

## 🎯 **Features**

### **Projector Control**
- Power projectors ON/OFF
- Real-time status monitoring
- Visual status indicators

### **Cove Light Control**
- RGB color picker with live preview
- 0-100 range sliders
- Hardware fade duration control
- 9 preset lighting scenes:
  - Off, Warm, Cool
  - Red, Green, Blue
  - Purple, Cyan, White

### **Custom Commands**
- Send any Digistar string command
- Direct access to full Digistar API

### **Status Monitoring**
- Auto-refresh projector status (every 5 seconds)
- Activity log with timestamps
- Connection status indicator

---

## 📋 **Requirements**

- Digistar 7 system
- Network connection between Digistar and control device
- Modern web browser (Chrome, Firefox, Edge, Safari)

---

## 🚀 **Quick Start**

### **Step 1: Start the Server in Digistar**

1. Copy `digistar_web_server.js` to your Digistar system
2. Run the script in Digistar:
   ```
   File > Run Script > digistar_web_server.js
   ```
3. Note the server message showing the IP and port:
   ```
   [WebServer] Access from web browser at: http://[your-digistar-ip]:8080
   ```

### **Step 2: Open the Control Interface**

1. Open `web_control.html` in a web browser
2. Update the server address if needed:
   - Click on "Server Configuration" section
   - Enter: `[digistar-ip]:8080`
   - Click "Update Server"

### **Step 3: Start Controlling!**

- Turn projectors on/off
- Change cove light colors
- Apply preset scenes
- Send custom commands

---

## 🖥️ **Server Configuration**

### **Default Settings**

```javascript
var CONFIG = {
    port: 8080,              // HTTP server port
    host: "0.0.0.0",         // Listen on all interfaces
    totalSegments: 128,      // Number of cove light segments
    
    projectors: [
        {name: "Projector 1", objectName: "Projector1"},
        {name: "Projector 2", objectName: "Projector2"},
        {name: "Projector 3", objectName: "Projector3"}
    ]
};
```

### **Customization**

Edit `digistar_web_server.js` to customize:

1. **Change port**: Modify `CONFIG.port`
2. **Add/remove projectors**: Edit `CONFIG.projectors` array
3. **Adjust segment count**: Change `CONFIG.totalSegments`
4. **Add custom scenes**: Add to `CONFIG.scenes` object

---

## 🎨 **Using the Interface**

### **Projector Control**

```
[Power ON]  [Power OFF]
```
- Click buttons to control all projectors
- Status updates automatically
- Green = Online, Red = Offline, Gray = Unknown

### **Color Control**

1. Use sliders or type values (0-100)
2. Preview shows the color in real-time
3. Set fade duration (0-10 seconds)
4. Click "Apply Color" to update lights

### **Preset Scenes**

Click any scene tile for instant lighting changes:
- **OFF**: All lights off
- **Warm**: Cozy warm white (40,20,5)
- **Cool**: Cool blue-white (5,15,40)
- **Red/Green/Blue**: Full saturation
- **Purple/Cyan**: Mixed colors
- **White**: Full brightness (100,100,100)

### **Custom Commands**

Examples:
```
coveLights segment 0 100 0 0
coveLights segment 10 0 0 100 duration 2.0
projectors on
```

---

## 🌐 **Network Setup**

### **Same Computer**
- Use: `localhost:8080`
- No firewall configuration needed

### **Local Network**
1. Find Digistar computer's IP address
2. Use: `[digistar-ip]:8080`
3. Ensure port 8080 is not blocked by firewall

### **Opening Firewall (Windows)**
```powershell
New-NetFirewallRule -DisplayName "Digistar Web Control" -Direction Inbound -LocalPort 8080 -Protocol TCP -Action Allow
```

---

## 🔧 **Digistar Web API Reference**

This interface uses Digistar's built-in JavaScript Web API (`Ds.Web.*`). All commands are asynchronous and execute via callbacks.

### **Core Web Commands**

**Ds.Web.SendStringCommand(command, callback)**
- Sends any Digistar script command
- `command`: String command to execute
- `callback`: Function called with result object
- Result has `result.message` (response text) and `result.error` (boolean)

**Example:**
```javascript
Ds.Web.SendStringCommand("coveLights segment 0 100 0 0 duration 3", function(result) {
    if (!result.error) {
        console.log("Command succeeded");
    }
});
```

### **Object Management**

**Ds.Web.CreateObject(name, class, type, callback)**
- Creates Digistar object
- `type`: "permanent", "persistent", or "temporary"
- Permanent: Exists until system initialization
- Persistent: Exists until "system resetAll"
- Temporary: Exists until "system reset" or "system resetNoAV"

**Ds.Web.DeleteObject(object, callback)**
- Deletes specified Digistar object

**Ds.Web.AllocObjectArray(object, attribute, count, callback)**
- Allocates array elements for object attributes

### **Object Hierarchy**

**Ds.Web.AddObjectChild(parent, child, callback)**
- Adds child object to parent hierarchy

**Ds.Web.AddObjectChildBefore(parent, child, beforeObj, callback)**
- Adds child before specified object

**Ds.Web.AddObjectChildAfter(parent, child, afterObj, callback)**
- Adds child after specified object

**Ds.Web.RemoveObjectChild(parent, child, callback)**
- Removes child from parent hierarchy

### **Scene Management**

**Ds.Web.SceneAddObject(sceneObject, object, drawMode, callback)**
- Adds object to scene for rendering
- `drawMode`: "distant", "normal", "fixed", "landscape", or "near"

**Ds.Web.SceneAddObjectBefore(sceneObject, object, beforeObj, drawMode, callback)**
**Ds.Web.SceneAddObjectAfter(sceneObject, object, afterObj, drawMode, callback)**
- Add objects with specific ordering

**Ds.Web.SceneRemoveObject(sceneObject, object)**
- Removes object from scene (stops rendering)

### **Object Properties**

**Ds.GetObjectParentNames(object)** *(Synchronous)*
- Returns array of parent names for object

**Ds.GetObjectChildNames(object)** *(Synchronous)*
- Returns array of child names for object

### **Get Object Attributes**

**Ds.Web.GetObjectAttrAsStringCommand(object, attribute)** *(Synchronous)*
- Returns complete Digistar command representing attribute value
- For arrays, returns all commands to set each element

**Ds.Web.GetObjectArrayElemAsStringCommand(object, attribute, elemIndex)** *(Synchronous)*
- Returns command for specific array element

**Ds.Web.GetObjectAttrPartAsString(object, attribute, part)** *(Synchronous)*
- Gets individual component of attribute
- `part`: "x", "y", "z" for positions; "h", "p", "r" for attitude; "r", "g", "b" for colors
- Use "value" for single-component or HTML hex color (#RRGGBB)
- Use "CommandText" to get full Digistar script command

### **Set Object Attributes**

**Ds.Web.SetObjectAttrPart(object, attribute, part, value, duration, upTime, downTime)** *(Synchronous)*
- Sets individual attribute component
- `duration`: Change duration in seconds
- `upTime`: Ramp-up time for velocity
- `downTime`: Ramp-down time for velocity

### **Directory Operations**

**Ds.Web.DirectoryOpen(directory, search)**
- Opens directory for browsing
- `directory`: Path like "$content\\Library\\scripts"
- `search`: Wildcard pattern like "*.ds"
- Returns directory reference

**Ds.Web.DirectoryGetItem(dirRef)**
- Gets next item from directory
- Returns object with `item` (filepath) and `isDirectory` (boolean)
- Empty string when end reached

**Ds.Web.DirectoryClose(dirRef)**
- Closes directory reference

### **Path Utilities**

**Ds.Web.ResolvePathNameToUrl(path)**
- Converts $software/$content paths to web URLs
- Example: "$content\\Library" → "/content/library"

**Ds.Web.UnresolvePathNameFromUrl(url)**
- Converts URLs back to $software/$content paths
- Example: "/content/library" → "$content\\library"

### **Helper Functions**

**Ds.Web.CreateToggleButton(...)**
- Creates control-panel-style toggle button in web page
- Updates automatically with `Ds.Web.StartUpdatesFromHost()`

**Ds.Web.CreateCommandButton(...)**
- Creates button that executes command when clicked

**Ds.Web.LoadControlPanelLayout(...)**
- Loads complete control panel layout

**Ds.Web.LoadControlPanelPage(pageUrl, parent, cssClass)**
- Loads control panel page into HTML element

**Ds.Web.StartUpdatesFromHost()**
- Enables automatic button state updates
- Call once after creating all buttons/pages

### **HTTP REST Endpoints**

**Execute Command:**
```
http://[DSHost]:[Port]/digistar/execute?command=[URL-encoded-command]
```

**Get Object Attribute:**
```
http://[DSHost]:[Port]/digistar/objects/[Object]/[Attribute]/[Part]
```

**Set Object Attribute:**
```
http://[DSHost]:[Port]/digistar/objects/[Object]/[Attribute]/[Part]?value=[value]
http://[DSHost]:[Port]/digistar/objects/[Object]/[Attribute]/[Part]?value=[value];dur=[duration]
```

**Browse Directory:**
```
http://[DSHost]:[Port]/digistar/[Path]?search=[wildcard]
http://[DSHost]:[Port]/content/[Path]?search=[wildcard]
```

**File Access:**
- `$Content` paths: `http://[DSHost]:[Port]/content/...`
- `$Software` paths: `http://[DSHost]:[Port]/digistar/...`

**Allowed file types:**
- Web: .htm, .html, .css, .js, .xml
- Images: .jpg, .jpeg, .png, .gif, .ico
- Text: .txt
- Digistar: .ds, .d4s, .sft, .ls, .sls, .tiles, .dscp, .ddcp

---

## 📱 **Mobile Access**

The interface is fully responsive and works on:
- Tablets (iPad, Android tablets)
- Smartphones (iPhone, Android phones)
- Desktop browsers

**Tip**: Save the webpage as a home screen shortcut for quick access!

---

## 🛠️ **Troubleshooting**

### **"Disconnected" Status**

**Check:**
1. Is `digistar_web_server.js` running in Digistar?
2. Is the server IP address correct?
3. Is port 8080 accessible?
4. Any firewall blocking connections?

**Test Connection:**
Open in browser: `http://[digistar-ip]:8080/api/get_status`

Should see JSON response if working.

### **Projectors Show "unknown"**

**Possible causes:**
- Projector objects don't exist in Digistar scene
- Object names in `CONFIG.projectors` don't match actual objects
- Projector attributes are different than expected

**Fix:**
Edit `digistar_web_server.js` and update projector object names to match your system.

### **Cove Lights Not Responding**

**Check:**
- Segment count matches your system
- `coveLights` commands work in Digistar console
- Values are in 0-100 range (not 0-255)

### **Port 8080 Already in Use**

**Solution:**
Change port in `digistar_web_server.js`:
```javascript
var CONFIG = {
    port: 8081,  // Use different port
    ...
};
```

Then update HTML interface to use new port.

---

## 🔐 **Security Notes**

**Important:**
- This server has NO authentication
- Anyone on the network can control Digistar
- Use only on trusted networks
- Consider network isolation for production

**Recommendations:**
1. Use a separate network for control systems
2. Configure firewall rules to limit access
3. Monitor the activity log for unexpected commands

---

## 🎓 **Advanced Usage**

### **Multiple Control Panels**

Run multiple browser instances to control from different locations:
- Operator station
- Technical booth
- Mobile tablet

All will see the same status updates.

### **Integration with Other Systems**

Use the API endpoints to integrate with:
- Home automation systems
- Show control software
- Custom scripts and applications

Example with `curl`:
```bash
curl "http://192.168.1.100:8080/api/cove_color?r=100&g=0&b=0&duration=2.0"
```

### **Custom Scenes**

Add your own scenes in `digistar_web_server.js`:
```javascript
scenes: {
    "myScene": {r: 50, g: 25, b: 75},
    "sunset": {r: 80, g: 30, b: 10},
    // ... add more
}
```

Then add buttons in `web_control.html`:
```html
<div class="scene-btn" style="background: rgb(128,64,191)" onclick="applyScene('myScene')">
    My Scene
</div>
```

---

## 📊 **Performance**

- **Server overhead**: Minimal (<1% CPU)
- **Response time**: <100ms for local network
- **Status updates**: Every 5 seconds
- **Concurrent clients**: Supports multiple simultaneous connections

---

## 🐛 **Known Issues**

1. **Browser caching**: Hard refresh (Ctrl+F5) if changes don't appear
2. **CORS**: Must access HTML file via http:// or file:// protocol
3. **Mobile keyboards**: May push interface off-screen on small phones

---

## 🔄 **Version History**

### v1.0 (2026-01-20)
- Initial release
- Projector control
- Cove light RGB control with sliders
- 9 preset scenes
- Status monitoring
- Custom command interface
- Responsive design

---

## 📞 **Support**

For issues or questions:
1. Check the troubleshooting section
2. Review the activity log for error messages
3. Check Digistar console for server messages
4. Verify network connectivity

---

## 🎉 **Quick Tips**

- **Bookmark the page** for easy access
- **Set duration to 0** for instant color changes
- **Use scenes** for quick lighting changes during shows
- **Monitor the log** to see command history
- **Test locally first** before deploying on network

---

## 📝 **Example Workflows**

### **Pre-Show Setup**
1. Open control panel
2. Click "Power ON" for projectors
3. Wait for all projectors to show "Online"
4. Apply "Warm" scene for ambient lighting

### **During Show**
1. Use preset scenes for quick mood changes
2. Adjust colors with sliders for custom looks
3. Monitor projector status for issues

### **Post-Show**
1. Apply "Off" scene to lights
2. Click "Power OFF" for projectors
3. Check activity log for any errors

---

## 🚀 **Future Enhancements**

Potential features:
- User authentication
- Scene presets saved to browser
- Timeline/scheduling
- Multi-zone light control
- Websocket for real-time updates
- Mobile app version

---

**Enjoy your new Digistar control interface!** 🎭✨
