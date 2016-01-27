//  tutorialZoneEntityScript.js
//  
//  Script Type: Entity
//  Created by Eric Levin on 1/20/16.
//  Copyright 2016 High Fidelity, Inc.
//
//  This entity script creates a tutorial demonstrating the use of the hydras when a user enters the entity
//  Distributed under the Apache License, Version 2.0.
//  See the accompanying file LICENSE or http://www.apache.org/licenses/LICENSE-2.0.html
//

(function() {
    Script.include("..//..libraries/utils.js");
    var _this;

    var HydraTutorialZone = function() {
        _this = this;
        this.RIGHT_HAND = 1;
        this.LEFT_HAND = 0;
        this.RIGHT_HYDRA_MODEL_URL = "https://s3-us-west-1.amazonaws.com/hifi-content/eric/models/Hydra-Tips-RIGHT.fbx";
        this.LEFT_HYDRA_MODEL_URL = "https://s3-us-west-1.amazonaws.com/hifi-content/eric/models/Hydra-Tips-LEFT.fbx";
        this.RIGHT_HAND_JOINT_INDEX = MyAvatar.getJointIndex("RightHand");
        this.LEFT_HAND_JOINT_INDEX = MyAvatar.getJointIndex("LeftHand");
    };

    HydraTutorialZone.prototype = {

        enterEntity: function() {
            print("EBL ENTITY ENTERED");
            this.placeControllersInHand();
        },

        placeControllersInHand: function() {
            this.rightHandHydraModel = Entities.addEntity({
                type: "Model",
                name: "Right Hydra",
                modelURL: this.RIGHT_HYDRA_MODEL_URL,
                parentID: MyAvatar.sessionUUID,
                parentJointIndex: this.RIGHT_HAND_JOINT_INDEX,
                rotation: Quat.fromPitchYawRollDegrees(47, 15, 70),
                position: Vec3.sum(MyAvatar.getRightHandPosition(), {x: -0.05, y: 0.07, z: -0.02})
            });
s
            this.leftHandHydraModel = Entities.addEntity({
                type: "Model",
                name: "Left Hydra",
                modelURL: this.LEFT_HYDRA_MODEL_URL,
                parentID: MyAvatar.sessionUUID,
                parentJointIndex: this.LEFT_HAND_JOINT_INDEX
            });

        },

        leaveEntity: function() {
            print("EBL LEAVE ENTITY");
            this.cleanup();
        },

        preload: function(entityID) {
            this.entityID = entityID;
        },

        cleanup: function() {
            Entities.deleteEntity(this.rightHandHydraModel);
            Entities.deleteEntity(this.leftHandHydraModel);
        },

        unload: function() {
            this.cleanup();
        }
    };
    return new HydraTutorialZone();
});