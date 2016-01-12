function StickyStuffManager() {

    var _this = this;
    this.maxDimensionLength = 5;
    this.nullID = "{00000000-0000-0000-0000-000000000000}";
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
        this.releasedEntity = entityID;
        var props = Entities.getEntityProperties(this.releasedEntity, ["dimensions", "position", "parentID"]);
        this.releasedEntityParentID = props.parentID;
        var searchBox = Vec3.multiply(props.dimensions, 2);
        var intersectedEntities = Entities.findEntitiesInBox(props.position, searchBox);
        for (var i = 0; i < intersectedEntities.length; i++) {
            var entity = intersectedEntities[i];
            if (JSON.stringify(entity) !== JSON.stringify(this.releasedEntity) && this.entityIsSticky(entity) ) {
                var name = Entities.getEntityProperties(entity, "name").name;
                print("Found a sticky Entity! " + name);
                Entities.editEntity(this.releasedEntity, {
                    parentID: entity,
                    collisionsWillMove: false,
                    // ignoreForCollisions: true,
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
                // Entities.editEntity(entity, {
                //     velocity: {
                //         x: 0,
                //         y: 0,
                //         z: 0
                //     },
                //     gravity: {
                //         x: 0,
                //         y: 0,
                //         z: 0
                //     },
                //     angularVelocity: {x: 0, y: 0, z:0},
                //     ignoreForCollisions: true
                // });
                return;
            }
        }
        print("NO VALID INTERSECTED ENTITIES");
    }
    this.entityIsSticky = function(entity) {
        var props = Entities.getEntityProperties(entity, ["type", "dimensions", "locked", "parentID"]);
        if (props.type === "Model" || props.type === "Box" || props.type === "Sphere") {
            if (props.locked) {
                return false;
            }
            if (props.type === "Model" && Vec3.length(props.dimensions) > this.maxDimensionLength) {
                // If dimensions are huge, this is probably not an entity we want to make sticky
                return false;
            }

            if ( JSON.stringify(props.parentID) !== JSON.stringify(this.releasedEntityParentID  )) {
               // If the entity we are testing already has a parent, we don't add our released entity as a child of it
                print("TESTED ENTITY ALREADY HAS A PARENT")
                return false;
            }
          
            return true;
        }

        return false;

    }
}


var manager = new StickyStuffManager();
manager.subscribeToMessages();