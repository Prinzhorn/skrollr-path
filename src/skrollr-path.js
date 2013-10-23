(function() {
	'use strict';

	var ANGLE_DELTA_DIST = 1;

	/**
	 * Recursively find out where each segment of the path starts, ends and it's length.
	 * Divide and conquer.
	 */
	var findPathSegmentLengths = function(path, start, end, result) {
		var startSegment = path.getPathSegAtLength(start);
		var endSegment = path.getPathSegAtLength(end);

		//Both are in the same segment, there are no nodes in between.
		if(startSegment === endSegment) {
			return;
		}

		//They're just one pixel away, we found a node.
		//This will fail if nodes are VERY close (TODO: document this).
		if(end - start <= 1) {
			result.push({
				start: start,
				end: end
			});

			return;
		}

		//Divide the subpath in two.
		var center = (start + end) / 2;
		findPathSegmentLengths(path, start, center, result);
		findPathSegmentLengths(path, center, end, result);
	};

	skrollr.easingFromPath = function(path, options) {
		options = options || {};

		var weights = options.weights;

		var bbox = path.getBBox();
		var width = bbox.width + bbox.x;
		var height = bbox.height + bbox.y;
		var length = path.getTotalLength();

		if(weights) {
			var segments = [];

			findPathSegmentLengths(path, 0.0001, length, segments);

			segments.sort(function(a, b) {
				return a.start - b.start;
			});

			console.log(segments);
		}

		var xFn = function(p) {
			var x = path.getPointAtLength(length * p).x;

			return x / width;
		};

		var yFn = function(p) {
			var y = path.getPointAtLength(length * p).y;

			return y / height;
		};

		var angleFn = function(p) {
			var len = length * p;
			var point1 = path.getPointAtLength(Math.max(0, len - ANGLE_DELTA_DIST));
			var point2 = path.getPointAtLength(Math.min(length, len + ANGLE_DELTA_DIST));

			var dx = point1.x - point2.x;
			var dy = point1.y - point2.y;

			var angle = Math.atan(dy / dx) / (Math.PI / 2);

			return (angle + 1) / 2;
		};

		return {
			x: xFn,
			y: yFn,
			angle: angleFn
		};
	};
}());