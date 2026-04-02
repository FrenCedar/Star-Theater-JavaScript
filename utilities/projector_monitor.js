/**
 * Digistar 7 Projector Monitoring System
 * 
 * Monitors projector responses after sending commands
 * Supports multiple communication methods:
 * - Digistar object attributes
 * - Serial communication
 * - Network (TCP/IP)
 */

// ==================== CONFIGURATION ====================

var CONFIG = {
    // Projector definitions
    projectors: [
        {
            name: "projector1",
            type: "digistar",  // digistar object, serial, or network
            objectName: "Projector1"
        },
        {
            name: "projector2",
            type: "serial",
            port: "COM3",
            baud: 9600,
            statusCommand: "PWR?\r",
            expectedResponse: "PWR=ON"
        },
        {
            name: "projector3",
            type: "network",
            ip: "192.168.1.100",
            port: 4352,
            statusCommand: "STATUS\r\n",
            expectedResponse: "OK"
        }
    ],
    
    // Timeout settings
    responseTimeout: 10.0,      // seconds to wait for projector response
    pollInterval: 0.5,          // seconds between status checks
    warmupTime: 3.0,           // seconds to wait after power on
    
    // Retry settings
    maxRetries: 3,
    retryDelay: 2.0
};

// ==================== MONITORING FUNCTIONS ====================

/**
 * Check Digistar object-based projector
 */
function checkDigistarProjector(projConfig) {
    if (Ds.GetObjectID(projConfig.objectName) === 0) {
        Ds.SendMessage(2, projConfig.name + ": Object not found");
        return false;
    }
    
    try {
        var status = Ds.GetObjectAttr(projConfig.objectName, "status");
        var power = Ds.GetObjectAttr(projConfig.objectName, "power");
        var online = Ds.GetObjectAttr(projConfig.objectName, "online");
        
        Ds.SendMessage(0, projConfig.name + ": status=" + status + ", power=" + power + ", online=" + online);
        
        // Check if projector is responding (adjust based on your attributes)
        return (status === true || status === "on" || power === true || online === true);
        
    } catch (error) {
        Ds.SendMessage(2, projConfig.name + ": Error reading attributes - " + error);
        return false;
    }
}

/**
 * Check serial-connected projector
 */
function checkSerialProjector(projConfig) {
    try {
        var serial = new Serial(
            projConfig.port,
            projConfig.baud || 9600,
            "N", 8, 1
        );
        
        if (!serial.isOpen()) {
            Ds.SendMessage(2, projConfig.name + ": Cannot open " + projConfig.port);
            return false;
        }
        
        // Send status query
        serial.write(projConfig.statusCommand);
        
        // Wait for response
        Ds.Sleep(0.5);
        
        // Read response
        var response = serial.read();
        serial.close();
        
        if (response && response.length > 0) {
            Ds.SendMessage(0, projConfig.name + ": Response = " + response);
            
            // Check if response matches expected
            if (projConfig.expectedResponse) {
                return response.indexOf(projConfig.expectedResponse) >= 0;
            }
            
            return true;  // Any response is good
        } else {
            Ds.SendMessage(2, projConfig.name + ": No response on " + projConfig.port);
            return false;
        }
        
    } catch (error) {
        Ds.SendMessage(2, projConfig.name + ": Serial error - " + error);
        return false;
    }
}

/**
 * Check network-connected projector
 */
function checkNetworkProjector(projConfig) {
    try {
        var socket = new Socket(projConfig.ip, projConfig.port, "TCP");
        
        if (!socket.connect()) {
            Ds.SendMessage(2, projConfig.name + ": Cannot connect to " + projConfig.ip + ":" + projConfig.port);
            return false;
        }
        
        // Send status query
        socket.send(projConfig.statusCommand);
        
        // Wait for response
        Ds.Sleep(0.5);
        
        // Read response
        var response = socket.read();
        socket.close();
        
        if (response && response.length > 0) {
            Ds.SendMessage(0, projConfig.name + ": Response = " + response);
            
            // Check if response matches expected
            if (projConfig.expectedResponse) {
                return response.indexOf(projConfig.expectedResponse) >= 0;
            }
            
            return true;
        } else {
            Ds.SendMessage(2, projConfig.name + ": No response from " + projConfig.ip);
            return false;
        }
        
    } catch (error) {
        Ds.SendMessage(2, projConfig.name + ": Network error - " + error);
        return false;
    }
}

/**
 * Check single projector based on type
 */
function checkProjector(projConfig) {
    Ds.SendMessage(0, "Checking " + projConfig.name + " (" + projConfig.type + ")...");
    
    switch (projConfig.type) {
        case "digistar":
            return checkDigistarProjector(projConfig);
        case "serial":
            return checkSerialProjector(projConfig);
        case "network":
            return checkNetworkProjector(projConfig);
        default:
            Ds.SendMessage(2, projConfig.name + ": Unknown type '" + projConfig.type + "'");
            return false;
    }
}

