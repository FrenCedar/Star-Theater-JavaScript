// Default location: Space Science Center
const OBSERVER_LATITUDE = 38.1938;  // Latitude in degrees North (negative for South)
const OBSERVER_LONGITUDE = -83.4360; // Longitude in degrees East (negative for West)
const OBSERVER_ELEVATION = 250;     // Elevation in meters above sea level
const OBSERVER_LOCATION_NAME = "State University Space Science Center, Morehead, KY 40351";

// Minimum altitude in degrees for a star to be considered "visible"
const MINIMUM_VISIBLE_ALTITUDE = 10;

// Output file path for saving constellation data
const OUTPUT_FILE_PATH = "constellation_result.txt";

// Convert degrees to radians
function degreesToRadians(degrees) {
    return degrees * Math.PI / 180;
}

// Convert radians to degrees
function radiansToDegrees(radians) {
    return radians * 180 / Math.PI;
}

// Observer class to represent the observer's location and time
class Observer {
    constructor(latitude, longitude, elevation = 0) {
        this.latitude = degreesToRadians(latitude);
        this.longitude = degreesToRadians(longitude);
        this.elevation = elevation; // meters
        this.date = new Date(); // current date and time
    }

    // Set the date and time for the observer
    setDate(date) {
        this.date = date;
    }

    // Get Local Sidereal Time (LST) in radians
    getLocalSiderealTime() {
        // Calculate Julian Date
        const jd = this.getJulianDate();
        
        // Calculate Greenwich Mean Sidereal Time (GMST) in hours
        // This is a simplified formula
        const jdRef = Math.floor(jd - 0.5) + 0.5; // Julian date at previous midnight
        const T = (jdRef - 2451545.0) / 36525.0; // Julian centuries since J2000.0
        const theta0 = 280.46061837 + 360.98564736629 * (jd - 2451545.0) +
                      0.000387933 * T * T - T * T * T / 38710000.0;
                      
        // Reduce to range 0-360
        let thetaDeg = theta0 % 360.0;
        if (thetaDeg < 0) thetaDeg += 360.0;
        
        // Convert to radians and adjust for observer's longitude
        return degreesToRadians(thetaDeg) + this.longitude;
    }

    // Calculate Julian Date from JavaScript Date
    getJulianDate() {
        const time = this.date.getTime();
        return (time / 86400000.0) + 2440587.5;
    }
}

// CelestialBody class to represent stars and other celestial objects
class CelestialBody {
    constructor(name, rightAscension, declination) {
        this.name = name;
        this.rightAscension = degreesToRadians(rightAscension * 15); // convert hours to degrees, then to radians
        this.declination = degreesToRadians(declination);
    }

    // Calculate the altitude and azimuth for a given observer
    calculatePosition(observer) {
        const lst = observer.getLocalSiderealTime();
        const hourAngle = lst - this.rightAscension;
        
        const sinAlt = Math.sin(this.declination) * Math.sin(observer.latitude) + 
                      Math.cos(this.declination) * Math.cos(observer.latitude) * Math.cos(hourAngle);
        const altitude = Math.asin(sinAlt);
        
        const cosAz = (Math.sin(this.declination) - Math.sin(altitude) * Math.sin(observer.latitude)) / 
                     (Math.cos(altitude) * Math.cos(observer.latitude));
        let azimuth = Math.acos(Math.max(-1, Math.min(1, cosAz)));
        
        if (Math.sin(hourAngle) > 0) {
            azimuth = 2 * Math.PI - azimuth;
        }
        
        return {
            altitude: radiansToDegrees(altitude),
            azimuth: radiansToDegrees(azimuth)
        };
    }
}

// Get current date at midnight
function getCurrentMidnight() {
    const now = new Date();
    const midnight = new Date(now);
    midnight.setHours(0, 0, 0, 0);
    return midnight;
}

