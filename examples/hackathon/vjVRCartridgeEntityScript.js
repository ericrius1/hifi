(function() {
    Script.include("../libraries/utils.js");
    var _this;
    SoundCartridge = function() {
        _this = this;
        _this.audioOptions = {
            loop: true,
            volume: 0
        };
        _this.playingColor = {
            red: 0,
            green: 200,
            blue: 10
        };
        _this.notPlayingColor = {
            red: 200,
            green: 0,
            blue: 0
        };
        _this.SEARCH_RADIUS = 5000;


        _this.VRVJ_LIGHT_NAME = "VR_VJ_LIGHT";
        _this.VRVJ_PARTICLE_STORM_NAME = "VR_VJ_PARTICLE_STORM";

        _this.active = false;
        _this.HAND_TO_CARTRIDGE_DISTANCE_THRESHOLD = 0.7;
        _this.LOUDNESS_RANGE = {
            min: 0.05,
            max: 0.3
        };
        _this.INTENSITY_RANGE = {
            min: 50,
            max: 400
        };
        _this.MIN_VOLUME_FOR_VISUAL_TWEAKING = 0.1;

        _this.volumeRange = {
            min: 0,
            max: 0.6
        };

    }

    SoundCartridge.prototype = {

        playSound: function() {
            print("PLAY SOUND")
            var position = Entities.getEntityProperties(_this.entityID, "position").position;
            if (!_this.injector) {
                _this.audioOptions.position = position;
                _this.injector = Audio.playSound(_this.clip, _this.audioOptions);
            }
        },

        // Sound will still be playing, it will just be at 0 volume
        deactivate: function() {
            print("EBL STOP SOUND!!!!!!!!!!!!!!")
            if (_this.injector) {
                Entities.editEntity(_this.entityID, {
                    color: _this.notPlayingColor
                });
                _this.audioOptions.volume = 0;
                _this.injector.setOptions(_this.audioOptions)
            }
        },

        activate: function() {
            print("EBL Activate Sound");
            _this.active = true;
            _this.userData = getEntityUserData(_this.entityID);
            if (_this.userData.maxVolume) {
                _this.volumeRange.max = _this.userData.maxVolume;
            }
            Entities.editEntity(_this.entityID, {
                color: _this.playingColor
                    // type: "Sphere"
            });
        },

        setDistanceToClosestHand: function(entityID, data) {
            if (!_this.active) {}

            if (!_this.injector) {
                return;
            }

            _this.userData = getEntityUserData(_this.entityID);

            var distanceToClosestHand = JSON.parse(data[0]).distanceToClosestHand;

            _this.updateSoundProperties(distanceToClosestHand);
            if (_this.userData.visualComponent === "light_intensity") {
                _this.updateLightIntensity();
            } else if (_this.userData.visualComponent === "particle_storm") {
                _this.updateParticleStorm();
            }

        },


        updateSoundProperties: function(distanceToClosestHand) {
            var newVolume;
            if (distanceToClosestHand > _this.HAND_TO_CARTRIDGE_DISTANCE_THRESHOLD) {
                newVolume = 0;
            } else {
                newVolume = map(distanceToClosestHand, 0, _this.HAND_TO_CARTRIDGE_DISTANCE_THRESHOLD, _this.volumeRange.max, _this.volumeRange.min);
            }

            if (!_this.active) {
                return;
            }
            _this.audioOptions.volume = newVolume;
            _this.injector.setOptions(_this.audioOptions);
            if (_this.audioOptions.volume > _this.MIN_VOLUME_FOR_VISUAL_TWEAKING) {
                _this.loudness = _this.injector.loudness;
            }
        },


        updateSoundPosition: function() {
            if (_this.injector) {
                _this.audioOptions.position = _this.position;
                _this.injector.setOptions(_this.audioOptions);
            }

        },

        updateParticleStorm: function() {
            if (!_this.particleStorm) {
                print("NO PARTICLE STORM FOUND");
                return;
            }

            var newParticleRadius = 0.005;
            if (_this.audioOptions.volume > _this.MIN_VOLUME_FOR_VISUAL_TWEAKING) {
                newParticleRadius = map(_this.loudness, _this.LOUDNESS_RANGE.min, _this.LOUDNESS_RANGE.max, 0.2, 0.4);
                newParticleRadius = clamp(newParticleRadius, 0.02, 0.4);
            }

            Entities.editEntity(_this.particleStorm, {
                particleRadius: newParticleRadius
            });


        },

        updateLightIntensity: function() {
            if (!_this.light) {
                print("NO LIGHT! Returning")
                return;
            }

            var newIntensity = 1;
            if (_this.audioOptions.volume > _this.MIN_VOLUME_FOR_VISUAL_TWEAKING) {
                newIntensity = map(_this.loudness, _this.LOUDNESS_RANGE.min, _this.LOUDNESS_RANGE.max, _this.INTENSITY_RANGE.min, _this.INTENSITY_RANGE.max) * Math.pow(_this.audioOptions.volume, 3);
            }
            Entities.editEntity(_this.light, {
                intensity: newIntensity
            });

        },


        getVisualComponents: function() {
            // Search for the nearest VRVJ light 
            var entities = Entities.findEntities(_this.position, _this.SEARCH_RADIUS);
            for (var i = 0; i < entities.length; i++) {
                var entity = entities[i];
                var name = Entities.getEntityProperties(entity, "name").name;
                if (name === _this.VRVJ_LIGHT_NAME) {
                    _this.light = entity;
                } else if (name === _this.VRVJ_PARTICLE_STORM_NAME) {
                    _this.particleStorm = entity;
                }
            }

        },



        release: function() {
            _this.position = Entities.getEntityProperties(_this.entityID, "position").position;
            _this.updateSoundPosition();
            _this.getVisualComponents();
        },


        releaseGrab: function() {
            _this.release();
        },

        releaseEquip: function() {
            _this.release();
        },

        preload: function(entityID) {
            this.entityID = entityID;
            var userData = getEntityUserData(_this.entityID);
            if (!userData.soundURL) {
                print("WARNING: NO SOUND URL ON USER DATA!!!!!");
            }
            _this.getVisualComponents();
            _this.clip = SoundCache.getSound(userData.soundURL);
        },

        unload: function() {
            if (_this.injector) {
                _this.injector.stop();
                delete _this.injector;
            }
        }
    };

    // entity scripts always need to return a newly constructed object of our type
    return new SoundCartridge();
});