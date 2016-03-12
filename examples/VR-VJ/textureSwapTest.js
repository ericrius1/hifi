var MODEL_URL = "file:///Users/ericlevin1/Desktop/box1.fbx?v1 " + Math.random();
// var MODEL_URL = "http://hifi-public.s3.amazonaws.com/eric/models/box1.fbx?v1" + Math.random();
var center = Vec3.sum(MyAvatar.position, Vec3.multiply(2, Quat.getFront(Camera.getOrientation())));


var box = Entities.addEntity({
    type: "Model",
    name: "Test Box",
    modelURL: MODEL_URL,
    position: center,
    dimensions: {x: 0.5, y: 0.5, z: 0.5}
});

// var box = Entities.addEntity({
//     type: "Box",
//     name: "Test Box",
//     position: center,
//     color: {red: 200, green: 10, blue: 200},
//     dimensions: {x: 0.5, y: 0.5, z: 0.5}
// });

Script.setTimeout(function() {
    Entities.editEntity(box, {
        textures: 'emissive:"http://localhost:3002/boxtestemissive.png", \ndiffuse:"http://localhost:3002/boxtestdiffuse.png"'
    })
}, 2000)


function cleanup() {
    Entities.deleteEntity(box);
}

Script.scriptEnding.connect(cleanup);