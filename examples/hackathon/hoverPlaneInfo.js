// gridGaze.js
// Select a cell on a grid based on user's gaze



var orientation = MyAvatar.orientation;
orientation = Quat.safeEulerAngles(orientation);
orientation.x = 0;
orientation = Quat.fromVec3Degrees(orientation);
var center = Vec3.sum(MyAvatar.getHeadPosition(), Vec3.multiply(9, Quat.getFront(orientation)));
center.x = Math.floor(center.x * 4)/4;
center.z = Math.floor(center.z * 4)/4;
center.y -= 2;
var UPDATE_TIME = 100;
var overlayLine = null;

var TIME_TILL_HIDE = 100;
var shouldUpdateText = true;
Script.scriptEnding.connect(cleanup);
var intersectedWithPlane = false;


var textMargin = .1;
var textWidth = .1;
var textHeight = .1;
var infoPanelProps = {
  position: center,
  dimensions: { x: textWidth, y: textHeight },
  backgroundColor: { red: 100, green: 0, blue: 0 },
  color: {red: 200, green: 50, blue: 100},
  text: "I'm a plane!",
  alpha: 0.9,
  backgroundAlpha: 0.9,
  ignoreRayIntersection: true,
  visible: false,
  isFacingAvatar: true
}

var infoPanel = Overlays.addOverlay("text3d", infoPanelProps);

function update() {
	castRay();
}

function castRay() {
  var position = Camera.position;
	var orientation = Camera.orientation;
	var pickRay = {
		origin: position,
		direction: Quat.getFront(orientation) 
	}
	  var farPoint = Vec3.sum(position, Vec3.multiply(Quat.getFront(orientation), 5));
	  // overlayLineOn(position, farPoint);
    var intersection = Entities.findRayIntersection(pickRay, true);
    if (!intersectedWithPlane && intersection.intersects && intersection.properties.name === "plane") {
      //move text up
      intersectedWithPlane = true;
      var position = Vec3.sum(intersection.properties.position, {x: 0, y: intersection.properties.dimensions.y * 2, z: 0});
      shouldUpdateText=  false;
      showPlaneInfo(position);
    } else if(intersectedWithPlane){
      // Wait a bit, then hide text
      Script.setTimeout(function() {
        intersectedWithPlane = false;
        Overlays.editOverlay(infoPanel, {visible: false});
      }, TIME_TILL_HIDE);
    }
}

function showPlaneInfo(position) {
  Overlays.editOverlay(infoPanel, {visible: true, position: position});
}

function overlayLineOn(closePoint, farPoint) {
	var LINE_COLOR = {red: 200, green: 10, blue: 10};
        if (overlayLine === null) {
            var lineProperties = {
                lineWidth: 5,
                start: closePoint,
                end: farPoint,
                color: LINE_COLOR,
                ignoreRayIntersection: true, // always ignore this
                visible: true,
                alpha: 1
            };
            overlayLine = Overlays.addOverlay("line3d", lineProperties);

        } else {
            var success = Overlays.editOverlay(this.overlayLine, {
                lineWidth: 5,
                start: closePoint,
                end: farPoint,
                color: LINE_COLOR,
                visible: true,
                ignoreRayIntersection: true, // always ignore this
                alpha: 1
            });
        }
};

function cleanup() {
  Overlays.deleteOverlay(infoPanel);  
  Overlays.deleteOverlay(overlayLine);
	Script.clearInterval(updateInterval);
}


var updateInterval = Script.setInterval(update, UPDATE_TIME);
