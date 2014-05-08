require({
		baseUrl: '/js',
		paths: {
			jquery: '../lib/jquery-2.1.1.min',
			cropper: '../lib/cropper/cropper.min',
			jade: '../lib/jade/runtime'
		}
	},
	['filters/all', 'templates', 'worker', 'jquery', 'cropper'],
	function (filters, templates, worker, $) {
		var filterList = document.getElementById('filter-list'),
			image = document.getElementById('image'),
			form = document.getElementById('form'),
			canvas = document.getElementById('canvas'),
			options = document.getElementById('filter-options'),
			context = canvas.getContext('2d');

		worker.addEventListener('message', function (e) {
			context.putImageData(e.data.imageData, 0, 0);
		});

		image.addEventListener('change', function (e) {
			e.stopPropagation();

			var file = e.target.files[0],
				img = document.createElement('img');

			img.addEventListener('load', function () {
				URL.revokeObjectURL(file);

				var w = img.naturalWidth,
					h = img.naturalHeight;

				canvas.style.width = w + 'px';
				canvas.style.height = h + 'px';
				canvas.width = w;
				canvas.height = h;

				context.clearRect(0, 0, w, h);
				context.drawImage(img, 0, 0);
			});

			img.src = URL.createObjectURL(file);
		});

		filterList.addEventListener('change', function (e) {
			e.stopPropagation();

			options.innerHTML = templates['options'](filters[e.target.value]);
		});

		form.addEventListener('change', function (e) {
			worker.postMessage({
				filterName: 'gaussian',
				options: {
					radius: 11
				},
				imageData: context.getImageData(0, 0, 100, 100)
			});
		});

		Object.keys(filters)
			.forEach(function (filterName) {
				var li = document.createElement('li');

				li.innerHTML = templates['filter'](filters[filterName]);

				filterList.appendChild(li);
			});
	});
