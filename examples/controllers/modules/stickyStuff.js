function StickyStuffManager() {

    var _this = this;
    this.maxDimensionLength = 5;
    this.subscribeToMessages = function() {
        Messages.subscribe('Hifi-StickyStuff-Manager');
        Messages.messageReceived.connect(this.handleMessages);
    }

    this.handleMessages = function(channel, message, sender) {
        print('stickyStuffManager messageReceived ::: ' + channel + " ::: " + message)
        if (channel !== 'Hifi-StickyStuff-Manager') {
            return;
        }
        if (sender !== MyAvatar.sessionUUID) {
            return;
        }
        var entityID = JSON.parse(message);
        _this.handleReleaseMessage(entityID);
    }

    this.handleReleaseMessage = function(entityID) {
        var props = Entities.getEntityProperties(entityID, ["dimensions", "position"]);
        var searchBox = Vec3.multiply(props.dimensions, 2);
        var intersectedEntities = Entities.findEntitiesInBox(props.position, searchBox);

        for (var i = 0; i < intersectedEntities.length; i++) {
            var entity = intersectedEntities[i];
            if (this.entityIsSticky(entity, entityID) && JSON.stringify(entity) !== JSON.stringify(entityID)) {
                var name = Entities.getEntityProperties(entity, "name").name;
                print("Found a sticky Entity! " + name);
                Entities.editEntity(entity, {
                    parentID: entityID,
                    collisionsWillMove: false,
                    ignoreForCollisions: true,
                    velocity: {
                        x: 0,
                        y: 0,
                        z: 0
                    },
                    gravity: {
                        x: 0,
                        y: 0,
                        z: 0
                    },
                    angularVelocity: {x: 0, y: 0, z: 0}
                });
                Entities.editEntity(entityID, {
                    velocity: {
                        x: 0,
                        y: 0,
                        z: 0
                    },
                    gravity: {
                        x: 0,
                        y: 0,
                        z: 0
                    },
                    angularVelocity: {x: 0, y: 0, z:0},
                    ignoreForCollisions: true
                });
                return;
            }
        }
        print("NO VALID INTERSECTED ENTITIES");
    }
    this.entityIsSticky = function(entityID, possibleParent) {
        var props = Entities.getEntityProperties(entityID, ["type", "dimensions", "locked", "parentID"]);
        if (props.type === "Model" || props.type === "Box" || props.type === "Sphere") {
            if (props.locked) {
                return false;
            }
            if (props.type === "Model" && Vec3.length(props.dimensions) > this.maxDimensionLength) {
                // If dimensions are huge, this is probably not an entity we want to make sticky
                return false;

            }

            if (JSON.stringify(props.parentID) === JSON.stringify(possibleParent)) {
                // We want to ignore entities that are already parented to us
                return false;
            }
            return true;
        }

        return false;

    }
}


var manager = new StickyStuffManager();
manager.subscribeToMessages();