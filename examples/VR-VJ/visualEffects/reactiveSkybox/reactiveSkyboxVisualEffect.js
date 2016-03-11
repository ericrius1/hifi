function() {
    var _this = this;

    Script.include("../libraries/utils.js");
    var SKYBOX_SHADER_URL = Script.resolvePath("rainyDayNightSkybox.fs");
    this.initialize = function(position) {
        print("EBL ADD SKYBOX")
        _this.skyboxUserData = {
            ProceduralEntity: {
                version: 2,
                shaderUrl: SKYBOX_SHADER_URL,
                channels: ["https://hifi-public.s3.amazonaws.com/austin/assets/images/skybox/starmap_8k.jpg", "https://hifi-public.s3.amazonaws.com/austin/assets/images/skybox/celestial_grid.jpg", "https://s3.amazonaws.com/hifi-public/brad/rainstorm/noise.jpg", "https://s3.amazonaws.com/hifi-public/brad/noise.jpg"],
                uniforms: {
                    uDayColor: [0.5, 0.1, 0.6],
                    uSunDirY: 0.0,
                    constellationLevel: 0.0,
                    constellationBoundaryLevel: 0.0,
                    gridLevel: 0
                }
            }
        };
        _this.VRVJSkyBox = Entities.addEntity({
            type: "Zone",
            backgroundMode: "skybox",
            name: "VRVJ Skybox",
            position: position,
            dimensions: {
                x: 100,
                y: 100,
                z: 100
            },
            userData: JSON.stringify(_this.skyboxUserData)
        });


    }

    this.update = function(volume, loudness) {

        var sunDirY = map(volume, 0, 1, -1, 1);
        _this.skyboxUserData.ProceduralEntity.uniforms.uSunDirY = sunDirY;
        setEntityUserData(_this.skyboxUserData);

    }

    this.destroy = function() {
        Entities.deleteEntity(_this.VRVJSkyBox)
    }

}