let add_one_minute_interval = null;

const extract_hostname = ( url ) => 
{
    let hostname = url.indexOf('//') > -1 ? url.split('/')[2] : url.split('/')[0];

    // Find & remove port number
    hostname = hostname.split(':')[0];
    // Find & remove "?"
    hostname = hostname.split('?')[0];

    return hostname;
};

// SAVES THE ADDITION OF ALL BYTES CONETNT DOWNLOADED PER ORIGIN HOST:
const set_byte_length_per_origin = async ( ORIGIN, BYTE_LENGTH ) => 
{
    //const stats = localStorage.getItem('stats');
    const stats = (await get_storage( "stats" )).stats;
    const stats_json = stats === null ? {} : JSON.parse(stats);
    let byte_per_origin = stats_json[ ORIGIN ] === undefined ? 0 : parseInt(stats_json[ORIGIN]);

    stats_json[ ORIGIN ] = byte_per_origin + BYTE_LENGTH;
    //localStorage.setItem('stats', JSON.stringify(stats_json));
    await set_storage( { "stats" : JSON.stringify(stats_json) } );
};

// HANDLES THE DATA GOTTEN FROM webRequest.onCompleted :
const webRequestOnCompleted_handler = ( REQUEST_DETAILS ) => 
{
    const origin = extract_hostname( !REQUEST_DETAILS.initiator ? REQUEST_DETAILS.url : REQUEST_DETAILS.initiator );
    const response_headers_content_length = REQUEST_DETAILS.responseHeaders.find(
        ( element ) => element.name.toLowerCase() === 'content-length'
    );

    const content_length = response_headers_content_length == null 
        ? { "value": 0 }
        : response_headers_content_length;

    const request_size = parseInt( content_length.value, 10 );
    set_byte_length_per_origin( origin, request_size );
};

// ADDS ONE MINUTE TO THE TIMER RUNNING WHICH SETS THE ANALYSIS PROGRESS RUNNING TIME:
const add_one_minute = async () => 
{
    let duration = (await get_storage( "duration" )).duration;
    duration = duration === null ? 1 : 1 * duration + 1;
    await set_storage( { "duration" : duration } );
};

function START_CARBONALYSER_ANALYSIS () 
{
    // SETS THE ON/OFF STATE IN THE EXTENSION ICON BADGE:
    set_badge( "ON", "#63ff52" );

    chrome.webRequest.onCompleted.addListener(
        webRequestOnCompleted_handler,
        { "urls": ['<all_urls>'] },
        [ "responseHeaders" ]
    );

    if ( add_one_minute_interval == null ) 
    {
        add_one_minute_interval = setInterval( add_one_minute, 60000 );
    };
};

function STOP_CARBONALYSER_ANALYSIS () 
{
    // SETS THE ON/OFF STATE IN THE EXTENSION ICON BADGE:
    set_badge( "OFF", "red" );

    chrome.webRequest.onCompleted.removeListener( webRequestOnCompleted_handler );

    if ( add_one_minute_interval ) 
    {
        clearInterval( add_one_minute_interval );
        add_one_minute_interval = null;
    };
};