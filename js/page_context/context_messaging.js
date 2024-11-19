function print_response ( response ) 
{
    if ( response ) 
    {
        console.log( response );
    };
};

function message_to_background ( method, payload ) 
{
    const com = 
    {
        method  : method,
        payload : payload
    };
    const RESPONSE = new Promise 
    (
        ( RESOLVE, REJ ) => 
        {
            chrome.runtime.sendMessage 
            ( 
                com, 
                ( RESPONSE_GOTTEN ) => 
                {
                    RESOLVE ( RESPONSE_GOTTEN );
                    //print_response ( RESPONSE_GOTTEN );
                } 
            );
        }
    );

    return RESPONSE;
};

function handle_request ( message, sender, sendResponse ) 
{
    const method    = message.method;
    const payload   = message.payload; 

    switch ( method ) 
    {
        /**/
    };

    return true;
};

chrome.runtime.onMessage.addListener ( handle_request );