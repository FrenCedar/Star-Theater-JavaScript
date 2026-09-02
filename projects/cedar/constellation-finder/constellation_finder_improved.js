/**
 * Digistar 7 Constellation Finder - Improved Version
 * 
 * Leverages Digistar's native celestial object system and coordinate conversion
 * to find visible constellations without reimplementing astronomical calculations
 * 
 * Features:
 * - Uses Digistar's built-in coordinate systems
 * - Query actual constellation objects in the scene
 * - Interactive date/time selection
 * - Visual feedback in dome
 * - Export results with dome positions
 */

// ==================== CONFIGURATION ====================

const CONFIG = {
    // Observer location (MSU Space Science Center)
    location: {
        name: "Morehead State University Space Science Center",
        city: "Morehead, KY 40351",
        latitude: 38.1938,   // degrees North
        longitude: -83.4360, // degrees East
        elevation: 250       // meters
    },
    
    // Visibility criteria
    minAltitude: 10.0,       // Minimum altitude in degrees
    useCurrentTime: false,   // If false, uses midnight
    
    // Output options
    outputFile: "$Content/constellation_results.txt",
    showInDome: true,        // Highlight visible constellations
    verbose: false,          // Detailed logging
    
    // Visual markers
    markerColor: {r: 0, g: 255, b: 255},  // Cyan markers
    markerIntensity: 80.0,
    labelColor: {r: 255, g: 255, b: 255}, // White labels
};

// ==================== UTILITY FUNCTIONS ====================

/**
 * Convert degrees to radians
 */
function toRadians(degrees) {
    return degrees * (Math.PI / 180.0);
}

/**
 * Convert radians to degrees
 */
function toDegrees(radians) {
    return radians * (180.0 / Math.PI);
}

/**
 * Get current date/time or midnight
 */
function getObservationTime() {
    if (CONFIG.useCurrentTime) {
        return new Date();
    } else {
        const now = new Date();
        now.setHours(0, 0, 0, 0);  // Midnight
        return now;
    }
}

/**
 * Format date for display
 */
function formatDateTime(date) {
    return date.toLocaleString('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
        timeZoneName: 'short'
    });
}

/**
 * Log message (respects verbose setting)
 */
function log(message, force = false) {
    if (CONFIG.verbose || force) {
        Ds.SendMessage(0, message);
    }
}

// ==================== DIGISTAR INTEGRATION ====================

/**
 * Query Digistar for constellation objects in the scene
 * @returns Array of constellation object names
 */
function getConstellationObjects() {
    const constellations = [];
    
    // Digistar typically has constellation objects with specific naming
    // This searches for objects matching constellation patterns
    const possibleNames = [
        "And", "Ant", "Aps", "Aqr", "Aql", "Ara", "Ari", "Aur",
        "Boo", "Cae", "Cam", "Cnc", "CVn", "CMa", "CMi", "Cap",
        "Car", "Cas", "Cen", "Cep", "Cet", "Cha", "Cir", "Col",
        "Com", "CrA", "CrB", "Crv", "Crt", "Cru", "Cyg", "Del",
        "Dor", "Dra", "Equ", "Eri", "For", "Gem", "Gru", "Her",
        "Hor", "Hya", "Hyi", "Ind", "Lac", "Leo", "LMi", "Lep",
        "Lib", "Lup", "Lyn", "Lyr", "Men", "Mic", "Mon", "Mus",
        "Nor", "Oct", "Oph", "Ori", "Pav", "Peg", "Per", "Phe",
        "Pic", "Psc", "PsA", "Pup", "Pyx", "Ret", "Sge", "Sgr",
        "Sco", "Scl", "Sct", "Ser", "Sex", "Tau", "Tel", "Tri",
        "TrA", "Tuc", "UMa", "UMi", "Vel", "Vir", "Vol", "Vul"
    ];
    
    // Check which constellation objects exist in Digistar
    for (const name of possibleNames) {
        if (Ds.GetObjectID(name) !== 0) {
            constellations.push(name);
        }
    }
    
    log(`Found ${constellations.length} constellation objects in scene`);
    return constellations;
}

/**
 * Get dome position for a celestial object
 * @param {string} objectName - Name of the celestial object
 * @returns Object with azimuth and elevation, or null if below horizon
 */
function getDomePosition(objectName) {
    try {
        // Get object's position in celestial coordinates
        const pos = Ds.GetObjectAttr(objectName, "position", "CELESTIAL");
        
        if (!pos) {
            return null;
        }
        
        // Convert to dome coordinates (Az/El)
        const domePos = Ds.GetObjPositionInDome(objectName);
        
        if (!domePos) {
            return null;
        }
        
        return {
            azimuth: domePos.azimuth,
            elevation: domePos.elevation,
            ra: pos.x,
            dec: pos.y
        };
    } catch (error) {
        log(`Error getting position for ${objectName}: ${error}`, true);
        return null;
    }
}

/**
 * Check if constellation is visible (above minimum altitude)
 * @param {string} constellationName - Constellation abbreviation
 * @returns Boolean indicating visibility
 */
