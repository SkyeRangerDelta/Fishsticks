//----CONVERT----
//Universal unit conversion command

//Imports
const axios = require( 'axios' );
const { SlashCommandBuilder } = require( '@discordjs/builders' );
const { MessageFlags } = require( 'discord-api-types/v10' );

const { embedBuilder } = require( '../../Modules/Utility/Utils_EmbedBuilder' );
const { getErrorResponse } = require( '../../Modules/Core/Core_GPT' );
const { log } = require( '../../Modules/Utility/Utils_Log' );

const { UNIT_CATEGORIES, UNIT_MAP, AUTOCOMPLETE_MAP } = require( '../../Modules/Library/conversionUnits' );

//Constants
const CURRENCY_API_PRIMARY = 'https://cdn.jsdelivr.net/npm/@fawazahmed0/currency-api@latest/v1/currencies/usd.json';
const CURRENCY_API_FALLBACK = 'https://latest.currency-api.pages.dev/v1/currencies/usd.json';
const CACHE_TTL = 3600000; // 1 hour in ms

//Command Definition
const data = new SlashCommandBuilder()
    .setName( 'convert' )
    .setDescription( 'Convert between units, currencies, and more!' )
    .addStringOption( o => o
        .setName( 'category' )
        .setDescription( 'The category of conversion.' )
        .setRequired( true )
        .addChoices(
            { name: 'Mass / Weight', value: 'mass' },
            { name: 'Length / Distance', value: 'length' },
            { name: 'Temperature', value: 'temperature' },
            { name: 'Volume', value: 'volume' },
            { name: 'Area', value: 'area' },
            { name: 'Speed', value: 'speed' },
            { name: 'Time', value: 'time' },
            { name: 'Digital Storage', value: 'digital' },
            { name: 'Energy', value: 'energy' },
            { name: 'Pressure', value: 'pressure' },
            { name: 'Currency', value: 'currency' }
        ) )
    .addNumberOption( o => o
        .setName( 'value' )
        .setDescription( 'The numeric value to convert.' )
        .setRequired( true ) )
    .addStringOption( o => o
        .setName( 'from' )
        .setDescription( 'The unit to convert from.' )
        .setRequired( true )
        .setAutocomplete( true ) )
    .addStringOption( o => o
        .setName( 'to' )
        .setDescription( 'The unit to convert to.' )
        .setRequired( true )
        .setAutocomplete( true ) );

//Functions
async function run( fishsticks, int ) {
    const categoryKey = int.options.getString( 'category' );
    const value = int.options.getNumber( 'value' );
    const fromInput = int.options.getString( 'from' ).toLowerCase().trim();
    const toInput = int.options.getString( 'to' ).toLowerCase().trim();

    const category = UNIT_CATEGORIES[ categoryKey ];

    //Resolve units
    const fromLookup = UNIT_MAP[ fromInput ];
    const toLookup = UNIT_MAP[ toInput ];

    if ( !fromLookup || fromLookup.category !== categoryKey ) {
        return int.reply( {
            content: `${ await getErrorResponse( int.member.displayName, 'convert', `tried to convert from "${ fromInput }" but that isn't a recognized ${ category.name } unit` ) }\nI don't recognize \`${ fromInput }\` as a ${ category.name } unit. Try using autocomplete!`,
            flags: MessageFlags.Ephemeral
        } );
    }

    if ( !toLookup || toLookup.category !== categoryKey ) {
        return int.reply( {
            content: `${ await getErrorResponse( int.member.displayName, 'convert', `tried to convert to "${ toInput }" but that isn't a recognized ${ category.name } unit` ) }\nI don't recognize \`${ toInput }\` as a ${ category.name } unit. Try using autocomplete!`,
            flags: MessageFlags.Ephemeral
        } );
    }

    const fromUnit = category.units[ fromLookup.unitKey ];
    const toUnit = category.units[ toLookup.unitKey ];

    let result;
    let footerExtra = '';

    //Currency conversion
    if ( categoryKey === 'currency' ) {
        await int.deferReply();

        const rateData = await fetchCurrencyRates( fishsticks );

        if ( !rateData ) {
            return int.editReply( {
                content: `${ await getErrorResponse( int.member.displayName, 'convert', `the currency API is down and there are no cached rates` ) }\nCouldn't fetch exchange rates. Try again shortly.`
            } );
        }

        const rates = rateData.rates;
        const fromRate = rates[ fromLookup.unitKey ];
        const toRate = rates[ toLookup.unitKey ];

        if ( !fromRate || !toRate ) {
            return int.editReply( {
                content: `Couldn't find exchange rate data for one of those currencies.`
            } );
        }

        result = value * ( toRate / fromRate );

        //Rate age note
        const ageMs = Date.now() - rateData.fetchedAt;
        const ageMins = Math.floor( ageMs / 60000 );
        if ( ageMins > 60 ) {
            footerExtra = ` | Rates from ${ Math.floor( ageMins / 60 ) }h ${ ageMins % 60 }m ago (stale)`;
        }
        else {
            footerExtra = ` | Rates from ${ ageMins }m ago`;
        }
    }
    //Temperature conversion
    else if ( categoryKey === 'temperature' ) {
        result = toUnit.fromBase( fromUnit.toBase( value ) );
    }
    //Factor-based conversion
    else {
        result = value * ( fromUnit.factor / toUnit.factor );
    }

    //Format result
    const formattedResult = formatResult( result );
    const formattedValue = formatResult( value );

    //Same unit check
    let description = `**${ formattedValue }** ${ fromUnit.name } = **${ formattedResult }** ${ toUnit.name }`;
    if ( fromLookup.unitKey === toLookup.unitKey ) {
        description += `\n*Well... that was easy.*`;
    }

    //Build embed
    const convertPanel = {
        title: 'o0o - Unit Conversion - o0o',
        description,
        color: fishsticks.CONFIG.colors.primary,
        footer: {
            text: `Converted by ${ int.member.displayName }${ footerExtra }`
        },
        fields: [
            {
                name: 'From',
                value: `${ fromUnit.name } (${ fromUnit.aliases[ 0 ] })`,
                inline: true
            },
            {
                name: 'To',
                value: `${ toUnit.name } (${ toUnit.aliases[ 0 ] })`,
                inline: true
            },
            {
                name: 'Category',
                value: category.name,
                inline: true
            }
        ]
    };

    //Reply
    if ( int.deferred ) {
        return int.editReply( { embeds: [ embedBuilder( fishsticks, convertPanel ) ] } );
    }
    return int.reply( { embeds: [ embedBuilder( fishsticks, convertPanel ) ] } );
}

