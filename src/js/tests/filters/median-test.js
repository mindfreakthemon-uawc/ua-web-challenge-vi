define(['filters/median', 'tests/imageloader'],
	function (median, imageloader) {
		module('Median Definition Test');

		test('filter should be an object', function () {
			equal(typeof median, 'object', 'it is');
			equal(median.name, 'median', 'has name = median');
		});

		test('filter should contain options', function () {
			equal(typeof median.options, 'object', 'has options');
			equal(typeof median.options.window, 'object', 'has window option');
		});

		asyncTest('filter should work', function () {
			expect(1);

			imageloader('median-3', function (modifiedImageData, originalImageData) {
				median.runner(originalImageData, {
					window: 3
				});

				equal(originalImageData.data.length, modifiedImageData.data.length, 'works');
				start();
			});
		});
	});
