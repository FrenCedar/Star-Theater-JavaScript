/**
 * Digistar 7 JavaScript API Type Definitions
 * Provides IntelliSense and autocomplete for Digistar scripting in VS Code
 */

declare namespace Ds {
    // ==================== MESSAGING ====================
    
    /**
     * Send a message to the Digistar console
     * @param level Message level: 0=Info, 1=Warning, 2=Error
     * @param message Message text
     * @example
     * Ds.SendMessage(0, "Script started");
     * Ds.SendMessage(1, "Warning: Object not found");
     * Ds.SendMessage(2, "Error: Invalid parameter");
     */
    function SendMessage(level: 0 | 1 | 2, message: string): void;

    /**
     * Send a command string to Digistar
     * @param command Command string to execute
     * @example
     * Ds.SendStringCommand("coveLights segment 0 255 0 0 duration 2.0");
     */
    function SendStringCommand(command: string): void;

    // ==================== TIMING ====================
    
    /**
     * Pause script execution (blocks Digistar)
     * @param seconds Duration in seconds
     * @example
     * Ds.Sleep(2.5); // Pause for 2.5 seconds
     */
    function Sleep(seconds: number): void;

    /**
     * Wait without blocking Digistar (allows other operations)
     * @param seconds Duration in seconds
     * @example
     * Ds.Wait(5.0); // Wait 5 seconds, Digistar continues
     */
    function Wait(seconds: number): void;

    // ==================== OBJECTS ====================
    
    /**
     * Create a new Digistar object
     * @param name Unique object name
     * @param className Object class (e.g., "Marker", "Model", "Particle")
     * @param type Object type: "permanent", "transient", or "temporary"
     * @example
     * Ds.CreateObject("myMarker", "Marker", "temporary");
     */
    function CreateObject(name: string, className: string, type: "permanent" | "transient" | "temporary"): void;

    /**
     * Delete an object
     * @param name Object name
     * @example
     * Ds.DeleteObject("myMarker");
     */
    function DeleteObject(name: string): void;

    /**
     * Get object's unique ID (0 if object doesn't exist)
     * @param name Object name
     * @returns Object ID or 0 if not found
     * @example
     * if (Ds.GetObjectID("sun") !== 0) {
     *     // Object exists
     * }
     */
    function GetObjectID(name: string): number;

    /**
     * Get list of attribute names for a class
     * @param className Class name
     * @returns Array of attribute names
     */
    function GetClassAttributeNames(className: string): string[];

    // ==================== ATTRIBUTES ====================
    
    interface Position {
        x: number;
        y: number;
        z: number;
        mode?: "Cartesian" | "Spherical" | "Celestial" | "Relative" | "Orbit";
        units?: "meter" | "kilometer" | "AU" | "parsec" | "light_year";
    }

    interface Color {
        r: number;  // 0-255
        g: number;  // 0-255
        b: number;  // 0-255
    }

    interface Controller {
        time: number;
        func?: "Linear" | "EaseIn" | "EaseOut" | "EaseInOut" | "Exponential" | "Logarithmic";
    }

    interface DomePosition {
        azimuth: number;    // degrees
        elevation: number;  // degrees
    }

    /**
     * Get object attribute value
     * @param objectName Object name
     * @param attribute Attribute name
     * @param mode Optional coordinate mode for position attributes
     * @returns Attribute value
     * @example
     * const intensity = Ds.GetObjectAttr("sun", "intensity");
     * const pos = Ds.GetObjectAttr("mars", "position", "CELESTIAL");
     */
    function GetObjectAttr(objectName: string, attribute: string, mode?: string): any;

    /**
     * Set object attribute value
     * @param objectName Object name
     * @param attribute Attribute name
     * @param value New value
     * @param controller Optional animation controller
     * @example
     * // Instant change
     * Ds.SetObjectAttr("sun", "intensity", 100);
     * 
     * // Animated change over 5 seconds
     * Ds.SetObjectAttr("sun", "intensity", 100, {time: 5.0, func: "EaseInOut"});
     */
    function SetObjectAttr(objectName: string, attribute: string, value: any, controller?: Controller): void;

    /**
     * Set callback function for attribute changes
     * @param objectName Object name
     * @param attribute Attribute name
     * @param callback Function called when attribute changes
     * @example
     * Ds.SetObjectAttrCallback("sun", "intensity", (value) => {
     *     Ds.SendMessage(0, `Sun intensity: ${value}`);
     * });
     */
    function SetObjectAttrCallback(objectName: string, attribute: string, callback: (value: any) => void): void;

