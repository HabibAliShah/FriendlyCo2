/**
 *   IMPORT SWERVICE WORKER MODULES TO SERVICE WORKER CONTEXT:
 */
const EXTENSION_MANIFEST = chrome.runtime.getManifest ();
const SW_scripts = EXTENSION_MANIFEST.background["SW_scripts"];

self.importScripts.apply( null, SW_scripts );

(async () => {

	/**
	 * 
	 *
	 *   SET STORAGE KEYS:
	 * 
	 *  
	 */
	let STORAGE_INFO = await get_storage ( GLOBALS.storage_keys );

	for ( let [storage_name, storage_value] of Object.entries ( GLOBALS.storage_keys ) ) 
	{
		if ( STORAGE_INFO[ storage_name ] == null || STORAGE_INFO[ storage_name ] == undefined ) 
		{
			STORAGE_INFO[ storage_name ] = storage_value;
		};
	};

	// EXTENSION APP OPTIONS :
	for ( let option_item in GLOBALS.app_options ) 
	{
		if ( STORAGE_INFO["OPTIONS"][ option_item ] == null || STORAGE_INFO["OPTIONS"][ option_item ] == undefined ) 
		{
			STORAGE_INFO["OPTIONS"][ option_item ] = GLOBALS.app_options[ option_item ];
		};
	};

	await set_storage ( STORAGE_INFO );

	// await set_alarms ();

	/**
	 * 
	 *
	 *   IF CARBONALYSER LAST ON/OFF STATE IS ON THEN AUTOMATICALLY START ANALYSIS WHEN USER STARTS THE BROWSER:
	 * 
	 *  
	 */
	STORAGE_INFO = await get_storage([ "analysisStarted" ]);

	if ( STORAGE_INFO["analysisStarted"] == "1" )
		STOP_CARBONALYSER_ANALYSIS(),
		START_CARBONALYSER_ANALYSIS(),
		console.log( "Carbonalyser Analysis resumed" );
})();