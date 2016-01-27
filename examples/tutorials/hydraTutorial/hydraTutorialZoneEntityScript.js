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
    Script.include("../libraries/utils.js");
    var _this;
   
    var HydraTutorialZone = function() {
        _this = this;
    };

    HydraTutorialZone.prototype = {

        enterEntity: function() {
            print("ENTITY ENTERED");
        },

        leaveEntity: function() {
            print("LEAVE ENTITY");
        },

        preload: function(entityID) {
            this.entityID = entityID;
            print("HEYO");
        },
    };
    return new HydraTutorialZone();
});