/**
 * ASCII Solar System
 * Creates a realistic solar system visualization using ASCII art textures
 * 
 * REQUIREMENTS:
 * - ASCII planet textures in $Content\User\Textures\ASCII_Planets\
 * - Generate textures using ascii_converter_gui.py
 * 
 * USAGE:
 * js.play $Content\User\Scripts\ascii_solar_system.js
 */

// ============================================
// CONFIGURATION
// ============================================

var CONFIG = {
    // Path to ASCII texture directory
    texturePath: "$Content\\User\\Textures\\ASCII_Planets\\",
    
    // Scale factor for distances (1 AU = astronomical units)
    // Note: Real scale would be too large, so we compress it
    distanceScale: 20,  // 1 AU = 20 units in dome space
    
    // Scale factor for planet sizes (relative to Earth)
    sizeScale: 3,       // Multiplier for visual sizes
    
    // Rotation speeds (degrees per second)
    rotationSpeed: 10,
    
    // Orbit visualization
    showOrbits: true,
    orbitColor: [30, 30, 30]  // RGB
};

// ============================================
// PLANET DATA (Realistic values)
// ============================================

var PLANETS = {
    Sun: {
        texture: "ascii_sun.png",
        distance: 0,           // AU from center
        radius: 109,           // Relative to Earth (Earth = 1)
        color: [100, 90, 50],  // RGB color tint
        rotation: 2,           // Degrees per second
        glow: true
    },
    Mercury: {
        texture: "ascii_mercury.png",
        distance: 0.39,
        radius: 0.38,
        color: [80, 80, 80],
        rotation: 1.5
    },
    Venus: {
        texture: "ascii_venus.png",
        distance: 0.72,
        radius: 0.95,
        color: [100, 95, 70],
        rotation: -0.4  // Retrograde rotation
    },
    Earth: {
        texture: "ascii_earth.png",
        distance: 1.0,
        radius: 1.0,
        color: [70, 90, 100],
        rotation: 15
    },
    Mars: {
        texture: "ascii_mars.png",
        distance: 1.52,
        radius: 0.53,
        color: [100, 60, 40],
        rotation: 14.5
    },
    Jupiter: {
        texture: "ascii_jupiter.png",
        distance: 5.2,
        radius: 11.2,
        color: [100, 85, 60],
        rotation: 35.5
    },
    Saturn: {
        texture: "ascii_saturn.png",
        distance: 9.54,
        radius: 9.45,
        color: [100, 90, 70],
        rotation: 36
    },
    Uranus: {
        texture: "ascii_uranus.png",
        distance: 19.2,
        radius: 4.0,
        color: [60, 90, 100],
        rotation: -14  // Retrograde rotation
    },
    Neptune: {
        texture: "ascii_neptune.png",
        distance: 30.1,
        radius: 3.88,
        color: [50, 70, 100],
        rotation: 16
    }
};

// ============================================
// INITIALIZATION
// ============================================

Ds.SendMessageStatus("=== ASCII Solar System Initialization ===");

// Clean up any existing solar system
try {
    Ds.SendStringCommand("delete solarSystemScene");
    Ds.SendStringCommand("delete asciiSolarSystem");
} catch(e) {
    // Objects don't exist yet, that's fine
}

Ds.SendMessageStatus("Creating solar system scene...");

// Create main scene
Ds.CreateObject("asciiSolarSystem", "sceneClass", "temporary");

// Create camera for the scene
Ds.CreateObject("asciiCamera", "cameraClass", "temporary");
Ds.AddObjectChild("asciiSolarSystem", "asciiCamera");
Ds.AddObjectChild("dome", "asciiCamera");

// Position camera for good view
Ds.SetObjectAttr("asciiCamera", "position", [0, 50, -100]);
Ds.SetObjectAttr("asciiCamera", "attitude", [0, -20, 0]);

// ============================================
// CREATE PLANETS
// ============================================

Ds.SendMessageStatus("Creating celestial bodies...");

var planetObjects = {};

