const CLIP_URL = "atp:644901bd04b6200a3b2c6de53785742e8b0408645f9b21698d0b7ebf468d50dc.hfr";


const RECORDING_CHANNEL = 'PlayBackOnAssignment';
const RECORDING_CHANNEL_MESSAGE = 'HydraTutorialChannel'; // For each different assignment add a different message here.
const PLAY_FROM_CURRENT_LOCATION = false;
const USE_DISPLAY_NAME = true;
const USE_ATTACHMENTS = true;
const USE_AVATAR_MODEL = true;
const AUDIO_OFFSET = 0.0;
const STARTING_TIME = 0.0;


var setUpRecording = function() {

    Agent.isAvatar = true;
    Avatar.position = {
        x: 555.0,
        y: 495.5,
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
}

var playRecording = function() {
    Recording.startPlaying();
};

Messages.subscribe(RECORDING_CHANNEL);
setUpRecording();

Messages.messageReceived.connect(function(channel, message, senderID) {
    print('channel: ' + channel);
    print('message: ' + message);
    if (channel === RECORDING_CHANNEL && message === RECORDING_CHANNEL_MESSAGE) {
        playRecording();
    }
});