/**
 *
 * 		POPUP UI VIEW MODEL CONTROLLERS:
 *  
 */

function create_state_info_item_component ( STATE ) 
{
	const COMPONENT = components.create 
	( 
		GLOBALS.popup_context.ui.components.state_info_item["html"], 
		[ "fade-in" ], 
		{} 
	);	

	COMPONENT.getElementsByTagName ( "text" )[ 0 ].innerText = STATE["value"];

	set_listeners ( COMPONENT );

	return COMPONENT;
};

async function create_settings_item_component ( STATE ) 
{
	if ( STATE["type"] ) 
	{
		const OPTIONS_SETTINGS_COMPONENTS = GLOBALS.popup_context.ui.components.OPTIONS_SETTINGS;
		const COMPONENT = components.create 
		( 
			OPTIONS_SETTINGS_COMPONENTS[ STATE["type"] ]["html"], 
			[ "fade-in" ], 
			{
				"option_id" : STATE["option_id"]
			} 
		);	
		const OPTION_VALUE = COMPONENT.querySelector( '[id="option_value"]' );

		switch ( STATE["type"] ) 
		{
			case "input":

				OPTION_VALUE.setAttribute ( "listener_id", OPTIONS_SETTINGS_COMPONENTS[ STATE["type"] ].id );	
				OPTION_VALUE.setAttribute ( "option_id", STATE["option_id"] );
				OPTION_VALUE.value = STATE["value"];
		
				if ( STATE["option_id"] == "delay_max" || STATE["option_id"] == "delay_min" ) 
				{
					OPTION_VALUE.value = STATE["value"] / 1000;
				};
				break;

			case "toggle":
				
				OPTION_VALUE.setAttribute ( "listener_id", OPTIONS_SETTINGS_COMPONENTS[ STATE["type"] ].id );	
				OPTION_VALUE.checked = STATE["value"]["active"];
				break;

			case "button":
				
				OPTION_VALUE.setAttribute ( "listener_id", OPTIONS_SETTINGS_COMPONENTS[ STATE["type"] ].id );	
				OPTION_VALUE.innerText = STATE["value"];
				break;

			case "dropdown":
				
				OPTION_VALUE.setAttribute ( "listener_id", OPTIONS_SETTINGS_COMPONENTS[ STATE["type"] ].id );

				let DROPDOWN_OPTIONS_HTML = "";
				for ( let option of STATE["dropdown_options"] )
				{
					DROPDOWN_OPTIONS_HTML += `\n<option style="font-size: 12px; background: black; color: white;" value="${ option.value }"> ${ option.name } </option>`
				};

				OPTION_VALUE.innerHTML = DROPDOWN_OPTIONS_HTML;
				OPTION_VALUE.value = STATE["value"];
				break;

			default:
				break;
		};

		COMPONENT.querySelectorAll ( '[id="option_title"]' )[0].innerText = STATE["title"];
		OPTION_VALUE.setAttribute ( "option_data", JSON.stringify ( STATE ) );

		set_listeners ( COMPONENT, STATE );

		return COMPONENT;
	};
};

function create_welcome_screen_action_component ( ACTION ) 
{
	const COMPONENT = components.create 
	( 
		GLOBALS.popup_context.ui.components.welcome_screen_action[ ACTION["type"] ]["html"], 
		[ "fade-in" ], 
		{ 
			"id" : `${ ACTION["id"] }`
		} 
	);	

	if ( ACTION["type"] == "button" ) 
	{
		COMPONENT.getElementsByTagName ( "button" )[ 0 ].setAttribute ( "listener_id", ACTION["id"] );
		COMPONENT.getElementsByTagName ( "button" )[ 0 ].innerHTML = ACTION["value"];
	};
	if ( ACTION["type"] == "input" ) 
	{
		COMPONENT.getElementsByTagName ( "input" )[ 0 ].setAttribute ( "listener_id", ACTION["id"] );
		COMPONENT.getElementsByTagName ( "input" )[ 0 ].setAttribute ( "placeholder", ACTION["value"] );
	};

	set_listeners ( COMPONENT );

	return COMPONENT;
};

