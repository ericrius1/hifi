var VRVJ_SKYBOX_NAME = "VRVJ SkyBox";

var zone = Entities.addEntity({
    type: "Zone",
    name: VRVJ_SKYBOX_NAME,
    position: MyAvatar.position,
    dimensions: {
        x: 20,
        y: 20,
        z: 20
    },
    shapeType: "sphere",
    backgroundMode: "skybox",
    skybox: {
        url: "https://hifi-public.s3.amazonaws.com/images/SkyboxTextures/CloudyDay1.jpg"
    },
    userData: JSON.stringify({

        "ProceduralEntity": {
            "version": 2,
            "shaderUrl": "file:///C:/Users/Eric/hifi/examples/hackathon/skybox.fs",
            "channels": [
                "https://hifi-public.s3.amazonaws.com/austin/assets/images/skybox/starmap_8k.jpg",
            ],
            "uniforms": {
                "red": 0.1
            }
        }
    })
});



function cleanup() {
    Entities.deleteEntity(zone);
}

Script.scriptEnding.connect(cleanup);