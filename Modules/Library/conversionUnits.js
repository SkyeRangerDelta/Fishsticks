// ---- Conversion Units ----
// Unit category definitions, conversion factors, alias lookup map, autocomplete builder

const CURRENCY_CODES = require( './currencyCodes' );

// ---- Category Definitions ----
// Each category has a base unit. Every unit defines a `factor` (multiplier to convert
// 1 of that unit into the base unit). Temperature uses toBase/fromBase functions instead.
// Conversion formula (factor-based): result = value * (fromUnit.factor / toUnit.factor)
// Conversion formula (temperature): result = toUnit.fromBase( fromUnit.toBase( value ) )

const UNIT_CATEGORIES = {
    mass: {
        name: 'Mass / Weight',
        base: 'gram',
        units: {
            mg:             { name: 'Milligram',        factor: 0.001,          aliases: [ 'mg', 'milligram', 'milligrams' ] },
            g:              { name: 'Gram',             factor: 1,              aliases: [ 'g', 'gram', 'grams' ] },
            kg:             { name: 'Kilogram',         factor: 1000,           aliases: [ 'kg', 'kilogram', 'kilograms', 'kilo', 'kilos' ] },
            oz:             { name: 'Ounce',            factor: 28.3495,        aliases: [ 'oz', 'ounce', 'ounces' ] },
            lb:             { name: 'Pound',            factor: 453.592,        aliases: [ 'lb', 'lbs', 'pound', 'pounds' ] },
            st:             { name: 'Stone',            factor: 6350.29,        aliases: [ 'st', 'stone', 'stones' ] },
            uston:          { name: 'US Ton',           factor: 907185,         aliases: [ 'uston', 'us ton', 'short ton' ] },
            impton:         { name: 'Imperial Ton',     factor: 1.016e6,        aliases: [ 'impton', 'imperial ton', 'long ton' ] },
            tonne:          { name: 'Metric Tonne',     factor: 1e6,            aliases: [ 'tonne', 'tonnes', 'metric ton', 'metric tonne' ] },
            grain:          { name: 'Grain',            factor: 0.06479891,     aliases: [ 'grain', 'grains', 'gr' ] },
            dram:           { name: 'Dram',             factor: 1.77185,        aliases: [ 'dram', 'drams' ] },
            talent:         { name: 'Talent',           factor: 26000,          aliases: [ 'talent', 'talents' ] },
            mina:           { name: 'Mina',             factor: 433.3,          aliases: [ 'mina', 'minas', 'mna' ] },
            shekelweight:   { name: 'Shekel (weight)',  factor: 11.4,           aliases: [ 'shekelweight', 'shekel weight' ] }
        }
    },

    length: {
        name: 'Length / Distance',
        base: 'meter',
        units: {
            mm:             { name: 'Millimeter',       factor: 0.001,              aliases: [ 'mm', 'millimeter', 'millimeters', 'millimetre', 'millimetres' ] },
            cm:             { name: 'Centimeter',       factor: 0.01,               aliases: [ 'cm', 'centimeter', 'centimeters', 'centimetre', 'centimetres' ] },
            m:              { name: 'Meter',            factor: 1,                  aliases: [ 'm', 'meter', 'meters', 'metre', 'metres' ] },
            km:             { name: 'Kilometer',        factor: 1000,               aliases: [ 'km', 'kilometer', 'kilometers', 'kilometre', 'kilometres' ] },
            in:             { name: 'Inch',             factor: 0.0254,             aliases: [ 'in', 'inch', 'inches' ] },
            ft:             { name: 'Foot',             factor: 0.3048,             aliases: [ 'ft', 'foot', 'feet' ] },
            yd:             { name: 'Yard',             factor: 0.9144,             aliases: [ 'yd', 'yard', 'yards' ] },
            mi:             { name: 'Mile',             factor: 1609.344,           aliases: [ 'mi', 'mile', 'miles' ] },
            nmi:            { name: 'Nautical Mile',    factor: 1852,               aliases: [ 'nmi', 'nautical mile', 'nautical miles', 'nm' ] },
            fathom:         { name: 'Fathom',           factor: 1.8288,             aliases: [ 'fathom', 'fathoms' ] },
            furlong:        { name: 'Furlong',          factor: 201.168,            aliases: [ 'furlong', 'furlongs' ] },
            league:         { name: 'League',           factor: 4828.032,           aliases: [ 'league', 'leagues' ] },
            cubit:          { name: 'Cubit',            factor: 0.4572,             aliases: [ 'cubit', 'cubits' ] },
            span:           { name: 'Span',             factor: 0.2286,             aliases: [ 'span', 'spans' ] },
            rod:            { name: 'Rod',              factor: 5.0292,             aliases: [ 'rod', 'rods', 'perch', 'pole' ] },
            chain:          { name: 'Chain',            factor: 20.1168,            aliases: [ 'chain', 'chains' ] },
            hand:           { name: 'Hand',             factor: 0.1016,             aliases: [ 'hand', 'hands' ] },
            au:             { name: 'Astronomical Unit', factor: 1.496e11,          aliases: [ 'au', 'astronomical unit', 'astronomical units' ] },
            ly:             { name: 'Light Year',       factor: 9.461e15,           aliases: [ 'ly', 'light year', 'light years', 'lightyear', 'lightyears' ] },
            pc:             { name: 'Parsec',           factor: 3.086e16,           aliases: [ 'pc', 'parsec', 'parsecs' ] },
            futhark:        { name: 'Futhark',          factor: 0.2,               aliases: [ 'futhark', 'futharks' ] }
        }
    },

    temperature: {
        name: 'Temperature',
        base: 'kelvin',
        units: {
            c:  {
                name: 'Celsius',
                aliases: [ 'c', 'celsius', 'centigrade' ],
                toBase: v => v + 273.15,
                fromBase: v => v - 273.15
            },
            f:  {
                name: 'Fahrenheit',
                aliases: [ 'f', 'fahrenheit' ],
                toBase: v => ( v - 32 ) * 5 / 9 + 273.15,
                fromBase: v => ( v - 273.15 ) * 9 / 5 + 32
            },
            k:  {
                name: 'Kelvin',
                aliases: [ 'k', 'kelvin' ],
                toBase: v => v,
                fromBase: v => v
            },
            r:  {
                name: 'Rankine',
                aliases: [ 'r', 'rankine' ],
                toBase: v => v * 5 / 9,
                fromBase: v => v * 9 / 5
            }
        }
    },

    volume: {
        name: 'Volume',
        base: 'liter',
        units: {
            ml:             { name: 'Milliliter',       factor: 0.001,          aliases: [ 'ml', 'milliliter', 'milliliters', 'millilitre', 'millilitres' ] },
            l:              { name: 'Liter',            factor: 1,              aliases: [ 'l', 'liter', 'liters', 'litre', 'litres' ] },
            usgal:          { name: 'US Gallon',        factor: 3.78541,        aliases: [ 'usgal', 'us gallon', 'us gallons', 'gallon', 'gallons', 'gal' ] },
            impgal:         { name: 'Imperial Gallon',  factor: 4.54609,        aliases: [ 'impgal', 'imperial gallon', 'imperial gallons' ] },
            qt:             { name: 'Quart',            factor: 0.946353,       aliases: [ 'qt', 'quart', 'quarts' ] },
            pt:             { name: 'Pint',             factor: 0.473176,       aliases: [ 'pt', 'pint', 'pints' ] },
            cup:            { name: 'Cup',              factor: 0.236588,       aliases: [ 'cup', 'cups' ] },
            floz:           { name: 'Fluid Ounce',      factor: 0.0295735,      aliases: [ 'floz', 'fl oz', 'fluid ounce', 'fluid ounces' ] },
            tbsp:           { name: 'Tablespoon',       factor: 0.0147868,      aliases: [ 'tbsp', 'tablespoon', 'tablespoons' ] },
            tsp:            { name: 'Teaspoon',         factor: 0.00492892,     aliases: [ 'tsp', 'teaspoon', 'teaspoons' ] },
            m3:             { name: 'Cubic Meter',      factor: 1000,           aliases: [ 'm3', 'cubic meter', 'cubic meters', 'cubic metre', 'cubic metres' ] },
            ft3:            { name: 'Cubic Foot',       factor: 28.3168,        aliases: [ 'ft3', 'cubic foot', 'cubic feet' ] },
            in3:            { name: 'Cubic Inch',       factor: 0.0163871,      aliases: [ 'in3', 'cubic inch', 'cubic inches' ] },
            barrel:         { name: 'Barrel',           factor: 158.987,        aliases: [ 'barrel', 'barrels', 'bbl' ] },
            gill:           { name: 'Gill',             factor: 0.118294,       aliases: [ 'gill', 'gills' ] },
            bushel:         { name: 'Bushel',           factor: 35.2391,        aliases: [ 'bushel', 'bushels' ] },
            peck:           { name: 'Peck',             factor: 8.80977,        aliases: [ 'peck', 'pecks' ] },
            hogshead:       { name: 'Hogshead',         factor: 238.481,        aliases: [ 'hogshead', 'hogsheads' ] },
            firkin:         { name: 'Firkin',            factor: 40.9148,        aliases: [ 'firkin', 'firkins' ] }
        }
    },

    area: {
        name: 'Area',
        base: 'sqm',
        units: {
            mm2:            { name: 'Square Millimeter', factor: 1e-6,          aliases: [ 'mm2', 'sq mm', 'square millimeter', 'square millimeters' ] },
            cm2:            { name: 'Square Centimeter', factor: 1e-4,          aliases: [ 'cm2', 'sq cm', 'square centimeter', 'square centimeters' ] },
            m2:             { name: 'Square Meter',     factor: 1,              aliases: [ 'm2', 'sq m', 'square meter', 'square meters', 'sqm' ] },
            km2:            { name: 'Square Kilometer',  factor: 1e6,           aliases: [ 'km2', 'sq km', 'square kilometer', 'square kilometers' ] },
            in2:            { name: 'Square Inch',      factor: 6.4516e-4,      aliases: [ 'in2', 'sq in', 'square inch', 'square inches' ] },
            ft2:            { name: 'Square Foot',      factor: 0.092903,       aliases: [ 'ft2', 'sq ft', 'square foot', 'square feet' ] },
            yd2:            { name: 'Square Yard',      factor: 0.836127,       aliases: [ 'yd2', 'sq yd', 'square yard', 'square yards' ] },
            mi2:            { name: 'Square Mile',      factor: 2.59e6,         aliases: [ 'mi2', 'sq mi', 'square mile', 'square miles' ] },
            acre:           { name: 'Acre',             factor: 4046.86,        aliases: [ 'acre', 'acres' ] },
            hectare:        { name: 'Hectare',          factor: 10000,          aliases: [ 'hectare', 'hectares', 'ha' ] },
            rood:           { name: 'Rood',             factor: 1011.71,        aliases: [ 'rood', 'roods' ] },
            hide:           { name: 'Hide',             factor: 485000,         aliases: [ 'hide', 'hides' ] }
        }
    },

    speed: {
        name: 'Speed',
        base: 'm/s',
        units: {
            'ms':           { name: 'Meters/sec',       factor: 1,              aliases: [ 'm/s', 'meters per second', 'metres per second', 'mps' ] },
            'kmh':          { name: 'Kilometers/hr',    factor: 0.277778,       aliases: [ 'km/h', 'kmh', 'kph', 'kilometers per hour', 'kilometres per hour' ] },
            'mph':          { name: 'Miles/hr',         factor: 0.44704,        aliases: [ 'mph', 'miles per hour' ] },
            'knot':         { name: 'Knot',             factor: 0.514444,       aliases: [ 'knot', 'knots', 'kn', 'kt' ] },
            'fts':          { name: 'Feet/sec',         factor: 0.3048,         aliases: [ 'ft/s', 'fps', 'feet per second' ] },
            'mach':         { name: 'Mach',             factor: 343,            aliases: [ 'mach' ] },
            'lightspeed':   { name: 'Speed of Light',   factor: 299792458,      aliases: [ 'speed of light', 'lightspeed', 'sol' ] }
        }
    },

    time: {
        name: 'Time',
        base: 'second',
        units: {
            ms:             { name: 'Millisecond',      factor: 0.001,          aliases: [ 'millisecond', 'milliseconds' ] },
            s:              { name: 'Second',           factor: 1,              aliases: [ 's', 'sec', 'second', 'seconds' ] },
            min:            { name: 'Minute',           factor: 60,             aliases: [ 'min', 'minute', 'minutes' ] },
            hr:             { name: 'Hour',             factor: 3600,           aliases: [ 'hr', 'hour', 'hours' ] },
            day:            { name: 'Day',              factor: 86400,          aliases: [ 'day', 'days' ] },
            week:           { name: 'Week',             factor: 604800,         aliases: [ 'week', 'weeks', 'wk' ] },
            month:          { name: 'Month',            factor: 2629746,        aliases: [ 'month', 'months', 'mo' ] },
            year:           { name: 'Year',             factor: 31556952,       aliases: [ 'year', 'years', 'yr' ] },
            decade:         { name: 'Decade',           factor: 315569520,      aliases: [ 'decade', 'decades' ] },
            century:        { name: 'Century',          factor: 3155695200,     aliases: [ 'century', 'centuries' ] },
            fortnight:      { name: 'Fortnight',        factor: 1209600,        aliases: [ 'fortnight', 'fortnights' ] }
        }
    },

    digital: {
        name: 'Digital Storage',
        base: 'byte',
        units: {
            bit:            { name: 'Bit',              factor: 0.125,          aliases: [ 'bit', 'bits' ] },
            b:              { name: 'Byte',             factor: 1,              aliases: [ 'b', 'byte', 'bytes' ] },
            kb:             { name: 'Kilobyte',         factor: 1024,           aliases: [ 'kb', 'kilobyte', 'kilobytes' ] },
            mb:             { name: 'Megabyte',         factor: 1048576,        aliases: [ 'megabyte', 'megabytes' ] },
            gb:             { name: 'Gigabyte',         factor: 1073741824,     aliases: [ 'gb', 'gigabyte', 'gigabytes' ] },
            tb:             { name: 'Terabyte',         factor: 1099511627776,  aliases: [ 'tb', 'terabyte', 'terabytes' ] },
            pb:             { name: 'Petabyte',         factor: 1.126e15,       aliases: [ 'pb', 'petabyte', 'petabytes' ] }
        }
    },

    energy: {
        name: 'Energy',
        base: 'joule',
        units: {
            j:              { name: 'Joule',            factor: 1,              aliases: [ 'j', 'joule', 'joules' ] },
            kj:             { name: 'Kilojoule',        factor: 1000,           aliases: [ 'kj', 'kilojoule', 'kilojoules' ] },
            cal:            { name: 'Calorie',          factor: 4.184,          aliases: [ 'cal', 'calorie', 'calories' ] },
            kcal:           { name: 'Kilocalorie',      factor: 4184,           aliases: [ 'kcal', 'kilocalorie', 'kilocalories' ] },
            wh:             { name: 'Watt-hour',        factor: 3600,           aliases: [ 'wh', 'watt hour', 'watt-hour' ] },
            kwh:            { name: 'Kilowatt-hour',    factor: 3600000,        aliases: [ 'kwh', 'kilowatt hour', 'kilowatt-hour' ] },
            btu:            { name: 'BTU',              factor: 1055.06,        aliases: [ 'btu', 'btus' ] },
            ev:             { name: 'Electron Volt',    factor: 1.602e-19,      aliases: [ 'ev', 'electron volt', 'electron volts' ] },
            erg:            { name: 'Erg',              factor: 1e-7,           aliases: [ 'erg', 'ergs' ] }
        }
    },

    pressure: {
        name: 'Pressure',
        base: 'pascal',
        units: {
            pa:             { name: 'Pascal',           factor: 1,              aliases: [ 'pa', 'pascal', 'pascals' ] },
            kpa:            { name: 'Kilopascal',       factor: 1000,           aliases: [ 'kpa', 'kilopascal', 'kilopascals' ] },
            bar:            { name: 'Bar',              factor: 100000,         aliases: [ 'bar', 'bars' ] },
            atm:            { name: 'Atmosphere',       factor: 101325,         aliases: [ 'atm', 'atmosphere', 'atmospheres' ] },
            psi:            { name: 'PSI',              factor: 6894.76,        aliases: [ 'psi' ] },
            mmhg:           { name: 'mmHg',             factor: 133.322,        aliases: [ 'mmhg', 'mm hg', 'torr' ] },
            inhg:           { name: 'inHg',             factor: 3386.39,        aliases: [ 'inhg', 'in hg' ] }
        }
    },

    currency: {
        name: 'Currency',
        base: 'usd',
        units: {}
    }
};