function create_main_action_button_component ( ACTION ) 
{
	const COMPONENT = components.create 
	( 
		GLOBALS.popup_context.ui.components.main_actions["html"], 
		[ "fade-in" ], 
		{ 
			"id" : `${ ACTION["id"] }`,
			"listener_id" : `${ ACTION["id"] }`
		} 
	);	

	COMPONENT.getElementsByTagName ( "button" )[ 0 ].innerHTML = ACTION[ "value" ];

	set_listeners ( COMPONENT );

	return COMPONENT;
};

async function show_logged_tasks () 
{
	const STORAGE_INFO 		= await get_storage ( GLOBALS.storage_keys );
	const TASKS_LOG_BUCKET 	= document.querySelectorAll ( '[id="tasks_logs"]' )[0].getElementsByTagName("textarea")[0];

	TASKS_LOG_BUCKET.value = STORAGE_INFO["TASKS_LOG"];
	TASKS_LOG_BUCKET.scroll ( 0,TASKS_LOG_BUCKET.scrollHeight );
};

function update_main_action_component () 
{
	const inction_trgt = document.querySelectorAll('[id="main_actions"]')[0];

	inction_trgt.innerHTML = `<div
								style="
								display: flex;
								flex-direction: row;
								align-items: center;
								justify-content: space-between;
								width: 96%;
								">
							</div>`;

	//add main actions buttons components:
	for ( let [item, item_val] of Object.entries ( GLOBALS.popup_context.ui.options_page.main_actions ) ) 
	{
		const cmpnt = create_main_action_button_component ( item_val );

		inject_component ( cmpnt, inction_trgt.children[0] );
	};
};

function update__welcome_screen_actions_component () 
{
	const inction_trgt = document.querySelectorAll('[id="welcome_screen_actions"]')[0];

	inction_trgt.innerHTML = `<div style="
								display: flex;
								flex-direction: column;
								align-items: center;
								justify-content: space-evenly;
								align-self: center;
								background-color: #380a2100;
								width: 178px;
								">
							</div>`;

	//add welcome screen actions buttons components:
	for ( let [item, item_val] of Object.entries ( GLOBALS.popup_context.ui.options_page.welcome_screen_actions ) ) 
	{
		const cmpnt = create_welcome_screen_action_component ( item_val );

		inject_component ( cmpnt, inction_trgt.children[0] );
	};
};

async function update_states_info_component () 
{
	const STORAGE_INFO 		= await get_storage ();
	const app_states 		= GLOBALS.popup_context.ui.options_page.states_info;
	const inction_trgt 		= document.getElementsByTagName ( "a-states-info" )[0];

	inction_trgt.innerHTML = `<div style="
	                            display: flex;
	                            flex-direction: row;
	                            justify-content: space-between;
	                            align-items: center;
	                            width: 110%;
	                            height: 100%;
	                            ">
	                           </div>`;

	await delay ( 300 );

	//add states info components:
	for ( let [item,item_val] of Object.entries ( app_states ) ) 
	{
		const cmpont = create_state_info_item_component ( item_val );	
		const inction_trgt = document.getElementsByTagName ( "a-states-info" )[0];

		if ( STORAGE_INFO[ item ]["active"] == true ) 
		{
			set_state_info_dot_color ( cmpont, GLOBALS.status_colors["on"] );
		}
		else 
		{
			set_state_info_dot_color ( cmpont, GLOBALS.status_colors["off"] );	
		};

		inject_component ( cmpont, inction_trgt.children[0] );
	};
};