// Format date as string
function formatDate(date) {
    const options = { 
        year: 'numeric', 
        month: '2-digit', 
        day: '2-digit',
        timeZoneName: 'short'
    };
    return date.toLocaleDateString('en-US', options);
}

// Dictionary of constellations with their brightest stars and coordinates (RA, Dec)
// Format: [Right Ascension in hours, Declination in degrees]
const starData = {
    // Andromeda
    "Alpheratz": [0.14, 29.09],
    "Mirach": [1.16, 35.62],
    "Almach": [2.06, 42.33],
    // Antlia (Air Pump)
    "Alpha Antliae": [10.45, -31.07],
    // Apus (Bird of Paradise)
    "Alpha Apodis": [14.80, -79.04],
    // Aquarius (Water Bearer)
    "Sadalsuud": [21.53, -5.57],
    "Sadalmelik": [22.11, -0.32],
    // Aquila (Eagle)
    "Altair": [19.85, 8.87],
    "Tarazed": [19.77, 10.61],
    // Ara (Altar)
    "Alpha Arae": [17.53, -49.88],
    "Beta Arae": [17.42, -55.53],
    // Aries (Ram)
    "Hamal": [2.12, 23.46],
    "Sheratan": [1.91, 20.81],
    // Auriga (Charioteer)
    "Capella": [5.28, 46.00],
    "Menkalinan": [5.99, 44.95],
    // Boötes (Herdsman)
    "Arcturus": [14.26, 19.18],
    "Izar": [14.75, 27.07],
    // Caelum (Chisel)
    "Alpha Caeli": [4.70, -41.86],
    // Camelopardalis (Giraffe)
    "Beta Camelopardalis": [5.03, 60.44],
    // Cancer (Crab)
    "Acubens": [8.97, 11.86],
    "Al Tarf": [8.28, 9.19],
    // Canes Venatici (Hunting Dogs)
    "Cor Caroli": [12.93, 38.32],
    // Canis Major (Great Dog)
    "Sirius": [6.75, -16.72],
    "Adhara": [6.98, -28.97],
    // Canis Minor (Little Dog)
    "Procyon": [7.65, 5.22],
    "Gomeisa": [7.45, 8.29],
    // Capricornus (Sea Goat)
    "Deneb Algedi": [21.78, -16.13],
    "Dabih": [20.35, -14.78],
    // Carina (Keel)
    "Canopus": [6.40, -52.70],
    "Miaplacidus": [9.22, -69.72],
    // Cassiopeia
    "Schedar": [0.68, 56.54],
    "Caph": [0.15, 59.15],
    // Centaurus (Centaur)
    "Alpha Centauri": [14.66, -60.83],
    "Beta Centauri": [14.06, -60.37],
    // Cepheus (King)
    "Alderamin": [21.31, 62.59],
    "Alfirk": [21.48, 70.56],
    // Cetus (Whale)
    "Diphda": [0.73, -17.99],
    "Menkar": [3.04, 4.09],
    // Chamaeleon
    "Alpha Chamaeleontis": [8.31, -76.92],
    // Circinus (Compass)
    "Alpha Circini": [14.71, -64.98],
    // Columba (Dove)
    "Phact": [5.66, -34.07],
    // Coma Berenices (Berenice's Hair)
    "Beta Comae Berenices": [13.20, 27.88],
    // Corona Australis (Southern Crown)
    "Alpha Coronae Australis": [19.16, -37.90],
    // Corona Borealis (Northern Crown)
    "Alphecca": [15.58, 26.71],
    // Corvus (Crow)
    "Gienah": [12.26, -17.54],
    "Algorab": [12.50, -16.52],
    // Crater (Cup)
    "Delta Crateris": [11.32, -14.78],
    // Crux (Southern Cross)
    "Acrux": [12.44, -63.10],
    "Mimosa": [12.80, -59.69],
    // Cygnus (Swan)
    "Deneb": [20.69, 45.28],
    "Albireo": [19.51, 27.96],
    // Delphinus (Dolphin)
    "Rotanev": [20.66, 14.60],
    "Sualocin": [20.63, 15.91],
    // Dorado (Swordfish)
    "Alpha Doradus": [4.57, -55.05],
    // Draco (Dragon)
    "Etamin": [17.94, 51.49],
    "Aldibain": [17.51, 52.30],
    // Equuleus (Little Horse)
    "Kitalpha": [21.36, 5.25],
    // Eridanus (River)
    "Achernar": [1.63, -57.24],
    "Cursa": [5.13, -5.09],
    // Fornax (Furnace)
    "Alpha Fornacis": [3.20, -29.30],
    // Gemini (Twins)
    "Pollux": [7.76, 28.03],
    "Castor": [7.58, 31.89],
    // Grus (Crane)
    "Alnair": [22.14, -46.96],
    // Hercules
    "Kornephoros": [16.50, 21.49],
    "Rasalgethi": [17.24, 14.39],
    // Horologium (Clock)
    "Alpha Horologii": [4.23, -42.30],
    // Hydra (Water Snake)
    "Alphard": [9.46, -8.66],
    // Hydrus (Water Snake)
    "Alpha Hydri": [1.98, -61.57],
    // Indus (Indian)
    "Alpha Indi": [20.63, -47.29],
    // Lacerta (Lizard)
    "Alpha Lacertae": [22.52, 50.28],
    // Leo (Lion)
    "Regulus": [10.14, 11.97],
    "Denebola": [11.82, 14.57],
    // Leo Minor (Little Lion)
    "46 Leo Minoris": [10.89, 34.21],
    // Lepus (Hare)
    "Arneb": [5.55, -17.82],
    // Libra (Scales)
    "Zubeneschamali": [15.28, -9.38],
    "Zubenelgenubi": [14.85, -16.04],
    // Lupus (Wolf)
    "Alpha Lupi": [14.70, -47.39],
    // Lynx
    "Alpha Lyncis": [9.35, 34.39],
    // Lyra (Lyre)
    "Vega": [18.62, 38.78],
    "Sheliak": [18.83, 33.36],
    // Mensa (Table Mountain)
    "Alpha Mensae": [6.17, -74.75],
    // Microscopium (Microscope)
    "Gamma Microscopii": [21.01, -32.17],
    // Monoceros (Unicorn)
    "Beta Monocerotis": [6.48, -7.03],
    // Musca (Fly)
    "Alpha Muscae": [12.62, -69.14],
    // Norma (Square)
    "Gamma2 Normae": [16.23, -50.16],
    // Octans (Octant)
    "Nu Octantis": [21.69, -77.39],
    // Ophiuchus (Serpent Bearer)
    "Rasalhague": [17.58, 12.56],
    "Sabik": [17.17, -15.72],
    // Orion (Hunter)
    "Betelgeuse": [5.92, 7.41],
    "Rigel": [5.24, -8.20],
    "Bellatrix": [5.42, 6.35],
    // Pavo (Peacock)
    "Peacock": [20.43, -56.74],
    // Pegasus (Winged Horse)
    "Markab": [23.08, 15.21],
    "Scheat": [23.06, 28.08],
    "Algenib": [0.22, 15.18],
    // Perseus
    "Mirfak": [3.41, 49.86],
    "Algol": [3.14, 40.96],
    // Phoenix
    "Ankaa": [0.44, -42.30],
    // Pictor (Painter's Easel)
    "Alpha Pictoris": [6.80, -61.94],
    // Pisces (Fish)
    "Alrescha": [2.03, 2.76],
    "Eta Piscium": [1.52, 15.35],
    // Piscis Austrinus (Southern Fish)
    "Fomalhaut": [22.96, -29.62],
    // Puppis (Stern)
    "Naos": [8.06, -40.00],
    // Pyxis (Compass)
    "Alpha Pyxidis": [8.73, -33.19],
    // Reticulum (Net)
    "Alpha Reticuli": [4.24, -62.47],
    // Sagitta (Arrow)
    "Gamma Sagittae": [19.98, 19.49],
    // Sagittarius (Archer)
    "Kaus Australis": [18.40, -34.38],
    "Nunki": [18.92, -26.30],
    // Scorpius (Scorpion)
    "Antares": [16.49, -26.43],
    "Shaula": [17.56, -37.10],
    // Sculptor
    "Alpha Sculptoris": [0.98, -29.36],
    // Scutum (Shield)
    "Alpha Scuti": [18.59, -8.24],
    // Serpens (Serpent)
    "Unukalhai": [15.74, 6.43],
    // Sextans (Sextant)
    "Alpha Sextantis": [10.13, -0.37],
    // Taurus (Bull)
    "Aldebaran": [4.60, 16.51],
    "Elnath": [5.44, 28.61],
    // Telescopium (Telescope)
    "Alpha Telescopii": [18.45, -45.97],
    // Triangulum (Triangle)
    "Beta Trianguli": [2.16, 34.99],
    // Triangulum Australe (Southern Triangle)
    "Atria": [16.81, -69.03],
    // Tucana (Toucan)
    "Alpha Tucanae": [22.31, -60.26],
    // Ursa Major (Great Bear)
    "Alioth": [12.90, 55.96],
    "Dubhe": [11.06, 61.75],
    // Ursa Minor (Little Bear)
    "Polaris": [2.53, 89.26],
    "Kochab": [14.85, 74.16],
    // Vela (Sail)
    "Suhail": [9.13, -43.43],
    // Virgo (Virgin)
    "Spica": [13.42, -11.16],
    "Vindemiatrix": [13.04, 10.96],
    // Volans (Flying Fish)
    "Beta Volantis": [8.43, -66.14],
    // Vulpecula (Fox)
    "Anser": [19.48, 24.67]
};

