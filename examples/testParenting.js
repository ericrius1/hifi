var orientation = Camera.getOrientation();
orientation = Quat.safeEulerAngles(orientation);
orientation.x = 0;
orientation = Quat.fromVec3Degrees(orientation);
var center = Vec3.sum(MyAvatar.position, Vec3.multiply(3, Quat.getFront(orientation)));
var currentDimensions = {x: 1, y: 1, z: 1};

var block1 = Entities.addEntity({
    type: "Box",
    dimensions: {x: 1, y: 1, z: 1},
    position: center,
    color: {red: 200, green: 10, blue: 10}
});


function cleanup() {
    Entities.deleteEntity(block1);
}

Script.scriptEnding.connect(cleanup);