async function update_settings_item_component () 
{
	const STORAGE_INFO 		= await get_storage ();
	const inction_trgt 		= document.getElementsByTagName ( "settings-popup" )[0];
	const OPTIONS 			= STORAGE_INFO["OPTIONS"];

	inction_trgt.querySelector('[role="content"]').outerHTML = `<div role="content"></div>`;

	for ( let option_value of Object.values ( OPTIONS ).sort ((x,y)=>x["index"]-y["index"]) ) 
	{
		let cmpont;

		switch ( option_value.type ) 
		{
			case "toggle":
				if ( option_value[ "option_id" ] == "extension_state" ) 
				{
					option_value["value"] = STORAGE_INFO["extension_state"];
					
					cmpont = await create_settings_item_component ( option_value );

					inject_component ( cmpont, inction_trgt.querySelector('[role="content"]') );
				}
				else 
				{
					cmpont = await create_settings_item_component ( option_value );

					inject_component ( cmpont, inction_trgt.querySelector('[role="content"]') );
				};
				break;

			case "input":
				cmpont = await create_settings_item_component ( option_value );

				inject_component ( cmpont, inction_trgt.querySelector('[role="content"]') );
				break;

			case "button":
				cmpont = await create_settings_item_component ( option_value );

				inject_component ( cmpont, inction_trgt.querySelector('[role="content"]') );
				break;

			case "dropdown":
				cmpont = await create_settings_item_component ( option_value );

				inject_component ( cmpont, inction_trgt.querySelector('[role="content"]') );
				break;

			default:
				break;
		}
	};
};

function set_state_info_dot_color ( STATE_INFO_COMPONENT, COLOR ) 
{
	const status_dot = STATE_INFO_COMPONENT.getElementsByTagName ( "status-dot" )[ 0 ];

	change_element_background ( status_dot, COLOR );
};
/*////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////*/

function set_app_logo_icons ( CLASSES_DATA ) 
{
	const app_logo_icons = document.getElementsByClassName ( "app_logo_icon" );

	for ( let icon of Object.values ( app_logo_icons ) ) 
	{
		icon.style.backgroundImage = `url("${GLOBALS.extension_icon}")`;

		if ( CLASSES_DATA ) 
		{
			for ( let [CLASS_ITEM, CLASS_ITEM_VALUE] of Object.entries ( CLASSES_DATA ) ) 
			{
				if ( CLASS_ITEM_VALUE == true ) 
				{
					icon.classList.add ( CLASS_ITEM );
				}
				else if ( CLASS_ITEM_VALUE == false ) 
				{
					icon.classList.remove ( CLASS_ITEM );
				};
			};
		};
	};
};

function set_appnames ( TEXT )
{
	const appnames = document.getElementsByClassName ( "app_name_brand" );

	for ( let appname of Object.values ( appnames ) ) 
	{
		appname.innerText = TEXT ? TEXT : GLOBALS.extension_name;
	};
};

function show_splash_screen () 
{
	const SPLASH_SCREEN 	= document.querySelectorAll('[id="welcome-screen"]')[0];
	const MENU 				= document.getElementsByTagName ( "app-menu" )[0];

	show_element ( SPLASH_SCREEN );
	hide_element ( MENU );
};

function hide_splash_screen () 
{
	const SPLASH_SCREEN 	= document.querySelectorAll('[id="welcome-screen"]')[0];
	const MENU 				= document.getElementsByTagName ( "app-menu" )[0];

	show_element ( MENU );
	hide_element ( SPLASH_SCREEN );
};

