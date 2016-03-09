// The client script that provides the user with DJ functionality




var ENTITY_SEARCH_TIME = 1000;


var MAPPING_NAME = "com.highfidelity.VRVJ";

var mapping = Controller.newMapping(MAPPING_NAME);
mapping.from(Controller.Standard.RB).peek().to(rightBumperPress)
Controller.enableMapping(MAPPING_NAME);
var rawTriggerValue;
function rightBumperPress(value) {
    if (value === 1) {
        print("BUMPER PRESS")
    }
}



