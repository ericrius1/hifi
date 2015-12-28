//
//  arcBall.js
//  examples/arcBall
//
//  Created by Eric Levin on 12/17/15.
//  Copyright 2015 High Fidelity, Inc.
//
//  This script creats a particle light ball which makes particle trails as you move it.
//
//
//  Distributed under the Apache License, Version 2.0.
//  See the accompanying file LICENSE or http://www.apache.org/licenses/LICENSE-2.0.html
//

Script.include("../../libraries/utils.js");


var scriptURL = Script.resolvePath("arcBallEntityScript.js?v1" + Math.random());
ArcBall = function(spawnPosition, beamVisible) {
    var radius = randFloat(0.04, 0.06);
    var containerBall = Entities.addEntity({
        type: "Sphere",
        name: "Arc Ball",
        script: beamVisible ? scriptURL : "",
        position: Vec3.sum(spawnPosition, {
            x: 0,
            y: .1,
            z: 0
        }),
        dimensions: {
            x: radius,
            y: radius,
            z: radius
        },
        color: beamVisible ? randomColor(0, 50, 100, 250, 0, 50) : {
            red: 250,
            green: 10,
            blue: 10
        },
        visible: true,
        ignoreForCollisions: true,
        collisionsWillMove: true,
        damping: 0.7,
        gravity: {
            x: 0,
            y: 0,
            z: 0
        },
        userData: JSON.stringify({
            handControllerKey: {
                disableReleaseVelocity: true,
                disableMoveWithHead: true
            }
        })
    });


    var arcBall = Entities.addEntity({
        type: "ParticleEffect",
        parentID: containerBall,
        isEmitting: true,
        name: "Arc Ball Particle Effect",
        colorStart: {
            red: 200,
            green: 20,
            blue: 40
        },
        color: {
            red: 200,
            green: 200,
            blue: 255
        },
        colorFinish: {
            red: 250,
            green: 20,
            blue: 10
        },
        maxParticles: 100000,
        lifespan: 2,
        emitRate: 40,
        emitSpeed: .01,
        lifetime: -1,
        speedSpread: 0.0,
        emitDimensions: {
            x: 0,
            y: 0,
            z: 0
        },
        polarStart: 0,
        polarFinish: Math.PI,
        azimuthStart: -Math.PI,
        azimuthFinish: Math.PI,
        emitAcceleration: {
            x: 0,
            y: 0,
            z: 0
        },
        accelerationSpread: {
            x: .00,
            y: .00,
            z: .00
        },
        particleRadius: 0.02,
        radiusSpread: 0,
        radiusStart: 0.03,
        radiusFinish: 0.0003,
        alpha: 0,
        alphaSpread: .5,
        alphaStart: 0,
        alphaFinish: 0.5,
        textures: "https://hifi-public.s3.amazonaws.com/alan/Particles/Particle-Sprite-Smoke-1.png",
        emitterShouldTrail: true
    })

    function toggleVisibility() {
        var visible = Entities.getEntityProperties(containerBall, "visible").visible;
        Entities.editEntity(containerBall, {visible: !visible});
    }



    function cleanup() {
        Entities.deleteEntity(arcBall);
        Entities.deleteEntity(containerBall);
    }

    this.cleanup = cleanup;
    this.toggleVisibility = toggleVisibility;
}
