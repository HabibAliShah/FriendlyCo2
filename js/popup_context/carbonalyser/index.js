
/**
 *      CARBONALYSER MEASUREMENT CONSTANTS: 
 */
const default_carbon_intensity_factor_ing_co2_per_kwh = 519;
const kwh_per_byte_data_center = 0.000000000072;
const kwh_per_byte_network = 0.000000000152;
const kwh_per_minute_device = 0.00021;
const ges_gco2_for_one_km_by_car = 220;
const ges_gco2_for_one_charged_smartphone = 8.3;
//
const default_location = "regionOther";
let user_location = default_location;
const carbon_intensity_factor_ing_co2_per_kwh = 
{
    "regionEuropeanUnion": 276,
    "regionFrance": 34.8,
    "regionUnitedStates": 493,
    "regionChina": 681,
    "regionOther": default_carbon_intensity_factor_ing_co2_per_kwh
};

/**
 *      CARBONALYSER CORE:
 */
const parse_stats = async () => 
{
    const stats = (await get_storage("stats")).stats;
    return stats === null ? {} : JSON.parse(stats);
};

const get_stats = async () => 
{
    const stats = await parse_stats();
    const sorted_stats = [];
    let total = 0;
    
    for ( let origin in stats ) 
    {
        total += stats[origin];
        sorted_stats.push({ "origin": origin, "byte": stats[origin] });
    }

    sorted_stats.sort(( a, b ) => a.byte < b.byte ? 1 : a.byte > b.byte ? -1 : 0);

    const highest_stats = sorted_stats.slice(0, 4);
    let subtotal = 0;
    for ( let index in highest_stats ) 
    {
        subtotal += highest_stats[index].byte;
    }

    if ( total > 0 ) 
    {
        const remaining = total - subtotal;
        if ( remaining > 0 ) 
        {
            highest_stats.push({ "origin": "Others", "byte": remaining });
        }

        highest_stats.forEach(( item ) => 
        {
            item.percent = Math.round(100 * item.byte / total);
        });
    }

    return {
        "total": total,
        "highestStats": highest_stats
    };
};

async function get_quivalent_stats ( stats ) 
{
    const DURATION = (await get_storage("duration")).duration;
    const USER_LOCATION_OPTION = (await get_storage("OPTIONS")).OPTIONS["carbon_intensity_factor_ing_co2_per_kwh"].value;
    const EQUIVALENT_STATS = {};

    EQUIVALENT_STATS["duration"] = DURATION === null ? 0 : DURATION;
    EQUIVALENT_STATS["kwh_data_center_total"] = stats.total * kwh_per_byte_data_center;
    EQUIVALENT_STATS["ges_data_center_total"] = EQUIVALENT_STATS["kwh_data_center_total"] * default_carbon_intensity_factor_ing_co2_per_kwh;
    EQUIVALENT_STATS["kwh_network_total"] = stats.total * kwh_per_byte_network;
    EQUIVALENT_STATS["ges_network_total"] = EQUIVALENT_STATS["kwh_network_total"] * default_carbon_intensity_factor_ing_co2_per_kwh;
    EQUIVALENT_STATS["kwh_device_total"] = EQUIVALENT_STATS["duration"] * kwh_per_minute_device;
    EQUIVALENT_STATS["ges_device_total"] = EQUIVALENT_STATS["kwh_device_total"] * carbon_intensity_factor_ing_co2_per_kwh[ USER_LOCATION_OPTION != null ? USER_LOCATION_OPTION : user_location ];
    EQUIVALENT_STATS["kwh_total"] = Math.round(1000 * (EQUIVALENT_STATS["kwh_data_center_total"] + EQUIVALENT_STATS["kwh_network_total"] + EQUIVALENT_STATS["kwh_device_total"])) / 1000;
    EQUIVALENT_STATS["gco2_total"] = Math.round(EQUIVALENT_STATS["ges_data_center_total"] + EQUIVALENT_STATS["ges_network_total"] + EQUIVALENT_STATS["ges_device_total"]);
    EQUIVALENT_STATS["km_by_car"] = Math.round(1000 * EQUIVALENT_STATS["gco2_total"] / ges_gco2_for_one_km_by_car) / 1000;
    EQUIVALENT_STATS["charged_smartphones"] = Math.round(EQUIVALENT_STATS["gco2_total"] / ges_gco2_for_one_charged_smartphone);
    EQUIVALENT_STATS["mega_byte_total"] = to_mega_byte( stats.total );

    return EQUIVALENT_STATS;
};

const to_mega_byte = ( value ) => 
{
    return Math.round(value / 1024 / 1024);
};

const start_carbonalyser = async () => 
{
    update_stats( (await get_quivalent_stats((await get_stats()))) );
    enable_stats();
    message_to_background( "START_CARBONALYSER_ANALYSIS" );
    await set_storage( { "analysisStarted" : "1" } );
};

const stop_carbonalyser = async () => 
{
    reset_stats();
    disable_stats();
    message_to_background( "STOP_CARBONALYSER_ANALYSIS" );
    await set_storage( { "analysisStarted" : null } );
};

const reset_carbonalyser = async () => 
{
    await set_storage( { "stats" : null } );
    await set_storage( { "duration" : null } );
    enable_stats();
};