define(['./gaussian', './median', './noise'],
	function () {
		var map = {};

		Array.prototype.forEach.call(arguments, function (filter) {
			if (!filter.hasOwnProperty('label')) {
				filter.label = filter.name;
			}

			if (!filter.hasOwnProperty('options')) {
				filter.options = {};
			}

			if (!filter.hasOwnProperty('runner')) {
				filter.runner = function () {};
			}

			map[filter.name] = filter;
		});

		return map;
	}
);
