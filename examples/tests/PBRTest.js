//
//  PBRTest.js
//  examples/tests
//
//  Created by Eric Levin on 1/21/16.
//  Copyright 2016 High Fidelity, Inc.

//  A test script for importing a model with Maya's Stingray PBS material to check for parity with how Stingray and Maya render this model
//
//  Distributed under the Apache License, Version 2.0.
//  See the accompanying file LICENSE or http://www.apache.org/licenses/LICENSE-2.0.html
//


var orientation = Camera.getOrientation();
orientation = Quat.safeEulerAngles(orientation);
orientation.x = 0;
orientation = Quat.fromVec3Degrees(orientation);
var center = Vec3.sum(MyAvatar.position, Vec3.multiply(3, Quat.getFront(orientation)));
// var modelURL = "http://hifi-content.s3.amazonaws.com/caitlyn/dev/scratch/GrenadeEmbedded.fbx";
//var modelURL = "file:///C:/Users/Eric/Desktop/GrenadeEmbedded.fbx?v1" + Math.random();
var modelURL = "file:///C:/Users/Eric/Desktop/grenade.fbx?v1" + Math.random();
var pbrModel = Entities.addEntity({
    type: "Model",
    modelURL: modelURL,
    position: center,
    dimensions: {x: 0.98, y: 2.03, z: 1.20}
});

function cleanup() {
    Entities.deleteEntity(pbrModel);
}

Script.scriptEnding.connect(cleanup);