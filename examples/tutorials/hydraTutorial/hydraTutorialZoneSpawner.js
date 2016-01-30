//  hydraTutorialZoneSpawner.js
//  examples/tutorials/hydraTutorial/hydraTutorialZoneSpawner.js
//
//  Created by Eric Levin on 1/29/16.
//  Copyright 2016 High Fidelity, Inc.
//

//  Distributed under the Apache License, Version 2.0.
//  See the accompanying file LICENSE or http://www.apache.org/licenses/LICENSE-2.0.html


var orientation = Camera.getOrientation();
orientation = Quat.safeEulerAngles(orientation);
orientation.x = 0;
orientation = Quat.fromVec3Degrees(orientation);
var center = Vec3.sum(MyAvatar.position, Vec3.multiply(3, Quat.getFront(orientation)));
var lights = [];

var SCRIPT_URL = Script.resolvePath("hydraTutorialZoneEntityScript.js?v1" + Math.random());

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
     locked: true
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
    x: 4.5,
    y: 0.8,
    z: 3.8
  },
  rotation: Quat.fromPitchYawRollDegrees(0, 180, 0),
  collisionless: true,
  script: SCRIPT_URL,
  visible: false,
  locked: true
});


var createLights = function() {
  var lightProps = {
    type: "Light",
    name: "Tutorial Platform Light",
    color: {
      red: 100,
      green: 232,
      blue: 255
    },
    dimensions: {
      x: 3,
      y: 3,
      z: 3
    },
    intensity: 3,
    locked: true
  };
  var positions = [{
    x: 553.91,
    y: 494.5,
    z: 472.1
  }, {
    x: 554.5,
    y: 494.5,
    z: 472.75
  }, {
    x: 555.37,
    y: 494.5,
    z: 472.8
  }, {
    x: 556.02,
    y: 494.5,
    z: 472.17
  }, {
    x: 556.0,
    y: 494.5,
    z: 471.29
  }, {
    x: 555.35,
    y: 494.5,
    z: 470.61
  }, {
    x: 553.9,
    y: 494.5,
    z: 471.2
  }, {
    x: 553.86,
    y: 495.5,
    z: 472.17
  }, {
    x: 554.9,
    y: 494.5,
    z: 470.58
  }, {
    x: 554.52,
    y: 494.5,
    z: 470.54
  }];
  for (var i = 0; i < positions.length; i++) {
    lightProps.position = positions[i];
    lights.push(Entities.addEntity(lightProps));
  }
}

createLights();

function cleanup() {
  Entities.deleteEntity(triggerBox);
  Entities.deleteEntity(tutorialZone);
  lights.forEach(function(light) {
    Entities.deleteEntity(light);
  });
}


// Script.scriptEnding.connect(cleanup);