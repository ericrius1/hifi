  var shnur = "bdur"

  var orientation = Camera.getOrientation();
  orientation = Quat.safeEulerAngles(orientation);
  orientation.x = 0;
  orientation = Quat.fromVec3Degrees(orientation);
  var center = Vec3.sum(MyAvatar.position, Vec3.multiply(3, Quat.getFront(orientation)));

  var SCRIPT_URL = Script.resolvePath("hydraTutorialZoneEntityScript.js?v1" + Math.random());

  var box = Entities.addEntity({
      type: "Box",
      color: {
          red: 200,
          green: 10,
          blue: 200
      },
      position: center,
      dimensions: {
          x: 5,
          y: 5,
          z: 5
      },
      collisionless: true,
      script: SCRIPT_URL
  });


  function cleanup() {
    Entities.deleteEntity(box);
  }


  Script.scriptEnding.connect(cleanup);