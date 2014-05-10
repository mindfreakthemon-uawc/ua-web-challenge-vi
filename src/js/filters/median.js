define(function () {
	/**
	 * @param imageData
	 * @param options {{window: number}}
	 */
	function median(imageData, options) {
		var pixels = imageData.data;

		var t, x, y, c, u, v, windowIndex, imageIndex;

		var mid = Math.floor(Math.pow(options.window, 2) / 2);

		for (t = 0; t < 3; t++) { // 3 - RGB
			for (x = 0; x < imageData.width; x++) {
				for (y = 0; y < imageData.height; y++) {
					c = [];

					for (u = 0; u < options.window; u++) {
						for (v = 0; v < options.window; v++) {
							windowIndex = ((x + u) + (y + v) * imageData.width) * 4; // 4 - [RGBA]

							c.push(pixels[windowIndex + t]);
						}
					}

					c.sort();

					imageIndex = (x + y * imageData.width) * 4;

					pixels[imageIndex + t] = c[mid];
				}
			}
		}
	}

	return {
		label: 'Median',
		name: 'median',
		runner: median,
		options: {
			window: {
				label: 'Window size',
				min: 1,
				max: 10,
				value: 3,
				type: 'range'
			}
		}
	};
});
