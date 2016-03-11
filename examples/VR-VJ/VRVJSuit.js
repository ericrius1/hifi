// The client script that provides the user with DJ functionality

Script.include("../libraries/utils.js");

var CARTRIDGE_SEARCH_TIME = 2000;
var CARTRIDGE_SEARCH_RANGE = 5;



var CARTRIDGE_PLAY_RANGE = 0.5;
var SOUND_CARTRIDGE_NAME = "VRVJ-Sound-Cartridge";
var activeCartridges = [];
searchForSoundCartridges();
Script.setInterval(searchForSoundCartridges, CARTRIDGE_SEARCH_TIME);

var CARTRIDGE_VOLUME_UPDATE_TIME = 16;
Script.setInterval(updateCartridgeVolumes, CARTRIDGE_VOLUME_UPDATE_TIME);

var volumeData;

var isEditing = false;


var PLAY_COLOR = {
    red: 10,
    green: 200,
    blue: 10
};
var EDIT_COLOR = {
    red: 200,
    green: 10,
    blue: 10
};

createHandParticles();


function updateCartridgeVolumes() {
    // Only do this if we're in play mode (not in edit mode)

    activeCartridges.forEach(function(cartridge) {
        var cartridgePosition = Entities.getEntityProperties(cartridge, "position").position;
        var rightHandToCartridgeDistance = Vec3.distance(cartridgePosition, MyAvatar.getRightPalmPosition());
        var leftHandToCartridgeDistance = Vec3.distance(cartridgePosition, MyAvatar.getLeftPalmPosition());
        var closestHandToCartridgeDistance = Math.min(rightHandToCartridgeDistance, leftHandToCartridgeDistance);

        var newVolume, volumeData;
        if (!isEditing) {

            if (closestHandToCartridgeDistance > CARTRIDGE_PLAY_RANGE) {
                newVolume = 0;
            } else {
                newVolume = map(closestHandToCartridgeDistance, 0, CARTRIDGE_PLAY_RANGE, 1, 0);
                newVolume = clamp(newVolume, 0, 1);
            }
        } else {
            newVolume = -1;
        }
        volumeData = {
            volume: newVolume
        };
        Entities.callEntityMethod(cartridge, "setSoundData", [JSON.stringify(volumeData)]);
    });
}


function searchForSoundCartridges() {
    activeCartridges = [];
    var entities = Entities.findEntities(MyAvatar.position, CARTRIDGE_SEARCH_RANGE);
    for (var i = 0; i < entities.length; i++) {
        var entity = entities[i];
        var name = Entities.getEntityProperties(entity, "name").name;
        if (name.indexOf(SOUND_CARTRIDGE_NAME) !== -1) {
            activeCartridges.push(entity);
        }
    }
}

function toggleMode() {
    isEditing = !isEditing;

}

function rightBumperPress(value) {
    print("BUMPER PRESS")
    if (value === 1) {
        toggleMode();
    }
    if (isEditing) {
        Entities.editEntity(rightHandEmitter, {color: EDIT_COLOR});
        Entities.editEntity(leftHandEmitter, {color: EDIT_COLOR});
    } else {
        Entities.editEntity(rightHandEmitter, {color: PLAY_COLOR});
        Entities.editEntity(leftHandEmitter, {color: PLAY_COLOR});
    }

}

var rightHandEmitter, leftHandEmitter;

function createHandParticles() {
    var color = {
        red: 15,
        green: 92,
        blue: 12
    };
    var radius = 0.01;
    var handParticleProps = {
        type: "ParticleEffect",
        name: "VRVJ Hand Emitter",
        parentID: MyAvatar.sessionUUID,
        parentJointIndex: MyAvatar.getJointIndex("RightHandMiddle1"),
        position: MyAvatar.getRightPalmPosition(),
        isEmitting: true,
        colorStart: {red: 100, green: 20, blue: 150},
        color: PLAY_COLOR,
        colorFinish: PLAY_COLOR,
        maxParticles: 100000,
        lifespan: 2.0,
        emitRate: 100,
        emitSpeed: 0.0,
        speedSpread: 0.00,
        emitAcceleration: {
            x: 0,
            y: 0,
            z: 0
        },
        accelerationSpread: {
            x: 0.01,
            y: 0.01,
            z: 0.01
        },
        radiusStart: radius,
        particleRadius: radius,
        radiusFinish: radius + 0.001,
        alpha: 0.5,
        alphaSpread: 0.0,
        alphaStart: 1,
        alphaFinish: 0,
        textures: "https://s3.amazonaws.com/hifi-public/eric/textures/particleSprites/beamParticle.png",
        emitterShouldTrail: true
    };

    rightHandEmitter = Entities.addEntity(handParticleProps);

    handParticleProps.parentJointIndex = MyAvatar.getJointIndex("LeftHandMiddle1");
    handParticleProps.position = MyAvatar.getLeftPalmPosition();

    leftHandEmitter = Entities.addEntity(handParticleProps);

}

var MAPPING_NAME = "com.highfidelity.VRVJ";

var mapping = Controller.newMapping(MAPPING_NAME);
mapping.from(Controller.Standard.RB).peek().to(rightBumperPress)
Controller.enableMapping(MAPPING_NAME);


function cleanup() {
    Entities.deleteEntity(rightHandEmitter);
    Entities.deleteEntity(leftHandEmitter);

}

Script.scriptEnding.connect(cleanup);