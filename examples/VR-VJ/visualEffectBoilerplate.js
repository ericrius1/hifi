print("YAHAHAHAHAH")
VisualEffect = function() {
    var poiStick, flame;
    this.initialize = function(position) {

        poiStick = Entities.addEntity({
            type: "Box",
            name: "Poi Stick",
            dimensions: {
                x: 0.1,
                y: 0.3,
                z: 0.1
            },
            position: position,
            dynamic: true,
            collidesWith: "",
            color: {
                red: 80,
                green: 120,
                blue: 170
            }
        });

        var color = {red: 150, green: 50, blue: 10};
        flame = Entities.addEntity({
            type: "ParticleEffect",
            name: "Poi Flame",
            parentID: poiStick,
            parentJointIndex: -1,
            position: position,
            isEmitting: true,
            colorStart: color,
            color: color,
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
        })


    }

    this.update = function() {

    }

    this.destroy = function() {
        Entities.deleteEntity(poiStick);
    }

}