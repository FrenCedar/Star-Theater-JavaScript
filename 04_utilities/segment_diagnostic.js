// Segment Diagnostic Tool
// Test which segments are working and identify issues

// ===== BASIC TESTS =====

// Test each segment individually with a delay
function testAllSegmentsSequential() {
    Ds.SendMessageStatus("Testing all 128 segments sequentially...");
    
    for (var i = 0; i < 128; i++) {
        // Turn off all
        for (var j = 0; j < 128; j++) {
            Ds.SendStringCommand("coveLights segment " + j + " 0 0 0");
        }
        
        // Turn on current segment (white)
        Ds.SendStringCommand("coveLights segment " + i + " 100 100 100");
        
        Ds.SendMessageStatus("Testing segment " + i);
        Ds.Wait(0.5);  // Wait 0.5 seconds so you can see it
    }
    
    // Turn all off
    for (var j = 0; j < 128; j++) {
        Ds.SendStringCommand("coveLights segment " + j + " 0 0 0");
    }
    
    Ds.SendMessageStatus("Sequential test complete");
}

// Test specific segment ranges
function testSegmentRange(start, end) {
    Ds.SendMessageStatus("Testing segments " + start + " to " + end);
    
    // Turn all off first
    for (var i = 0; i < 128; i++) {
        Ds.SendStringCommand("coveLights segment " + i + " 0 0 0");
    }
    
    // Turn on the range
    for (var i = start; i <= end; i++) {
        Ds.SendStringCommand("coveLights segment " + i + " 100 0 0");  // Red
    }
    
    Ds.Wait(3);  // Wait 3 seconds
    
    // Turn off
    for (var i = start; i <= end; i++) {
        Ds.SendStringCommand("coveLights segment " + i + " 0 0 0");
    }
}

// Test problem segments (110+)
function testProblemSegments() {
    Ds.SendMessageStatus("Testing segments 110-127 individually...");
    
    for (var i = 110; i < 128; i++) {
        // Turn all off
        for (var j = 0; j < 128; j++) {
            Ds.SendStringCommand("coveLights segment " + j + " 0 0 0");
        }
        
        // Try to turn on this segment (bright red)
        Ds.SendStringCommand("coveLights segment " + i + " 100 0 0");
        
        Ds.SendMessageStatus("Segment " + i + " - Should be RED");
        Ds.Wait(1);
    }
    
    // Turn all off
    for (var j = 0; j < 128; j++) {
        Ds.SendStringCommand("coveLights segment " + j + " 0 0 0");
    }
    
    Ds.SendMessageStatus("Problem segment test complete");
}

// ===== COMPARATIVE TESTS =====

// Compare working vs non-working segments
function compareSegments() {
    Ds.SendMessageStatus("Comparing working (0-109) vs non-working (110-127)");
    
    // Turn all off
    for (var i = 0; i < 128; i++) {
        Ds.SendStringCommand("coveLights segment " + i + " 0 0 0");
    }
    Ds.Wait(1);
    
    // Test known working segment
    Ds.SendMessageStatus("Testing segment 50 (should work) - RED");
    Ds.SendStringCommand("coveLights segment 50 100 0 0");
    Ds.Wait(2);
    Ds.SendStringCommand("coveLights segment 50 0 0 0");
    Ds.Wait(1);
    
    // Test problem segment
    Ds.SendMessageStatus("Testing segment 115 (problem?) - RED");
    Ds.SendStringCommand("coveLights segment 115 100 0 0");
    Ds.Wait(2);
    Ds.SendStringCommand("coveLights segment 115 0 0 0");
    Ds.Wait(1);
    
    // Test both at same time
    Ds.SendMessageStatus("Testing BOTH segments 50 and 115 - RED");
    Ds.SendStringCommand("coveLights segment 50 100 0 0");
    Ds.SendStringCommand("coveLights segment 115 100 0 0");
    Ds.Wait(3);
    Ds.SendStringCommand("coveLights segment 50 0 0 0");
    Ds.SendStringCommand("coveLights segment 115 0 0 0");
    
    Ds.SendMessageStatus("Comparison complete");
}

// ===== BOUNDARY TESTS =====

// Test around the problem boundary (105-115)
function testBoundary() {
    Ds.SendMessageStatus("Testing boundary segments 105-115");
    
    for (var i = 105; i <= 115; i++) {
        // Turn all off
        for (var j = 0; j < 128; j++) {
            Ds.SendStringCommand("coveLights segment " + j + " 0 0 0");
        }
        
        // Turn on current segment
        Ds.SendStringCommand("coveLights segment " + i + " 0 100 0");  // Green
        
        Ds.SendMessageStatus("Segment " + i + " - should be GREEN");
        Ds.Wait(1);
    }
    
    // Turn all off
    for (var j = 0; j < 128; j++) {
        Ds.SendStringCommand("coveLights segment " + j + " 0 0 0");
    }
    
    Ds.SendMessageStatus("Boundary test complete");
}

// Find exact cutoff point
function findCutoffPoint() {
    Ds.SendMessageStatus("Finding exact cutoff point...");
    
    var workingSegments = [];
    var nonWorkingSegments = [];
    
    // Test each segment in problem range
    for (var i = 100; i < 128; i++) {
        // Turn all off
        for (var j = 0; j < 128; j++) {
            Ds.SendStringCommand("coveLights segment " + j + " 0 0 0");
        }
        
        // Turn on test segment
        Ds.SendStringCommand("coveLights segment " + i + " 100 100 0");  // Yellow
        
        Ds.SendMessageStatus("Testing segment " + i + " - does it light up?");
        Ds.Wait(1);
        
        // Manual observation needed - user must note which work
    }
    
    // Turn all off
    for (var j = 0; j < 128; j++) {
        Ds.SendStringCommand("coveLights segment " + j + " 0 0 0");
    }
    
    Ds.SendMessageStatus("Cutoff test complete - note which segments lit up");
}

