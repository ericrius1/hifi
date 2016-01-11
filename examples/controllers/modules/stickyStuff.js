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
        var searchBox = Vec3.multiply(props.dimensions, 1);
        var intersectedEntities = Entities.findEntitiesInBox(props.position, searchBox);
        intersectedEntities.forEach( function(entity) {
            var name = Entities.getEntityProperties(entity, "name").name;
            if (name === "block" && JSON.stringify(entity) !== JSON.stringify(entityID)) {
                print ("OTHER BLOCK!!")
                Entities.editEntity(entity, {parentID: entityID, collisionsWillMove: false});
                return;
            }
        });
    }
}

var manager = new StickyStuffManager();
manager.subscribeToMessages();