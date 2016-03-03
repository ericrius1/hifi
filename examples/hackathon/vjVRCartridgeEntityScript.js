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
        _this.SKYBOX_SEARCH_RADIUS = 30;
        _this.VRVJ_SKYBOX_NAME = "VRVJ SkyBox";
        _this.active = false;
        _this.HAND_TO_CARTRIDGE_DISTANCE_THRESHOLD = 0.7;

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

            var distanceToClosestHand = JSON.parse(data[0]).distanceToClosestHand;

            _this.setSoundVolume(distanceToClosestHand)

        },


        setSoundVolume: function(distanceToClosestHand) {
            var newVolume;
            if (distanceToClosestHand > _this.HAND_TO_CARTRIDGE_DISTANCE_THRESHOLD) {
                newVolume = 0;
            } else {
                newVolume = map(distanceToClosestHand, 0, _this.HAND_TO_CARTRIDGE_DISTANCE_THRESHOLD, 1, 0);
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
        getSkybox: function() {
            // Search for the nearest epic skybox and save that
            var entities = Entities.findEntities(_this.position, _this.SKYBOX_SEARCH_RADIUS);
            for (var i = 0; i < entities.length; i++) {
                var entity = entities[i];
                var name = Entities.getEntityProperties(entity, "name").name;
                if (name === _this.VRVJ_SKYBOX_NAME) {
                    _this.skybox = entity;
                }
            }
        },

        getLight: function() {
            // Search for the nearest VRVJ light 
            var entities = Entities.findEntities(_this.position, _this.SKYBOX_SEARCH_RADIUS);
            for (var i = 0; i < entities.length; i++) {
                var entity = entities[i];
                var name = Entities.getEntityProperties(entity, "name").name;
                if (name === _this.VRVJ_LIGHT_NAME) {
                    _this.light = entity;
                }
            }

        },

        release: function() {
            _this.position = Entities.getEntityProperties(_this.entityID, "position").position;
            _this.updateSoundPosition();
            _this.getSkybox();
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