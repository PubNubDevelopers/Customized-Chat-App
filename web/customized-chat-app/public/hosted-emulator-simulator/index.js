var txtTitle
var txtBody
var chkFCM
var chkAPNS
var chkFCMMessageNotification
var chkFCMMessageData

function bootstrap() {
  createSimulators();
}

function createSimulators() {
  var urlParams = new URLSearchParams(window.location.search)
  var configurationFromQueryParams = urlParams.get('configuration');
  if (!configurationFromQueryParams) {
    console.log('Failed to detect configuration in URL query params.  Could not load simulator / emulator');
    document.getElementById('ios-device').innerHTML = "Failed to detect identifier in query params.  Could not load iOS simulator"
    document.getElementById('android-device').innerHTML = "Failed to detect identifier in query params.  Could not load Android emulator"
    return;
  }
  else {
    var simulatorWidth = " width='404px'";
    //var simulatorHeight = " height='698px'";
    var simulatorHeight = " height='852px'";

    //  Android
    var device_android = "pixel8pro"
    var appId_android = "b_4wiugox33t37rwxhnw25qi24mq";
    var otherParams_android = "&scale=auto&screenOnly=false&osVersion=14.0&centered=both&grantPermissions=true"
    var encodedJson_android = encodeURIComponent(JSON.stringify({configuration: configurationFromQueryParams}))
    var iFrameSource_android = "<iframe src='https://appetize.io/embed/" + appId_android + "?device=" + device_android + otherParams_android + "&params=" + encodedJson_android + "'" + simulatorWidth + simulatorHeight + "></iframe>";
    document.getElementById('android-device').innerHTML = iFrameSource_android

    //  iOS
    var device_ios = "iphone16promax"
    var appId_ios = "b_xupgmrqqop7rdcxsqkdx7ba4dm"
    var otherParams_ios = "&scale=auto&screenOnly=false&osVersion=18.0&centered=both"
    var encodedJson_ios = encodeURIComponent(JSON.stringify({configuration: configurationFromQueryParams}))
    var iFrameSource_ios = "<iframe src='https://appetize.io/embed/" + appId_ios + "?device=" + device_ios + otherParams_ios + "&params=" + encodedJson_ios + "'" + simulatorWidth + simulatorHeight + "></iframe>";
    document.getElementById('ios-device').innerHTML = iFrameSource_ios
  }
}