// ===== ALTERNATIVE COMMAND TESTS =====

// Try different command formats for high segments
function tryAlternativeCommands() {
    Ds.SendMessageStatus("Trying alternative command formats for segment 115");
    
    var testSegment = 115;
    
    // Turn all off
    for (var i = 0; i < 128; i++) {
        Ds.SendStringCommand("coveLights segment " + i + " 0 0 0");
    }
    Ds.Wait(1);
    
    // Try standard format
    Ds.SendMessageStatus("Format 1: coveLights segment 115 100 0 0");
    Ds.SendStringCommand("coveLights segment 115 100 0 0");
    Ds.Wait(2);
    Ds.SendStringCommand("coveLights segment 115 0 0 0");
    Ds.Wait(1);
    
    // Try with leading zeros
    Ds.SendMessageStatus("Format 2: coveLights segment 0115 100 0 0");
    Ds.SendStringCommand("coveLights segment 0115 100 0 0");
    Ds.Wait(2);
    Ds.SendStringCommand("coveLights segment 0115 0 0 0");
    Ds.Wait(1);
    
    // Try as string
    Ds.SendMessageStatus("Format 3: coveLights segment \"115\" 100 0 0");
    Ds.SendStringCommand('coveLights segment "115" 100 0 0');
    Ds.Wait(2);
    Ds.SendStringCommand('coveLights segment "115" 0 0 0');
    Ds.Wait(1);
    
    Ds.SendMessageStatus("Alternative command test complete");
}

// ===== CONFIGURATION QUERIES =====

// Try to query system configuration
function querySystemConfig() {
    Ds.SendMessageStatus("Attempting to query system configuration...");
    
    // Try various potential query commands
    var queries = [
        "coveLights info",
        "coveLights status",
        "coveLights config",
        "coveLights count",
        "coveLights segments",
        "coveLights query"
    ];
    
    for (var i = 0; i < queries.length; i++) {
        Ds.SendMessageStatus("Trying: " + queries[i]);
        try {
            Ds.SendStringCommand(queries[i]);
            Ds.Wait(0.5);
        } catch(e) {
            Ds.SendMessageError("Query failed: " + queries[i]);
        }
    }
    
    Ds.SendMessageStatus("Configuration query complete");
}

// ===== BATCH TESTS =====

// Visual pattern to see which segments work
function visualPattern() {
    Ds.SendMessageStatus("Creating visual pattern across all segments");
    
    // Turn all off
    for (var i = 0; i < 128; i++) {
        Ds.SendStringCommand("coveLights segment " + i + " 0 0 0");
    }
    Ds.Wait(1);
    
    // Pattern: Every 10th segment in different colors
    for (var i = 0; i < 128; i += 10) {
        if (i < 40) {
            Ds.SendStringCommand("coveLights segment " + i + " 100 0 0");  // Red
        } else if (i < 80) {
            Ds.SendStringCommand("coveLights segment " + i + " 0 100 0");  // Green
        } else if (i < 120) {
            Ds.SendStringCommand("coveLights segment " + i + " 0 0 100");  // Blue
        } else {
            Ds.SendStringCommand("coveLights segment " + i + " 100 100 0");  // Yellow
        }
    }
    
    Ds.SendMessageStatus("Visual pattern active - observe which colors show");
    Ds.Wait(5);
    
    // Turn all off
    for (var i = 0; i < 128; i++) {
        Ds.SendStringCommand("coveLights segment " + i + " 0 0 0");
    }
}

// ===== QUICK TESTS =====

// Quick test of problem area
function quickTest() {
    Ds.SendMessageStatus("Quick test: segments 0, 50, 100, 110, 120, 127");
    
    var testSegments = [0, 50, 100, 110, 120, 127];
    
    for (var i = 0; i < testSegments.length; i++) {
        // Turn all off
        for (var j = 0; j < 128; j++) {
            Ds.SendStringCommand("coveLights segment " + j + " 0 0 0");
        }
        
        var seg = testSegments[i];
        Ds.SendStringCommand("coveLights segment " + seg + " 100 100 100");
        Ds.SendMessageStatus("Segment " + seg + " - WHITE");
        Ds.Wait(1.5);
    }
    
    // Turn all off
    for (var j = 0; j < 128; j++) {
        Ds.SendStringCommand("coveLights segment " + j + " 0 0 0");
    }
    
    Ds.SendMessageStatus("Quick test complete");
}

// ===== USAGE INSTRUCTIONS =====

Ds.SendMessageStatus("=== SEGMENT DIAGNOSTIC TOOL ===");
Ds.SendMessageStatus("Available functions:");
Ds.SendMessageStatus("1. quickTest() - Fast test of key segments");
Ds.SendMessageStatus("2. testBoundary() - Test segments 105-115");
Ds.SendMessageStatus("3. findCutoffPoint() - Find exact problem point");
Ds.SendMessageStatus("4. testProblemSegments() - Test 110-127");
Ds.SendMessageStatus("5. testAllSegmentsSequential() - Test all 128");
Ds.SendMessageStatus("6. compareSegments() - Compare working vs broken");
Ds.SendMessageStatus("7. visualPattern() - Show which segments work");
Ds.SendMessageStatus("8. tryAlternativeCommands() - Test different syntax");
Ds.SendMessageStatus("9. testSegmentRange(start, end) - Test custom range");
Ds.SendMessageStatus("=====================================");

// Uncomment to run a test:
// quickTest();
