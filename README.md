# norwichtravel
Norwich Travel Information Website (HCI CW2 - CMP-6039A)

## How To Do The Do

1. `npm install -g yarn //why aren't you using yarn already?`
1. `yarn install        //get all the dependencies`
1. `yarn test           //run the Jest testwatcher`
1. `yarn android        //adb to start android emulator or device installation`
1. `yarn ios            //use Simulator to emulate iOS emulation`

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
* Done.

### Linux
* `sudo apt-get install android-sdk`
* Install Genymotion
* Done.

## Get Simulator
* Haven't tried this yet.