// Map stars to their constellations
const constellationStars = {
    // Andromeda
    "And": ["Alpheratz", "Mirach", "Almach"],
    // Antlia
    "Ant": ["Alpha Antliae"],
    // Apus
    "Aps": ["Alpha Apodis"],
    // Aquarius
    "Aqr": ["Sadalsuud", "Sadalmelik"],
    // Aquila
    "Aql": ["Altair", "Tarazed"],
    // Ara
    "Ara": ["Alpha Arae", "Beta Arae"],
    // Aries
    "Ari": ["Hamal", "Sheratan"],
    // Auriga
    "Aur": ["Capella", "Menkalinan"],
    // Boötes
    "Boo": ["Arcturus", "Izar"],
    // Caelum
    "Cae": ["Alpha Caeli"],
    // Camelopardalis
    "Cam": ["Beta Camelopardalis"],
    // Cancer
    "Cnc": ["Acubens", "Al Tarf"],
    // Canes Venatici
    "CVn": ["Cor Caroli"],
    // Canis Major
    "CMa": ["Sirius", "Adhara"],
    // Canis Minor
    "CMi": ["Procyon", "Gomeisa"],
    // Capricornus
    "Cap": ["Deneb Algedi", "Dabih"],
    // Carina
    "Car": ["Canopus", "Miaplacidus"],
    // Cassiopeia
    "Cas": ["Schedar", "Caph"],
    // Centaurus
    "Cen": ["Alpha Centauri", "Beta Centauri"],
    // Cepheus
    "Cep": ["Alderamin", "Alfirk"],
    // Cetus
    "Cet": ["Diphda", "Menkar"],
    // Chamaeleon
    "Cha": ["Alpha Chamaeleontis"],
    // Circinus
    "Cir": ["Alpha Circini"],
    // Columba
    "Col": ["Phact"],
    // Coma Berenices
    "Com": ["Beta Comae Berenices"],
    // Corona Australis
    "CrA": ["Alpha Coronae Australis"],
    // Corona Borealis
    "CrB": ["Alphecca"],
    // Corvus
    "Crv": ["Gienah", "Algorab"],
    // Crater
    "Crt": ["Delta Crateris"],
    // Crux
    "Cru": ["Acrux", "Mimosa"],
    // Cygnus
    "Cyg": ["Deneb", "Albireo"],
    // Delphinus
    "Del": ["Rotanev", "Sualocin"],
    // Dorado
    "Dor": ["Alpha Doradus"],
    // Draco
    "Dra": ["Etamin", "Aldibain"],
    // Equuleus
    "Equ": ["Kitalpha"],
    // Eridanus
    "Eri": ["Achernar", "Cursa"],
    // Fornax
    "For": ["Alpha Fornacis"],
    // Gemini
    "Gem": ["Pollux", "Castor"],
    // Grus
    "Gru": ["Alnair"],
    // Hercules
    "Her": ["Kornephoros", "Rasalgethi"],
    // Horologium
    "Hor": ["Alpha Horologii"],
    // Hydra
    "Hya": ["Alphard"],
    // Hydrus
    "Hyi": ["Alpha Hydri"],
    // Indus
    "Ind": ["Alpha Indi"],
    // Lacerta
    "Lac": ["Alpha Lacertae"],
    // Leo
    "Leo": ["Regulus", "Denebola"],
    // Leo Minor
    "LMi": ["46 Leo Minoris"],
    // Lepus
    "Lep": ["Arneb"],
    // Libra
    "Lib": ["Zubeneschamali", "Zubenelgenubi"],
    // Lupus
    "Lup": ["Alpha Lupi"],
    // Lynx
    "Lyn": ["Alpha Lyncis"],
    // Lyra
    "Lyr": ["Vega", "Sheliak"],
    // Mensa
    "Men": ["Alpha Mensae"],
    // Microscopium
    "Mic": ["Gamma Microscopii"],
    // Monoceros
    "Mon": ["Beta Monocerotis"],
    // Musca
    "Mus": ["Alpha Muscae"],
    // Norma
    "Nor": ["Gamma2 Normae"],
    // Octans
    "Oct": ["Nu Octantis"],
    // Ophiuchus
    "Oph": ["Rasalhague", "Sabik"],
    // Orion
    "Ori": ["Betelgeuse", "Rigel", "Bellatrix"],
    // Pavo
    "Pav": ["Peacock"],
    // Pegasus
    "Peg": ["Markab", "Scheat", "Algenib"],
    // Perseus
    "Per": ["Mirfak", "Algol"],
    // Phoenix
    "Phe": ["Ankaa"],
    // Pictor
    "Pic": ["Alpha Pictoris"],
    // Pisces
    "Psc": ["Alrescha", "Eta Piscium"],
    // Piscis Austrinus
    "PsA": ["Fomalhaut"],
    // Puppis
    "Pup": ["Naos"],
    // Pyxis
    "Pyx": ["Alpha Pyxidis"],
    // Reticulum
    "Ret": ["Alpha Reticuli"],
    // Sagitta
    "Sge": ["Gamma Sagittae"],
    // Sagittarius
    "Sgr": ["Kaus Australis", "Nunki"],
    // Scorpius
    "Sco": ["Antares", "Shaula"],
    // Sculptor
    "Scl": ["Alpha Sculptoris"],
    // Scutum
    "Sct": ["Alpha Scuti"],
    // Serpens
    "Ser": ["Unukalhai"],
    // Sextans
    "Sex": ["Alpha Sextantis"],
    // Taurus
    "Tau": ["Aldebaran", "Elnath"],
    // Telescopium
    "Tel": ["Alpha Telescopii"],
    // Triangulum
    "Tri": ["Beta Trianguli"],
    // Triangulum Australe
    "TrA": ["Atria"],
    // Tucana
    "Tuc": ["Alpha Tucanae"],
    // Ursa Major
    "UMa": ["Alioth", "Dubhe"],
    // Ursa Minor
    "UMi": ["Polaris", "Kochab"],
    // Vela
    "Vel": ["Suhail"],
    // Virgo
    "Vir": ["Spica", "Vindemiatrix"],
    // Volans
    "Vol": ["Beta Volantis"],
    // Vulpecula
    "Vul": ["Anser"]
};

