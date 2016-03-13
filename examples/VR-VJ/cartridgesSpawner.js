  var orientation = MyAvatar.orientation;
  orientation = Quat.safeEulerAngles(orientation);
  orientation.x = 0;
  orientation = Quat.fromVec3Degrees(orientation);
  var center = Vec3.sum(MyAvatar.getHeadPosition(), Vec3.multiply(2, Quat.getFront(orientation)));

  var CARTRIDGE_ROTATION = Quat.fromPitchYawRollDegrees(0, 0, 0);

  Script.include("../libraries/utils.js");

  var soundCartridges = [];
  var visualCartridges = [];
  var VRVJSkybox, VRVJPyramid, backgroundPyramid1, backgroundPyramid2, pyramidPlatform;
  spawnSkybox();
  spawnPyramids();
  spawnSoundCartridges();
  spawnVisualCartridges();



  function spawnSoundCartridges() {
    var SOUND_SCRIPT_URL = Script.resolvePath("VRVJSoundCartridgeEntityScript.js");
    var SOUND_CARTRIDGE_NAME = "VRVJ-Sound-Cartridge";
    var soundCartridgeUserData = {
      soundURL: "https://s3-us-west-1.amazonaws.com/hifi-content/eric/Sounds/VRVJ/sunrise_ambient.wav",
    };
    var soundCartridgeProps = {
      type: "Model",
      modelURL: "https://s3-us-west-1.amazonaws.com/hifi-content/jazmin/dev/_vrhackathon/musiccartridge_violet.fbx",
      shapeType: "sphere",
      name: SOUND_CARTRIDGE_NAME,
      dimensions: {
        x: 0.3404,
        y: 0.3404,
        z: 0.0433
      },
      position: {
        x: 207.1613,
        y: 0.057,
        z: 351.3485
      },
      rotation: CARTRIDGE_ROTATION,
      damping: 1,
      angularDamping: 1,
      collidesWith: "",
      dynamic: true,
      script: SOUND_SCRIPT_URL,
      userData: JSON.stringify(soundCartridgeUserData)
    }
    soundCartridges.push(Entities.addEntity(soundCartridgeProps));


    soundCartridgeUserData.soundURL = "https://s3-us-west-1.amazonaws.com/hifi-content/eric/Sounds/VRVJ/tribaldrums.wav";
    soundCartridgeProps.modelURL = "https://s3-us-west-1.amazonaws.com/hifi-content/jazmin/dev/_vrhackathon/music_teal.fbx";
    soundCartridgeProps.position = {
      x: 203.9634,
      y: 0.057,
      z: 351.5041
    };
    soundCartridgeProps.userData = JSON.stringify(soundCartridgeUserData)
    soundCartridges.push(Entities.addEntity(soundCartridgeProps));

    soundCartridgeUserData.soundURL = "https://s3-us-west-1.amazonaws.com/hifi-content/eric/Sounds/VRVJ/rain.wav?v3";
    soundCartridgeProps.modelURL = "https://s3-us-west-1.amazonaws.com/hifi-content/jazmin/dev/_vrhackathon/musiccartridge_pink.fbx";
    soundCartridgeProps.userData = JSON.stringify(soundCartridgeUserData)
    soundCartridgeProps.position = {
      x: 205.4914,
      y: 0.057,
      z: 351.43
    };
    soundCartridges.push(Entities.addEntity(soundCartridgeProps));
  }

  function spawnVisualCartridges() {
    var visualCartridgeScriptURL = Script.resolvePath("visualCartridgeEntityScripts/firePoiVisualCartridgeEntityScript.js?v1" + Math.random());

    var visualCartridgeProps = {
      type: "Model",
      modelURL: "https://s3-us-west-1.amazonaws.com/hifi-content/jazmin/dev/_vrhackathon/cartridge_torch.fbx?v3",
      shapeType: "sphere",
      name: "VRVJ-Visual-Cartridge",
      dimensions: {
        x: 0.2355,
        y: 0.2355,
        z: 0.0187
      },
      rotation: CARTRIDGE_ROTATION,
      damping: 1,
      collidesWith: "",
      angularDamping: 1,
      color: {
        red: 0,
        green: 200,
        blue: 10
      },
      dynamic: true,
      position: {
        x: 203.9634,
        y: 0.67,
        z: 351.5041
      },
      script: visualCartridgeScriptURL,
    }
    var cartridgeUserData = {};
    var startingTextures = 'file1:"",\nfile111:"https://s3-us-west-1.amazonaws.com/hifi-content/jazmin/dev/_vrhackathon/cartridge_torch.fbm/torch_diffuse.png",\nfile3:"https://s3-us-west-1.amazonaws.com/torch_roughness.png",\nfile2:"https://s3-us-west-1.amazonaws.com/torch_metallic.png"'
    visualCartridgeProps.textures = startingTextures;
    cartridgeUserData.startingTextures = startingTextures;
    visualCartridgeProps.userData = JSON.stringify(cartridgeUserData);
    visualCartridges.push(Entities.addEntity(visualCartridgeProps));

    visualCartridgeProps.script = Script.resolvePath("visualCartridgeEntityScripts/reactiveSkybox/reactiveSkyboxSunVisualCartridgeEntityScript.js?v1" + Math.random());
    cartridgeUserData.reactiveSkybox = VRVJSkybox;
    startingTextures = 'file1:"",\nfile113:"https://s3-us-west-1.amazonaws.com/sun_diffuse.png",\nfile3:"https://s3-us-west-1.amazonaws.com/sun_roughness.png",\nfile2:"https://s3-us-west-1.amazonaws.com/sun_metallic.png"';
    visualCartridgeProps.textures = startingTextures;
    cartridgeUserData.startingTextures = startingTextures;
    visualCartridgeProps.userData = JSON.stringify(cartridgeUserData);
    visualCartridgeProps.position = {
      x: 207.1613,
      y: 0.68,
      z: 351.3485
    };
    // https://s3-us-west-1.amazonaws.com/sun_diffuse
    visualCartridgeProps.modelURL = "https://s3-us-west-1.amazonaws.com/hifi-content/jazmin/dev/_vrhackathon/cartridge_sun.fbx";
      visualCartridges.push(Entities.addEntity(visualCartridgeProps));

    //https://s3-us-west-1.amazonaws.com/rain_diffuse.png
    startingTextures = 'file113:"",\nfile112:"https://s3-us-west-1.amazonaws.com/rain_diffuse.png",\nfile115:"https://s3-us-west-1.amazonaws.com/rain_roughness.png",\nfile114:"https://s3-us-west-1.amazonaws.com/rain_metallic.png"';
    visualCartridgeProps.textures = startingTextures;
    cartridgeUserData.startingTextures = startingTextures;
    visualCartridgeProps.userData = JSON.stringify(cartridgeUserData);
    visualCartridgeProps.script = Script.resolvePath("visualCartridgeEntityScripts/reactiveSkybox/reactiveSkyboxRainVisualCartridgeEntityScript.js?v1" + Math.random());
    visualCartridgeProps.modelURL = "https://s3-us-west-1.amazonaws.com/hifi-content/jazmin/dev/_vrhackathon/cartridge_rain.fbx";
    visualCartridgeProps.position = {
      x: 205.4914,
      y: 0.67,
      z: 351.43
    };
    visualCartridges.push(Entities.addEntity(visualCartridgeProps));


  }

  function spawnSkybox() {
    var SKYBOX_SHADER_URL = Script.resolvePath("visualCartridgeEntityScripts/reactiveSkybox/rainyDayNightSkybox.fs");
    var position = {
      x: 207.1613,
      y: 0.057,
      z: 351.3485
    };
    var skyboxUserData = {
      ProceduralEntity: {
        version: 2,
        shaderUrl: SKYBOX_SHADER_URL,
        channels: ["https://hifi-public.s3.amazonaws.com/austin/assets/images/skybox/starmap_8k.jpg", "https://hifi-public.s3.amazonaws.com/austin/assets/images/skybox/celestial_grid.jpg", "https://s3.amazonaws.com/hifi-public/brad/rainstorm/noise.jpg", "https://s3.amazonaws.com/hifi-public/brad/noise.jpg"],
        uniforms: {
          uDayColor: [0.5, 0.1, 0.6],
          uSunDirY: -1.0,
          uRainBrightness: 0,
          constellationLevel: 0.0,
          constellationBoundaryLevel: 0.0,
          gridLevel: 0
        }
      }
    };
    VRVJSkybox = Entities.addEntity({
      type: "Zone",
      backgroundMode: "skybox",
      keyLightIntensity: 0.01,
      keyLightColor: {
        red: 20,
        green: 0,
        blue: 20
      },
      keyLightAmbientIntensity: .03,
      name: "VRVJ Skybox",
      position: position,
      dimensions: {
        x: 1000,
        y: 1000,
        z: 1000
      },
      userData: JSON.stringify(skyboxUserData)
    });

  }

  function spawnPyramids() {
    var MODEL_URL = "https://s3-us-west-1.amazonaws.com/hifi-content/jazmin/dev/_vrhackathon/pyramid1.fbx"
    VRVJPyramid = Entities.addEntity({
      type: "Model",
      name: "VRVJ-Pyramid",
      dimensions: {
        x: 34.49,
        y: 9.1,
        z: 34.49
      },
      position: {
        x: 206.17,
        y: -4.6,
        z: 349.7
      },
      modelURL: MODEL_URL,
      // shapeType: "compound",
      // compoundShapeURL: " https://s3-us-west-1.amazonaws.com/hifi-content/jazmin/dev/_vrhackathon/platform_colhull.obj?v1"
    });

    pyramidPlatform = Entities.addEntity({
      type: "Box",
      dimensions: {
        x: 8.476,
        y: 0.01,
        z: 8.497
      },
      position: {
        x: 206.1541,
        y: -1.0513,
        z: 349.7083
      },
      visible: false
    });

    backgroundPyramid1 = Entities.addEntity({
      type: "Model",
      modelURL: "https://s3-us-west-1.amazonaws.com/hifi-content/jazmin/dev/_vrhackathon/pyramid3.fbx",
      name: "background pyramid",
      dimensions: {
        x: 34.49,
        y: 9.1,
        z: 34.49
      },
      position: {
        x: 110,
        y: -4.5,
        z: 339
      },
      rotation: Quat.fromPitchYawRollDegrees(0, 16, 0)
    });

    backgroundPyramid2 = Entities.addEntity({
      type: "Model",
      modelURL: "https://s3-us-west-1.amazonaws.com/hifi-content/jazmin/dev/_vrhackathon/pyramid2.fbx",
      name: "background pyramid",
      dimensions: {
        x: 34.49,
        y: 9.1,
        z: 34.49
      },
      position: {
        x: 253,
        y: -4.7,
        z: 443.4
      },
      rotation: Quat.fromPitchYawRollDegrees(0, -22.5, 0)
    });


  }


  Script.setTimeout(function() {
    // Wait for sounds and userData to load
    soundCartridges.forEach(function(cartridge) {
      Entities.callEntityMethod(cartridge, "playSound");
    });
    visualCartridges.forEach(function(cartridge) {
      Entities.callEntityMethod(cartridge, "initializeVisualEffect");
    });
  }, 1000);

  function cleanup() {
    Entities.deleteEntity(VRVJSkybox);
    Entities.deleteEntity(VRVJPyramid);
    Entities.deleteEntity(pyramidPlatform);
    Entities.deleteEntity(backgroundPyramid1);
    Entities.deleteEntity(backgroundPyramid2);
    visualCartridges.forEach(function(cartridge) {
      Entities.deleteEntity(cartridge);
    });
    soundCartridges.forEach(function(cartridge) {
      Entities.deleteEntity(cartridge);
    });
  }

  Script.scriptEnding.connect(cleanup);