async function autocomplete( fishsticks, interaction ) {
    const focused = interaction.options.getFocused( true );
    const search = focused.value.toLowerCase().trim();
    const categoryKey = interaction.options.getString( 'category' );

    //Get choices scoped to the selected category
    const pool = categoryKey && AUTOCOMPLETE_MAP[ categoryKey ]
        ? AUTOCOMPLETE_MAP[ categoryKey ]
        : [];

    let filtered;
    if ( !search ) {
        filtered = pool.slice( 0, 25 );
    }
    else {
        filtered = pool.filter( c =>
            c.name.toLowerCase().includes( search ) ||
            c.value.toLowerCase().includes( search )
        ).slice( 0, 25 );
    }

    await interaction.respond( filtered );
}

//Helpers
async function fetchCurrencyRates( fishsticks ) {
    //Check cache
    if ( fishsticks.CURRENCY_CACHE && ( Date.now() - fishsticks.CURRENCY_CACHE.fetchedAt ) < CACHE_TTL ) {
        return fishsticks.CURRENCY_CACHE;
    }

    //Fetch fresh rates
    try {
        const response = await axios.get( CURRENCY_API_PRIMARY, { timeout: 5000 } );
        const rateData = {
            rates: response.data.usd,
            fetchedAt: Date.now()
        };
        fishsticks.CURRENCY_CACHE = rateData;
        log( 'info', '[CONVERT] Currency rates fetched successfully.' );
        return rateData;
    }
    catch ( primaryErr ) {
        log( 'warn', '[CONVERT] Primary currency API failed: ' + primaryErr.message );
    }

    //Try fallback
    try {
        const response = await axios.get( CURRENCY_API_FALLBACK, { timeout: 5000 } );
        const rateData = {
            rates: response.data.usd,
            fetchedAt: Date.now()
        };
        fishsticks.CURRENCY_CACHE = rateData;
        log( 'info', '[CONVERT] Currency rates fetched from fallback.' );
        return rateData;
    }
    catch ( fallbackErr ) {
        log( 'warn', '[CONVERT] Fallback currency API failed: ' + fallbackErr.message );
    }

    //Return stale cache if available
    if ( fishsticks.CURRENCY_CACHE ) {
        log( 'warn', '[CONVERT] Using stale currency cache.' );
        return fishsticks.CURRENCY_CACHE;
    }

    return null;
}

function formatResult( value ) {
    if ( value === 0 ) return '0';

    const abs = Math.abs( value );

    //Very small or very large -> scientific notation
    if ( abs < 0.0001 || abs >= 1e12 ) {
        return value.toExponential( 4 );
    }

    //Normal range -> up to 4 decimal places, strip trailing zeros
    return parseFloat( value.toFixed( 4 ) ).toString();
}

function help() {
    return 'Converts between units of measurement, currencies, and more. Supports ~150 units across mass, length, temperature, volume, area, speed, time, digital storage, energy, pressure, and live currency rates.';
}

//Exports
module.exports = {
    name: 'convert',
    data,
    run,
    autocomplete,
    help
};