    // ==================== SCENE ====================
    
    /**
     * Add object to rendering scene (make visible)
     * @param objectName Object name
     * @example
     * Ds.SceneAddObject("mars");
     */
    function SceneAddObject(objectName: string): void;

    /**
     * Remove object from rendering scene (hide)
     * @param objectName Object name
     * @example
     * Ds.SceneRemoveObject("mars");
     */
    function SceneRemoveObject(objectName: string): void;

    /**
     * Set scene date/time
     * @param julianDate Julian date
     * @example
     * Ds.SceneSetDate(2451545.0); // J2000.0
     */
    function SceneSetDate(julianDate: number): void;

    /**
     * Get object's position in dome coordinates
     * @param objectName Object name
     * @returns Dome position (azimuth/elevation) or null if below horizon
     * @example
     * const pos = Ds.GetObjPositionInDome("mars");
     * if (pos) {
     *     console.log(`Mars: Az=${pos.azimuth}° El=${pos.elevation}°`);
     * }
     */
    function GetObjPositionInDome(objectName: string): DomePosition | null;

    // ==================== FILE OPERATIONS ====================
    
    /**
     * Read file contents
     * @param path File path (use ResolvePath for $Content variables)
     * @returns Array of lines from file
     * @example
     * const lines = Ds.FileRead(Ds.ResolvePath("$Content/data.txt"));
     */
    function FileRead(path: string): string[];

    /**
     * Write array of lines to file
     * @param path File path (use ResolvePath for $Content variables)
     * @param lines Array of strings to write
     * @example
     * Ds.FileWrite(Ds.ResolvePath("$Content/output.txt"), ["Line 1", "Line 2"]);
     */
    function FileWrite(path: string, lines: string[]): void;

    /**
     * Resolve Digistar path variables ($Content, $System, etc.)
     * @param path Path with variables
     * @returns Resolved absolute path
     * @example
     * const fullPath = Ds.ResolvePath("$Content/Scripts/myScript.js");
     */
    function ResolvePath(path: string): string;

    /**
     * Check if file exists
     * @param path File path
     * @returns True if file exists
     */
    function FileExists(path: string): boolean;

    /**
     * Search directory for files matching pattern
     * @param directory Directory path
     * @param pattern Search pattern (glob-style)
     * @param recursive Search subdirectories
     * @returns Array of matching file paths
     * @example
     * const jsFiles = Ds.DirectorySearch("$Content/Scripts", "*.js", true);
     */
    function DirectorySearch(directory: string, pattern: string, recursive: boolean): string[];

    // ==================== SYSTEM ====================
    
    /**
     * Execute system command
     * @param command Command to execute
     * @example
     * Ds.SystemCommand("notepad.exe");
     */
    function SystemCommand(command: string): void;

    /**
     * Get system memory usage
     * @returns Memory usage information
     */
    function SystemMemory(): any;

    /**
     * Reset Digistar to default state
     */
    function Reset(): void;

    // ==================== COORDINATE CONVERSIONS ====================
    
    /**
     * Convert Cartesian coordinates to dome position
     * @param x X coordinate
     * @param y Y coordinate
     * @param z Z coordinate
     * @returns Dome position
     */
    function CartesianToDome(x: number, y: number, z: number): DomePosition;

    /**
     * Convert dome position to Cartesian
     * @param azimuth Azimuth in degrees
     * @param elevation Elevation in degrees
     * @param radius Radius
     * @returns Cartesian position
     */
    function DomeToCartesian(azimuth: number, elevation: number, radius: number): Position;

    // ==================== WEB API (Remote Control) ====================
    
    namespace Web {
        /**
         * Result object returned by asynchronous web commands
         */
        interface WebResult {
            /** Response message or error description */
            message: string;
            /** True if an error occurred */
            error: boolean;
        }

        /**
         * Directory item returned by DirectoryGetItem
         */
        interface DirectoryItem {
            /** Full path to file/directory (empty string when end reached) */
            item: string;
            /** True if item is a directory */
            isDirectory: boolean;
        }

        /**
         * Callback function for asynchronous web commands
         */
        type WebCallback = (result: WebResult) => void;

