/**
 * Digistar Web Control Server
 * 
 * HTTP server that accepts commands from web interface and executes them in Digistar.
 * Also provides status information back to the web interface.
 * 
 * Usage:
 * 1. Run this script in Digistar
 * 2. Open web_control.html in a browser on the same network
 * 3. Control Digistar from the web interface
 */

// ==================== CONFIGURATION ====================

var CONFIG = {
    port: 8080,
    host: "0.0.0.0",  // Listen on all interfaces
    pollInterval: 0.1,  // Check for requests every 100ms
    totalSegments: 128,
    
    // Projector configuration
    projectors: [
        {name: "Projector 1", objectName: "Projector1"},
        {name: "Projector 2", objectName: "Projector2"}
    ],
    
    // Predefined lighting scenes
    scenes: {
        "off": {r: 0, g: 0, b: 0},
        "warm": {r: 40, g: 20, b: 5},
        "cool": {r: 5, g: 15, b: 40},
        "red": {r: 100, g: 0, b: 0},
        "green": {r: 0, g: 100, b: 0},
        "blue": {r: 0, g: 0, b: 100},
        "purple": {r: 60, g: 0, b: 60},
        "cyan": {r: 0, g: 60, b: 60},
        "white": {r: 100, g: 100, b: 100}
    }
};

var serverRunning = false;
var serverSocket = null;

// ==================== UTILITY FUNCTIONS ====================

function log(message) {
    Ds.SendMessage(0, "[WebServer] " + message);
}

function logError(message) {
    Ds.SendMessage(2, "[WebServer] ERROR: " + message);
}

// ==================== COVE LIGHT FUNCTIONS ====================

function setAllCoveLights(r, g, b, duration) {
    duration = duration || 0;
    for (var i = 0; i < CONFIG.totalSegments; i++) {
        if (duration > 0) {
            Ds.SendStringCommand("coveLights segment " + i + " " + r + " " + g + " " + b + " duration " + duration);
        } else {
            Ds.SendStringCommand("coveLights segment " + i + " " + r + " " + g + " " + b);
        }
    }
}

function setCoveLightRange(start, end, r, g, b, duration) {
    duration = duration || 0;
    for (var i = start; i <= end; i++) {
        if (duration > 0) {
            Ds.SendStringCommand("coveLights segment " + i + " " + r + " " + g + " " + b + " duration " + duration);
        } else {
            Ds.SendStringCommand("coveLights segment " + i + " " + r + " " + g + " " + b);
        }
    }
}

// ==================== PROJECTOR FUNCTIONS ====================

function getProjectorStatus() {
    var status = [];
    
    for (var i = 0; i < CONFIG.projectors.length; i++) {
        var proj = CONFIG.projectors[i];
        var state = "unknown";
        
        if (Ds.GetObjectID(proj.objectName) !== 0) {
            try {
                var power = Ds.GetObjectAttr(proj.objectName, "power");
                var online = Ds.GetObjectAttr(proj.objectName, "online");
                
                if (power === true || online === true) {
                    state = "online";
                } else {
                    state = "offline";
                }
            } catch (e) {
                state = "error";
            }
        } else {
            state = "not_found";
        }
        
        status.push({
            name: proj.name,
            state: state
        });
    }
    
    return status;
}

// ==================== COMMAND HANDLERS ====================

function handleCommand(command, params) {
    log("Command: " + command + " | Params: " + JSON.stringify(params));
    
    try {
        switch (command) {
            case "projectors_on":
                Ds.SendStringCommand("projectors on");
                return {success: true, message: "Projectors turning on"};
            
            case "projectors_off":
                Ds.SendStringCommand("projectors off");
                return {success: true, message: "Projectors turning off"};
            
            case "cove_color":
                var r = parseInt(params.r) || 0;
                var g = parseInt(params.g) || 0;
                var b = parseInt(params.b) || 0;
                var duration = parseFloat(params.duration) || 1.0;
                setAllCoveLights(r, g, b, duration);
                return {success: true, message: "Cove lights set to RGB(" + r + "," + g + "," + b + ")"};
            
            case "cove_scene":
                var sceneName = params.scene;
                if (CONFIG.scenes[sceneName]) {
                    var scene = CONFIG.scenes[sceneName];
                    var duration = parseFloat(params.duration) || 1.0;
                    setAllCoveLights(scene.r, scene.g, scene.b, duration);
                    return {success: true, message: "Scene '" + sceneName + "' activated"};
                } else {
                    return {success: false, message: "Unknown scene: " + sceneName};
                }
            
            case "cove_range":
                var start = parseInt(params.start) || 0;
                var end = parseInt(params.end) || 0;
                var r = parseInt(params.r) || 0;
                var g = parseInt(params.g) || 0;
                var b = parseInt(params.b) || 0;
                var duration = parseFloat(params.duration) || 0.5;
                setCoveLightRange(start, end, r, g, b, duration);
                return {success: true, message: "Segments " + start + "-" + end + " updated"};
            
            case "get_status":
                var projStatus = getProjectorStatus();
                return {
                    success: true,
                    projectors: projStatus,
                    server: "online",
                    timestamp: new Date().toISOString()
                };
            
            case "send_command":
                var cmd = params.command;
                if (cmd) {
                    Ds.SendStringCommand(cmd);
                    return {success: true, message: "Command sent: " + cmd};
                } else {
                    return {success: false, message: "No command specified"};
                }
            
            default:
                return {success: false, message: "Unknown command: " + command};
        }
    } catch (error) {
        logError("Command handler error: " + error);
        return {success: false, message: "Error: " + error};
    }
}

