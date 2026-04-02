# Digistar 7 Web Control Interface - Setup Guide

Complete guide for deploying the web-based control interface using Digistar's built-in web server.

---

## 🎯 **Overview**

Digistar 7 includes a **built-in web server** that runs automatically when the Digistar Host is active. This eliminates the need for custom server scripts - just copy the HTML file to the right location and enable the web interface.

---

## 📋 **Prerequisites**

1. Digistar 7 system with Host running
2. Network connection to Digistar computer
3. Modern web browser (Chrome, Firefox, Edge, Safari)
4. Administrative access to Digistar configuration

---

## ⚙️ **Step 1: Enable Web Interface**

The web interface is controlled by two system attributes in Digistar:

### **Enable Web Server**
```
system web on
```
This enables the entire web server (file serving + command interface).

### **Enable Command Interface**
```
system webInterface on
```
This specifically enables the command layer that processes JavaScript commands.

**Both must be ON for the control interface to work.**

---

## 🔧 **Step 2: Configure Port (Optional)**

By default, Digistar's web server uses **Port 80**.

### **To Change Port:**

1. Navigate to: `$Software/site/NetConfig.xml`
2. Locate the `<HTTPPort>` field
3. Change value (e.g., `<HTTPPort>8080</HTTPPort>`)
4. Restart Digistar Host

**Note:** If you change the port, append it to the URL:
- Default: `http://[digistar-ip]/`
- Custom: `http://[digistar-ip]:8080/`

---

## 📁 **Step 3: Deploy HTML File**

The web server only serves files from specific directories:
- `$Content` directory
- `$Software` directory

### **Recommended Deployment Location:**

Copy `digistar_control.html` to:
```
$Content/web_control/digistar_control.html
```

### **Access URL:**
```
http://[digistar-ip]/content/web_control/digistar_control.html
```

**Path Translation:**
- `$Content` → `/content/` in URL
- `$Software` → `/software/` in URL

---

## 🌐 **Step 4: Access the Interface**

### **From Same Computer:**
```
http://localhost/content/web_control/digistar_control.html
```

### **From Network:**
1. Find Digistar computer's IP address
2. Open browser on any device
3. Navigate to:
   ```
   http://[digistar-ip]/content/web_control/digistar_control.html
   ```

---

## 🛡️ **Step 5: Firewall Configuration (Windows)**

If accessing from another computer, ensure the firewall allows HTTP traffic:

### **PowerShell (Run as Administrator):**
```powershell
New-NetFirewallRule -DisplayName "Digistar Web Server" -Direction Inbound -LocalPort 80 -Protocol TCP -Action Allow
```

For custom port (e.g., 8080):
```powershell
New-NetFirewallRule -DisplayName "Digistar Web Server" -Direction Inbound -LocalPort 8080 -Protocol TCP -Action Allow
```

---

## ✅ **Verification**

### **Test 1: Web Server Active**
Navigate to:
```
http://[digistar-ip]/
```
Should see a Digistar welcome page or file directory.

### **Test 2: DigistarWeb.js Loads**
Navigate to:
```
http://[digistar-ip]/digistar/DigistarWeb.js
```
Should download or display the JavaScript API file.

### **Test 3: Control Interface**
Navigate to your deployed HTML file.
Should see the control panel interface load.

---

## 🎛️ **Using the Interface**

### **Projector Control**
- **Power ON**: Sends `projectors on` command
- **Power OFF**: Sends `projectors off` command

### **Cove Light Control**
1. Adjust RGB sliders (0-100 range)
2. Set fade duration (0-10 seconds)
3. Click "Apply Color to All Segments"

**Segment Range:**
- Set start/end segment numbers
- Apply color to specific range only

### **Preset Scenes**
Click any scene tile for instant lighting:
- OFF, Warm, Cool
- Red, Green, Blue
- Purple, Cyan, White

### **Custom Commands**
Enter any valid Digistar command:
```
system info
coveLights segment 0 100 0 0
system resetNoAV
```

---

## 🔍 **Troubleshooting**

### **Problem: Page Won't Load**

**Check:**
1. Is `system web on`?
   ```
   system web on
   ```
2. Is Digistar Host running?
3. Is firewall blocking port 80?
4. Is file in `$Content` or `$Software` directory?

**Test:**
```
http://[digistar-ip]/
```
If this fails, web server is not active.

---

### **Problem: Commands Don't Execute**

**Check:**
1. Is `system webInterface on`?
   ```
   system webInterface on
   ```
2. Open browser console (F12) - any JavaScript errors?
3. Is DigistarWeb.js loading?

**Test in Browser Console:**
```javascript
Ds.Web.SendStringCommand("system info", function(result) {
    console.log(result);
});
```

---

### **Problem: "Failed to Load DigistarWeb.js"**

**Cause:** Browser can't find `/digistar/DigistarWeb.js`

**Solutions:**
1. Verify web server is running
2. Check URL is correct (include port if changed)
3. Clear browser cache (Ctrl+F5)
4. Verify network connectivity

---

### **Problem: CORS Errors**