        // ==================== OBJECT WEB COMMANDS ====================

        /**
         * Create a new Digistar object (Web API - Asynchronous)
         * @param name Object name
         * @param className Object class (e.g., "textClass", "sphereClass")
         * @param type Object persistence: "permanent", "persistent", or "temporary" (can abbreviate: "perm", "pers", "temp")
         * @param callback Function called when operation completes
         * @example
         * Ds.Web.CreateObject("myText", "textClass", "temp", function(result) {
         *     if (!result.error) {
         *         console.log("Object created successfully");
         *     }
         * });
         */
        function CreateObject(name: string, className: string, type: "permanent" | "persistent" | "temporary" | "perm" | "pers" | "temp", callback: WebCallback): void;

        /**
         * Delete a Digistar object (Web API - Asynchronous)
         * @param objectName Object name to delete
         * @param callback Function called when operation completes
         * @example
         * Ds.Web.DeleteObject("myText", function(result) {
         *     if (!result.error) {
         *         console.log("Object deleted");
         *     }
         * });
         */
        function DeleteObject(objectName: string, callback: WebCallback): void;

        /**
         * Allocate array elements for an object attribute (Web API - Asynchronous)
         * @param object Existing object name
         * @param attribute Array attribute name
         * @param count Number of elements to allocate
         * @param callback Function called when operation completes
         * @example
         * Ds.Web.AllocObjectArray("stars", "position", 100, function(result) {
         *     console.log("Array allocated");
         * });
         */
        function AllocObjectArray(object: string, attribute: string, count: number, callback: WebCallback): void;

        // ==================== OBJECT HIERARCHY WEB COMMANDS ====================

        /**
         * Add child object to parent hierarchy (Web API - Asynchronous)
         * @param parent Parent object name
         * @param child Child object name
         * @param callback Function called when operation completes
         * @example
         * Ds.Web.AddObjectChild("parentObj", "childObj", function(result) {
         *     if (!result.error) {
         *         console.log("Child added to hierarchy");
         *     }
         * });
         */
        function AddObjectChild(parent: string, child: string, callback: WebCallback): void;

        /**
         * Add child object before another child (Web API - Asynchronous)
         * @param parent Parent object name
         * @param child Child object to add
         * @param beforeObj Place child before this object
         * @param callback Function called when operation completes
         */
        function AddObjectChildBefore(parent: string, child: string, beforeObj: string, callback: WebCallback): void;

        /**
         * Add child object after another child (Web API - Asynchronous)
         * @param parent Parent object name
         * @param child Child object to add
         * @param afterObj Place child after this object
         * @param callback Function called when operation completes
         */
        function AddObjectChildAfter(parent: string, child: string, afterObj: string, callback: WebCallback): void;

        /**
         * Remove child from parent hierarchy (Web API - Asynchronous)
         * @param parent Parent object name
         * @param child Child object to remove
         * @param callback Function called when operation completes
         */
        function RemoveObjectChild(parent: string, child: string, callback: WebCallback): void;

        // ==================== SCENE WEB COMMANDS ====================

        /**
         * Add object to scene for rendering (Web API - Asynchronous)
         * @param sceneObject Scene object (type sceneClass)
         * @param object Object to add to scene
         * @param drawMode Rendering mode: "distant", "normal", "fixed", "landscape", or "near"
         * @param callback Function called when operation completes
         * @example
         * Ds.Web.SceneAddObject("scene", "myObject", "normal", function(result) {
         *     console.log("Object added to scene");
         * });
         */
        function SceneAddObject(sceneObject: string, object: string, drawMode: "distant" | "normal" | "fixed" | "landscape" | "near", callback: WebCallback): void;

        /**
         * Add object to scene before another object (Web API - Asynchronous)
         * @param sceneObject Scene object (type sceneClass)
         * @param object Object to add
         * @param beforeObj Add before this object
         * @param drawMode Rendering mode
         * @param callback Function called when operation completes
         */
        function SceneAddObjectBefore(sceneObject: string, object: string, beforeObj: string, drawMode: "distant" | "normal" | "fixed" | "landscape" | "near", callback: WebCallback): void;

        /**
         * Add object to scene after another object (Web API - Asynchronous)
         * @param sceneObject Scene object (type sceneClass)
         * @param object Object to add
         * @param afterObj Add after this object
         * @param drawMode Rendering mode
         * @param callback Function called when operation completes
         */
        function SceneAddObjectAfter(sceneObject: string, object: string, afterObj: string, drawMode: "distant" | "normal" | "fixed" | "landscape" | "near", callback: WebCallback): void;