for (var planetName in PLANETS) {
    var planet = PLANETS[planetName];
    var objName = "ascii" + planetName;
    
    Ds.SendMessageStatus("Creating " + planetName + "...");
    
    // Create sphere model
    Ds.CreateObject(objName, "solidModelClass", "temporary");
    Ds.SetObjectAttr(objName, "model", "$Software\\Models\\Primitives\\sphere.x");
    
    // Apply ASCII texture
    var texturePath = CONFIG.texturePath + planet.texture;
    Ds.SetObjectAttr(objName, "modelTexture", texturePath);
    
    // Set color tint
    Ds.SetObjectAttr(objName, "color", planet.color);
    
    // Calculate size
    var visualSize = planet.radius * CONFIG.sizeScale;
    if (planetName === "Sun") {
        visualSize = 15;  // Special case: Sun needs to be visible but not dominate
    }
    Ds.SetObjectAttr(objName, "scale", [visualSize, visualSize, visualSize]);
    
    // Calculate position (convert AU to dome units)
    var distance = planet.distance * CONFIG.distanceScale;
    var angle = Math.random() * 360;  // Random starting angle
    var x = distance * Math.cos(angle * Math.PI / 180);
    var z = distance * Math.sin(angle * Math.PI / 180);
    
    Ds.SetObjectAttr(objName, "position", [x, 0, z]);
    
    // Set rotation
    Ds.SetObjectAttr(objName, "attitude", [0, 0, 0]);
    Ds.SetObjectAttr(objName, "attitudeRate", [0, planet.rotation, 0]);
    
    // Add to scene
    Ds.SendStringCommand("asciiSolarSystem add " + objName + " fixed");
    
    // Set initial intensity to 0 for fade-in
    Ds.SetObjectAttr(objName, "intensity", 0);
    
    // Add glow for Sun
    if (planet.glow) {
        Ds.SetObjectAttr(objName, "lit", false);  // Self-illuminated
    }
    
    planetObjects[planetName] = objName;
    
    // Create orbit ring if enabled (skip Sun)
    if (CONFIG.showOrbits && planetName !== "Sun" && distance > 0) {
        var orbitName = objName + "Orbit";
        Ds.CreateObject(orbitName, "circleClass", "temporary");
        Ds.SetObjectAttr(orbitName, "radius", distance);
        Ds.SetObjectAttr(orbitName, "color", CONFIG.orbitColor);
        Ds.SetObjectAttr(orbitName, "position", [0, -0.5, 0]);
        Ds.SetObjectAttr(orbitName, "attitude", [90, 0, 0]);  // Horizontal
        Ds.SetObjectAttr(orbitName, "intensity", 0);
        Ds.SendStringCommand("asciiSolarSystem add " + orbitName + " fixed");
    }
}

// ============================================
// ANIMATION SEQUENCE
// ============================================

Ds.SendMessageStatus("Starting fade-in sequence...");

// Fade in Sun
Ds.SetObjectAttr("asciiSun", "intensity", 100, 3);
Ds.Wait(2);

// Fade in inner planets
var innerPlanets = ["Mercury", "Venus", "Earth", "Mars"];
for (var i = 0; i < innerPlanets.length; i++) {
    var pName = innerPlanets[i];
    var objName = "ascii" + pName;
    Ds.SetObjectAttr(objName, "intensity", 100, 2);
    
    if (CONFIG.showOrbits) {
        Ds.SetObjectAttr(objName + "Orbit", "intensity", 50, 2);
    }
}
Ds.Wait(2);

// Fade in outer planets
var outerPlanets = ["Jupiter", "Saturn", "Uranus", "Neptune"];
for (var i = 0; i < outerPlanets.length; i++) {
    var pName = outerPlanets[i];
    var objName = "ascii" + pName;
    Ds.SetObjectAttr(objName, "intensity", 100, 3);
    
    if (CONFIG.showOrbits) {
        Ds.SetObjectAttr(objName + "Orbit", "intensity", 50, 3);
    }
}
Ds.Wait(3);

Ds.SendMessageStatus("ASCII Solar System is now active!");
Ds.SendMessageStatus("To clean up: js.stop ascii_solar_system");

// ============================================
// HELPER FUNCTIONS
// ============================================

/**
 * Clean up function - call this to remove the solar system
 */
function cleanup() {
    Ds.SendMessageStatus("Cleaning up ASCII Solar System...");
    
    // Fade out all objects
    for (var planetName in PLANETS) {
        var objName = "ascii" + planetName;
        Ds.SetObjectAttr(objName, "intensity", 0, 2);
        
        if (CONFIG.showOrbits && planetName !== "Sun") {
            Ds.SetObjectAttr(objName + "Orbit", "intensity", 0, 2);
        }
    }
    
    Ds.Wait(3);
    
    // Delete scene (this deletes all child objects automatically)
    Ds.SendStringCommand("delete asciiSolarSystem");
    Ds.SendStringCommand("delete asciiCamera");
    
    Ds.SendMessageStatus("Cleanup complete!");
}

// Keep script running to maintain rotations
// (Script will stay active until manually stopped)
Ds.Wait(3600);  // Wait 1 hour, then auto-cleanup
cleanup();
