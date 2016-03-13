(function() {
    var _this;
    Script.include("../libraries/utils.js");
    var SKYBOX_SHADER_URL = Script.resolvePath("rainyDayNightSkybox.fs");
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


        getPositionInFrontOfAvatar: function() {
            var orientation = MyAvatar.orientation;
            orientation = Quat.safeEulerAngles(orientation);
            orientation.x = 0;
            orientation = Quat.fromVec3Degrees(orientation);
            return Vec3.sum(MyAvatar.getHeadPosition(), Vec3.multiply(2, Quat.getFront(orientation)));
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
        },


        initializeVisualEffect: function() {

            var position = MyAvatar.position;
       
            _this.VRVJSkybox = getEntityUserData(_this.entityID).reactiveSkybox;
            _this.skyboxUserData = getEntityUserData(_this.VRVJSkybox);
            if(_this.VRVJSkybox) {
              _this.visualEffectEntities.push(_this.VRVJSkybox);  
            }

        },


        updateVisualEffect: function(volume, loudness) {
            var sunDirY = 2 * Math.pow(volume, 0.5) - 1;
            // print("SUNDIR " + sunDirY)
            _this.skyboxUserData = getEntityUserData(_this.VRVJSkybox);
            _this.skyboxUserData.ProceduralEntity.uniforms.uSunDirY = sunDirY;
            setEntityUserData(_this.VRVJSkybox, _this.skyboxUserData);
        },

        destroy: function() {
            _this.visualEffectEntities.forEach(function(visualEffectEntity) {
                Entities.deleteEntity(visualEffectEntity);
            });
        },

    };

    // entity scripts always need to return a newly constructed object of our type
    return new VRVJVisualEntity();
});