var VRVJ_SKYBOX_NAME = "VRVJ SkyBox";

var zone = Entities.addEntity({
    type: "Zone",
    name: VRVJ_SKYBOX_NAME,
    position: MyAvatar.position,
    dimensions: {
        x: 5000,
        y: 5000,
        z: 5000
    },
    keyLightIntensity: 0.001,
    keyLightAmbientIntensity: 0.02,
    shapeType: "sphere",
    backgroundMode: "skybox",
    skybox: {
        url: "https://hifi-public.s3.amazonaws.com/images/SkyboxTextures/CloudyDay1.jpg"
    },
    userData: JSON.stringify({

        ProceduralEntity: {
            version: 2,
            shaderUrl: "file:///C:/Users/Eric/hifi/examples/hackathon/skybox.fs",
            channels: [
                "https://hifi-public.s3.amazonaws.com/austin/assets/images/skybox/starmap_8k.jpg",
            ]
        }
    })
});



function cleanup() {
    Entities.deleteEntity(zone);
}

Script.scriptEnding.connect(cleanup);