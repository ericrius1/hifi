(function() {
    // Script.include("../libraries/utils.js");
    //Need absolute path for now, for testing before PR merge and s3 cloning. Will change post-merge

    Script.include("../libraries/utils.js");

    this.spraySound = SoundCache.getSound("https://s3.amazonaws.com/hifi-public/sounds/sprayPaintSound.wav");

    var TIP_OFFSET_Z = 0.02;
    var TIP_OFFSET_Y = 0.08;

    var ZERO_VEC = {
        x: 0,
        y: 0,
        z: 0
    }

    // if the trigger value goes below this while held, the can will stop spraying.  if it goes above, it will spray
    var DISABLE_SPRAY_THRESHOLD = 0.7;

    var MAX_POINTS_PER_LINE = 40;
    var MIN_POINT_DISTANCE = 0.01;
    var STROKE_WIDTH = 0.02;

    this.setRightHand = function() {
        this.hand = 'RIGHT';
    }

    this.setLeftHand = function() {
        this.hand = 'LEFT';
    }

    this.startNearGrab = function() {
        this.whichHand = this.hand;
    }

    this.toggleWithTriggerPressure = function() {
        var handClickString = this.whichHand + "_HAND_CLICK";

        var handClick = Controller.findAction(handClickString);

        this.triggerValue = Controller.getActionValue(handClick);
        if (this.triggerValue < DISABLE_SPRAY_THRESHOLD && this.spraying === true) {
            this.spraying = false;
            this.disableStream();
        } else if (this.triggerValue >= DISABLE_SPRAY_THRESHOLD && this.spraying === false) {
            this.spraying = true;
            this.enableStream();
        }
    }

    this.enableStream = function() {
        var position = Entities.getEntityProperties(this.entityId, "position").position;
        var animationSettings = JSON.stringify({
            fps: 30,
            loop: true,
            firstFrame: 1,
            lastFrame: 10000,
            running: true
        });
        var PI = 3.141593;
        var DEG_TO_RAD = PI / 180.0;

        this.paintStream = Entities.addEntity({
            type: "ParticleEffect",
            name: "streamEffect",
            animationSettings: animationSettings,
            position: position,
            textures: "https://raw.githubusercontent.com/ericrius1/SantasLair/santa/assets/smokeparticle.png",
            emitSpeed: 3,
            speedSpread: 0.02,
            emitAcceleration: ZERO_VEC,
            emitRate: 100,
            particleRadius: 0.01,
            radiusSpread: 0.005,
            polarFinish: 0.1,
            color: {
                red: 170,
                green: 20,
                blue: 150
            },
            lifetime: 50, //probably wont be holding longer than this straight
        });

        setEntityCustomData(this.resetKey, this.paintStream, {
            resetMe: true
        });

        this.sprayInjector = Audio.playSound(this.spraySound, {
            position: position,
            volume: 0.1
        });

    }

    this.releaseGrab = function() {
        this.disableStream();
    }

    this.disableStream = function() {
        print("DEKETE STEREAAAM")
        Entities.deleteEntity(this.paintStream);
        this.paintStream = null;
        this.sprayInjector.stop();
    }


    this.continueNearGrab = function() {

        this.toggleWithTriggerPressure();

        if (this.spraying === false) {
            return;
        }

        var props = Entities.getEntityProperties(this.entityId, ["position, rotation"]);
        var forwardVec = Quat.getFront(Quat.multiply(props.rotation, Quat.fromPitchYawRollDegrees(0, 90, 0)));
        forwardVec = Vec3.normalize(forwardVec);
        var forwardQuat = orientationOf(forwardVec);
        var upVec = Quat.getUp(props.rotation);
        var position = Vec3.sum(props.position, Vec3.multiply(forwardVec, TIP_OFFSET_Z));
        position = Vec3.sum(position, Vec3.multiply(upVec, TIP_OFFSET_Y))
        Entities.editEntity(this.paintStream, {
            position: position,
            emitOrientation: forwardQuat,
        });
    }



 

    this.preload = function(entityId) {
        this.spraying = false;
        this.entityId = entityId;
        this.resetKey = "resetMe";
    }


    this.unload = function() {
        if (this.paintStream) {
            Entities.deleteEntity(this.paintStream);
        }
        this.strokes.forEach(function(stroke) {
            Entities.deleteEntity(stroke);
        });
    }
});



function randFloat(min, max) {
    return Math.random() * (max - min) + min;
}

function randInt(min, max) {
    return Math.floor(Math.random() * (max - min)) + min;
}

function orientationOf(vector) {
    var Y_AXIS = {
        x: 0,
        y: 1,
        z: 0
    };
    var X_AXIS = {
        x: 1,
        y: 0,
        z: 0
    };

    var theta = 0.0;

    var RAD_TO_DEG = 180.0 / Math.PI;
    var direction, yaw, pitch;
    direction = Vec3.normalize(vector);
    yaw = Quat.angleAxis(Math.atan2(direction.x, direction.z) * RAD_TO_DEG, Y_AXIS);
    pitch = Quat.angleAxis(Math.asin(-direction.y) * RAD_TO_DEG, X_AXIS);
    return Quat.multiply(yaw, pitch);
}