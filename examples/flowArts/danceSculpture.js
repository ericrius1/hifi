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

var basePosition = MyAvatar.position;
basePosition.y += 0.5;


//create spheres all around avatar
var yRot = Quat.safeEulerAngles(MyAvatar.orientation).y;

var spheres = [];

// Cutoff at which spheres respond to attractor
var attractionDistanceThreshold = 0.1;
var startingHue = 0.0;
var maxHue = 1.0;
var hslColor = {
    h: startingHue,
    s: 0.7,
    l: 0.5
};

// var direction = Quat.getOrientation
createSphereOfSpheres();

function createSphereOfSpheres() {
    var sphereRadius = 0.03;

    var numSpheresInLayer = 10;
    var radius = 0.7;
    var verticalOffset = 0;
    var numVerticalLayersInHemisphere = 5
    var thetaStart = degreesToRadians(yRot) - Math.PI / 4;
    var thetaLength = Math.PI;
    var spherePosition = basePosition;
    // Create stacked layers of circles made from spheres, to create a metasphere!
    for (var verticalLayerIndex = 0; verticalLayerIndex < numVerticalLayersInHemisphere; verticalLayerIndex++) {
        for (var i = 0; i < numSpheresInLayer; i++) {
            var segmentAngle = thetaStart + i / numSpheresInLayer * thetaLength;
            var orientation = Quat.fromPitchYawRollRadians(0, segmentAngle, 0);
            var offset = Vec3.multiply(Quat.getFront(orientation), radius);

            // Top Hemisphere layer
            offset.y += verticalOffset;
            spherePosition = Vec3.sum(basePosition, offset);
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

            // Bottom Hemisphere Layer
            offset.y -= verticalOffset * 2;
            spherePosition = Vec3.sum(basePosition, offset);
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
        verticalOffset += 0.1;
        radius -= 0.1;
    }

}

function update() {
    // Go through each sphere- if it's within a certain range, move it towards avatar as a function of how close it is to avatar
    var spherePosition, rightHandDistance, leftHandDistance;
    var rightHue = startingHue;
    var leftHue = startingHue;
    var rightHandPosition = MyAvatar.getRightPalmPosition();
    var leftHandPosition = MyAvatar.getLeftPalmPosition();
    spheres.forEach(function(sphere) {
        spherePosition = Entities.getEntityProperties(sphere, "position").position;
        rightHandDistance = Vec3.distance(spherePosition, rightHandPosition);
        leftHandDistance = Vec3.distance(spherePosition, leftHandPosition);
        if (rightHandDistance < attractionDistanceThreshold) {
            rightHue = map(rightHandDistance, 0, attractionDistanceThreshold, maxHue, startingHue);
        }
        if (leftHandDistance < attractionDistanceThreshold) {
            leftHue = map(leftHandDistance, 0, attractionDistanceThreshold, maxHue, startingHue);
        }
        hue = rightHue;
        hslColor.h = hue;
        Entities.editEntity(sphere, {
            color: hslToRgb(hslColor)
        })
    });
}

function cleanup() {
    spheres.forEach(function(sphere) {
        Entities.deleteEntity(sphere);
    })
}

Script.update.connect(update);
Script.scriptEnding.connect(cleanup);