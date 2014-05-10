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
	['filters/all', 'templates', 'workerFactory', 'canvasCropper'],
	function (filters, templates, workerFactory, canvasCropper) {
		var originalImageData,
			safeTimeout,
			worker;

		var loader = document.getElementById('loader'),
			file = document.getElementById('file'),
			scene = document.getElementById('scene'),
			image = document.getElementById('image'),
			list = document.getElementById('filter-list'),
			options = document.getElementById('filter-options'),
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
			var fileEntry = e.target.files[0];

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
				worker = workerFactory();

				worker.addEventListener('message', function (e) {
					context.putImageData(e.data.imageData, e.data.x1, e.data.y1);

					// hide loader when necessary
					var i = +loader.dataset.waiting;

					if (i === 1) {
						loader.classList.add('hidden');
						loader.dataset.waiting = 0;
					} else {
						loader.dataset.waiting = i - 1;
					}
				});

				// initial render
				updateFilterOptions();

				// hide upload form
				// and show controls
				form.classList.remove('hidden');
				canvas.classList.remove('hidden');
				upload.classList.add('hidden');

				canvasCropper.setup(function (data) {
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

			image.src = URL.createObjectURL(fileEntry);
		});

		/**
		 * When user clicks on unload button
		 */
		unload.addEventListener('click', function (e) {
			file.value = null;

			// hide controls
			// and show upload form
			form.classList.add('hidden');
			canvas.classList.add('hidden');
			upload.classList.remove('hidden');

			canvasCropper.clear();

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

			updateFilterOptions();
		});

		/**
		 * When user decides to roll back current filter
		 */
		cancel.addEventListener('click', function () {
			context.putImageData(originalImageData, 0, 0);

			updateFilterOptions();
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
			updateFilterOptions(e.target.value);
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
		 * @param [filterName]
		 */
		function updateFilterOptions(filterName) {
			var filter = filters[filterName];

			options.innerHTML = templates['options'](filter);

			if (filterName) {
				apply.classList.remove('disabled');
				apply.disabled = false;
				cancel.classList.remove('disabled');
				cancel.disabled = false;
			} else {
				apply.classList.add('disabled');
				apply.disabled = true;
				cancel.classList.add('disabled');
				cancel.disabled = true;

				if (form.elements.filterName instanceof NodeList) {
					// if there is more than one filter,
					// uncheck them all
					Array.prototype.forEach.call(form.elements.filterName,
						function (input) {
							input.checked = false;
						});
				} else {
					form.elements.filterName.checked = false;
				}
			}
		}

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
					options[optionName] = form.elements[optionName].value | 0;
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

			// increment loader count
			loader.dataset.waiting = (loader.dataset.waiting | 0) + 1;
			loader.classList.remove('hidden');
		}

		// preparing radio-boxes for filters
		list.innerHTML = templates['filters']({
			filters: filters
		});
	});
