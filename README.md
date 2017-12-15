# norwichtravel
Norwich Travel Information Website (HCI CW2 - CMP-6039A)

The app is available on Expo at: https://exp.host/@penson122/norwich-travel (Open this in Expo for iOS or Android)

The backend is available on [heroku](https://norwichtravelapi.herokuapp.com)

## How To Do The Do

1. `npm install -g yarn // why aren't you using yarn already?`
1. `yarn install        // get all the dependencies`
1. `yarn test           // run the Jest testwatcher`
1. `yarn android        // adb to start android emulator or device installation`
1. `yarn ios            // use Simulator to emulate iOS emulation`

## Get Android Emulator

### Windows
* Make sure the following have been installed:
    * Android Studio and SDK
    * Genymotion (free for personal use) with VirutalBox!!
        * Inside Genymotion set up Android Virtual Machine 7.1 or later
    * Double check VirtualBox can be run (if not install VirutalBox)
* Add Android\sdk\platform-tools to PATH
* Run Genymotion Virtual Machine
* Run `yarn android` and enjoy the miracles of React (and have a cuppa, that was a lot)

### MacOS
* `brew tap caskroom/cask`
* `brew cask install android-sdk`
* Install Genymotion (free for personal use)
* Go to ADB -> Custom Android SDK, set to location of installed android-sdk
* Done.

### Linux
* `sudo apt-get install android-sdk`
* Install Genymotion
* Done.

## Get Simulator (macOS only)
* Update XCode
* Launch Simulator
* Hardware -> Device -> iOS -> Select a device

## Set up server
* Set environment variables
* Or use .env file in server/.env
* TRANSPORT_API_ID=MY_APP_ID
* TRANSPORT_API_KEY=MY_TRANSPORT_KEY
* GOOGLE_MAPS_KEY=MY_GOOGLE_MAPS_KEY

### Get the keys
Transport API Keys are available from [TransportAPI](https://developer.transportapi.com)
Google Maps API Key are available from [Google Maps](https://developers.google.com/maps/documentation/javascript/get-api-key)


## API Docs
* If you want test against your own version of the server change the `constants.js NORWICH_API` to the url for your server
* All dates must be formatted yyyy-mm-dd
* All times must be formated HH:MM

`GET :/ train/:station` -> [example](https://norwichtravelapi.herokuapp.com/train/NRW)

`GET :/ train/:station/:date` -> [example](https://norwichtravelapi.herokuapp.com/train/NRW/2018-01-01)

`GET :/ train/:station/:date/:time` -> [example](https://norwichtravelapi.herokuapp.com/train/NRW/2018-01-01/15:00)

`GET :/ bus/:code`

`GET :/ bus/:code/:date`

`GET :/ bus/:code/:date/:time`

`GET :/ taxis` -> [example](https://norwichtravelapi.herokuapp.com/taxis)
