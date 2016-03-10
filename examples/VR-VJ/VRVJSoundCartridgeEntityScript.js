(function() {
    var _this;
    Script.include("../libraries/utils.js");
    VRVJSoundEntity = function() {
        _this = this;
    };

    VRVJSoundEntity.prototype = {
        playSound: function() {
            _this.position = Entities.getEntityProperties(_this.entityID, "position").position;
            _this.soundOptions = {
                position: _this.position,
                volume: 0.0,
                loop: true
            };
            _this.soundInjector = Audio.playSound(_this.clip, _this.soundOptions);
        },

        releaseGrab: function() {
            if (!_this.soundInjector) {
                return;
            }
            _this.position = Entities.getEntityProperties(_this.entityID, "position").position;
            _this.soundOptions.position = _this.position;
            _this.soundInjector.setOptions(_this.soundOptions);
        },

        setVolume: function(entityID, data) {
            if (!_this.soundInjector) {
                return;
            }
            _this.soundOptions.volume = JSON.parse(data[0]).volume;
            _this.soundInjector.setOptions(_this.soundOptions);
        },

        preload: function(entityID) {
            _this.entityID = entityID;
            _this.userData = getEntityUserData(_this.entityID);
            _this.clip = SoundCache.getSound(_this.userData.soundURL);
        },

        unload: function() {
            if (_this.soundInjector) {
                _this.soundInjector.stop();
                delete _this.soundInjector;
            }
        }
    };

    // entity scripts always need to return a newly constructed object of our type
    return new VRVJSoundEntity();
});