  var orientation = MyAvatar.orientation;
  orientation = Quat.safeEulerAngles(orientation);
  orientation.x = 0;
  orientation = Quat.fromVec3Degrees(orientation);
  var center = Vec3.sum(MyAvatar.getHeadPosition(), Vec3.multiply(2, Quat.getFront(orientation)));


  Script.include("../libraries/utils.js");

  var soundCartridges = [];
  var visualCartridges = [];
  var VRVJSkybox;
  spawnSkybox();
  spawnSoundCartridges();
  spawnVisualCartridges();

  function spawnSkybox() {
    var SKYBOX_SHADER_URL = Script.resolvePath("visualCartridgeEntityScripts/reactiveSkybox/rainyDayNightSkybox.fs");
    var position = MyAvatar.position;
    var skyboxUserData = {
      ProceduralEntity: {
        version: 2,
        shaderUrl: SKYBOX_SHADER_URL,
        channels: ["https://hifi-public.s3.amazonaws.com/austin/assets/images/skybox/starmap_8k.jpg", "https://hifi-public.s3.amazonaws.com/austin/assets/images/skybox/celestial_grid.jpg", "https://s3.amazonaws.com/hifi-public/brad/rainstorm/noise.jpg", "https://s3.amazonaws.com/hifi-public/brad/noise.jpg"],
        uniforms: {
          uDayColor: [0.5, 0.1, 0.6],
          uSunDirY: -1.0,
          constellationLevel: 0.0,
          constellationBoundaryLevel: 0.0,
          gridLevel: 0
        }
      }
    };
    VRVJSkybox = Entities.addEntity({
      type: "Zone",
      backgroundMode: "skybox",
      name: "VRVJ Skybox",
      position: position,
      dimensions: {
        x: 100,
        y: 100,
        z: 100
      },
      userData: JSON.stringify(skyboxUserData)
    });

  }

  function spawnSoundCartridges() {
    var SOUND_SCRIPT_URL = Script.resolvePath("VRVJSoundCartridgeEntityScript.js");
    var SOUND_CARTRIDGE_NAME = "VRVJ-Sound-Cartridge";
    var soundCartridge = Entities.addEntity({
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

    soundCartridges.push(soundCartridge);
  }

  function spawnVisualCartridges() {
    var visualCartridgeScriptURL = Script.resolvePath("visualCartridgeEntityScripts/firePoiVisualCartridgeEntityScript.js?v1" + Math.random());

    var visualCartridgeProps = {
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
      position: Vec3.sum(center, {
        x: randFloat(-0.2, 0.2),
        y: 0.2,
        z: 0
      }),
      script: visualCartridgeScriptURL,
    }
    visualCartridges.push(Entities.addEntity(visualCartridgeProps));

    visualCartridgeProps.script = Script.resolvePath("visualCartridgeEntityScripts/reactiveSkybox/reactiveSkyboxVisualCartridgeEntityScript.js?v1" + Math.random());
    var cartridgeUserData = {};
    cartridgeUserData.reactiveSkybox = VRVJSkybox;
    visualCartridgeProps.userData = JSON.stringify(cartridgeUserData);
    visualCartridgeProps.position = Vec3.sum(center, {
      x: randFloat(-0.2, 0.2),
      y: 0.0,
      z: 0
    });
    visualCartridges.push(Entities.addEntity(visualCartridgeProps));
  }


  Script.setTimeout(function() {
    // Wait for sounds and userdata to load
    soundCartridges.forEach(function(cartridge) {
      Entities.callEntityMethod(cartridge, "playSound");
    });
    visualCartridges.forEach(function(cartridge) {
      Entities.callEntityMethod(cartridge, "initializeVisualEffect");
    });
  }, 1000);

  function cleanup() {
    visualCartridges.forEach(function(cartridge) {
      Entities.deleteEntity(cartridge);
    });
    soundCartridges.forEach(function(cartridge) {
      Entities.deleteEntity(cartridge);
    });
  }

  Script.scriptEnding.connect(cleanup);