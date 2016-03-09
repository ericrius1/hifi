// The client script that provides the user with DJ functionality




var CARTRIDGE_SEARCH_TIME = 1000;
var CARTRIDGE_SEARCH_RANGE = 2;

var SOUND_CARTRIDGE_NAME = "VRVJ-Sound-Cartridge";
var activeCartridges = [];
Script.setInterval(searchForSoundCartridges, CARTRIDGE_SEARCH_TIME);


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



