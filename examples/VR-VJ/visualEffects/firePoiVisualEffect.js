
function() {
    Script.include("../libraries/utils.js");
    var _this = this;

    this.initialize = function(position) {
      
    }

    this.update = function(volume, loudness) {

        var newParticleRadius = map(loudness, 0, 1, _this.particleRadiusRange.min, _this.particleRadiusRange.max);
        newParticleRadius *= volume;
        
        Entities.editEntity(_this.poiFlame, {particleRadius: newParticleRadius});

    }

    this.destroy = function() {
        Entities.deleteEntity(_this.poiFlame)
        Entities.deleteEntity(_this.poiStick);
    }

}