//  arcBallEntityScript.js
//  
//  Script Type: Entity
//  Created by Eric Levin on 12/17/15.
//  Copyright 2015 High Fidelity, Inc.
//
//  This entity script handles the logic for the arcBall rave toy
//  Distributed under the Apache License, Version 2.0.
//  See the accompanying file LICENSE or http://www.apache.org/licenses/LICENSE-2.0.html
//

(function() {
    Script.include("../../libraries/utils.js");
    var _this;
    var ArcBall = function() {
        _this = this;
        this.colorPalette = [{
            red: 25,
            green: 20,
            blue: 162
        }, {
            red: 200,
            green: 10,
            blue: 10
        }];

        this.searchRadius = 5;

        // Each edge represents a connection between this ball and another
        // {beam, target}
        this.edges = [];
    };

    ArcBall.prototype = {
        isGrabbed: false,
        startDistantGrab: function() {
            this.createGraph();
        },

        startNearGrab: function() {
            this.createGraph();
        },

        destroyGraph: function() {
            this.edges = [];
        },

        createGraph: function() {
            //Search for nearby balls and create an arc to it if one is found
            var position = Entities.getEntityProperties(this.entityID, "position").position
            var entities = Entities.findEntities(position, this.searchRadius);
            entities.forEach(function(entity) {
                var props = Entities.getEntityProperties(entity, ["position", "name"]);
                if (props.name === "Arc Ball" && JSON.stringify(_this.entityID) !== JSON.stringify(entity)) {
                    _this.createEdge(entity);
                }
            });
        },

        createEdge: function(entity) {
            var edge = {node: entity, beam: this.createBeam()}
            this.edges.push(edge);
        },

        createBeam: function() {
            return Entities.addEntity(this.beamProps);
        },

        updateBeam: function(edge) {
            var startPosition = Entities.getEntityProperties(this.entityID, "position").position;
            var targetPosition = Entities.getEntityProperties(edge.node, "position").position;
            print("TARGET POSITION " + JSON.stringify(targetPosition));
            var sourceToTargetVec = Vec3.subtract(targetPosition, startPosition);
            var emitOrientation = Quat.rotationBetween(Vec3.UNIT_Z, sourceToTargetVec);
            print("EMIT ORIE " + JSON.stringify(emitOrientation))
            Entities.editEntity(edge.beam, {
                emitOrientation: emitOrientation
            });
        },

        updateGraph: function() {
            this.edges.forEach(function(edge) {
                _this.updateBeam(edge);
            });

        },

        continueNearGrab: function() {
            this.updateGraph();
        },

        continueDistantGrab: function() {
            this.updateGraph();
        },

        releaseGrab: function() {
            this.edges.forEach( function(edge) {
                Entities.editEntity(edge.beam, {isEmitting: false});
            })
        
        },

        unload: function() {
             this.edges.forEach(function(edge) {
                Entities.deleteEntity(edge.node);
            });
        },

        preload: function(entityID) {
            this.entityID = entityID;
            var color = this.colorPalette[randInt(0, this.colorPalette.length)];
            this.beamProps = {
                type: "ParticleEffect",
                name: "Particle Arc",
                parentID: this.entityID,
                parentJointIndex: -1,
                isEmitting: true,
                colorStart: color,
                color: {
                    red: 200,
                    green: 200,
                    blue: 255
                },
                colorFinish: color,
                maxParticles: 100000,
                lifespan: 1,
                emitRate: 1000,
                emitSpeed: 1,
                speedSpread: 0.02,
                emitDimensions: {
                    x: .01,
                    y: .01,
                    z: .01
                },
                polarStart: 0,
                polarFinish: 0,
                azimuthStart: 0.02,
                azimuthFinish: .01,
                emitAcceleration: {
                    x: 0,
                    y: 0,
                    z: 0
                },
                accelerationSpread: {
                    x: 0,
                    y: 0,
                    z: 0
                },
                radiusStart: 0.01,
                radiusFinish: 0.005,
                radiusSpread: 0.005,
                alpha: 0.5,
                alphaSpread: 0.1,
                alphaStart: 0.5,
                alphaFinish: 0.5,
                textures: "https://s3.amazonaws.com/hifi-public/eric/textures/particleSprites/beamParticle.png",
                emitterShouldTrail: true
            }
        },
    };
    return new ArcBall();
});