        /**
         * Remove object from scene (Web API - Synchronous)
         * @param sceneObject Scene object (type sceneClass)
         * @param object Object to remove from scene
         */
        function SceneRemoveObject(sceneObject: string, object: string): void;

        // ==================== OBJECT PROPERTIES WEB COMMANDS ====================

        /**
         * Get array of parent object names (Web API - Synchronous)
         * @param object Object name
         * @returns Array of parent object names
         */
        function GetObjectParentNames(object: string): string[];

        /**
         * Get array of child object names (Web API - Synchronous)
         * @param object Object name
         * @returns Array of child object names
         */
        function GetObjectChildNames(object: string): string[];

        // ==================== OBJECT ATTRIBUTE GET WEB COMMANDS ====================

        /**
         * Get complete Digistar command string for an attribute (Web API - Synchronous)
         * @param object Object name
         * @param attribute Attribute name
         * @returns Command string or error result object
         * @example
         * var cmd = Ds.Web.GetObjectAttrAsStringCommand("stars", "magnitude");
         * console.log(cmd); // "stars magnitude 6.5"
         */
        function GetObjectAttrAsStringCommand(object: string, attribute: string): string | WebResult;

        /**
         * Get command string for array element (Web API - Synchronous)
         * @param object Object name
         * @param attribute Array attribute name
         * @param elemIndex Array element index
         * @returns Command string or error result object
         */
        function GetObjectArrayElemAsStringCommand(object: string, attribute: string, elemIndex: number): string | WebResult;

        /**
         * Get individual component of an attribute (Web API - Synchronous)
         * @param object Object name
         * @param attribute Attribute name
         * @param part Component: "x", "y", "z", "h", "p", "r", "r", "g", "b", "value", or "CommandText"
         * @returns Component value as string
         * @example
         * var x = Ds.Web.GetObjectAttrPartAsString("myObj", "position", "x");
         * var color = Ds.Web.GetObjectAttrPartAsString("myObj", "color", "value"); // #RRGGBB
         * var cmd = Ds.Web.GetObjectAttrPartAsString("myObj", "position", "CommandText");
         */
        function GetObjectAttrPartAsString(object: string, attribute: string, part: string): string;

        // ==================== OBJECT ATTRIBUTE SET WEB COMMANDS ====================

        /**
         * Set individual component of an attribute (Web API - Synchronous, Blocking)
         * WARNING: This blocks JavaScript execution until complete
         * @param object Object name
         * @param attribute Attribute name
         * @param part Component: "x", "y", "z", "h", "p", "r", "r", "g", "b", or "value"
         * @param value New value
         * @param duration Transition time in seconds (optional)
         * @param upTime Ramp-up portion of duration (optional)
         * @param downTime Ramp-down portion of duration (optional)
         * @example
         * Ds.Web.SetObjectAttrPart("myObj", "position", "x", 100);
         * Ds.Web.SetObjectAttrPart("myObj", "position", "x", 100, 2.0); // 2 second transition
         * Ds.Web.SetObjectAttrPart("myObj", "position", "x", 100, 2.0, 0.5, 0.5); // With ramps
         */
        function SetObjectAttrPart(object: string, attribute: string, part: string, value: any, duration?: number, upTime?: number, downTime?: number): void;

        // ==================== DIRECTORY WEB COMMANDS ====================

        /**
         * Open directory for browsing (Web API - Synchronous)
         * @param directory Directory path (e.g., "$Content\\Shows")
         * @param search Wildcard pattern (e.g., "*.ds", "*.png")
         * @returns Directory reference for use with DirectoryGetItem and DirectoryClose
         * @example
         * var dirRef = Ds.Web.DirectoryOpen("$Content\\user\\test", "*.png");
         */
        function DirectoryOpen(directory: string, search: string): any;

        /**
         * Get next item from directory (Web API - Synchronous)
         * @param dirRef Directory reference from DirectoryOpen
         * @returns Directory item object with 'item' and 'isDirectory' properties
         * @example
         * var dirItem = Ds.Web.DirectoryGetItem(dirRef);
         * if (dirItem.item !== "") {
         *     if (dirItem.isDirectory) {
         *         console.log("Found folder: " + dirItem.item);
         *     } else {
         *         console.log("Found file: " + dirItem.item);
         *     }
         * }
         */
        function DirectoryGetItem(dirRef: any): DirectoryItem;