// Function to find visible constellations
function getVisibleConstellations(observer) {
    const visibleConstellations = [];
    
    // For each constellation, check if any of its stars are visible
    for (const [constellation, stars] of Object.entries(constellationStars)) {
        let isVisible = false;
        
        for (const starName of stars) {
            if (starData[starName]) {
                const [raHours, decDeg] = starData[starName];
                
                // Create a celestial body for this star
                const star = new CelestialBody(starName, raHours, decDeg);
                
                // Calculate position for the observer
                const position = star.calculatePosition(observer);
                
                // Check if star is sufficiently above horizon
                if (position.altitude > MINIMUM_VISIBLE_ALTITUDE) {
                    isVisible = true;
                    break;
                }
            }
        }
        
        if (isVisible) {
            visibleConstellations.push(constellation);
        }
    }
    
    return visibleConstellations.sort();
}

// Main function to find constellations
function findConstellations() {
    try {
        // Create observer using configuration variables
        const observer = new Observer(OBSERVER_LATITUDE, OBSERVER_LONGITUDE, OBSERVER_ELEVATION);
        
        // Set date to current day at midnight
        const midnight = getCurrentMidnight();
        observer.setDate(midnight);
        
        // Calculate visible constellations
        const visibleConstellations = getVisibleConstellations(observer);
        
        // Format and display the results
        const location = OBSERVER_LOCATION_NAME;
        const latDir = OBSERVER_LATITUDE >= 0 ? 'N' : 'S';
        const lonDir = OBSERVER_LONGITUDE >= 0 ? 'E' : 'W';
        const coordinates = `${Math.abs(OBSERVER_LATITUDE).toFixed(4)}° ${latDir}, ${Math.abs(OBSERVER_LONGITUDE).toFixed(4)}° ${lonDir}`;
        const dateTime = `Midnight ${formatDate(midnight)}`;
        
        Ds.SendMessageStatus("Constellation Finder");
        Ds.SendMessageStatus("===================");
        Ds.SendMessageStatus(`Location: ${location}`);
        Ds.SendMessageStatus(`Coordinates: ${coordinates}`);
        Ds.SendMessageStatus(`Date/Time: ${dateTime}`);
        
        Ds.SendMessageStatus("Calculating visible constellations...");
        
        Ds.SendMessageStatus("Visible constellations:");
        Ds.SendMessageStatus("----------------------");
        visibleConstellations.forEach((constellation, i) => {
            Ds.SendMessageStatus(`${i + 1}. ${constellation}`);
        });
        
        Ds.SendMessageStatus(`Total: ${visibleConstellations.length} constellations visible`);
        
        // Save results to file
        saveResultsToFile({
            location: OBSERVER_LOCATION_NAME,
            coordinates: {
                latitude: OBSERVER_LATITUDE,
                longitude: OBSERVER_LONGITUDE,
                elevation: OBSERVER_ELEVATION
            },
            dateTime: dateTime,
            visibleConstellations: visibleConstellations
        });

        // Display errors if there are any
    } catch (error) {
        Ds.SendMessageError(`An error occurred: ${error.message}`);
        Ds.SendMessageError(error);
        return null;
    }
}

// Function to save results to a text file
function saveResultsToFile(results) {
    try {
        const { location, coordinates, dateTime, visibleConstellations } = results;
        
        // Format the content to write to file
        let content = "";
        
        visibleConstellations.forEach((constellation) => {
            content += `${constellation}\n`;
        });
        
        // Write to file
        Ds.FileWrite(OUTPUT_FILE_PATH, "r", content);
        Ds.SendMessageStatus(`Results saved to ${OUTPUT_FILE_PATH}`);
    } catch (error) {
        Ds.SendMessageError(`Error saving results to file: ${error.message}`);
    }
}

// Execute the constellation finder
const result = findConstellations();