function isConstellationVisible(constellationName) {
    const pos = getDomePosition(constellationName);
    
    if (!pos) {
        return false;
    }
    
    return pos.elevation >= CONFIG.minAltitude;
}

// ==================== VISUALIZATION ====================

/**
 * Create visual markers for visible constellations in the dome
 * @param {Array} visibleConstellations - Array of visible constellation names
 */
function visualizeConstellations(visibleConstellations) {
    if (!CONFIG.showInDome) {
        return;
    }
    
    log("Creating visual markers in dome...");
    
    // Clean up any existing markers
    cleanupMarkers();
    
    let markersCreated = 0;
    
    for (const constName of visibleConstellations) {
        try {
            const pos = getDomePosition(constName);
            
            if (!pos) {
                continue;
            }
            
            // Create marker object
            const markerName = `ConstellationMarker_${constName}`;
            Ds.CreateObject(markerName, "Marker", "temporary");
            
            // Set marker position in dome coordinates
            const markerPos = {
                x: pos.azimuth,
                y: pos.elevation,
                z: 1.0,  // At dome surface
                mode: "Spherical",
                units: "meter"
            };
            Ds.SetObjectAttr(markerName, "position", markerPos);
            
            // Set marker appearance
            Ds.SetObjectAttr(markerName, "color", CONFIG.markerColor);
            Ds.SetObjectAttr(markerName, "intensity", CONFIG.markerIntensity);
            Ds.SetObjectAttr(markerName, "visible", true);
            
            // Add to scene
            Ds.SceneAddObject(markerName);
            
            markersCreated++;
            
        } catch (error) {
            log(`Error creating marker for ${constName}: ${error}`, true);
        }
    }
    
    log(`Created ${markersCreated} visual markers`, true);
}

/**
 * Remove constellation markers from the scene
 */
function cleanupMarkers() {
    // Search for and remove existing markers
    try {
        const markerPattern = "ConstellationMarker_*";
        const files = Ds.DirectorySearch(".", markerPattern, false);
        
        for (const marker of files) {
            if (Ds.GetObjectID(marker) !== 0) {
                Ds.SceneRemoveObject(marker);
                Ds.DeleteObject(marker);
            }
        }
    } catch (error) {
        // Markers might not exist, that's okay
    }
}

// ==================== RESULTS & EXPORT ====================

/**
 * Generate detailed results object
 */
function generateResults(visibleConstellations) {
    const results = {
        location: CONFIG.location,
        observationTime: getObservationTime(),
        criteria: {
            minAltitude: CONFIG.minAltitude
        },
        constellations: []
    };
    
    // Get detailed info for each visible constellation
    for (const constName of visibleConstellations) {
        const pos = getDomePosition(constName);
        
        if (pos) {
            results.constellations.push({
                abbreviation: constName,
                azimuth: pos.azimuth.toFixed(2),
                elevation: pos.elevation.toFixed(2),
                ra: pos.ra ? toDegrees(pos.ra).toFixed(4) : "N/A",
                dec: pos.dec ? toDegrees(pos.dec).toFixed(4) : "N/A"
            });
        }
    }
    
    return results;
}

/**
 * Export results to file
 */
function exportResults(results) {
    try {
        const lines = [];
        
        // Header
        lines.push("=".repeat(60));
        lines.push("DIGISTAR 7 CONSTELLATION VISIBILITY REPORT");
        lines.push("=".repeat(60));
        lines.push("");
        
        // Location info
        lines.push("OBSERVATION LOCATION:");
        lines.push(`  Name: ${results.location.name}`);
        lines.push(`  City: ${results.location.city}`);
        lines.push(`  Latitude: ${results.location.latitude.toFixed(4)}° N`);
        lines.push(`  Longitude: ${Math.abs(results.location.longitude).toFixed(4)}° W`);
        lines.push(`  Elevation: ${results.location.elevation}m above sea level`);
        lines.push("");
        
        // Time info
        lines.push("OBSERVATION TIME:");
        lines.push(`  ${formatDateTime(results.observationTime)}`);
        lines.push("");
        
        // Criteria
        lines.push("VISIBILITY CRITERIA:");
        lines.push(`  Minimum Altitude: ${results.criteria.minAltitude}° above horizon`);
        lines.push("");
        
        // Results
        lines.push("VISIBLE CONSTELLATIONS:");
        lines.push("-".repeat(60));
        lines.push(String("Name").padEnd(6) + 
                   String("Azimuth").padEnd(12) + 
                   String("Elevation").padEnd(12) + 
                   String("RA").padEnd(12) + 
                   String("Dec"));
        lines.push("-".repeat(60));
        
        for (const constellation of results.constellations) {
            lines.push(String(constellation.abbreviation).padEnd(6) + 
                       String(constellation.azimuth + "°").padEnd(12) + 
                       String(constellation.elevation + "°").padEnd(12) + 
                       String(constellation.ra + "°").padEnd(12) + 
                       String(constellation.dec + "°"));
        }
        
        lines.push("-".repeat(60));
        lines.push(`Total: ${results.constellations.length} constellations visible`);
        lines.push("");
        lines.push(`Generated: ${new Date().toISOString()}`);
        lines.push("=".repeat(60));
        
        // Write to file using proper Digistar API
        const fullPath = Ds.ResolvePath(CONFIG.outputFile);
        Ds.FileWrite(fullPath, lines);
        
        log(`Results saved to: ${fullPath}`, true);
        return true;
        
    } catch (error) {
        Ds.SendMessage(2, `Error exporting results: ${error}`);
        return false;
    }
}

