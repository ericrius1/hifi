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

Script.include('../libraries/utils.js');

var sculptureRadius = 0.7;
var basePosition = MyAvatar.position;
basePosition.y += 0.5;

var sphereRadius = 0.03;

//create spheres all around avatar
var yRot = Quat.safeEulerAngles(MyAvatar.orientation).y;
var numSpheres = 50;
var thetaStart = degreesToRadians(yRot) - Math.PI/4;
var thetaLength =  Math.PI;

var spheres = [];

// Cutoff at which spheres respond to attractor
var attractionDistanceThreshold = 0.1;

var hslColor = {h: 0.7, s: 0.5, l: 0.5};

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
        color: hslToRgb(hslColor)
    });
    spheres.push(sphere);
}

function update() {
    // Go through each sphere- if it's within a certain range, move it towards avatar as a function of how close it is to avatar
    var spherePosition, distance, hue;
    var handPosition = MyAvatar.getRightPalmPosition();
    spheres.forEach( function(sphere) {
        spherePosition = Entities.getEntityProperties(sphere, "position").position;
        distance = Vec3.distance(spherePosition, handPosition);
        if (distance < attractionDistanceThreshold) {
            hue = map(distance, 0, attractionDistanceThreshold, 0.2, 0.7);
            hslColor.h = hue;
            Entities.editEntity(sphere, {color: hslToRgb(hslColor)})
        }
    });
}

function cleanup() {
    spheres.forEach(function(sphere) {
        Entities.deleteEntity(sphere);
    })
}

Script.update.connect(update);
Script.scriptEnding.connect(cleanup);