define(['./gaussian', './median'],
	function () {
		var map = {};

		Array.prototype.forEach.call(arguments, function (filter) {
			map[filter.name] = filter;
		});

		return map;
	}
);
