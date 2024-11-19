const local_storage 	= chrome.storage.local;
const storage_onchange 	= chrome.storage.onChanged;
const extension_info 	= chrome.runtime.getManifest();
const GLOBALS 			= 
{
	tabs 					: chrome.tabs,
	extension_icon 			: chrome.runtime.getURL( "/assets/logo/logo.svg" ),
	extension_name 			: extension_info.name,
	extension_description 	: extension_info.description,
	extension_version		: extension_info.version,
	storage_keys : 
	{
		"extension_state" 		: { "active" : true },
		"start_app_confirmed" 	: false,
		"OPTIONS" 				: {},
		"analysisStarted" 		: null,
		"stats" 				: null,
		"duration" 				: null
	},
    locales : 
    {
        "English" : 
        {
            "Settings" : "Settings",
            "minutes browsed" : "minutes browsed",
            "Mb downloaded" : "Mb downloaded",
            "CO2 emissions equivalent:" : "CO2 emissions equivalent:",
            "charged smartphones" : "charged smartphones",
            "Click start to begin the Analysis" : "Click start to begin the Analysis",
            "Analysis in progress. Start browsing the web, then come back here to get stats!" : "Analysis in progress. Start browsing the web, then come back here to get stats!",
            "Start" : "Start",
            "Stop" : "Stop",
            "Reset data" : "Reset data"
        },
        "Deutschland" : 
        {
            "Settings" : "Einstellungen",
            "minutes browsed" : "Minuten durchsucht",
            "Mb downloaded" : "Mb heruntergeladen",
            "CO2 emissions equivalent:" : "CO2-Emissionen entsprechend:",
            "charged smartphones" : "aufgeladene Smartphones",
            "Click start to begin the Analysis" : "Klicken Sie auf Start, um die Analyse zu beginnen",
            "Analysis in progress. Start browsing the web, then come back here to get stats!" : "Analyse läuft. Surfen Sie im Internet und kehren Sie dann hierher zurück, um Statistiken zu erhalten!",
            "Start" : "Start",
            "Stop" : "Stopp",
            "Reset data" : "Daten zurücksetzen"
        },
        "French" : 
        {
            "Settings" : "Paramètres",
            "minutes browsed" : "minutes naviguées",
            "Mb downloaded" : "Mb téléchargés",
            "CO2 emissions equivalent:" : "Équivalent des émissions de CO2 :",
            "charged smartphones" : "smartphones chargés",
            "Click start to begin the Analysis" : "Cliquez sur Démarrer pour commencer l'analyse",
            "Analysis in progress. Start browsing the web, then come back here to get stats!" : "Analyse en cours. Commencez à naviguer sur le web, puis revenez ici pour obtenir des statistiques !",
            "Start" : "Démarrer",
            "Stop" : "Arrêter",
            "Reset data" : "Réinitialiser les données"
        }
    },
    /* UI MODEL FOR BACKGROUND CONTEXT (options page) */
	background_context : 
	{
		ui : 
		{
			components : 
			{
				state_info_item : 
				{
					"id" : "state_info_item",
					"html" : 
					`
					<state-item style="
					   display: flex;
					   background-color: black;
					   padding: 7px;
					   border-radius: 6px;
					   margin: 0px 12px 0px 0px;
					   " id="">
					   <div style="
					      display: flex;
					      flex-direction: row;
					      align-items: center;
					      justify-content: space-between;
					      ">
					      <text style="
					         font-family: helvetica, arial, roboto;
					         font-size: 9px;
					         font-weight: 700;
					         color: white;
					         margin-right: 8px;
					         "></text>
					      <status-dot style="
					         width: 7px;
					         height: 7px;
					         display: flex;
					         background-color: #ff1515;
					         border-radius: 3px;
					         "></status-dot>
					   </div>
					</state-item>
					`
				},
				selected_tasks : 
				{
					"id" : "selected_tasks",
					"html" : 
					`
					<list-item style="
					    display: flex;
					    ">
					    <div style="
					        display: flex;
					        flex-direction: row;
					        align-items: center;
					        justify-content: space-between;
					        background-color: #581134;
					        height: 34px;
					        ">
					        <input type="checkbox" id="checkbox_Comment_task">
					        <text id="task_name" 
					        	style="
					            font-family: helvetica, arial, robotop;
					            font-size: 10px;
					            color: white;
					            font-weight: 700;
					            padding: 15px;
					            "></text>
					    </div>
					</list-item>
					`
				},
				main_actions :
				{
					"id" : "main_action_btn",
					"html" : 
					`
					<list-item id="" class="fade-in" style="margin:13px;">
					    <div style="
					        background: radial-gradient(circle at 30% 107%, #fdf497 0%, #fdf497 5%, #fd5949 45%,#d6249f 60%,#285AEB 90%);
					        padding: 1px;
					        border-radius: 6px;
					        " class="">
					        <button style="
					            display: flex;
							    width: 154px;
							    height: 41px;
					            align-items: center;
					            justify-content: center;
					            color: white;
					            background-color: #120b0e;
					            border: none;
					            border-radius: 5px;
					            font-family: helvetica, arial, roboto;
					            font-weight: 500;
					            cursor: pointer;
					            font-size: 11px;
					            padding: 0px 32px 0px 32px;
					            " class=""></button>
					    </div>
					</list-item>
					`
				},
				welcome_screen_action :
				{
					"button" : 
					{
						"id" : "welcome_screen_action",
						"html" : 
						`
						<div style="
						    background: linear-gradient(90deg, rgba(49,255,132,1) 0%, rgba(29,247,253,1) 35%, rgba(252,69,243,1) 80%);
						    padding: 2px;
						    border-radius: 9px;
						    display: flex;
						    width: 100%;
						    " id="">
						    <button style="
						        display: flex;
						        width: 100%;
						        height: 29px;
						        align-items: center;
						        justify-content: center;
						        color: white;
						        background-color: #000000;
						        border: none;
						        border-radius: 5px;
						        font-family: helvetica, arial, roboto;
						        font-weight: 600;
						        cursor: pointer;
						        font-size: 10px;
						        "></button>
						</div>
						`
					},
					"input" : 
					{
						"id" : "welcome_screen_action",
						"html" : 
						`
						<div style="
						    background: linear-gradient(90deg, rgb(1 227 255) 0%, rgba(29,247,253,1) 35%, rgb(128 33 235) 80%);
						    padding: 1px;
						    border-radius: 3px;
						    display: flex;
						    width: 100%;
						    " class="">
						    <input type="text" placeholder="user" id="" style="
						        border: 1px solid #000000;
						        background-color: #000000;
						        padding: 9px;
						        color: #8edbe6;
						        border-radius: 5px;
						        display: flex;
						        width: 100%;
						        ">
						</div>
						`
					}
				},
				OPTIONS_SETTINGS : 
				{
					"input" : 
					{
						"type" : "input",
						"id" : "OPTIONS_SETTINGS_input",
						"html" : 
						`
			            <div style="
			                display: flex;
			                flex-direction: column;
			                align-items: center;
			                justify-content: space-between;
			                width: 100%;
			                height: fit-content;
			                max-height: 440px;
			                margin-bottom: 14px;
			                " class="fade-in" option_id="">
			                <s-item style="
			                    border: 1px solid black;
			                    display: flex;
			                    width: 93%;
			                    background-color: #000000;
			                    box-shadow: 0px 0px 11px -5px #ffffff;
			                    " id="" class="">
			                    <div style="
			                        display: flex;
			                        flex-direction: row;
			                        align-items: center;
			                        justify-content: space-between;
			                        width: 100%;
			                        padding: 18px;
			                        " class="">
			                        <text style="
			                            display: flex;
			                            font-size: 13px;
			                            font-weight: 500;
			                            font-family: helvetica, arial, roboto;
			                            color: white;
			                            " id="option_title" class=""></text>
			                        <div style="
			                            display: flex;
			                            background: linear-gradient(
			                            90deg
			                            , rgba(49,255,132,1) 0%, rgba(29,247,253,1) 35%, #b44dff 80%);
			                            padding: 1px;
			                            border-radius: 4px;
			                            ">
			                            <input type="text
			                                " style="
			                                display: flex;
			                                border-radius: 4px;
			                                border: none;
			                                background-color: black;
			                                color: #ffffff;
			                                padding: 4px;
			                                font-family: helvetica, arial, roboto;
			                                font-weight: 500;
			                                font-size: 13px;
			                                width: 19vw;
			                                " id="option_value" option_data="" option_id="" class="">
			                        </div>
			                    </div>
			                </s-item>
			            </div>
						`
					},
					"toggle" : 
					{
						"type" : "toggle",
						"id" : "OPTIONS_SETTINGS_toggle",
						"html" : 
						`
			            <div style="
			                display: flex;
			                flex-direction: column;
			                align-items: center;
			                justify-content: space-between;
			                width: 100%;
			                height: fit-content;
			                max-height: 440px;
			                margin-bottom: 14px;
			                ">
			                <s-item style="
			                    border: 1px solid black;
			                    border-radius: 8px;
			                    display: flex;
			                    width: 93%;
			                    background-color: #000000;
			                    box-shadow: 0px 0px 11px -5px #ffffff;
			                    " id="">
			                    <div style="
			                        display: flex;
			                        flex-direction: row;
			                        align-items: center;
			                        justify-content: space-between;
			                        width: 100%;
			                        padding: 18px;
			                        ">
			                        <text style="
			                            display: flex;
			                            font-size: 13px;
			                            font-weight: 500;
			                            font-family: helvetica, arial, roboto;
			                            color: white;
			                            " id="option_title"></text>
			                        <div style="
			                            display: flex;
			                            background: linear-gradient(
			                            90deg
			                            , rgba(49,255,132,1) 0%, rgba(29,247,253,1) 35%, #b44dff 80%);
			                            padding: 1px;
			                            border-radius: 23px;
			                            ">
			                            <label class="switch" style="
			                                "> <input  id="option_value" type="checkbox"><span class="slider round"></span> </label>
			                        </div>
			                    </div>
			                </s-item>
			            </div>
						` 
					}
				}
			},
			options_page : 
			{
				states_info : 
				{
					"extension_state" :
					{ 
						"value" : "Turned On" 
					}
				},		
				main_actions : 
				{
					/*
					"action_name_id" :
					{ 
						"id" : "action_name_id",
						"value" : "Your action name here" 
					}
					*/
				},
				welcome_screen_actions : 
				{
					"start_app" :
					{ 
						"type" : "button",
						"id" : "START_APP",
						"value" : "START APP" 
					}
				},
				actions : 
				{

				}
			}
		}
	},
	/* UI MODEL FOR POPUP CONTEXT (main POPUP) */
	popup_context : 
	{
		ui : 
		{
			components : 
			{
			    state_info_item : 
			    {
			        "id" : "state_info_item",
			        "html" : 
			        `
			        <state-item role="state_info_item">
			            <div>
			                <text></text>
			                <status-dot></status-dot>
			            </div>
			        </state-item>
			        `
			    },
			    selected_tasks : 
			    {
			        "id" : "selected_tasks",
			        "html" : 
			        `
			        <list-item role="selected_tasks">
			            <div>
			                <input type="checkbox" id="checkbox_Comment_task">
			                <text id="task_name"></text>
			            </div>
			        </list-item>
			        `
			    },
			    main_actions :
			    {
			        "id" : "main_action_btn",
			        "html" : 
			        `
			        <list-item role="main_actions" class="fade-in">
			            <div>
			                <button></button>
			            </div>
			        </list-item>
			        `
			    },
			    welcome_screen_action :
			    {
			        "button" : 
			        {
			            "id" : "welcome_screen_action_BUTTON",
			            "html" : 
			            `
			            <div role="welcome_screen_action_BUTTON">
			                <button></button>
			            </div>
			            `
			        },
			        "input" : 
			        {
			            "id" : "welcome_screen_action",
			            "html" : 
			            `
			            <div role="welcome_screen_action_INPUT" class="">
			                <input type="text" placeholder="user" id="">
			            </div>
			            `
			        }
			    },
			    OPTIONS_SETTINGS : 
			    {
			        "input" : 
			        {
			            "type" : "input",
			            "id" : "OPTIONS_SETTINGS_input",
			            "html" : 
			            `
			            <div role="OPTIONS_SETTINGS_input" class="fade-in" option_id="">
			                <s-item>
			                    <div>
			                        <text id="option_title"></text>
			                        <div>
			                            <input type="text" id="option_value" option_data="" option_id="" class="">
			                        </div>
			                    </div>
			                </s-item>
			            </div>
			            `
			        },
			        "toggle" : 
			        {
			            "type" : "toggle",
			            "id" : "OPTIONS_SETTINGS_toggle",
			            "html" : 
			            `
			            <div role="OPTIONS_SETTINGS_toggle" id="OPTIONS_SETTINGS_toggle">
			                <s-item>
			                    <div>
			                        <text id="option_title"></text>
			                        <div>
			                            <label class="switch">
			                                <input id="option_value" type="checkbox">
			                                <span class="slider round"></span>
			                            </label>
			                        </div>
			                    </div>
			                </s-item>
			            </div>
			            ` 
			        },
			        "button" : 
			        {
			            "type" : "button",
			            "id" : "OPTIONS_SETTINGS_button",
			            "html" : 
			            `
			            <div role="OPTIONS_SETTINGS_button">
			                <s-item>
			                    <div>
			                        <text id="option_title"></text>
			                        <div>
			                            <button id="option_value"></button>
			                        </div>
			                    </div>
			                </s-item>
			            </div>
			            ` 
			        },
			        "dropdown" : 
			        {
			            "type" : "dropdown",
			            "id" : "OPTIONS_SETTINGS_dropdown",
			            "html" : 
			            `
			            <div role="OPTIONS_SETTINGS_dropdown">
			                <s-item>
			                    <div>
			                        <text id="option_title"></text>
			                        <div>
			                            <select id="option_value"></select>
			                        </div>
			                    </div>
			                </s-item>
			            </div>
			            ` 
			        }
			    }
			},
			options_page : 
			{
				states_info : 
				{
					"extension_state" :
					{ 
						"value" : "Turned On" 
					}
				},		
				main_actions : 
				{			
					/*
					"action_name_id" :
					{ 
						"id" : "action_name_id",
						"value" : "Your action name here" 
					}
					*/
				},
				welcome_screen_actions : 
				{
					/*
					"auth_user_input" : 
					{
						"type" : "input",
						"id" : "auth_user_input",
						"value" : "User" 
					},
					"auth_key_input" : 
					{
						"type" : "input",
						"id" : "auth_key_input",
						"value" : "Key" 
					},
					*/
					"start_app" :
					{ 
						"type" : "button",
						"id" : "START_APP",
						"value" : "Start app" 
					}
				}
			}
		}
	},
	/* UI MODEL FOR WEBSITES CONTEXT (Content scripts) */
	page_context : 
	{
		ui :
		{
			components : 
			{
				/*
				your_component_name_id : 
				{
					"id" : "your_component_name_id",
					"html" : 
					`
					//your component html
					`
				}
				*/
			}
		}
	}
};

