var orientation = Camera.getOrientation();
orientation = Quat.safeEulerAngles(orientation);
orientation.x = 0;
orientation = Quat.fromVec3Degrees(orientation);
var center = Vec3.sum(MyAvatar.position, Vec3.multiply(3, Quat.getFront(orientation)));
var currentDimensions = {
    x: 0.7,
    y: 0.7,
    z: 0.7
};

var block1 = Entities.addEntity({
    type: "Box",
    dimensions: currentDimensions,
    position: center,
    color: {
        red: 200,
        green: 10,
        blue: 10
    },
    collisionsWillMove: true,
    userData: JSON.stringify({
        grabbableKey: {
            invertSolidWhileHeld: true
        }
    })
});

currentDimensions = Vec3.multiply(currentDimensions, 0.6);
var block2 = Entities.addEntity({
    type: "Box",
    dimensions: currentDimensions,
    position: center,
    color: {
        red: 0,
        green: 200,
        blue: 10
    },
    collisionsWillMove: true,
    userData: JSON.stringify({
        grabbableKey: {
            invertSolidWhileHeld: true
        }
    })
});



function cleanup() {
    Entities.deleteEntity(block1);
    Entities.deleteEntity(block2);
}

Script.scriptEnding.connect(cleanup);