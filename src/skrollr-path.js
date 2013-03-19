(function() {
	'use strict';

	skrollr.easingFromPath = function(svg, options) {
		options = options || {};

		var DELTA = 1;

		var bbox = svg.getBBox();
		var width = bbox.width;
		var height = bbox.height;
		var length = svg.getTotalLength();
		var getPointAtLength = svg.getPointAtLength;

		var xFn = function(p) {
			var x = svg.getPointAtLength(length * p).x;

			return x / width;
		};

		var yFn = function(p) {
			var y = svg.getPointAtLength(length * p).y;

			return y / height;
		};

		var angleFn = function(p) {
			var len = length * p;
			var point1 = svg.getPointAtLength(Math.max(0, len - DELTA));
			var point2 = svg.getPointAtLength(Math.min(length, len + DELTA));

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

		/*
		return function(p) {
			//return (Math.pow(Math.E, p) - 1) / (Math.E - 1);
			return Math.sin(p * 4 * Math.PI);
		};
		*/
	};
}());