define(function () {
	/**
	 * @param imageData
	 * @param options {{amount: number, strength: number, mono: boolean}}
	 */
	function noise(imageData, options) {
		var pixels = imageData.data;

		var offset, offsetY, x, y, r, g, b, pixelNoise;

		var mono = options.mono,
			noise = 128 * options.strength,
			noise2 = noise / 2,
			random = Math.random;

		for (y = imageData.height; y >= 0; y--) {
			offsetY = (y - 1) * imageData.width * 4;

			for(x = imageData.width; x >= 0; x--) {
				offset = offsetY + (x - 1) * 4;

				if (random() < options.amount) {
					if (false && mono) {
						pixelNoise = random() * noise - noise2;

						r = pixels[offset + 0] + pixelNoise;
						g = pixels[offset + 1] + pixelNoise;
						b = pixels[offset + 2] + pixelNoise;
					} else {
						r = pixels[offset + 0] - noise2 + (random() * noise);
						g = pixels[offset + 1] - noise2 + (random() * noise);
						b = pixels[offset + 2] - noise2 + (random() * noise);
					}

					if (r < 0) {
						r = 0;
					}

					if (g < 0) {
						g = 0;
					}

					if (b < 0) {
						b = 0;
					}

					if (r > 255) {
						r = 255;
					}

					if (g > 255) {
						g = 255;
					}
					if (b > 255) {
						b = 255;
					}

					pixels[offset + 0] = r;
					pixels[offset + 1] = g;
					pixels[offset + 2] = b;
				}
			}
		}
	}

	return {
		label: 'Noise',
		name: 'noise',
		runner: noise,
		options: {
			amount: {
				label: 'Amount',
				min: 0,
				max: 1,
				value: 0.5,
				step: 0.01,
				type: 'range'
			},
			strength: {
				label: 'Strength',
				min: 0,
				max: 1,
				value: 0.5,
				step: 0.01,
				type: 'range'
			},
			mono: {
				label: 'Mono noise',
				type: 'checkbox'
			}
		}
	};
});
