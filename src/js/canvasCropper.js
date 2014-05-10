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
			$image
				.cropper({
					data: {
						x1: 0,
						y1: 0,
						width: canvas.clientWidth,
						height: canvas.clientHeight
					},
					done: callback
				});

			$window
				.on('resize.ic', function () {
					$image.cropper('disable');

					$parent
						.css({
							width: canvas.clientWidth,
							left: parseInt((scene.clientWidth - canvas.clientWidth) / 2)
						});

					$image.cropper('enable');
				})
				.trigger('resize.ic');

			$cropper.on('click', function () {
				$image.cropper($image.data('cropper').active ? 'disable' : 'enable');
			});
		}

		function clearImageCropper() {
			$window.off('resize.ic');
		}

		return {
			setup: setupImageCropper,
			clear: clearImageCropper
		};
	});
