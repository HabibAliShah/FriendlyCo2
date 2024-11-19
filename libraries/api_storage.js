/**
 * 
 *
 * 
 *    CHROME EXTENSION CORE: STORAGE.
 * 
 * 
 *  
 */

function get_storage ( KEYS ) 
{
	const STORAGE = new Promise 
	(
		( RESOLVE, REJECT ) => 
		{
			local_storage.get 
			(
				KEYS,
				( INFO ) => 
				{
					RESOLVE( INFO );
				}
			);
		}
	);

	return STORAGE;
};

function set_storage ( DATA ) 
{
	const STORAGE = new Promise 
	(
		( RESOLVE, REJECT ) => 
		{
			local_storage.set 
			(
				DATA,
				() => 
				{
					RESOLVE( DATA );
				}
			);
		}
	);

	return STORAGE;
};
