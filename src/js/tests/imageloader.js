define(function () {
	return function (name, returning) {
		var canvas = document.createElement('canvas'),
			context = canvas.getContext('2d'),
			img = document.createElement('img'),
			originalImageData,
			modifiedImageData;

		img.addEventListener('load', function callback() {
			img.removeEventListener('load', callback);

			canvas.width = img.naturalWidth;
			canvas.height = img.naturalHeight;

			context.drawImage(img, 0, 0);

			originalImageData = context.getImageData(0, 0, img.naturalWidth, img.naturalHeight);

			img.addEventListener('load', function callback() {
				img.removeEventListener('load', callback);

				canvas.width = img.naturalWidth;
				canvas.height = img.naturalHeight;

				context.drawImage(img, 0, 0);

				modifiedImageData = context.getImageData(0, 0, img.naturalWidth, img.naturalHeight);

				returning(modifiedImageData, originalImageData);
			});

			img.src = 'img/html5_triforce_' + name + '.png';
		});

		img.src = 'img/html5_triforce.png';
	};
});
