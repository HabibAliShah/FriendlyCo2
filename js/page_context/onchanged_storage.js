
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
			if ( KEYS[ "start_app_confirmed" ]["newValue"] == true ) 
			{
				/**/
			};
		};
	}
);