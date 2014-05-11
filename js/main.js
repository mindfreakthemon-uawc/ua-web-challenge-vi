require({
		baseUrl: '/js',
		paths: {
			jquery: '../lib/jquery-2.1.1.min',
			cropper: '../lib/cropper/cropper.min',
			bootstrap: '../lib/bootstrap/js/bootstrap',
			jade: '../lib/jade/runtime'
		},
		shim: {
			'bootstrap' : ['jquery']
		}
	},
	['filters', 'templates', 'area', 'loader', 'options'],
	function (filters, templates, area, loader, options) {
		var fileEntry,
			originalImageData,
			safeTimeout,
			worker;

		var file = document.getElementById('file'),
			scene = document.getElementById('scene'),
			image = document.getElementById('image'),
			list = document.getElementById('filter-list'),
			canvas = document.getElementById('canvas'),
			context = canvas.getContext('2d');

		var unload = document.getElementById('unload'),
			upload = document.getElementById('upload'),
			apply = document.getElementById('apply'),
			cancel = document.getElementById('cancel'),
			save = document.getElementById('save');

		var form = document.getElementById('form'),
			x1 = document.getElementById('x1'),
			y1 = document.getElementById('y1'),
			x2 = document.getElementById('x2'),
			y2 = document.getElementById('y2');

		/**
		 * When user selects an image
		 */
		file.addEventListener('change', function (e) {
			fileEntry = e.target.files[0];

			image.src = URL.createObjectURL(fileEntry);
		});

		image.addEventListener('load', function () {
			var w = image.naturalWidth,
				h = image.naturalHeight;

			x1.value = 0;
			y1.value = 0;
			x2.value = x2.max = x1.max = w;
			y2.value = y2.max = y1.max = h;

			canvas.width = w;
			canvas.height = h;

			context.clearRect(0, 0, w, h);
			context.drawImage(image, 0, 0);

			// save initial imageData
			originalImageData = context.getImageData(0, 0, w, h);

			// create new worker
			worker = new Worker('/js/thread.js');

			worker.addEventListener('message', function (e) {
				context.putImageData(e.data.imageData, e.data.x1, e.data.y1);

				loader.hide();
			});

			// initial render
			options.update();

			// hide upload form
			// and show controls
			form.classList.remove('hidden');
			canvas.classList.remove('hidden');
			upload.classList.add('hidden');

			area.setup(function (data) {
				x1.value = data.x1;
				y1.value = data.y1;
				x2.value = data.x2;
				y2.value = data.y2;

				// safe timeout for serial updates
				clearTimeout(safeTimeout);
				safeTimeout = setTimeout(updateFilterContext, 100);
			});

			URL.revokeObjectURL(fileEntry);
		});

		/**
		 * When user clicks on unload button
		 */
		unload.addEventListener('click', function () {
			file.value = null;

			// hide controls
			// and show upload form
			form.classList.add('hidden');
			canvas.classList.add('hidden');
			upload.classList.remove('hidden');

			area.clear();

			// terminating worker
			worker.terminate();

			// clear timeout just to be sure
			clearTimeout(safeTimeout);
		});

		/**
		 * When user decides to save current filter
		 */
		apply.addEventListener('click', function () {
			originalImageData = context.getImageData(0, 0, canvas.width, canvas.height);

			options.update();
		});

		/**
		 * When user decides to roll back current filter
		 */
		cancel.addEventListener('click', function () {
			context.putImageData(originalImageData, 0, 0);

			options.update();
		});

		/**
		 * Download the image
		 */
		save.addEventListener('click', function () {
			var a = document.createElement('a');

			a.download = 'image.png';
			a.href = canvas.toDataURL('image/png');

			a.dispatchEvent(new MouseEvent('click'));
		});

		/**
		 * When user selects filters, display filter's options
		 */
		list.addEventListener('change', function (e) {
			options.update(e.target.value);
		});

		/**
		 * When user changes some parameters in the control form
		 */
		form.addEventListener('change', function () {
			// safe timeout for serial updates
			clearTimeout(safeTimeout);
			safeTimeout = setTimeout(updateFilterContext, 500);
		});

		form.addEventListener('submit', function (e) {
			e.preventDefault();
		});

		/**
		 *
		 */
		function updateFilterContext() {
			var filterName = form.elements.filterName.value,
				filter = filters[filterName],
				options = {};

			if (!filter) {
				return;
			}

			// reset context to saved state
			context.putImageData(originalImageData, 0, 0);

			// gathering options for filter
			Object.keys(filter.options)
				.forEach(function (optionName) {
					var option = filter.options[optionName];

					switch (option.type) {
						case 'checkbox':
							options[optionName] = form.elements[optionName].checked;
							break;
						case 'range':
							options[optionName] = parseFloat(form.elements[optionName].value);
							break;
					}
				});

			var x1val = +x1.value,
				y1val = +y1.value,
				x2val = +x2.value,
				y2val = +y2.value;

			worker.postMessage({
				filterName: filterName,
				imageData: context.getImageData(x1val, y1val, x2val - x1val, y2val - y1val),
				options: options,
				x1: x1val,
				y1: y1val,
				x2: x2val,
				y2: y2val
			});

			loader.show();
		}

		// preparing radio-boxes for filters
		list.innerHTML = templates['filters']({
			filters: filters
		});
	});