/**
 * 
 *
 * 
 *    IN THIS APPART YOU CAN SET OPTIONS TO BE AVAILABLE IN THE EXTENSION POPUP BY CLICKING THE SETTINGS ICON
 * 
 * 
 *  
 */
GLOBALS[ "app_options" ] = 
{
	/*
	"your_option_name_id" : 
    {
        "option_id"         : "your_option_name_id", //option key to be setted in the storage.
        "alarm_id"          : "your_option_name_id",
        "time_in_minutes"   : 2,
        "title"             : "Your Option Name:",
        "type"              : "input", // || "input" || "button" || "dropdown"
        "RECOMENDED_VALUE"  : null,
        "value"             : 30 / 60, // || "string" if input, button, dropdown.
        "time_type"         : "seconds",
        "index"             : 2, //position of the option to be placed in the order index
        "dropdown_options"  : 
        [
            {
                "name" : "OPTION 1 NAME",
                "value" : "OPTION 1 VALUE"
            },
            {
                "name" : "OPTION 2 NAME",
                "value" : "OPTION 2 VALUE"
            }
        ]
    },
	*/
	"app_language" : 
    {
        "option_id"         : "app_language", //option key to be setted in the storage.
        "alarm_id"          : null,
        "time_in_minutes"   : null,
        "title"             : "Language:",
        "type"              : "dropdown", // || "input" || "button" || "dropdown"
        "RECOMENDED_VALUE"  : null,
        "value"             : "English", // || "string" if input, button, dropdown.
        "time_type"         : null,
        "index"             : 0, //position of the option to be placed in the order index
        "dropdown_options"  : 
		[
		    {
		        "name": "English",
		        "value": "English"
		    },
		    {
		        "name": "Deutschland",
		        "value": "Deutschland"
		    },
		    {
		        "name": "French",
		        "value": "French"
		    }
		]
    },
	"carbon_intensity_factor_ing_co2_per_kwh" : 
    {
        "option_id"         : "carbon_intensity_factor_ing_co2_per_kwh", //option key to be setted in the storage.
        "alarm_id"          : null,
        "time_in_minutes"   : null,
        "title"             : "Carbon Factor region",
        "type"              : "dropdown", // || "input" || "button" || "dropdown"
        "RECOMENDED_VALUE"  : null,
        "value"             : "regionUnitedStates", // || "string" if input, button, dropdown.
        "time_type"         : null,
        "index"             : 1, //position of the option to be placed in the order index
        "dropdown_options"  : 
		[
		    {
		        "name": "European Union region",
		        "value": "regionEuropeanUnion"
		    },
		    {
		        "name": "France region",
		        "value": "regionFrance"
		    },
		    {
		        "name": "United States region",
		        "value": "regionUnitedStates"
		    },
		    {
		        "name": "China region",
		        "value": "regionChina"
		    },
		    {
		        "name": "Other region",
		        "value": "regionOther"
		    }
		]
    },
};

