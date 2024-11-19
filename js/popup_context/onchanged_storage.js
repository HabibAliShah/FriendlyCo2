
/**
 *
 * 		AUTOMATICALLY EXECUTE ACTIONS WHENSTORAGE ITEMS CHANGES THEIR STATES:
 *  
 */

chrome.storage.onChanged.addListener 
(
	async ( KEYS ) => 
	{
		if ( KEYS[ "start_app_confirmed" ] ) 
		{
			location.reload();
		};
		if ( KEYS[ "TASKS_LOG" ] ) 
		{
			show_logged_tasks ();
		};
		if ( KEYS[ "extension_state" ] ) 
		{
			update_states_info_component();
			message_to_background( "RELOAD_TABS", { "url_match" : [] } );
		};

		/**
		 *	
		 * 
		 * 
		 * 
		 * 	CARBONALYSER:
		 * 
		 * 
		 * 
		 *
		 **/

		// AUTOMATICALLY UPDATE UI STATS WHEN THEY CHAGED THEIR STATE IN THE STORAGE:

		if ( KEYS[ "stats" ] || KEYS[ "duration" ] ) 
		{
			update_stats( (await get_quivalent_stats((await get_stats()))) );
		};	
		
		if ( KEYS[ "OPTIONS" ] ) 
		{
			if ( KEYS[ "OPTIONS" ]["newValue"] ) 
			{
				/**/
				translate_ui_strings( KEYS[ "OPTIONS" ]["newValue"].app_language.value );

				const STORAGE_INFO = await get_storage([ "analysisStarted" ]);

				if ( STORAGE_INFO["analysisStarted"] == "1" ) 
				{
					stop_carbonalyser();
					start_carbonalyser();
				};
			};
		};
	}
);