        /**
         * Close directory (Web API - Synchronous)
         * @param dirRef Directory reference from DirectoryOpen
         * @example
         * Ds.Web.DirectoryClose(dirRef);
         */
        function DirectoryClose(dirRef: any): void;

        // ==================== MISCELLANEOUS WEB COMMANDS ====================

        /**
         * Convert internal path to web URL (Web API - Synchronous)
         * @param path Internal path with $Content or $Software
         * @returns Web URL path
         * @example
         * var url = Ds.Web.ResolvePathNameToUrl("$Content\\Library");
         * // Returns: "/content/library"
         */
        function ResolvePathNameToUrl(path: string): string;

        /**
         * Convert web URL to internal path (Web API - Synchronous)
         * @param url Web URL path
         * @returns Internal path with $Content or $Software
         * @example
         * var path = Ds.Web.UnresolvePathNameFromUrl("/content/library");
         * // Returns: "$Content\\Library"
         */
        function UnresolvePathNameFromUrl(url: string): string;

        /**
         * Send any Digistar command string (Web API - Asynchronous)
         * PRIMARY COMMAND INTERFACE - Accepts any valid Digistar script command
         * @param command Any valid Digistar command string
         * @param callback Optional function called when command completes
         * @example
         * // Without callback
         * Ds.Web.SendStringCommand("system reset");
         * 
         * // With callback for error handling
         * Ds.Web.SendStringCommand("projectors on", function(result) {
         *     if (result.error) {
         *         console.log("Error: " + result.message);
         *     } else {
         *         console.log("Success");
         *     }
         * });
         * 
         * // Get command with callback
         * Ds.Web.SendStringCommand("stars get defaults", function(result) {
         *     if (!result.error) {
         *         console.log("Stars defaults: " + result.message);
         *     }
         * });
         */
        function SendStringCommand(command: string, callback?: WebCallback): void;

        // ==================== HELPER WEB COMMANDS ====================

        /**
         * Create a toggle button that controls a Digistar system object (Web API)
         * @param id HTML element ID for the button
         * @param parent Parent HTML element ID
         * @param systemObjectName Digistar object to toggle (e.g., "stars")
         * @param buttonText Button label text
         * @param top Top position in pixels
         * @param left Left position in pixels
         * @param width Button width in pixels
         * @param height Button height in pixels
         * @param buttonTextColorOff Text color when off (CSS color)
         * @param buttonTextColorOn Text color when on (CSS color)
         * @param fontSize Font size (CSS)
         * @param buttonColorOff Background color when off (CSS color)
         * @param buttonColorOn Background color when on (CSS color)
         * @param imageUrlOff Image URL when off (optional)
         * @param imageUrlOn Image URL when on (optional)
         * @param borderColorOff Border color when off (CSS color)
         * @param borderColorOn Border color when on (CSS color)
         * @param borderThickness Border width in pixels
         * @param borderRadius Corner radius in pixels
         * @param tooltipText Tooltip text
         * @example
         * Ds.Web.CreateToggleButton(
         *     "starsBtn", "controlPanel", "stars", "Stars",
         *     10, 10, 100, 40,
         *     "#888", "#fff", "14px",
         *     "#333", "#0066cc",
         *     "", "",
         *     "#555", "#0099ff",
         *     2, 8,
         *     "Toggle stars on/off"
         * );
         */
        function CreateToggleButton(
            id: string,
            parent: string,
            systemObjectName: string,
            buttonText: string,
            top: number,
            left: number,
            width: number,
            height: number,
            buttonTextColorOff: string,
            buttonTextColorOn: string,
            fontSize: string,
            buttonColorOff: string,
            buttonColorOn: string,
            imageUrlOff: string,
            imageUrlOn: string,
            borderColorOff: string,
            borderColorOn: string,
            borderThickness: number,
            borderRadius: number,
            tooltipText: string
        ): void;

