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

    };

    VRVJVisualEntity.prototype = {

        releaseGrab: function() {
            print("RELEASE GRAB")
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
            _this.visualEffectUpdateInterval = Script.setInterval(_this.updateVisualEffect, _this.UPDATE_VISUAL_EFFECT_TIME);


        },

        updateVisualEffect: function() {
            var volumeData = getEntityCustomData(_this.CARTRIDGE_VOLUME_KEY, _this.currentParent);
            if(volumeData) {
              _this.visualEffect.update(volumeData.volume, volumeData.loudness);  
            }
        },

        getPositionInFrontOfAvatar: function() {
            var orientation = MyAvatar.orientation;
            orientation = Quat.safeEulerAngles(orientation);
            orientation.x = 0;
            orientation = Quat.fromVec3Degrees(orientation);
            return Vec3.sum(MyAvatar.getHeadPosition(), Vec3.multiply(2, Quat.getFront(orientation)));
        },

        initializeVisualEffect: function() {
            var visualEffectScriptURL = getEntityUserData(_this.entityID).visualEffectScriptURL;
            Script.include(visualEffectScriptURL);
            _this.visualEffect = new VisualEffect();
            var position = Vec3.sum(_this.getPositionInFrontOfAvatar(), {
                x: 0,
                y: 0.2,
                z: 0
            });
            _this.visualEffect.initialize(position);
        },

        preload: function(entityID) {
            print("EBL PRELOAD")
            _this.entityID = entityID;
            _this.originalColor = Entities.getEntityProperties(_this.entityID, "color").color;

                // Wait for userData to be loaded
        },

        unload: function() {
            print("EBL DESTROY VISUAL EFFECT");
            if (_this.visualEffect) {
              _this.visualEffect.destroy();  
            }
            if (_this.visualEffectUpdateInterval) {
                Script.clearInterval(_this.visualEffectUpdateInterval);
            }
        }
    };

    // entity scripts always need to return a newly constructed object of our type
    return new VRVJVisualEntity();
});