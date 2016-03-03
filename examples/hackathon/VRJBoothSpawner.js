// Spawns a booth  and a bunch of special sound cartridges that a user can grab and place close to them.
// Once cartridges are inside sphere, they will listen for Entities.callEntityMethod from client and play their sound accordingly
// cartriges should be as stateless as possible
Script.include("../libraries/utils.js");
var orientation = Camera.getOrientation();
orientation = Quat.safeEulerAngles(orientation);
orientation.x = 0;
orientation = Quat.fromVec3Degrees(orientation);

var SPHERE_RADIUS = 2;
var CARTRIDGE_SEARCH_HZ = 100;
var CARTRIDGE_PARAM_UPDATE_HZ = 100;


var CARTRIDGE_NAME = "VR_VJ_CARTRIDGE";
var LIGHT_NAME = "VR_VJ_LIGHT";

var activeCartridges = [];
var rightHandPosition, leftHandPosition;

var SPHERE_POSITION = MyAvatar.position;
var sphereOverlay = Overlays.addOverlay('sphere', {
    size: SPHERE_RADIUS * 2,
    position: SPHERE_POSITION,
    color: {
        red: 200,
        green: 10,
        blue: 10
    },
    alpha: 0.2,
    solid: true,
    visible: true
});


var LIGHT_POSITION = {x: 136, y: 48.5, z: 553};
var vrVJLight = Entities.addEntity({
    type: "Light",
    name: LIGHT_NAME,
    falloffRadius: 20,
    dimensions: {x: 1000, y: 1000, z: 1000},
    position: LIGHT_POSITION,
    intensity: 20,
    color: {red: 150, green: 100, blue: 170}
});




function updateCartridgeParams() {
    // go through our active list...
    activeCartridges.forEach(function(activeCartridge) {
        var cartridgePosition = Entities.getEntityProperties(activeCartridge, "position").position;
        var distanceToRightHand = Vec3.distance(MyAvatar.getRightPalmPosition(), cartridgePosition);
        var distanceToLeftHand = Vec3.distance(MyAvatar.getLeftPalmPosition(), cartridgePosition);
        var distanceToClosestHand = Math.min(distanceToLeftHand, distanceToRightHand);
        // The closer the hand, the louder the sound should be...
        Entities.callEntityMethod(activeCartridge, "setDistanceToClosestHand", [JSON.stringify({distanceToClosestHand: distanceToClosestHand})])
    });
}


function cartridgeSearch() {
    // Get all entities in search sphere and for the ones that have soundURLs and are cartridges, call their entityMethod with appropriate data
    //DOing it with entity scripts makes it more scalable to multiuser since a friend can come grab cartriges from you
    // Folks can create thier own loops and share them amongst each other.
    // True multiuser DJing

    var entities = Entities.findEntities(SPHERE_POSITION, SPHERE_RADIUS);
    entities.forEach(function(entity) {
        var name = Entities.getEntityProperties(entity, "name").name;
        var userData = getEntityUserData(entity);

        if (name === CARTRIDGE_NAME && userData.soundURL) {
            //We have a cartridge- play it
            if (!cartridgeInActiveList(entity)) {
                Entities.callEntityMethod(entity, "activate");
                activeCartridges.push(entity);
            }
        }

    });

    removeOutOfRangeCartridgesFromActiveList();

}

function cartridgeInActiveList(cartridgeToCheck) {
    // Check to see if specified cartrige is in this active list
    for (var i = 0; i < activeCartridges.length; i++) {
        if (entitiesEqual(activeCartridges[i], cartridgeToCheck)) {
            return true;
        }
    }
    return false;
}

function cartridgeIsInRange(cartridge) {
    var cartridgePosition = Entities.getEntityProperties(cartridge, "position").position;
    var distance = Vec3.distance(cartridgePosition, SPHERE_POSITION).toFixed(2);
    if (distance > SPHERE_RADIUS) {
        return false;
    }

    return true;

}

function removeOutOfRangeCartridgesFromActiveList() {
    var cartridgeIndicesToRemove = [];
    for (var i = 0; i < activeCartridges.length; i++) {
        var activeCartridge = activeCartridges[i];
        if (!cartridgeIsInRange(activeCartridge)) {
            cartridgeIndicesToRemove.push(i);
            Entities.callEntityMethod(activeCartridge, "deactivate");
        }
    }

    cartridgeIndicesToRemove.forEach(function(cartridgeIndex) {
           activeCartridges.splice(cartridgeIndex, 1);
            print("EBL SPLICE OUT OF RANGE CLIP!")
    });

}

function entitiesEqual(entityA, entityB) {
    if (!entityA || !entityB) {
        print("ONE OR BOTH OF THESE ENTITIES ARE UNDEFINED");
        return false;
    }
    var isEqual = JSON.stringify(entityA) === JSON.stringify(entityB) ? true : false;
    return isEqual;
}

function cleanup() {
    Overlays.deleteOverlay(sphereOverlay);
    Entities.deleteEntity(vrVJLight);
}


Script.setInterval(cartridgeSearch, CARTRIDGE_SEARCH_HZ);
Script.setInterval(updateCartridgeParams, CARTRIDGE_PARAM_UPDATE_HZ);
Script.scriptEnding.connect(cleanup);
