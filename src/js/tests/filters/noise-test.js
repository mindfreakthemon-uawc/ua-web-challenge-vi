define(['filters/noise', 'tests/imageloader'],
	function (noise, imageloader) {
		module('Noise Definition Test');

		test('filter should be an object', function () {
			equal(typeof noise, 'object', 'it is');
			equal(noise.name, 'noise', 'has name = noise');
		});

		test('filter should contain options', function () {
			equal(typeof noise.options, 'object', 'has options');
			equal(typeof noise.options.strength, 'object', 'has strength option');
			equal(typeof noise.options.amount, 'object', 'has amount option');
			equal(typeof noise.options.mono, 'object', 'has mono option');
		});

		asyncTest('filter should work', function () {
			expect(1);

			imageloader('noise-0.5-0.5', function (modifiedImageData, originalImageData) {
				noise.runner(originalImageData, {
					strength: 0.5,
					amount: 0.5,
					mono: false
				});

				equal(originalImageData.data.length, modifiedImageData.data.length, 'works');
				start();
			});
		});
	});