async function set_listeners ( TARGET_COMPONENT, DATA_TO_INJECT={} ) 
{
	const TARGETS = TARGET_COMPONENT.querySelectorAll( '[listener_id]' );
	const STORAGE_INFO = await get_storage();

	//add JSON data stringified to the target element:
	if ( !TARGET_COMPONENT.getAttribute( "data" ) ) 
	{
		TARGET_COMPONENT.setAttribute ( "data", JSON.stringify( DATA_TO_INJECT ) );
	}
	else if ( Object.values( JSON.parse(TARGET_COMPONENT.getAttribute( "data" )) ).length > 0 ) 
	{
		DATA_TO_INJECT = JSON.parse(TARGET_COMPONENT.getAttribute( "data" ));

		TARGET_COMPONENT.setAttribute( "data", JSON.stringify(DATA_TO_INJECT) );
	};

	// Set Data and Listeners to Target Component if it will have UI interaction (listener_id):
	if ( TARGET_COMPONENT && TARGET_COMPONENT.getAttribute( "listener_id" ) ) 
	{
		const LISTENER_ID = TARGET_COMPONENT.getAttribute( "listener_id" );
		
		if ( GLOBALS.listeners[ LISTENER_ID ] ) 
		{
			for ( let listener in GLOBALS.listeners[ LISTENER_ID ] ) 
			{
				const already_has_listeners = TARGET_COMPONENT.getAttribute( "has_listeners" ) == "true";

				if ( already_has_listeners == false ) 
				{
					TARGET_COMPONENT.addEventListener( 
						listener, 
						( EVENT ) => 
						{ 
							const TARGET_DATA = DATA_TO_INJECT;

							GLOBALS.listeners[ LISTENER_ID ][ listener ]( EVENT, TARGET_COMPONENT, DATA_TO_INJECT );
						} 
					);
				}
				else 
				{
					continue;
				};
			};

			TARGET_COMPONENT.setAttribute( "has_listeners", "true" );
		};
	};

	// Set Data and Listeners to elements inside Target Component that will have UI interaction (listener_id):
	for ( let target_element of Object.values( TARGETS ) ) 
	{
		const LISTENER_ID = target_element.getAttribute( "listener_id" );

		// Add JSON data stringified to the target element:
		if ( !target_element.getAttribute( "data" ) ) 
		{
			target_element.setAttribute( "data", JSON.stringify( DATA_TO_INJECT ) );
		}
		else if ( Object.values( JSON.parse(target_element.getAttribute( "data" )) ).length > 0 ) 
		{
			DATA_TO_INJECT = JSON.parse(target_element.getAttribute( "data" ));

			target_element.setAttribute( "data", JSON.stringify(DATA_TO_INJECT) );
		};

		// Add event listeners listed in GLOBALS to the target element:
		if ( GLOBALS.listeners[ LISTENER_ID ] ) 
		{
			for ( let listener in GLOBALS.listeners[ LISTENER_ID ] ) 
			{
				const already_has_listeners = target_element.getAttribute( "has_listeners" ) == "true";

				if ( already_has_listeners == false ) 
				{
					const TARGET_DATA = DATA_TO_INJECT;

					target_element.addEventListener( 
						listener, 
						( EVENT ) => 
						{ 
							GLOBALS.listeners[ LISTENER_ID ][ listener ]( EVENT, target_element, TARGET_DATA );
						} 
					);
				}
				else 
				{
					continue;
				};

				if ( Object.keys( GLOBALS.listeners[ LISTENER_ID ] ).indexOf( listener ) == Object.keys( GLOBALS.listeners[ LISTENER_ID ] ).length - 1 ) 
				{
					target_element.setAttribute( "has_listeners", "true" );
				};
			};
		};

		//console.log ( `\n\n LISTENERS ADDED FOR: ${ LISTENER_ID }` )
	};


	// Set listeners to custom boilerplate component Extension State Toggle if present:
	const extension_state_toggle = document.querySelectorAll( '[listener_id="extension_state"]' )[0];

	if ( extension_state_toggle ) 
	{
		extension_state_toggle.checked = STORAGE_INFO["extension_state"]["active"];	
	};
};

/**   CARBONALYSER POPUP UI :
 *
 */

let PROGRESS_BAR_UPDATE_INTERVAL = null;

function activate_progress_bar () 
{
	// RESETS PROGRESS BAR PDATE INTERVAL IF ALREADY RUNNING:

	if ( PROGRESS_BAR_UPDATE_INTERVAL != null )
		deactivate_progress_bar();

	//
    const progressFill = document.getElementById('progressFill');
    let progress = 0;

    function updateProgress() 
    {
        progress = (progress >= 100) ? 0 : progress + 1;
        progressFill.style.width = `${progress}%`;
    };

    PROGRESS_BAR_UPDATE_INTERVAL = setInterval(updateProgress, 100);
};

function deactivate_progress_bar () 
{
    const progressFill = document.getElementById('progressFill');

    progressFill.style.width = `${ 0 }%`;

    clearInterval( PROGRESS_BAR_UPDATE_INTERVAL );
    PROGRESS_BAR_UPDATE_INTERVAL = null;
};