// ==================== MAIN EXECUTION ====================

/**
 * Main constellation finder function
 */
function findVisibleConstellations() {
    try {
        Ds.SendMessage(0, "=".repeat(50));
        Ds.SendMessage(0, "DIGISTAR 7 CONSTELLATION FINDER");
        Ds.SendMessage(0, "=".repeat(50));
        
        // Set observation time in Digistar
        const observationTime = getObservationTime();
        const julianDate = observationTime.getTime() / 86400000.0 + 2440587.5;
        Ds.SceneSetDate(julianDate);
        
        log(`Observation time set to: ${formatDateTime(observationTime)}`, true);
        
        // Get constellation objects from Digistar
        const allConstellations = getConstellationObjects();
        
        if (allConstellations.length === 0) {
            Ds.SendMessage(1, "Warning: No constellation objects found in scene");
            Ds.SendMessage(1, "Make sure constellation objects are loaded in Digistar");
            return null;
        }
        
        // Check visibility for each constellation
        const visibleConstellations = [];
        
        log("Checking constellation visibility...");
        
        for (const constName of allConstellations) {
            if (isConstellationVisible(constName)) {
                visibleConstellations.push(constName);
                log(`  ✓ ${constName} is visible`);
            } else {
                log(`  ✗ ${constName} is below horizon`);
            }
        }
        
        // Sort alphabetically
        visibleConstellations.sort();
        
        // Display results
        Ds.SendMessage(0, "");
        Ds.SendMessage(0, `Location: ${CONFIG.location.name}`);
        Ds.SendMessage(0, `Time: ${formatDateTime(observationTime)}`);
        Ds.SendMessage(0, `Minimum altitude: ${CONFIG.minAltitude}°`);
        Ds.SendMessage(0, "");
        Ds.SendMessage(0, "VISIBLE CONSTELLATIONS:");
        Ds.SendMessage(0, "-".repeat(30));
        
        visibleConstellations.forEach((constName, i) => {
            const pos = getDomePosition(constName);
            const azStr = pos ? `Az: ${pos.azimuth.toFixed(1)}°` : "";
            const elStr = pos ? `El: ${pos.elevation.toFixed(1)}°` : "";
            Ds.SendMessage(0, `${(i + 1).toString().padStart(3)}. ${constName.padEnd(6)} ${azStr.padEnd(12)} ${elStr}`);
        });
        
        Ds.SendMessage(0, "-".repeat(30));
        Ds.SendMessage(0, `Total: ${visibleConstellations.length} constellations visible`);
        Ds.SendMessage(0, "=".repeat(50));
        
        // Generate detailed results
        const results = generateResults(visibleConstellations);
        
        // Export to file
        exportResults(results);
        
        // Visualize in dome
        if (CONFIG.showInDome) {
            visualizeConstellations(visibleConstellations);
            Ds.SendMessage(0, "Visual markers created in dome");
        }
        
        return results;
        
    } catch (error) {
        Ds.SendMessage(2, `ERROR: ${error}`);
        Ds.SendMessage(2, `Stack trace: ${error.stack}`);
        return null;
    }
}

// ==================== INTERACTIVE FUNCTIONS ====================

/**
 * Find constellations at a specific time
 * @param {Date} date - Observation date/time
 */
function findAtTime(date) {
    CONFIG.useCurrentTime = false;
    const originalGetter = getObservationTime;
    
    getObservationTime = function() { return date; };
    const result = findVisibleConstellations();
    getObservationTime = originalGetter;
    
    return result;
}

/**
 * Find constellations for tonight at midnight
 */
function findTonight() {
    CONFIG.useCurrentTime = false;
    return findVisibleConstellations();
}

/**
 * Find constellations right now
 */
function findNow() {
    CONFIG.useCurrentTime = true;
    return findVisibleConstellations();
}

/**
 * Clear constellation markers from dome
 */
function clearMarkers() {
    cleanupMarkers();
    Ds.SendMessage(0, "Constellation markers cleared");
}

// ==================== EXECUTE ====================

// Run the constellation finder
Ds.SendMessage(0, "Starting Constellation Finder...");
const results = findVisibleConstellations();

if (results) {
    Ds.SendMessage(0, "");
    Ds.SendMessage(0, "Constellation finder completed successfully!");
    Ds.SendMessage(0, `Results saved to: ${Ds.ResolvePath(CONFIG.outputFile)}`);
} else {
    Ds.SendMessage(2, "Constellation finder failed - see errors above");
}
