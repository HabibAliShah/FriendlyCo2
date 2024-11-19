# Friendly Co2
A Chrome extension that show's the Carboon Footprint of the user

![image](https://github.com/user-attachments/assets/5319411e-ccba-47d7-bf8d-1d571b94cd3c)

Our online activity comes with a price. From responding to an email, ordering online, surfing the internet, watching a video, we release Co2 in the air.
This Chrome Extension measures the digital footprint of the internet.

# Features
1) Provides total browsing time.
2) Show's the total data downloaded.
3) Calculates Co2.
4) Comparison of GHG (Green House Gases) emitted which is equivalent to charging a smartphone.

# Carbon Intensity Factor:
### The code has a set of predefined values for different regions:
1) European Union: 276 gCO2/kWh
2) France: 34.8 gCO2/kWh
3) United States: 493 gCO2/kWh
4) hina: 681 gCO2/kWh
5) Default Region: 519 gCO2/kWh (for unspecified regions).

# Power Usage Constants:
1) kwh_per_byte_network = 0.000000000152: Energy consumed per byte of data transferred over a network.
2) kwh_per_minute_device = 0.00021: Energy consumed per minute by the user's device (likely a computer or phone).
3) ges_gco2_for_one_km_by_car = 220: The amount of CO2 (in grams) emitted by a car per kilometer driven.
4) ges_gco2_for_one_charged_smartphone = 8.3: The amount of CO2 emitted to fully charge one smartphone.

# Calculations:
The function get_stats() aggregates data usage statistics (stats) from the extension's storage. 

### Data Center CO2 (gCO2):


`EQUIVALENT_STATS["ges_data_center_total"] = EQUIVALENT_STATS["kwh_data_center_total"] * default_carbon_intensity_factor_ing_co2_per_kwh;`

- #### This is the CO2 emitted by data centers based on the energy consumed.

### Network CO2 (gCO2):

`EQUIVALENT_STATS["ges_network_total"] = EQUIVALENT_STATS["kwh_network_total"] * default_carbon_intensity_factor_ing_co2_per_kwh;`

### Device CO2 (gCO2):

`EQUIVALENT_STATS["ges_device_total"] = EQUIVALENT_STATS["kwh_device_total"] * carbon_intensity_factor_ing_co2_per_kwh[ USER_LOCATION_OPTION != null ? USER_LOCATION_OPTION : user_location ];`

- #### This is the CO2 emitted by the user's device, adjusted for the user's region.

### The total CO2 emissions are the sum of all these individual sources:

`EQUIVALENT_STATS["gco2_total"] = Math.round(EQUIVALENT_STATS["ges_data_center_total"] + EQUIVALENT_STATS["ges_network_total"] + EQUIVALENT_STATS["ges_device_total"]);`

- #### Smartphone Charging: The CO2 emissions are also converted into the number of smartphones that could be charged:

`EQUIVALENT_STATS["charged_smartphones"] = Math.round(EQUIVALENT_STATS["gco2_total"] / ges_gco2_for_one_charged_smartphone);`
- #### This tells the user how many smartphones could be fully charged with the same amount of CO2.

# Components
This repo contains the following files:
1) poopup.html
Structure of the extension
2) index.js
Contains the main Javascript code.
3) manifest.json
Serves as the extension’s metadata and configuration.

# How to run
1) Download the repo.
2) Unpack/unzip.
3) Go to Chrome Browser.
4) In the search bar type: chrome://extensions/
5) Toggle on the developer mode option in the top right corner.
6) Click on load unpacked in the top left corner, select the unpacked/unzipped file.
7) Once done, the Chrome extension has been installed.
8) Click on the extensions icon in the top right corner & click on the newely installed extension.

# Privacy
None of your data are collected: all browsing data are analyzed directly on the user device and are not sent or processed anywhere else in any way.
