define(function () {
	/**
	 * @param imageData
	 * @param options {{window: number}}
	 */
	function median(imageData, options) {
		var pixels = imageData.data;

		var x, y, c0, c1, c2, u, v, windowIndex, imageIndex;

		var mid = Math.floor(
				Math.pow(options.window, 2) / 2);

		for (x = 0; x < imageData.width; x++) {
			for (y = 0; y < imageData.height; y++) {
				c0 = [];
				c1 = [];
				c2 = [];

				imageIndex = (x + y * imageData.width) * 4;

				for (u = 0; u < options.window; u++) {
					for (v = 0; v < options.window; v++) {
						windowIndex = (imageIndex + (u + v * imageData.width) * 4) % pixels.length;

						c0.push(pixels[windowIndex + 0]);
						c1.push(pixels[windowIndex + 1]);
						c2.push(pixels[windowIndex + 2]);
					}
				}

				c0.sort();
				c1.sort();
				c2.sort();

				pixels[imageIndex + 0] = c0[mid];
				pixels[imageIndex + 1] = c1[mid];
				pixels[imageIndex + 2] = c2[mid];
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