// Build currency units from the currency codes module
for ( const [ code, displayName ] of Object.entries( CURRENCY_CODES ) ) {
    UNIT_CATEGORIES.currency.units[ code ] = {
        name: displayName,
        aliases: [ code ]
    };
}

// ---- Alias Lookup Map ----
// Built once at require() time. Maps every alias (lowercased) to { category, unitKey }
const UNIT_MAP = {};

for ( const [ categoryKey, category ] of Object.entries( UNIT_CATEGORIES ) ) {
    for ( const [ unitKey, unit ] of Object.entries( category.units ) ) {
        for ( const alias of unit.aliases ) {
            UNIT_MAP[ alias.toLowerCase() ] = { category: categoryKey, unitKey };
        }
    }
}

// ---- Autocomplete Choices Builder ----
// Pre-built map keyed by category for filtered autocomplete responses
function buildAutocompleteMap() {
    const map = {};

    for ( const [ categoryKey, category ] of Object.entries( UNIT_CATEGORIES ) ) {
        map[ categoryKey ] = [];
        for ( const [ unitKey, unit ] of Object.entries( category.units ) ) {
            const primaryAlias = unit.aliases[ 0 ];
            map[ categoryKey ].push( {
                name: `${ unit.name } (${ primaryAlias })`,
                value: primaryAlias
            } );
        }
    }

    return map;
}

const AUTOCOMPLETE_MAP = buildAutocompleteMap();

module.exports = {
    UNIT_CATEGORIES,
    UNIT_MAP,
    AUTOCOMPLETE_MAP
};