async function enable_stats () 
{
	const STORAGE_INFO = await get_storage([ "OPTIONS" ]);

	document.querySelector("html").style.height = "420px";
	document.querySelector("body").style.height = "420px";
	document.querySelector("app-menu").style.height = "420px";
	document.querySelector('[id="progress_bar"]').style.visibility = "visible";
	document.querySelector('[id="start_carbonalyser_analysis"] button').setAttribute( "ui_string", `Stop` );
	document.querySelector('[id="start_carbonalyser_analysis"] button').innerText = "Stop";

	activate_progress_bar();
	document.querySelector('[id="extension_working_notice"] text').setAttribute( "ui_string", `Analysis in progress. Start browsing the web, then come back here to get stats!` );
	document.querySelector('[id="extension_working_notice"] text').innerText = `Analysis in progress. Start browsing the web, then come back here to get stats!`;
	document.querySelector("#calculated_stats").style.filter = "";
	show_element( document.querySelector('[id="main_menu"] [id="actions"]') );

	translate_ui_strings( STORAGE_INFO["OPTIONS"].app_language.value );
};

async function disable_stats () 
{
	const STORAGE_INFO = await get_storage([ "OPTIONS" ]);

	document.querySelector("html").style.height = "123px";
	document.querySelector("body").style.height = "123px";
	document.querySelector("app-menu").style.height = "123px";
	document.querySelector('[id="progress_bar"]').style.visibility = "hidden";
	document.querySelector('[id="start_carbonalyser_analysis"] button').setAttribute( "ui_string", `Start` );
	document.querySelector('[id="start_carbonalyser_analysis"] button').innerText = "Start";

	deactivate_progress_bar();
	document.querySelector('[id="extension_working_notice"] text').setAttribute( "ui_string", `Click start to begin the Analysis` );
	document.querySelector('[id="extension_working_notice"] text').innerText = `Click start to begin the Analysis`;
	document.querySelector('[id="calculated_stats"]').style.filter = "opacity(0.3)";
	hide_element( document.querySelector('[id="main_menu"] [id="actions"]') );

	translate_ui_strings( STORAGE_INFO["OPTIONS"].app_language.value );
};

function update_stats ( STATS_DATA ) 
{
	activate_progress_bar();

	const MINUTES_BROWSED = document.querySelector('[id="minutes_browsed_stat"] [id="stat_value"]');
	const DATA_DOWNLOADED = document.querySelector('[id="data_downloaded_stat"] [id="stat_value"]');
	const EMISSIONS_EQUIVALENT = document.querySelector('[id="emissions_equivalent_data"] [id="stat_value"]');
	const GCO2 = document.querySelector('[id="gco2_data"] [id="stat_value"]');

	MINUTES_BROWSED.innerText = STATS_DATA.duration;
	DATA_DOWNLOADED.innerText = STATS_DATA.mega_byte_total;
	EMISSIONS_EQUIVALENT.innerText = STATS_DATA.charged_smartphones;
	GCO2.innerText = STATS_DATA.gco2_total;
};

function reset_stats () 
{
	const MINUTES_BROWSED = document.querySelector('[id="minutes_browsed_stat"] [id="stat_value"]');
	const DATA_DOWNLOADED = document.querySelector('[id="data_downloaded_stat"] [id="stat_value"]');
	const EMISSIONS_EQUIVALENT = document.querySelector('[id="emissions_equivalent_data"] [id="stat_value"]');

	MINUTES_BROWSED.innerText = "0";
	DATA_DOWNLOADED.innerText = "0";
	EMISSIONS_EQUIVALENT.innerText = "0";
};

// SETS POPUP UI :
async function set_ui () 
{
	const STORAGE_INFO = await get_storage([ "analysisStarted", "stats", "duration" ]);

	if ( STORAGE_INFO["analysisStarted"] == "1" ) 
	{
		update_stats( (await get_quivalent_stats((await get_stats()))) );
		enable_stats();
	}
	else 
	{
		reset_stats();
		disable_stats();
	};
};

// TRANSLATE UI STRINGS:
function translate_ui_strings ( LOCALES_OPTION ) 
{
	// TARGET UI: DOCUMENT
	for ( let item of Object.values(document.querySelectorAll( '[ui_string]' )) ) 
	{
		item.innerText = GLOBALS.locales[ LOCALES_OPTION ][ item.getAttribute("ui_string") ];

		// Will also translate UI elements with Title property:
		if ( item.title )
			item.title = GLOBALS.locales[ LOCALES_OPTION ][ item.getAttribute("ui_string") ];;
	};
};