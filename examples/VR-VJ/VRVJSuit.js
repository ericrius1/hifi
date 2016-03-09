// The client script that provides the user with DJ functionality

Script.include("../libraries/utils.js");

var CARTRIDGE_SEARCH_TIME = 2000;
var CARTRIDGE_SEARCH_RANGE = 5;

var CARTRIDGE_PLAY_RANGE = 0.5;
var SOUND_CARTRIDGE_NAME = "VRVJ-Sound-Cartridge";
var activeCartridges = [];
searchForSoundCartridges();
Script.setInterval(searchForSoundCartridges, CARTRIDGE_SEARCH_TIME);

var CARTRIDGE_VOLUME_UPDATE_TIME = 50;
Script.setInterval(updateCartridgeVolumes, CARTRIDGE_VOLUME_UPDATE_TIME);

var volumeData;

function updateCartridgeVolumes() {
    activeCartridges.forEach(function(cartridge) {
        var cartridgePosition = Entities.getEntityProperties(cartridge, "position").position;
        var rightHandToCartridgeDistance = Vec3.distance(cartridgePosition, MyAvatar.getRightPalmPosition());
        var leftHandToCartridgeDistance = Vec3.distance(cartridgePosition, MyAvatar.getLeftPalmPosition());
        var closestHandToCartridgeDistance = Math.min(rightHandToCartridgeDistance, leftHandToCartridgeDistance);
        
        var newVolume;
        if (closestHandToCartridgeDistance > CARTRIDGE_PLAY_RANGE) {
            newVolume = 0;
        } else {
            newVolume = map(closestHandToCartridgeDistance, 0, CARTRIDGE_PLAY_RANGE, 1, 0);
            newVolume = clamp(newVolume, 0, 1);

        }
        volumeData = {volume: newVolume};
        Entities.callEntityMethod(cartridge, "setVolume", [JSON.stringify(volumeData)]);
    });
}


function searchForSoundCartridges() {
    activeCartridges = [];
    var entities = Entities.findEntities(MyAvatar.position, CARTRIDGE_SEARCH_RANGE);
    for(var i = 0; i < entities.length; i++) {
        var entity = entities[i];
        var name = Entities.getEntityProperties(entity, "name").name;
        if (name.indexOf(SOUND_CARTRIDGE_NAME) !== -1) {
            activeCartridges.push(entity);
        }
    }
    print("ACTIVE CARTRIDGES " + activeCartridges.length)
}

var MAPPING_NAME = "com.highfidelity.VRVJ";

var mapping = Controller.newMapping(MAPPING_NAME);
mapping.from(Controller.Standard.RB).peek().to(rightBumperPress)
Controller.enableMapping(MAPPING_NAME);
var rawTriggerValue;
function rightBumperPress(value) {
    if (value === 1) {
        print("BUMPER PRESS");
    }
}



