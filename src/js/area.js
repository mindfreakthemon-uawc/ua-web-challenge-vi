define(['jquery', 'cropper'],
	function ($) {
		var scene = document.getElementById('scene'),
			image = document.getElementById('image'),
			canvas = document.getElementById('canvas'),
			cropper = document.getElementById('cropper'),
			$cropper = $(cropper),
			$image = $(image),
			$window = $(window),
			$parent = $image.parent();

		function setupImageCropper(callback) {
			var data;

			$image
				.cropper({
					data: {
						x1: 0,
						y1: 0,
						width: image.naturalWidth,
						height: image.naturalHeight
					},
					done: callback
				});

			$window
				.on('resize.cc', function () {
					$image.cropper('disable');

					$parent
						.css({
							width: canvas.clientWidth,
							left: parseInt((scene.clientWidth - canvas.clientWidth) / 2)
						});

					$image.cropper('enable');
				})
				.trigger('resize.cc');

			$cropper
				.on('click.cc', function () {
					var isActive = $image.data('cropper').active;

					if (isActive) {
						data = $image.cropper('getData');
						$image.cropper('disable');
					} else {
						$image.data('cropper').defaults.data = data;
						$image.cropper('enable');
					}
				});
		}

		function clearImageCropper() {
			$window
				.add($cropper)
				.off('.cc');

			$image.cropper('disable');
			$image.data('cropper', false);
		}

		return {
			setup: setupImageCropper,
			clear: clearImageCropper
		};
	});
