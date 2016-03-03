Script.include("../libraries/utils.js");

var orientation = Camera.getOrientation();
orientation = Quat.safeEulerAngles(orientation);
orientation.x = 0;
orientation = Quat.fromVec3Degrees(orientation);
var SPHERE_RADIUS = 2;
var cartridgeBasePosition = Vec3.sum(MyAvatar.getHeadPosition(), Vec3.multiply(SPHERE_RADIUS + 0.15, Quat.getFront(orientation)));
var cartridges = [];

var CARTRIDGE_NAME = "VR_VJ_CARTRIDGE";

var clipURLS = ["https://s3-us-west-1.amazonaws.com/hifi-content/eric/Sounds/hackathonSounds/chords.wav",
    "https://s3-us-west-1.amazonaws.com/hifi-content/eric/Sounds/hackathonSounds/build.wav?v3",
    "https://s3-us-west-1.amazonaws.com/hifi-content/eric/Sounds/hackathonSounds/piano.wav?v1",
    "https://s3-us-west-1.amazonaws.com/hifi-content/eric/Sounds/hackathonSounds/voice.wav",
    "https://s3-us-west-1.amazonaws.com/hifi-content/eric/Sounds/hackathonSounds/beat.wav",
    "https://s3-us-west-1.amazonaws.com/hifi-content/eric/Sounds/hackathonSounds/drop.wav"
];

function spawnCartridges() {
    // When spawning 
    var SCRIPT_URL = Script.resolvePath("vjVRCartridgeEntityScript.js?v1" + Math.random());
    var defaultColor = {red: 200, green: 10, blue: 10};
    var cartridgeProps = {
        type: "Box",
        name: CARTRIDGE_NAME,
        script: SCRIPT_URL,
        dynamic: true,
        dimensions: {
            x: 0.1,
            y: 0.1,
            z: 0.1
        },
        damping: 1,
        angularDamping: 1,
    };

    for (var i = 0; i < clipURLS.length; i++) {
        var userData = {
            soundURL: clipURLS[i]
        }
        if (i === 0) {
            userData.visualComponent = "light_intensity";
            cartridgeProps.position = Vec3.sum(MyAvatar.getHeadPosition(), Vec3.multiply(0.4, Quat.getFront(orientation)));
        } else {
            cartridgeProps.position = cartridgeBasePosition;
            cartridgeProps.position.y = cartridgeBasePosition.y + randFloat(-0.7, 0.7);
        }

        if (i === 1 || i === 5) {
            userData.maxVolume = 1.0;
            cartridgeProps.color = {red: 200, green: 10, blue: 200};
        } else if (i === 4) {
            cartridgeProps.color = {red: 200, green: 10, blue: 200};
            userData.visualComponent = "particle_storm";
        }
        else {
            cartridgeProps.color = defaultColor;
        }



        cartridgeProps.userData = JSON.stringify(userData);
        var cartridge = Entities.addEntity(cartridgeProps);
        cartridges.push(cartridge);

    }

    Script.setTimeout(function() {
        cartridges.forEach(function(cartridge) {
            Entities.callEntityMethod(cartridge, "playSound");
        });
    }, 2000)
}

spawnCartridges();

function cleanup() {
    cartridges.forEach(function(cartridge) {
        Entities.deleteEntity(cartridge);
    });
}

Script.scriptEnding.connect(cleanup);