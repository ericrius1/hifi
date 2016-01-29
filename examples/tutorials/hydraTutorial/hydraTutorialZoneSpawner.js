  var orientation = Camera.getOrientation();
  orientation = Quat.safeEulerAngles(orientation);
  orientation.x = 0;
  orientation = Quat.fromVec3Degrees(orientation);
  var center = Vec3.sum(MyAvatar.position, Vec3.multiply(3, Quat.getFront(orientation)));

  var SCRIPT_URL = Script.resolvePath("hydraTutorialZoneEntityScript.js");

  var MODEL_URL = "https://hifi-content.s3.amazonaws.com/alan/dev/Holographic-Stage-no-roof.fbx"
  var PLATFORM_POSITION = {
    x: 554.59,
    y: 495.41,
    z: 472.41
  };
  var PLATFORM_ROTATION = Quat.fromPitchYawRollDegrees(0, 200, 0);
  var tutorialZone = Entities.addEntity({
    type: "Model",
    name: "Tutorial Platform",
    modelURL: MODEL_URL,
    compoundShapeURL: "https://hifi-content.s3.amazonaws.com/alan/dev/Holographic-Stage-no-roof.obj",
    position: PLATFORM_POSITION,
    dimensions: {
      x: 5.1,
      y: 2.58,
      z: 5.1
    },
    rotation: PLATFORM_ROTATION,
    locked: false
  });


  var triggerBox = Entities.addEntity({
    type: "Box",
    name: "Tutorial Trigger Box",
    color: {
      red: 200,
      green: 10,
      blue: 200
    },
    parentID: tutorialZone,
    position: Vec3.sum(PLATFORM_POSITION, {
      x: 0,
      y: 0,
      z: 1
    }),
    dimensions: {
      x: 3.5,
      y: 0.8,
      z: 1.8
    },
    rotation: Quat.fromPitchYawRollDegrees(0, 180, 0),
    collisionless: true,
    script: SCRIPT_URL,
    visible: false,
    locked: true
  });


  function cleanup() {
    Entities.deleteEntity(triggerBox);
    Entities.deleteEntity(tutorialZone);
  }


  Script.scriptEnding.connect(cleanup);