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
	['filters/all', 'templates', 'worker'],
	function (filters, templates, worker) {
		var image = document.getElementById('image'),
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
		 * Variable for saving unsaved filter
		 * @type ImageData
		 */
		var originalImageData;

		worker.addEventListener('message', function (e) {
			context.putImageData(e.data.imageData, e.data.x1, e.data.y1);
		});

		/**
		 * When user selects an image
		 */
		image.addEventListener('change', function (e) {
			var file = e.target.files[0],
				img = document.createElement('img');

			img.addEventListener('load', function () {
				URL.revokeObjectURL(file);

				var w = img.naturalWidth,
					h = img.naturalHeight;

				x1.value = 0;
				y1.value = 0;
				x2.value = x2.max = x1.max = w;
				y2.value = y2.max = y1.max = h;

//				canvas.style.width = w + 'px';
//				canvas.style.height = h + 'px';
				canvas.width = w;
				canvas.height = h;

				context.clearRect(0, 0, w, h);
				context.drawImage(img, 0, 0);

				originalImageData = context.getImageData(0, 0, w, h);

				// hide upload form
				// and show controls
				form.classList.remove('hidden');
				canvas.classList.remove('hidden');
				upload.classList.add('hidden');
			});

			img.src = URL.createObjectURL(file);

			// initial render
			updateFilterOptions();
		});

		/**
		 * When user clicks on unload button
		 */
		unload.addEventListener('click', function (e) {
			image.value = null;

			// hide controls
			// and show upload form
			form.classList.add('hidden');
			canvas.classList.add('hidden');
			upload.classList.remove('hidden');
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
			updateFilterContext();
		});

		/**
		 * @param [filterName]
		 */
		function updateFilterOptions(filterName) {
			var filter = filters[filterName],
				input;

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

				// unselecting filters
				form.elements.filterName.checked = false;

				input = list.querySelector('.active');

				if (input) {
					input.classList.remove('active');
				}
			}
		}

		/**
		 * Update current filter context with selected params
		 */
		function updateFilterContext() {
			var filterName = form.elements.filterName.value,
				filter = filters[filterName],
				options = {};

			// gathering options for filter
			Object.keys(filter.options)
				.forEach(function (optionName) {
					options[optionName] = form.elements[optionName].value | 0;
				});

			worker.postMessage({
				filterName: filterName,
				imageData: context.getImageData(+x1.value, +y1.value, +x2.value, +y2.value),
				options: options,
				x1: x1.value,
				y1: y1.value,
				x2: x2.value,
				y2: y2.value
			});
		}

		/**
		 * When user changes some parameters in the control form
		 */
		form.addEventListener('change', function () {
			if (!form.elements.filterName.value) {
				// don't do anything w/o selected filter
				return;
			}

			// reset context to saved state
			context.putImageData(originalImageData, 0, 0);

			updateFilterContext();
		});

		form.addEventListener('submit', function (e) {
			e.preventDefault();
		});

		/**
		 * Preparing radio-boxes for filters
		 */
		list.innerHTML = templates['filters']({
			filters: filters
		});
	});
