print("YAHAHAHAHAH")
VisualEffect = function() {
    var poiStick;
    this.initialize = function(position) {
    
        poiStick = Entities.addEntity({
            type: "Box",
            name: "Poi Stick",
            dimensions: {x: 0.1, y: 0.1, z: 0.4},
            position: position,
            dynamic: true,
            color: {red: 80, green: 120, blue: 170}
        });
    }

    this.update = function() {

    }

    this.destroy = function() {
        Entities.deleteEntity(poiStick);
    }

}