/**
 * Wait for projector to respond with timeout
 */
function waitForProjector(projConfig) {
    var startTime = new Date().getTime();
    var elapsed = 0;
    
    while (elapsed < CONFIG.responseTimeout) {
        if (checkProjector(projConfig)) {
            var responseTime = elapsed.toFixed(1);
            Ds.SendMessage(0, "✓ " + projConfig.name + " responded in " + responseTime + "s");
            return true;
        }
        
        Ds.Sleep(CONFIG.pollInterval);
        elapsed = (new Date().getTime() - startTime) / 1000;
    }
    
    Ds.SendMessage(2, "✗ " + projConfig.name + " timeout after " + CONFIG.responseTimeout + "s");
    return false;
}

/**
 * Check all projectors
 */
function checkAllProjectors() {
    var results = {
        total: CONFIG.projectors.length,
        responding: 0,
        failed: []
    };
    
    Ds.SendMessage(0, "Checking " + results.total + " projectors...");
    
    for (var i = 0; i < CONFIG.projectors.length; i++) {
        var proj = CONFIG.projectors[i];
        
        if (waitForProjector(proj)) {
            results.responding++;
        } else {
            results.failed.push(proj.name);
        }
    }
    
    return results;
}

// ==================== MAIN FUNCTIONS ====================

/**
 * Turn on projectors and verify response
 */
function turnOnProjectors() {
    try {
        Ds.SendMessage(0, "=".repeat(50));
        Ds.SendMessage(0, "TURNING ON PROJECTORS");
        Ds.SendMessage(0, "=".repeat(50));
        
        // Send power-on command
        Ds.SendStringCommand("projectors on");
        Ds.SendMessage(0, "Command sent: 'projectors on'");
        
        // Wait for warm-up
        Ds.SendMessage(0, "Waiting " + CONFIG.warmupTime + "s for warm-up...");
        Ds.Sleep(CONFIG.warmupTime);
        
        // Check all projectors
        var results = checkAllProjectors();
        
        // Report results
        Ds.SendMessage(0, "=".repeat(50));
        Ds.SendMessage(0, "RESULTS: " + results.responding + "/" + results.total + " responding");
        
        if (results.failed.length > 0) {
            Ds.SendMessage(2, "Failed projectors: " + results.failed.join(", "));
            
            // Retry failed projectors
            if (CONFIG.maxRetries > 0) {
                Ds.SendMessage(1, "Retrying failed projectors...");
                retryFailedProjectors(results.failed);
            }
        } else {
            Ds.SendMessage(0, "✓ All projectors online and responding!");
        }
        
        Ds.SendMessage(0, "=".repeat(50));
        
        return results.responding === results.total;
        
    } catch (error) {
        Ds.SendMessage(2, "Error in turnOnProjectors: " + error);
        return false;
    }
}

/**
 * Retry failed projectors
 */
function retryFailedProjectors(failedNames) {
    for (var retry = 0; retry < CONFIG.maxRetries; retry++) {
        Ds.SendMessage(0, "Retry attempt " + (retry + 1) + "/" + CONFIG.maxRetries);
        
        Ds.Sleep(CONFIG.retryDelay);
        
        var stillFailed = [];
        
        for (var i = 0; i < failedNames.length; i++) {
            var projName = failedNames[i];
            
            // Find projector config
            var projConfig = null;
            for (var j = 0; j < CONFIG.projectors.length; j++) {
                if (CONFIG.projectors[j].name === projName) {
                    projConfig = CONFIG.projectors[j];
                    break;
                }
            }
            
            if (projConfig) {
                if (!waitForProjector(projConfig)) {
                    stillFailed.push(projName);
                } else {
                    Ds.SendMessage(0, "✓ " + projName + " recovered!");
                }
            }
        }
        
        if (stillFailed.length === 0) {
            Ds.SendMessage(0, "✓ All projectors recovered!");
            return true;
        }
        
        failedNames = stillFailed;
    }
    
    Ds.SendMessage(2, "✗ " + failedNames.length + " projectors still not responding after retries");
    return false;
}

/**
 * Quick status check (doesn't send commands, just checks current state)
 */
function getProjectorStatus() {
    Ds.SendMessage(0, "Projector Status Check:");
    Ds.SendMessage(0, "-".repeat(50));
    
    for (var i = 0; i < CONFIG.projectors.length; i++) {
        var proj = CONFIG.projectors[i];
        var responding = checkProjector(proj);
        
        var status = responding ? "✓ ONLINE" : "✗ OFFLINE";
        Ds.SendMessage(0, proj.name.padEnd(15) + " : " + status);
    }
    
    Ds.SendMessage(0, "-".repeat(50));
}

// ==================== EXECUTE ====================

// Example usage:
// Turn on projectors and verify
var success = turnOnProjectors();

if (success) {
    Ds.SendMessage(0, "Ready to start show!");
} else {
    Ds.SendMessage(2, "Cannot proceed - projector issues detected");
}
