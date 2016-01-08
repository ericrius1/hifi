function StickyStuffManager() {

    var _this = this;
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
        var searchBox = Vec3.multiply(props.dimensions, 0.5);
        var intersectedEntities = Entities.findEntitiesInBox(props.position, searchBox);
        if (intersectedEntities.length > 1) {
            var name = Entities.getEntityProperties(intersectedEntities[5], "name").name;
            print("NAME " + name)
            Entities.editEntity(entityID, {parentID: intersectedEntities[5]});
        }

    }
}

var manager = new StickyStuffManager();
manager.subscribeToMessages();