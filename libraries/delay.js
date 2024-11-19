/**
 * 
 *
 * 
 *    CHROME EXTENSION UTIL: delay.
 * 
 * 
 *  
 */

function delay ( TIME ) 
{
	return new Promise 
	(
		( RES, REJ ) => 
		{
			setTimeout( RES, TIME );
		}
	);
};

function delay_condition ( CONDITION, INTERVAL_TIME, MAX_TRIES=20 ) 
{
	let ATTEMPT_TRIES = 0;

	return new Promise
	(
		( resolve, reject ) => 
		{
			const interval = setInterval
			(
				async () => 
				{
					console.log(Date.now());

					const condition = await CONDITION();

					if ( ATTEMPT_TRIES >= MAX_TRIES * INTERVAL_TIME ) 
					{
						clearInterval(interval);
						reject(CONDITION());
					};

					if ( condition ) 
					{
						clearInterval(interval);
						resolve(CONDITION());
					} 
					else 
					{
						console.log(Date.now());
						ATTEMPT_TRIES += 1;
					}
				}, 
				INTERVAL_TIME
			);
		}
	).catch (
		( ERROR ) => 
		{
			ATTEMPT_TRIES = MAX_TRIES;
			console.log( "DELAY CONDITION ERROR:" );
			console.log( ERROR );
		}
	);
};