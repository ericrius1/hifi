// gridGaze.js
// Select a cell on a grid based on user's gaze


	
  var orientation = MyAvatar.orientation;
  orientation = Quat.safeEulerAngles(orientation);
  orientation.x = 0;
  orientation.y = 0;
  orientation.z = 0;
  orientation = Quat.fromVec3Degrees(orientation);
  var center = Vec3.sum(MyAvatar.getHeadPosition(), Vec3.multiply(9, Quat.getFront(orientation)));
  center.x = Math.floor(center.x * 4)/4;
  center.z = Math.floor(center.z * 4)/4;
  center.y -= 2;
  var UPDATE_TIME = 100;
  var overlayLine = null;

var GRID_SIZE = 16
var GRID_HEIGHT = 0.1;
var grid = Entities.addEntity({
	type: "Box",
	position: center, 
	dimensions: {x: GRID_SIZE, y: GRID_HEIGHT, z: GRID_SIZE},
	color: {red: 200, green: 20, blue: 150}
});

var CELL_FRACTION_OF_GRID = 1/64;
var CELL_SIZE = GRID_SIZE * CELL_FRACTION_OF_GRID;
var cellPosition = {x: center.x, y: center.y - CELL_SIZE/2 + 0.055, z: center.z};
var overlayCell = Overlays.addOverlay("cube", {
	size: CELL_SIZE,
	position: cellPosition,
	color: {red: 200, green: 10, blue: 10},
	alpha: 1,
	visible: false,	
	solid: true 
});

var gridLines = [];
var LINE_COLOR = {red: 200, green: 10, blue: 10};
var lineProperties = {
    lineWidth: 5,
    color: LINE_COLOR,
    ignoreRayIntersection: true, // always ignore this
    visible: true,
    alpha: 1
};
var lineHeight = GRID_HEIGHT/2 + 0.001;
for (var xPos = center.x - GRID_SIZE/2; xPos <= center.x + GRID_SIZE/2; xPos+= CELL_SIZE) {
	lineProperties.start = {x: xPos, y: center.y +lineHeight, z: center.z - GRID_SIZE/2};
	lineProperties.end = {x: xPos, y: center.y +lineHeight, z: center.z + GRID_SIZE/2};
	var gridLine = Overlays.addOverlay("line3d", lineProperties);
	gridLines.push(gridLine);
}

for (zPos = center.z - GRID_SIZE/2; zPos <= center.z + GRID_SIZE/2; zPos += CELL_SIZE) {
	lineProperties.start = {x: center.x - GRID_SIZE/2, y: center.y +lineHeight, z: zPos};
	lineProperties.end = {x: center.x + GRID_SIZE/2, y: center.y +lineHeight, z: zPos};
	var gridLine = Overlays.addOverlay("line3d", lineProperties);
	gridLines.push(gridLine);
}




Script.scriptEnding.connect(cleanup);

function update() {
	castRay();
}

function castRay() {
	print("EBL UPDATE")
	// var position = MyAvatar.getHeadPosition();
	// var orientation = MyAvatar.headOrientation;

    var position = Camera.position;
	var orientation = Camera.orientation;
	var pickRay = {
		origin: position,
		direction: Quat.getFront(orientation) 
	}
	var farPoint = Vec3.sum(position, Vec3.multiply(Quat.getFront(orientation), 5));
	overlayLineOn(position, farPoint);
    var intersection = Entities.findRayIntersection(pickRay, true, [grid]);
    if (intersection.intersects) {
    	// Figure out what cell we hit
    	//mult by 4, floor it (which gives you cell num), then divide by 4 (pos in meters from grid origin)
    	var adjustedXPos = ((Math.floor(intersection.intersection.x * 4))/4) + CELL_SIZE/2;
    	var adjustedZPos = ((Math.floor(intersection.intersection.z * 4))/4) - CELL_SIZE/2;
    	Overlays.editOverlay(overlayCell, {position: {x: adjustedXPos, y: cellPosition.y, z: adjustedZPos}, visible: true});
    } else {
    	Overlays.editOverlay(overlayCell, {visible: false});
    }
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
	Entities.deleteEntity(grid);
	Overlays.deleteOverlay(overlayLine);
	Overlays.deleteOverlay(overlayCell);
	gridLines.forEach(function(gridLine) {
		Overlays.deleteOverlay(gridLine);
	});
	Script.clearInterval(updateInterval);
}


var updateInterval = Script.setInterval(update, UPDATE_TIME);
