const CLIP_URL = "atp:6a4866aed4f717933bb5ac6e4824e56f49fedf635550ac7baa84b6ccb1bb6ab4.hfr";


const RECORDING_CHANNEL = 'PlayBackOnAssignment';
const RECORDING_CHANNEL_MESSAGE = 'HydraTutorialChannel'; // For each different assignment add a different message here.
const PLAY_FROM_CURRENT_LOCATION = false;
const USE_DISPLAY_NAME = true;
const USE_ATTACHMENTS = true;
const USE_AVATAR_MODEL = true;
const AUDIO_OFFSET = 0.0;
const STARTING_TIME = 0.0;
const COOLDOWN_PERIOD = 0; // The period in ms that no animations can be played after one has been played already

var isPlaying = false;
var isPlayable = true;

var setUpPlatform = function() {
    var MODEL_URL = "https://hifi-content.s3.amazonaws.com/alan/dev/Holographic-Stage-no-roof.fbx"
    var PLATFORM_POSITION = {
        x: 554.59,
        y: 495.49,
        z: 472.41
    };
    var PLATFORM_ROTATION = Quat.fromPitchYawRollDegrees(0, 200, 0);
    var tutorialZone = Entities.addEntity({
        type: "Model",
        name: "Tutorial Platform",
        modelURL: MODEL_URL,
        position: PLATFORM_POSITION,
        dimensions: {
            x: 5.1,
            y: 2.58,
            z: 5.1
        },
        rotation: PLATFORM_ROTATION
    });

    var SCRIPT_URL = "https://rawgit.com/ericrius1/hifi/hydraTutorial/examples/tutorials/hydraTutorial/hydraTutorialZoneEntityScript.js";
    var triggerBox = Entities.addEntity({
        type: "Box",
        color: {
            red: 200,
            green: 10,
            blue: 200
        },
        parentID: tutorialZone,
        position: Vec3.sum(PLATFORM_POSITION, {
            x: 0,
            y: 0,
            z: 1
        }),
        dimensions: {
            x: 3.5,
            y: 0.8,
            z: 1.8
        },
        rotation: Quat.fromPitchYawRollDegrees(0, 180, 0),
        collisionless: true,
        script: SCRIPT_URL,
        visible: true
    });
}

var playRecording = function() {
    if (!isPlayable || isPlaying) {
        return;
    }
    Agent.isAvatar = true;
    Avatar.position = {
        x: 555.0,
        y: 496,
        z: 471.6
    };
    Avatar.orientation = Quat.fromPitchYawRollDegrees(0, 150, 0);

    Recording.setPlayFromCurrentLocation(PLAY_FROM_CURRENT_LOCATION);
    Recording.setPlayerUseDisplayName(USE_DISPLAY_NAME);
    Recording.setPlayerUseAttachments(USE_ATTACHMENTS);
    Recording.setPlayerUseHeadModel(false);
    Recording.setPlayerUseSkeletonModel(USE_AVATAR_MODEL);
    Recording.setPlayerLoop(false);
    Recording.setPlayerTime(STARTING_TIME);
    Recording.setPlayerAudioOffset(AUDIO_OFFSET);
    Recording.loadRecording(CLIP_URL);
    Recording.startPlaying();
    isPlaying = true;
    isPlayable = false; // Set this true again after the cooldown period
};

Script.update.connect(function(deltaTime) {
    if (isPlaying && !Recording.isPlaying()) {
        print('Reached the end of the recording. Resetting.');
        isPlaying = false;
        Agent.isAvatar = false;
        if (COOLDOWN_PERIOD === 0) {
            isPlayable = true;
            return;
        }
        Script.setTimeout(function() {
            isPlayable;
        }, COOLDOWN_PERIOD);
    }
});

Messages.subscribe(RECORDING_CHANNEL);
setUpPlatform();

Messages.messageReceived.connect(function(channel, message, senderID) {
    print('channel: ' + channel);
    print('message: ' + message);
    if (channel === RECORDING_CHANNEL && message === RECORDING_CHANNEL_MESSAGE) {
        playRecording();
    }
});
//Messages.sendMessage('PlayBackOnAssignment', 'BowShootingGameExplaination');