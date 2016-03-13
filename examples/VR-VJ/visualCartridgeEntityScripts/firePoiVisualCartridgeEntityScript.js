(function() {
    var _this;
    Script.include("../libraries/utils.js");
    var NULL_UUID = "{00000000-0000-0000-0000-000000000000}";
    var ZERO_VEC = {
        x: 0,
        y: 0,
        z: 0
    };
    VRVJVisualEntity = function() {
        _this = this;
        _this.SOUND_CARTRIDGE_NAME = "VRVJ-Sound-Cartridge";
        _this.SOUND_CARTRIDGE_SEARCH_RANGE = 0.1;
        _this.UPDATE_VISUAL_EFFECT_TIME = 16;
        _this.CARTRIDGE_VOLUME_KEY = "VRVJ-Cartridge-Volume";
        _this.visualEffectEntities = [];
        _this.pillarFlames = [];

    };

    VRVJVisualEntity.prototype = {

        releaseGrab: function() {
                // search for nearby sound loop entities and if found, add it as a parent.
            Script.setTimeout(function() {
                _this.searchForNearbySoundLoops();
            }, 100);
        },

        searchForNearbySoundLoops: function() {
            _this.position = Entities.getEntityProperties(_this.entityID, "position").position;
            var entities = Entities.findEntities(_this.position, _this.SOUND_CARTRIDGE_SEARCH_RANGE);
            for (var i = 0; i < entities.length; i++) {
                var entity = entities[i];
                var name = Entities.getEntityProperties(entity, "name").name;
                if (name.indexOf(_this.SOUND_CARTRIDGE_NAME) !== -1) {
                    _this.parentToSoundCartridge(entity);
                    return;
                }
            }

            // We didn't find a close by cartridge- so remove parent if it already had one, and send message to the former parent
            var parentID = Entities.getEntityProperties(_this.entityID, "parentID").parentID;
            if (parentID !== NULL_UUID) {
                _this.unParentFromSoundCartridge();
            }

        },

        unParentFromSoundCartridge: function() {
            Entities.editEntity(_this.entityID, {
                parentID: NULL_UUID,
                color: _this.originalColor
            });

            Script.clearInterval(_this.visualEffectUpdateInterval);
            _this.visualEffectUpdateInterval = null;
        },

        parentToSoundCartridge: function(parent) {
            // Need to set a timeout to wait for grab script to stop messing with entity
            var parentColor = Entities.getEntityProperties(parent, "color").color;
            _this.currentParent = parent;
            Entities.editEntity(_this.entityID, {
                parentID: parent,
                dynamic: false,
                color: parentColor
            });
            Script.setTimeout(function() {
                Entities.editEntity(_this.entityID, {
                    dynamic: true,
                    velocity: ZERO_VEC,
                });
            }, 100);
            _this.visualEffectUpdateInterval = Script.setInterval(_this.update, _this.UPDATE_VISUAL_EFFECT_TIME);
        },

        update: function() {
            var volumeData = getEntityCustomData(_this.CARTRIDGE_VOLUME_KEY, _this.currentParent);
            if (volumeData) {
                _this.updateVisualEffect(volumeData.volume, volumeData.loudness);
            }
        },

        updateVisualEffect: function(volume, loudness) {
            var newParticleRadius = map(loudness, 0, 1, _this.particleRadiusRange.min, _this.particleRadiusRange.max);
            newParticleRadius *= volume;

            Entities.editEntity(_this.poiFlame, {
                particleRadius: newParticleRadius
            });

            _this.pillarFlames.forEach(function(pillarFlame) {
                newParticleRadius = map(loudness, 0, 1, 0.1, 1);
                Entities.editEntity(pillarFlame, {particleRadius: newParticleRadius})
            })

        },

        destroy: function() {
            _this.visualEffectEntities.forEach(function(visualEffectEntity) {
                Entities.deleteEntity(visualEffectEntity);
            });
        },

        getPositionInFrontOfAvatar: function() {
            var orientation = MyAvatar.orientation;
            orientation = Quat.safeEulerAngles(orientation);
            orientation.x = 0;
            orientation = Quat.fromVec3Degrees(orientation);
            return Vec3.sum(MyAvatar.getHeadPosition(), Vec3.multiply(2, Quat.getFront(orientation)));
        },

        initializeVisualEffect: function() {
            var position = Vec3.sum(_this.getPositionInFrontOfAvatar(), {
                x: 0,
                y: 0.2,
                z: 0
            });

            _this.poiStick = Entities.addEntity({
                type: "Box",
                name: "Poi Stick",
                dimensions: {
                    x: 0.02,
                    y: 0.3,
                    z: 0.02
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

            var color = {
                red: 150,
                green: 50,
                blue: 10
            };
            var poiParticleRadius = 0.01;
            _this.particleRadiusRange = {
                min: 0.01,
                max: 0.1
            };

            var flameProps = {
                type: "ParticleEffect",
                name: "Flame Emitter",
                parentID: _this.poiStick,
                parentJointIndex: -1,
                position: position,
                isEmitting: true,
                colorStart: color,
                color: color,
                colorFinish: color,
                maxParticles: 100000,
                lifespan: 1.0,
                emitRate: 1000,
                emitSpeed: 0.1,
                speedSpread: 0.02,
                emitDimensions: {
                    x: .1,
                    y: 1,
                    z: .1
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
                radiusStart: 0.0001,
                radiusFinish: 0.0001,
                radiusSpread: 0,
                alpha: 1,
                alphaSpread: 0.1,
                alphaStart: 0.5,
                alphaFinish: 0.0,
                textures: "https://hifi-public.s3.amazonaws.com/alan/Particles/Particle-Sprite-Smoke-1.png",
                emitterShouldTrail: true
            }
            _this.poiFlame = Entities.addEntity(flameProps);

            _this.visualEffectEntities.push(_this.poiFlame);
            _this.visualEffectEntities.push(_this.poiStick);

            flameProps.particleRadius = 0.1;
            flameProps.position = {x: 249.9, y: -4.3, z: 363.6};
            _this.pillarFlames.push(Entities.addEntity(flameProps));

            flameProps.position = {x: 232.7, y: -4.3, z: 363.9};
            _this.pillarFlames.push(Entities.addEntity(flameProps));

            flameProps.position = {x: 232.7, y: -4.3, z: 380.1};
            _this.pillarFlames.push(Entities.addEntity(flameProps));

            flameProps.position = {x: 249.9, y: -4.3, z: 380.1};
            _this.pillarFlames.push(Entities.addEntity(flameProps));
        },

        preload: function(entityID) {
            _this.entityID = entityID;
            _this.originalColor = Entities.getEntityProperties(_this.entityID, "color").color;

            // Wait for userData to be loaded
        },

        unload: function() {
            _this.destroy();
            if (_this.visualEffectUpdateInterval) {
                Script.clearInterval(_this.visualEffectUpdateInterval);
            }
            _this.pillarFlames.forEach(function(flame) {
                Entities.deleteEntity(flame);
            })
        }
    };

    // entity scripts always need to return a newly constructed object of our type
    return new VRVJVisualEntity();
});