        /**
         * Create a command button that executes a Digistar command when clicked (Web API)
         * @param id HTML element ID for the button
         * @param parent Parent HTML element ID
         * @param command Digistar command to execute
         * @param buttonText Button label text
         * @param top Top position in pixels
         * @param left Left position in pixels
         * @param width Button width in pixels
         * @param height Button height in pixels
         * @param buttonTextColor Text color (CSS color)
         * @param fontSize Font size (CSS)
         * @param buttonColor Background color (CSS color)
         * @param imageUrl Image URL (optional)
         * @param borderColor Border color (CSS color)
         * @param borderThickness Border width in pixels
         * @param borderRadius Corner radius in pixels
         * @param tooltipText Tooltip text
         */
        function CreateCommandButton(
            id: string,
            parent: string,
            command: string,
            buttonText: string,
            top: number,
            left: number,
            width: number,
            height: number,
            buttonTextColor: string,
            fontSize: string,
            buttonColor: string,
            imageUrl: string,
            borderColor: string,
            borderThickness: number,
            borderRadius: number,
            tooltipText: string
        ): void;

        /**
         * Load a structured control panel layout (Web API)
         * @param id HTML element ID
         * @param htmlElementType Element type (e.g., "div")
         * @param cssLayoutClass CSS class for layout
         * @param cssGroupsClass CSS class for groups
         * @param cssPagesClass CSS class for pages container
         * @param cssPageClass CSS class for individual pages
         * @param pageTarget Target element for page content
         * @param pageTargetIsFrame Is target an iframe?
         * @param autoScale Auto-scale to fit screen?
         */
        function LoadControlPanelLayout(
            id: string,
            htmlElementType: string,
            cssLayoutClass: string,
            cssGroupsClass: string,
            cssPagesClass: string,
            cssPageClass: string,
            pageTarget: string,
            pageTargetIsFrame: boolean,
            autoScale: boolean
        ): void;

        /**
         * Start receiving updates from Digistar Host (Web API)
         * CRITICAL: Call once after creating all buttons/controls
         * Initiates bidirectional sync to keep button states aligned with Digistar
         * @example
         * // After creating all buttons
         * Ds.Web.StartUpdatesFromHost();
         */
        function StartUpdatesFromHost(): void;
    }
}

// ==================== GLOBAL HELPERS ====================

/**
 * Convert degrees to radians (JavaScript uses radians)
 * @param degrees Angle in degrees
 * @returns Angle in radians
 * @example
 * const radians = degreesToRadians(45); // Math.PI/4
 */
declare function degreesToRadians(degrees: number): number;

/**
 * Convert radians to degrees
 * @param radians Angle in radians
 * @returns Angle in degrees
 * @example
 * const degrees = radiansToDegrees(Math.PI); // 180
 */
declare function radiansToDegrees(radians: number): number;

// ==================== ATTRIBUTE TYPE NAMES ====================

/**
 * Attribute type identifiers used in Digistar
 * These are TYPE NAMES, not function prefixes
 * 
 * @example
 * // When defining attributes, you may see:
 * // SDSBoolAttr, SDSIntAttr, SDSFloatAttr, etc.
 * // These define the TYPES of attributes, not function calls
 */
declare type SDSBoolAttr = boolean;
declare type SDSIntAttr = number;
declare type SDSFloatAttr = number;
declare type SDSStringAttr = string;
declare type SDSVector3Attr = {x: number, y: number, z: number};
declare type SDSColorAttr = {r: number, g: number, b: number};
declare type SDSPositionAttr = Ds.Position;

// ==================== COMMON PATTERNS ====================

/**
 * @example Fade in an object
 * Ds.SetObjectAttr("myObject", "intensity", 0);
 * Ds.SetObjectAttr("myObject", "intensity", 100, {time: 2.0, func: "EaseIn"});
 * 
 * @example Position an object in celestial coordinates
 * Ds.SetObjectAttr("myObject", "position", {
 *     x: 1.5 * Math.PI,  // RA in radians
 *     y: 0.5,            // Dec in radians
 *     z: 10.0,           // Distance in AU
 *     mode: "Celestial",
 *     units: "AU"
 * });
 * 
 * @example Control cove lights with hardware fading
 * for (let seg = 0; seg < 128; seg++) {
 *     Ds.SendStringCommand(`coveLights segment ${seg} 255 0 0 duration 2.0`);
 * }
 * 
 * @example Error handling
 * try {
 *     // Your code
 * } catch (error) {
 *     Ds.SendMessage(2, `Error: ${error}`);
 *     Ds.SendMessage(2, `Stack: ${error.stack}`);
 * }
 */
