//
//  danceSculpture.js
//  examples/flowArts/danceSculpture.js
//
//  Created by Eric Levin on 1/13/16.
//  Copyright 2016 High Fidelity, Inc.
//
//  This script creates a sphere made out of lines/spheres all around avatar and moves based on avatar hand position
//
//  var orientation = Camera.getOrientation
//  Distributed under the Apache License, Version 2.0.
//  See the accompanying file LICENSE or http://www.apache.org/licenses/LICENSE-2.0.html
//

var sculptureRadius = 2;
var basePosition = MyAvatar.position;

var sphereRadius = 0.2;

//create spheres all around avatar
var numSpheres = 10;
var thetaStart = 0;
var thetaLength = Math.PI * 2;

var spheres = [];

// var direction = Quat.getOrientation

var spherePosition = basePosition;
for (var i = 0; i < numSpheres; i++) {
    var segmentAngle = thetaStart + i / numSpheres * thetaLength;
    var orientation = Quat.fromPitchYawRollRadians(0, segmentAngle, 0);
    var offset = Vec3.multiply(Quat.getFront(orientation), sculptureRadius);
    var spherePosition = Vec3.sum(basePosition, offset);

    var sphere = Entities.addEntity({
        type: "Sphere",
        position: spherePosition,
        dimensions: {
            x: sphereRadius,
            y: sphereRadius,
            z: sphereRadius
        },
        color: {
            red: 200,
            green: 10,
            blue: 200
        }
    });
    spheres.push(sphere);
}

function update() {
    // Go through each sphere- if it's within a certain range, move it outward from center of sphere
}

function cleanup() {
    spheres.forEach(function(sphere) {
        Entities.deleteEntity(sphere);
    })
}

Script.update.connect(update);
Script.scriptEnding.connect(cleanup);