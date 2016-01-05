//
//  flowArtsHutSpawner.js
//  examples/flowArts
//
//  Created by Eric Levin on 12/17/15.
//  Copyright 2015 High Fidelity, Inc.
//
//  This script creates a special flow arts hut with a bunch of flow art toys people can go in and play with
//
//
//  Distributed under the Apache License, Version 2.0.
//  See the accompanying file LICENSE or http://www.apache.org/licenses/LICENSE-2.0.html
//


Script.include("../../libraries/utils.js");
Script.include("lightBall/lightBall.js");
Script.include("raveStick/raveStick.js");
Script.include("lightSaber/lightSaber.js");
Script.include("arcBall/arcBall.js");



var basePosition = Vec3.sum(MyAvatar.position, Vec3.multiply(1, Quat.getFront(Camera.getOrientation())));
basePosition.y = MyAvatar.position.y;

// RAVE ITEMS
// var lightBall = new LightBall(basePosition);

var arcBalls = [];
var numArcBalls = 5;
createArcBalls();



var modelURL = "https://s3-us-west-1.amazonaws.com/hifi-content/eric/models/RaveRoom.fbx";

var roomDimensions = {
    x: 30.58,
    y: 15.29,
    z: 30.58
};


function createArcBalls() {
    for (var i = 0; i < numArcBalls; i++) {
        var beamVisible = i < 1 ? true : false;
        var arcBall = new ArcBall(Vec3.sum(basePosition, {
            x: Math.random(),
            y: Math.random(),
            z: Math.random()
        }), beamVisible);
        arcBalls.push(arcBall);
    }

}

function cleanup() {

    // lightBall.cleanup();
    arcBalls.forEach(function(arcBall) {
        arcBall.cleanup();
    });
}

Script.scriptEnding.connect(cleanup);

function mousePressEvent() {
    arcBalls.forEach(function(arcBall) {
        arcBall.toggleVisibility();
    });
}
// Controller.mousePressEvent.connect(mousePressEvent);