**Cause:** Opening HTML file directly (file://) instead of through web server

**Solution:**
- **Don't** open file directly from disk
- **Do** access via HTTP URL from Digistar web server
  ```
  http://[digistar-ip]/content/web_control/digistar_control.html
  ```

---

### **Problem: Commands Execute Slowly**

**Cause:** Sending too many commands at once

**Solution:**
The interface sends 128 commands when changing all segments. This is normal. Each command is asynchronous and executes as fast as Digistar can process them.

---

## 🔐 **Security Considerations**

### **⚠️ WARNING: No Authentication**

The Digistar web interface has **NO built-in authentication**. Anyone with network access can:
- Control projectors
- Change cove lights
- Execute Digistar commands

### **Recommendations:**

1. **Network Isolation**
   - Use separate network for control systems
   - Don't expose to public internet

2. **Firewall Rules**
   - Limit access to specific IP addresses
   - Use Windows Firewall advanced rules

3. **Physical Security**
   - Control room access restrictions
   - Operator training on security

---

## 📱 **Mobile Access**

The interface is fully responsive and works on:
- iPads and Android tablets
- iPhones and Android phones
- Desktop browsers

### **Save to Home Screen (iOS):**
1. Open in Safari
2. Tap Share button
3. "Add to Home Screen"
4. Icon appears like native app

### **Save to Home Screen (Android):**
1. Open in Chrome
2. Tap menu (⋮)
3. "Add to Home screen"
4. Icon appears in app drawer

---

## 🚀 **Advanced Configuration**

### **Multiple Control Panels**

Deploy multiple HTML files for different purposes:
```
$Content/web_control/operator_panel.html
$Content/web_control/tech_panel.html
$Content/web_control/mobile_panel.html
```

### **Custom Scenes**

Edit the HTML file to add custom scenes:
```javascript
<div class="scene-btn" style="background: rgb(128,64,191)" 
     onclick="applyScene(50,25,75)">
    Custom Scene
</div>
```

### **Custom Segment Zones**

Add preset zone buttons:
```javascript
function setFrontZone() {
    // Segments 32-96 (front of dome)
    setSpecificRange(32, 96, 100, 50, 0);
}
```

---

## 📊 **Performance Notes**

- **Server Overhead:** Minimal (<1% CPU)
- **Response Time:** <100ms for local network
- **Concurrent Users:** Multiple browsers can connect simultaneously
- **Command Queue:** Commands execute asynchronously

---

## 🐛 **Known Limitations**

1. **No Status Polling:** Interface doesn't automatically query projector status
   - Add custom polling if needed using `Ds.Web.GetObjectAttrAsStringCommand()`

2. **No Feedback for Individual Segments:** Changing all 128 segments shows minimal feedback
   - This is normal - check activity log for errors

3. **Browser Compatibility:** Requires modern browser with ES6 support
   - IE11 not supported

---

## 📚 **API Reference**

The interface uses these Digistar Web API calls:

### **Ds.Web.SendStringCommand(command, callback)**
Sends any Digistar command.

**Example:**
```javascript
Ds.Web.SendStringCommand("projectors on", function(result) {
    if (result.error) {
        console.log("Error: " + result.message);
    } else {
        console.log("Success: " + result.message);
    }
});
```

### **Other Available APIs:**
- `Ds.Web.SetObjectAttrPart()` - Set object attributes
- `Ds.Web.GetObjectAttrAsStringCommand()` - Get object state
- `Ds.Web.SceneAddObject()` - Add objects to scene
- `Ds.Web.DirectoryOpen()` - Browse file system

See Digistar 7 documentation for complete API reference.

---

## 🎓 **Example Workflows**

### **Pre-Show Setup:**
1. Open control panel on tablet
2. Click "Power ON" for projectors
3. Apply "Warm" scene for house lights
4. Wait for projectors to warm up
5. Start show from Digistar console

### **During Show:**
1. Use preset scenes for mood lighting
2. Adjust individual segments for effects
3. Monitor activity log for errors

### **Post-Show:**
1. Apply "OFF" scene
2. Click "Power OFF" for projectors
3. Review activity log

---

## 🔄 **Updates and Maintenance**

### **Updating the Interface:**
1. Edit `digistar_control.html`
2. Save changes
3. Refresh browser (Ctrl+F5 to clear cache)

### **Backup Configuration:**
Keep backup of:
- `digistar_control.html`
- `NetConfig.xml` (if port changed)
- Custom scene configurations

---

## 📞 **Support Checklist**

Before requesting support:

- [ ] `system web on` confirmed
- [ ] `system webInterface on` confirmed
- [ ] File in `$Content` or `$Software` directory
- [ ] Accessing via HTTP (not file://)
- [ ] Firewall allows port 80 (or custom port)
- [ ] Browser console checked for errors (F12)
- [ ] DigistarWeb.js loads successfully
- [ ] Other web pages on Digistar server load

---

## ✨ **Tips & Tricks**

1. **Bookmark the URL** for quick access
2. **Set duration to 0** for instant color changes
3. **Use segment ranges** for zone-specific effects
4. **Test commands** in custom command box first
5. **Monitor activity log** for debugging
6. **Save custom scenes** by editing HTML
7. **Use mobile in portrait** for better layout

---

**Ready to deploy!** Follow the steps above and you'll have a fully functional web control interface for your Digistar system. 🎭✨
