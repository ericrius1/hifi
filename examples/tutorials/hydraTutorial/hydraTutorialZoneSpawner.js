  var orientation = Camera.getOrientation();
  orientation = Quat.safeEulerAngles(orientation);
  orientation.x = 0;
  orientation = Quat.fromVec3Degrees(orientation);
  var center = Vec3.sum(MyAvatar.position, Vec3.multiply(3, Quat.getFront(orientation)));

  var SCRIPT_URL = Script.resolvePath("hydraTutorialZoneEntityScript.js?v1" + Math.random());

  var MODEL_URL = "https://hifi-content.s3.amazonaws.com/alan/dev/Holographic-Stage-no-roof.fbx"
  var tutorialZone = Entities.addEntity({
      type: "Model",
      name: "Tutorial Zone",
      modelURL: MODEL_URL,
      position: {
          x: 532.03,
          y: 495.58,
          z: 518.95
      },
      dimensions: {
          x: 5.1,
          y: 2.58,
          z: 5.1
      },
      rotation: Quat.fromPitchYawRollDegrees(0, 200, 0)
  });



  var triggerBox = Entities.addEntity({
      type: "Box",
      color: {
          red: 200,
          green: 10,
          blue: 200
      },
      parentID: tutorialZone,
      dimensions: {
          x: 0.8,
          y: 0.8,
          z: 0.8
      },
      collisionless: true,
      script: SCRIPT_URL
  });


  function cleanup() {
      Entities.deleteEntity(triggerBox);
      Entities.deleteEntity(tutorialZone);
  }


  Script.scriptEnding.connect(cleanup);