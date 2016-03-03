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
        _this.active = false;
        _this.HAND_TO_CARTRIDGE_DISTANCE_THRESHOLD = 0.7;
        _this.LOUDNESS_RANGE = {min: 0.05, max: 0.3};
        _this.INTENSITY_RANGE = {min: 20, max: 200};
        _this.MIN_VOLUME_FOR_LIGHT_TWEAKING = 0.1;

        _this.volumeRange = {min: 0, max: 0.5};

    }

    SoundCartridge.prototype = {

        playSound: function() {
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
            print("Activate Sound");
            _this.active = true;
            _this.userData = getEntityUserData(_this.entityID);
            if (_this.userData.maxVolume) {
                _this.volumeRange.max = _this.userData.maxVolume;
            }
            Entities.editEntity(_this.entityID, {
                color: _this.playingColor
            });
        },

        setDistanceToClosestHand: function(entityID, data) {
            if (!_this.active) {
                print("CARTRIDGE IS NOT ACTIVE");
            }

            if (!_this.injector) {
                print("NO INJECTOR!");
                return;
            }

            _this.userData = getEntityUserData(_this.entityID);

            var distanceToClosestHand = JSON.parse(data[0]).distanceToClosestHand;

            _this.setSoundVolume(distanceToClosestHand);
            if (_this.userData.visualComponent === "light_intensity") {
              _this.updateLightIntensity();  
            }

        },


        setSoundVolume: function(distanceToClosestHand) {
            var newVolume;
            if (distanceToClosestHand > _this.HAND_TO_CARTRIDGE_DISTANCE_THRESHOLD) {
                newVolume = 0;
            } else {
                newVolume = map(distanceToClosestHand, 0, _this.HAND_TO_CARTRIDGE_DISTANCE_THRESHOLD, _this.volumeRange.max, _this.volumeRange.min);
            }

            if (!_this.active) {
                print(" Not active!!");
                return;
            }
            _this.audioOptions.volume = newVolume;
            _this.injector.setOptions(_this.audioOptions);
        },


        updateSoundPosition: function() {
            if (_this.injector) {
                _this.audioOptions.position = _this.position;
                _this.injector.setOptions(_this.audioOptions);
            }

        },

        updateLightIntensity: function() {
            if (!_this.light) {
                print("NO LIGHT! Returning")
                return;
            }

            var newIntensity = 1;
            if (_this.audioOptions.volume > _this.MIN_VOLUME_FOR_LIGHT_TWEAKING) {
                var loudness = _this.injector.loudness;
                newIntensity = map(loudness, _this.LOUDNESS_RANGE.min, _this.LOUDNESS_RANGE.max, _this.INTENSITY_RANGE.min, _this.INTENSITY_RANGE.max) * Math.pow(_this.audioOptions.volume, 3);
            }
            Entities.editEntity(_this.light, {intensity: newIntensity});

        },


        getLight: function() {
            // Search for the nearest VRVJ light 
            var entities = Entities.findEntities(_this.position, _this.SEARCH_RADIUS);
            for (var i = 0; i < entities.length; i++) {
                var entity = entities[i];
                var name = Entities.getEntityProperties(entity, "name").name;
                print("NAME " + name)
                if (name === _this.VRVJ_LIGHT_NAME) {
                    _this.light = entity;
                }
            }

        },

        release: function() {
            _this.position = Entities.getEntityProperties(_this.entityID, "position").position;
            _this.updateSoundPosition();
            _this.getLight();
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
            _this.getLight();
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