// ==================== HTTP SERVER ====================

function parseHTTPRequest(request) {
    var lines = request.split("\r\n");
    var firstLine = lines[0];
    var parts = firstLine.split(" ");
    
    var method = parts[0];
    var path = parts[1];
    var queryString = "";
    
    if (path.indexOf("?") >= 0) {
        var pathParts = path.split("?");
        path = pathParts[0];
        queryString = pathParts[1];
    }
    
    var params = {};
    if (queryString) {
        var pairs = queryString.split("&");
        for (var i = 0; i < pairs.length; i++) {
            var pair = pairs[i].split("=");
            if (pair.length === 2) {
                params[decodeURIComponent(pair[0])] = decodeURIComponent(pair[1]);
            }
        }
    }
    
    return {
        method: method,
        path: path,
        params: params,
        raw: request
    };
}

function buildHTTPResponse(statusCode, contentType, body) {
    var statusText = statusCode === 200 ? "OK" : "Error";
    
    var response = "HTTP/1.1 " + statusCode + " " + statusText + "\r\n";
    response += "Content-Type: " + contentType + "\r\n";
    response += "Content-Length: " + body.length + "\r\n";
    response += "Access-Control-Allow-Origin: *\r\n";
    response += "Access-Control-Allow-Methods: GET, POST, OPTIONS\r\n";
    response += "Access-Control-Allow-Headers: Content-Type\r\n";
    response += "Connection: close\r\n";
    response += "\r\n";
    response += body;
    
    return response;
}

function handleHTTPRequest(request) {
    var parsed = parseHTTPRequest(request);
    
    // Handle CORS preflight
    if (parsed.method === "OPTIONS") {
        return buildHTTPResponse(200, "text/plain", "OK");
    }
    
    // API endpoint
    if (parsed.path.indexOf("/api/") === 0) {
        var command = parsed.path.substring(5);  // Remove "/api/"
        var result = handleCommand(command, parsed.params);
        var jsonResponse = JSON.stringify(result);
        return buildHTTPResponse(200, "application/json", jsonResponse);
    }
    
    // Default response
    return buildHTTPResponse(404, "text/plain", "Not Found");
}

function startServer() {
    try {
        log("Starting web server on port " + CONFIG.port + "...");
        
        serverSocket = new Socket(CONFIG.host, CONFIG.port, "TCP");
        
        if (!serverSocket.listen()) {
            logError("Failed to start listening on port " + CONFIG.port);
            return false;
        }
        
        serverRunning = true;
        log("Web server started successfully");
        log("Access from web browser at: http://[your-digistar-ip]:" + CONFIG.port);
        
        return true;
        
    } catch (error) {
        logError("Failed to start server: " + error);
        return false;
    }
}

function serverLoop() {
    while (serverRunning) {
        try {
            // Check for incoming connection
            var request = serverSocket.read();
            
            if (request && request.length > 0) {
                log("Request received (" + request.length + " bytes)");
                
                // Process request and build response
                var response = handleHTTPRequest(request);
                
                // Send response
                serverSocket.send(response);
                
                log("Response sent");
            }
            
            // Sleep to prevent CPU spinning
            Ds.Sleep(CONFIG.pollInterval);
            
        } catch (error) {
            logError("Server loop error: " + error);
            Ds.Sleep(1.0);
        }
    }
}

function stopServer() {
    log("Stopping web server...");
    serverRunning = false;
    
    if (serverSocket) {
        try {
            serverSocket.close();
        } catch (e) {
            // Ignore close errors
        }
    }
    
    log("Web server stopped");
}

// ==================== MAIN ====================

function main() {
    log("========================================");
    log("Digistar Web Control Server");
    log("========================================");
    log("");
    
    if (startServer()) {
        log("");
        log("Server is running. Press STOP in Digistar to shut down.");
        log("");
        
        serverLoop();
    } else {
        logError("Failed to start server");
    }
    
    stopServer();
}

// Start the server
main();
