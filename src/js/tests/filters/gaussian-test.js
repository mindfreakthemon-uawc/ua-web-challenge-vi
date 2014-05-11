define(['filters/gaussian', 'tests/imageloader'],
	function (gaussian, imageloader) {
		module('Gaussian Definition Test');

		test('filter should be an object', function () {
			equal(typeof gaussian, 'object', 'it is');
			equal(gaussian.name, 'gaussian', 'has name = gaussian');
		});

		test('filter should contain options', function () {
			equal(typeof gaussian.options, 'object', 'has options');
			equal(typeof gaussian.options.radius, 'object', 'has radius option');
		});

		asyncTest('filter should work', function () {
			expect(1);

			imageloader('gaussian-10', function (modifiedImageData, originalImageData) {
				gaussian.runner(originalImageData, {
					radius: 10
				});

				equal(originalImageData.data.length, modifiedImageData.data.length, 'works');
				start();
			});
		});
	});