/**
 * 
 *
 * 
 *    THIS IS FOR WHEN USING ALARMS API IN THE CHROME EXTENSION ITS LINKED TO CRE FUNCTIONS
 * 
 * 
 *  
 */
GLOBALS[ "alarms" ] = 
{
	/*
	Check_license_system : 
	{
		"id" 				: "test_alarm_1",
		"storage_id" 		: "",
		"time_in_minutes" 	: 17
	}
	*/
};

/**
 * 
 *
 * 
 *    HERE YOU SET EVERY SINGLE UI EVENT LISTENER FROM CONTEXT (POPUP CONTEXT, PAGE CONTEXT AND BACKGROUND CONTEXT):
 * 
 * 
 *  
 */
GLOBALS[ "listeners" ] = //must match with the listeners key. 
{
	"start_carbonalyser_analysis" : //must match with the listener_id properties in the dom elements 
	{
		click : async ( EVENT, TARGET_EL, DATA ) => 
		{
			const STORAGE_INFO = await get_storage([ "analysisStarted" ]);

			switch ( STORAGE_INFO["analysisStarted"] ) 
			{
				case "1":
					stop_carbonalyser()
					break;

				case null: 
					start_carbonalyser();
					break;

				default:
					stop_carbonalyser();
					break;
			}
			EVENT.stopPropagation();
		},
		mouseover : ( EVENT, TARGET_EL, DATA ) => 
		{
			TARGET_EL.style.filter = "drop-shadow(2px 4px 6px gray)";
			EVENT.stopPropagation();
		},
		mouseleave : ( EVENT, TARGET_EL, DATA ) => 
		{
			TARGET_EL.style.filter = "none";
			EVENT.stopPropagation();
		}
	},
	"reset_calculated_stats" : //must match with the listener_id properties in the dom elements 
	{
		click : ( EVENT, TARGET_EL, DATA ) => 
		{
			reset_carbonalyser();
			EVENT.stopPropagation();
		},
		mouseover : ( EVENT, TARGET_EL, DATA ) => 
		{
			TARGET_EL.style.filter = "drop-shadow(2px 4px 6px gray)";
			EVENT.stopPropagation();
		},
		mouseleave : ( EVENT, TARGET_EL, DATA ) => 
		{
			TARGET_EL.style.filter = "none";
			EVENT.stopPropagation();
		}
	},
	"START_APP" : 
	{
		click : async ( EVENT, TARGET_EL, DATA ) =>
		{
			await set_storage ( { "start_app_confirmed" : true } );

			EVENT.stopPropagation();
		},
		mouseover : async ( EVENT, TARGET_EL, DATA ) => 
		{
			EVENT.target.classList.add ( "color-change-2x" );

			await delay (250);
			EVENT.target.classList.remove ( "color-change-2x" );

			EVENT.stopPropagation();
		}
	},
	"open_app" : 
	{
		click : ( EVENT, TARGET_EL, DATA ) =>
		{
			chrome.runtime.openOptionsPage ();

			EVENT.stopPropagation();
		},	
		mouseover : async ( EVENT, TARGET_EL, DATA ) => 
		{
			EVENT.target.classList.add ( "color-change-2x" );

			await delay (250);
			EVENT.target.classList.remove ( "color-change-2x" );

			EVENT.stopPropagation();
		}
	},
	"open_settings_popup" : 
	{
		click : ( EVENT, TARGET_EL, DATA ) =>
		{ 
			const SETTINGS_POPUP = document.getElementsByTagName ( "settings-popup" )[0];

			show_element ( SETTINGS_POPUP );
			EVENT.stopPropagation();
		}
	},
	"close_settings_popup" : //close ettings popup and saves settings.
	{
		click : async ( EVENT, TARGET_EL, DATA ) =>
		{ 
			hide_element ( EVENT.target.parentNode.offsetParent );
			EVENT.stopPropagation();
		},
		mouseover : async ( EVENT, TARGET_EL, DATA ) => 
		{
			EVENT.target.classList.add ( "color-change-2x" );

			await delay (250);
			EVENT.target.classList.remove ( "color-change-2x" );

			EVENT.stopPropagation();
		}
	},
	"show_tasks_logs_container" : 
	{
		click : ( EVENT, TARGET_EL, DATA ) => 
		{
			show_logs_container ();

			EVENT.stopPropagation();
		},
		mouseover : async ( EVENT, TARGET_EL, DATA ) => 
		{
			EVENT.target.classList.add ( "color-change-2x" );

			await delay (250);
			EVENT.target.classList.remove ( "color-change-2x" );

			EVENT.stopPropagation();
		}
	},
	"clear_all_tasks_logs" : 
	{
		click : ( EVENT, TARGET_EL, DATA ) => 
		{
			clear_saved_log ();

			EVENT.stopPropagation();
		},
		mouseover : async ( EVENT, TARGET_EL, DATA ) => 
		{
			EVENT.target.classList.add ( "color-change-2x" );

			await delay (250);
			EVENT.target.classList.remove ( "color-change-2x" );

			EVENT.stopPropagation();
		}	
	},
	"show_more_items_rows" : 
	{
		click : ( EVENT, TARGET_EL, DATA ) => 
		{
			show_ten_items_more ();

			disable_element_by_time ( EVENT.target, 1800 );

			EVENT.stopPropagation();
		},
		mouseover : async ( EVENT, TARGET_EL, DATA ) => 
		{
			EVENT.target.classList.add ( "color-change-2x" );

			await delay (250);
			EVENT.target.classList.remove ( "color-change-2x" );

			EVENT.stopPropagation();
		}	
	},
	"extension_state" : 
	{
		change : async ( EVENT, TARGET_EL, DATA ) => 
		{
			if ( EVENT.target.checked == true ) 
			{
				await set_storage ( { "extension_state" : {"active" : true} } );
			} 
			else 
			{
				await set_storage ( { "extension_state" : {"active" : false} } );
			};
			
			EVENT.stopPropagation();
		},
		mouseover : async ( EVENT, TARGET_EL, DATA ) => 
		{
			EVENT.target.classList.add ( "color-change-2x" );

			await delay (250);
			EVENT.target.classList.remove ( "color-change-2x" );

			EVENT.stopPropagation();
		}
	},
    "OPTIONS_SETTINGS_input" : //must match with the listener_id properties in the dom elements 
    {
        input : async ( EVENT, TARGET_EL, DATA ) => 
        {
            if ( DATA.alarm_id != null ) 
            {
                if ( isNaN( TARGET_EL.value ) == false && TARGET_EL.value > 0 ) 
                {
                    const STORAGE_INFO = await get_storage( "OPTIONS" );

                    Object.values( STORAGE_INFO["OPTIONS"] ).filter((a)=>{ return a.option_id == DATA.option_id })[0].value = DATA.time_type == "seconds" ? TARGET_EL.value / 60 : TARGET_EL.value;
                    await set_storage( { "OPTIONS" : STORAGE_INFO["OPTIONS"] } );
                    message_to_background( "EDIT_ALARM_INTERVAL", { "ALARM_NAME" : DATA.alarm_id, "PERIOD_IN_MINUTES" : DATA.time_type == "seconds" ? TARGET_EL.value / 60 : TARGET_EL.value } );
                }
                else 
                {
                    status_header.set_text ( "Value must be a number > 0" );
                    show_element ( status_header.element );
                    change_element_background ( status_header.element, "red" );
                };
            }
            else 
            {
                const STORAGE_INFO = await get_storage( "OPTIONS" );

                Object.values( STORAGE_INFO["OPTIONS"] ).filter((a)=>{ return a.option_id == DATA.option_id })[0].value = DATA.time_type == "seconds" ? TARGET_EL.value / 60 : TARGET_EL.value;
                await set_storage( { "OPTIONS" : STORAGE_INFO["OPTIONS"] } );
            };
            EVENT.stopPropagation();
        },
        mouseover : ( EVENT, TARGET_EL, DATA ) => 
        {

            EVENT.stopPropagation();
        }
    },
	"OPTIONS_SETTINGS_toggle" : //must match with the listener_id properties in the dom elements 
	{
		click : async ( EVENT, TARGET_EL, DATA ) => 
		{
			const STORAGE_INFO = await get_storage( "OPTIONS" );

			Object.values( STORAGE_INFO["OPTIONS"] ).filter((a)=>{ return a.option_id == DATA.option_id })[0].value.active = EVENT.target.checked;

			await set_storage( { "OPTIONS" : STORAGE_INFO["OPTIONS"] } );
			EVENT.stopPropagation();
		},
		mouseover : ( EVENT, TARGET_EL, DATA ) => 
		{

			EVENT.stopPropagation();
		}
	},
	"OPTIONS_SETTINGS_button" : //must match with the listener_id properties in the dom elements 
	{
		change : async ( EVENT, TARGET_EL, DATA ) => 
		{
			console.log(EVENT.target)
			const STORAGE_INFO = await get_storage( "OPTIONS" );

			Object.values( STORAGE_INFO["OPTIONS"] ).filter((a)=>{ return a.option_id == DATA.option_id })[0].value = EVENT.target.value;
			
			await set_storage( { "OPTIONS" : STORAGE_INFO["OPTIONS"] } );
			EVENT.stopPropagation();
		},
		mouseover : ( EVENT, TARGET_EL, DATA ) => 
		{

			EVENT.stopPropagation();
		}
	},
	"OPTIONS_SETTINGS_dropdown" : //must match with the listener_id properties in the dom elements 
	{
		change : async ( EVENT, TARGET_EL, DATA ) => 
		{
			console.log(EVENT.target)
			const STORAGE_INFO = await get_storage( "OPTIONS" );

			Object.values( STORAGE_INFO["OPTIONS"] ).filter((a)=>{ return a.option_id == DATA.option_id })[0].value = EVENT.target.value;
			
			await set_storage( { "OPTIONS" : STORAGE_INFO["OPTIONS"] } );
			EVENT.stopPropagation();
		},
		mouseover : ( EVENT, TARGET_EL, DATA ) => 
		{

			EVENT.stopPropagation();
		}
	}
	/*
	"your_listener_id" : //must match with the listener_id properties in the dom elements 
	{
		click : ( EVENT, TARGET_EL, DATA ) => 
		{
			
			EVENT.stopPropagation();
		},
		mouseover : ( EVENT, TARGET_EL, DATA ) => 
		{
			TARGET_EL.style.filter = "drop-shadow(2px 4px 6px gray)";
			EVENT.stopPropagation();
		},
		mouseleave : ( EVENT, TARGET_EL, DATA ) => 
		{
			TARGET_EL.style.filter = "none";
			EVENT.stopPropagation();
		}
	}
	*/
};	