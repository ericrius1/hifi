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
        _this.SOUND_CARTRIDGE_SEARCH_RANGE = 0.15;
        _this.UPDATE_VISUAL_EFFECT_TIME = 16;
        _this.CARTRIDGE_VOLUME_KEY = "VRVJ-Cartridge-Volume";
        _this.visualEffectEntities = [];
        _this.torchFlames = [];
        _this.staffFlames = [];


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
            var startingTextures = getEntityUserData(_this.entityID).startingTextures;
            Entities.editEntity(_this.entityID, {
                parentID: NULL_UUID,
                textures: startingTextures
            });
            Script.clearInterval(_this.visualEffectUpdateInterval);
            _this.visualEffectUpdateInterval = null;
        },

        parentToSoundCartridge: function(parent) {
            // Need to set a timeout to wait for grab script to stop messing with entity
            var parentColor = Entities.getEntityProperties(parent, "color").color;
            _this.currentParent = parent;
            var originalTextures = Entities.getEntityProperties(_this.entityID, "originalTextures").originalTextures;
            print("EBL ORIGINAL TETXURES " + JSON.stringify(originalTextures))
            Entities.editEntity(_this.entityID, {
                parentID: parent,
                dynamic: false,
                textures: originalTextures
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
            var particleRadius = map(loudness, 0, 1, 0.05, 0.2);
            var green = map(loudness, 0, 1, 40, 200);
            var red = map(volume, 0, 1, 40, 200);
            _this.torchFlames.forEach(function(flame) {
                print("UPDATE FLAME " + particleRadius)
                Entities.editEntity(flame, {
                    particleRadius: particleRadius
                });
            });

             _this.staffFlames.forEach(function(flame) {
                print("UPDATE FLAME " + particleRadius)
                Entities.editEntity(flame, {
                    particleRadius: particleRadius,
                    color: {red: red, green: green, blue: 100}
                });
            });

             var templeLightBrightness = map(loudness * volume, 0, 1, 0.01, 5);
             Entities.editEntity(_this.templeLight, {intensity: templeLightBrightness});


        },

        destroy: function() {
            _this.visualEffectEntities.forEach(function(visualEffectEntity) {
                print("DESTROY ENTITY EBL")
                Entities.deleteEntity(visualEffectEntity);
            });
        },


        initializeVisualEffect: function() {
            _this.initializeStaves();
            _this.initializeTorches();


           _this.templeLight =  Entities.addEntity({
                type: "Light",
                intensity: 0.01,
                color: {
                    red: 219,
                    green: 108,
                    blue: 64
                },
                falloffRadius: 100,
                dimensions: {
                    x: 500,
                    y: 500,
                    z: 500
                },
                position: {x: 136, y: 11.7, z: 548.6},
            });

           _this.visualEffectEntities.push(_this.templeLight);
        },

        initializeStaves: function() {
            var staffDimensions = {
                x: .2383,
                y: 2.0156,
                z: 0.2383
            };

            var staffPosition = {
                x: 209.5,
                y: -0.3052,
                z: 353.0
            };
            var staffProps = {
                type: "Model",
                name: "VRVJ-Staff",
                modelURL: "https://s3-us-west-1.amazonaws.com/hifi-content/jazmin/dev/_vrhackathon/staff.fbx",
                shapeType: "box",
                position: staffPosition,
                dimensions: staffDimensions,
                dynamic: true
            };

            var staff = Entities.addEntity(staffProps);
            _this.visualEffectEntities.push(staff);
            var flamePosition = Vec3.sum(staffPosition, {
                x: 0,
                y: staffDimensions.y / 2 - 0.15,
                z: 0
            });
            var flameProps = {
                type: "ParticleEffect",
                name: "Staff Flame",
                color: {
                    red: 100,
                    green: 10,
                    blue: 60
                },
                colorStart: {
                    red: 57,
                    green: 40,
                    blue: 20
                },
                colorEnd: {
                    red: 70,
                    green: 30,
                    blue: 10
                },
                parentID: staff,
                position: flamePosition,
                maxParticles: 10000,
                emitRate: 100,
                lifespan: 10,
                isEmitting: true,
                emitSpeed: 0.0,
                speedSpread: 0,
                emitAcceleration: {
                    x: 0,
                    y: 0.01,
                    z: 0
                },
                accelerationSpread: {
                    x: 0.0,
                    y: 0.00,
                    z: 0.0
                },
                radiusStart: 0.1,
                particleRadius: 0.1,
                radiusFinish: 0.01,
                radiusSpread: 0,
                alpha: 0.5,
                alphaSpread: 0.1,
                alphaStart: 1.0,
                alphaFinish: 0.0,
                textures: "https://hifi-public.s3.amazonaws.com/alan/Particles/Particle-Sprite-Smoke-1.png",
                emitterShouldTrail: true
            };

            var flame = Entities.addEntity(flameProps);
            _this.staffFlames.push(flame);
            _this.visualEffectEntities.push(flame);

            var flameLightProps = Entities.addEntity({
                type: "Light",
                intensity: 2,
                color: {
                    red: 100,
                    green: 30,
                    blue: 10
                },
                falloffRadius: 1,
                dimensions: {
                    x: 5,
                    y: 5,
                    z: 5
                },
                position: flamePosition,
                parentID: staff
            })

            _this.visualEffectEntities.push(Entities.addEntity(flameLightProps));

        },

        initializeTorches: function() {
            var torchPosition = {
                x: 202.8,
                y: -0.3,
                z: 353.0
            };
            var torchDimensions = {
                x: .1430,
                y: 1.37,
                z: 0.1430
            };
            var torchProps = {
                type: "Model",
                name: "VRVJ-Staff",
                modelURL: "https://s3-us-west-1.amazonaws.com/hifi-content/jazmin/dev/_vrhackathon/torch.fbx",
                shapeType: "box",
                position: torchPosition,
                dimensions: torchDimensions,
                dynamic: true,
                gravity: {
                    x: 0,
                    y: -3,
                    z: 0
                }
            };

            var torch = Entities.addEntity(torchProps);
            _this.visualEffectEntities.push(torch);

            var flamePosition = Vec3.sum(torchPosition, {
                x: 0,
                y: torchDimensions.y / 2,
                z: 0
            });
            var flameProps = {
                type: "ParticleEffect",
                name: "Torch Flame",
                color: {
                    red: 10,
                    green: 10,
                    blue: 200
                },
                colorStart: {
                    red: 57,
                    green: 237,
                    blue: 231
                },
                parentID: torch,
                position: flamePosition,
                maxParticles: 10000,
                emitRate: 100,
                lifespan: 1.5,
                isEmitting: true,
                emitSpeed: 0.01,
                emitAcceleration: {
                    x: 0,
                    y: 0,
                    z: 0
                },
                accelerationSpread: {
                    x: 0.02,
                    y: 0.2,
                    z: 0.02
                },
                radiusStart: 0.01,
                particleRadius: 0.1,
                radiusFinish: 0.01,
                radiusSpread: 0,
                alpha: 0.5,
                alphaSpread: 0.1,
                alphaStart: 1.0,
                alphaFinish: 0.0,
                textures: "https://hifi-public.s3.amazonaws.com/alan/Particles/Particle-Sprite-Smoke-1.png",
                emitterShouldTrail: true
            };
            var flame = Entities.addEntity(flameProps);
            _this.torchFlames.push(flame);
            _this.visualEffectEntities.push(flame);

            var flameLightProps = Entities.addEntity({
                type: "Light",
                intensity: 2,
                color: {
                    red: 10,
                    green: 10,
                    blue: 200
                },
                falloffRadius: 1,
                dimensions: {
                    x: 5,
                    y: 5,
                    z: 5
                },
                position: flamePosition,
                parentID: torch
            })

            _this.visualEffectEntities.push(Entities.addEntity(flameLightProps));


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

        }
    };

    // entity scripts always need to return a newly constructed object of our type
    return new VRVJVisualEntity();
});