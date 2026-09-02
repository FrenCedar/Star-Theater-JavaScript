// Digistar 7 API Discovery Script
// Run this in Digistar 7 to discover available functions and write to output.txt

var output = "";

function addLine(text) {
    output += text + "\n";
}

addLine("=== DIGISTAR 7 JAVASCRIPT API DISCOVERY ===");
addLine("");

// 1. Check for timing functions in global scope
addLine("--- Checking for timing functions ---");
var timingFunctions = ["wait", "sleep", "delay", "pause", "setTimeout", "setInterval"];
timingFunctions.forEach(function(funcName) {
    // Try different ways to access global scope
    var funcType = "undefined";
    try {
        funcType = typeof eval(funcName);
    } catch(e) {
        funcType = "not accessible";
    }
    addLine(funcName + ": " + funcType);
});
addLine("");

// 2. List all Ds object methods
addLine("--- Ds object methods ---");
try {
    var dsMethods = Object.getOwnPropertyNames(Ds);
    addLine("Found " + dsMethods.length + " methods:");
    dsMethods.forEach(function(method, index) {
        addLine((index + 1) + ". " + method + " (type: " + typeof Ds[method] + ")");
    });
} catch (e) {
    addLine("ERROR: Could not list Ds methods: " + e.message);
}
addLine("");

// 3. List all global properties
addLine("--- Global properties (first 100) ---");
try {
    // Try 'this' in global context or just skip if not available
    var globals = [];
    try {
        globals = Object.getOwnPropertyNames(this);
    } catch(e) {
        addLine("Could not enumerate global properties (no global object access)");
        globals = [];
    }
    
    if (globals.length > 0) {
        addLine("Total global properties: " + globals.length);
        for (var i = 0; i < Math.min(100, globals.length); i++) {
            addLine((i + 1) + ". " + globals[i]);
        }
        if (globals.length > 100) {
            addLine("... and " + (globals.length - 100) + " more");
        }
    } else {
        addLine("Testing common global objects directly:");
        var commonGlobals = ["Object", "Array", "String", "Number", "Boolean", "Date", "Math", "JSON", "console"];
        commonGlobals.forEach(function(name) {
            try {
                addLine(name + ": " + typeof eval(name));
            } catch(e) {
                addLine(name + ": not available");
            }
        });
    }
} catch (e) {
    addLine("ERROR: Could not list globals: " + e.message);
}
addLine("");

// 4. Check for Promise support
addLine("--- Async capabilities ---");
try {
    var promiseType = typeof eval("Promise");
    addLine("Promise: " + promiseType);
    addLine("async/await: " + (promiseType !== 'undefined' ? "possibly supported" : "not supported"));
} catch(e) {
    addLine("Promise: not available");
    addLine("async/await: not supported");
}
addLine("");

// 5. Check Date and Math availability
addLine("--- Standard JavaScript objects ---");
var stdObjects = ["Date", "Math", "Array", "Object", "JSON", "String", "Number", "Boolean"];
stdObjects.forEach(function(name) {
    try {
        addLine(name + ": " + typeof eval(name));
    } catch(e) {
        addLine(name + ": not available");
    }
});
addLine("");

addLine("=== DISCOVERY COMPLETE ===");

// Write everything to output.txt
try {
    Ds.FileWrite("output.txt", "w", output);
    Ds.SendMessageStatus("API discovery complete! Results written to output.txt");
    Ds.SendMessageStatus("Total lines written: " + output.split("\n").length);
} catch (e) {
    Ds.SendMessageError("Error writing to file: " + e.message);
    // If file write fails, output to console
    Ds.SendMessageStatus(output);
}
