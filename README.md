
## cd into the project
$ cd /app

## install npm modules
$ yarn

## Now cd into the android folder
$ cd android

## build the app
$ ./gradlew assembleRelease

###Uygulamayı Emulatörde çalıştırma.

react-native run-android

Console 
Emulatör Çalıştıktan sonra ctrl+m, menuden debug js remotely seç. | adb shell input keyevent 82


http://api.gymnasticsmentor.com/


## adb commands

App Developer Menu => 
adb shell input keyevent 82

Re-connect device => 
adb reverse tcp:8081 tcp:8081

Compile & Run as release version
react-native run-android --variant=release


gradlew assembleRelease --no-configure-on-demand