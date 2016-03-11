  var orientation = MyAvatar.orientation;
  orientation = Quat.safeEulerAngles(orientation);
  orientation.x = 0;
  orientation = Quat.fromVec3Degrees(orientation);
  var center = Vec3.sum(MyAvatar.getHeadPosition(), Vec3.multiply(2, Quat.getFront(orientation)));


  Script.include("../libraries/utils.js");

print("ADD ZONE")
  var SKYBOX_SHADER_URL = Script.resolvePath("rainyDayNightSkybox.fs");
  var VRVJSkyBox = Entities.addEntity({
    type: "Zone",
    backgroundMode: "skybox",
    name: "VRVJ Skybox",
    skybox: {
      url: "https://hifi-public.s3.amazonaws.com/images/SkyboxTextures/CloudyDay1.jpg"
    },
    position: center,
    dimensions: {x: 100, y: 100, z: 100},
    userData: JSON.stringify({
      ProceduralEntity: {
        version: 2,
        shaderUrl: SKYBOX_SHADER_URL,
        channels: ["https://hifi-public.s3.amazonaws.com/austin/assets/images/skybox/starmap_8k.jpg", "https://hifi-public.s3.amazonaws.com/austin/assets/images/skybox/celestial_grid.jpg", "https://s3.amazonaws.com/hifi-public/brad/rainstorm/noise.jpg", "https://s3.amazonaws.com/hifi-public/brad/noise.jpg"],
        uniforms: {
          rotationSpeed: 0.0001,
          uDayColor: [0.4, 0.3, 0.3],
          constellationLevel: 0.0,
          constellationBoundaryLevel: 0.0,
          gridLevel: 0
        }
      }
    })
  });

  var SOUND_SCRIPT_URL = Script.resolvePath("VRVJSoundCartridgeEntityScript.js");
  var SOUND_CARTRIDGE_NAME = "VRVJ-Sound-Cartridge";
  var soundEntity = Entities.addEntity({
    type: "Box",
    name: SOUND_CARTRIDGE_NAME,
    dimensions: {
      x: 0.1,
      y: 0.1,
      z: 0.1
    },
    color: {
      red: 200,
      green: 10,
      blue: 200
    },
    position: center,
    damping: 1,
    angularDamping: 1,
    collidesWith: "",
    dynamic: true,
    script: SOUND_SCRIPT_URL,
    userData: JSON.stringify({
      soundURL: "https://s3-us-west-1.amazonaws.com/hifi-content/eric/Sounds/VRVJ/ambient_dream.wav",
    })
  });

  var VISUAL_CARTRIDGE_SCRIPT_URL = Script.resolvePath("VRVJVisualCartridgeEntityScript.js?v1" + Math.random());
  var VISUAL_EFFECT_SCRIPT_URL = Script.resolvePath("visualEffectBoilerplate.js?v1" + Math.random());
  var visualEntity = Entities.addEntity({
    type: "Sphere",
    name: "VRVJ-Visual-Cartridge",
    dimensions: {
      x: 0.1,
      y: 0.1,
      z: 0.1
    },
    damping: 1,
    collidesWith: "",
    angularDamping: 1,
    color: {
      red: 0,
      green: 200,
      blue: 10
    },
    dynamic: true,
    position: Vec3.subtract(center, {
      x: 0,
      y: 0.2,
      z: 0
    }),
    script: VISUAL_CARTRIDGE_SCRIPT_URL,
    userData: JSON.stringify({
      visualEffectScriptURL: VISUAL_EFFECT_SCRIPT_URL
    })
  });

  Script.setTimeout(function() {
    // Wait for sounds and userdata to load
    Entities.callEntityMethod(soundEntity, "playSound");
    Entities.callEntityMethod(visualEntity, "initializeVisualEffect");
  }, 1000)

  function cleanup() {
    Entities.deleteEntity(soundEntity);
    Entities.deleteEntity(visualEntity);
    Entities.deleteEntity(VRVJSkyBox)
  }

  Script.scriptEnding.connect(cleanup);